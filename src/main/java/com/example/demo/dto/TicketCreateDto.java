package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
    @Schema(description = "Номер паспорта", example = "BM2746542", required = true)
    private String passportNumber;
    @NotBlank(message = "PassengerName is obligatory")
    @Schema(description = "Имя пассажира", example = "Иван Иванов", required = true)
    private String passengerName;
    @Schema(description = "Номер места", example = "A39", required = true)
    @NotBlank(message = "Seat is obligatory")
    private String seat;
    @Schema(description = "Цена", example = "109.3", required = true)
    @Positive(message = "Price must be positive")
    private double price;
    @Schema(description = "Номер рейса", example = "1", required = true)
    @NotNull(message = "FlightId is obligatory")
    private Long flightId;
}
