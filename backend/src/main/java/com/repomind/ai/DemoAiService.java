package com.repomind.ai;

import com.repomind.dto.ChatDto.SourceCitationDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemoAiService {

    public record DemoAiAnswer(String content, List<SourceCitationDto> citations) {}

    public DemoAiAnswer answerQuery(String query) {
        String q = query.toLowerCase();

        if (q.contains("auth") || q.contains("login") || q.contains("token") || q.contains("jwt") || q.contains("credential")) {
            String content = """
                    ### Authentication Architecture & Request Flow

                    The platform implements a stateless authentication mechanism utilizing **JSON Web Tokens (JWT)** and **BCrypt / SHA-256** password hashing.

                    #### 1. Credential Verification & Token Issuance
                    When a user submits credentials to `POST /api/auth/login`:
                    - Handled by `backend/src/main/java/com/demoshop/controller/AuthController.java` (lines 35-55).
                    - `UserService.java` looks up the user account and verifies password hashes against the PostgreSQL `users` table.
                    - `JwtTokenProvider.java` mints a signed HS256 token containing claims `{"sub": user.getEmail(), "userId": user.getId()}` with a 24-hour expiration.

                    #### 2. Frontend Client Integration
                    The React storefront client interacts via `frontend/src/services/authService.ts`:
                    - Formats incoming credentials into standard JSON requests.
                    - Saves the returned token into browser `localStorage`.
                    - `frontend/src/services/api.ts` attaches the token via the `Authorization: Bearer <token>` header on subsequent requests.

                    #### 3. Security Findings Identified
                    > ⚠️ **Security Alert**: `backend/src/main/java/com/demoshop/config/SecurityConfig.java:24` permits wildcard CORS origins (`allowedOrigins("*")`), which should be restricted to trusted domains.
                    """;

            List<SourceCitationDto> citations = List.of(
                    new SourceCitationDto("backend/src/main/java/com/demoshop/controller/AuthController.java", 35, 55, "login() and register() endpoint controllers", "Authentication endpoint entry point"),
                    new SourceCitationDto("backend/src/main/java/com/demoshop/service/UserService.java", 18, 45, "loadUserByUsername() and verifyCredentials()", "User business logic and credential verification"),
                    new SourceCitationDto("frontend/src/services/authService.ts", 15, 42, "AuthService.login(email, password)", "Client authentication wrapper and token persistence")
            );

            return new DemoAiAnswer(content, citations);

        } else if (q.contains("database") || q.contains("connection") || q.contains("initialized") || q.contains("db") || q.contains("postgres")) {
            String content = """
                    ### Database Architecture & Connection Initialization

                    Persistence is managed via **Spring Data JPA** and **Hibernate 6.x** backed by a **PostgreSQL** relational database.

                    #### Key Components & Flow:
                    1. **Configuration**: Defined in `backend/src/main/resources/application.yml` (lines 8-22).
                       - Connects to PostgreSQL using HikariCP connection pooling (`maximum-pool-size: 10`).
                    2. **Schema Migration**: Managed by **Flyway** (`db/migration/V1__init_schema.sql`).
                       - Schema tables for `users`, `products`, and `orders` are automatically provisioned at application boot.
                    3. **Entity Mappings**: Core entities are mapped in `backend/src/main/java/com/demoshop/model/`:
                       - `User.java`: User account and role details.
                       - `Product.java`: Catalog inventory and price decimal.
                       - `Order.java`: Order state machine and transaction identifiers.
                    4. **Transactional Boundary**: Service methods annotate with `@Transactional` to guarantee ACID isolation.
                    """;

            List<SourceCitationDto> citations = List.of(
                    new SourceCitationDto("backend/src/main/resources/application.yml", 8, 22, "datasource.url: jdbc:postgresql://...", "Database connection pool configuration"),
                    new SourceCitationDto("backend/src/main/resources/db/migration/V1__init_schema.sql", 1, 35, "CREATE TABLE users; CREATE TABLE orders;", "Flyway relational schema migration"),
                    new SourceCitationDto("backend/src/main/java/com/demoshop/repository/UserRepository.java", 10, 25, "public interface UserRepository extends JpaRepository", "Spring Data JPA persistence interface")
            );

            return new DemoAiAnswer(content, citations);

        } else if (q.contains("userservice") || q.contains("depend on userservice") || q.contains("user service")) {
            String content = """
                    ### Dependency Analysis: UserService

                    `UserService.java` (`backend/src/main/java/com/demoshop/service/UserService.java`) acts as the core domain boundary for customer records and authentication queries.

                    #### Inbound Dependents (Files depending on `UserService`):
                    1. **`AuthController.java:28`**: Injected via constructor to validate credentials and register new customer accounts.
                    2. **`OrderController.java:42`**: Injected to verify user active status prior to creating pending checkout carts.
                    3. **`CustomUserDetailsService.java:18`**: Leveraged by Spring Security to populate security context authentication tokens.

                    #### Methods Exposed:
                    - `getUserById(Long id)`: Retrieves active user or throws `ResourceNotFoundException`.
                    - `findUserByEmail(String email)`: Lookup by unique index.
                    - `registerNewUser(RegisterDto dto)`: Hashes password and persists record.
                    """;

            List<SourceCitationDto> citations = List.of(
                    new SourceCitationDto("backend/src/main/java/com/demoshop/service/UserService.java", 15, 60, "public class UserService { getUserById, registerNewUser }", "User domain service definition"),
                    new SourceCitationDto("backend/src/main/java/com/demoshop/controller/OrderController.java", 40, 52, "userService.getUserById(request.getUserId())", "Order controller checkout user verification")
            );

            return new DemoAiAnswer(content, citations);

        } else if (q.contains("paymentservice") || q.contains("modify paymentservice") || q.contains("payment service") || q.contains("break")) {
            String content = """
                    ### Impact Analysis: Modifying PaymentService

                    Modifying `backend/src/main/java/com/demoshop/service/PaymentService.java` carries **high systemic risk** because it is tightly coupled with transactional order finalization.

                    #### What Would Break:
                    1. **`OrderController.java:55` (`checkout` endpoint)**:
                       - Directly depends on `PaymentService.processPayment(orderId, amount, token)` returning a `PaymentResult(boolean success, String transactionId)`.
                       - Any signature mutation or unhandled exception will cause checkout requests to fail with HTTP 500 errors.
                    2. **`OrderService.java:38`**:
                       - Requires a valid `transactionId` string to transition orders from `PENDING` to `COMPLETED`.
                    3. **`frontend/src/pages/Checkout.tsx:22`**:
                       - Expects confirmed payment status and displays error alerts if transaction processing declines.

                    #### Recommendations Before Refactoring:
                    - Extract provider routing into an abstract `PaymentGatewayStrategy` interface.
                    - Add unit tests verifying 3DS verification and decline branches (`tok_visa`, `tok_fail`, `tok_fraud`).
                    """;

            List<SourceCitationDto> citations = List.of(
                    new SourceCitationDto("backend/src/main/java/com/demoshop/service/PaymentService.java", 20, 65, "public PaymentResult processPayment(Long orderId, Double amount, String token)", "Payment gateway routing decision tree"),
                    new SourceCitationDto("backend/src/main/java/com/demoshop/controller/OrderController.java", 50, 72, "paymentService.processPayment(order.getId(), order.getTotal(), req.getToken())", "Order controller dispatching checkout payment")
            );

            return new DemoAiAnswer(content, citations);

        } else if (q.contains("request flow") || q.contains("login to dashboard") || q.contains("flow")) {
            String content = """
                    ### End-to-End Request Flow: Login to Dashboard

                    ```text
                    User Browser -> Login.tsx -> authService.login() -> POST /api/auth/login
                                                                            ↓
                    localStorage <- Bearer JWT Token <- Spring Boot AuthController.java
                          ↓
                    Dashboard.tsx -> api.get('/products') -> GET /api/products
                                                                ↓
                    Product Grid <- JSON Product List <- ProductController.java -> PostgreSQL
                    ```

                    1. **Credential Submission**: User enters email & password on `frontend/src/pages/Login.tsx:12-30`.
                    2. **Authentication Route**: `AuthController.java:35` verifies hashed password with `UserService`.
                    3. **Token Issuance**: `JwtTokenProvider.java` issues signed bearer token; client stores it in `localStorage`.
                    4. **Catalog Retrieval**: React mounts `Dashboard.tsx`, dispatching `GET /api/products` with `Authorization: Bearer <token>`.
                    5. **Query & Rendering**: `ProductController.java` queries `ProductRepository` and serializes inventory cards.
                    """;

            List<SourceCitationDto> citations = List.of(
                    new SourceCitationDto("frontend/src/pages/Login.tsx", 12, 35, "const handleSubmit = async (e) => { ... }", "Login form submission handler"),
                    new SourceCitationDto("backend/src/main/java/com/demoshop/controller/AuthController.java", 35, 52, "public ResponseEntity<?> login(@RequestBody LoginRequest req)", "Spring Boot authentication endpoint"),
                    new SourceCitationDto("frontend/src/pages/Dashboard.tsx", 15, 45, "useEffect(() => { api.get('/products') }, [])", "Storefront catalog dashboard component")
            );

            return new DemoAiAnswer(content, citations);

        } else if (q.contains("technical debt") || q.contains("debt") || q.contains("highest")) {
            String content = """
                    ### Technical Debt Assessment

                    Calculated across AST complexity, cyclomatic branch indicators, method length, and maintenance markers:

                    #### 1. Highest Debt Hotspot: `PaymentService.java`
                    - **Cyclomatic Complexity**: `16` (highest in repo).
                    - **Root Cause**: Monolithic decision tree evaluating token prefixes (`tok_visa`, `tok_mastercard`, `tok_fail`, `tok_fraud`).
                    - **Debt Markers**: Documented `TODO` (refactor into strategy pattern) and `FIXME` (concurrent webhook race condition).

                    #### 2. High Churn Hotspot: `OrderController.java`
                    - High coupling: directly coordinates `UserService`, `OrderService`, and `PaymentService` inside route handlers.
                    - TODO detected: Missing caching layer for high-traffic browsing.
                    """;

            List<SourceCitationDto> citations = List.of(
                    new SourceCitationDto("backend/src/main/java/com/demoshop/service/PaymentService.java", 25, 58, "if (token.startsWith('tok_visa')) { ... }", "High cyclomatic complexity decision tree"),
                    new SourceCitationDto("backend/src/main/java/com/demoshop/controller/OrderController.java", 35, 60, "// TODO: Add Redis cache layer for high-traffic catalog browsing", "Controller architectural coupling")
            );

            return new DemoAiAnswer(content, citations);

        } else {
            String content = String.format("""
                    ### Engineering Intelligence Overview

                    Regarding your inquiry **"%s"**:

                    - **Architecture & Structure**: Decoupled full-stack architecture featuring a React 18 TypeScript frontend and a Java 21 Spring Boot 3 backend.
                    - **Domain Services**: Business logic is encapsulated in dedicated service classes (`UserService`, `OrderService`, `PaymentService`).
                    - **Data Layer**: Relational persistence managed by Spring Data JPA and PostgreSQL with Flyway database migrations.
                    - **Observability**: Analyzed for AST symbols, McCabe cyclomatic complexity, JGit commit velocity, and static security vulnerabilities.
                    """, query);

            List<SourceCitationDto> citations = List.of(
                    new SourceCitationDto("backend/src/main/java/com/demoshop/DemoShopApplication.java", 1, 20, "public class DemoShopApplication", "Backend entry point"),
                    new SourceCitationDto("frontend/src/App.tsx", 1, 30, "export const App: React.FC", "Frontend application entry point")
            );

            return new DemoAiAnswer(content, citations);
        }
    }
}
