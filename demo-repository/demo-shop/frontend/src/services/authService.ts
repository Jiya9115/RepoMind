import { apiRequest } from "./api";

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export class AuthService {
  static async login(email: string, password: string):Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    if (!response.ok) {
      throw new Error("Invalid username or password");
    }

    const data: AuthResponse = await response.json();
    localStorage.setItem("demoshop_token", data.access_token);
    return data;
  }

  static async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem("demoshop_token", data.access_token);
    return data;
  }

  static logout() {
    localStorage.removeItem("demoshop_token");
  }
}
