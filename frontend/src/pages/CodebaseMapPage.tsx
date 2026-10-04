import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { CodebaseMap as CodebaseMapComponent } from "../components/CodebaseMap";
import { repoService } from "../services/repoService";
import { CodebaseMap as CodebaseMapType } from "../types";
import { RefreshCw, Network, AlertCircle } from "lucide-react";

export const CodebaseMapPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [mapData, setMapData] = useState<CodebaseMapType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { onAskAi } = useOutletContext<{ onAskAi?: (prompt: string) => void }>() || {};

  const loadMap = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await repoService.getMap(id);
      setMapData(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load codebase map");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMap();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full p-8 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-accent-light mb-3" />
        <p className="text-xs font-mono">Generating graph layout from AST dependencies...</p>
      </div>
    );
  }

  if (error || !mapData) {
    return (
      <div className="p-8 text-center text-xs text-rose-400">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p>{error || "Unable to load codebase map."}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4">
      <CodebaseMapComponent mapData={mapData} onAskAi={onAskAi} />
    </div>
  );
};
