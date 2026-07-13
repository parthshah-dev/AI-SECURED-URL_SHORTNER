package com.example.urlshortner.exception;

/**
 * Exception thrown when user registration fails because the email is already in use.
 */
public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
