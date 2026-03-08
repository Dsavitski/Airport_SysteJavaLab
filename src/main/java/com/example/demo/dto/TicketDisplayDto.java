package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketDisplayDto {
    private Long id;
    private String passportNumber;
    private String passengerName;
    private String seat;
    private double price;
    private Long flightId;
}
