const rawBase = import.meta.env.VITE_API_URL || "/api";
const API_BASE_URL = rawBase.endsWith("/api")
  ? rawBase
  : rawBase === "/api"
  ? "/api"
  : `${rawBase.replace(/\/+$/, "")}/api`;

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("repomind_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Request failed with status ${response.status}`;
    let errorData = null;
    try {
      errorData = await response.json();
      if (errorData.message) errorMsg = errorData.message;
      else if (errorData.detail) errorMsg = errorData.detail;
      else if (errorData.error) errorMsg = errorData.error;
    } catch {
      // not json
    }
    throw new ApiError(errorMsg, response.status, errorData);
  }

  // Handle empty responses like 204 or void
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}
