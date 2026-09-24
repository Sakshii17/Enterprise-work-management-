package com.sakshi.ewmp.controller;

import com.sakshi.ewmp.dto.ProductivityReport;
import com.sakshi.ewmp.service.ProductivityService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/productivity")
public class ProductivityController {

    private final ProductivityService productivityService;

    public ProductivityController(ProductivityService productivityService) {
        this.productivityService = productivityService;
    }

    @GetMapping("/{employeeId}")
    public ProductivityReport getReport(
        @PathVariable Long employeeId,
        @RequestParam int year,
        @RequestParam int month
    ) {
        return productivityService.generateReport(employeeId, year, month);
    }
}