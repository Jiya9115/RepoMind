package com.repomind.service;

import com.repomind.dto.DocumentationDto.*;
import com.repomind.exception.ResourceNotFoundException;
import com.repomind.model.Documentation;
import com.repomind.model.RepositoryEntity;
import com.repomind.repository.DocumentationRepository;
import com.repomind.repository.RepositoryEntityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DocumentationService {

    private final RepositoryEntityRepository repoRepository;
    private final DocumentationRepository docRepository;

    public DocumentationService(
            RepositoryEntityRepository repoRepository,
            DocumentationRepository docRepository) {
        this.repoRepository = repoRepository;
        this.docRepository = docRepository;
    }

    public DocumentationResponse getDocumentation(Long repoId) {
        RepositoryEntity repo = repoRepository.findById(repoId)
                .orElseThrow(() -> new ResourceNotFoundException("Repository not found with ID: " + repoId));

        List<Documentation> existing = docRepository.findByRepositoryId(repoId);
        if (existing.isEmpty()) {
            return generateDocumentation(repoId);
        }

        List<DocItemDto> items = existing.stream()
                .map(d -> new DocItemDto(d.getTitle(), d.getDocType(), d.getFilename(), d.getContent()))
                .toList();

        return new DocumentationResponse(repo.getId(), repo.getName(), items);
    }

    @Transactional
    public DocumentationResponse generateDocumentation(Long repoId) {
        RepositoryEntity repo = repoRepository.findById(repoId)
                .orElseThrow(() -> new ResourceNotFoundException("Repository not found with ID: " + repoId));

        docRepository.deleteByRepositoryId(repoId);

        List<DocItemDto> items = List.of(
                new DocItemDto("Project README", "README", "README.md", generateReadme(repo)),
                new DocItemDto("Architecture Blueprint", "ARCHITECTURE", "ARCHITECTURE.md", generateArchitectureDoc(repo)),
                new DocItemDto("REST API Specification", "API", "API_GUIDE.md", generateApiGuide(repo)),
                new DocItemDto("Developer Onboarding", "ONBOARDING", "ONBOARDING.md", generateOnboardingMarkdown(repo))
        );

        for (DocItemDto item : items) {
            docRepository.save(new Documentation(repo, item.docType(), item.title(), item.filename(), item.content()));
        }

        return new DocumentationResponse(repo.getId(), repo.getName(), items);
    }

    public OnboardingGuideDto getOnboardingGuide(Long repoId) {
        repoRepository.findById(repoId)
                .orElseThrow(() -> new ResourceNotFoundException("Repository not found with ID: " + repoId));

        List<Map<String, String>> keyDirectories = List.of(
                Map.of("path", "backend/src/main/java/com/demoshop/", "description", "Java 21 Spring Boot 3 controllers, domain services, JPA entities, and configs"),
                Map.of("path", "backend/src/main/resources/db/migration/", "description", "Flyway schema migration scripts ensuring database version control"),
                Map.of("path", "frontend/src/pages/", "description", "React storefront components (Login, Storefront Dashboard, Checkout)"),
                Map.of("path", "frontend/src/services/", "description", "Client API service abstraction with JWT bearer interceptors")
        );

        List<Map<String, String>> entryPoints = List.of(
                Map.of("name", "Backend Entry", "path", "backend/src/main/java/com/demoshop/DemoShopApplication.java", "description", "Spring Boot main method and component scan"),
                Map.of("name", "Frontend Entry", "path", "frontend/src/App.tsx", "description", "React Router view container and global state context"),
                Map.of("name", "Security Configuration", "path", "backend/src/main/java/com/demoshop/config/SecurityConfig.java", "description", "Spring Security filter chain and endpoint authorization rules")
        );

        List<OnboardingStepDto> authFlow = List.of(
                new OnboardingStepDto("1. Client Form Submission", "User inputs credentials into Login component", "frontend/src/pages/Login.tsx:15", "Validate form state"),
                new OnboardingStepDto("2. Client Service Call", "AuthService.login() posts to /api/auth/login", "frontend/src/services/authService.ts:18", "Attach credentials"),
                new OnboardingStepDto("3. Controller Dispatch", "AuthController passes request to UserService", "backend/src/main/java/com/demoshop/controller/AuthController.java:35", "Authenticate"),
                new OnboardingStepDto("4. Token Minting", "JwtTokenProvider creates signed HS256 JWT bearer token", "backend/src/main/java/com/demoshop/security/JwtTokenProvider.java:28", "Sign token"),
                new OnboardingStepDto("5. Client Storage", "Token stored in browser localStorage for subsequent API requests", "frontend/src/services/api.ts:10", "Store token")
        );

        List<OnboardingStepDto> databaseFlow = List.of(
                new OnboardingStepDto("1. Connection Pool", "HikariCP configures connection pool to PostgreSQL", "backend/src/main/resources/application.yml:10", "Connection pool"),
                new OnboardingStepDto("2. Flyway Migration", "V1 schema script provisions relational tables", "backend/src/main/resources/db/migration/V1__init_schema.sql:1", "Flyway migrate"),
                new OnboardingStepDto("3. JPA Mapping", "Entities map to SQL tables using Hibernate ORM", "backend/src/main/java/com/demoshop/model/User.java:10", "ORM mapping"),
                new OnboardingStepDto("4. Repository Queries", "Spring Data generates runtime queries", "backend/src/main/java/com/demoshop/repository/UserRepository.java:8", "Query execution")
        );

        List<OnboardingStepDto> apiFlow = List.of(
                new OnboardingStepDto("1. Client Trigger", "User submits checkout in React storefront", "frontend/src/pages/Checkout.tsx:20", "Trigger checkout"),
                new OnboardingStepDto("2. API Dispatch", "OrderController coordinates identity and cart state", "backend/src/main/java/com/demoshop/controller/OrderController.java:45", "Receive payload"),
                new OnboardingStepDto("3. Domain Orchestration", "PaymentService processes transaction gateway token", "backend/src/main/java/com/demoshop/service/PaymentService.java:30", "Process payment"),
                new OnboardingStepDto("4. Confirmation", "Order finalized and serialized response returned", "backend/src/main/java/com/demoshop/controller/OrderController.java:68", "Return status")
        );

        List<ReadingOrderDto> readingOrder = List.of(
                new ReadingOrderDto(1, "backend/src/main/resources/application.yml", "Configuration & Database Backing", "Inspect datasource and security settings first.", List.of("datasource", "flyway", "jwt")),
                new ReadingOrderDto(2, "backend/src/main/java/com/demoshop/model/User.java", "Core Domain Entities", "Understand the entities that define the system schema.", List.of("User", "Product", "Order")),
                new ReadingOrderDto(3, "backend/src/main/java/com/demoshop/config/SecurityConfig.java", "Spring Security Architecture", "Learn how requests are intercepted and guarded.", List.of("SecurityFilterChain", "PasswordEncoder")),
                new ReadingOrderDto(4, "backend/src/main/java/com/demoshop/service/UserService.java", "User Domain Logic", "Observe clean separation between controller routes and JPA repositories.", List.of("UserService", "getUserById")),
                new ReadingOrderDto(5, "backend/src/main/java/com/demoshop/service/PaymentService.java", "Payment Gateway & Strategy", "Inspect the payment decision tree and technical complexity hotspot.", List.of("PaymentService", "processPayment")),
                new ReadingOrderDto(6, "backend/src/main/java/com/demoshop/controller/OrderController.java", "API Endpoints & Routing", "See how the REST controller orchestrates multiple services into customer transactions.", List.of("checkout", "listProducts")),
                new ReadingOrderDto(7, "frontend/src/services/authService.ts", "Frontend Client API Architecture", "See how React connects with backend services.", List.of("AuthService", "login", "register"))
        );

        return new OnboardingGuideDto(
                "DemoShop is an e-commerce microservices platform demonstrating production separation between client presentation, Spring Boot API controllers, domain logic, and PostgreSQL persistence.",
                "Start PostgreSQL via Docker or local instance, run 'mvn spring-boot:run' inside /backend, and 'npm run dev' inside /frontend.",
                "Three-tier architecture: React TypeScript client, Spring Boot 3 Java 21 REST API, and PostgreSQL relational database with Flyway versioning.",
                keyDirectories,
                entryPoints,
                authFlow,
                databaseFlow,
                apiFlow,
                readingOrder
        );
    }

    private String generateReadme(RepositoryEntity repo) {
        return String.format("""
                # %s

                > Analyzed by **RepoMind Engineering Intelligence**

                ## Overview
                %s

                - **Default Branch**: `%s`
                - **Platform Architecture**: Spring Boot 3.x (Java 21) + React 18 (TypeScript) + PostgreSQL
                - **Engine Analysis Status**: `%s`

                ## Quick Start Guide

                ### Backend (Spring Boot 3 + Java 21)
                ```bash
                cd backend
                mvn clean install
                mvn spring-boot:run
                ```

                ### Frontend (React 18 + Vite)
                ```bash
                cd frontend
                npm install
                npm run dev
                ```
                """,
                repo.getName(),
                repo.getDescription() != null ? repo.getDescription() : "Production software architecture.",
                repo.getDefaultBranch(),
                repo.getAnalysisStatus()
        );
    }

    private String generateArchitectureDoc(RepositoryEntity repo) {
        return String.format("""
                # Architecture Specification: %s

                ```mermaid
                graph TD
                    Client["React 18 SPA (TypeScript)"]
                    Gateway["Spring Boot 3 REST API Gateway"]
                    Security["Spring Security & JWT Provider"]
                    Services["Domain Services (Order, Payment, User)"]
                    DB[("PostgreSQL Database")]

                    Client -->|HTTP / REST| Gateway
                    Gateway -->|Token Filter| Security
                    Gateway -->|Dispatches| Services
                    Services -->|Spring Data JPA| DB
                ```

                ### 1. Presentation Tier (Frontend)
                - Single Page Application built with React 18, TypeScript, Tailwind CSS, and React Flow.
                - Communicates with backend using centralized API clients.

                ### 2. Controller Tier (API)
                - Spring MVC REST controllers validating input payloads using Bean Validation.
                - Exposes secured endpoints with JWT bearer authentication.

                ### 3. Business Service Tier
                - Encapsulates domain logic (`UserService`, `OrderService`, `PaymentService`).
                - Manages transactional integrity using `@Transactional`.

                ### 4. Persistence Tier
                - Spring Data JPA with Hibernate ORM and HikariCP connection pooling.
                - Database schema migrations automated via Flyway.
                """, repo.getName());
    }

    private String generateApiGuide(RepositoryEntity repo) {
        return """
                # REST API Documentation

                ## Authentication

                ### `POST /api/auth/register`
                Register a new developer account.
                - **Request**: `{ "name": "Sarah", "email": "sarah@example.com", "password": "password123" }`
                - **Response**: `{ "accessToken": "...", "tokenType": "Bearer", "user": { ... } }`

                ### `POST /api/auth/login`
                Authenticate with email and password.
                - **Request**: `{ "email": "sarah@example.com", "password": "password123" }`

                ---

                ## Codebase Intelligence

                ### `GET /api/repositories/{id}/files`
                Retrieve indexed file list with line counts and sizes.

                ### `GET /api/repositories/{id}/architecture`
                Fetch inferred system tiers and cross-layer connection graph.

                ### `GET /api/repositories/{id}/security`
                Retrieve static vulnerability audit and security score.

                ### `GET /api/repositories/{id}/technical-debt`
                Fetch cyclomatic complexity index and codebase hotspots.

                ### `POST /api/repositories/{id}/chat`
                Grounded conversational intelligence with source citations.
                """;
    }

    private String generateOnboardingMarkdown(RepositoryEntity repo) {
        return """
                # Codebase Onboarding Blueprint

                Welcome to the repository! Recommended sequence for new contributors:

                1. `backend/src/main/resources/application.yml`: Review database and environment configuration.
                2. `backend/src/main/java/com/demoshop/model/`: Inspect database schemas and entity relationships.
                3. `backend/src/main/java/com/demoshop/config/SecurityConfig.java`: Understand JWT authentication.
                4. `backend/src/main/java/com/demoshop/service/`: Study domain services.
                5. `frontend/src/services/api.ts`: Inspect client integration.
                """;
    }
}
