package com.example.demo.controller;

import com.example.demo.dto.AirplaneCreateDto;
import com.example.demo.dto.AirplaneDisplayDto;
import com.example.demo.service.AirplaneService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import java.util.List;

@RestController
@RequestMapping("/api/airplanes")
@RequiredArgsConstructor
public class AirplaneController {

    private final AirplaneService airplaneService;

    @Operation(summary = "Создать новый самолет", description =
        "Создает новый самолет на основе предоставленных данных.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Самолет успешно создан"),
        @ApiResponse(responseCode = "400", description = "Ошибка валидации данных")
    })
    @PostMapping
    public ResponseEntity<AirplaneDisplayDto> createAirplane(@Valid @RequestBody AirplaneCreateDto dto) {
        AirplaneDisplayDto created = airplaneService.createAirplane(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Получить список всех самолетов", description = "Возвращает список всех самолетов.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение списка")
    })
    @GetMapping
    public ResponseEntity<List<AirplaneDisplayDto>> getAllAirplanes() {
        return ResponseEntity.ok(airplaneService.getAllAirplanes());
    }
    @Operation(summary = "Получить самолет по ID", description =
        "Возвращает информацию о самолете по его уникальному идентификатору.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Самолет найден и возвращен"),
        @ApiResponse(responseCode = "404", description = "Самолет не найден")
    })
    @GetMapping("/{id}")
    public ResponseEntity<AirplaneDisplayDto> getAirplaneById(@PathVariable Long id) {
        return ResponseEntity.ok(airplaneService.getAirplaneById(id));
    }

    @Operation(summary = "Обновить информацию о самолете", description = "Обновляет данные о самолете по его ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Самолет успешно обновлен"),
        @ApiResponse(responseCode = "404", description = "Самолет не найден")
    })
    @PutMapping("/{id}")
    public ResponseEntity<AirplaneDisplayDto> updateAirplane(@PathVariable Long id,
                                                             @RequestBody AirplaneCreateDto dto) {
        return ResponseEntity.ok(airplaneService.updateAirplane(id, dto));
    }

    @Operation(summary = "Удалить самолета", description = "Удаляет самолет по его ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Самолет успешно удален"),
        @ApiResponse(responseCode = "404", description = "Самолет не найден")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAirplane(@PathVariable Long id) {
        airplaneService.deleteAirplane(id);
        return ResponseEntity.noContent().build();
    }
}
