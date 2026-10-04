import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { AiAssistantPanel } from "./AiAssistantPanel";
import { CommandPalette } from "./CommandPalette";
import { RecruiterModal } from "./RecruiterModal";
import { repoService } from "../services/repoService";

export const Layout: React.FC = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [repoName, setRepoName] = useState<string | undefined>();
  const [initialAiPrompt, setInitialAiPrompt] = useState<string | undefined>();

  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  // Fetch repo name when repository ID is present in URL
  useEffect(() => {
    if (id) {
      repoService
        .getById(id)
        .then((repo) => setRepoName(repo.name))
        .catch(() => setRepoName("demo-shop"));
    } else {
      setRepoName(undefined);
    }
  }, [id]);

  // Global keyboard shortcut for Command Palette (⌘K or Ctrl+K) and AI Drawer (⌘J)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setIsAiOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAskAi = (prompt: string) => {
    setInitialAiPrompt(prompt);
    setIsAiOpen(true);
  };

  const isRepoView = Boolean(id);

  return (
    <div className="min-h-screen bg-background-page text-navy flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleAi={() => setIsAiOpen((prev) => !prev)}
        isAiOpen={isAiOpen}
        repoName={repoName}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (rendered on repository pages) */}
        {isRepoView && <Sidebar />}

        {/* Page Content Body */}
        <main className="flex-1 flex flex-col overflow-y-auto min-w-0 bg-background-page">
          <Outlet context={{ onAskAi: handleAskAi }} />
        </main>

        {/* Floating/Right AI Assistant Drawer */}
        <AiAssistantPanel
          isOpen={isAiOpen}
          onClose={() => setIsAiOpen(false)}
          repositoryId={id ? parseInt(id, 10) : undefined}
          initialPrompt={initialAiPrompt}
        />
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onToggleAi={() => setIsAiOpen(true)}
      />

      {/* Recruiter Architecture Modal */}
      <RecruiterModal />
    </div>
  );
};
