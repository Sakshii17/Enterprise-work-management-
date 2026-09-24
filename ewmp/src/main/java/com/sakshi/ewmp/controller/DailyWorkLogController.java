package com.sakshi.ewmp.controller;

import com.sakshi.ewmp.entity.DailyWorkLog;
import com.sakshi.ewmp.service.DailyWorkLogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/worklogs")
public class DailyWorkLogController {

    private final DailyWorkLogService dailyWorkLogService;

    public DailyWorkLogController(DailyWorkLogService dailyWorkLogService) {
        this.dailyWorkLogService = dailyWorkLogService;
    }

    @PostMapping
    public DailyWorkLog createLog(@RequestBody DailyWorkLog log) {
        return dailyWorkLogService.createLog(log);
    }

    @GetMapping
    public List<DailyWorkLog> getAllLogs() {
        return dailyWorkLogService.getAllLogs();
    }

    @DeleteMapping("/{id}")
    public void deleteLog(@PathVariable Long id) {
    dailyWorkLogService.deleteLog(id);
}
}