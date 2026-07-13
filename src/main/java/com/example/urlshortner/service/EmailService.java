package com.example.urlshortner.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Service to handle transactional email delivery using Brevo API.
 */
@Service
@Slf4j
public class EmailService {

    private final RestClient restClient;

    @Value("${brevo.api.url}")
    private String apiUrl;

    @Value("${brevo.api.key}")
    private String apiKey;

    @Value("${brevo.sender.name}")
    private String senderName;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    public EmailService() {
        this.restClient = RestClient.create();
    }

    /**
     * Send account activation email to a newly registered user.
     *
     * @param toEmail  recipient's email address
     * @param fullName recipient's name
     * @param token    secure activation token
     */
    public void sendActivationEmail(String toEmail, String fullName, String token) {
        String subject = "Activate your URL Shortener Account";
        String activationUrl = "http://localhost:8080/api/auth/activate?token=" + token;

        String htmlBody = String.format(
                "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;\">" +
                "    <div style=\"text-align: center; margin-bottom: 20px;\">" +
                "        <h2 style=\"color: #4F46E5; margin: 0;\">URL Shortener Service</h2>" +
                "    </div>" +
                "    <div style=\"color: #333333; line-height: 1.6; font-size: 16px;\">" +
                "        <p>Hello <strong>%s</strong>,</p>" +
                "        <p>Thank you for registering! Please activate your account by clicking the button below:</p>" +
                "        <div style=\"text-align: center; margin: 30px 0;\">" +
                "            <a href=\"%s\" style=\"background-color: #4F46E5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;\">Activate Account</a>" +
                "        </div>" +
                "        <p style=\"font-size: 14px; color: #666666;\">This link will expire in 24 hours.</p>" +
                "        <p style=\"font-size: 14px; color: #999999; margin-top: 20px;\">If you did not create this account, you can safely ignore this email.</p>" +
                "    </div>" +
                "    <hr style=\"border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;\" />" +
                "    <div style=\"text-align: center; font-size: 12px; color: #999999;\">" +
                "        &copy; 2026 URL Shortener. All rights reserved." +
                "    </div>" +
                "</div>",
                fullName, activationUrl
        );

        String textBody = String.format(
                "Hello %s,\n\n" +
                "Thank you for registering.\n\n" +
                "Please copy and paste the following link into your browser to activate your account:\n" +
                "%s\n\n" +
                "The link expires in 24 hours.\n\n" +
                "If you did not create this account, ignore this email.",
                fullName, activationUrl
        );

        sendEmail(toEmail, fullName, subject, htmlBody, textBody);
    }

    private void sendEmail(String toEmail, String fullName, String subject, String htmlBody, String textBody) {
        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("Brevo API key is empty. Email cannot be sent. To: {}", toEmail);
            throw new RuntimeException("Email sending failed: Brevo API key is not configured.");
        }

        try {
            // Structure request body payload according to Brevo SMTP API v3 specs
            Map<String, Object> requestBody = Map.of(
                    "sender", Map.of("name", senderName, "email", senderEmail),
                    "to", List.of(Map.of("email", toEmail, "name", fullName)),
                    "subject", subject,
                    "htmlContent", htmlBody,
                    "textContent", textBody
            );

            restClient.post()
                    .uri(apiUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("api-key", apiKey)
                    .body(requestBody)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Email sending failed: " + e.getMessage(), e);
        }
    }
}
