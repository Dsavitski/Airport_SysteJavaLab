package com.example.demo.service;

import com.example.demo.entities.Amenity;
import com.example.demo.dto.AmenityCreateDto;
import com.example.demo.dto.AmenityDisplayDto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.AmenityMapper;
import com.example.demo.repository.AmenityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@RequiredArgsConstructor
public class AmenityService {

    private final AmenityRepository amenityRepository;
    private final AmenityMapper amenityMapper;

    public AmenityDisplayDto createAmenity(AmenityCreateDto dto) {
        Amenity amenity = amenityMapper.toEntity(dto);
        Amenity savedAmenity = amenityRepository.save(amenity);
        return amenityMapper.toDisplayDto(savedAmenity);
    }

    public List<AmenityDisplayDto> getAllAmenities() {
        return amenityRepository.findAll().stream()
            .map(amenityMapper::toDisplayDto)
            .toList();
    }

    public AmenityDisplayDto getAmenityById(Long id) {
        Amenity amenity = amenityRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Amenity with id " + id + " is not found"));
        return amenityMapper.toDisplayDto(amenity);
    }

    public AmenityDisplayDto updateAmenity(Long id, AmenityCreateDto dto) {
        Amenity existing = amenityRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Amenity with id " + id + " is not found"));
        existing.setName(dto.getAmenities());
        Amenity saved = amenityRepository.save(existing);
        return amenityMapper.toDisplayDto(saved);
    }

    public void deleteAmenity(Long id) {
        if (!amenityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Amenity with id " + id + " is not found");
        }
        amenityRepository.deleteById(id);
    }
}