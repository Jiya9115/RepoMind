import React, { useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { CodeSymbol } from "../types";
import { Copy, Check, Sparkles, Code2, ListFilter } from "lucide-react";

interface MonacoCodeViewerProps {
  code: string;
  language: string;
  filePath?: string;
  symbols?: CodeSymbol[];
  highlightLine?: number;
  highlightLineEnd?: number;
  onAskAiSnippet?: (snippet: string) => void;
}

export const MonacoCodeViewer: React.FC<MonacoCodeViewerProps> = ({
  code,
  language,
  filePath,
  symbols = [],
  highlightLine,
  highlightLineEnd,
  onAskAiSnippet,
}) => {
  const editorRef = useRef<any>(null);
  const [copied, setCopied] = React.useState(false);
  const decorationsRef = useRef<string[]>([]);

  // Map backend language strings to Monaco editor languages
  const getMonacoLanguage = (lang: string): string => {
    const l = lang?.toLowerCase() || "";
    if (l === "java") return "java";
    if (l === "typescript" || l === "ts" || l === "tsx") return "typescript";
    if (l === "javascript" || l === "js" || l === "jsx") return "javascript";
    if (l === "python" || l === "py") return "python";
    if (l === "sql") return "sql";
    if (l === "json") return "json";
    if (l === "html") return "html";
    if (l === "css") return "css";
    if (l === "markdown" || l === "md") return "markdown";
    if (l === "xml") return "xml";
    if (l === "yaml" || l === "yml") return "yaml";
    return "plaintext";
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Apply initial line highlight if provided
    if (highlightLine && highlightLine > 0) {
      jumpToLine(highlightLine, highlightLineEnd);
    }
  };

  const jumpToLine = (start: number, end?: number) => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    editor.revealLineInCenter(start);

    // Add high-visibility line highlight decoration
    const endL = end && end >= start ? end : start;
    const newDecorations = [
      {
        range: {
          startLineNumber: start,
          startColumn: 1,
          endLineNumber: endL,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: "bg-blue-100/70 border-l-4 border-primary",
          overviewRuler: {
            color: "#2563EB",
            position: 4,
          },
        },
      },
    ];

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
  };

  useEffect(() => {
    if (highlightLine && highlightLine > 0) {
      jumpToLine(highlightLine, highlightLineEnd);
    }
  }, [highlightLine, highlightLineEnd]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskAiAboutSelection = () => {
    if (!editorRef.current || !onAskAiSnippet) return;
    const selection = editorRef.current.getSelection();
    const selectedText = editorRef.current.getModel()?.getValueInRange(selection);
    if (selectedText && selectedText.trim().length > 0) {
      onAskAiSnippet(selectedText);
    } else {
      onAskAiSnippet(code);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-blue-100 shadow-card overflow-hidden">
      {/* Top action toolbar */}
      <div className="h-11 bg-white px-4 border-b border-border flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 font-mono text-navy">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="font-bold truncate max-w-sm">{filePath || "Source File"}</span>
          <span className="text-[10px] uppercase font-bold text-primary bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            {language}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onAskAiSnippet && (
            <button
              onClick={handleAskAiAboutSelection}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-primary border border-blue-200 text-xs font-semibold transition-all shadow-xs"
              title="Explain selected code or file with AI"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-navy border border-slate-200 text-xs font-semibold transition-all shadow-xs"
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
        </div>
      </div>

      {/* Editor & Symbol sidebar layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Monaco Editor Container */}
        <div className="flex-1 h-full">
          <Editor
            height="100%"
            language={getMonacoLanguage(language)}
            value={code}
            theme="vs"
            onMount={handleEditorDidMount}
            options={{
              readOnly: true,
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
              fontLigatures: true,
              lineNumbers: "on",
              minimap: { enabled: true, maxColumn: 80 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              renderWhitespace: "selection",
              smoothScrolling: true,
              cursorBlinking: "smooth",
            }}
          />
        </div>

        {/* Symbols Outline Bar (if symbols exist) */}
        {symbols && symbols.length > 0 && (
          <div className="w-64 border-l border-border bg-slate-50/50 hidden lg:flex flex-col text-xs">
            <div className="p-3 border-b border-border font-mono text-[11px] text-navy font-bold uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <ListFilter className="w-3.5 h-3.5 text-primary" />
                <span>AST Symbols</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-primary border border-blue-200 text-[10px] font-bold">
                {symbols.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {symbols.map((sym, idx) => (
                <button
                  key={`${sym.name}-${idx}`}
                  onClick={() => jumpToLine(sym.startLine, sym.endLine)}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white flex items-center justify-between text-navy hover:text-primary transition-all group border border-transparent hover:border-blue-100 shadow-xs"
                >
                  <span className="font-mono text-xs font-semibold truncate mr-2" title={sym.name}>
                    {sym.name}
                  </span>
                  <div className="flex items-center space-x-1 shrink-0">
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-navy-muted border border-slate-200">
                      {sym.type}
                    </span>
                    <span className="text-[10px] font-mono text-navy-subtle group-hover:text-primary font-semibold">
                      L{sym.startLine}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
