package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketCreateDto {
    @NotBlank(message = "PassportNumber is obligatory")
    private String passportNumber;
    @NotBlank(message = "PassengerName is obligatory")
    private String passengerName;
    @NotBlank(message = "Seat is obligatory")
    private String seat;
    @Positive(message = "Price must be positive")
    private double price;
    @NotNull(message = "FlightId is obligatory")
    private Long flightId;
}
