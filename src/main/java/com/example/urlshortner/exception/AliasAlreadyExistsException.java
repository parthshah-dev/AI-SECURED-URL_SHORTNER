package com.example.urlshortner.exception;

/**
 * Exception thrown when a requested custom alias or short code already exists in the system.
 */
public class AliasAlreadyExistsException extends RuntimeException {
    public AliasAlreadyExistsException(String message) {
        super(message);
    }
}
