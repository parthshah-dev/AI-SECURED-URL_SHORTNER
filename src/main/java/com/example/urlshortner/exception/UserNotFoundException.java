package com.example.urlshortner.exception;

/**
 * Exception thrown when a user operation is requested for a user that does not exist.
 */
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
