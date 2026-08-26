import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Mail, Lock, User, Building, Phone, Wallet, AlertCircle, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "manufacturer",
    companyName: "",
    phone: "",
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

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await register(formData);
      if (res.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Register Error:", err);
      setError(err.response?.data?.message || "Registration failed. Email may already be registered.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#05070D]">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#06b6d4] flex items-center justify-center text-[#05070D] mx-auto shadow-md shadow-cyan-500/20 border border-cyan-400/40">
            <ShieldCheck className="w-7 h-7 font-bold" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-[#8B98AA]">Register your brand to sign items on the Ethereum blockchain</p>
        </div>

        {/* Card */}
        <div className="bg-[#101722] p-8 rounded-xl border border-[#1D2938] space-y-6 shadow-xl">
          {error && (
            <div className="p-3 rounded-md bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase tracking-wider block">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 pl-10 rounded-md bg-[#0B111B] border border-[#1D2938] text-white placeholder-[#8B98AA] focus:outline-none focus:border-cyan-500"
                  />
                  <User className="w-4 h-4 text-[#8B98AA] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase tracking-wider block">Company Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Acme Luxury Corp"
                    className="w-full px-4 py-3 pl-10 rounded-md bg-[#0B111B] border border-[#1D2938] text-white placeholder-[#8B98AA] focus:outline-none focus:border-cyan-500"
                  />
                  <Building className="w-4 h-4 text-[#8B98AA] absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="manufacturer@company.com"
                  required
                  className="w-full px-4 py-3 pl-10 rounded-md bg-[#0B111B] border border-[#1D2938] text-white placeholder-[#8B98AA] focus:outline-none focus:border-cyan-500"
                />
                <Mail className="w-4 h-4 text-[#8B98AA] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  className="w-full px-4 py-3 pl-10 rounded-md bg-[#0B111B] border border-[#1D2938] text-white placeholder-[#8B98AA] focus:outline-none focus:border-cyan-500"
                />
                <Lock className="w-4 h-4 text-[#8B98AA] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono font-bold text-slate-300 uppercase tracking-wider block">Ethereum Wallet Address</label>
              <div className="relative">
                <input
                  type="text"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleChange}
                  placeholder="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
                  className="w-full px-4 py-3 pl-10 rounded-md bg-[#0B111B] border border-[#1D2938] text-white placeholder-[#8B98AA] focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                />
                <Wallet className="w-4 h-4 text-[#8B98AA] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-md font-bold text-[#05070D] bg-[#06b6d4] hover:bg-[#22d3ee] shadow-md shadow-cyan-500/20 border border-cyan-400/40 flex items-center justify-center space-x-2 transition-all mt-4"
            >
              <span>{isSubmitting ? "Creating Account..." : "Complete Registration"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#8B98AA]">
          Already registered?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline font-bold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
