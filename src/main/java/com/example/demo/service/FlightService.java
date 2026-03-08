package com.example.demo.service;

import com.example.demo.dto.FlightCreateDto;
import com.example.demo.dto.FlightDisplayDto;
import com.example.demo.entities.Flight;
import com.example.demo.mapper.FlightMapper;
import com.example.demo.repository.FlightRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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


    public List<FlightDisplayDto> getAllFlights() {
        return flightRepository.findAll().stream()
            .map(flightMapper::toDisplayDTO)
            .collect(Collectors.toList());
    }

    


    public FlightDisplayDto getFlightById(Long id) {
        Flight flight = flightRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));
        return flightMapper.toDisplayDTO(flight);
    }

    public FlightDisplayDto updateFlight(Long id, FlightCreateDto dto) {
        Flight existingFlight = flightRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));
        Flight updatedFlight = flightMapper.toEntity(dto);
        updatedFlight.setId(existingFlight.getId());
        Flight savedFlight = flightRepository.save(updatedFlight);
        return flightMapper.toDisplayDTO(savedFlight);
    }

    public void deleteFlight(Long id) {
        if (!flightRepository.existsById(id)) {
            throw new RuntimeException("Flight not found with id: " + id);
        }
        flightRepository.deleteById(id);
    }
}

