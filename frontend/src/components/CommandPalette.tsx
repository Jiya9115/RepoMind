import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Layers,
  Network,
  Code2,
  ShieldAlert,
  Flame,
  GitBranch,
  FileText,
  Compass,
  Sparkles,
  Briefcase,
  ExternalLink,
  X,
} from "lucide-react";
import { useRecruiter } from "../context/RecruiterContext";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleAi: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Analysis" | "Actions";
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onToggleAi,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { openRecruiterModal } = useRecruiter();

  const currentRepoId = id || "1";

  const commands: CommandItem[] = [
    {
      id: "map",
      title: "View Codebase Map (Graph)",
      category: "Analysis",
      icon: Network,
      action: () => {
        navigate(`/repositories/${currentRepoId}/map`);
        onClose();
      },
      shortcut: "M",
    },
    {
      id: "architecture",
      title: "Inspect Multi-Tier Architecture",
      category: "Analysis",
      icon: Layers,
      action: () => {
        navigate(`/repositories/${currentRepoId}/architecture`);
        onClose();
      },
      shortcut: "A",
    },
    {
      id: "code",
      title: "Browse Code Explorer & AST Symbols",
      category: "Analysis",
      icon: Code2,
      action: () => {
        navigate(`/repositories/${currentRepoId}/code`);
        onClose();
      },
      shortcut: "C",
    },
    {
      id: "security",
      title: "Audit Security Vulnerabilities & CVEs",
      category: "Analysis",
      icon: ShieldAlert,
      action: () => {
        navigate(`/repositories/${currentRepoId}/security`);
        onClose();
      },
      shortcut: "S",
    },
    {
      id: "debt",
      title: "Technical Debt & Churn Hotspots",
      category: "Analysis",
      icon: Flame,
      action: () => {
        navigate(`/repositories/${currentRepoId}/debt`);
        onClose();
      },
      shortcut: "D",
    },
    {
      id: "git",
      title: "Git Commit History & Churn Analysis",
      category: "Analysis",
      icon: GitBranch,
      action: () => {
        navigate(`/repositories/${currentRepoId}/git`);
        onClose();
      },
      shortcut: "G",
    },
    {
      id: "docs",
      title: "Repository Documentation Suite",
      category: "Analysis",
      icon: FileText,
      action: () => {
        navigate(`/repositories/${currentRepoId}/docs`);
        onClose();
      },
    },
    {
      id: "onboarding",
      title: "New Developer Onboarding Flow",
      category: "Navigation",
      icon: Compass,
      action: () => {
        navigate(`/repositories/${currentRepoId}/onboarding`);
        onClose();
      },
      shortcut: "O",
    },
    {
      id: "ai",
      title: "Open RepoMind AI Chat Assistant",
      category: "Actions",
      icon: Sparkles,
      action: () => {
        onClose();
        onToggleAi();
      },
      shortcut: "⌘J",
    },
    {
      id: "recruiter",
      title: "Recruiter Mode: Deep Dive Architecture & Stack",
      category: "Actions",
      icon: Briefcase,
      action: () => {
        onClose();
        openRecruiterModal();
      },
      shortcut: "R",
    },
    {
      id: "dashboard",
      title: "Return to Dashboard Repositories",
      category: "Navigation",
      icon: ExternalLink,
      action: () => {
        navigate("/dashboard");
        onClose();
      },
    },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white border border-blue-100 rounded-3xl shadow-float overflow-hidden flex flex-col mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-border bg-slate-50/50">
          <Search className="w-4 h-4 text-navy-subtle mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or jump to feature..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-navy placeholder-slate-400 focus:outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="text-navy-subtle hover:text-navy p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-navy-muted font-mono">
              No matching commands found for "{query}"
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-xs"
                      : "text-navy hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-primary" : "text-navy-subtle"}`} />
                    <span>{cmd.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-navy-muted uppercase px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 font-semibold">
                      {cmd.category}
                    </span>
                    {cmd.shortcut && (
                      <kbd className="font-mono text-[10px] bg-slate-100 text-navy-muted px-1.5 py-0.5 rounded-md border border-slate-200">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 border-t border-border bg-slate-50/50 flex items-center justify-between text-[11px] font-mono text-navy-muted">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>Java 21 · Spring Boot 3 Engine</span>
        </div>
      </div>
    </div>
  );
};
