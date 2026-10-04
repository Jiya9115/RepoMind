import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { repoService } from "../services/repoService";
import { SecurityOverview, SecurityFinding } from "../types";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Code2,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Filter,
} from "lucide-react";

export const SecurityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { onAskAi } = useOutletContext<{ onAskAi?: (prompt: string) => void }>() || {};

  const [security, setSecurity] = useState<SecurityOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");

  useEffect(() => {
    if (!id) return;
    loadSecurity();
  }, [id]);

  const loadSecurity = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await repoService.getSecurity(id);
      setSecurity(data);
    } catch (err) {
      console.error("Failed to load security overview", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-navy-muted">
        <RefreshCw className="w-8 h-8 animate-spin text-rose-500 mb-3" />
        <p className="text-xs font-mono">Running static security auditor and taint analysis...</p>
      </div>
    );
  }

  if (!security) {
    return (
      <div className="p-8 text-center text-xs text-rose-600">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
        <p>No security data available.</p>
      </div>
    );
  }

  const findings = security.findings || [];
  const filteredFindings =
    selectedSeverity === "ALL"
      ? findings
      : findings.filter((f) => f.severity.toUpperCase() === selectedSeverity.toUpperCase());

  const getSeverityBadge = (severity: string) => {
    const s = severity.toUpperCase();
    if (s === "CRITICAL")
      return "bg-rose-50 text-rose-700 border-rose-200";
    if (s === "HIGH")
      return "bg-orange-50 text-orange-700 border-orange-200";
    if (s === "MEDIUM")
      return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-sky-50 text-sky-700 border-sky-200";
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <h1 className="text-xl font-bold text-navy tracking-tight">Security Audit & Vulnerabilities</h1>
          </div>
          <p className="text-xs text-navy-muted mt-1">
            Static AST rule evaluation for SQL injection, hardcoded credentials, and unsafe execution.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-card flex items-center space-x-3">
            <span className="text-xs text-navy-muted font-medium">Security Health:</span>
            <span
              className={`text-lg font-bold font-mono ${
                security.score >= 80
                  ? "text-emerald-600"
                  : security.score >= 60
                  ? "text-amber-600"
                  : "text-rose-600"
              }`}
            >
              {security.score}/100
            </span>
          </div>
        </div>
      </div>

      {/* Severity Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setSelectedSeverity("CRITICAL")}
          className={`p-5 rounded-3xl border cursor-pointer transition-all ${
            selectedSeverity === "CRITICAL"
              ? "bg-rose-50 border-rose-400 shadow-card"
              : "bg-white border-blue-100 shadow-card hover:border-slate-300"
          }`}
        >
          <span className="text-[10px] font-mono uppercase text-rose-700 font-bold">Critical</span>
          <div className="text-3xl font-extrabold text-navy font-mono mt-1">
            {security.criticalCount || 0}
          </div>
          <p className="text-[10px] text-navy-subtle mt-0.5">Immediate exploit potential</p>
        </div>

        <div
          onClick={() => setSelectedSeverity("HIGH")}
          className={`p-5 rounded-3xl border cursor-pointer transition-all ${
            selectedSeverity === "HIGH"
              ? "bg-orange-50 border-orange-400 shadow-card"
              : "bg-white border-blue-100 shadow-card hover:border-slate-300"
          }`}
        >
          <span className="text-[10px] font-mono uppercase text-orange-700 font-bold">High</span>
          <div className="text-3xl font-extrabold text-navy font-mono mt-1">
            {security.highCount || 0}
          </div>
          <p className="text-[10px] text-navy-subtle mt-0.5">High risk credential/injection</p>
        </div>

        <div
          onClick={() => setSelectedSeverity("MEDIUM")}
          className={`p-5 rounded-3xl border cursor-pointer transition-all ${
            selectedSeverity === "MEDIUM"
              ? "bg-amber-50 border-amber-400 shadow-card"
              : "bg-white border-blue-100 shadow-card hover:border-slate-300"
          }`}
        >
          <span className="text-[10px] font-mono uppercase text-amber-700 font-bold">Medium</span>
          <div className="text-3xl font-extrabold text-navy font-mono mt-1">
            {security.mediumCount || 0}
          </div>
          <p className="text-[10px] text-navy-subtle mt-0.5">Configuration & crypto weakness</p>
        </div>

        <div
          onClick={() => setSelectedSeverity("ALL")}
          className={`p-5 rounded-3xl border cursor-pointer transition-all ${
            selectedSeverity === "ALL"
              ? "bg-blue-50 border-primary shadow-card"
              : "bg-white border-blue-100 shadow-card hover:border-slate-300"
          }`}
        >
          <span className="text-[10px] font-mono uppercase text-primary font-bold">Total Findings</span>
          <div className="text-3xl font-extrabold text-navy font-mono mt-1">
            {findings.length}
          </div>
          <p className="text-[10px] text-navy-subtle mt-0.5">Show all severity levels</p>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-navy-muted">
          <span>Showing {filteredFindings.length} findings</span>
          {selectedSeverity !== "ALL" && (
            <button
              onClick={() => setSelectedSeverity("ALL")}
              className="text-primary hover:underline font-semibold"
            >
              Clear filter
            </button>
          )}
        </div>

        {filteredFindings.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white border border-blue-100 shadow-card text-navy-muted text-xs">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <span>No vulnerabilities detected in this category.</span>
          </div>
        ) : (
          filteredFindings.map((finding) => (
            <div
              key={finding.id}
              className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border uppercase font-bold ${getSeverityBadge(
                      finding.severity
                    )}`}
                  >
                    {finding.severity}
                  </span>
                  <span className="text-xs font-bold text-navy">{finding.category}</span>
                  <span className="text-xs font-mono text-navy-muted">
                    {finding.file}:{finding.line}
                  </span>
                </div>

                <p className="text-xs text-navy leading-relaxed">{finding.description}</p>

                {finding.recommendation && (
                  <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs font-mono">
                    <span className="text-emerald-700 font-bold block mb-0.5">
                      Recommended Remediation:
                    </span>
                    <span className="text-navy-muted">{finding.recommendation}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() =>
                    navigate(
                      `/repositories/${id}/code?file=${encodeURIComponent(finding.file)}&line=${
                        finding.line
                      }`
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-navy font-semibold transition-all shadow-xs flex items-center space-x-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-primary" />
                  <span>Inspect Code</span>
                </button>

                {onAskAi && (
                  <button
                    onClick={() =>
                      onAskAi(
                        `How do I fix the ${finding.severity} ${finding.category} finding in ${finding.file} at line ${finding.line}? Provide safe refactoring code.`
                      )
                    }
                    className="px-3.5 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-semibold transition-all shadow-card flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI Fix</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
