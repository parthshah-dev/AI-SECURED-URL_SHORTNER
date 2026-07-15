package com.example.urlshortner.exception;

/**
 * Exception thrown when a requested short code or URL record does not exist.
 */
public class UrlNotFoundException extends RuntimeException {
    public UrlNotFoundException(String message) {
        super(message);
    }
}
