package com.sakshi.ewmp.repository;

import com.sakshi.ewmp.entity.DailyWorkLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DailyWorkLogRepository extends JpaRepository<DailyWorkLog, Long> {

    List<DailyWorkLog> findByEmployeeIdAndDateBetween(Long employeeId, LocalDate startDate, LocalDate endDate);
    List<DailyWorkLog> findByEmployeeIdAndDate(Long employeeId, java.time.LocalDate date);
}