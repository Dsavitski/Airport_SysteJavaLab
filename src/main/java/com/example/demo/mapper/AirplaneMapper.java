package com.example.demo.mapper;

import com.example.demo.dto.AirplaneCreateDto;
import com.example.demo.dto.AirplaneDisplayDto;
import com.example.demo.entities.Airplane;
import org.springframework.stereotype.Component;

@Component
public class AirplaneMapper {
    public Airplane toEntity(AirplaneCreateDto dto) {
        if (dto == null) {
            return null;
        }
        Airplane airplane = new Airplane();
        airplane.setName(dto.getName());
        airplane.setCapacity(dto.getCapacity());
        return airplane;
    }

    public AirplaneDisplayDto toDisplayDto(Airplane airplane) {
        if (airplane == null) {
            return null;
        }
        AirplaneDisplayDto dto = new AirplaneDisplayDto();
        dto.setId(airplane.getId());
        dto.setName(airplane.getName());
        dto.setCapacity(airplane.getCapacity());
        return dto;
    }
}
