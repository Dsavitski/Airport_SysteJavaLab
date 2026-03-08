package com.example.demo.mapper;


import com.example.demo.dto.FlightCreateDto;
import com.example.demo.dto.FlightDisplayDto;
import com.example.demo.entities.Airplane;
import com.example.demo.entities.Airport;
import com.example.demo.entities.Flight;
import com.example.demo.repository.AirplaneRepository;
import com.example.demo.repository.AirportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class FlightMapper {
    private final AirportRepository airportRepository;
    private final AirplaneRepository airplaneRepository;



    public Flight toEntity(FlightCreateDto dto) {
        Flight flight = new Flight();
        flight.setFlightNumber(dto.getFlightNumber());
        flight.setDepartureDate(dto.getDepartureDate());
        flight.setArrivalDate(dto.getArrivalDate());

        Airport departureAirport = airportRepository.findById(dto.getDepartureAirportCode())
            .orElseThrow(() -> new RuntimeException("Departure airport not found: " + dto.getDepartureAirportCode()));
        Airport arrivalAirport = airportRepository.findById(dto.getArrivalAirportCode())
            .orElseThrow(() -> new RuntimeException("Arrival airport not found: " + dto.getArrivalAirportCode()));

        flight.setDepartureAirportCode(departureAirport);
        flight.setArrivalAirportCode(arrivalAirport);

        Airplane airplane = airplaneRepository.findById(dto.getAirplaneId())
            .orElseThrow(() -> new RuntimeException("Airplane not found: " + dto.getAirplaneId()));
        flight.setAirplaneId(airplane);
        return flight;
    }

    public FlightDisplayDto toDisplayDTO(Flight flight) {
        FlightDisplayDto dto = new FlightDisplayDto();

        dto.setId(flight.getId());
        dto.setFlightNumber(flight.getFlightNumber());
        dto.setDepartureDate(flight.getDepartureDate());
        dto.setArrivalDate(flight.getArrivalDate());
        dto.setDepartureAirportCode(flight.getDepartureAirportCode().getId());
        dto.setArrivalAirportCode(flight.getArrivalAirportCode().getId());
        dto.setAirplaneId(flight.getAirplaneId().getId());
        dto.setStatus(flight.getStatus());

        return dto;
    }

}
