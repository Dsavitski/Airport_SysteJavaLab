package com.example.demo.repository;

import com.example.demo.entities.Airplane;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface AirplaneRepository extends JpaRepository<Airplane, Long> {

}
