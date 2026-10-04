# RepoMind Architectural Specification

## 1. Executive Summary & Design Philosophy

RepoMind is an intelligence platform for engineering organizations, technical leads, and software engineers onboarding onto unfamiliar codebases. The core design philosophy centers on:

1. **Pure Java 21 LTS Enterprise Backend**: Built on Spring Boot 3.3.4, JJWT, and Spring Data JPA, providing high concurrency, type safety, and memory-efficient static parsing without any Python runtime dependencies.
2. **Zero Untrusted Code Execution**: RepoMind operates strictly as a static analysis engine. No compiler execution, script evaluation, or arbitrary code execution takes place during repository analysis.
3. **Multi-View Code Intelligence**: Moving beyond simple text search, RepoMind constructs visual models including an interactive Codebase Map (`@xyflow/react`), Multi-Tier Architecture diagrams, and an integrated VS Code Monaco Editor.
4. **Deterministic Grounded AI**: Language models are grounded by structured AST references and deterministic fallbacks. When external API keys are unavailable, RepoMind provides verified, citation-backed answers linking directly to source lines.

---

## 2. Full-Stack Component Topology

```
┌────────────────────────────────────────────────────────┐
│               Frontend (React 18 + TS)                 │
│  - React Router (Hierarchical Intelligence Views)      │
│  - React Flow 12 (Codebase Map & Architecture Tiers)   │
│  - Monaco Editor (Syntax Highlighting & Symbol Jump)   │
│  - Command Palette (⌘K) & Recruiter Architecture Walk  │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP REST (JWT Bearer)
┌──────────────────────────▼─────────────────────────────┐
│             Backend API Gateway & Security             │
│  - Spring Security 6 (Stateless JWT Filter)            │
│  - Controllers: Auth, Repo, Analysis, AI, Docs         │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│          Static Analysis Pipeline Engine               │
│  Stage 1: File Discovery & Language Classification     │
│  Stage 2: JavaParser AST Symbol Extraction             │
│  Stage 3: Cross-File Dependency Graph Resolution       │
│  Stage 4: McCabe Cyclomatic Complexity Calculation     │
│  Stage 5: Static Security & Vulnerability Auditor      │
│  Stage 6: JGit History & Hotspot Risk Analyzer         │
│  Stage 7: Architectural Tier Detection                 │
│  Stage 8: Codebase Map Node & Edge Layout Synthesis    │
└──────────────┬───────────────────────────┬─────────────┘
               │                           │
┌──────────────▼─────────────┐ ┌───────────▼─────────────┐
│     PostgreSQL 16          │ │    Dual-Mode AI Engine  │
│  - Flyway V1 Schema        │ │  - Gemini 1.5 Pro/Flash │
│  - pgvector Embeddings     │ │  - Grounded Deterministic│
│  - 13 JPA Relational Model │ │    Offline Retrieval    │
└────────────────────────────┘ └─────────────────────────┘
```

---

## 3. The 8-Stage Static Analysis Pipeline

The pipeline is implemented in `com.repomind.analysis.AnalysisPipeline` and orchestrates eight sequential analysis phases:

### Stage 1: File Discovery & Language Classification
- Traverses repository directories recursively, ignoring standard ignore patterns (`.git`, `node_modules`, `target`, `dist`, `build`, `bin`, `.idea`).
- Classifies files using file extensions and signature headers into supported language types: Java, TypeScript, JavaScript, Python, SQL, HTML, CSS, JSON, Markdown, YAML.
- Records file metadata: relative path, line count, byte size, and SHA-256 content checksum.

### Stage 2: Abstract Syntax Tree (AST) Parsing
- **Java Sources**: Processed using `com.github.javaparser:javaparser-core`. Extracts classes, interfaces, records, enums, constructors, methods, parameters, return types, field declarations, and start/end line numbers.
- **Other Sources**: Generic regex tokenizers extract exported functions, imported modules, and symbols for TypeScript, JavaScript, and Python.

### Stage 3: Dependency Graph Resolution
- Parses explicit `import` statements and package declarations.
- Matches imported symbols with discovered source files across the repository to generate directed dependency pairs (`sourceFile -> targetFile`).
- Tracks dependency types: `IMPORT`, `CALL`, `INHERITANCE`, and `ANNOTATION`.

### Stage 4: McCabe Cyclomatic Complexity
- Evaluates predicate nodes across methods:
  $$CC = 1 + \sum (\text{if, else if, while, for, do-while, case, catch, ternary, \&\&, ||})$$
- Flags methods exceeding the threshold ($CC > 15$) as high-complexity refactoring candidates.

### Stage 5: Static Security & Vulnerability Auditor
- Evaluates static code patterns against common vulnerability categories:
  - **SQL Injection**: Detects string concatenation within SQL query execution (`"SELECT * FROM users WHERE id = '" + id + "'"`).
  - **Hardcoded Credentials**: Identifies embedded API keys, JWT secrets, database passwords, and private certificates.
  - **Command Injection**: Detects invocations of `Runtime.getRuntime().exec` and `ProcessBuilder`.
  - **Cryptographic Weakness**: Flags obsolete ciphers (e.g. `DES`, `MD5`, `RC4`).
  - **Path Traversal**: Flags unsanitized input passed to `new File(...)` or `Paths.get(...)`.
- Produces structured `SecurityFinding` records with severity levels (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), exact file/line coordinates, and remediation advice.

### Stage 6: JGit History & Churn Analysis
- Utilizes Eclipse JGit (`org.eclipse.jgit`) to inspect the local Git commit log.
- Computes commit frequencies and author distributions.
- Applies the **Hotspot Risk Formula**:
  $$\text{Hotspot Score} = \text{Commit Churn Count} \times \text{Cyclomatic Complexity}$$
- Identifies files with high churn and high complexity as critical hotspots carrying 80% of regression risk.

### Stage 7: Architectural Tier Detection
- Classifies codebase components into architectural layers based on annotations, naming conventions, and directory patterns:
  - `FRONTEND`: UI components, pages, hooks, styles.
  - `CONTROLLER`: REST controllers (`@RestController`, `@Controller`, API routes).
  - `SERVICE`: Business logic components (`@Service`, transactional handlers).
  - `REPOSITORY`: Data access layers (`@Repository`, JPA interfaces, DAO classes).
  - `SECURITY`: Security filters (`SecurityConfig`, `JwtFilter`, auth providers).
  - `DATABASE`: SQL migrations (`V1__init.sql`), schema definitions.

### Stage 8: Codebase Map Layout Synthesis
- Synthesizes nodes and edges into graph structures ready for `@xyflow/react` rendering.
- Positions nodes by directory clusters, sets node complexity scaling, attaches security finding indicators, and defines smoothstep directed dependency edges.

---

## 4. AI & Grounded Retrieval Architecture

The AI subsystem (`com.repomind.ai`) operates with a dual-mode provider architecture:

### 1. External LLM Provider: Google Gemini
- Configured via `GEMINI_API_KEY` and `LLM_PROVIDER=gemini`.
- Uses Google Gemini 1.5 Pro / Flash via REST integration.
- Prompts are augmented with retrieved context from repository files, symbols, dependencies, and architectural tiers.

### 2. Deterministic Grounded Fallback (Demo AI Mode)
- Automatically enabled when `GEMINI_API_KEY` is omitted or `DEMO_MODE=true`.
- Employs deterministic retrieval across the analyzed repository metadata.
- Pre-indexes key domain queries:
  - *Authentication workflow*
  - *Database configuration & connection pooling*
  - *Service dependency trees (e.g., UserService, PaymentService)*
  - *Blast radius & change impact simulation*
  - *Technical debt and refactoring guidance*
- Generates responses accompanied by verified line citations (`file:startLine-endLine`), enabling users to jump directly to the relevant code in Monaco.

---

## 5. Relational Database Schema (Flyway V1)

The database schema (`db/migration/V1__init_schema.sql`) defines:

- `users`: Core account details with BCrypt password hashes.
- `repositories`: Metadata, GitHub URL, analysis status (`PENDING`, `ANALYZING`, `COMPLETED`, `FAILED`).
- `repository_files`: Indexed files with line counts, byte sizes, and checksums.
- `code_symbols`: Extracted classes, methods, and variables with start/end line coordinates.
- `dependencies`: Directed dependency edges (`source_file_id`, `target_file_id`, `type`).
- `security_findings`: Audited vulnerabilities with severity, category, description, and remediation.
- `technical_debt_metrics`: Cyclomatic complexity scores and debt metrics.
- `git_commits`: Churn history, author information, commit hashes, and messages.
- `architecture_nodes` & `architecture_edges`: Architectural layer mappings.
- `chat_sessions` & `chat_messages`: Conversation history and source citations.
- `documentation`: Generated Markdown documentation artifacts.

---

## 6. Security & Sandboxing Model

- **Authentication**: Stateless JWT with HMAC-SHA256 signature verification.
- **Authorization**: Public endpoints (`/api/auth/**`, `/api/health`) vs protected endpoints (`/api/repositories/**`, `/api/ai/**`).
- **Input Validation**: GitHub repository URLs are strictly validated; invalid URLs or malicious protocol schemas are rejected.
- **Git Sandboxing**: Repositories are cloned to isolated, temporary scratch directories with read-only access for the static analysis pipeline.
