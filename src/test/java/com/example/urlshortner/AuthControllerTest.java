package com.example.urlshortner;

import com.example.urlshortner.dto.LoginRequest;
import com.example.urlshortner.dto.RegisterRequest;
import com.example.urlshortner.entity.User;
import com.example.urlshortner.entity.UserRole;
import com.example.urlshortner.repository.UserRepository;
import com.example.urlshortner.service.EmailService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        doNothing().when(emailService).sendActivationEmail(anyString(), anyString(), anyString());
    }

    @Test
    void testRegisterUser_Success() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .name("Test User")
                .email("test@example.com")
                .password("password123")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Registration successful. Please check your email to activate your account."));
    }

    @Test
    void testRegisterUser_ValidationError() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .name("")
                .email("invalid-email")
                .password("short")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }

    @Test
    void testActivateUser_Success() throws Exception {
        String token = UUID.randomUUID().toString();
        User user = User.builder()
                .name("Unverified User")
                .email("unverified@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(UserRole.ROLE_USER)
                .enabled(false)
                .emailVerified(false)
                .activationToken(token)
                .activationTokenExpiry(LocalDateTime.now().plusHours(24))
                .build();
        userRepository.save(user);

        mockMvc.perform(get("/api/auth/activate")
                        .param("token", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Account activated successfully. You can now login."));
    }

    @Test
    void testLogin_Success() throws Exception {
        User user = User.builder()
                .name("Active User")
                .email("active@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(UserRole.ROLE_USER)
                .enabled(true)
                .emailVerified(true)
                .build();
        userRepository.save(user);

        LoginRequest request = LoginRequest.builder()
                .email("active@example.com")
                .password("password123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }
}
