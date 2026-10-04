import React, { useState } from "react";
import {
  X,
  Layers,
  Cpu,
  ShieldCheck,
  GitCommit,
  Sparkles,
  CheckCircle2,
  Terminal,
  Server,
  Database,
  Code2,
  ExternalLink,
} from "lucide-react";
import { useRecruiter } from "../context/RecruiterContext";

export const RecruiterModal: React.FC = () => {
  const { isRecruiterModalOpen, closeRecruiterModal } = useRecruiter();
  const [activeTab, setActiveTab] = useState<"architecture" | "pipeline" | "hotspot" | "highlights">("architecture");

  if (!isRecruiterModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-white border border-blue-100 rounded-3xl shadow-float flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
              <Cpu className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-navy">Engineering Intelligence & Architecture</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                  Recruiter Walkthrough
                </span>
              </div>
              <p className="text-xs text-navy-muted">
                Design rationale, Java 21 Spring Boot analysis engine, and grounded RAG pipeline.
              </p>
            </div>
          </div>
          <button
            onClick={closeRecruiterModal}
            className="p-1.5 rounded-xl text-navy-subtle hover:text-navy hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border px-6 bg-white text-xs font-medium">
          <button
            onClick={() => setActiveTab("architecture")}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === "architecture"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-navy-muted hover:text-navy"
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Stack & Architecture</span>
          </button>
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === "pipeline"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-navy-muted hover:text-navy"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Static AST & Security</span>
          </button>
          <button
            onClick={() => setActiveTab("hotspot")}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === "hotspot"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-navy-muted hover:text-navy"
            }`}
          >
            <GitCommit className="w-4 h-4" />
            <span>Hotspot & Risk Index</span>
          </button>
          <button
            onClick={() => setActiveTab("highlights")}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === "highlights"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-navy-muted hover:text-navy"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Production Highlights</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-navy">
          {activeTab === "architecture" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 shadow-xs">
                  <div className="flex items-center space-x-2 text-primary font-bold mb-2">
                    <Server className="w-4 h-4" />
                    <span>Pure Java 21 Backend</span>
                  </div>
                  <p className="text-xs text-navy-muted leading-relaxed">
                    Spring Boot 3.3.4, Spring Security 6 with stateless JWT authentication, Spring Data JPA with PostgreSQL and pgvector for semantic retrieval.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 shadow-xs">
                  <div className="flex items-center space-x-2 text-emerald-700 font-bold mb-2">
                    <Layers className="w-4 h-4" />
                    <span>Real AST Engine</span>
                  </div>
                  <p className="text-xs text-navy-muted leading-relaxed">
                    JavaParser for deep Abstract Syntax Tree extraction of classes, methods, and call hierarchies; JGit for commit churn; rule-based regex parsers for TS/JS/Python.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 shadow-xs">
                  <div className="flex items-center space-x-2 text-purple-700 font-bold mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Dual-Mode AI & RAG</span>
                  </div>
                  <p className="text-xs text-navy-muted leading-relaxed">
                    Google Gemini 1.5 Pro / Flash integration via REST client with automatic, deterministic Demo AI fallback with precise line citations when API keys are absent.
                  </p>
                </div>
              </div>

              {/* Architecture Diagram */}
              <div className="bg-slate-900 text-slate-100 p-5 rounded-3xl font-mono text-xs overflow-x-auto shadow-card">
                <div className="text-[11px] text-slate-400 mb-2 uppercase tracking-wider font-bold">
                  Full Stack Architecture Flow
                </div>
                <pre className="text-slate-200 leading-relaxed">
{`React 18 (Vite + TS + Tailwind + React Flow + Monaco)
      │  HTTP/REST (JWT Bearer Auth)
      ▼
Spring Boot 3 API Gateway & Security Filter
      ├── AuthController & SecurityConfig (BCrypt + JJWT)
      ├── RepositoryController (JGit clone & safe sandbox)
      ├── AnalysisPipeline (8-Stage Static Engine)
      │     ├── 1. FileDiscoveryService
      │     ├── 2. JavaParser AST (Symbols, Call Hierarchy)
      │     ├── 3. DependencyExtractor (Graph edges)
      │     ├── 4. McCabe Cyclomatic Complexity Calculator
      │     ├── 5. SecurityAuditor (SQLi, Secrets, Command Inj)
      │     ├── 6. JGit History & Churn Analyzer
      │     ├── 7. ArchitectureTierDetector (Layers)
      │     └── 8. CodebaseMapBuilder (Node layout)
      ├── AiService (Gemini API ↔ Demo Deterministic Fallback)
      └── PostgreSQL 16 + pgvector (Flyway V1 Migration)`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "pipeline" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy">8-Stage Static Code Analysis Pipeline</h3>
              <p className="text-xs text-navy-muted leading-relaxed">
                RepoMind executes zero untrusted user code. Every repository analysis occurs in a read-only sandboxed static pipeline.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <span className="font-bold text-primary">JavaParser AST Inspection</span>
                  <p className="text-navy-muted mt-1 leading-relaxed">
                    Extracts classes, interfaces, methods, modifiers, parameter types, return signatures, line numbers, and constructor dependencies directly into database entities.
                  </p>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                  <span className="font-bold text-amber-700">McCabe Cyclomatic Complexity</span>
                  <p className="text-navy-muted mt-1 leading-relaxed">
                    Measures predicate nodes: `if`, `while`, `for`, `case`, `catch`, ternary operators, `&&`, and `||`. Flags functions with complexity {">"} 15 for refactoring.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                  <span className="font-bold text-rose-700">Static Security Auditor</span>
                  <p className="text-navy-muted mt-1 leading-relaxed">
                    Inspects code for SQL injection (unparameterized query concatenation), hardcoded secrets/passwords, OS command execution (`Runtime.getRuntime().exec`), and weak crypto (DES/MD5).
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <span className="font-bold text-emerald-700">Dependency Graph Resolution</span>
                  <p className="text-navy-muted mt-1 leading-relaxed">
                    Resolves explicit and implicit package imports, linking caller components to callee targets to generate DAG dependency paths and blast radius simulations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "hotspot" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy">Code Churn & Technical Debt Risk Algorithm</h3>
              <p className="text-xs text-navy-muted leading-relaxed">
                High complexity in a static file that never changes rarely causes bugs. However, high complexity combined with high Git churn is where 80% of regressions occur.
              </p>

              <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 font-mono text-xs">
                <div className="text-primary font-bold mb-1">Risk Score Calculation:</div>
                <div className="text-navy font-semibold">Hotspot Risk = Cyclomatic Complexity × Commit Churn Count</div>
                <div className="text-navy-muted text-[11px] mt-2 leading-relaxed">
                  Files with both high churn ({">"} 5 commits) and high complexity ({">"} 15) are classified as <strong>CRITICAL HOTSPOTS</strong> and visually highlighted on the Codebase Map.
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed">
                <strong>Demo Verification:</strong> In the bundled `demo-repository/demo-shop`, `OrderService.java` exhibits high cyclomatic complexity (branching refund & discount logic) and frequent commit modifications, making it immediately visible as a primary hotspot in the Technical Debt tab.
              </div>
            </div>
          )}

          {activeTab === "highlights" && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-navy">What Makes RepoMind Stand Out</h3>
              <ul className="space-y-3 text-xs text-navy">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Production Readiness:</strong> Complete Maven build, JUnit 5 + Mockito test suites, Flyway schema migrations, and multi-stage Docker orchestration.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Offline Deterministic Intelligence:</strong> If no Gemini API key is provided, the platform switches seamlessly to a grounded retrieval engine that provides answers with exact source file & line range citations.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Multi-View Code Intelligence:</strong> Unified experience spanning Codebase Map (React Flow), Multi-Tier Architecture Diagram, Monaco Editor with AST symbol outlines, Security Audits, and Technical Debt indexing.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero-Config Local Demo:</strong> Built-in seed user (`demo@repomind.io`) and instant pre-analyzed `demo-shop` repository allows any reviewer to extract the ZIP and run immediately.
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border bg-slate-50/50 flex items-center justify-between text-xs text-navy-muted">
          <span className="font-mono text-[11px]">RepoMind Platform · Java 21 Spring Boot 3</span>
          <button
            onClick={closeRecruiterModal}
            className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-all font-semibold shadow-card"
          >
            Explore Platform
          </button>
        </div>
      </div>
    </div>
  );
};
