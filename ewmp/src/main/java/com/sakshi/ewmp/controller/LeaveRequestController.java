package com.sakshi.ewmp.controller;

import com.sakshi.ewmp.entity.LeaveRequest;
import com.sakshi.ewmp.service.LeaveRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping
    public LeaveRequest createLeave(@RequestBody LeaveRequest leave) {
        return leaveRequestService.createLeave(leave);
    }

    @GetMapping
    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestService.getAllLeaves();
    }

    @DeleteMapping("/{id}")
public void deleteLeave(@PathVariable Long id) {
    leaveRequestService.deleteLeave(id);
}
}