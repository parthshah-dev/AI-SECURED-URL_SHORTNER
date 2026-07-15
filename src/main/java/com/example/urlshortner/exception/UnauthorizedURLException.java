package com.example.urlshortner.exception;

/**
 * Exception thrown when a user attempts to access or modify a URL they do not own.
 */
public class UnauthorizedURLException extends RuntimeException {
    public UnauthorizedURLException(String message) {
        super(message);
    }
}
