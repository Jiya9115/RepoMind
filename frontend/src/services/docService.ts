import { request } from "./api";
import { DocumentationResponse, OnboardingGuide } from "../types";

export const docService = {
  async getDocumentation(repoId: number | string): Promise<DocumentationResponse> {
    return request<DocumentationResponse>(`/repositories/${repoId}/documentation`);
  },

  async generateDocumentation(repoId: number | string): Promise<DocumentationResponse> {
    return request<DocumentationResponse>(`/repositories/${repoId}/documentation/generate`, {
      method: "POST",
    });
  },

  async getOnboardingGuide(repoId: number | string): Promise<OnboardingGuide> {
    return request<OnboardingGuide>(`/repositories/${repoId}/onboarding`);
  },
};
