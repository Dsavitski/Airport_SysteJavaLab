package com.example.demo.service;

import com.example.demo.entities.Flight;
import com.example.demo.entities.Ticket;
import com.example.demo.dto.TicketCreateDto;
import com.example.demo.dto.TicketDisplayDto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.TicketMapper;
import com.example.demo.repository.FlightRepository;
import com.example.demo.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class TicketService {


    private final TicketRepository ticketRepository;
    private final FlightRepository flightRepository;
    private final TicketMapper ticketMapper;


    public TicketDisplayDto createTicket(TicketCreateDto dto, Long flightId) {
        Flight flight = flightRepository.findById(flightId)
            .orElseThrow(() -> new ResourceNotFoundException("Flight with id " + flightId + " is not found"));
        Ticket ticket = ticketMapper.toEntity(dto, flight);
        Ticket savedTicket = ticketRepository.save(ticket);
        return ticketMapper.toDisplayDto(savedTicket);
    }

    public Page<Ticket> getTicketsByFlightId(Long flightId, Pageable pageable) {
        return ticketRepository.findByFlightFlightId(flightId, pageable);
    }
    public Page<Ticket> getTicketsByFlightIdNative(Long flightId, Pageable pageable) {
        return ticketRepository.findByFlightFlightIdNative(flightId, pageable);
    }

    public TicketDisplayDto updateTicket(Long id, TicketCreateDto dto, Long flightId) {
        Ticket existingTicket = ticketRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket with id " + id + " is not found"));
        Flight flight = flightRepository.findById(flightId)
            .orElseThrow(() -> new ResourceNotFoundException("Flight with id " + flightId + " isn`t found"));
        existingTicket.setPassportNumber(dto.getPassportNumber());
        existingTicket.setPassengerName(dto.getPassengerName());
        existingTicket.setSeat(dto.getSeat());
        existingTicket.setPrice(dto.getPrice());
        existingTicket.setFlight(flight);
        Ticket savedTicket = ticketRepository.save(existingTicket);
        return ticketMapper.toDisplayDto(savedTicket);
    }

    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ticket with id " + id + " is not found");
        }
        ticketRepository.deleteById(id);
    }

}