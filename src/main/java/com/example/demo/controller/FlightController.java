package com.example.demo.controller;

import com.example.demo.dto.FlightCreateDto;
import com.example.demo.dto.FlightDisplayDto;
import com.example.demo.service.FlightService;
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
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @PostMapping
    public ResponseEntity<FlightDisplayDto> createFlight(@RequestBody FlightCreateDto dto) {
        FlightDisplayDto createdFlight = flightService.createFlight(dto);
        return new ResponseEntity<>(createdFlight, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FlightDisplayDto>> getAllFlights() {
        List<FlightDisplayDto> flights = flightService.getAllFlights();
        return ResponseEntity.ok(flights);
    }


    @GetMapping("/{id}")
    public ResponseEntity<FlightDisplayDto> getFlightById(@PathVariable Long id) {
        FlightDisplayDto flight = flightService.getFlightById(id);
        return ResponseEntity.ok(flight);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FlightDisplayDto> updateFlight(@PathVariable Long id, @RequestBody FlightCreateDto dto) {
        FlightDisplayDto updatedFlight = flightService.updateFlight(id, dto);
        return ResponseEntity.ok(updatedFlight);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return ResponseEntity.noContent().build();
    }
}