package com.sakshi.ewmp.repository;
import java.util.*;
import com.sakshi.ewmp.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedUsers_Id(Long userId);
    List<Task> findByProject_Team_Id(Long teamId);
}