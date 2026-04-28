package com.example.demo.dto;

import com.example.demo.enums.FlightStatus;
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
    @Schema(description = "Номер рейса", example = "su-130", required = true)
    private String flightNumber;
    @NotNull(message = "DepartureDate is obligatory")
    @Schema(description = "Дата отправления рейса ", example = "2026-03-26", required = true)
    private LocalDate departureDate;
    @NotNull(message = "ArrivalDate is obligatory")
    @Schema(description = "Дата прилета", example = "2026-03-26", required = true)
    private LocalDate arrivalDate;
    @NotNull(message = "DepartureAirportCode is obligatory")
    @Schema(description = "Id аэропорта вылета", example = "1", required = true)
    private Long departureAirportCode;
    @NotNull(message = "ArrivalAirportCode is obligatory")
    @Schema(description = "Id аэропорта прилета ", example = "1", required = true)
    private Long arrivalAirportCode;
    @NotNull(message = "AirplaneId is obligatory")
    @Schema(description = "Id самолета ", example = "1", required = true)
    private Long airplaneId;

    @Schema(description = "Id услуг", example = "1,2", required = true)
    private List<Long> amenities;

    @NotNull(message = "FlightStatus is obligatory")
    @Schema(description = "Status of the flight", allowableValues = {"SCHEDULED", "DELAYED", "CANCELLED", "COMPLETED"})
    private FlightStatus flightStatus;
}
