package com.example.demo.dto;

import com.example.demo.Amenities;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AmenityCreateDto {
    @NotNull(message = "Amenity is obligatory")
    private Amenities amenities;
}
