package com.example.urlshortner.exception;

/**
 * Exception thrown when a user attempts to log in but their email address is not yet verified.
 */
public class EmailNotVerifiedException extends RuntimeException {
    public EmailNotVerifiedException(String message) {
        super(message);
    }
}
