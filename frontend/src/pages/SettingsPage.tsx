import React from "react";
import { useAuth } from "../context/AuthContext";
import { Server, Database, Sparkles, Shield, Cpu, Terminal, LogOut } from "lucide-react";

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-150">
      <div className="pb-4 border-b border-border">
        <h1 className="text-xl font-bold text-navy tracking-tight">System & Engine Settings</h1>
        <p className="text-xs text-navy-muted mt-1">
          Configuration parameters, runtime environments, and engine diagnostics.
        </p>
      </div>

      {/* Account Info */}
      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card space-y-4">
        <h2 className="text-sm font-bold text-navy">Active Session</h2>
        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100">
            <span className="text-navy-subtle block text-[10px] font-bold">NAME</span>
            <span className="text-navy font-bold">{user?.name || "Demo User"}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100">
            <span className="text-navy-subtle block text-[10px] font-bold">EMAIL</span>
            <span className="text-navy font-bold">{user?.email || "demo@repomind.io"}</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-semibold transition-all inline-flex items-center space-x-2 shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Engine Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card space-y-2">
          <div className="flex items-center space-x-2 text-primary font-bold">
            <Server className="w-4 h-4" />
            <span>Backend Runtime</span>
          </div>
          <p className="text-navy-muted">Eclipse Temurin Java 21 LTS with Spring Boot 3.3.4</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
            ACTIVE · STATISTICALLY COMPILED
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card space-y-2">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold">
            <Database className="w-4 h-4" />
            <span>Storage & Embeddings</span>
          </div>
          <p className="text-navy-muted">PostgreSQL 16 + pgvector extension with Flyway migrations</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
            CONNECTED · MIGRATIONS APPLIED
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card space-y-2">
          <div className="flex items-center space-x-2 text-purple-600 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>AI Intelligence Service</span>
          </div>
          <p className="text-navy-muted">
            Google Gemini 1.5 Pro / Flash with deterministic offline grounded fallback
          </p>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-mono text-[10px] font-bold">
            DUAL MODE ACTIVE · CITATIONS ENABLED
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card space-y-2">
          <div className="flex items-center space-x-2 text-rose-600 font-bold">
            <Shield className="w-4 h-4" />
            <span>Security Sandbox</span>
          </div>
          <p className="text-navy-muted">
            Zero-execution AST static analysis pipeline via JavaParser and JGit
          </p>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
            SAFEGUARD ENFORCED
          </span>
        </div>
      </div>
    </div>
  );
};
