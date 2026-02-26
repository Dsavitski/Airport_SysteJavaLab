package com.example.demo.repository;


import com.example.demo.entities.Flight;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public class FlightRepository {

    private final List<Flight> flights = List.of(
        new Flight(1L, "1", "Minsk", "Arrived"),
        new Flight(2L, "2", "Vitebsk", "On time"),
        new Flight(3L, "3", "Brest", "Delayed")
    );


    public Optional<Flight> findById(Long id) {
        return flights.stream().filter(f -> f.getId().equals(id))
            .findFirst();
    }

    public List<Flight> findAll() {
        return flights;
    }
}
