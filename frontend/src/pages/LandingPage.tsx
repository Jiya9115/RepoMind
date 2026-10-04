import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Cpu,
  Sparkles,
  Network,
  ShieldAlert,
  Flame,
  GitBranch,
  Layers,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Compass,
  Code2,
  Server,
  Database,
  Search,
  ExternalLink,
  Bot,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRecruiter } from "../context/RecruiterContext";

export const LandingPage: React.FC = () => {
  const { loginWithDemo } = useAuth();
  const { openRecruiterModal } = useRecruiter();
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    try {
      await loginWithDemo();
      navigate("/dashboard");
    } catch {
      navigate("/dashboard");
    }
  };

  const handleAnalyzeClick = async () => {
    try {
      await loginWithDemo();
      navigate("/dashboard?import=open");
    } catch {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background-page text-navy flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between max-w-7xl mx-auto w-full shadow-subtle">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
            <Cpu className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight text-navy">
            Repo<span className="text-primary font-extrabold">Mind</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={openRecruiterModal}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all shadow-xs"
          >
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Recruiter Walkthrough</span>
          </button>

          <Link
            to="/login"
            className="text-xs font-semibold text-navy-muted hover:text-navy transition-colors px-3 py-1.5"
          >
            Sign In
          </Link>

          <button
            onClick={handleDemoClick}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover transition-all shadow-card"
          >
            <span>Explore Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Soft Blue Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-blue-200 text-primary text-xs font-semibold shadow-xs mb-6">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Pure Java 21 · Spring Boot 3 · Static AST Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-navy max-w-3xl leading-tight">
          Your Codebase,{" "}
          <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Understood.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-navy-muted max-w-2xl leading-relaxed font-normal">
          RepoMind turns complex repositories into an intelligent, visual and searchable engineering knowledge base.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleAnalyzeClick}
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-all shadow-card flex items-center space-x-2"
          >
            <Zap className="w-4 h-4 text-white" />
            <span>Analyze Repository</span>
          </button>

          <button
            onClick={handleDemoClick}
            className="px-6 py-3 rounded-xl bg-white border border-blue-200 hover:border-primary/50 text-navy font-semibold text-sm transition-all shadow-subtle hover:shadow-card flex items-center space-x-2"
          >
            <span>Explore Demo</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </button>
        </div>
      </section>

      {/* Animated Repository Flow Visualization (Frontend → API → Services → Database) */}
      <section className="px-6 max-w-5xl mx-auto w-full mb-20">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-float relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-navy-subtle ml-2">Live Architectural Topology Flow</span>
            </div>
            <span className="text-[11px] font-mono text-primary font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Interactive Static Model
            </span>
          </div>

          {/* 4-Tier Interactive Flow Cards with Animated Signals */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* 1. Frontend */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 shadow-xs flex flex-col justify-between group hover:border-primary transition-all">
              <div>
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3 font-bold text-xs">
                  UI
                </div>
                <h4 className="text-sm font-bold text-navy">Frontend</h4>
                <p className="text-[11px] text-navy-muted mt-1 leading-relaxed">
                  React 18 · TypeScript · Component Tree · State Stores
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-blue-200/50 flex items-center justify-between text-[10px] font-mono text-navy-subtle">
                <span>View Layer</span>
                <span className="text-sky-600 font-semibold">Active</span>
              </div>
            </div>

            {/* 2. API / Controllers */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 shadow-xs flex flex-col justify-between group hover:border-indigo-500 transition-all">
              <div>
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                  <Server className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-navy">API Controllers</h4>
                <p className="text-[11px] text-navy-muted mt-1 leading-relaxed">
                  Spring REST · JWT Security · Request Validation
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-indigo-200/50 flex items-center justify-between text-[10px] font-mono text-navy-subtle">
                <span>Routing</span>
                <span className="text-indigo-600 font-semibold">Port 8000</span>
              </div>
            </div>

            {/* 3. Services / Business Logic */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 shadow-xs flex flex-col justify-between group hover:border-emerald-500 transition-all">
              <div>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-navy">Services Logic</h4>
                <p className="text-[11px] text-navy-muted mt-1 leading-relaxed">
                  Transactional Handlers · McCabe CC Rules · Churn
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-emerald-200/50 flex items-center justify-between text-[10px] font-mono text-navy-subtle">
                <span>Business</span>
                <span className="text-emerald-600 font-semibold">JavaParser</span>
              </div>
            </div>

            {/* 4. Database / Storage */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 shadow-xs flex flex-col justify-between group hover:border-amber-500 transition-all">
              <div>
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                  <Database className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-navy">Database</h4>
                <p className="text-[11px] text-navy-muted mt-1 leading-relaxed">
                  PostgreSQL 16 · Flyway Migrations · pgvector
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-amber-200/50 flex items-center justify-between text-[10px] font-mono text-navy-subtle">
                <span>Persistence</span>
                <span className="text-amber-600 font-semibold">Flyway V1</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-navy-muted">
            <span className="flex items-center text-primary font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary mr-1.5 animate-pulse" />
              Frontend → API → Services → Database
            </span>
            <span className="text-slate-300">|</span>
            <span>Zero code execution · Pure static AST verification</span>
          </div>
        </div>
      </section>

      {/* 7 Required Feature Sections */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-navy tracking-tight">
            Complete Engineering Intelligence Suite
          </h2>
          <p className="mt-3 text-sm text-navy-muted">
            Everything your team needs to master unfamiliar codebases in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Section 1: Repository Intelligence */}
          <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-card hover:shadow-float transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">1. Repository Intelligence</h3>
            <p className="text-xs text-navy-muted leading-relaxed">
              Auto-discovers multi-language source trees, parses Java AST structures using JavaParser, and extracts classes, methods, signatures, and file line counts.
            </p>
          </div>

          {/* Section 2: Architecture Visualization */}
          <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-card hover:shadow-float transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">2. Architecture Visualization</h3>
            <p className="text-xs text-navy-muted leading-relaxed">
              Interactive React Flow diagrams map Presentation, Controllers, Services, and Repositories layers, highlighting boundaries and cross-tier call paths.
            </p>
          </div>

          {/* Section 3: AI Code Assistant */}
          <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-card hover:shadow-float transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">3. AI Code Assistant</h3>
            <p className="text-xs text-navy-muted leading-relaxed">
              Ask natural-language questions about request flows and authentication. Every answer includes verifiable source file and line-range citations.
            </p>
          </div>

          {/* Section 4: Security Analysis */}
          <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-card hover:shadow-float transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">4. Security Analysis</h3>
            <p className="text-xs text-navy-muted leading-relaxed">
              Static vulnerability scanner identifies SQL injection patterns, hardcoded secrets, command execution, and outdated ciphers with line-level fixes.
            </p>
          </div>

          {/* Section 5: Technical Debt */}
          <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-card hover:shadow-float transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">5. Technical Debt</h3>
            <p className="text-xs text-navy-muted leading-relaxed">
              Quantifies McCabe Cyclomatic Complexity on branching logic and maps regression risk using the formula: Hotspot Score = Commit Churn × Complexity.
            </p>
          </div>

          {/* Section 6: Git Intelligence */}
          <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-card hover:shadow-float transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-4">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">6. Git Intelligence</h3>
            <p className="text-xs text-navy-muted leading-relaxed">
              Leverages Eclipse JGit to calculate commit velocity, author contributions, and file modification churn without requiring external Git CLI binaries.
            </p>
          </div>
        </div>

        {/* Section 7: Developer Onboarding Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-primary text-white shadow-float flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>New Developer Mode</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">7. Developer Onboarding in 15 Minutes</h3>
            <p className="mt-1 text-sm text-blue-100 max-w-xl leading-relaxed">
              Curated reading paths, key application entry points, and step-by-step authentication and database lifecycle walkthroughs for instant ramp-up.
            </p>
          </div>
          <button
            onClick={handleDemoClick}
            className="px-6 py-3 rounded-xl bg-white text-primary font-bold text-xs hover:bg-blue-50 transition-all shadow-md shrink-0 flex items-center space-x-2"
          >
            <span>Explore Onboarding Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="mt-auto border-t border-border bg-white py-10 px-6 text-center text-xs text-navy-muted">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-navy font-bold">
            <Cpu className="w-4 h-4 text-primary" />
            <span>RepoMind Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <button onClick={openRecruiterModal} className="text-amber-700 hover:text-amber-800">
              Recruiter Mode
            </button>
            <button onClick={handleDemoClick} className="text-primary hover:text-primary-hover">
              Live Demo
            </button>
            <Link to="/login" className="hover:text-navy">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-navy">
              Create Account
            </Link>
          </div>

          <p className="font-mono text-[11px] text-navy-subtle">
            Built with Java 21 · Spring Boot 3 · React 18
          </p>
        </div>
      </footer>
    </div>
  );
};
