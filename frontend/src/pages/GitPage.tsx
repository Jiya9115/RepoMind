import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { repoService } from "../services/repoService";
import { GitOverview } from "../types";
import {
  GitBranch,
  GitCommit,
  Users,
  Clock,
  RefreshCw,
  AlertCircle,
  FileCode,
  Flame,
} from "lucide-react";

export const GitPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [git, setGit] = useState<GitOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadGit();
  }, [id]);

  const loadGit = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await repoService.getGit(id);
      setGit(data);
    } catch (err) {
      console.error("Failed to load Git overview", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-navy-muted">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mb-3" />
        <p className="text-xs font-mono">Parsing JGit commit history and author distribution...</p>
      </div>
    );
  }

  if (!git) {
    return (
      <div className="p-8 text-center text-xs text-rose-600">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
        <p>No Git history available for this repository.</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-purple-600" />
            <h1 className="text-xl font-bold text-navy tracking-tight">Git Churn & Evolution</h1>
          </div>
          <p className="text-xs text-navy-muted mt-1">
            Commit velocity, author contributions, and file modification frequencies via JGit.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-navy-muted">
          <div className="p-3.5 rounded-2xl bg-white border border-blue-100 shadow-card flex items-center space-x-2">
            <GitCommit className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-navy text-sm">{git.totalCommits}</span>
            <span>commits analyzed</span>
          </div>
        </div>
      </div>

      {/* Contributors Grid */}
      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card space-y-4">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-primary" />
          <h2 className="text-base font-bold text-navy">Repository Contributors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(git.contributors || []).map((c, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-navy text-xs">{c.name}</span>
                <span className="text-[11px] font-mono text-purple-700 font-bold">{c.commits} commits</span>
              </div>
              <p className="text-[11px] font-mono text-navy-muted truncate">{c.email}</p>
              <div className="w-full h-2 rounded-full bg-white overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${c.percentage}%` }}
                />
              </div>
              <span className="text-[10px] text-navy-subtle block text-right font-mono">
                {c.percentage}% of codebase activity
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Split: Recent Commits & Churned Files */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Commits */}
        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-navy">Recent Git Commits</h2>
            <span className="text-xs font-mono text-navy-subtle">Latest activity</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {(git.recentCommits || []).map((commit, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-primary font-bold">{commit.hash}</span>
                  <span className="text-navy-subtle">{commit.date}</span>
                </div>
                <p className="text-navy font-semibold">{commit.message}</p>
                <p className="text-[11px] text-navy-muted">by {commit.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Churned Files */}
        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-navy">Files with Highest Churn</h2>
            <span className="text-xs font-mono text-amber-700 font-bold">Modification Count</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {(git.topChurnedFiles || []).map((file, idx) => (
              <div
                key={idx}
                onClick={() =>
                  navigate(`/repositories/${id}/code?file=${encodeURIComponent(file.file)}`)
                }
                className="p-3.5 rounded-2xl bg-blue-50/40 hover:bg-blue-50 border border-blue-100 flex items-center justify-between text-xs cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2 truncate mr-2">
                  <FileCode className="w-4 h-4 text-navy-subtle shrink-0" />
                  <span className="font-mono text-navy font-medium truncate">{file.file}</span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[11px] font-mono text-amber-700 font-bold">
                    {file.churn} edits
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
