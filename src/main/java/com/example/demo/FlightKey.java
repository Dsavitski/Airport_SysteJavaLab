package com.example.demo;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.Objects;

@Getter
@AllArgsConstructor
public final class FlightKey {
    private String  flightNumber;
    private final LocalDate departureDate;
    private String  passportNumber;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FlightKey flightKey = (FlightKey) o;
        return Objects.equals(flightNumber, flightKey.flightNumber) &&
            Objects.equals(departureDate, flightKey.departureDate) &&
            Objects.equals(passportNumber, flightKey.passportNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(flightNumber, departureDate, passportNumber);
    }
}
