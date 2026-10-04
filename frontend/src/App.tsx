import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RepositoryOverviewPage } from "./pages/RepositoryOverviewPage";
import { CodebaseMapPage } from "./pages/CodebaseMapPage";
import { ArchitecturePage } from "./pages/ArchitecturePage";
import { CodeExplorerPage } from "./pages/CodeExplorerPage";
import { SecurityPage } from "./pages/SecurityPage";
import { DebtPage } from "./pages/DebtPage";
import { GitPage } from "./pages/GitPage";
import { DocsPage } from "./pages/DocsPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { SettingsPage } from "./pages/SettingsPage";

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* App Layout Wrapped Pages */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Repository Views */}
        <Route path="/repositories/:id" element={<RepositoryOverviewPage />} />
        <Route path="/repositories/:id/map" element={<CodebaseMapPage />} />
        <Route path="/repositories/:id/architecture" element={<ArchitecturePage />} />
        <Route path="/repositories/:id/code" element={<CodeExplorerPage />} />
        <Route path="/repositories/:id/security" element={<SecurityPage />} />
        <Route path="/repositories/:id/debt" element={<DebtPage />} />
        <Route path="/repositories/:id/git" element={<GitPage />} />
        <Route path="/repositories/:id/docs" element={<DocsPage />} />
        <Route path="/repositories/:id/onboarding" element={<OnboardingPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
