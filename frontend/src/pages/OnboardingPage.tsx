import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { docService } from "../services/docService";
import { OnboardingGuide, ReadingOrderItem } from "../types";
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  Code2,
  FolderTree,
  Terminal,
  Server,
  Database,
  Lock,
  RefreshCw,
  AlertCircle,
  BookOpen,
} from "lucide-react";

export const OnboardingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [guide, setGuide] = useState<OnboardingGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    docService
      .getOnboardingGuide(id)
      .then((data) => setGuide(data))
      .catch((err) => console.error("Failed to load onboarding guide", err))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleStep = (stepOrder: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepOrder]: !prev[stepOrder],
    }));
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-navy-muted">
        <RefreshCw className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-xs font-mono">Synthesizing developer onboarding guide and reading path...</p>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="p-8 text-center text-xs text-rose-600">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
        <p>No onboarding guide available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-primary mb-1">
            <Compass className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono uppercase font-bold">New Developer Mode</span>
          </div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">
            Understand This Codebase in 15 Minutes
          </h1>
          <p className="text-xs text-navy-muted mt-1 max-w-2xl leading-relaxed">
            Follow this curated reading path, architecture walkthrough, and execution checklist to gain a complete mental model of the system.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-right shrink-0">
          <span className="text-[10px] font-mono uppercase text-navy-subtle block font-bold">Progress</span>
          <span className="text-2xl font-bold font-mono text-emerald-600">
            {Object.values(completedSteps).filter(Boolean).length} /{" "}
            {guide.recommendedReadingOrder?.length || 5}
          </span>
          <span className="text-[11px] text-navy-muted block">steps reviewed</span>
        </div>
      </div>

      {/* Recommended Reading Order */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-navy flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Recommended Reading Order</span>
          </h2>
          <span className="text-xs font-mono text-navy-muted">Start from top to bottom</span>
        </div>

        <div className="space-y-3">
          {(guide.recommendedReadingOrder || []).map((item) => {
            const isDone = completedSteps[item.order];
            return (
              <div
                key={item.order}
                className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDone
                    ? "bg-emerald-50/40 border-emerald-300 shadow-xs"
                    : "bg-white border-blue-100 hover:border-primary/50 shadow-card hover:shadow-float"
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <button
                    onClick={() => toggleStep(item.order)}
                    className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isDone
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 hover:border-primary text-transparent bg-white"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-navy-subtle font-bold">
                        #{item.order}
                      </span>
                      <h3 className="font-bold text-navy text-sm">{item.title}</h3>
                      <span className="font-mono text-xs text-primary bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-semibold">
                        {item.filePath}
                      </span>
                    </div>

                    <p className="text-xs text-navy-muted mt-1 leading-relaxed">{item.reason}</p>

                    {item.keySymbols && item.keySymbols.length > 0 && (
                      <div className="flex items-center space-x-2 mt-2 text-[11px] font-mono text-navy-muted">
                        <span className="text-navy-subtle">Key Symbols:</span>
                        {item.keySymbols.map((s, i) => (
                          <span
                            key={i}
                            className="bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 text-navy font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-2 self-end md:self-center">
                  <button
                    onClick={() =>
                      navigate(
                        `/repositories/${id}/code?file=${encodeURIComponent(item.filePath)}`
                      )
                    }
                    className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-navy font-semibold transition-all shadow-xs flex items-center space-x-1.5"
                  >
                    <Code2 className="w-3.5 h-3.5 text-primary" />
                    <span>Open Code</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Architectural Flows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Auth Flow */}
        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card space-y-3">
          <div className="flex items-center space-x-2 text-rose-600">
            <Lock className="w-4 h-4" />
            <h3 className="font-bold text-sm text-navy">Authentication Flow</h3>
          </div>
          <div className="space-y-2 text-xs">
            {(guide.authFlow || []).map((step, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                <span className="font-bold text-navy block mb-0.5">{step.title}</span>
                <p className="text-navy-muted text-[11px]">{step.description}</p>
                {step.codeReference && (
                  <span className="font-mono text-[10px] text-primary font-semibold block mt-1">
                    {step.codeReference}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Database Flow */}
        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card space-y-3">
          <div className="flex items-center space-x-2 text-amber-600">
            <Database className="w-4 h-4" />
            <h3 className="font-bold text-sm text-navy">Database & Persistence</h3>
          </div>
          <div className="space-y-2 text-xs">
            {(guide.databaseFlow || []).map((step, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                <span className="font-bold text-navy block mb-0.5">{step.title}</span>
                <p className="text-navy-muted text-[11px]">{step.description}</p>
                {step.codeReference && (
                  <span className="font-mono text-[10px] text-amber-800 font-semibold block mt-1">
                    {step.codeReference}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* API Flow */}
        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card space-y-3">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Server className="w-4 h-4" />
            <h3 className="font-bold text-sm text-navy">API Request Lifecycle</h3>
          </div>
          <div className="space-y-2 text-xs">
            {(guide.apiFlow || []).map((step, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                <span className="font-bold text-navy block mb-0.5">{step.title}</span>
                <p className="text-navy-muted text-[11px]">{step.description}</p>
                {step.codeReference && (
                  <span className="font-mono text-[10px] text-indigo-700 font-semibold block mt-1">
                    {step.codeReference}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
