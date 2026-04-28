package com.example.demo.controller;

import com.example.demo.dto.TicketCreateDto;
import com.example.demo.dto.TicketDisplayDto;
import com.example.demo.entities.Ticket;
import com.example.demo.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
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

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @Operation(summary = "Создать билет", description = "Создает новый билет для указанного рейса.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Билет успешно создан"),
        @ApiResponse(responseCode = "400", description = "Некорректные данные")
    })
    @PostMapping("/{flightId}")
    public ResponseEntity<TicketDisplayDto> createTicket(@Valid @RequestBody TicketCreateDto dto,
                                                         @PathVariable Long flightId) {
        TicketDisplayDto created = ticketService.createTicket(dto, flightId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Получить билеты по ID рейса", description = "Возвращает страницу билетов по ID рейса.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение билетов")
    })
    @GetMapping
    public Page<Ticket> getTicketsByFlightId(
        @RequestParam Long flightId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ticketService.getTicketsByFlightId(flightId, pageable);
    }

    @Operation(summary = "Получить билеты по ID рейса (native query)", description =
        "Получает билеты по ID рейса с использованием native SQL.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение билетов")
    })
    @GetMapping("/NativeQuery")
    public Page<Ticket> getTicketsByFlightIdNative(
        @RequestParam Long flightId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ticketService.getTicketsByFlightIdNative(flightId, pageable);
    }

    @Operation(summary = "Обновить билет", description = "Обновляет информацию о билете по его ID и ID рейса.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Билет успешно обновлен"),
        @ApiResponse(responseCode = "404", description = "Билет или рейс не найден")
    })
    @PutMapping("/{id}/{flightId}")
    public ResponseEntity<TicketDisplayDto> updateTicket(@PathVariable Long id,
                                                         @RequestBody TicketCreateDto dto,
                                                         @PathVariable Long flightId) {
        return ResponseEntity.ok(ticketService.updateTicket(id, dto, flightId));
    }

    @Operation(summary = "Удалить билет", description = "Удаляет билет по его ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Билет успешно удален"),
        @ApiResponse(responseCode = "404", description = "Билет не найден")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Создать билет асинхронно",
        description = "Создает билет асинхронно и возвращает taskId для отслеживания.")
    @PostMapping("/async/{flightId}")
    public ResponseEntity<String> createTicketAsync(@Valid @RequestBody TicketCreateDto dto,
                                                    @PathVariable Long flightId) {
        CompletableFuture<String> taskIdFuture = ticketService.createTicketAsync(dto, flightId);
        String taskId = taskIdFuture.join();
        return ResponseEntity.ok(taskId);
    }

    @Operation(summary = "Получить статус задачи", description = "Возвращает статус асинхронной задачи по taskId.")
    @GetMapping("/taskStatus/{taskId}")
    public ResponseEntity<String> getTaskStatus(@PathVariable String taskId) {
        String status = ticketService.getTaskStatus(taskId);
        return ResponseEntity.ok(status);
    }
    @Operation(summary = "Счетчики для race condition", description = "Проверяет синхронный и асинхронный счетчики.")
    @GetMapping("/race-condition")
    public String runRaceConditionDemo() {
        ticketService.createTicketsRaceConditions();
        return "Race condition демонстрация завершена. Посмотрите логи.";
    }

}