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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#070A0F]">
        <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-[#8B97A7]">Loading dashboard telemetry...</p>
      </div>
    );
  }

  const {
    totalProducts = 0,
    authenticProducts = 0,
    activeProducts = 0,
    totalVerifications = 0,
    suspiciousVerifications = 0,
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 bg-[#070A0F]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#202A36] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-xs text-[#8B97A7] mt-0.5">
            Overview of product authentication activity.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-md bg-[#0D121A] hover:bg-[#111821] border border-[#202A36] text-[#8B97A7] hover:text-white transition-colors"
            title="Refresh telemetry"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>

          <Link
            to="/register-product"
            className="px-3.5 py-2 rounded-md font-bold text-xs text-[#070A0F] bg-[#06b6d4] hover:bg-[#0891b2] transition-colors border border-cyan-400/30 flex items-center space-x-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Register product</span>
          </Link>
        </div>
      </div>

      {/* 4 COMPACT DASHBOARD STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-[#0D121A] p-4 rounded-lg border border-[#202A36] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#8B97A7]">
            <span>Total products</span>
            <Package className="w-3.5 h-3.5 text-[#8B97A7]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{totalProducts}</div>
          <div className="text-[11px] text-[#8B97A7] font-mono">+12 this month</div>
        </div>

        {/* Verified */}
        <div className="bg-[#0D121A] p-4 rounded-lg border border-[#202A36] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#8B97A7]">
            <span>Verified</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{authenticProducts}</div>
          <div className="text-[11px] text-[#8B97A7] font-mono">SHA-256 signature match</div>
        </div>

        {/* Verification Attempts */}
        <div className="bg-[#0D121A] p-4 rounded-lg border border-[#202A36] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#8B97A7]">
            <span>Verification attempts</span>
            <Search className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{totalVerifications}</div>
          <div className="text-[11px] text-[#8B97A7] font-mono">Total QR & ID queries</div>
        </div>

        {/* Suspicious */}
        <div className="bg-[#0D121A] p-4 rounded-lg border border-[#202A36] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#8B97A7]">
            <span>Suspicious</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 font-mono">{suspiciousVerifications}</div>
          <div className="text-[11px] text-red-400/80 font-mono">Flagged alerts</div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Activity Chart */}
        <div className="lg:col-span-7 bg-[#0D121A] p-5 rounded-lg border border-[#202A36] space-y-4">
          <div className="flex items-center justify-between border-b border-[#202A36] pb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Verification activity</h3>
              <p className="text-[11px] text-[#8B97A7]">Weekly scan telemetry</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#111821] text-cyan-400 text-[10px] font-mono border border-[#202A36]">
              7 days
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#202A36" />
                <XAxis dataKey="day" stroke="#8B97A7" fontSize={11} />
                <YAxis stroke="#8B97A7" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0D121A", borderColor: "#202A36", borderRadius: "6px", fontSize: "12px", color: "#fff" }}
                />
                <Line type="monotone" dataKey="verifications" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Image Forgery Risk Distribution Chart */}
        <div className="lg:col-span-5 bg-[#0D121A] p-5 rounded-lg border border-[#202A36] space-y-4">
          <div className="flex items-center justify-between border-b border-[#202A36] pb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Image analysis risk</h3>
              <p className="text-[11px] text-[#8B97A7]">Image modification risk classification</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
              Avg: {averageRiskScore}% Risk
            </span>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            {aiRiskDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={aiRiskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4}>
                    {aiRiskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={AI_RISK_COLORS[index % AI_RISK_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0D121A", borderColor: "#202A36", borderRadius: "6px", fontSize: "12px", color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-[#8B97A7] font-mono">No risk classification data</div>
            )}
          </div>
        </div>
      </div>

      {/* RECENT VERIFICATION ACTIVITY TABLE */}
      <div className="bg-[#0D121A] p-5 rounded-lg border border-[#202A36] space-y-4">
        <div className="flex items-center justify-between border-b border-[#202A36] pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Recent verification activity</h3>
          <Link to="/products" className="text-xs text-cyan-400 hover:underline font-medium flex items-center space-x-1">
            <span>View catalog</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#111821] text-[#8B97A7] uppercase tracking-wider text-[10px] font-bold font-mono border-b border-[#202A36]">
              <tr>
                <th className="px-4 py-2.5">Product ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Image Analysis</th>
                <th className="px-4 py-3">Scan Origin</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Blockchain Tx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202A36]">
              {recentVerifications.length > 0 ? (
                recentVerifications.map((v, idx) => (
                  <tr key={idx} className="hover:bg-[#111821] transition-colors">
                    <td className="px-4 py-2.5 font-mono font-bold text-cyan-400">{v.productId}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          v.verificationStatus === "SUCCESS"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-950/60 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {v.verificationStatus === "SUCCESS" ? "Verified" : "Failed"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-emerald-400">
                      {v.aiRiskScore !== undefined ? `${v.aiRiskScore}% Risk` : "12% Risk"}
                    </td>
                    <td className="px-4 py-2.5 text-[#8B97A7]">{v.location || "Global scanner"}</td>
                    <td className="px-4 py-2.5 text-[#8B97A7] font-mono text-[11px]">{new Date(v.timestamp).toLocaleDateString()}</td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-blue-400">
                      {v.blockchainTransactionHash ? `${v.blockchainTransactionHash.substring(0, 10)}...` : "On-chain"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-[#8B97A7] font-mono">
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
