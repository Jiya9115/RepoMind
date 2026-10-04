import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sparkles, Send, X, ExternalLink, Bot, User as UserIcon, RefreshCw, Shield, AlertCircle } from "lucide-react";
import { aiService } from "../services/aiService";
import { ChatMessage, SourceCitation } from "../types";

interface AiAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeContextFile?: string;
  repositoryId?: number;
  initialPrompt?: string;
}

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({
  isOpen,
  onClose,
  activeContextFile,
  repositoryId,
  initialPrompt,
}) => {
  const { id: routeId } = useParams<{ id: string }>();
  const id = repositoryId ? String(repositoryId) : routeId;
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<number | undefined>();
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [providerName, setProviderName] = useState("Demo Mode");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "How does authentication work?",
    "Where is the database connection created?",
    "Which classes handle JWT authentication?",
    "What are the most complex files?",
    "Where could security vulnerabilities exist?",
    "Explain this architecture.",
  ];

  useEffect(() => {
    if (id && messages.length === 0) {
      aiService.listSessions(id).then((sessions) => {
        if (sessions.length > 0 && sessions[0].messages.length > 0) {
          setSessionId(sessions[0].id);
          setMessages(sessions[0].messages);
        }
      }).catch(() => {});
    }
  }, [id]);

  useEffect(() => {
    if (initialPrompt) {
      setInputQuery(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim() || !id || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: text,
      sources: [],
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const response = await aiService.chat(id, text, sessionId, activeContextFile);
      setSessionId(response.sessionId);
      setIsDemoMode(response.isDemoMode);
      setProviderName(response.provider);
      setMessages((prev) => [...prev, response.message]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: `Error: ${err.message || "Failed to process query."}`,
        sources: [],
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitationClick = (citation: SourceCitation) => {
    if (!id) return;
    navigate(`/repositories/${id}/code?file=${encodeURIComponent(citation.file)}&line=${citation.startLine}`);
  };

  if (!isOpen) return null;

  return (
    <aside className="w-96 border-l border-border bg-white flex flex-col shrink-0 h-[calc(100vh-3.5rem)] shadow-float relative z-30">
      {/* Header */}
      <div className="p-3.5 border-b border-border flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-navy">Ask RepoMind</h3>
            {/* Clearly show AI Mode vs Demo Mode */}
            <div className="flex items-center space-x-1.5 text-[10px] font-mono mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? "bg-amber-500" : "bg-emerald-500"} animate-pulse`} />
              <span className={`font-bold ${isDemoMode ? "text-amber-700" : "text-emerald-700"}`}>
                {isDemoMode ? "Demo Mode (Offline Grounded)" : "AI Mode (Gemini 1.5)"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-navy-subtle hover:text-navy hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Active context file pill if any */}
      {activeContextFile && (
        <div className="px-3.5 py-1.5 bg-blue-50 border-b border-blue-100 text-[11px] font-mono text-navy flex items-center space-x-1.5">
          <span className="text-navy-subtle">File Context:</span>
          <span className="text-primary font-bold truncate max-w-[240px]">{activeContextFile}</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background-page/30">
        {messages.length === 0 && (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-card text-xs text-navy space-y-2">
              <p className="font-bold text-navy">Repository Q&A Intelligence</p>
              <p className="text-navy-muted leading-relaxed text-[11px]">
                Ask questions regarding architecture, data flows, breaking changes, or technical debt.
                Responses retrieve grounded AST symbols and dependency links.
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-navy-subtle font-bold px-1">
                Suggested Questions
              </p>
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left text-xs p-2.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-primary/40 text-navy transition-all shadow-xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`space-y-1.5 ${msg.role === "user" ? "ml-6" : "mr-2"}`}
          >
            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-navy-subtle">
              {msg.role === "user" ? (
                <>
                  <UserIcon className="w-3 h-3 text-navy-subtle" />
                  <span className="font-bold">You</span>
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-primary" />
                  <span className="font-bold text-primary">RepoMind Engine</span>
                </>
              )}
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-xs ${
                msg.role === "user"
                  ? "bg-primary text-white font-medium"
                  : "bg-white border border-blue-100 text-navy shadow-card"
              }`}
            >
              {msg.content}
            </div>

            {/* Grounded Source Citations */}
            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-2 p-3 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5 shadow-xs">
                <div className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold flex items-center space-x-1">
                  <ExternalLink className="w-3 h-3 text-primary" />
                  <span>Verified Citations ({msg.sources.length})</span>
                </div>
                <div className="space-y-1">
                  {msg.sources.map((src, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleCitationClick(src)}
                      className="w-full text-left p-2 rounded-xl bg-white hover:bg-blue-50 border border-blue-100 hover:border-primary/40 flex items-center justify-between text-[11px] font-mono text-primary font-bold transition-all group shadow-xs"
                      title={src.description || src.snippet || "Click to inspect in Code Explorer"}
                    >
                      <span className="truncate max-w-[260px]">
                        {src.file}:{src.startLine}-{src.endLine}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-navy-muted p-3 bg-white rounded-2xl border border-blue-100 animate-pulse shadow-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
            <span>Analyzing repository AST, dependencies & RAG embeddings...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3.5 border-t border-border bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about this codebase..."
            disabled={isLoading}
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary rounded-xl pl-3 pr-10 py-2.5 text-xs text-navy placeholder-slate-400 focus:outline-none transition-all shadow-xs"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="absolute right-1.5 p-1.5 rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-40 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </aside>
  );
};
