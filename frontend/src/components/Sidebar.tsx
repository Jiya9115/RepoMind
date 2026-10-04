import React from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  Network,
  Layers,
  Code2,
  ShieldAlert,
  Flame,
  GitBranch,
  FileText,
  Compass,
  ArrowLeft,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, path: `/repositories/${id}` },
    { label: "Codebase Map", icon: Network, path: `/repositories/${id}/map`, badge: "Interactive" },
    { label: "Architecture", icon: Layers, path: `/repositories/${id}/architecture` },
    { label: "Code Explorer", icon: Code2, path: `/repositories/${id}/code` },
    { label: "Security", icon: ShieldAlert, path: `/repositories/${id}/security` },
    { label: "Technical Debt", icon: Flame, path: `/repositories/${id}/debt` },
    { label: "Git Intelligence", icon: GitBranch, path: `/repositories/${id}/git` },
    { label: "Documentation", icon: FileText, path: `/repositories/${id}/docs` },
    { label: "Understand Codebase", icon: Compass, path: `/repositories/${id}/onboarding`, badge: "Guide" },
  ];

  return (
    <aside className="w-60 border-r border-border bg-white flex flex-col shrink-0 select-none shadow-subtle z-20">
      {/* Return to Dashboard */}
      <div className="p-3 border-b border-border bg-background-page/50">
        <NavLink
          to="/dashboard"
          className="flex items-center space-x-2 text-xs text-navy-muted hover:text-primary transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="font-medium">All Repositories</span>
        </NavLink>
      </div>

      {/* Navigation List */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-navy-subtle font-bold">
          Intelligence Views
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === `/repositories/${id}`}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold border border-primary/20 shadow-xs"
                  : "text-navy-muted hover:text-navy hover:bg-slate-50"
              }`
            }
          >
            <div className="flex items-center space-x-2.5">
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-primary font-semibold border border-blue-200">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Platform Stamp */}
      <div className="p-3.5 border-t border-border bg-background-page/50 text-[11px] font-mono text-navy-muted flex items-center justify-between">
        <span>Java 21 · Spring Boot 3</span>
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </aside>
  );
};
