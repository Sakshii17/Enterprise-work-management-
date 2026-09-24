package com.sakshi.ewmp.service;

import com.sakshi.ewmp.entity.LeaveRequest;
import com.sakshi.ewmp.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
    }

    public LeaveRequest createLeave(LeaveRequest leave) {
        return leaveRequestRepository.save(leave);
    }

    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestRepository.findAll();
    }
    public void deleteLeave(Long id) {
    leaveRequestRepository.deleteById(id);
}
}