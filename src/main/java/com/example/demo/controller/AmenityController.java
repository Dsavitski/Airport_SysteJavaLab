package com.example.demo.controller;

import com.example.demo.dto.AmenityCreateDto;
import com.example.demo.dto.AmenityDisplayDto;
import com.example.demo.service.AmenityService;
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

    @PostMapping
    public ResponseEntity<AmenityDisplayDto> createAmenity(@RequestBody AmenityCreateDto dto) {
        AmenityDisplayDto created = amenityService.createAmenity(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<AmenityDisplayDto>> getAllAmenities() {
        return ResponseEntity.ok(amenityService.getAllAmenities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AmenityDisplayDto> getAmenityById(@PathVariable Long id) {
        return ResponseEntity.ok(amenityService.getAmenityById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AmenityDisplayDto> updateAmenity(@PathVariable Long id, @RequestBody AmenityCreateDto dto) {
        return ResponseEntity.ok(amenityService.updateAmenity(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAmenity(@PathVariable Long id) {
        amenityService.deleteAmenity(id);
        return ResponseEntity.noContent().build();
    }
}