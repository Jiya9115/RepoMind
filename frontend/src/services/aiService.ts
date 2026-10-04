import { request } from "./api";
import { ChatResponse, ChatSession } from "../types";

export const aiService = {
  async chat(
    repoId: number | string,
    message: string,
    sessionId?: number,
    contextFile?: string
  ): Promise<ChatResponse> {
    return request<ChatResponse>(`/repositories/${repoId}/chat`, {
      method: "POST",
      body: JSON.stringify({ message, sessionId, contextFile }),
    });
  },

  async listSessions(repoId: number | string): Promise<ChatSession[]> {
    return request<ChatSession[]>(`/repositories/${repoId}/chat/sessions`);
  },
};
