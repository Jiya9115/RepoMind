import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cpu, Lock, Mail, User as UserIcon, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, loginWithDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithDemo();
      navigate("/dashboard");
    } catch (err: any) {
      setError("Demo login error: " + (err?.message || "Could not login"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-page flex flex-col justify-center items-center px-4 select-none">
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-3xl p-8 shadow-card">
        <div className="flex flex-col items-center text-center mb-6">
          <Link to="/" className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3 shadow-xs">
            <Cpu className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-navy tracking-tight">Create your RepoMind account</h1>
          <p className="text-xs text-navy-muted mt-1">
            Start parsing, understanding, and auditing codebases with AI.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDemoSignIn}
          disabled={loading}
          className="w-full mb-6 py-2.5 px-4 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-primary text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Quick Explore with Pre-loaded Demo Account</span>
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-mono text-navy-subtle uppercase tracking-wider">
            Or create account
          </span>
          <div className="border-t border-slate-200 w-full" />
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-navy-subtle absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Developer"
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary rounded-xl py-2.5 pl-9 pr-3 text-xs text-navy placeholder-slate-400 focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-navy-subtle absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary rounded-xl py-2.5 pl-9 pr-3 text-xs text-navy placeholder-slate-400 focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-navy-subtle absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary rounded-xl py-2.5 pl-9 pr-3 text-xs text-navy placeholder-slate-400 focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-card mt-2"
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-navy-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
