import { request } from "./api";
import { AuthResponse, User } from "../types";

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const data = await request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem("repomind_token", data.accessToken);
    localStorage.setItem("repomind_user", JSON.stringify(data.user));
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("repomind_token", data.accessToken);
    localStorage.setItem("repomind_user", JSON.stringify(data.user));
    return data;
  },

  async getDemoToken(): Promise<AuthResponse> {
    const data = await request<AuthResponse>("/auth/demo-token");
    localStorage.setItem("repomind_token", data.accessToken);
    localStorage.setItem("repomind_user", JSON.stringify(data.user));
    return data;
  },

  logout(): void {
    localStorage.removeItem("repomind_token");
    localStorage.removeItem("repomind_user");
    request("/auth/logout", { method: "POST" }).catch(() => {});
  },

  getCurrentUser(): User | null {
    const cached = localStorage.getItem("repomind_user");
    if (!cached) return null;
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  },

  async fetchMe(): Promise<User> {
    return request<User>("/auth/me");
  },

  async getGithubStatus(): Promise<{ configured: boolean; clientId?: string; message: string }> {
    return request("/auth/github");
  }
};
