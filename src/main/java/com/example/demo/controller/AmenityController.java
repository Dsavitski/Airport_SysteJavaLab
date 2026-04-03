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
@RequestMapping("/api/amenities")
@RequiredArgsConstructor
public class AmenityController {

    private final AmenityService amenityService;

    @Operation(summary = "Создать удобство", description = "Создает новое удобство.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Удобство успешно создано"),
        @ApiResponse(responseCode = "400", description = "Некорректные данные")
    })
    @PostMapping
    public ResponseEntity<AmenityDisplayDto> createAmenity(@Valid @RequestBody AmenityCreateDto dto) {
        AmenityDisplayDto created = amenityService.createAmenity(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Получить все удобства", description = "Возвращает список всех удобств.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение списка")
    })
    @GetMapping
    public ResponseEntity<List<AmenityDisplayDto>> getAllAmenities() {
        return ResponseEntity.ok(amenityService.getAllAmenities());
    }

    @Operation(summary = "Получить удобство по ID", description = "Возвращает информацию о удобстве по его ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Удобство найдено и возвращено"),
        @ApiResponse(responseCode = "404", description = "Удобство не найдено")
    })
    @GetMapping("/{id}")
    public ResponseEntity<AmenityDisplayDto> getAmenityById(@PathVariable Long id) {
        return ResponseEntity.ok(amenityService.getAmenityById(id));
    }

    @Operation(summary = "Обновить удобство", description = "Обновляет данные о удобстве по его ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Удобство успешно обновлено"),
        @ApiResponse(responseCode = "404", description = "Удобство не найдено")
    })
    @PutMapping("/{id}")
    public ResponseEntity<AmenityDisplayDto> updateAmenity(@PathVariable Long id, @RequestBody AmenityCreateDto dto) {
        return ResponseEntity.ok(amenityService.updateAmenity(id, dto));
    }

    @Operation(summary = "Удалить удобство", description = "Удаляет удобство по его ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Удобство успешно удалено"),
        @ApiResponse(responseCode = "404", description = "Удобство не найдено")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAmenity(@PathVariable Long id) {
        amenityService.deleteAmenity(id);
        return ResponseEntity.noContent().build();
    }
}