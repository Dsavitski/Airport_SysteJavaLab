package com.example.demo.dto;

import com.example.demo.enums.Amenities;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AmenityCreateDto {
    @NotNull(message = "Amenity is obligatory")
    @Schema(description = "Услуга", example = "WI-FI", required = true)
    private Amenities amenities;
}
