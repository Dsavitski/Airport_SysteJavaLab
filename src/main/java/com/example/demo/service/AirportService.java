package com.example.demo.service;

import com.example.demo.entities.Airport;
import com.example.demo.dto.AirportCreateDto;
import com.example.demo.dto.AirportDisplayDto;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.AirportMapper;
import com.example.demo.repository.AirportRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AirportService {

    private final AirportRepository airportRepository;
    private final AirportMapper airportMapper;
    private static final Logger LOG = LoggerFactory.getLogger(AirportService.class);
    public AirportDisplayDto createAirport(AirportCreateDto dto) {
        Airport airport = airportMapper.toEntity(dto);
        Airport savedAirport = airportRepository.save(airport);
        return airportMapper.toDisplayDto(savedAirport);
    }

    @Transactional
    public List<AirportDisplayDto> createAirportsBulkTransactinal(List<AirportCreateDto> dtos) {
        LOG.info("Start transaction...");
        return dtos.stream()
            .map(dto -> {
                if (dto == null) {
                    throw new ResourceNotFoundException("DTO is null");
                }
                if ("ErrorCity".equals(dto.getCity())) {
                    throw new BadRequestException("Simulated error in transactional method");
                }
                Airport airport = airportMapper.toEntity(dto);
                Airport savedAirport = airportRepository.save(airport);
                return airportMapper.toDisplayDto(savedAirport);
            })
            .toList();
    }

    public List<AirportDisplayDto> createAirportsBulk(List<AirportCreateDto> dtos) {
        return dtos.stream()
            .map(dto -> {
                if (dto == null) {
                    throw new ResourceNotFoundException("DTO is null");
                }
                if ("ErrorCity".equals(dto.getCity())) {
                    throw new BadRequestException("Simulated error in non-transactional method");
                }
                Airport airport = airportMapper.toEntity(dto);
                Airport savedAirport = airportRepository.save(airport);
                return airportMapper.toDisplayDto(savedAirport);
            })
            .toList();
    }



    public List<AirportDisplayDto> getAllAirports() {
        return airportRepository.findAll().stream()
            .map(airportMapper::toDisplayDto)
            .toList();
    }

    public AirportDisplayDto getAirportByCode(Long code) {
        Airport airport = airportRepository.findById(code)
            .orElseThrow(() -> new ResourceNotFoundException("Airport with code " + code + " is not found"));
        return airportMapper.toDisplayDto(airport);
    }

    public AirportDisplayDto updateAirport(Long code, AirportCreateDto dto) {
        Airport existingAirport = airportRepository.findById(code)
            .orElseThrow(() -> new ResourceNotFoundException("Airport with code " + code + " is not found"));
        existingAirport.setCountry(dto.getCountry());
        existingAirport.setCity(dto.getCity());
        Airport savedAirport = airportRepository.save(existingAirport);
        return airportMapper.toDisplayDto(savedAirport);
    }

    public void deleteAirport(Long code) {
        if (!airportRepository.existsById(code)) {
            throw new ResourceNotFoundException("Airport with code " + code + " is not found");
        }
        airportRepository.deleteById(code);
    }
}