import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { docService } from "../services/docService";
import { DocumentationResponse, DocItem } from "../types";
import {
  FileText,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  BookOpen,
  Code2,
} from "lucide-react";

export const DocsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [docs, setDocs] = useState<DocumentationResponse | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadDocs();
  }, [id]);

  const loadDocs = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await docService.getDocumentation(id);
      setDocs(data);
      if (data.documents && data.documents.length > 0) {
        setSelectedDoc(data.documents[0]);
      }
    } catch (err) {
      console.error("Failed to load documentation", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!id) return;
    setIsGenerating(true);
    try {
      const data = await docService.generateDocumentation(id);
      setDocs(data);
      if (data.documents && data.documents.length > 0) {
        setSelectedDoc(data.documents[0]);
      }
    } catch (err) {
      console.error("Failed to regenerate docs", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!selectedDoc) return;
    navigator.clipboard.writeText(selectedDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!selectedDoc) return;
    const blob = new Blob([selectedDoc.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selectedDoc.filename || "documentation.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-navy-muted">
        <RefreshCw className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-xs font-mono">Synthesizing markdown documentation and guides...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-background-page">
      {/* Docs navigation sidebar */}
      <div className="w-64 border-r border-border bg-white flex flex-col shrink-0 shadow-subtle z-10">
        <div className="p-3.5 border-b border-border flex items-center justify-between bg-slate-50/50">
          <span className="font-mono text-xs uppercase text-navy font-bold flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>Doc Suite</span>
          </span>
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            title="Regenerate all documents"
            className="p-1.5 rounded-lg text-navy-subtle hover:text-navy hover:bg-white transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>

        <div className="p-2 space-y-1 flex-1 overflow-y-auto">
          {(docs?.documents || []).map((doc) => {
            const isSelected = selectedDoc?.filename === doc.filename;
            return (
              <button
                key={doc.filename}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all ${
                  isSelected
                    ? "bg-primary/10 text-primary border border-primary/20 font-bold shadow-xs"
                    : "text-navy-muted hover:text-navy hover:bg-slate-50"
                }`}
              >
                <FileText className={`w-3.5 h-3.5 ${isSelected ? "text-primary" : "text-navy-subtle"}`} />
                <span className="truncate">{doc.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Document Viewer */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-page p-6">
        {selectedDoc ? (
          <div className="bg-white rounded-3xl border border-blue-100 shadow-card flex flex-col h-full overflow-hidden">
            {/* Action Bar */}
            <div className="h-14 border-b border-border px-6 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-sm font-bold text-navy">{selectedDoc.title}</h2>
                <span className="font-mono text-[10px] text-navy-muted">{selectedDoc.filename}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-navy border border-slate-200 text-xs font-semibold transition-all shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-navy-subtle" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-semibold transition-all shadow-card"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
              </div>
            </div>

            {/* Document Content View */}
            <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
              <pre className="font-sans text-xs sm:text-sm text-navy whitespace-pre-wrap leading-relaxed">
                {selectedDoc.content}
              </pre>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-navy-muted text-xs">
            <BookOpen className="w-8 h-8 mb-2 text-slate-300" />
            <span>Select a document from the left suite to preview</span>
          </div>
        )}
      </div>
    </div>
  );
};
