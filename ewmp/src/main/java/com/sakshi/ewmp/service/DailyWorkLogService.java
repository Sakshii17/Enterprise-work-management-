package com.sakshi.ewmp.service;

import com.sakshi.ewmp.entity.DailyWorkLog;
import com.sakshi.ewmp.repository.DailyWorkLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DailyWorkLogService {

    private final DailyWorkLogRepository dailyWorkLogRepository;

    public DailyWorkLogService(DailyWorkLogRepository dailyWorkLogRepository) {
        this.dailyWorkLogRepository = dailyWorkLogRepository;
    }

    public DailyWorkLog createLog(DailyWorkLog log) {
        return dailyWorkLogRepository.save(log);
    }

    public List<DailyWorkLog> getAllLogs() {
        return dailyWorkLogRepository.findAll();
    }
    public void deleteLog(Long id) {
    dailyWorkLogRepository.deleteById(id);
}
}