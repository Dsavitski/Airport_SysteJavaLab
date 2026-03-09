package com.example.demo.repository;

import com.example.demo.entities.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    @Query("select f from Flight f " +
        "join fetch f.departureAirportCode " +
        "join fetch f.arrivalAirportCode " +
        "join fetch f.airplaneId")
    List<Flight> findAllWithFetchJoin();
}
