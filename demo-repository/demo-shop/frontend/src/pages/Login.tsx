import React, { useState } from "react";
import { AuthService } from "../services/authService";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AuthService.login(email, password);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    }
  };

  return (
    <div className="login-container">
      <h2>DemoShop Sign In</h2>
      {error && <div className="error-alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};
