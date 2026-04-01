package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AirplaneCreateDto {
    @NotBlank(message = "Name is obligatory")
    private String name;
    @Positive(message = "Capacity must be positive")
    private int capacity;
}

