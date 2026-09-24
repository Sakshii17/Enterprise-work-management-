package com.sakshi.ewmp.service;

import com.sakshi.ewmp.dto.EmployeeDashboard;
import com.sakshi.ewmp.dto.ProductivityReport;
import com.sakshi.ewmp.dto.TeamDashboard;
import com.sakshi.ewmp.entity.*;
import com.sakshi.ewmp.repository.DailyWorkLogRepository;
import com.sakshi.ewmp.repository.TaskRepository;
import com.sakshi.ewmp.repository.TeamRepository;
import com.sakshi.ewmp.repository.UserRepository;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

    private final TaskRepository taskRepository;
    private final DailyWorkLogRepository dailyWorkLogRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final ProductivityService productivityService;

    public DashboardService(TaskRepository taskRepository,
                             DailyWorkLogRepository dailyWorkLogRepository,
                             UserRepository userRepository,
                             TeamRepository teamRepository,
                             ProductivityService productivityService) {
        this.taskRepository = taskRepository;
        this.dailyWorkLogRepository = dailyWorkLogRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.productivityService = productivityService;
    }

    public EmployeeDashboard getEmployeeDashboard(Long employeeId) {

        User employee = userRepository.findById(employeeId).orElseThrow(() -> new RuntimeException("User not found"));

        List<Task> allAssignedTasks = taskRepository.findByAssignedUsers_Id(employeeId);

        long pendingCount = allAssignedTasks.stream()
            .filter(t -> t.getStatus() != TaskStatus.COMPLETED && t.getStatus() != TaskStatus.CLOSED)
            .count();

        long completedCount = allAssignedTasks.stream()
            .filter(t -> t.getStatus() == TaskStatus.COMPLETED || t.getStatus() == TaskStatus.CLOSED)
            .count();

        LocalDate today = LocalDate.now();
        List<DailyWorkLog> todaysLogs = dailyWorkLogRepository.findByEmployeeIdAndDate(employeeId, today);

        double hoursToday = todaysLogs.stream()
            .mapToDouble(DailyWorkLog::getWorkedHours)
            .sum();

        int year = today.getYear();
        int month = today.getMonthValue();

        EmployeeDashboard dashboard = new EmployeeDashboard();
        dashboard.setEmployeeName(employee.getName());
        dashboard.setTodaysTasks(allAssignedTasks);
        dashboard.setPendingTasksCount(pendingCount);
        dashboard.setCompletedTasksCount(completedCount);
        dashboard.setHoursWorkedToday(hoursToday);
        dashboard.setMonthlyProductivity(productivityService.generateReport(employeeId, year, month));

        return dashboard;
    }

    public TeamDashboard getTeamDashboard(Long teamId) {

        Team team = teamRepository.findById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));

        List<Task> teamTasks = taskRepository.findByProject_Team_Id(teamId);

        long totalTasks = teamTasks.size();

        long pendingTasks = teamTasks.stream()
            .filter(t -> t.getStatus() != TaskStatus.COMPLETED && t.getStatus() != TaskStatus.CLOSED)
            .count();

        long completedTasks = teamTasks.stream()
            .filter(t -> t.getStatus() == TaskStatus.COMPLETED || t.getStatus() == TaskStatus.CLOSED)
            .count();

        LocalDate today = LocalDate.now();
        long overdueTasks = teamTasks.stream()
            .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(today))
            .filter(t -> t.getStatus() != TaskStatus.COMPLETED && t.getStatus() != TaskStatus.CLOSED)
            .count();

        List<String> memberNames = teamTasks.stream()
            .flatMap(t -> t.getAssignedUsers().stream())
            .map(User::getName)
            .distinct()
            .toList();

        TeamDashboard dashboard = new TeamDashboard();
        dashboard.setTeamName(team.getTeamName());
        dashboard.setTeamLeadName(team.getTeamLead() != null ? team.getTeamLead().getName() : null);
        dashboard.setManagerName(team.getManager() != null ? team.getManager().getName() : null);
        dashboard.setTotalTasks(totalTasks);
        dashboard.setPendingTasks(pendingTasks);
        dashboard.setCompletedTasks(completedTasks);
        dashboard.setOverdueTasks(overdueTasks);
        dashboard.setMemberNames(memberNames);
         return dashboard;
    }
        
        public List<ProductivityReport> getProductivitySummary(int year, int month) {
    List<User> allUsers = userRepository.findAll();
    return allUsers.stream()
        .map(u -> productivityService.generateReport(u.getId(), year, month))
        .toList();


       
    }
}