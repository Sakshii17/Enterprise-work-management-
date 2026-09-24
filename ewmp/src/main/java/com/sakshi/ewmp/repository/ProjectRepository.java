package com.sakshi.ewmp.repository;

import com.sakshi.ewmp.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}