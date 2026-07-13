package com.example.urlshortner.exception;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standard DTO representing error details returned in API responses.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private Map<String, String> details;
}
