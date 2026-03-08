package com.example.demo.mapper;

import com.example.demo.dto.AirportCreateDto;
import com.example.demo.dto.AirportDisplayDto;
import com.example.demo.entities.Airport;
import org.springframework.stereotype.Component;

@Component
public class AirportMapper {
    public Airport toEntity(AirportCreateDto dto) {
        if (dto == null) {
            return null;
        }
        Airport airport = new Airport();
        airport.setCountry(dto.getCountry());
        airport.setCity(dto.getCity());
        return airport;
    }

    public AirportDisplayDto toDisplayDto(Airport airport) {
        if (airport == null) {
            return null;
        }
        AirportDisplayDto dto = new AirportDisplayDto();
        dto.setId(airport.getId());
        dto.setCountry(airport.getCountry());
        dto.setCity(airport.getCity());
        return dto;
    }
}
