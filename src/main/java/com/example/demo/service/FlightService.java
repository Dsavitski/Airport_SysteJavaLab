package com.example.demo.service;

import com.example.demo.FlightKey;
import com.example.demo.dto.FlightCreateDto;
import com.example.demo.dto.FlightDisplayDto;
import com.example.demo.entities.Flight;
import com.example.demo.mapper.FlightMapper;
import com.example.demo.repository.FlightRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;
    private final FlightMapper flightMapper;

    private final Map<FlightKey, Flight> flightIndex = new HashMap<>();

    private void invalidateIndex() {
        flightIndex.clear();
    }

    public FlightDisplayDto createFlight(FlightCreateDto dto) {
        Flight flight = flightMapper.toEntity(dto);
        Flight savedFlight = flightRepository.save(flight);
        invalidateIndex();
        return flightMapper.toDisplayDTO(savedFlight);
    }

    public List<Flight> getAllFlightsWithJoinFetch() {
        return flightRepository.findAllWithFetchJoin();
    }


    public List<FlightDisplayDto> getAllFlights() {
        return flightRepository.findAll().stream()
            .map(flightMapper::toDisplayDTO)
            .toList();
    }

    public FlightDisplayDto findByFlightNumberAndDepartureDate(String flightNumber, String departureDate,String passportNumber) {
        FlightKey key = new FlightKey(flightNumber, departureDate,passportNumber);
        Flight flight = flightIndex.get(key);
        if (flight != null) {
            return flightMapper.toDisplayDTO(flight);
        }
        Optional<Flight> optionalFlight = flightRepository.findFlightByDetailsAndPassport(flightNumber,departureDate,passportNumber);
        if (optionalFlight.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Flight not found");
        }
        flight = optionalFlight.get();
        flightIndex.put(key, flight);
        return flightMapper.toDisplayDTO(flight);
    }

    public FlightDisplayDto findFlightByDetailsAndPassportNative(String flightNumber, String departureDate, String passportNumber) {
        Optional<Flight> optionalFlight = flightRepository.findFlightByDetailsAndPassport(flightNumber, departureDate, passportNumber);
        if (optionalFlight.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Flight not found");
        }
        Flight flight = optionalFlight.get();
        return flightMapper.toDisplayDTO(flight);
    }


    public FlightDisplayDto getFlightById(Long id) {
        Flight flight = flightRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Flight not found"));
        return flightMapper.toDisplayDTO(flight);
    }

    public FlightDisplayDto updateFlight(Long id, FlightCreateDto dto) {
        Flight existingFlight = flightRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Flight not found"));
        Flight updatedFlight = flightMapper.toEntity(dto);
        updatedFlight.setId(existingFlight.getId());
        Flight savedFlight = flightRepository.save(updatedFlight);
        invalidateIndex();
        return flightMapper.toDisplayDTO(savedFlight);
    }

    public void deleteFlight(Long id) {
        if (!flightRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Flight not found");
        }
        flightRepository.deleteById(id);
        invalidateIndex();
    }
}

