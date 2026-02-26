# Airport-System

**Airport-System** is a REST API application designed to serve airport-related operations.

## Project Overview

This Java-based Spring Boot application provides a structured backend system for managing airport data. It follows a layered architecture to ensure separation of concerns and maintainability.

## Key Components

### 1. Main Application
*   **`DemoApplication`**: The runner class that bootstraps and launches the entire Spring Boot application.

### 2. Core Logic
*   **`FlightService`**: This class implements the main business logic of the program. It handles all operations related to flights, processes requests, and coordinates data flow.

### 3. Data Layer
*   **`FlightRepository`**: Serves as the data access layer, effectively separating the program's core logic from the underlying data source (e.g., database). It provides CRUD operations for flight entities.
*   **`Flight`**: One of the five core entities in the system. It represents the flight data model that is persisted and retrieved from the database.

### 4. Data Transfer
*   **`FlightDto`**: A Data Transfer Object designed specifically for transmitting flight data between different layers of the application, particularly between the API controllers and the service layer.

## Code Quality

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Dsavitski_Airport_SysteJavaLab&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Dsavitski_Airport_SysteJavaLab&branch=master)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Dsavitski_Airport_SysteJavaLab&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Dsavitski_Airport_SysteJavaLab&branch=master)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Dsavitski_Airport_SysteJavaLab&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Dsavitski_Airport_SysteJavaLab&branch=master)

For a detailed static code analysis, please visit the project's [SonarCloud Dashboard](https://sonarcloud.io/summary/new_code?id=Dsavitski_Airport_SysteJavaLab&branch=master).
