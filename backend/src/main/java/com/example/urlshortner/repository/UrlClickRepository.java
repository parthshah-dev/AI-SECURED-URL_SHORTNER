package com.example.urlshortner.repository;

import com.example.urlshortner.entity.Url;
import com.example.urlshortner.entity.UrlClick;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UrlClickRepository extends JpaRepository<UrlClick, Long> {

    @Query("SELECT COUNT(c) FROM UrlClick c WHERE c.url = :url AND c.clickedAt >= :startOfDay")
    long countTodayClicks(@Param("url") Url url, @Param("startOfDay") LocalDateTime startOfDay);
}
