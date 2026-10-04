import React, { useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  CodebaseMap as CodebaseMapType,
  MapNode as BackendMapNode,
} from "../types";
import {
  Search,
  Filter,
  Flame,
  ShieldAlert,
  Code2,
  ExternalLink,
  Sparkles,
  Info,
  Maximize2,
  X,
  Layers,
} from "lucide-react";

interface CodebaseMapProps {
  mapData: CodebaseMapType;
  onAskAi?: (prompt: string) => void;
}

// Custom Node for Files (Light Blue / Clean White Theme)
const FileNodeComponent = ({ data, selected }: NodeProps) => {
  const d = data as any;
  const complexity = Number(d.complexity || 1);
  const securityCount = Number(d.securityFindingsCount || 0);
  const isHotspot = Boolean(d.isHotspot);
  const label = String(d.label || "");
  const language = String(d.language || "code");
  const lines = Number(d.lines || 0);

  let borderColor = "border-slate-200";
  let shadowClass = "shadow-card";
  if (securityCount > 0) {
    borderColor = "border-rose-500";
    shadowClass = "shadow-[0_4px_16px_rgba(239,68,68,0.15)]";
  } else if (isHotspot || complexity > 15) {
    borderColor = "border-amber-500";
    shadowClass = "shadow-[0_4px_16px_rgba(245,158,11,0.15)]";
  } else if (selected) {
    borderColor = "border-primary";
    shadowClass = "shadow-[0_4px_20px_rgba(37,99,235,0.25)]";
  }

  return (
    <div
      className={`px-3.5 py-3 rounded-2xl bg-white border-2 text-xs transition-all duration-200 cursor-pointer w-52 ${borderColor} ${shadowClass} hover:scale-102`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-primary" />

      {/* Header with Badges */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-primary border border-blue-200">
          {language}
        </span>
        <div className="flex items-center space-x-1">
          {securityCount > 0 && (
            <span
              className="flex items-center text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-full font-mono font-bold"
              title={`${securityCount} Security Issue(s)`}
            >
              <ShieldAlert className="w-3 h-3 mr-0.5 text-rose-600" />
              {securityCount}
            </span>
          )}
          {isHotspot && (
            <span
              className="flex items-center text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full font-mono font-bold"
              title="Hotspot (High Churn * Complexity)"
            >
              <Flame className="w-3 h-3 text-amber-600" />
            </span>
          )}
        </div>
      </div>

      {/* File Label */}
      <div className="font-bold text-navy truncate text-xs" title={label}>
        {label}
      </div>

      {/* Directory context & stats */}
      <div className="flex items-center justify-between text-[10px] text-navy-muted font-mono mt-2 pt-1.5 border-t border-slate-100">
        <span>{lines} loc</span>
        <span className={`${complexity > 15 ? "text-amber-700 font-bold" : "text-navy-muted"}`}>
          cc: {complexity}
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-primary" />
    </div>
  );
};

const nodeTypes = {
  fileNode: FileNodeComponent,
};

export const CodebaseMap: React.FC<CodebaseMapProps> = ({ mapData, onAskAi }) => {
  const navigate = useNavigate();
  const { id: repoId } = useParams<{ id: string }>();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [highlightHotspotsOnly, setHighlightHotspotsOnly] = useState(false);
  const [highlightSecurityOnly, setHighlightSecurityOnly] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);

  // Extract distinct languages
  const languages = useMemo(() => {
    const langs = new Set<string>();
    mapData.nodes.forEach((n) => {
      if (n.data?.language) langs.add(n.data.language);
    });
    return ["ALL", ...Array.from(langs)];
  }, [mapData]);

  // Transform backend mapData to React Flow Nodes
  const initialNodes: Node[] = useMemo(() => {
    return mapData.nodes.map((node) => {
      const isFilteredOut =
        (selectedLanguage !== "ALL" && node.data?.language !== selectedLanguage) ||
        (searchQuery && !node.data?.label?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (highlightHotspotsOnly && !node.data?.isHotspot) ||
        (highlightSecurityOnly && (!node.data?.securityFindingsCount || node.data.securityFindingsCount === 0));

      return {
        id: node.id,
        type: "fileNode",
        position: node.position || { x: 0, y: 0 },
        data: {
          ...node.data,
          label: node.data?.label || node.id,
          filtered: isFilteredOut,
        },
        style: {
          opacity: isFilteredOut ? 0.2 : 1,
          transition: "opacity 0.2s ease",
        },
      };
    });
  }, [mapData, selectedLanguage, searchQuery, highlightHotspotsOnly, highlightSecurityOnly]);

  // Transform backend edges to React Flow Edges
  const initialEdges: Edge[] = useMemo(() => {
    return mapData.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: edge.animated || false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 14,
        height: 14,
        color: "#2563EB",
      },
      style: {
        stroke: "#3B82F6",
        strokeWidth: 2,
        opacity: 0.7,
      },
    }));
  }, [mapData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state when filters change
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeData(node.data);
  }, []);

  return (
    <div className="relative w-full h-full flex overflow-hidden rounded-3xl border border-blue-100 bg-[#EFF8FF]">
      {/* Top Filter Bar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-blue-200 shadow-card">
        {/* Search */}
        <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <Search className="w-3.5 h-3.5 text-navy-subtle mr-2" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-navy placeholder-slate-400 focus:outline-none w-32 md:w-44 font-mono text-xs"
          />
        </div>

        {/* Language Filter */}
        <div className="flex items-center space-x-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-navy-subtle ml-1" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-navy text-xs focus:outline-none font-mono font-medium"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang === "ALL" ? "All Languages" : lang}
              </option>
            ))}
          </select>
        </div>

        {/* Hotspots Toggle */}
        <button
          onClick={() => setHighlightHotspotsOnly((prev) => !prev)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            highlightHotspotsOnly
              ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-xs"
              : "bg-slate-50 text-navy-muted border border-slate-200 hover:text-navy"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>Hotspots</span>
        </button>

        {/* Security Risks Toggle */}
        <button
          onClick={() => setHighlightSecurityOnly((prev) => !prev)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            highlightSecurityOnly
              ? "bg-rose-100 text-rose-900 border border-rose-300 shadow-xs"
              : "bg-slate-50 text-navy-muted border border-slate-200 hover:text-navy"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>Security Risks</span>
        </button>
      </div>

      {/* React Flow Viewport */}
      <div className="flex-1 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={2}
          className="bg-[#EFF8FF]"
        >
          <Background color="#93C5FD" gap={24} size={1} />
          <Controls className="!bg-white !border !border-blue-200 !rounded-2xl !shadow-card text-navy" />
          <MiniMap
            className="!bg-white !border !border-blue-200 !rounded-2xl !shadow-card"
            nodeColor={(n: any) => {
              if (n.data?.securityFindingsCount > 0) return "#EF4444";
              if (n.data?.isHotspot) return "#F59E0B";
              return "#2563EB";
            }}
            maskColor="rgba(240, 247, 255, 0.75)"
          />
        </ReactFlow>
      </div>

      {/* Selected Node Inspector Sidebar */}
      {selectedNodeData && (
        <div className="w-80 border-l border-blue-100 bg-white p-5 flex flex-col justify-between overflow-y-auto z-20 shadow-float animate-in slide-in-from-right duration-200">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider">
                Node Inspector
              </span>
              <button
                onClick={() => setSelectedNodeData(null)}
                className="text-navy-subtle hover:text-navy p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-navy break-words">
                  {selectedNodeData.label}
                </h3>
                <p className="text-xs font-mono text-navy-muted mt-0.5 break-all">
                  {selectedNodeData.path || selectedNodeData.label}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <span className="text-navy-subtle block text-[10px]">LANGUAGE</span>
                  <span className="text-navy font-bold uppercase">
                    {selectedNodeData.language || "Unknown"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <span className="text-navy-subtle block text-[10px]">LINES OF CODE</span>
                  <span className="text-navy font-bold">{selectedNodeData.lines || 0}</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <span className="text-navy-subtle block text-[10px]">COMPLEXITY (CC)</span>
                  <span
                    className={`font-bold ${
                      selectedNodeData.complexity > 15 ? "text-amber-700" : "text-emerald-700"
                    }`}
                  >
                    {selectedNodeData.complexity || 1}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <span className="text-navy-subtle block text-[10px]">SECURITY AUDIT</span>
                  <span
                    className={`font-bold ${
                      selectedNodeData.securityFindingsCount > 0 ? "text-rose-700" : "text-emerald-700"
                    }`}
                  >
                    {selectedNodeData.securityFindingsCount || 0} findings
                  </span>
                </div>
              </div>

              {/* Hotspot indicator */}
              {selectedNodeData.isHotspot && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Active Hotspot Detected</span>
                  </div>
                  <p className="mt-1 text-[11px] text-amber-800 leading-relaxed font-sans">
                    High commit churn combined with high cyclomatic complexity indicates this file carries high regression risk.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                navigate(
                  `/repositories/${repoId}/code?file=${encodeURIComponent(
                    selectedNodeData.path || selectedNodeData.label
                  )}`
                );
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-navy font-semibold transition-colors shadow-xs"
            >
              <Code2 className="w-4 h-4 text-primary" />
              <span>Inspect in Code Explorer</span>
            </button>

            {onAskAi && (
              <button
                onClick={() =>
                  onAskAi(
                    `Explain what ${selectedNodeData.label} does and how its dependencies interact with the rest of the codebase.`
                  )
                }
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-semibold transition-all shadow-card"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI About This File</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
