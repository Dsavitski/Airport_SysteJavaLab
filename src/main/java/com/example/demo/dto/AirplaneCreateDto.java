package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
    @Schema(description = "Название самолета", example = "BOING-747", required = true)
    private String name;
    @Positive(message = "Capacity must be positive")
    @Schema(description = "Вместимость самолета", example = "100", required = true)
    private int capacity;
}

