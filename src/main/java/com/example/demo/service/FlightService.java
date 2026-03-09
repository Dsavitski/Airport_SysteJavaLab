package com.example.demo.service;

import com.example.demo.dto.FlightCreateDto;
import com.example.demo.dto.FlightDisplayDto;
import com.example.demo.entities.Flight;
import com.example.demo.mapper.FlightMapper;
import com.example.demo.repository.FlightRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;
    private final FlightMapper flightMapper;

    public FlightDisplayDto createFlight(FlightCreateDto dto) {
        Flight flight = flightMapper.toEntity(dto);
        Flight savedFlight = flightRepository.save(flight);
        return flightMapper.toDisplayDTO(savedFlight);
    }

    public List<Flight> getAllFlightsWithJoinFetch() {
        return flightRepository.findAllWithFetchJoin();
    }


    public List<FlightDisplayDto> getAllFlights() {
        return flightRepository.findAll().stream()
            .map(flightMapper::toDisplayDTO)
            .toList();
    }


    


    public FlightDisplayDto getFlightById(Long id) {
        Flight flight = flightRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Flight not found"));
        return flightMapper.toDisplayDTO(flight);
    }

    public FlightDisplayDto updateFlight(Long id, FlightCreateDto dto) {
        Flight existingFlight = flightRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Flight not found"));
        Flight updatedFlight = flightMapper.toEntity(dto);
        updatedFlight.setId(existingFlight.getId());
        Flight savedFlight = flightRepository.save(updatedFlight);
        return flightMapper.toDisplayDTO(savedFlight);
    }

    public void deleteFlight(Long id) {
        if (!flightRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Flight not found");
        }
        flightRepository.deleteById(id);
    }
}

