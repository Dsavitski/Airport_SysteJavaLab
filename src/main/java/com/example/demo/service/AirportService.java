package com.example.demo.service;

import com.example.demo.entities.Airport;
import com.example.demo.dto.AirportCreateDto;
import com.example.demo.dto.AirportDisplayDto;
import com.example.demo.mapper.AirportMapper;
import com.example.demo.repository.AirportRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

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


    @Transactional
    public List<AirportDisplayDto> createAirportsTransactional(List<AirportCreateDto> dtos) {
        List<AirportDisplayDto> results = new ArrayList<>();
        System.out.println("Starting transaction...");
        for (int i = 0; i < dtos.size(); i++) {
            AirportCreateDto dto = dtos.get(i);


            if (i == 1) {
                throw new ResponseStatusException(HttpStatus
                    .INTERNAL_SERVER_ERROR, "Amenity not found");
            }


            Airport airport = airportMapper.toEntity(dto);
            Airport savedAirport = airportRepository.saveAndFlush(airport);
            results.add(airportMapper.toDisplayDto(savedAirport));
        }

        return results;
    }

    public List<AirportDisplayDto> createAirportsNoTransaction(List<AirportCreateDto> dtos) {
        List<AirportDisplayDto> results = new ArrayList<>();

        for (int i = 0; i < dtos.size(); i++) {
            AirportCreateDto dto = dtos.get(i);


            if (i == 1) {
                throw new ResponseStatusException(HttpStatus
                    .INTERNAL_SERVER_ERROR, "Amenity not found");
            }

            Airport airport = airportMapper.toEntity(dto);
            Airport savedAirport = airportRepository.save(airport);
            results.add(airportMapper.toDisplayDto(savedAirport));
        }

        return results;
    }

    public List<AirportDisplayDto> getAllAirports() {
        return airportRepository.findAll().stream()
            .map(airportMapper::toDisplayDto)
            .toList();
    }

    public AirportDisplayDto getAirportByCode(Long code) {
        Airport airport = airportRepository.findById(code)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Airport not found"));
        return airportMapper.toDisplayDto(airport);
    }

    public AirportDisplayDto updateAirport(Long code, AirportCreateDto dto) {
        Airport existingAirport = airportRepository.findById(code)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Airport not found"));
        existingAirport.setCountry(dto.getCountry());
        existingAirport.setCity(dto.getCity());
        Airport savedAirport = airportRepository.save(existingAirport);
        return airportMapper.toDisplayDto(savedAirport);
    }

    public void deleteAirport(Long code) {
        if (!airportRepository.existsById(code)) {
            throw new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Airport not found");
        }
        airportRepository.deleteById(code);
    }
}