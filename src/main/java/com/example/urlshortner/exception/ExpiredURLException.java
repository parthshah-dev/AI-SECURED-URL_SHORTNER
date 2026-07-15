package com.example.urlshortner.exception;

/**
 * Exception thrown when accessing a short URL that has expired.
 */
public class ExpiredURLException extends RuntimeException {
    public ExpiredURLException(String message) {
        super(message);
    }
}
