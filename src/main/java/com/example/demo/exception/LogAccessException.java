package com.example.demo.exception;

public class LogAccessException extends RuntimeException {
    public LogAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}
