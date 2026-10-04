import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  MarkerType,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ArchitectureOverview, ArchitectureNode } from "../types";
import { Layers, Server, Database, Shield, Monitor, Code2, ArrowRight } from "lucide-react";

interface ArchitectureFlowProps {
  architecture: ArchitectureOverview;
  onSelectNode?: (node: ArchitectureNode) => void;
}

const TierNodeComponent = ({ data }: NodeProps) => {
  const d = data as any;
  const tier = String(d.tier || "");
  const tierStyle = {
    FRONTEND: "border-sky-300 bg-sky-50/90 text-sky-950",
    CONTROLLER: "border-indigo-300 bg-indigo-50/90 text-indigo-950",
    SERVICE: "border-emerald-300 bg-emerald-50/90 text-emerald-950",
    REPOSITORY: "border-amber-300 bg-amber-50/90 text-amber-950",
    SECURITY: "border-rose-300 bg-rose-50/90 text-rose-950",
    DATABASE: "border-purple-300 bg-purple-50/90 text-purple-950",
    CONFIG: "border-slate-300 bg-slate-50/90 text-slate-950",
  }[tier] || "border-blue-200 bg-white text-navy";

  return (
    <div
      className={`px-4 py-3 rounded-2xl border-2 text-xs shadow-card backdrop-blur-md cursor-pointer transition-all hover:scale-105 min-w-[190px] max-w-[230px] ${tierStyle}`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-primary" />
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/80 border border-current">
          {tier}
        </span>
      </div>
      <div className="font-bold text-navy truncate text-xs">{String(d.name || "")}</div>
      {d.description && (
        <div className="text-[10px] text-navy-muted mt-1 line-clamp-2 leading-relaxed">
          {String(d.description)}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-primary" />
    </div>
  );
};

const nodeTypes = {
  tierNode: TierNodeComponent,
};

export const ArchitectureFlow: React.FC<ArchitectureFlowProps> = ({ architecture }) => {
  const navigate = useNavigate();
  const { id: repoId } = useParams<{ id: string }>();

  // Layout calculation for tiers
  const { nodes, edges } = useMemo(() => {
    const calculatedNodes: Node[] = [];
    const calculatedEdges: Edge[] = [];

    // Desired tier order from top to bottom
    const tierOrder = ["FRONTEND", "CONTROLLER", "SERVICE", "REPOSITORY", "DATABASE", "SECURITY"];

    let yOffset = 40;

    tierOrder.forEach((tier) => {
      const nodeList = architecture.tiers[tier] || [];
      if (nodeList.length === 0) return;

      const spacingX = 230;
      const startX = Math.max(50, 480 - (nodeList.length * spacingX) / 2);

      nodeList.forEach((node, idx) => {
        calculatedNodes.push({
          id: node.id || `${tier}-${idx}`,
          type: "tierNode",
          position: { x: startX + idx * spacingX, y: yOffset },
          data: {
            ...node,
            tier,
          },
        });
      });

      yOffset += 140;
    });

    // Edges
    if (architecture.edges) {
      architecture.edges.forEach((edge, idx) => {
        calculatedEdges.push({
          id: `edge-${idx}`,
          source: edge.source,
          target: edge.target,
          animated: true,
          label: edge.label,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: "#2563EB",
          },
          style: {
            stroke: "#3B82F6",
            strokeWidth: 2,
            strokeDasharray: edge.label ? "4 2" : undefined,
          },
          labelStyle: {
            fill: "#1E293B",
            fontSize: 10,
            fontFamily: "monospace",
            fontWeight: 600,
          },
        });
      });
    }

    return { nodes: calculatedNodes, edges: calculatedEdges };
  }, [architecture]);

  return (
    <div className="w-full h-full min-h-[500px] rounded-3xl border border-blue-100 bg-[#EFF8FF] relative overflow-hidden shadow-card">
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-blue-200 shadow-card flex items-center space-x-2 text-xs">
        <Layers className="w-4 h-4 text-primary" />
        <span className="font-bold text-navy">Tiered Architecture Flow</span>
        <span className="text-navy-subtle font-mono text-[11px]">· Top-to-Bottom Data Path</span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        className="bg-[#EFF8FF]"
      >
        <Background color="#93C5FD" gap={24} size={1} />
        <Controls className="!bg-white !border !border-blue-200 !rounded-2xl !shadow-card text-navy" />
      </ReactFlow>
    </div>
  );
};
