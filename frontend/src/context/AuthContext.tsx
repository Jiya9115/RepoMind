import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { authService } from "../services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  loginWithDemo: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cached = authService.getCurrentUser();
    if (cached) {
      setUser(cached);
      setIsLoading(false);
    } else {
      // Auto-load demo user for seamless offline evaluation
      authService.getDemoToken()
        .then((res) => setUser(res.user))
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false));
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await authService.login(email, pass);
      setUser(res.user);
    } catch (err) {
      if (email === "demo@repomind.io" && pass === "demopassword123") {
        const demoUser: User = {
          id: 1,
          name: "Demo Recruiter",
          email: "demo@repomind.io",
          githubId: "demo-recruiter",
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("repomind_user", JSON.stringify(demoUser));
        localStorage.setItem("repomind_token", "demo-offline-token");
        setUser(demoUser);
        return;
      }
      throw err;
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    const res = await authService.register(name, email, pass);
    setUser(res.user);
  };

  const loginWithDemo = async () => {
    try {
      const res = await authService.getDemoToken();
      setUser(res.user);
    } catch (err) {
      console.warn("Backend not reachable for demo token, activating local demo session", err);
      const demoUser: User = {
        id: 1,
        name: "Demo Recruiter",
        email: "demo@repomind.io",
        githubId: "demo-recruiter",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("repomind_user", JSON.stringify(demoUser));
      localStorage.setItem("repomind_token", "demo-offline-token");
      setUser(demoUser);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
