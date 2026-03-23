package com.example.demo.mapper;

import com.example.demo.dto.AmenityCreateDto;
import com.example.demo.dto.AmenityDisplayDto;
import com.example.demo.entities.Amenity;
import org.springframework.stereotype.Component;

@Component
public class AmenityMapper {
    public Amenity toEntity(AmenityCreateDto dto) {
        if (dto == null) {
            return null;
        }
        Amenity entity = new Amenity();
        entity.setName(dto.getAmenities());
        return entity;
    }

    public AmenityDisplayDto toDisplayDto(Amenity entity) {
        if (entity == null) {
            return null;
        }
        AmenityDisplayDto dto = new AmenityDisplayDto();
        dto.setId(entity.getId());
        dto.setAmenities(entity.getName());
        return dto;
    }
}
