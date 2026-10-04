import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useOutletContext } from "react-router-dom";
import { MonacoCodeViewer } from "../components/MonacoCodeViewer";
import { repoService } from "../services/repoService";
import { FileSummary, FileDetail } from "../types";
import {
  Code2,
  Folder,
  File,
  Search,
  RefreshCw,
  FileCode,
  Terminal,
  AlertCircle,
} from "lucide-react";

export const CodeExplorerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { onAskAi } = useOutletContext<{ onAskAi?: (prompt: string) => void }>() || {};

  const [files, setFiles] = useState<FileSummary[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileDetail | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const targetFilePath = searchParams.get("file");
  const targetLine = searchParams.get("line") ? parseInt(searchParams.get("line")!, 10) : undefined;
  const targetEndLine = searchParams.get("endLine") ? parseInt(searchParams.get("endLine")!, 10) : undefined;

  // Load files list
  useEffect(() => {
    if (!id) return;
    setLoadingFiles(true);
    repoService
      .getFiles(id)
      .then((data) => {
        setFiles(data);
        if (targetFilePath) {
          const match = data.find((f) => f.path === targetFilePath || f.path.endsWith(targetFilePath));
          if (match) loadFileContent(match.id);
          else if (data.length > 0) loadFileContent(data[0].id);
        } else if (data.length > 0) {
          loadFileContent(data[0].id);
        }
      })
      .catch((err) => console.error("Failed to load files", err))
      .finally(() => setLoadingFiles(false));
  }, [id]);

  useEffect(() => {
    if (targetFilePath && files.length > 0) {
      const match = files.find((f) => f.path === targetFilePath || f.path.endsWith(targetFilePath));
      if (match && (!selectedFile || selectedFile.id !== match.id)) {
        loadFileContent(match.id);
      }
    }
  }, [targetFilePath, files]);

  const loadFileContent = async (fileId: number) => {
    if (!id) return;
    setLoadingContent(true);
    try {
      const detail = await repoService.getFileDetail(id, fileId);
      setSelectedFile(detail);
      setSearchParams({ file: detail.path });
    } catch (err) {
      console.error("Failed to load file content", err);
    } finally {
      setLoadingContent(false);
    }
  };

  const filteredFiles = files.filter((f) =>
    f.path.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-background-page">
      {/* Left File Tree Sidebar */}
      <div className="w-72 border-r border-border bg-white flex flex-col shrink-0 select-none shadow-subtle z-10">
        {/* Search header */}
        <div className="p-3 border-b border-border bg-slate-50/50">
          <div className="flex items-center px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs shadow-xs">
            <Search className="w-3.5 h-3.5 text-navy-subtle mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Filter files..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-transparent text-navy placeholder-slate-400 focus:outline-none font-mono text-xs"
            />
          </div>
        </div>

        {/* Files list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {loadingFiles ? (
            <div className="p-4 text-center text-xs text-navy-muted">Loading files...</div>
          ) : filteredFiles.length === 0 ? (
            <div className="p-4 text-center text-xs text-navy-muted">No files found</div>
          ) : (
            filteredFiles.map((f) => {
              const isSelected = selectedFile?.id === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => loadFileContent(f.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-primary/10 text-primary border border-primary/20 font-bold shadow-xs"
                      : "text-navy-muted hover:text-navy hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate mr-2">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-primary" : "text-navy-subtle"}`} />
                    <span className="truncate font-mono text-[11px]" title={f.path}>
                      {f.path}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-navy-subtle shrink-0">
                    {f.lineCount}L
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Center Monaco Editor & AST Outline */}
      <div className="flex-1 flex flex-col h-full overflow-hidden p-4 bg-background-page">
        {loadingContent ? (
          <div className="flex-1 flex flex-col items-center justify-center text-navy-muted">
            <RefreshCw className="w-6 h-6 animate-spin text-primary mb-2" />
            <p className="text-xs font-mono">Parsing source file & AST symbols...</p>
          </div>
        ) : selectedFile ? (
          <MonacoCodeViewer
            code={selectedFile.content || "// Empty file"}
            language={selectedFile.language}
            filePath={selectedFile.path}
            symbols={selectedFile.symbols || []}
            highlightLine={targetLine}
            highlightLineEnd={targetEndLine}
            onAskAiSnippet={(snippet) => {
              if (onAskAi) {
                onAskAi(
                  `Explain this code snippet from ${selectedFile.path}:\n\`\`\`${selectedFile.language}\n${snippet.slice(0, 1000)}\n\`\`\``
                );
              }
            }}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-navy-muted text-xs">
            <FileCode className="w-8 h-8 mb-2 text-slate-300" />
            <span>Select a file from the explorer to view code & AST symbols</span>
          </div>
        )}
      </div>
    </div>
  );
};
