package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AirportCreateDto {
    @NotBlank(message = "Country is obligatory")
    private String country;
    @NotBlank(message = "City is obligatory")
    private String city;
}
