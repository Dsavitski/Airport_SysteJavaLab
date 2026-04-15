package com.example.demo.service;

import com.example.demo.Amenities;
import com.example.demo.entities.Amenity;
import com.example.demo.dto.AmenityCreateDto;
import com.example.demo.dto.AmenityDisplayDto;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.AmenityMapper;
import com.example.demo.repository.AmenityRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@RequiredArgsConstructor
public class AmenityService {

    private final AmenityRepository amenityRepository;
    private final AmenityMapper amenityMapper;
    private static final Logger LOG = LoggerFactory.getLogger(AmenityService.class);

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

    @Transactional
    public List<AmenityDisplayDto> createAmenitiesBulkTransactional(List<AmenityCreateDto> dtos) {
        LOG.info("Start transaction...");
        return dtos.stream()
            .map(dto -> {
                if (dto == null) {
                    throw new ResourceNotFoundException("DTO is null");
                }
                if (Amenities.ERRORNAME.equals(dto.getAmenities())) {
                    throw new BadRequestException("Simulated error in transactional method");
                }
                Amenity amenity = amenityMapper.toEntity(dto);
                Amenity savedAmenity = amenityRepository.save(amenity);
                return amenityMapper.toDisplayDto(savedAmenity);
            })
            .toList();
    }

    public List<AmenityDisplayDto> createAmenitiesBulkWithoutTransaction(List<AmenityCreateDto> dtos) {
        LOG.info("Start non-transactional batch...");
        return dtos.stream()
            .map(dto -> {
                if (dto == null) {
                    throw new ResourceNotFoundException("DTO is null");
                }
                if (Amenities.ERRORNAME.equals(dto.getAmenities())) {
                    throw new BadRequestException("Simulated error in non-transactional method");
                }
                Amenity amenity = amenityMapper.toEntity(dto);
                Amenity savedAmenity = amenityRepository.save(amenity);
                return amenityMapper.toDisplayDto(savedAmenity);
            })
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