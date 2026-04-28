package com.example.demo.dto;

import com.example.demo.enums.Amenities;
import com.example.demo.enums.FlightStatus;
import com.example.demo.entities.Ticket;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightDisplayDto {
    private Long id;
    private String flightNumber;
    private LocalDate departureDate;
    private LocalDate arrivalDate;
    private Long departureAirportCode;
    private Long arrivalAirportCode;
    private Long airplaneId;
    private FlightStatus status;
    private List<Amenities> amenities;
    private List<Ticket> tickets;
}
