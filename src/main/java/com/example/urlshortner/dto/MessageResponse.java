package com.example.urlshortner.dto;

import lombok.*;

/**
 * Standard API message response helper.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {

    private String message;
}
