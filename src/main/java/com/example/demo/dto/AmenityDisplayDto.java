package com.example.demo.dto;


import com.example.demo.enums.Amenities;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AmenityDisplayDto {
    private Long id;
    private Amenities amenities;
}
