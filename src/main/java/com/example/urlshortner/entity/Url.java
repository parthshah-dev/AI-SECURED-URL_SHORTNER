package com.example.urlshortner.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "urls")
public class Url {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @
    String originalUrl;

    String shortUrl;
}
