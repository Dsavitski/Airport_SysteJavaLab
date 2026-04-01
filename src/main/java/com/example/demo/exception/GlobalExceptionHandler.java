package com.example.demo.exception;

import jakarta.annotation.Nullable;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFoundException(
        ResourceNotFoundException ex, WebRequest request) {
        return buildErrorResponse(ex, ex.getMessage(), HttpStatus.NOT_FOUND, request);
    }



    @Override
    @SuppressWarnings("NullableProblems")
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex, @Nullable HttpHeaders headers,
        HttpStatusCode status, WebRequest request) {

        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(FieldError::getDefaultMessage)
            .toList();
        String message = "Validation Error: " + String.join("; ", errors);
        return buildErrorResponse(ex, message, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolationException(
        ConstraintViolationException ex, WebRequest request) {

        List<String> errors = ex.getConstraintViolations()
            .stream()
            .map(ConstraintViolation::getMessage)
            .toList();
        String message = "Validation Error: " + String.join("; ", errors);
        return buildErrorResponse(ex, message, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolation(
        DataIntegrityViolationException ex, WebRequest request) {
        String message = "Data integrity violation";

        if (ex.getCause() != null && ex.getCause().getMessage().toLowerCase().contains("unique")) {
            message = "Duplicate entry: passportNumber must be unique";
            return buildErrorResponse(ex, message, HttpStatus.CONFLICT, request);
        }
        return buildErrorResponse(ex, message, HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Object> handleConflictException(
        ConflictException ex, WebRequest request) {
        return buildErrorResponse(ex, ex.getMessage(), HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgumentException(
        IllegalArgumentException ex, WebRequest request) {
        return buildErrorResponse(ex, ex.getMessage(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> handleBadRequestException(
        BadRequestException ex, WebRequest request) {
        return buildErrorResponse(ex, ex.getMessage(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(LogAccessException.class)
    public ResponseEntity<Object> handleLogAccessException(
        LogAccessException ex, WebRequest request) {
        log.error("Log access error: {}", ex.getMessage(), ex.getCause());
        return buildErrorResponse(ex, "Log Access Error",
            HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(
        RuntimeException ex, WebRequest request) {
        log.error("Unhandled RuntimeException occurred: ", ex);
        return buildErrorResponse(ex, "Unexpected Error",
            HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    private ResponseEntity<Object> buildErrorResponse(
        Exception ex, String message, HttpStatus status, WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("path", request.getDescription(false).replace("uri=", ""));

        if (status.is5xxServerError()) {
            log.error("Error processing request {} {}: {}", status.value(),
                message, ex.getMessage());
        } else if (status.is4xxClientError()) {
            log.warn("Client error processing request {} {}: {}", status.value(),
                message, ex.getMessage());
        }

        return new ResponseEntity<>(body, status);
    }

}