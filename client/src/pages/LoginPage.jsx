import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Info, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, token, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromState = location.state?.from;
  const redirectTarget = fromState
    ? typeof fromState === "object"
      ? (fromState.pathname + (fromState.search || ""))
      : String(fromState)
    : null;

  const redirectMsg =
    location.state?.message ||
    (redirectTarget?.includes("register")
      ? "Sign in to register and manage your digital assets."
      : null);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!loading && user && token) {
      const isValidInternalPath =
        redirectTarget &&
        typeof redirectTarget === "string" &&
        redirectTarget.startsWith("/") &&
        !redirectTarget.startsWith("//") &&
        redirectTarget !== "/login" &&
        redirectTarget !== "/register";

      const userRole = (user.role || "").toLowerCase();
      const targetPath = isValidInternalPath
        ? redirectTarget
        : userRole === "admin"
        ? "/admin"
        : "/dashboard";

      navigate(targetPath, { replace: true });
    }
  }, [user, token, loading, navigate, redirectTarget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      const res = await login(email, password);
      if (res && res.success) {
        const isValidInternalPath =
          redirectTarget &&
          typeof redirectTarget === "string" &&
          redirectTarget.startsWith("/") &&
          !redirectTarget.startsWith("//") &&
          redirectTarget !== "/login" &&
          redirectTarget !== "/register";

        const userRole = (res.user?.role || user?.role || "").toLowerCase();
        const targetPath = isValidInternalPath
          ? redirectTarget
          : userRole === "admin"
          ? "/admin"
          : "/dashboard";

        navigate(targetPath, { replace: true });
      } else {
        const rawErr = res?.message || "Failed to authenticate.";
        setError(typeof rawErr === "string" ? rawErr : rawErr?.message || "Failed to authenticate.");
      }
    } catch (err) {
      const rawMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      const cleanMsg =
        typeof rawMsg === "string"
          ? rawMsg
          : typeof rawMsg === "object" && typeof rawMsg?.message === "string"
          ? rawMsg.message
          : "Login failed. Please check credentials.";
      setError(cleanMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#070A0F] font-sans animate-fadeIn">
      <div className="w-full max-w-md bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-[#202A36] space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-[#070A0F] flex items-center justify-center mx-auto shadow-md shadow-cyan-500/20">
            <ShieldCheck className="w-7 h-7 font-bold" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Sign in to VerifyX</h1>
          <p className="text-xs text-[#8B97A7]">
            Enterprise authentication portal
          </p>
        </div>

        {redirectMsg && (
          <div className="p-3.5 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-xs text-cyan-200 flex items-start space-x-2.5 shadow-sm">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span className="font-medium">{redirectMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-500/30 text-xs text-red-300 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{typeof error === "string" ? error : (error?.message || "Authentication failed.")}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-medium text-slate-300 text-[11px] block">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@enterprise.com"
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#111821] border border-[#202A36] text-white placeholder-[#8B97A7] focus:outline-none focus:border-cyan-400 font-mono text-xs transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-slate-300 text-[11px] block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#111821] border border-[#202A36] text-white placeholder-[#8B97A7] focus:outline-none focus:border-cyan-400 font-mono text-xs transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg font-bold text-xs text-[#070A0F] bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/20"
          >
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#8B97A7] border-t border-[#202A36]">
          Don't have an account?{" "}
          <Link to="/register" state={location.state} className="text-cyan-400 font-bold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
