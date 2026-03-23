package com.example.demo.repository;

import com.example.demo.entities.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    @Query("select f from Flight f " +
        "join fetch f.tickets")
    List<Flight> findAllWithFetchJoin();

    @Query("SELECT f FROM Flight f WHERE f.flightNumber = :flightNumber AND f.departureDate = :departureDate")
    Optional<Flight> findByFlightNumberAndDepartureDate(@Param("flightNumber") String flightNumber,
                                                        @Param("departureDate") String departureDate);
}
