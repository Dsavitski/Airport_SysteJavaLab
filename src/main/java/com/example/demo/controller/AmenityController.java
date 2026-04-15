package com.example.demo.controller;

import com.example.demo.dto.AmenityCreateDto;
import com.example.demo.dto.AmenityDisplayDto;
import com.example.demo.service.AmenityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/amenities")
@RequiredArgsConstructor
public class AmenityController {

    private final AmenityService amenityService;

    @Operation(summary = "Создать услугу", description = "Создает новую услугу.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Услуга успешно создана"),
        @ApiResponse(responseCode = "400", description = "Некорректные данные")
    })
    @PostMapping
    public ResponseEntity<AmenityDisplayDto> createAmenity(@Valid @RequestBody AmenityCreateDto dto) {
        AmenityDisplayDto created = amenityService.createAmenity(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Получить все услуги", description = "Возвращает список всех услуг.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение списка")
    })
    @GetMapping
    public ResponseEntity<List<AmenityDisplayDto>> getAllAmenities() {
        return ResponseEntity.ok(amenityService.getAllAmenities());
    }

    @Operation(summary = "Получить услугу по ID", description = "Возвращает информацию об услуге по его ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Услуга найдена и возвращена"),
        @ApiResponse(responseCode = "404", description = "Услуга не найдена")
    })
    @GetMapping("/{id}")
    public ResponseEntity<AmenityDisplayDto> getAmenityById(@PathVariable Long id) {
        return ResponseEntity.ok(amenityService.getAmenityById(id));
    }

    @Operation(summary = "Обновить услугу", description = "Обновляет данные об услуге по его ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Услуга успешно обновлена"),
        @ApiResponse(responseCode = "404", description = "Услуга не найдена")
    })
    @PutMapping("/{id}")
    public ResponseEntity<AmenityDisplayDto> updateAmenity(@PathVariable Long id, @RequestBody AmenityCreateDto dto) {
        return ResponseEntity.ok(amenityService.updateAmenity(id, dto));
    }

    @Operation(summary = "Удалить услугу", description = "Удаляет услугу по его ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Услуга успешно удалена"),
        @ApiResponse(responseCode = "404", description = "Услуга не найдена")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAmenity(@PathVariable Long id) {
        amenityService.deleteAmenity(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Массовое создание услуг с транзакцией",
        description = "Создает несколько услуг в рамках транзакции с откатом при ошибке.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Услуги успешно созданы"),
        @ApiResponse(responseCode = "400", description = "Некорректные данные или ошибка при создании")
    })
    @PostMapping("/bulk-transactional")
    public ResponseEntity<List<AmenityDisplayDto>>
        createAmenitiesBulkTransactional(@Valid @RequestBody List<AmenityCreateDto> dtos) {
        List<AmenityDisplayDto> created = amenityService.createAmenitiesBulkTransactional(dtos);
        return ResponseEntity.ok(created);
    }

    @Operation(summary = "Массовое создание услуг без транзакции",
        description = "Создает несколько услуг без отката при ошибке.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Услуги успешно созданы"),
        @ApiResponse(responseCode = "400", description = "Некорректные данные или ошибка при создании")
    })
    @PostMapping("/bulk")
    public ResponseEntity<List<AmenityDisplayDto>>
        createAmenitiesBulk(@Valid @RequestBody List<AmenityCreateDto> dtos) {
        List<AmenityDisplayDto> created = amenityService.createAmenitiesBulkWithoutTransaction(dtos);
        return ResponseEntity.ok(created);
    }
}