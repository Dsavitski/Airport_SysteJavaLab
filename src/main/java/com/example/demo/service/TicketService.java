package com.example.demo.service;

import com.example.demo.entities.Flight;
import com.example.demo.entities.Ticket;
import com.example.demo.dto.TicketCreateDto;
import com.example.demo.dto.TicketDisplayDto;
import com.example.demo.mapper.TicketMapper;
import com.example.demo.repository.FlightRepository;
import com.example.demo.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final FlightRepository flightRepository;
    private final TicketMapper ticketMapper;

    public TicketDisplayDto createTicket(TicketCreateDto dto, Long flightId) {
        Flight flight = flightRepository.findById(flightId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Ticket not found"));
        Ticket ticket = ticketMapper.toEntity(dto, flight);
        Ticket savedTicket = ticketRepository.save(ticket);
        return ticketMapper.toDisplayDto(savedTicket);
    }

    public List<TicketDisplayDto> getAllTickets() {
        return ticketRepository.findAll().stream()
            .map(ticketMapper::toDisplayDto)
            .toList();
    }


    public TicketDisplayDto getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Ticket not found"));
        return ticketMapper.toDisplayDto(ticket);
    }

    public TicketDisplayDto updateTicket(Long id, TicketCreateDto dto, Long flightId) {
        Ticket existingTicket = ticketRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Ticket not found"));
        Flight flight = flightRepository.findById(flightId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Ticket not found"));
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
            throw new ResponseStatusException(HttpStatus
                .NOT_FOUND, "Ticket not found");
        }
        ticketRepository.deleteById(id);
    }
}