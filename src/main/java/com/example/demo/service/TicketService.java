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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final FlightRepository flightRepository;
    private final TicketMapper ticketMapper;
    private final Map<String, CompletableFuture<String>> tasks = new ConcurrentHashMap<>();
    private final Logger LOG = LoggerFactory.getLogger(TicketService.class);

    @Async
    public CompletableFuture<String> createTicketAsync(TicketCreateDto dto, Long flightId) {
        String taskId = UUID.randomUUID().toString();
        CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
            try {
                Thread.sleep(40000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            createTicket(dto, flightId);
        });
        tasks.put(taskId, future.thenApply(v -> taskId));
        return CompletableFuture.completedFuture(taskId);
    }

    private int raceCounter = 0;
    private final AtomicInteger atomicCounter = new AtomicInteger(0);

    public void createTicketsRaceConditions() {
        ExecutorService executor = Executors.newFixedThreadPool(100);
        for (int i = 0; i < 1000; i++) {
            executor.submit(() -> {
                raceCounter++;
                atomicCounter.incrementAndGet();
            });
        }
        executor.shutdown();
        while (!executor.isTerminated()) {
            try {
                Thread.sleep(1);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
        LOG.info("Результат без защиты (возможна ошибка): " + raceCounter);
        LOG.info("Общий счетчик с AtomicInteger: " + atomicCounter.get());
    }

    public String getTaskStatus(String taskId) {
        CompletableFuture<String> future = tasks.get(taskId);
        if (future == null) {
            return "Задача не найдена";
        }
        if (future.isDone()) {
            return "Выполнена";
        } else if (future.isCancelled()) {
            return "Отменена";
        } else {
            return "Выполняется";
        }
    }


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