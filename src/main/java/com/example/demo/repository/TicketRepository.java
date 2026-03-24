package com.example.demo.repository;


import com.example.demo.entities.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;



@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t WHERE t.flight.id = :flightId")
    Page<Ticket> findByFlightFlightId(@Param("flightId") Long flightId, Pageable pageable);


    @Query(value = "SELECT t.* FROM Ticket t " +
        "JOIN Flight f ON t.flight_id = f.id " +
        "WHERE f.id = :flightId",
        countQuery = "" +
            "SELECT COUNT(*) FROM Ticket t " +
            "JOIN Flight f ON t.flight_id = f.id " +
            "WHERE f.id = :flightId",
        nativeQuery = true)
    Page<Ticket> findByFlightFlightIdNative(@Param("flightId") Long flightId, Pageable pageable);
}

