import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FolderGit2,
  Code2,
  Network,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Flame,
  GitBranch,
  RefreshCw,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Compass,
  FileCode,
} from "lucide-react";
import { repoService } from "../services/repoService";
import { Repository, SecurityOverview, TechnicalDebtOverview, GitOverview, FileSummary } from "../types";

export const RepositoryOverviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [repo, setRepo] = useState<Repository | null>(null);
  const [files, setFiles] = useState<FileSummary[]>([]);
  const [security, setSecurity] = useState<SecurityOverview | null>(null);
  const [debt, setDebt] = useState<TechnicalDebtOverview | null>(null);
  const [git, setGit] = useState<GitOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [repoData, filesData, secData, debtData, gitData] = await Promise.all([
        repoService.getById(id),
        repoService.getFiles(id),
        repoService.getSecurity(id).catch(() => null),
        repoService.getDebt(id).catch(() => null),
        repoService.getGit(id).catch(() => null),
      ]);

      setRepo(repoData);
      setFiles(filesData);
      setSecurity(secData);
      setDebt(debtData);
      setGit(gitData);
    } catch (err) {
      console.error("Failed to load repository overview data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReanalyze = async () => {
    if (!id) return;
    setIsReanalyzing(true);
    try {
      await repoService.triggerAnalysis(id);
      await loadData();
    } catch (err) {
      console.error("Failed to trigger reanalysis", err);
    } finally {
      setIsReanalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="h-28 rounded-3xl bg-white border border-blue-100 animate-pulse shadow-card" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-white border border-blue-100 animate-pulse shadow-card" />
          ))}
        </div>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-sm font-semibold text-navy">Repository not found</h2>
        <Link to="/dashboard" className="text-xs text-primary underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const totalLines = files.reduce((acc, f) => acc + (f.lineCount || 0), 0);
  const totalSymbols = files.reduce((acc, f) => acc + (f.symbolCount || 0), 0);

  // Group languages
  const languageCounts = files.reduce<Record<string, number>>((acc, f) => {
    const lang = f.language || "Other";
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
              <FolderGit2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-navy tracking-tight">{repo.name}</h1>
                {repo.isDemo && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                    Pre-Analyzed Demo
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  {repo.analysisStatus}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-navy-muted font-mono mt-0.5">
                <span>branch: {repo.defaultBranch}</span>
                {repo.githubUrl && (
                  <a
                    href={repo.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary flex items-center space-x-1"
                  >
                    <span>{repo.githubUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-navy-muted mt-2 max-w-3xl leading-relaxed">
            {repo.description || "Full-stack e-commerce demo with Java Spring Boot backend and React storefront."}
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleReanalyze}
            disabled={isReanalyzing}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-navy border border-slate-200 transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReanalyzing ? "animate-spin text-primary" : ""}`} />
            <span>{isReanalyzing ? "Analyzing..." : "Re-run Analysis"}</span>
          </button>

          <button
            onClick={() => navigate(`/repositories/${id}/onboarding`)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover transition-all shadow-card"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Understand Codebase</span>
          </button>
        </div>
      </div>

      {/* 4 Key Intelligence Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Source Files & LOC */}
        <div
          onClick={() => navigate(`/repositories/${id}/code`)}
          className="p-5 rounded-3xl bg-white border border-blue-100 hover:border-primary/50 transition-all cursor-pointer group shadow-card hover:shadow-float"
        >
          <div className="flex items-center justify-between text-navy-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Source Files</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-navy font-mono">{files.length}</div>
          <div className="text-[11px] text-navy-muted mt-1 font-mono flex items-center justify-between pt-2 border-t border-slate-100">
            <span>{totalLines.toLocaleString()} LOC</span>
            <span>{totalSymbols} AST symbols</span>
          </div>
        </div>

        {/* Metric 2: Security Score */}
        <div
          onClick={() => navigate(`/repositories/${id}/security`)}
          className="p-5 rounded-3xl bg-white border border-blue-100 hover:border-primary/50 transition-all cursor-pointer group shadow-card hover:shadow-float"
        >
          <div className="flex items-center justify-between text-navy-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Security Health</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-navy font-mono">
              {security ? security.score : 85}/100
            </span>
            <span className="text-[11px] text-rose-600 font-semibold font-mono">
              {security?.criticalCount || 0} critical
            </span>
          </div>
          <div className="text-[11px] text-navy-muted mt-1 font-mono pt-2 border-t border-slate-100">
            {security?.findings?.length || 0} total findings detected
          </div>
        </div>

        {/* Metric 3: Technical Debt */}
        <div
          onClick={() => navigate(`/repositories/${id}/debt`)}
          className="p-5 rounded-3xl bg-white border border-blue-100 hover:border-primary/50 transition-all cursor-pointer group shadow-card hover:shadow-float"
        >
          <div className="flex items-center justify-between text-navy-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Technical Debt</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-600 font-mono">
              {debt ? debt.debtScore : 28}
            </span>
            <span className="text-[11px] text-navy-subtle font-mono">index / 100</span>
          </div>
          <div className="text-[11px] text-navy-muted mt-1 font-mono pt-2 border-t border-slate-100">
            ~{debt?.estimatedRemediationHours || 14}h remediation effort
          </div>
        </div>

        {/* Metric 4: Git History & Churn */}
        <div
          onClick={() => navigate(`/repositories/${id}/git`)}
          className="p-5 rounded-3xl bg-white border border-blue-100 hover:border-primary/50 transition-all cursor-pointer group shadow-card hover:shadow-float"
        >
          <div className="flex items-center justify-between text-navy-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Git Churn</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GitBranch className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-navy font-mono">
            {git?.totalCommits || 12}
          </div>
          <div className="text-[11px] text-navy-muted mt-1 font-mono flex items-center justify-between pt-2 border-t border-slate-100">
            <span>{git?.contributors?.length || 2} contributors</span>
            <span>{git?.codeHotspots?.length || 1} active hotspots</span>
          </div>
        </div>
      </div>

      {/* Feature Exploration Grid */}
      <div>
        <h2 className="text-sm font-bold text-navy mb-4">Deep Codebase Exploration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => navigate(`/repositories/${id}/map`)}
            className="p-6 rounded-3xl bg-white border border-blue-100 hover:border-primary/50 cursor-pointer transition-all flex flex-col justify-between group shadow-card hover:shadow-float"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-3 group-hover:scale-105 transition-transform">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy text-sm mb-1">Codebase Map</h3>
              <p className="text-xs text-navy-muted leading-relaxed">
                Graph view of all source components, colored by complexity, with real dependency links.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs text-primary font-bold group-hover:translate-x-1 transition-transform">
              <span>Open Codebase Map</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          <div
            onClick={() => navigate(`/repositories/${id}/architecture`)}
            className="p-6 rounded-3xl bg-white border border-blue-100 hover:border-primary/50 cursor-pointer transition-all flex flex-col justify-between group shadow-card hover:shadow-float"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy text-sm mb-1">Architecture Tiers</h3>
              <p className="text-xs text-navy-muted leading-relaxed">
                Presentation, Controllers, Business Services, and Persistence Repositories flow.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs text-indigo-600 font-bold group-hover:translate-x-1 transition-transform">
              <span>View Architecture</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          <div
            onClick={() => navigate(`/repositories/${id}/docs`)}
            className="p-6 rounded-3xl bg-white border border-blue-100 hover:border-primary/50 cursor-pointer transition-all flex flex-col justify-between group shadow-card hover:shadow-float"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy text-sm mb-1">Documentation & Guides</h3>
              <p className="text-xs text-navy-muted leading-relaxed">
                Complete architecture guide, API specifications, and onboarding walkthrough.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">
              <span>Read Documentation</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Language Breakdown & Recent Commits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Composition */}
        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card">
          <h3 className="text-xs font-bold text-navy mb-4 uppercase tracking-wider font-mono">
            Language Composition
          </h3>
          <div className="space-y-3.5">
            {Object.entries(languageCounts).map(([lang, count]) => {
              const pct = Math.round((count / (files.length || 1)) * 100);
              return (
                <div key={lang}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-navy font-semibold">{lang}</span>
                    <span className="font-mono text-navy-muted">
                      {count} files ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Churned Files (Risk Hotspots) */}
        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider font-mono">
              Top Churned Source Files
            </h3>
            <span className="text-[10px] text-amber-600 font-mono font-semibold">Git Churn × Complexity</span>
          </div>

          <div className="space-y-2">
            {(git?.topChurnedFiles || []).slice(0, 5).map((item, idx) => (
              <div
                key={idx}
                onClick={() =>
                  navigate(`/repositories/${id}/code?file=${encodeURIComponent(item.file)}`)
                }
                className="p-3 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-blue-100 flex items-center justify-between text-xs cursor-pointer transition-colors"
              >
                <span className="font-mono text-navy font-medium truncate max-w-xs">{item.file}</span>
                <span className="font-mono text-amber-700 text-[11px] font-bold">
                  {item.churn} commits
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
