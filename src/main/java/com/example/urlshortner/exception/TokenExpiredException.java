package com.example.urlshortner.exception;

/**
 * Exception thrown when a token (activation, refresh, etc.) has expired.
 */
public class TokenExpiredException extends RuntimeException {
    public TokenExpiredException(String message) {
        super(message);
    }
}
