package com.example.demo.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import  jakarta.persistence.OneToMany;
import  jakarta.persistence.CascadeType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "Airplane")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Airplane {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int capacity;

    @OneToMany(mappedBy = "airplaneId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Flight> flights;
}
