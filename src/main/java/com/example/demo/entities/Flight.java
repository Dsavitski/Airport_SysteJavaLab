package com.example.demo.entities;

import com.example.demo.enums.FlightStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Flight")
@NoArgsConstructor
@AllArgsConstructor
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flightNumber;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate departureDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate arrivalDate;

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
    @JsonManagedReference
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<Ticket> tickets = new ArrayList<>();
}