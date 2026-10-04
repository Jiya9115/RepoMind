import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cpu, Search, Sparkles, User as UserIcon, LogOut, Terminal, Compass } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRecruiter } from "../context/RecruiterContext";

interface NavbarProps {
  onOpenCommandPalette: () => void;
  onToggleAi: () => void;
  isAiOpen: boolean;
  repoName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  onToggleAi,
  isAiOpen,
  repoName,
}) => {
  const { user, isAuthenticated, logout, loginWithDemo } = useAuth();
  const { openRecruiterModal } = useRecruiter();
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b border-border bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shadow-subtle">
      {/* Brand & Repo Info */}
      <div className="flex items-center space-x-3">
        <Link to="/dashboard" className="flex items-center space-x-2.5 text-navy font-medium group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-sm">
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <span className="tracking-tight text-base font-bold text-navy">
            Repo<span className="text-primary font-extrabold">Mind</span>
          </span>
        </Link>

        {repoName && (
          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-navy-muted pl-3 border-l border-border">
            <span className="text-slate-300">/</span>
            <span className="text-navy font-semibold">{repoName}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
              Analyzed
            </span>
          </div>
        )}
      </div>

      {/* Global Search / Command Bar */}
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center space-x-2 bg-background-page hover:bg-white border border-border hover:border-primary/40 rounded-xl px-3 py-1.5 text-xs text-navy-muted transition-all w-64 justify-between shadow-xs"
      >
        <span className="flex items-center space-x-2">
          <Search className="w-3.5 h-3.5 text-navy-subtle" />
          <span>Search or command...</span>
        </span>
        <kbd className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded-md text-navy-muted border border-border shadow-xs">
          ⌘K
        </kbd>
      </button>

      {/* Action Controls & Profile */}
      <div className="flex items-center space-x-2">
        {/* Recruiter Mode Button */}
        <button
          onClick={openRecruiterModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all shadow-xs"
          title="Interview Architecture & Stack Walkthrough"
        >
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>Recruiter Mode</span>
        </button>

        {/* AI Drawer Toggle */}
        <button
          onClick={onToggleAi}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isAiOpen
              ? "bg-primary text-white shadow-glow"
              : "bg-primary-soft text-primary border border-primary/20 hover:bg-blue-100"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>

        {/* User Account / Demo */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-2 pl-2 border-l border-border">
            <div className="flex items-center space-x-2 bg-background-page border border-border rounded-full py-1 px-2.5 text-xs text-navy">
              <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                {user?.name?.[0] || "U"}
              </div>
              <span className="hidden md:inline font-mono text-[11px] text-navy-muted truncate max-w-[120px]">
                {user?.email}
              </span>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-navy-subtle hover:text-navy transition-colors rounded-lg hover:bg-slate-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => loginWithDemo().then(() => navigate("/dashboard"))}
              className="px-2.5 py-1 text-xs text-primary hover:underline font-semibold"
            >
              Explore Demo
            </button>
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover transition-colors shadow-xs"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
