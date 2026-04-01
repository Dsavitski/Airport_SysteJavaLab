package com.example.demo.dto;

import com.example.demo.FlightStatus;
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
    private String flightNumber;
    @NotNull(message = "DepartureDate is obligatory")
    private LocalDate departureDate;
    @NotNull(message = "ArrivalDate is obligatory")
    private LocalDate arrivalDate;
    @NotNull(message = "DepartureAirportCode is obligatory")
    private Long departureAirportCode;
    @NotNull(message = "ArrivalAirportCode is obligatory")
    private Long arrivalAirportCode;
    @NotNull(message = "AirplaneId is obligatory")
    private Long airplaneId;

    private List<Long> amenities;

    @NotNull(message = "FlightStatus is obligatory")
    @Schema(description = "Status of the flight", allowableValues = {"SCHEDULED", "DELAYED", "CANCELLED", "COMPLETED"})
    private FlightStatus flightStatus;
}
