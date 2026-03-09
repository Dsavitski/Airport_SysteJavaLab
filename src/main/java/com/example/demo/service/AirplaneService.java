package com.example.demo.service;

import com.example.demo.entities.Airplane;
import com.example.demo.dto.AirplaneCreateDto;
import com.example.demo.dto.AirplaneDisplayDto;
import com.example.demo.mapper.AirplaneMapper;
import com.example.demo.repository.AirplaneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@Service
@RequiredArgsConstructor
public class AirplaneService {

    private final AirplaneRepository airplaneRepository;
    private final AirplaneMapper airplaneMapper;


    public AirplaneDisplayDto createAirplane(AirplaneCreateDto dto) {
        Airplane airplane = airplaneMapper.toEntity(dto);
        Airplane savedAirplane = airplaneRepository.save(airplane);
        return airplaneMapper.toDisplayDto(savedAirplane);
    }

    public List<AirplaneDisplayDto> getAllAirplanes() {
        return airplaneRepository.findAll().stream()
            .map(airplaneMapper::toDisplayDto)
            .toList();
    }

    public AirplaneDisplayDto getAirplaneById(Long id) {
        Airplane airplane = airplaneRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Airplane not found"));
        return airplaneMapper.toDisplayDto(airplane);
    }

    public AirplaneDisplayDto updateAirplane(Long id, AirplaneCreateDto dto) {
        Airplane existingAirplane = airplaneRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Airplane not found"));
        existingAirplane.setName(dto.getName());
        existingAirplane.setCapacity(dto.getCapacity());
        Airplane savedAirplane = airplaneRepository.save(existingAirplane);
        return airplaneMapper.toDisplayDto(savedAirplane);
    }
    
    public void deleteAirplane(Long id) {
        if (!airplaneRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus
                .NOT_FOUND, "User not found");
        }
        airplaneRepository.deleteById(id);
    }
}