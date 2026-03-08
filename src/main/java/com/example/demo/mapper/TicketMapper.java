package com.example.demo.mapper;

import com.example.demo.dto.TicketCreateDto;
import com.example.demo.dto.TicketDisplayDto;
import com.example.demo.entities.Flight;
import com.example.demo.entities.Ticket;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {
    public Ticket toEntity(TicketCreateDto dto, Flight flight) {
        if (dto == null) {
            return null;
        }
        Ticket ticket = new Ticket();
        ticket.setPassportNumber(dto.getPassportNumber());
        ticket.setPassengerName(dto.getPassengerName());
        ticket.setSeat(dto.getSeat());
        ticket.setPrice(dto.getPrice());
        ticket.setFlight(flight);
        return ticket;
    }

    public TicketDisplayDto toDisplayDto(Ticket ticket) {
        if (ticket == null) {
            return null;
        }
        TicketDisplayDto dto = new TicketDisplayDto();
        dto.setId(ticket.getId());
        dto.setPassportNumber(ticket.getPassportNumber());
        dto.setPassengerName(ticket.getPassengerName());
        dto.setSeat(ticket.getSeat());
        dto.setPrice(ticket.getPrice());
        if (ticket.getFlight() != null) {
            dto.setFlightId(ticket.getFlight().getId());
        }
        return dto;
    }
}
