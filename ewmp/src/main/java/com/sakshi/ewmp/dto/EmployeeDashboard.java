package com.sakshi.ewmp.dto;

import com.sakshi.ewmp.entity.Task;
import java.util.List;

public class EmployeeDashboard {

    private String employeeName;
    private List<Task> todaysTasks;
    private long pendingTasksCount;
    private long completedTasksCount;
    private double hoursWorkedToday;
    private ProductivityReport monthlyProductivity;

    public EmployeeDashboard() {
    }

    // Getters and Setters
    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public List<Task> getTodaysTasks() {
        return todaysTasks;
    }

    public void setTodaysTasks(List<Task> todaysTasks) {
        this.todaysTasks = todaysTasks;
    }

    public long getPendingTasksCount() {
        return pendingTasksCount;
    }

    public void setPendingTasksCount(long pendingTasksCount) {
        this.pendingTasksCount = pendingTasksCount;
    }

    public long getCompletedTasksCount() {
        return completedTasksCount;
    }

    public void setCompletedTasksCount(long completedTasksCount) {
        this.completedTasksCount = completedTasksCount;
    }

    public double getHoursWorkedToday() {
        return hoursWorkedToday;
    }

    public void setHoursWorkedToday(double hoursWorkedToday) {
        this.hoursWorkedToday = hoursWorkedToday;
    }

    public ProductivityReport getMonthlyProductivity() {
        return monthlyProductivity;
    }

    public void setMonthlyProductivity(ProductivityReport monthlyProductivity) {
        this.monthlyProductivity = monthlyProductivity;
    }
}