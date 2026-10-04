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

