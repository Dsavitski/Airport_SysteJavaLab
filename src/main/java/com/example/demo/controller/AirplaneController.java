package com.example.demo.controller;

import com.example.demo.dto.AirplaneCreateDto;
import com.example.demo.dto.AirplaneDisplayDto;
import com.example.demo.service.AirplaneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import java.util.List;

@RestController
@RequestMapping("/api/airplanes")
@RequiredArgsConstructor
public class AirplaneController {

    private final AirplaneService airplaneService;

    @PostMapping
    public ResponseEntity<AirplaneDisplayDto> createAirplane(@RequestBody AirplaneCreateDto dto) {
        AirplaneDisplayDto created = airplaneService.createAirplane(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AirplaneDisplayDto>> getAllAirplanes() {
        return ResponseEntity.ok(airplaneService.getAllAirplanes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AirplaneDisplayDto> getAirplaneById(@PathVariable Long id) {
        return ResponseEntity.ok(airplaneService.getAirplaneById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AirplaneDisplayDto> updateAirplane(@PathVariable Long id,
                                                             @RequestBody AirplaneCreateDto dto) {
        return ResponseEntity.ok(airplaneService.updateAirplane(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAirplane(@PathVariable Long id) {
        airplaneService.deleteAirplane(id);
        return ResponseEntity.noContent().build();
    }
}
