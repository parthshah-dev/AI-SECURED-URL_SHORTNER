package com.example.urlshortner.service;

import com.example.urlshortner.dto.UrlSafetyCheckResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiApiService {

    private final ChatModel chatModel;
    private final ObjectMapper objectMapper;

    public UrlSafetyCheckResponse checkUrlSafety(String originalUrl) {

        log.info("Starting Gemini URL safety check for URL: {}", originalUrl);

        String prompt = """
            Analyze the following URL for potential malicious activity, phishing attempts, malware hosting, or obvious spam syntax:
            URL: "%s"
            
            Evaluate the domain authority, paths, query parameters, and naming patterns.
            You must return your analysis strictly as a raw JSON object matching this structure:
            {
              "isSafe": true/false,
              "reason": "Brief text explaining your reasoning if unsafe, or 'Passed safety check' if safe."
            }
            Do not include markdown blocks like ```json, do not write preambles, just return the raw JSON string.
            """.formatted(originalUrl);

        try {

            log.info("Calling Gemini API...");

            String rawResponse = chatModel.call(prompt).trim();

            log.info("Gemini API responded successfully.");
            log.debug("Raw Gemini Response: {}", rawResponse);

            if (rawResponse.startsWith("```json")) {
                rawResponse = rawResponse.substring(7, rawResponse.length() - 3).trim();
            } else if (rawResponse.startsWith("```")) {
                rawResponse = rawResponse.substring(3, rawResponse.length() - 3).trim();
            }

            UrlSafetyCheckResponse response =
                    objectMapper.readValue(rawResponse, UrlSafetyCheckResponse.class);

            log.info("Gemini parsed successfully. Safe: {}, Reason: {}",
                    response.isSafe(),
                    response.getReason());

            return response;

        } catch (Exception e) {

            log.error("Gemini API call or JSON parsing failed.", e);

            UrlSafetyCheckResponse fallback = new UrlSafetyCheckResponse();
            fallback.setSafe(true);
            fallback.setReason("Fallback triggered due to analysis failure.");

            log.warn("Returning fallback response: {}", fallback);

            return fallback;
        }
    }
}