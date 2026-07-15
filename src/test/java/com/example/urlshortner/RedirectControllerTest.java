package com.example.urlshortner;

import com.example.urlshortner.entity.Url;
import com.example.urlshortner.entity.User;
import com.example.urlshortner.entity.UserRole;
import com.example.urlshortner.repository.UrlRepository;
import com.example.urlshortner.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class RedirectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UrlRepository urlRepository;

    @MockitoBean
    private StringRedisTemplate redisTemplate;

    private ValueOperations<String, String> valueOperations;
    private User testUser;

    @BeforeEach
    void setUp() {
        urlRepository.deleteAll();
        userRepository.deleteAll();

        valueOperations = mock(ValueOperations.class);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        testUser = User.builder()
                .name("Test User")
                .email("test@example.com")
                .password("password123")
                .role(UserRole.ROLE_USER)
                .enabled(true)
                .emailVerified(true)
                .build();
        testUser = userRepository.save(testUser);
    }

    @Test
    void testRedirect_CacheHit() throws Exception {
        when(valueOperations.get("url:abc123")).thenReturn("https://google.com");

        Url url = Url.builder()
                .originalUrl("https://google.com")
                .shortCode("abc123")
                .user(testUser)
                .isActive(true)
                .build();
        urlRepository.save(url);

        mockMvc.perform(get("/abc123"))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", "https://google.com"));

        verify(valueOperations, times(1)).get("url:abc123");
    }

    @Test
    void testRedirect_CacheMiss_DbHit_Success() throws Exception {
        when(valueOperations.get("url:abc123")).thenReturn(null);

        Url url = Url.builder()
                .originalUrl("https://google.com")
                .shortCode("abc123")
                .user(testUser)
                .isActive(true)
                .build();
        urlRepository.save(url);

        mockMvc.perform(get("/abc123"))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", "https://google.com"));

        verify(valueOperations, times(1)).get("url:abc123");
        verify(valueOperations, times(1)).set("url:abc123", "https://google.com", 30L, TimeUnit.MINUTES);
    }

    @Test
    void testRedirect_NotFound() throws Exception {
        when(valueOperations.get("url:nonexistent")).thenReturn(null);

        mockMvc.perform(get("/nonexistent"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testRedirect_Inactive() throws Exception {
        when(valueOperations.get("url:inactive")).thenReturn(null);

        Url url = Url.builder()
                .originalUrl("https://google.com")
                .shortCode("inactive")
                .user(testUser)
                .isActive(false)
                .build();
        urlRepository.save(url);

        mockMvc.perform(get("/inactive"))
                .andExpect(status().isGone());
    }

    @Test
    void testRedirect_Expired() throws Exception {
        when(valueOperations.get("url:expired")).thenReturn(null);

        Url url = Url.builder()
                .originalUrl("https://google.com")
                .shortCode("expired")
                .user(testUser)
                .isActive(true)
                .expiryDate(LocalDateTime.now().minusHours(1))
                .build();
        urlRepository.save(url);

        mockMvc.perform(get("/expired"))
                .andExpect(status().isGone());
    }
}
