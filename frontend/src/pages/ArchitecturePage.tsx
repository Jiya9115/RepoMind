import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArchitectureFlow } from "../components/ArchitectureFlow";
import { repoService } from "../services/repoService";
import { ArchitectureOverview } from "../types";
import { Layers, RefreshCw, AlertCircle, Server, Code2, ArrowRight } from "lucide-react";

export const ArchitecturePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [architecture, setArchitecture] = useState<ArchitectureOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    loadArchitecture();
  }, [id]);

  const loadArchitecture = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await repoService.getArchitecture(id);
      setArchitecture(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load architecture data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-navy-muted">
        <RefreshCw className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-xs font-mono">Synthesizing architectural tiers and dependency layers...</p>
      </div>
    );
  }

  if (error || !architecture) {
    return (
      <div className="p-8 text-center text-xs text-rose-600">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
        <p>{error || "Unable to load architecture flow."}</p>
      </div>
    );
  }

  const tierCount = Object.keys(architecture.tiers || {}).length;
  const totalNodes = Object.values(architecture.tiers || {}).reduce((acc, list) => acc + list.length, 0);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-navy tracking-tight">Multi-Tier Architecture</h1>
          </div>
          <p className="text-xs text-navy-muted mt-1">
            Component distribution across Presentation, Controllers, Services, and Data Access boundaries.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-navy-muted">
          <span className="px-3 py-1 rounded-xl bg-white border border-blue-200 text-navy font-semibold shadow-xs">
            {tierCount} Tiers Detected
          </span>
          <span className="px-3 py-1 rounded-xl bg-white border border-blue-200 text-navy font-semibold shadow-xs">
            {totalNodes} Architecture Components
          </span>
        </div>
      </div>

      {/* Architecture Flow Canvas */}
      <div className="h-[560px] w-full">
        <ArchitectureFlow architecture={architecture} />
      </div>

      {/* Tiers Breakdown Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-navy">Layer Composition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(architecture.tiers || {}).map(([tier, nodes]) => (
            <div
              key={tier}
              className="p-5 rounded-3xl bg-white border border-blue-100 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-primary uppercase font-bold">
                    {tier} Layer
                  </span>
                  <span className="text-[10px] font-mono text-navy-muted bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-semibold">
                    {nodes.length} nodes
                  </span>
                </div>

                <div className="space-y-1.5 mt-3">
                  {nodes.slice(0, 5).map((node, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        navigate(
                          `/repositories/${id}/code?file=${encodeURIComponent(node.path || node.name)}`
                        )
                      }
                      className="text-xs text-navy hover:text-primary p-2 rounded-xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 flex items-center justify-between cursor-pointer transition-all"
                    >
                      <span className="truncate max-w-[190px] font-mono text-[11px] font-medium">{node.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-navy-subtle shrink-0" />
                    </div>
                  ))}
                  {nodes.length > 5 && (
                    <p className="text-[10px] text-navy-subtle font-mono pt-1">
                      +{nodes.length - 5} more components
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
