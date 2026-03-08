package com.example.demo.controller;

import com.example.demo.dto.TicketCreateDto;
import com.example.demo.dto.TicketDisplayDto;
import com.example.demo.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping("/{flightId}")
    public ResponseEntity<TicketDisplayDto> createTicket(@RequestBody TicketCreateDto dto,
                                                         @PathVariable Long flightId) {
        TicketDisplayDto created = ticketService.createTicket(dto, flightId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TicketDisplayDto>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDisplayDto> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PutMapping("/{id}/{flightId}")
    public ResponseEntity<TicketDisplayDto> updateTicket(@PathVariable Long id,
                                                         @RequestBody TicketCreateDto dto,
                                                         @PathVariable Long flightId) {
        return ResponseEntity.ok(ticketService.updateTicket(id, dto, flightId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}