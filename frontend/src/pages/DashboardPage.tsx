import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FolderGit2,
  Plus,
  Network,
  Layers,
  Code2,
  ShieldCheck,
  Flame,
  ArrowRight,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  FileCode,
  ShieldAlert,
  GitBranch,
  BarChart3,
  Bot,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { repoService } from "../services/repoService";
import { Repository } from "../types";
import { useAuth } from "../context/AuthContext";
import { useRecruiter } from "../context/RecruiterContext";

const FALLBACK_DEMO_REPO: Repository = {
  id: 1,
  name: "demo-shop",
  description: "Enterprise e-commerce platform with Spring Boot backend, PostgreSQL, React dashboard, and payment gateway.",
  githubUrl: "https://github.com/repomind/demo-shop",
  defaultBranch: "main",
  analysisStatus: "COMPLETED",
  isDemo: true,
  createdAt: "2026-10-04T00:00:00Z",
  updatedAt: "2026-10-04T00:05:00Z",
};

export const DashboardPage: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [isImporting, setIsImporting] = useState(false);
  const [importStep, setImportStep] = useState(0);
  const [importError, setImportError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { openRecruiterModal } = useRecruiter();
  const navigate = useNavigate();

  const importSteps = [
    "1. Repository discovered",
    "2. Files scanned",
    "3. Languages detected",
    "4. AST parsed",
    "5. Dependencies extracted",
    "6. Architecture generated",
    "7. Security analyzed",
    "8. AI knowledge created",
  ];

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const data = await repoService.getAll();
      if (data && data.length > 0) {
        setRepositories(data);
      } else {
        const demo = await repoService.getDemoRepository();
        setRepositories(demo ? [demo] : [FALLBACK_DEMO_REPO]);
      }
    } catch (err) {
      console.warn("Unable to fetch repositories from backend, using demo data", err);
      try {
        const demo = await repoService.getDemoRepository();
        setRepositories(demo ? [demo] : [FALLBACK_DEMO_REPO]);
      } catch {
        setRepositories([FALLBACK_DEMO_REPO]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
    if (searchParams.get("import") === "open") {
      setIsImportModalOpen(true);
    }
  }, [searchParams]);

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setIsImporting(true);
    setImportError(null);
    setImportStep(0);

    const stepInterval = setInterval(() => {
      setImportStep((prev) => (prev < 7 ? prev + 1 : prev));
    }, 600);

    try {
      const newRepo = await repoService.importRepository(repoUrl.trim(), branch.trim() || "main");
      clearInterval(stepInterval);
      setImportStep(7);
      setTimeout(() => {
        setIsImportModalOpen(false);
        setRepoUrl("");
        setIsImporting(false);
        fetchRepositories();
        navigate(`/repositories/${newRepo.id}`);
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsImporting(false);
      setImportError(
        err?.response?.data?.message || err?.message || "Failed to clone and analyze repository."
      );
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this analyzed repository?")) return;
    try {
      await repoService.delete(id);
      setRepositories((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete repository", err);
    }
  };

  // Mock dashboard aggregation data for charts
  const languageData = [
    { name: "Java", value: 52, color: "#2563EB" },
    { name: "TypeScript", value: 28, color: "#60A5FA" },
    { name: "SQL", value: 12, color: "#F59E0B" },
    { name: "JSON/YAML", value: 8, color: "#10B981" },
  ];

  const complexityTrend = [
    { name: "Controllers", cc: 6 },
    { name: "Services", cc: 18 },
    { name: "Auth/JWT", cc: 12 },
    { name: "Repos", cc: 4 },
    { name: "Storefront", cc: 8 },
  ];

  const securitySeverityData = [
    { severity: "Critical", count: 1, color: "#EF4444" },
    { severity: "High", count: 2, color: "#F97316" },
    { severity: "Medium", count: 3, color: "#F59E0B" },
    { severity: "Low", count: 4, color: "#3B82F6" },
  ];

  const commitActivityData = [
    { day: "Mon", commits: 3 },
    { day: "Tue", commits: 7 },
    { day: "Wed", commits: 5 },
    { day: "Thu", commits: 12 },
    { day: "Fri", commits: 8 },
    { day: "Sat", commits: 4 },
    { day: "Sun", commits: 2 },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-150">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center space-x-2 text-primary font-semibold text-xs mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>RepoMind Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            Engineering Dashboard
          </h1>
          <p className="text-xs text-navy-muted mt-1">
            Overview of analyzed repositories, structural complexity, security posture, and git velocity.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={openRecruiterModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Recruiter Walkthrough</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover transition-all shadow-card"
          >
            <Plus className="w-4 h-4" />
            <span>Import Repository</span>
          </button>
        </div>
      </div>

      {/* 6 Executive Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-card">
          <span className="text-[10px] font-mono uppercase text-navy-subtle font-bold">Total Repositories</span>
          <div className="text-2xl font-bold text-navy mt-1 font-mono">{repositories.length}</div>
          <span className="text-[10px] text-emerald-600 font-medium">1 active demo</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-card">
          <span className="text-[10px] font-mono uppercase text-navy-subtle font-bold">Files Analyzed</span>
          <div className="text-2xl font-bold text-navy mt-1 font-mono">25</div>
          <span className="text-[10px] text-navy-muted">1,840 LOC total</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-card">
          <span className="text-[10px] font-mono uppercase text-navy-subtle font-bold">Languages</span>
          <div className="text-2xl font-bold text-navy mt-1 font-mono">4</div>
          <span className="text-[10px] text-primary font-medium">Java, TS, SQL, JSON</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-card">
          <span className="text-[10px] font-mono uppercase text-navy-subtle font-bold">Security Issues</span>
          <div className="text-2xl font-bold text-rose-600 mt-1 font-mono">6</div>
          <span className="text-[10px] text-rose-500 font-medium">1 critical finding</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-card">
          <span className="text-[10px] font-mono uppercase text-navy-subtle font-bold">Technical Debt</span>
          <div className="text-2xl font-bold text-amber-600 mt-1 font-mono">28/100</div>
          <span className="text-[10px] text-amber-700 font-medium">~14h estimated effort</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-card">
          <span className="text-[10px] font-mono uppercase text-navy-subtle font-bold">Latest Analysis</span>
          <div className="text-sm font-bold text-navy mt-2 font-mono truncate">demo-shop</div>
          <span className="text-[10px] text-emerald-600 font-medium">Completed</span>
        </div>
      </div>

      {/* 4 Interactive Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chart 1: Language Distribution */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-navy uppercase font-mono">Language Distribution</h3>
            <span className="text-[10px] text-navy-subtle font-mono">% lines</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #DBEAFE",
                    fontSize: "11px",
                    color: "#0F172A",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-100 text-[10px] font-mono text-navy-muted">
            {languageData.map((item) => (
              <span key={item.name} className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name} ({item.value}%)</span>
              </span>
            ))}
          </div>
        </div>

        {/* Chart 2: Complexity Trend */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-navy uppercase font-mono">Complexity by Layer</h3>
            <span className="text-[10px] text-amber-600 font-mono font-semibold">McCabe CC</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complexityTrend}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} />
                <YAxis stroke="#94A3B8" fontSize={9} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #DBEAFE",
                    fontSize: "11px",
                  }}
                />
                <Area type="monotone" dataKey="cc" stroke="#2563EB" fill="#EFF6FF" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[10px] font-mono text-navy-subtle pt-2 border-t border-slate-100 text-center">
            Peak CC 18 in OrderService.java
          </span>
        </div>

        {/* Chart 3: Security Issue Severity */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-navy uppercase font-mono">Security Severity</h3>
            <span className="text-[10px] text-rose-600 font-mono font-semibold">6 Findings</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={securitySeverityData}>
                <XAxis dataKey="severity" stroke="#94A3B8" fontSize={9} />
                <YAxis stroke="#94A3B8" fontSize={9} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #DBEAFE",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {securitySeverityData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[10px] font-mono text-rose-600 font-medium pt-2 border-t border-slate-100 text-center">
            SQLi in UserRepository.java flagged
          </span>
        </div>

        {/* Chart 4: Commit Activity */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-navy uppercase font-mono">Commit Activity</h3>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">12 Commits</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={commitActivityData}>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={9} />
                <YAxis stroke="#94A3B8" fontSize={9} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #DBEAFE",
                    fontSize: "11px",
                  }}
                />
                <Area type="monotone" dataKey="commits" stroke="#10B981" fill="#ECFDF5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-medium pt-2 border-t border-slate-100 text-center">
            JGit analyzed commit history
          </span>
        </div>
      </div>

      {/* Repository Cards Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-navy">Connected Repositories</h2>
            <p className="text-xs text-navy-muted">
              Select any repository to explore its architecture map, code tree, and security audits.
            </p>
          </div>
          <button
            onClick={fetchRepositories}
            className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-3xl bg-white border border-blue-100 animate-pulse p-6 shadow-card"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                onClick={() => navigate(`/repositories/${repo.id}`)}
                className="p-6 rounded-3xl bg-white border border-blue-100 hover:border-primary/50 cursor-pointer transition-all duration-200 flex flex-col justify-between group shadow-card hover:shadow-float"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2 truncate">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                        <FolderGit2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-bold text-navy text-sm group-hover:text-primary transition-colors truncate">
                        {repo.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {repo.isDemo && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                          Demo Shop
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        {repo.analysisStatus}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-navy-muted line-clamp-2 mt-2 leading-relaxed">
                    {repo.description || "Full-stack e-commerce demo with Java Spring Boot backend and React storefront."}
                  </p>

                  {/* Required Metrics: Language, Files, LOC, Health score, Security score, Last analyzed */}
                  <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-navy-subtle block">LANGUAGE</span>
                      <span className="font-bold text-navy">Java 21</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-navy-subtle block">FILES / LOC</span>
                      <span className="font-bold text-navy">25 / 1.8k</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-navy-subtle block">HEALTH</span>
                      <span className="font-bold text-emerald-600">88/100</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  {/* Quick Feature Links */}
                  <div className="grid grid-cols-4 gap-1.5 text-navy-muted text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/repositories/${repo.id}/map`);
                      }}
                      className="p-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 flex flex-col items-center hover:text-primary transition-colors border border-slate-100"
                      title="Codebase Map"
                    >
                      <Network className="w-3.5 h-3.5 mb-0.5" />
                      <span className="text-[10px] font-medium">Map</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/repositories/${repo.id}/architecture`);
                      }}
                      className="p-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 flex flex-col items-center hover:text-indigo-600 transition-colors border border-slate-100"
                      title="Architecture Tiers"
                    >
                      <Layers className="w-3.5 h-3.5 mb-0.5" />
                      <span className="text-[10px] font-medium">Tiers</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/repositories/${repo.id}/security`);
                      }}
                      className="p-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 flex flex-col items-center hover:text-rose-600 transition-colors border border-slate-100"
                      title="Security Audit"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 mb-0.5" />
                      <span className="text-[10px] font-medium">Security</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/repositories/${repo.id}/debt`);
                      }}
                      className="p-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 flex flex-col items-center hover:text-amber-600 transition-colors border border-slate-100"
                      title="Technical Debt"
                    >
                      <Flame className="w-3.5 h-3.5 mb-0.5" />
                      <span className="text-[10px] font-medium">Debt</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 text-[11px] font-mono text-navy-subtle">
                    <span>branch: {repo.defaultBranch}</span>
                    <button
                      onClick={(e) => handleDelete(repo.id, e)}
                      className="text-navy-subtle hover:text-rose-600 transition-colors p-1"
                      title="Delete Repository"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Import Modal with 8-Step Visual Progress */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-white border border-blue-100 rounded-3xl shadow-float p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FolderGit2 className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base text-navy">Import GitHub Repository</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-navy-subtle hover:text-navy p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {importError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            <form onSubmit={handleImportSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/spring-projects/spring-petclinic"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary rounded-xl py-2 px-3 text-xs text-navy placeholder-slate-400 focus:outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="main"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary rounded-xl py-2 px-3 text-xs text-navy placeholder-slate-400 focus:outline-none font-mono shadow-xs"
                />
              </div>

              {/* 8-Step Visual Pipeline Progress */}
              {isImporting && (
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-3">
                  <div className="flex items-center space-x-2 text-xs text-primary font-bold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analysis Pipeline Running...</span>
                  </div>

                  <div className="space-y-1.5">
                    {importSteps.map((stepLabel, idx) => {
                      const isCompleted = idx < importStep;
                      const isCurrent = idx === importStep;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center space-x-2 text-xs font-mono transition-colors ${
                            isCompleted
                              ? "text-emerald-700 font-semibold"
                              : isCurrent
                              ? "text-primary font-bold"
                              : "text-slate-400"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <span
                              className={`w-3.5 h-3.5 rounded-full border text-[9px] flex items-center justify-center shrink-0 ${
                                isCurrent
                                  ? "border-primary bg-primary text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {idx + 1}
                            </span>
                          )}
                          <span>{stepLabel}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-navy-muted hover:text-navy transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isImporting}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-all shadow-card flex items-center space-x-2 disabled:opacity-50"
                >
                  <span>{isImporting ? "Analyzing..." : "Start Analysis"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
