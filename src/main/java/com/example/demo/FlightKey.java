package com.example.demo;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Objects;

@Getter
@AllArgsConstructor
public final class FlightKey {
    String  flightNumber;
    String  departureDate;

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
            Objects.equals(departureDate, flightKey.departureDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(flightNumber, departureDate);
    }
}
