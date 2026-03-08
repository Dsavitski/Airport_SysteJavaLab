package com.example.demo.dto;

import com.example.demo.Amenities;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AmenityCreateDto {
    private Amenities amenities;
}
