# Graph Report - .  (2026-07-31)

## Corpus Check
- 106 files · ~60,288 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 648 nodes · 1276 edges · 25 communities (24 shown, 1 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 59 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Frontend Components & Core UI
- Database Entities & Models
- URL Management Controller
- Global Exceptions & Error Handlers
- User Profile Controller
- Security & Authentication Configuration
- Frontend Package Dependencies
- Analytics & Dashboard Controller
- QR Code Generation & URL Exceptions
- Login DTOs & Models
- Dashboard Metrics Controller
- URL Safety Check Service
- Authentication Endpoints Controller
- Database Repository & Service Layer
- Registration Request DTOs
- Maven Wrapper Configuration
- Password Change Request DTOs
- Email Dispatch Service
- Oxlint Frontend Linter Settings
- URL Redirect Controller
- API Response Formats
- Spring Boot Main Application Entry
- User Role Enum Definition
- Maven Project Group Metadata

## God Nodes (most connected - your core abstractions)
1. `User` - 42 edges
2. `react` - 30 edges
3. `UrlService` - 28 edges
4. `Url` - 26 edges
5. `ErrorResponse` - 25 edges
6. `UrlRepository` - 24 edges
7. `UrlResponse` - 21 edges
8. `GlobalExceptionHandler` - 21 edges
9. `UserRepository` - 20 edges
10. `useAuth()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `AuthController` --references--> `AuthService`  [EXTRACTED]
  backend/src/main/java/com/example/urlshortner/controller/AuthController.java → backend/src/main/java/com/example/urlshortner/service/AuthService.java
- `DashboardController` --references--> `DashboardService`  [EXTRACTED]
  backend/src/main/java/com/example/urlshortner/controller/DashboardController.java → backend/src/main/java/com/example/urlshortner/service/DashboardService.java
- `RedirectController` --references--> `UrlService`  [EXTRACTED]
  backend/src/main/java/com/example/urlshortner/controller/RedirectController.java → backend/src/main/java/com/example/urlshortner/service/UrlService.java
- `User` --references--> `UserRole`  [EXTRACTED]
  backend/src/main/java/com/example/urlshortner/entity/User.java → backend/src/main/java/com/example/urlshortner/entity/UserRole.java
- `UserRepository` --references--> `User`  [EXTRACTED]
  backend/src/main/java/com/example/urlshortner/repository/UserRepository.java → backend/src/main/java/com/example/urlshortner/entity/User.java

## Import Cycles
- None detected.

## Communities (25 total, 1 thin omitted)

### Community 0 - "Frontend Components & Core UI"
Cohesion: 0.06
Nodes (43): api, App(), Loader(), StatCard(), Input, UrlFormModal(), Header(), Sidebar() (+35 more)

### Community 1 - "Database Entities & Models"
Cohesion: 0.05
Nodes (43): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, Url (+35 more)

### Community 2 - "URL Management Controller"
Cohesion: 0.06
Nodes (41): GetMapping, Operation, PostMapping, PutMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController (+33 more)

### Community 3 - "Global Exceptions & Error Handlers"
Cohesion: 0.07
Nodes (23): AuthenticationException, AliasAlreadyExistsException, EmailAlreadyExistsException, EmailNotVerifiedException, ErrorResponse, AllArgsConstructor, Builder, Getter (+15 more)

### Community 4 - "User Profile Controller"
Cohesion: 0.06
Nodes (39): GetMapping, Operation, PutMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController, Tag (+31 more)

### Community 5 - "Security & Authentication Configuration"
Cohesion: 0.08
Nodes (31): AuthenticationConfiguration, AuthenticationProvider, AuthenticationManager, Bean, PasswordEncoder, RequiredArgsConstructor, SecurityConfig, CustomUserDetailsService (+23 more)

### Community 6 - "Frontend Package Dependencies"
Cohesion: 0.04
Nodes (45): autoprefixer, axios, framer-motion, dependencies, axios, framer-motion, lucide-react, react (+37 more)

### Community 7 - "Analytics & Dashboard Controller"
Cohesion: 0.10
Nodes (24): AnalyticsController, GetMapping, Operation, Page, Pageable, RequestMapping, RequiredArgsConstructor, ResponseEntity (+16 more)

### Community 8 - "QR Code Generation & URL Exceptions"
Cohesion: 0.11
Nodes (16): GetMapping, Operation, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController, Tag, QRCodeController (+8 more)

### Community 9 - "Login DTOs & Models"
Cohesion: 0.14
Nodes (12): AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, LoginRequest, AllArgsConstructor, Builder (+4 more)

### Community 10 - "Dashboard Metrics Controller"
Cohesion: 0.23
Nodes (13): DashboardController, GetMapping, Operation, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController, Tag (+5 more)

### Community 11 - "URL Safety Check Service"
Cohesion: 0.19
Nodes (12): AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, UrlSafetyCheckResponse, GeminiApiService, ObjectMapper (+4 more)

### Community 12 - "Authentication Endpoints Controller"
Cohesion: 0.24
Nodes (9): AuthController, GetMapping, Operation, PostMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController (+1 more)

### Community 13 - "Database Repository & Service Layer"
Cohesion: 0.27
Nodes (9): Repository, UserRepository, AuthService, AuthenticationManager, PasswordEncoder, RequiredArgsConstructor, Service, Slf4j (+1 more)

### Community 14 - "Registration Request DTOs"
Cohesion: 0.18
Nodes (6): AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, RegisterRequest

### Community 15 - "Maven Wrapper Configuration"
Cohesion: 0.33
Nodes (6): mvnw script, clean(), die(), exec_maven(), set_java_home(), verbose()

### Community 16 - "Password Change Request DTOs"
Cohesion: 0.22
Nodes (7): PutMapping, ChangePasswordRequest, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 17 - "Email Dispatch Service"
Cohesion: 0.36
Nodes (4): EmailService, Service, Slf4j, RestClient

### Community 18 - "Oxlint Frontend Linter Settings"
Cohesion: 0.25
Nodes (7): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, warn

### Community 19 - "URL Redirect Controller"
Cohesion: 0.48
Nodes (5): GetMapping, RequiredArgsConstructor, ResponseEntity, RestController, RedirectController

### Community 20 - "API Response Formats"
Cohesion: 0.29
Nodes (6): AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, MessageResponse

### Community 21 - "Spring Boot Main Application Entry"
Cohesion: 0.43
Nodes (4): Bean, ObjectMapper, UrlshortnerApplication, SpringBootApplication

### Community 22 - "User Role Enum Definition"
Cohesion: 0.50
Nodes (3): UserRole, ROLE_ADMIN, ROLE_USER

## Knowledge Gaps
- **43 isolated node(s):** `com.example:urlshortner`, `ROLE_USER`, `ROLE_ADMIN`, `$schema`, `oxc` (+38 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `UserRepository` connect `Database Repository & Service Layer` to `Database Entities & Models`, `URL Management Controller`, `User Profile Controller`, `Security & Authentication Configuration`, `Analytics & Dashboard Controller`, `Registration Request DTOs`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `User` connect `Database Entities & Models` to `URL Management Controller`, `User Profile Controller`, `Analytics & Dashboard Controller`, `Database Repository & Service Layer`, `Registration Request DTOs`, `User Role Enum Definition`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `UrlService` connect `URL Management Controller` to `URL Safety Check Service`, `Database Entities & Models`, `URL Redirect Controller`, `Database Repository & Service Layer`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **What connects `com.example:urlshortner`, `ROLE_USER`, `ROLE_ADMIN` to the rest of the system?**
  _43 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Components & Core UI` be split into smaller, more focused modules?**
  _Cohesion score 0.060240963855421686 - nodes in this community are weakly interconnected._
- **Should `Database Entities & Models` be split into smaller, more focused modules?**
  _Cohesion score 0.05029838022165388 - nodes in this community are weakly interconnected._
- **Should `URL Management Controller` be split into smaller, more focused modules?**
  _Cohesion score 0.06277436347673397 - nodes in this community are weakly interconnected._