package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AirportCreateDto {
    @NotBlank(message = "Country is obligatory")
    @Schema(description = "Страна аэропорта", example = "Belarus", required = true)
    private String country;
    @NotBlank(message = "City is obligatory")
    @Schema(description = "Город аэропорта", example = "Vitebsk", required = true)
    private String city;
}
