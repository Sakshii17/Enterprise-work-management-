package com.sakshi.ewmp.controller;

import com.sakshi.ewmp.entity.Radar;
import com.sakshi.ewmp.service.RadarService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/radars")
public class RadarController {

    private final RadarService radarService;

    public RadarController(RadarService radarService) {
        this.radarService = radarService;
    }

    @PostMapping
    public Radar createRadar(@RequestBody Radar radar) {
        return radarService.createRadar(radar);
    }

    @GetMapping
    public List<Radar> getAllRadars() {
        return radarService.getAllRadars();
    }
    @DeleteMapping("/{id}")
public void deleteRadar(@PathVariable Long id) {
    radarService.deleteRadar(id);
}
}