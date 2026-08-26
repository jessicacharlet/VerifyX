import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(email, password);
      if (res.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#050816]">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white mx-auto shadow-md shadow-purple-600/30 border border-purple-400/30">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign In to VeriMark</h2>
          <p className="text-xs text-slate-400">Access your Manufacturer Dashboard or Governance Console</p>
        </div>

        {/* Card */}
        <div className="bg-[#0D1528] p-8 rounded-2xl border border-[#1E2A47] space-y-6 shadow-xl">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-[#0A1020] border border-[#1E2A47] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-[#0A1020] border border-[#1E2A47] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/20 border border-purple-400/30 flex items-center justify-center space-x-2 transition-all"
            >
              <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-4 border-t border-[#1E2A47] space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoAccount("manufacturer@apple.com", "password123")}
                className="p-2 rounded-lg bg-[#0A1020] hover:bg-[#111B32] border border-[#1E2A47] text-slate-300 font-medium text-left"
              >
                🍏 Apple Manufacturer
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount("admin@verimark.io", "password123")}
                className="p-2 rounded-lg bg-[#0A1020] hover:bg-[#111B32] border border-[#1E2A47] text-cyan-400 font-medium text-left"
              >
                👑 System Admin
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-400 hover:underline font-bold">
            Register Account
          </Link>
        </p>
      </div>
    </div>
  );
}
