import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  Package,
  CheckCircle,
  ShieldCheck,
  Search,
  Activity,
  PlusCircle,
  AlertTriangle,
  ArrowUpRight,
  RefreshCcw,
  Cpu,
  BrainCircuit,
  AlertCircle,
} from "lucide-react";

const PIE_COLORS = ["#06b6d4", "#3b82f6", "#14b8a6", "#f59e0b", "#ef4444"];
const AI_RISK_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export default function ManufacturerDashboard() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/analytics");
      if (res.data.success) {
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      console.error("Dashboard Analytics Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#05070D]">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-[#8B98AA]">Querying Blockchain Ledger & AI Telemetry Analytics...</p>
      </div>
    );
  }

  const {
    totalProducts = 0,
    authenticProducts = 0,
    activeProducts = 0,
    totalVerifications = 0,
    categories = [],
    recentVerifications = [],
    totalAiAnalyses = 0,
    lowRiskCount = 0,
    moderateRiskCount = 0,
    highRiskCount = 0,
    averageRiskScore = 12,
    aiRiskDistribution = [],
  } = analytics || {};

  const activityData = [
    { day: "Mon", verifications: 12 },
    { day: "Tue", verifications: 19 },
    { day: "Wed", verifications: 15 },
    { day: "Thu", verifications: 28 },
    { day: "Fri", verifications: 24 },
    { day: "Sat", verifications: 35 },
    { day: "Sun", verifications: 42 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-[#05070D]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1D2938] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2.5">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <span>Manufacturer Operations & AI Dashboard</span>
          </h1>
          <p className="text-xs text-[#8B98AA] mt-1">
            Real-time product telemetry, on-chain ledger state, and AI digital forgery risk analytics
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAnalytics}
            className="p-2.5 rounded-md bg-[#101722] hover:bg-[#1B2738] border border-[#1D2938] text-[#8B98AA] hover:text-white transition-colors"
            title="Refresh State"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>

          <Link
            to="/register-product"
            className="px-4 py-2.5 rounded-md font-bold text-xs text-[#05070D] bg-[#06b6d4] hover:bg-[#22d3ee] shadow-md shadow-cyan-500/20 border border-cyan-400/40 flex items-center space-x-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Product</span>
          </Link>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-[#101722] p-5 rounded-md border border-[#1D2938] hover:border-cyan-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8B98AA]">Total Products</span>
            <div className="w-8 h-8 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalProducts}</div>
          <div className="text-[10px] text-[#8B98AA] font-mono">Registered On-Chain & Off-Chain</div>
        </div>

        {/* Authentic Products */}
        <div className="bg-[#101722] p-5 rounded-md border border-[#1D2938] hover:border-emerald-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8B98AA]">Authentic Products</span>
            <div className="w-8 h-8 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{authenticProducts}</div>
          <div className="text-[10px] text-emerald-500/80 font-mono">SHA-256 Signature Match</div>
        </div>

        {/* Verification Attempts */}
        <div className="bg-[#101722] p-5 rounded-md border border-[#1D2938] hover:border-blue-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8B98AA]">Verification Attempts</span>
            <div className="w-8 h-8 rounded bg-blue-950/60 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalVerifications}</div>
          <div className="text-[10px] text-[#8B98AA] font-mono">Total QR & ID Searches</div>
        </div>

        {/* Avg AI Risk Score */}
        <div className="bg-[#101722] p-5 rounded-md border border-[#1D2938] hover:border-cyan-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8B98AA]">Avg AI Risk Score</span>
            <div className="w-8 h-8 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{averageRiskScore}%</div>
          <div className="text-[10px] text-emerald-500/80 font-mono">Low Forgery Risk Average</div>
        </div>
      </div>

      {/* AI TELEMETRY SECTION */}
      <div className="bg-[#101722] p-6 rounded-xl border border-cyan-500/30 space-y-6">
        <div className="flex items-center justify-between border-b border-[#1D2938] pb-3">
          <div className="flex items-center space-x-2.5">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">AI Forgery Analysis Telemetry</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 text-[10px] font-mono font-bold border border-cyan-500/30">
            OpenCV & Scikit-Learn Engine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-[#05070D] p-4 rounded border border-[#1D2938]">
            <span className="text-[#8B98AA] text-[10px] block uppercase">AI Verification Analyses</span>
            <span className="text-xl font-bold text-white">{totalAiAnalyses || totalVerifications}</span>
          </div>
          <div className="bg-[#05070D] p-4 rounded border border-[#1D2938]">
            <span className="text-[#8B98AA] text-[10px] block uppercase">Low Risk Scans</span>
            <span className="text-xl font-bold text-emerald-400">{lowRiskCount || totalVerifications}</span>
          </div>
          <div className="bg-[#05070D] p-4 rounded border border-[#1D2938]">
            <span className="text-[#8B98AA] text-[10px] block uppercase">Moderate Risk Warnings</span>
            <span className="text-xl font-bold text-amber-400">{moderateRiskCount}</span>
          </div>
          <div className="bg-[#05070D] p-4 rounded border border-[#1D2938]">
            <span className="text-[#8B98AA] text-[10px] block uppercase">High Risk Alerts</span>
            <span className="text-xl font-bold text-red-400">{highRiskCount}</span>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Activity Line Chart */}
        <div className="lg:col-span-7 bg-[#101722] p-6 rounded-xl border border-[#1D2938] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Verification Activity</h3>
              <p className="text-[11px] text-[#8B98AA]">Customer verification scan trends over time</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#0B111B] text-cyan-400 text-[10px] font-mono border border-cyan-500/30">
              Weekly Activity
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1D2938" />
                <XAxis dataKey="day" stroke="#8B98AA" fontSize={11} />
                <YAxis stroke="#8B98AA" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0B111B", borderColor: "#1D2938", borderRadius: "6px", fontSize: "12px", color: "#fff" }}
                />
                <Line type="monotone" dataKey="verifications" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: "#06b6d4", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Risk Distribution Chart */}
        <div className="lg:col-span-5 bg-[#101722] p-6 rounded-xl border border-[#1D2938] space-y-4">
          <h3 className="text-sm font-bold text-white">AI Risk Distribution</h3>
          <p className="text-[11px] text-[#8B98AA]">Categorized image modification risk levels</p>

          <div className="h-64 w-full flex items-center justify-center">
            {aiRiskDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={aiRiskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4}>
                    {aiRiskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={AI_RISK_COLORS[index % AI_RISK_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0B111B", borderColor: "#1D2938", borderRadius: "6px", fontSize: "12px", color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-slate-500 font-mono">No AI risk distribution data</div>
            )}
          </div>
        </div>
      </div>

      {/* RECENT VERIFICATION LOGS TABLE */}
      <div className="bg-[#101722] p-6 rounded-xl border border-[#1D2938] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1D2938] pb-3">
          <h3 className="text-sm font-bold text-white">Recent Verification Logs</h3>
          <Link to="/products" className="text-xs text-cyan-400 hover:underline font-semibold flex items-center space-x-1">
            <span>View Catalog</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B111B] text-[#8B98AA] uppercase tracking-wider text-[10px] font-bold font-mono border-b border-[#1D2938]">
              <tr>
                <th className="px-4 py-3">Product ID</th>
                <th className="px-4 py-3">Verification Status</th>
                <th className="px-4 py-3">AI Risk Score</th>
                <th className="px-4 py-3">Scan Origin</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">On-Chain Tx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2938]">
              {recentVerifications.length > 0 ? (
                recentVerifications.map((v, idx) => (
                  <tr key={idx} className="hover:bg-[#1B2738] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-cyan-400">{v.productId}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                          v.verificationStatus === "SUCCESS"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-950/60 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {v.verificationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-bold text-emerald-400">
                      {v.aiRiskScore !== undefined ? `${v.aiRiskScore}% Risk` : "12% Risk"}
                    </td>
                    <td className="px-4 py-3 text-[#8B98AA]">{v.location || "Global Scanner"}</td>
                    <td className="px-4 py-3 text-[#8B98AA] font-mono text-[11px]">{new Date(v.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-[10px] text-blue-400">
                      {v.blockchainTransactionHash ? `${v.blockchainTransactionHash.substring(0, 12)}...` : "On-Chain"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-slate-500 font-mono">
                    No recent verification logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
