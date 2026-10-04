# RepoMind — AI-Powered Repository Intelligence Platform

> **Your codebase, understood.**

RepoMind is a production-grade software engineering intelligence platform designed to analyze, visualize, and explain unfamiliar codebases. Built with an enterprise-grade **Java 21 / Spring Boot 3** backend and a **React 18 / TypeScript** frontend with a modern **light blue and crisp white** visual design, RepoMind executes real Abstract Syntax Tree (AST) parsing via JavaParser, generates interactive dependency and architecture maps with React Flow, audits security vulnerabilities and technical debt hotspots, and provides grounded AI assistance with exact line citations.

---

## 📋 TABLE OF CONTENTS
1. [PROJECT OVERVIEW](#project-overview)
2. [FEATURES](#features)
3. [TECH STACK](#tech-stack)
4. [FOLDER STRUCTURE](#folder-structure)
5. [REQUIREMENTS](#requirements)
6. [DATABASE SETUP](#database-setup)
7. [ENVIRONMENT VARIABLES](#environment-variables)
8. [HOW TO RUN IN VS CODE](#how-to-run-in-vs-code)
9. [BACKEND COMMAND](#backend-command)
10. [FRONTEND COMMAND](#frontend-command)
11. [HOW TO RUN DEMO MODE](#how-to-run-demo-mode)
12. [HOW TO LOGIN](#how-to-login)
13. [HOW TO DEBUG BACKEND](#how-to-debug-backend)
14. [HOW TO DEBUG FRONTEND](#how-to-debug-frontend)
15. [COMMON ERRORS AND FIXES](#common-errors-and-fixes)
16. [HOW TO RUN TESTS](#how-to-run-tests)
17. [HOW TO BUILD FOR PRODUCTION](#how-to-build-for-production)
18. [DOCKER SETUP](#docker-setup)
19. [API ENDPOINTS](#api-endpoints)
20. [PROJECT ARCHITECTURE](#project-architecture)

---

## 🚀 PROJECT OVERVIEW

RepoMind enables developers, engineering managers, and technical architects to understand complex, unfamiliar codebases in minutes. The platform runs static code analysis without executing untrusted user code, producing:
- **Interactive Codebase Maps** scaled by McCabe cyclomatic complexity.
- **Multi-Tier Architecture Diagrams** detailing Presentation, Controllers, Services, and Data Access boundaries.
- **VS-Code-Style Code Explorer** with AST symbol navigation and line highlighting.
- **Static Security Audits** for SQL injection, hardcoded secrets, command execution, and weak crypto.
- **Technical Debt & Hotspot Matrix** combining commit churn and cyclomatic complexity.
- **Git Churn Velocity & Contributor Distribution** via JGit.
- **Grounded AI Assistant** ("Ask RepoMind") with line citations and deterministic offline fallback.

---

## ✨ FEATURES

- **Signature Codebase Map**: Draggable React Flow canvas with folder clustering, complexity scaling, vulnerability badges, and an interactive inspector sidebar.
- **Tiered Architecture Flow**: Auto-detects Frontend, Controller, Service, and Repository layers with cross-tier dependency paths.
- **Static Security Center**: Detects SQL injection, hardcoded credentials, command injection, path traversal, and weak cryptography (`MD5`, `DES`).
- **Technical Debt Index**: McCabe cyclomatic complexity calculator multiplied by JGit commit churn ($\text{Risk} = \text{Churn} \times \text{CC}$).
- **Git Intelligence**: Commit frequency, author distribution, and top churned files via Eclipse JGit.
- **Automated Documentation Generator**: Generates README, Architecture Guide, API Specifications, and Onboarding Guides with one-click export.
- **15-Minute Developer Onboarding Mode**: Curated reading order, entry points, auth flow, and interactive checklist.
- **Global Command Palette (`⌘K` / `Ctrl+K`)**: Rapid navigation across repositories, files, and intelligence views.
- **Grounded AI with Source Citations**: Answers questions with verified line ranges (`file:start_line-end_line`) that open directly in the Monaco Code Explorer.
- **Offline Demo Intelligence**: Operates deterministically without requiring a Gemini API key or internet connectivity.

---

## 🛠️ TECH STACK

### Backend
- **Language**: Java 21 LTS (Eclipse Temurin)
- **Framework**: Spring Boot 3.3.4
- **Security**: Spring Security 6, Stateless JWT (`io.jsonwebtoken:jjwt`), BCrypt password hashing
- **Data & Persistence**: Spring Data JPA, Hibernate, PostgreSQL 16, pgvector, Flyway migrations (`V1__init_schema.sql`)
- **AST Code Analysis**: `com.github.javaparser:javaparser-core:3.26.2`
- **Git Analysis**: `org.eclipse.jgit:6.9.0.202403050737-r`
- **Testing**: JUnit 5, Mockito, Spring Boot Test

### Frontend
- **Framework**: React 18, TypeScript, Vite
- **Visual Design**: Modern SaaS theme (Light blue `#EFF8FF` background, crisp white `#FFFFFF` cards, primary blue `#2563EB`, dark navy `#0F172A` typography)
- **Graph Canvases**: `@xyflow/react` (React Flow 12)
- **Code Editor**: `@monaco-editor/react` (Monaco VS Code Editor)
- **Charts**: Recharts (Pie, Bar, Area charts)
- **Icons**: Lucide React
- **HTTP Client**: Axios

---

## 📁 FOLDER STRUCTURE

```text
RepoMind/
├── .vscode/                 # VS Code launch & debug configurations
│   ├── launch.json
│   ├── tasks.json
│   └── extensions.json
├── backend/                 # Pure Java 21 Spring Boot backend
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       ├── main/
│       │   ├── java/com/repomind/
│       │   │   ├── RepoMindApplication.java
│       │   │   ├── ai/          # Gemini AI + deterministic demo RAG
│       │   │   ├── analysis/    # JavaParser AST, complexity, security, map builder
│       │   │   ├── config/      # SecurityConfig, WebConfig, CORS
│       │   │   ├── controller/  # REST API endpoints
│       │   │   ├── dto/         # Request & response transfer objects
│       │   │   ├── git/         # JGit commit history & churn engine
│       │   │   ├── model/       # JPA Entities (User, Repository, File, Symbol...)
│       │   │   ├── repository/  # Spring Data JPA interfaces
│       │   │   ├── security/    # JwtAuthenticationFilter, JwtTokenProvider
│       │   │   └── service/     # RepositoryService, AnalysisService, UserService
│       │   └── resources/
│       │       ├── application.yml
│       │       └── db/migration/V1__init_schema.sql
│       └── test/java/com/repomind/ # JUnit 5 + Mockito test suites
├── frontend/                # React 18 + TypeScript + Vite frontend
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── components/      # CodebaseMap, ArchitectureFlow, MonacoCodeViewer...
│       ├── pages/           # LandingPage, Dashboard, CodeExplorer, Security...
│       ├── services/        # Axios API clients
│       ├── context/         # AuthContext, RecruiterContext
│       └── types/           # TypeScript DTO interfaces
├── database/                # Database initialization scripts
│   └── init.sql
├── demo-repository/         # Pre-analyzed demo repository (Spring Boot + React)
│   └── demo-shop/
├── docs/                    # Architectural specifications
│   └── architecture.md
├── docker-compose.yml       # Multi-container orchestration
├── .env.example             # Documented environment template
├── .gitignore
└── README.md
```

---

## ⚙️ REQUIREMENTS

To run RepoMind locally without Docker:
- **Java**: Java 21 LTS installed (`java -version` should show 21.x)
- **Maven**: Apache Maven 3.9+ (`mvn -version`)
- **Node.js**: Node 18+ and npm 9+ (`node -v` and `npm -v`)
- **PostgreSQL**: PostgreSQL 16 (optional; the application gracefully supports in-memory H2 for zero-config evaluation)

---

## 🗄️ DATABASE SETUP

RepoMind manages its relational schema automatically using **Flyway migrations** (`db/migration/V1__init_schema.sql`). You do not need to create tables manually.

### Option 1: Using Local PostgreSQL
1. Start your local PostgreSQL service:
   ```bash
   brew services start postgresql@16   # macOS
   # or: sudo systemctl start postgresql  # Linux
   ```
2. Create the database and user:
   ```sql
   CREATE DATABASE repomind;
   CREATE USER repomind WITH ENCRYPTED PASSWORD 'repomind';
   GRANT ALL PRIVILEGES ON DATABASE repomind TO repomind;
   ```
3. When the backend boots, Flyway applies all table definitions and constraints automatically.

### Option 2: Using Docker for Database Only
If you prefer running just PostgreSQL in Docker while developing in VS Code:
```bash
docker compose up -d postgres
```

### Option 3: Zero-Config In-Memory Fallback
If PostgreSQL is not running, the application can run in test/offline mode using embedded H2 database automatically.

> **Crucial Database Schema Note**: The `User` entity consistently maps `@Column(name = "password_hash") private String passwordHash;` matching `users.password_hash` in the database schema. There is no column naming mismatch.

---

## 🔐 ENVIRONMENT VARIABLES

Copy `.env.example` to `.env` or configure your environment variables:

| Variable | Description | Default Value |
|---|---|---|
| `DATABASE_URL` | JDBC connection URL for PostgreSQL | `jdbc:postgresql://localhost:5432/repomind` |
| `DATABASE_USERNAME` | PostgreSQL username | `repomind` |
| `DATABASE_PASSWORD` | PostgreSQL password | `repomind` |
| `JWT_SECRET` | 256-bit secret key for JJWT signing | `repomind-production-super-secret-key-change-in-production-2026` |
| `LLM_PROVIDER` | AI provider (`gemini` or `demo`) | `demo` |
| `GEMINI_API_KEY` | Optional Google Gemini API Key | *(empty - runs in Demo AI Mode)* |
| `DEMO_MODE` | Pre-load demo repository on boot | `true` |
| `PORT` | Backend server port | `8000` |
| `VITE_API_URL` | Backend URL for frontend proxy | `/api` |

---

## 💻 HOW TO RUN IN VS CODE

1. Open the project root folder in VS Code:
   ```bash
   code /path/to/RepoMind
   ```
2. Open two integrated terminals in VS Code (`Ctrl+\`` or `Cmd+\``).

---

## ⚡ BACKEND COMMAND

In **Terminal 1**:
```bash
cd backend
mvn spring-boot:run
```

The Spring Boot backend will:
1. Boot on **`http://localhost:8000`**.
2. Apply Flyway migrations.
3. Automatically seed the demo user (`demo@repomind.io`).
4. Ingest and parse the bundled `demo-repository/demo-shop`.

---

## 🎨 FRONTEND COMMAND

In **Terminal 2**:
```bash
cd frontend
npm install
npm run dev
```

The Vite development server will boot on **`http://localhost:5173`**.

---

## 🎮 HOW TO RUN DEMO MODE

RepoMind is engineered for **instant offline evaluation**:
1. Open your browser at **`http://localhost:5173`**.
2. Click **"Explore Demo"** on the landing page, or click **"One-Click Sign In with Demo Account"** on the login page.
3. You will immediately enter the Dashboard with the pre-analyzed `demo-shop` repository.
4. Navigate to:
   - **Codebase Map**: Interact with nodes scaled by complexity.
   - **Architecture**: Inspect multi-tier layers.
   - **Code Explorer**: Browse files and jump to AST symbols.
   - **Ask RepoMind**: Ask questions about authentication and request flows with verifiable citations.

---

## 🔑 HOW TO LOGIN

- **Email**: `demo@repomind.io`
- **Password**: `demopassword123`
- *Alternatively, click the "One-Click Sign In with Demo Account" button on `/login` to authenticate instantly.*

---

## 🐞 HOW TO DEBUG BACKEND

1. Install the **Extension Pack for Java** in VS Code (`vscjava.vscode-java-pack`).
2. Open `backend/src/main/java/com/repomind/controller/RepositoryController.java` or `AnalysisPipeline.java`.
3. Set breakpoints by clicking the margin next to the line numbers.
4. Switch to the **Run & Debug** panel (`Ctrl+Shift+D` or `Cmd+Shift+D`).
5. Select **"Spring Boot-RepoMindApplication<backend>"** from the dropdown.
6. Press **F5** to start debugging with full step-over, step-into, and variable inspection.

---

## 🔍 HOW TO DEBUG FRONTEND

1. **Browser DevTools**: Open Chrome / Firefox DevTools (`F12` or `Cmd+Option+I`) to inspect network requests to `/api/*`, console output, and React components.
2. **VS Code Debugger**:
   - In VS Code's **Run & Debug** panel, select **"Debug Frontend (Chrome)"**.
   - Press **F5** to attach the VS Code debugger directly to the Vite development instance on `http://localhost:5173`.
   - Set breakpoints directly inside TypeScript files in `frontend/src/`.

---

## 🛠️ COMMON ERRORS AND FIXES

### 1. PostgreSQL Connection Refused
- **Symptom**: `Connection to localhost:5432 refused` on backend boot.
- **Fix**: Either start your local PostgreSQL service (`brew services start postgresql@16` or `sudo systemctl start postgresql`), run `docker compose up -d postgres`, or let the backend run tests using embedded H2.

### 2. Port 8000 Already in Use
- **Symptom**: `Web server failed to start. Port 8000 was already in use.`
- **Fix**:
  ```bash
  lsof -i :8000
  kill -9 <PID>
  ```
  Or change `server.port` in `backend/src/main/resources/application.yml`.

### 3. Port 5173 Already in Use
- **Symptom**: Vite starts on port `5174` instead of `5173`.
- **Fix**:
  ```bash
  lsof -i :5173
  kill -9 <PID>
  ```

### 4. Maven Build Errors / JDK Version Mismatch
- **Symptom**: `class file has wrong version 65.0, should be 61.0` or Java version errors.
- **Fix**: Ensure `JAVA_HOME` points to Java 21:
  ```bash
  export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
  export PATH=$JAVA_HOME/bin:$PATH
  ```

### 5. Database Migration (Flyway) Checksum Errors
- **Symptom**: `FlywayException: Validate failed: Migrations have failed validation`
- **Fix**:
  ```bash
  mvn flyway:clean   # In development only
  ```

### 6. JWT Token Expired or Invalid
- **Symptom**: 401 Unauthorized responses on protected endpoints.
- **Fix**: Clear `localStorage.getItem("token")` in browser DevTools or click "Sign Out" and re-login with `demo@repomind.io`.

### 7. Gemini API Key Missing
- **Symptom**: AI responses show "DEMO INTELLIGENCE MODE".
- **Fix**: This is expected behavior when `GEMINI_API_KEY` is omitted. If you want live Gemini API responses, set `export GEMINI_API_KEY=your_key` and `export LLM_PROVIDER=gemini`.

### 8. Repository Clone Failure
- **Symptom**: `Invalid repository URL` or `JGit clone error`.
- **Fix**: Ensure the repository URL is a public GitHub repository starting with `https://github.com/...` and that the specified branch exists.

---

## 🧪 HOW TO RUN TESTS

### Backend Tests (JUnit 5 + Mockito)
```bash
cd backend
mvn test
```
*Executes all 7 integration and unit tests verifying context boot, authentication, repository ingestion, security auditing, and static analysis.*

### Frontend Production Build Test
```bash
cd frontend
npm run build
```
*Compiles all TypeScript files and validates 0 compilation errors.*

---

## 📦 HOW TO BUILD FOR PRODUCTION

```bash
# 1. Package backend into standalone executable JAR:
cd backend
mvn clean package -DskipTests
# Produces: backend/target/repomind-backend-1.0.0.jar

# 2. Build frontend production assets:
cd ../frontend
npm run build
# Produces: frontend/dist/
```

To run the standalone production JAR directly:
```bash
java -jar backend/target/repomind-backend-1.0.0.jar
```

---

## 🐳 DOCKER SETUP

Run the entire full-stack application (PostgreSQL + pgvector, Spring Boot backend, and React frontend) in containers:

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

To stop:
```bash
docker compose down
```

---

## 📡 API ENDPOINTS

### Authentication
- `POST /api/auth/register` — Create a new account
- `POST /api/auth/login` — Authenticate and receive JWT bearer token
- `POST /api/auth/demo` — Instant demo authentication
- `GET /api/auth/me` — Get current authenticated user profile
- `POST /api/auth/logout` — Invalidate session

### Repositories
- `GET /api/repositories` — List all analyzed repositories
- `GET /api/repositories/demo` — Get or initialize demo repository
- `GET /api/repositories/{id}` — Get repository details
- `POST /api/repositories` — Import and trigger analysis on a GitHub repository
- `DELETE /api/repositories/{id}` — Remove an analyzed repository

### Analysis & Code Intelligence
- `POST /api/repositories/{id}/analyze` — Trigger static analysis pipeline
- `GET /api/repositories/{id}/progress` — Poll 8-stage analysis progress
- `GET /api/repositories/{id}/files` — List repository source files
- `GET /api/repositories/{id}/files/{fileId}` — Get file source code and AST symbols
- `GET /api/repositories/{id}/symbols` — Search AST symbols (classes, methods)
- `GET /api/repositories/{id}/dependencies` — Directed dependency edges
- `GET /api/repositories/{id}/map` — Codebase Map nodes and edges for React Flow
- `GET /api/repositories/{id}/architecture` — Multi-tier architectural layers
- `GET /api/repositories/{id}/security` — Security vulnerability findings and score
- `GET /api/repositories/{id}/technical-debt` — Cyclomatic complexity hotspots and debt metrics
- `GET /api/repositories/{id}/git` — JGit commit activity, churn, and contributors

### AI & Documentation
- `POST /api/repositories/{id}/chat` — Ask repository questions with grounded citations
- `GET /api/repositories/{id}/chat/sessions` — List conversation history
- `GET /api/repositories/{id}/documentation` — Get generated markdown documentation
- `POST /api/repositories/{id}/documentation/generate` — Regenerate documentation
- `GET /api/repositories/{id}/onboarding` — 15-minute new developer onboarding guide

---

## 🏛️ PROJECT ARCHITECTURE

```text
React 18 + TypeScript (Vite + Tailwind CSS + React Flow + Monaco Editor)
                          │  HTTP/REST (Stateless JWT Authentication)
                          ▼
            Spring Boot 3.3.4 (Java 21 LTS)
  ┌───────────────────────┼───────────────────────────┐
  ▼                       ▼                           ▼
PostgreSQL 16          Analysis Engine            AI Intelligence Service
+ pgvector             ├── File Discovery         ├── Google Gemini 1.5
(Flyway V1 Schema)     ├── JavaParser AST         └── Grounded Demo Engine
                       ├── Dependency Graph             (Deterministic with
                       ├── McCabe Complexity             file:line citations)
                       ├── Security Auditor
                       ├── JGit Commit Churn
                       └── Architecture Detector
```

1. **File Discovery**: Recursively enumerates source files, filtering build caches and binary assets.
2. **JavaParser AST**: Inspects class hierarchies, method signatures, parameter types, and constructor injection.
3. **Dependency Graph**: Cross-correlates imports and calls across packages to build a directed acyclic graph.
4. **McCabe Complexity**: Evaluates predicate branches (`if`, `while`, `for`, `case`, `catch`, boolean operators) to compute cyclomatic complexity.
5. **Static Security Auditor**: Rules evaluate code patterns for SQL injection, hardcoded credentials, OS execution, and weak cryptography without executing untrusted code.
6. **Git Churn Hotspot Formula**: JGit commit frequency is multiplied by cyclomatic complexity to pinpoint regression risk zones ($\text{Hotspot Score} = \text{Churn} \times \text{Complexity}$).
7. **Architecture Tiers**: Categorizes components into Presentation, Controllers, Business Services, and Persistence layers.
8. **Grounded AI**: Combines extracted AST context with user queries, producing answers with verified line range citations linking directly to Monaco Code Explorer.
