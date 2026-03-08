package com.example.demo.controller;

import com.example.demo.dto.AirportCreateDto;
import com.example.demo.dto.AirportDisplayDto;
import com.example.demo.service.AirportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
@RequiredArgsConstructor
public class AirportController {

    private final AirportService airportService;

    @PostMapping
    public ResponseEntity<AirportDisplayDto> createAirport(@RequestBody AirportCreateDto dto) {
        AirportDisplayDto created = airportService.createAirport(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AirportDisplayDto>> getAllAirports() {
        return ResponseEntity.ok(airportService.getAllAirports());
    }

    @GetMapping("/{code}")
    public ResponseEntity<AirportDisplayDto> getAirportByCode(@PathVariable Long code) {
        return ResponseEntity.ok(airportService.getAirportByCode(code));
    }

    @PutMapping("/{code}")
    public ResponseEntity<AirportDisplayDto> updateAirport(@PathVariable Long code, @RequestBody AirportCreateDto dto) {
        return ResponseEntity.ok(airportService.updateAirport(code, dto));
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteAirport(@PathVariable Long code) {
        airportService.deleteAirport(code);
        return ResponseEntity.noContent().build();
    }
}