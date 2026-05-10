package com.example.demo.dto;

import com.example.demo.enums.FlightStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightCreateDto {

    @NotBlank(message = "FlightNumber is obligatory")
    @Schema(description = "Номер рейса", example = "SU130", required = true)
    private String flightNumber;

    @NotNull(message = "DepartureDate is obligatory")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "Дата отправления рейса", example = "2026-03-26", required = true)
    private LocalDate departureDate;

    @NotNull(message = "ArrivalDate is obligatory")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "Дата прилета", example = "2026-03-26", required = true)
    private LocalDate arrivalDate;

    @NotNull(message = "DepartureAirportCode is obligatory")
    @Schema(description = "ID аэропорта вылета", example = "1", required = true)
    private Long departureAirportCode;

    @NotNull(message = "ArrivalAirportCode is obligatory")
    @Schema(description = "ID аэропорта прилета", example = "2", required = true)
    private Long arrivalAirportCode;

    @NotNull(message = "AirplaneId is obligatory")
    @Schema(description = "ID самолета", example = "1", required = true)
    private Long airplaneId;

    @Schema(description = "Список ID удобств", example = "[1, 2, 3]")
    private List<Long> amenities;

    @NotNull(message = "FlightStatus is obligatory")
    @Schema(description = "Статус рейса",
        allowableValues = {"SCHEDULED", "DELAYED", "CANCELLED", "COMPLETED", "ACTIVE", "DEPARTED", "ARRIVED"})
    private FlightStatus flightStatus;
}