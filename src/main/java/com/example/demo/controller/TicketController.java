package com.example.demo.controller;

import com.example.demo.dto.TicketCreateDto;
import com.example.demo.dto.TicketDisplayDto;
import com.example.demo.entities.Ticket;
import com.example.demo.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


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
    public Page<Ticket> getTicketsByFlightId(
        @RequestParam Long flightId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ticketService.getTicketsByFlightId(flightId, pageable);
    }



    @GetMapping("/NativeQuery")
    public Page<Ticket> getTicketsByFlightIdNative(
        @RequestParam Long flightId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ticketService.getTicketsByFlightIdNative(flightId, pageable);
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