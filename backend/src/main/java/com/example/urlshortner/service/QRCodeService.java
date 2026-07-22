package com.example.urlshortner.service;

import com.example.urlshortner.entity.Url;
import com.example.urlshortner.exception.ExpiredURLException;
import com.example.urlshortner.exception.InactiveUrlException;
import com.example.urlshortner.exception.UrlNotFoundException;
import com.example.urlshortner.repository.UrlRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class QRCodeService {

    private final UrlRepository urlRepository;

    @Value("${app.short-url-base:http://localhost:8080}")
    private String shortUrlBase;

    public byte[] generateQRCode(String shortCode) {
        log.info("QR Code requested for shortCode: {}", shortCode);

        Url url = urlRepository.findByShortCode(shortCode)
                .or(() -> urlRepository.findByCustomAlias(shortCode))
                .orElseThrow(() -> {
                    log.warn("Invalid short code: {}", shortCode);
                    return new UrlNotFoundException("URL record not found for code: " + shortCode);
                });

        if (!url.isActive()) {
            log.warn("Inactive URL: {}", shortCode);
            throw new InactiveUrlException("URL is inactive");
        }

        if (url.getExpiryDate() != null && url.getExpiryDate().isBefore(LocalDateTime.now())) {
            log.warn("Expired URL: {}", shortCode);
            throw new ExpiredURLException("URL has expired");
        }

        String base = shortUrlBase.endsWith("/") ? shortUrlBase : shortUrlBase + "/";
        String targetUrl = base + url.getShortCode();

        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = Map.of(
                    EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M,
                    EncodeHintType.MARGIN, 1
            );
            BitMatrix bitMatrix = qrCodeWriter.encode(targetUrl, BarcodeFormat.QR_CODE, 300, 300, hints);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] pngData = pngOutputStream.toByteArray();

            log.info("QR Code generated for shortCode: {}", shortCode);
            return pngData;
        } catch (Exception e) {
            log.error("Failed to generate QR Code for shortCode: {}", shortCode, e);
            throw new RuntimeException("QR Code generation failed: " + e.getMessage(), e);
        }
    }
}
