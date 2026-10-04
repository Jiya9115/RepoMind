import { request } from "./api";
import {
  Repository,
  AnalysisStatusResponse,
  FileSummary,
  FileDetail,
  TreeNode,
  CodeSymbol,
  Dependency,
  CodebaseMap,
  ArchitectureOverview,
  SecurityOverview,
  TechnicalDebtOverview,
  GitOverview,
} from "../types";

export const repoService = {
  async listRepositories(): Promise<Repository[]> {
    return request<Repository[]>("/repositories");
  },

  async getDemoRepository(): Promise<Repository> {
    return request<Repository>("/repositories/demo");
  },

  async getRepository(id: number | string): Promise<Repository> {
    return request<Repository>(`/repositories/${id}`);
  },

  async importRepository(githubUrl: string, branch = "main"): Promise<Repository> {
    return request<Repository>("/repositories", {
      method: "POST",
      body: JSON.stringify({ githubUrl, branch }),
    });
  },

  async triggerAnalysis(id: number | string): Promise<{ message: string; status: string }> {
    return request(`/repositories/${id}/analyze`, { method: "POST" });
  },

  async getAnalysisProgress(id: number | string): Promise<AnalysisStatusResponse> {
    return request<AnalysisStatusResponse>(`/repositories/${id}/progress`);
  },

  async deleteRepository(id: number | string): Promise<{ message: string }> {
    return request(`/repositories/${id}`, { method: "DELETE" });
  },

  async getFiles(id: number | string): Promise<FileSummary[]> {
    return request<FileSummary[]>(`/repositories/${id}/files`);
  },

  async getFileDetail(id: number | string, fileId: number | string): Promise<FileDetail> {
    return request<FileDetail>(`/repositories/${id}/files/${fileId}`);
  },

  async getFileTree(id: number | string): Promise<TreeNode[]> {
    return request<TreeNode[]>(`/repositories/${id}/tree`);
  },

  async getSymbols(id: number | string, query?: string): Promise<CodeSymbol[]> {
    const q = query ? `?q=${encodeURIComponent(query)}` : "";
    return request<CodeSymbol[]>(`/repositories/${id}/symbols${q}`);
  },

  async getDependencies(id: number | string): Promise<Dependency[]> {
    return request<Dependency[]>(`/repositories/${id}/dependencies`);
  },

  async getCodebaseMap(id: number | string): Promise<CodebaseMap> {
    return request<CodebaseMap>(`/repositories/${id}/map`);
  },

  async getArchitecture(id: number | string): Promise<ArchitectureOverview> {
    return request<ArchitectureOverview>(`/repositories/${id}/architecture`);
  },

  async getSecurityOverview(id: number | string): Promise<SecurityOverview> {
    return request<SecurityOverview>(`/repositories/${id}/security`);
  },

  async getTechnicalDebt(id: number | string): Promise<TechnicalDebtOverview> {
    return request<TechnicalDebtOverview>(`/repositories/${id}/technical-debt`);
  },

  async getGitOverview(id: number | string): Promise<GitOverview> {
    return request<GitOverview>(`/repositories/${id}/git`);
  },

  // Aliases for convenience
  getAll: function() { return repoService.listRepositories(); },
  getById: function(id: number | string) { return repoService.getRepository(id); },
  getMap: function(id: number | string) { return repoService.getCodebaseMap(id); },
  getSecurity: function(id: number | string) { return repoService.getSecurityOverview(id); },
  getDebt: function(id: number | string) { return repoService.getTechnicalDebt(id); },
  getGit: function(id: number | string) { return repoService.getGitOverview(id); },
  delete: function(id: number | string) { return repoService.deleteRepository(id); },
};

