package com.example.demo.service;

import com.example.demo.entities.Airport;
import com.example.demo.dto.AirportCreateDto;
import com.example.demo.dto.AirportDisplayDto;
import com.example.demo.mapper.AirportMapper;
import com.example.demo.repository.AirportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AirportService {

    private final AirportRepository airportRepository;
    private final AirportMapper airportMapper;

    public AirportDisplayDto createAirport(AirportCreateDto dto) {
        Airport airport = airportMapper.toEntity(dto);
        Airport savedAirport = airportRepository.save(airport);
        return airportMapper.toDisplayDto(savedAirport);
    }

    public List<AirportDisplayDto> getAllAirports() {
        return airportRepository.findAll().stream()
            .map(airportMapper::toDisplayDto)
            .collect(Collectors.toList());
    }

    public AirportDisplayDto getAirportByCode(Long code) {
        Airport airport = airportRepository.findById(code)
            .orElseThrow(() -> new RuntimeException("Airport not found with code: " + code));
        return airportMapper.toDisplayDto(airport);
    }

    public AirportDisplayDto updateAirport(Long code, AirportCreateDto dto) {
        Airport existingAirport = airportRepository.findById(code)
            .orElseThrow(() -> new RuntimeException("Airport not found with code: " + code));
        existingAirport.setCountry(dto.getCountry());
        existingAirport.setCity(dto.getCity());
        Airport savedAirport = airportRepository.save(existingAirport);
        return airportMapper.toDisplayDto(savedAirport);
    }

    public void deleteAirport(Long code) {
        if (!airportRepository.existsById(code)) {
            throw new RuntimeException("Airport not found with code: " + code);
        }
        airportRepository.deleteById(code);
    }
}