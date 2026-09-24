package com.sakshi.ewmp.controller;

import com.sakshi.ewmp.dto.EmployeeDashboard;
import com.sakshi.ewmp.dto.ProductivityReport;
import com.sakshi.ewmp.dto.TeamDashboard;
import com.sakshi.ewmp.service.DashboardService;
import org.springframework.web.bind.annotation.*;
import com.sakshi.ewmp.dto.TeamDashboard;
import java.util.List;


@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/employee/{employeeId}")
    public EmployeeDashboard getEmployeeDashboard(@PathVariable Long employeeId) {
        return dashboardService.getEmployeeDashboard(employeeId);
    }

    @GetMapping("/team/{teamId}")
    public TeamDashboard getTeamDashboard(@PathVariable Long teamId) {
        return dashboardService.getTeamDashboard(teamId);
}

@GetMapping("/productivity-summary")
public List<ProductivityReport> getProductivitySummary(
    @RequestParam int year,
    @RequestParam int month
) {
    return dashboardService.getProductivitySummary(year, month);
}
}