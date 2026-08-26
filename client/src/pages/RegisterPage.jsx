import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Lock, Mail, User, Building, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "manufacturer",
    companyName: "",
    walletAddress: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      const res = await register(formData);
      if (res.success) {
        if (res.user.role === "admin") navigate("/admin");
        else if (res.user.role === "manufacturer") navigate("/dashboard");
        else navigate("/products");
      } else {
        setError(res.message || "Registration failed.");
      }
    } catch (err) {
      setError("Registration service error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#070A0F]">
      <div className="w-full max-w-md bg-[#0D121A] p-6 sm:p-8 rounded-lg border border-[#202A36] space-y-6 shadow-md">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded bg-[#06b6d4] text-[#070A0F] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Create VerifyX account</h1>
          <p className="text-xs text-[#8B97A7]">
            Register manufacturer or enterprise user account
          </p>
        </div>

        {error && (
          <div className="p-3 rounded bg-red-950/60 border border-red-500/30 text-xs text-red-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-medium text-slate-300 text-[11px] block">Full name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#202A36] text-white placeholder-[#8B97A7] focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-slate-300 text-[11px] block">Email address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@enterprise.com"
              required
              className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#202A36] text-white placeholder-[#8B97A7] focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-slate-300 text-[11px] block">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#202A36] text-white placeholder-[#8B97A7] focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-medium text-slate-300 text-[11px] block">Account role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded bg-[#111821] border border-[#202A36] text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="manufacturer">Manufacturer</option>
                <option value="customer">Customer / Auditor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-slate-300 text-[11px] block">Company name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enterprise Inc."
                className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#202A36] text-white placeholder-[#8B97A7] focus:outline-none focus:border-cyan-500 font-mono text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-md font-bold text-xs text-[#070A0F] bg-[#06b6d4] hover:bg-[#0891b2] transition-colors border border-cyan-400/30"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#8B97A7] border-t border-[#202A36]">
          Already registered?{" "}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
