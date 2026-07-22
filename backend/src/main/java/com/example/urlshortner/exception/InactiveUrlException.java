package com.example.urlshortner.exception;


public class InactiveUrlException extends RuntimeException {
    public InactiveUrlException(String message) {
        super(message);
    }
}
