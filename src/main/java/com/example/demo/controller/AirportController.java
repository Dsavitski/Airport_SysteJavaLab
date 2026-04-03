package com.example.demo.controller;

import com.example.demo.dto.AirportCreateDto;
import com.example.demo.dto.AirportDisplayDto;
import com.example.demo.service.AirportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
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
@RequestMapping("/api/airports")
@RequiredArgsConstructor
public class AirportController {

    private final AirportService airportService;

    @Operation(summary = "Создать аэропорт", description = "Создает новый аэропорт.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Аэропорт успешно создан"),
        @ApiResponse(responseCode = "400", description = "Некорректные данные")
    })
    @PostMapping
    public ResponseEntity<AirportDisplayDto> createAirport(@Valid @RequestBody AirportCreateDto dto) {
        AirportDisplayDto created = airportService.createAirport(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Создать аэропорты транзакционно", description = "Создает список аэропортов в транзакции.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Аэропорты успешно созданы"),
        @ApiResponse(responseCode = "400", description = "Некорректные данные")
    })
    @PostMapping("/create-transactional")
    public ResponseEntity<AirportDisplayDto> createAirportTransactional(@RequestBody List<AirportCreateDto> dto) {
        airportService.createAirportsTransactional(dto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @Operation(summary = "Создать аэропорты без транзакции", description = "Создает список аэропортов без транзакции.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Аэропорты успешно созданы"),
        @ApiResponse(responseCode = "400", description = "Некорректные данные")
    })
    @PostMapping("/create-no-transaction")
    public ResponseEntity<AirportDisplayDto> createAirportNoTransaction(@RequestBody List<AirportCreateDto> dto) {
        airportService.createAirportsNoTransaction(dto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @Operation(summary = "Получить все аэропорты", description = "Возвращает список всех аэропортов.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение списка")
    })
    @GetMapping
    public ResponseEntity<List<AirportDisplayDto>> getAllAirports() {
        return ResponseEntity.ok(airportService.getAllAirports());
    }

    @Operation(summary = "Получить аэропорт по коду", description = "Возвращает информацию о аэропорте по его коду.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Аэропорт найден и возвращен"),
        @ApiResponse(responseCode = "404", description = "Аэропорт не найден")
    })
    @GetMapping("/{code}")
    public ResponseEntity<AirportDisplayDto> getAirportByCode(@PathVariable Long code) {
        return ResponseEntity.ok(airportService.getAirportByCode(code));
    }

    @Operation(summary = "Обновить аэропорт", description = "Обновляет данные аэропорта по его коду.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Аэропорт успешно обновлен"),
        @ApiResponse(responseCode = "404", description = "Аэропорт не найден")
    })
    @PutMapping("/{code}")
    public ResponseEntity<AirportDisplayDto> updateAirport(@PathVariable Long code, @RequestBody AirportCreateDto dto) {
        return ResponseEntity.ok(airportService.updateAirport(code, dto));
    }

    @Operation(summary = "Удалить аэропорт", description = "Удаляет аэропорт по его коду.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Аэропорт успешно удален"),
        @ApiResponse(responseCode = "404", description = "Аэропорт не найден")
    })
    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteAirport(@PathVariable Long code) {
        airportService.deleteAirport(code);
        return ResponseEntity.noContent().build();
    }
}