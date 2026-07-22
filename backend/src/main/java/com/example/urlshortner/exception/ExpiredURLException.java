package com.example.urlshortner.exception;


public class ExpiredURLException extends RuntimeException {
    public ExpiredURLException(String message) {
        super(message);
    }
}
