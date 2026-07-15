package com.example.urlshortner;

import com.example.urlshortner.dto.CreateUrlRequest;
import com.example.urlshortner.dto.UpdateUrlRequest;
import com.example.urlshortner.entity.Url;
import com.example.urlshortner.entity.User;
import com.example.urlshortner.entity.UserRole;
import com.example.urlshortner.repository.UrlRepository;
import com.example.urlshortner.repository.UserRepository;
import com.example.urlshortner.security.JwtService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class UrlControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private User otherUser;
    private String token;

    @BeforeEach
    void setUp() {
        urlRepository.deleteAll();
        userRepository.deleteAll();

        // Create primary test user
        testUser = User.builder()
                .name("Test User")
                .email("test@example.com")
                .password("password123")
                .role(UserRole.ROLE_USER)
                .enabled(true)
                .emailVerified(true)
                .build();
        testUser = userRepository.save(testUser);

        // Create another user
        otherUser = User.builder()
                .name("Other User")
                .email("other@example.com")
                .password("password123")
                .role(UserRole.ROLE_USER)
                .enabled(true)
                .emailVerified(true)
                .build();
        otherUser = userRepository.save(otherUser);

        // Generate token for test user
        token = "Bearer " + jwtService.generateToken(testUser);
    }

    @Test
    void testCreateUrl_Success_RandomCode() throws Exception {
        CreateUrlRequest request = CreateUrlRequest.builder()
                .originalUrl("https://google.com")
                .build();

        mockMvc.perform(post("/api/urls")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.originalUrl").value("https://google.com"))
                .andExpect(jsonPath("$.shortCode").exists())
                .andExpect(jsonPath("$.shortUrl").exists())
                .andExpect(jsonPath("$.isActive").value(true));
    }

    @Test
    void testCreateUrl_Success_CustomAlias() throws Exception {
        CreateUrlRequest request = CreateUrlRequest.builder()
                .originalUrl("https://example.com")
                .customAlias("myalias")
                .build();

        mockMvc.perform(post("/api/urls")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.shortCode").value("myalias"))
                .andExpect(jsonPath("$.shortUrl").value("http://localhost:8080/myalias"));
    }

    @Test
    void testCreateUrl_Conflict_CustomAlias() throws Exception {
        // Save URL with alias first
        Url url = Url.builder()
                .originalUrl("https://first.com")
                .shortCode("myalias")
                .customAlias("myalias")
                .user(testUser)
                .build();
        urlRepository.save(url);

        CreateUrlRequest request = CreateUrlRequest.builder()
                .originalUrl("https://second.com")
                .customAlias("myalias")
                .build();

        mockMvc.perform(post("/api/urls")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Alias Already Exists"));
    }

    @Test
    void testCreateUrl_InvalidUrl() throws Exception {
        CreateUrlRequest request = CreateUrlRequest.builder()
                .originalUrl("not-a-valid-url")
                .build();

        mockMvc.perform(post("/api/urls")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }

    @Test
    void testUpdateUrl_Success() throws Exception {
        Url url = Url.builder()
                .originalUrl("https://google.com")
                .shortCode("goog12")
                .user(testUser)
                .build();
        url = urlRepository.save(url);

        UpdateUrlRequest request = UpdateUrlRequest.builder()
                .originalUrl("https://yahoo.com")
                .title("New Title")
                .description("New Description")
                .build();

        mockMvc.perform(put("/api/urls/" + url.getId())
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.originalUrl").value("https://yahoo.com"))
                .andExpect(jsonPath("$.title").value("New Title"))
                .andExpect(jsonPath("$.description").value("New Description"));
    }

    @Test
    void testUpdateUrl_Forbidden() throws Exception {
        // Create URL owned by otherUser
        Url url = Url.builder()
                .originalUrl("https://google.com")
                .shortCode("goog12")
                .user(otherUser)
                .build();
        url = urlRepository.save(url);

        UpdateUrlRequest request = UpdateUrlRequest.builder()
                .originalUrl("https://yahoo.com")
                .build();

        mockMvc.perform(put("/api/urls/" + url.getId())
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Forbidden"));
    }

    @Test
    void testDeleteUrl_Success() throws Exception {
        Url url = Url.builder()
                .originalUrl("https://google.com")
                .shortCode("goog12")
                .user(testUser)
                .build();
        url = urlRepository.save(url);

        mockMvc.perform(delete("/api/urls/" + url.getId())
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("URL record deleted successfully"));

        assertFalse(urlRepository.existsById(url.getId()));
    }

    @Test
    void testDeleteUrl_Forbidden() throws Exception {
        Url url = Url.builder()
                .originalUrl("https://google.com")
                .shortCode("goog12")
                .user(otherUser)
                .build();
        url = urlRepository.save(url);

        mockMvc.perform(delete("/api/urls/" + url.getId())
                        .header("Authorization", token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Forbidden"));
    }

    @Test
    void testActivateDeactivateUrl() throws Exception {
        Url url = Url.builder()
                .originalUrl("https://google.com")
                .shortCode("goog12")
                .user(testUser)
                .isActive(true)
                .build();
        url = urlRepository.save(url);

        mockMvc.perform(patch("/api/urls/" + url.getId() + "/deactivate")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isActive").value(false));

        mockMvc.perform(patch("/api/urls/" + url.getId() + "/activate")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isActive").value(true));
    }

    @Test
    void testGetMyUrls() throws Exception {
        Url url1 = Url.builder()
                .originalUrl("https://url1.com")
                .shortCode("code11")
                .user(testUser)
                .build();
        Url url2 = Url.builder()
                .originalUrl("https://url2.com")
                .shortCode("code22")
                .user(testUser)
                .build();
        Url urlOther = Url.builder()
                .originalUrl("https://otherurl.com")
                .shortCode("code33")
                .user(otherUser)
                .build();

        urlRepository.saveAll(List.of(url1, url2, urlOther));

        mockMvc.perform(get("/api/urls")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void testSearchUrls() throws Exception {
        Url url1 = Url.builder()
                .originalUrl("https://java-platform.com")
                .shortCode("java12")
                .user(testUser)
                .build();
        Url url2 = Url.builder()
                .originalUrl("https://python-platform.com")
                .shortCode("pyth34")
                .user(testUser)
                .build();

        urlRepository.saveAll(List.of(url1, url2));

        mockMvc.perform(get("/api/urls/search")
                        .header("Authorization", token)
                        .param("query", "java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].shortCode").value("java12"));
    }
}
