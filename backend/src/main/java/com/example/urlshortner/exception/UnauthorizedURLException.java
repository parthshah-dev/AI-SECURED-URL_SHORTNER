package com.example.urlshortner.exception;


public class UnauthorizedURLException extends RuntimeException {
    public UnauthorizedURLException(String message) {
        super(message);
    }
}
