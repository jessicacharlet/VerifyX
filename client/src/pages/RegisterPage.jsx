import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, Mail, Lock, User, Building, Phone, Wallet, AlertCircle, ArrowRight } from "lucide-react";

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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#050816]">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white mx-auto shadow-md shadow-purple-600/30 border border-purple-400/30">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-400">Register your brand to sign items on the Ethereum blockchain</p>
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
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-[#0A1020] border border-[#1E2A47] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
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
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-[#0A1020] border border-[#1E2A47] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
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
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-[#0A1020] border border-[#1E2A47] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
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
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-[#0A1020] border border-[#1E2A47] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
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
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-[#0A1020] border border-[#1E2A47] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                />
                <Wallet className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/20 border border-purple-400/30 flex items-center justify-center space-x-2 transition-all mt-4"
            >
              <span>{isSubmitting ? "Creating Account..." : "Complete Registration"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Already registered?{" "}
          <Link to="/login" className="text-purple-400 hover:underline font-bold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
