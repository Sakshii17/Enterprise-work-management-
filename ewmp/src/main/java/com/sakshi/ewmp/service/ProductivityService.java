package com.sakshi.ewmp.service;

import com.sakshi.ewmp.dto.ProductivityReport;
import com.sakshi.ewmp.entity.DailyWorkLog;
import com.sakshi.ewmp.entity.LeaveStatus;
import com.sakshi.ewmp.entity.User;
import com.sakshi.ewmp.repository.DailyWorkLogRepository;
import com.sakshi.ewmp.repository.LeaveRequestRepository;
import com.sakshi.ewmp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class ProductivityService {

    private final DailyWorkLogRepository dailyWorkLogRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;

    private static final double HOURS_PER_DAY = 9.0;

    public ProductivityService(DailyWorkLogRepository dailyWorkLogRepository,
                                LeaveRequestRepository leaveRequestRepository,
                                UserRepository userRepository) {
        this.dailyWorkLogRepository = dailyWorkLogRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.userRepository = userRepository;
    }

    public ProductivityReport generateReport(Long employeeId, int year, int month) {

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        // Count weekdays (Mon-Fri) in the month
        int workingDays = 0;
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            DayOfWeek day = date.getDayOfWeek();
            if (day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY) {
                workingDays++;
            }
        }

        // Get approved leave days in this range
        List<?> leaves = leaveRequestRepository.findByEmployeeIdAndLeaveDateBetweenAndStatus(
            employeeId, startDate, endDate, LeaveStatus.APPROVED
        );
        int leaveDays = leaves.size();

        // Effective working days = weekdays minus approved leave days
        int effectiveWorkingDays = workingDays - leaveDays;
        double expectedHours = effectiveWorkingDays * HOURS_PER_DAY;

        // Sum actual worked hours from Daily Work Log
        List<DailyWorkLog> logs = dailyWorkLogRepository.findByEmployeeIdAndDateBetween(
            employeeId, startDate, endDate
        );
        double actualHours = logs.stream()
            .mapToDouble(DailyWorkLog::getWorkedHours)
            .sum();

        double difference = actualHours - expectedHours;
        double attendancePercentage = expectedHours == 0 ? 0 : (actualHours / expectedHours) * 100;

        User employee = userRepository.findById(employeeId).orElse(null);

        ProductivityReport report = new ProductivityReport();
        report.setEmployeeId(employeeId);
        report.setEmployeeName(employee != null ? employee.getName() : "Unknown");
        report.setYear(year);
        report.setMonth(month);
        report.setWorkingDays(effectiveWorkingDays);
        report.setLeaveDays(leaveDays);
        report.setExpectedHours(expectedHours);
        report.setActualHours(actualHours);
        report.setDifference(difference);
        report.setAttendancePercentage(Math.round(attendancePercentage * 100.0) / 100.0);

        return report;
    }
}