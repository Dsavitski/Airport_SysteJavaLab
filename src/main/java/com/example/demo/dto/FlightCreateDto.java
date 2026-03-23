package com.example.demo.dto;

import com.example.demo.FlightStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightCreateDto {
    private String flightNumber;
    private String departureDate;
    private String arrivalDate;
    private Long departureAirportCode;
    private Long arrivalAirportCode;
    private Long airplaneId;
    private List<Long> amenities;
    @Schema(description = "Status of the flight", allowableValues = {"SCHEDULED", "DELAYED", "CANCELLED", "COMPLETED"})
    private FlightStatus flightStatus;
}
