package com.example.urlshortner.exception;

/**
 * Exception thrown when a URL format or validity check fails.
 */
public class InvalidURLException extends RuntimeException {
    public InvalidURLException(String message) {
        super(message);
    }
}
