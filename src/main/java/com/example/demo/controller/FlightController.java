package com.example.demo.controller;

import com.example.demo.dto.FlightCreateDto;
import com.example.demo.dto.FlightDisplayDto;
import com.example.demo.entities.Flight;
import com.example.demo.mapper.FlightMapper;
import com.example.demo.service.FlightService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;
    private final FlightMapper flightMapper;

    @Operation(summary = "Создать рейс", description = "Создает новый рейс.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Рейс успешно создан"),
        @ApiResponse(responseCode = "400", description = "Некорректные данные")
    })
    @PostMapping
    public ResponseEntity<FlightDisplayDto> createFlight(@Valid @RequestBody FlightCreateDto dto) {
        FlightDisplayDto createdFlight = flightService.createFlight(dto);
        return new ResponseEntity<>(createdFlight, HttpStatus.CREATED);
    }

    @Operation(summary = "Получить все рейсы с joined fetch", description =
        "Получает все рейсы с использованием join fetch.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение списка рейсов")
    })
    @GetMapping("/joinfetch")
    public ResponseEntity<List<FlightDisplayDto>> getAllFlightsWithJoinFetch() {
        List<Flight> flights = flightService.getAllFlightsWithJoinFetch();
        List<FlightDisplayDto> dtos = flights.stream()
            .map(flightMapper::toDisplayDTO)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @Operation(summary = "Получить все рейсы", description = "Возвращает список всех рейсов.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение списка рейсов")
    })
    @GetMapping
    public ResponseEntity<List<FlightDisplayDto>> getAllFlights() {
        List<FlightDisplayDto> flights = flightService.getAllFlights();
        return ResponseEntity.ok(flights);
    }

    @Operation(summary = "Найти рейс по номеру и дате отправления", description =
        "Поиск рейса по номеру, дате отправления и паспорту.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Рейс найден и возвращен"),
        @ApiResponse(responseCode = "404", description = "Рейс не найден")
    })
    @GetMapping("/search")
    public ResponseEntity<FlightDisplayDto> getFlightByNumberAndDepartureDate(
        @RequestParam String flightNumber,
        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate departureDate,
        @RequestParam String passportNumber) {
        FlightDisplayDto flightDto = flightService.findByFlightNumberAndDepartureDate(flightNumber,
            departureDate, passportNumber);
        return ResponseEntity.ok(flightDto);
    }

    @Operation(summary = "Найти рейс по номеру и дате (native)", description =
        "Поиск рейса по номеру, дате отправления и паспорту с использованием native запроса.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Рейс найден и возвращен"),
        @ApiResponse(responseCode = "404", description = "Рейс не найден")
    })
    @GetMapping("/search/native")
    public ResponseEntity<FlightDisplayDto> getFlightByNumberAndDepartureDateNative(
        @RequestParam String flightNumber,
        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate departureDate,
        @RequestParam String passportNumber) {
        FlightDisplayDto flightDto = flightService.findFlightByDetailsAndPassportNative(flightNumber,
            departureDate, passportNumber);
        return ResponseEntity.ok(flightDto);
    }

    @Operation(summary = "Получить рейс по ID", description = "Возвращает информацию о рейсе по его ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Рейс найден и возвращен"),
        @ApiResponse(responseCode = "404", description = "Рейс не найден")
    })
    @GetMapping("/{id}")
    public ResponseEntity<FlightDisplayDto> getFlightById(@PathVariable Long id) {
        FlightDisplayDto flight = flightService.getFlightById(id);
        return ResponseEntity.ok(flight);
    }

    @Operation(summary = "Обновить рейс", description = "Обновляет данные рейса по его ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Рейс успешно обновлен"),
        @ApiResponse(responseCode = "404", description = "Рейс не найден")
    })
    @PutMapping("/{id}")
    public ResponseEntity<FlightDisplayDto> updateFlight(@PathVariable Long id, @RequestBody FlightCreateDto dto) {
        FlightDisplayDto updatedFlight = flightService.updateFlight(id, dto);
        return ResponseEntity.ok(updatedFlight);
    }

    @Operation(summary = "Удалить рейс", description = "Удаляет рейс по его ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Рейс успешно удален"),
        @ApiResponse(responseCode = "404", description = "Рейс не найден")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return ResponseEntity.noContent().build();
    }
}