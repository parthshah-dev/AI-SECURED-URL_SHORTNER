package com.example.urlshortner.controller;

import com.example.urlshortner.service.QRCodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/qr")
@RequiredArgsConstructor
@Tag(name = "QR Code Generation", description = "APIs for generating QR Code images for shortened URLs")
public class QRCodeController {

    private final QRCodeService qrCodeService;

    @GetMapping(value = "/{shortCode}", produces = MediaType.IMAGE_PNG_VALUE)
    @Operation(summary = "Generate QR Code", description = "Generates a 300x300 PNG QR Code image dynamically in memory for the given short URL code.")
    public ResponseEntity<byte[]> generateQRCode(@PathVariable String shortCode) {
        byte[] qrCodeBytes = qrCodeService.generateQRCode(shortCode);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_PNG_VALUE)
                .body(qrCodeBytes);
    }
}
