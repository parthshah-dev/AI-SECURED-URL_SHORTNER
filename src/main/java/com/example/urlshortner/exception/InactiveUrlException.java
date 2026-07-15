package com.example.urlshortner.exception;

/**
 * Exception thrown when trying to access a short URL that has been deactivated.
 */
public class InactiveUrlException extends RuntimeException {
    public InactiveUrlException(String message) {
        super(message);
    }
}
