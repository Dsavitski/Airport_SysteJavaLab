package com.example.demo.entities;

import com.example.demo.FlightStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GenerationType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinTable;
import jakarta.persistence.OneToMany;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Flight")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flightNumber;
    private String departureDate;
    private String arrivalDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departureAirportCode")
    private Airport departureAirportCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arrivalAirportCode")
    private Airport arrivalAirportCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airplaneId")
    private Airplane airplaneId;

    @Enumerated(EnumType.STRING)
    private FlightStatus status;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(
        name = "flightService",
        joinColumns = @JoinColumn(name = "flightId"),
        inverseJoinColumns = @JoinColumn(name = "amenityId")
    )
    private List<Amenity> amenities = new ArrayList<>();

    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ticket> tickets = new ArrayList<>();
}
