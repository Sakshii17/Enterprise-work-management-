package com.sakshi.ewmp.service;

import com.sakshi.ewmp.entity.Radar;
import com.sakshi.ewmp.repository.RadarRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RadarService {

    private final RadarRepository radarRepository;

    public RadarService(RadarRepository radarRepository) {
        this.radarRepository = radarRepository;
    }

    public Radar createRadar(Radar radar) {
        return radarRepository.save(radar);
    }

    public List<Radar> getAllRadars() {
        return radarRepository.findAll();
    }
    public void deleteRadar(Long id) {
    radarRepository.deleteById(id);
}
}