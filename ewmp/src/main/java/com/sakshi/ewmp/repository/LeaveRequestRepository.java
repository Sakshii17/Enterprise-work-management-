package com.sakshi.ewmp.repository;

import com.sakshi.ewmp.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByEmployeeIdAndLeaveDateBetweenAndStatus(
        Long employeeId, LocalDate startDate, LocalDate endDate, com.sakshi.ewmp.entity.LeaveStatus status
    );
}