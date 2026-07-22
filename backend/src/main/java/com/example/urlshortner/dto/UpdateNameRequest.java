package com.example.urlshortner.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateNameRequest {
    @NotBlank(message = "Name is required")
    private String name;
}
