package com.example.demo.service;

import com.example.demo.entities.Airplane;
import com.example.demo.dto.AirplaneCreateDto;
import com.example.demo.dto.AirplaneDisplayDto;
import com.example.demo.mapper.AirplaneMapper;
import com.example.demo.repository.AirplaneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
            .collect(Collectors.toList());
    }

    public AirplaneDisplayDto getAirplaneById(Long id) {
        Airplane airplane = airplaneRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Airplane not found with id: " + id));
        return airplaneMapper.toDisplayDto(airplane);
    }

    public AirplaneDisplayDto updateAirplane(Long id, AirplaneCreateDto dto) {
        Airplane existingAirplane = airplaneRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Airplane not found with id: " + id));
        existingAirplane.setName(dto.getName());
        existingAirplane.setCapacity(dto.getCapacity());
        Airplane savedAirplane = airplaneRepository.save(existingAirplane);
        return airplaneMapper.toDisplayDto(savedAirplane);
    }
    
    public void deleteAirplane(Long id) {
        if (!airplaneRepository.existsById(id)) {
            throw new RuntimeException("Airplane not found with id: " + id);
        }
        airplaneRepository.deleteById(id);
    }
}