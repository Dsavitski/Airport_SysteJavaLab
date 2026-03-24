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

    @Query("SELECT f FROM Flight f JOIN f.tickets t WHERE f.flightNumber = :flightNumber AND f.departureDate = :departureDate AND t.passportNumber = :passportNumber")
    Optional<Flight> findFlightByDetailsAndPassport(@Param("flightNumber") String flightNumber,
                                                    @Param("departureDate") String departureDate,
                                                    @Param("passportNumber") String passportNumber);

    @Query(value = "SELECT f.* FROM Flight f " +
        "JOIN Ticket t ON f.id = t.flight_id " +
        "WHERE f.flight_number = :flightNumber " +
        "AND f.departure_date = :departureDate " +
        "AND t.passport_number = :passportNumber", nativeQuery = true)
    Optional<Flight> findFlightByDetailsAndPassportNative(@Param("flightNumber") String flightNumber,
                                                    @Param("departureDate") String departureDate,
                                                    @Param("passportNumber") String passportNumber);
}
