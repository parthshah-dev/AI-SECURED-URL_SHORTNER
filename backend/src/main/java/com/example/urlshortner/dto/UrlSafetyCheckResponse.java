package com.example.urlshortner.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UrlSafetyCheckResponse {

    @JsonProperty("isSafe")
    private boolean isSafe;

    @JsonProperty("reason")
    private String reason;
}
