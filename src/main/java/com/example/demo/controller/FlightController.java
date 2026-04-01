package com.example.demo.controller;

import com.example.demo.dto.FlightCreateDto;
import com.example.demo.dto.FlightDisplayDto;
import com.example.demo.entities.Flight;
import com.example.demo.mapper.FlightMapper;
import com.example.demo.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;
    private final FlightMapper flightMapper;

    @PostMapping
    public ResponseEntity<FlightDisplayDto> createFlight(@Valid @RequestBody FlightCreateDto dto) {
        FlightDisplayDto createdFlight = flightService.createFlight(dto);
        return new ResponseEntity<>(createdFlight, HttpStatus.CREATED);
    }

    @GetMapping("/joinfetch")
    public ResponseEntity<List<FlightDisplayDto>> getAllFlightsWithJoinFetch() {
        List<Flight> flights = flightService.getAllFlightsWithJoinFetch();
        List<FlightDisplayDto> dtos = flights.stream()
            .map(flightMapper::toDisplayDTO)
            .toList();
        return ResponseEntity.ok(dtos);
    }


    @GetMapping
    public ResponseEntity<List<FlightDisplayDto>> getAllFlights() {
        List<FlightDisplayDto> flights = flightService.getAllFlights();
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/search")
    public ResponseEntity<FlightDisplayDto> getFlightByNumberAndDepartureDate(
        @RequestParam String flightNumber,
        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate departureDate,
        @RequestParam String passportNumber) {
        FlightDisplayDto flightDto = flightService.findByFlightNumberAndDepartureDate(flightNumber,
            departureDate, passportNumber);
        return ResponseEntity.ok(flightDto);
    }

    @GetMapping("/search/native")
    public ResponseEntity<FlightDisplayDto> getFlightByNumberAndDepartureDateNative(
        @RequestParam String flightNumber,
        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate departureDate,
        @RequestParam String passportNumber) {
        FlightDisplayDto flightDto = flightService.findFlightByDetailsAndPassportNative(flightNumber,
            departureDate, passportNumber);
        return ResponseEntity.ok(flightDto);
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