package com.example.urlshortner.exception;

/**
 * Exception thrown when a provided token (activation, refresh, reset etc.) is invalid or malformed.
 */
public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException(String message) {
        super(message);
    }
}
