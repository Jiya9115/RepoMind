import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { repoService } from "../services/repoService";
import { TechnicalDebtOverview, Hotspot } from "../types";
import {
  Flame,
  Clock,
  AlertTriangle,
  Code2,
  Sparkles,
  RefreshCw,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export const DebtPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { onAskAi } = useOutletContext<{ onAskAi?: (prompt: string) => void }>() || {};

  const [debt, setDebt] = useState<TechnicalDebtOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadDebt();
  }, [id]);

  const loadDebt = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await repoService.getDebt(id);
      setDebt(data);
    } catch (err) {
      console.error("Failed to load technical debt overview", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-navy-muted">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mb-3" />
        <p className="text-xs font-mono">Calculating McCabe cyclomatic complexity and Git churn hotspots...</p>
      </div>
    );
  }

  if (!debt) {
    return (
      <div className="p-8 text-center text-xs text-rose-600">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
        <p>No technical debt data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-navy tracking-tight">
              Technical Debt & Churn Hotspots
            </h1>
          </div>
          <p className="text-xs text-navy-muted mt-1">
            Prioritize refactoring using the risk formula: Churn (Git Commits) × McCabe Cyclomatic Complexity.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3.5 rounded-2xl bg-white border border-blue-100 shadow-card flex items-center space-x-3">
            <span className="text-xs text-navy-muted font-medium">Debt Index:</span>
            <span className="text-lg font-bold font-mono text-amber-600">{debt.debtScore}/100</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-blue-100 shadow-card flex items-center space-x-2">
            <Clock className="w-4 h-4 text-navy-subtle" />
            <span className="text-xs font-mono text-navy font-semibold">
              ~{debt.estimatedRemediationHours}h estimated effort
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-blue-100 shadow-card">
          <span className="text-[10px] font-mono uppercase text-navy-subtle font-bold">
            TODO & FIXME Tags
          </span>
          <div className="text-3xl font-extrabold text-navy font-mono mt-1">{debt.totalTodos}</div>
          <p className="text-[10px] text-navy-subtle mt-0.5">Unresolved codebase notes</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-blue-100 shadow-card">
          <span className="text-[10px] font-mono uppercase text-amber-700 font-bold">
            High Complexity Methods
          </span>
          <div className="text-3xl font-extrabold text-amber-600 font-mono mt-1">
            {debt.highComplexityFunctions}
          </div>
          <p className="text-[10px] text-navy-subtle mt-0.5">CC {">"} 15 branching logic</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-blue-100 shadow-card">
          <span className="text-[10px] font-mono uppercase text-navy-subtle font-bold">
            Large Source Files
          </span>
          <div className="text-3xl font-extrabold text-navy font-mono mt-1">{debt.largeFilesCount}</div>
          <p className="text-[10px] text-navy-subtle mt-0.5">{">"} 300 lines of code</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-blue-100 shadow-card">
          <span className="text-[10px] font-mono uppercase text-rose-700 font-bold">
            Active Hotspots
          </span>
          <div className="text-3xl font-extrabold text-rose-600 font-mono mt-1">
            {debt.hotspots?.length || 0}
          </div>
          <p className="text-[10px] text-navy-subtle mt-0.5">High churn × complexity</p>
        </div>
      </div>

      {/* Risk Hotspots Table */}
      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-navy">Active Code Hotspots</h2>
            <p className="text-xs text-navy-muted mt-0.5">
              Files that change frequently and contain complex logic are prime sources of regressions.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-bold">
            Hotspot Score = Churn × CC
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-100 text-navy-subtle font-bold">
                <th className="py-3 px-3">SOURCE FILE</th>
                <th className="py-3 px-3">GIT CHURN</th>
                <th className="py-3 px-3">MCCABE CC</th>
                <th className="py-3 px-3">HOTSPOT SCORE</th>
                <th className="py-3 px-3">RISK ANALYSIS</th>
                <th className="py-3 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(debt.hotspots || []).map((hotspot, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-navy truncate max-w-xs">
                    {hotspot.file}
                  </td>
                  <td className="py-3.5 px-3 text-navy-muted">{hotspot.churn} commits</td>
                  <td className="py-3.5 px-3 text-amber-600 font-bold">{hotspot.complexity}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                      {hotspot.hotspotScore}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-navy-muted font-sans text-xs">{hotspot.reason}</td>
                  <td className="py-3.5 px-3 text-right space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/repositories/${id}/code?file=${encodeURIComponent(hotspot.file)}`)
                      }
                      className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-navy border border-slate-200 text-xs font-semibold inline-flex items-center space-x-1 shadow-xs"
                    >
                      <Code2 className="w-3.5 h-3.5 text-primary" />
                      <span>Inspect</span>
                    </button>
                    {onAskAi && (
                      <button
                        onClick={() =>
                          onAskAi(
                            `Analyze technical debt and suggest a refactoring strategy for ${hotspot.file} (Cyclomatic Complexity: ${hotspot.complexity}, Git Churn: ${hotspot.churn}).`
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-semibold inline-flex items-center space-x-1 shadow-card"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Refactor</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metrics Breakdown Cards */}
      {debt.metrics && debt.metrics.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-navy">Debt Health Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {debt.metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white border border-blue-100 shadow-card space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy">{m.name}</span>
                  <span className="text-[10px] font-mono text-primary font-bold uppercase bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {m.category}
                  </span>
                </div>
                <div className="flex items-baseline space-x-2 font-mono text-xs">
                  <span className="text-base font-bold text-primary">{m.value}</span>
                  <span className="text-navy-subtle">Threshold: {m.threshold}</span>
                </div>
                <p className="text-xs text-navy-muted leading-relaxed font-sans">{m.impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
