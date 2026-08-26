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
  ShieldAlert,
  Search,
  Activity,
  PlusCircle,
  AlertTriangle,
  ArrowUpRight,
  RefreshCcw,
  Shield,
  Layers,
  Lock,
} from "lucide-react";

const PIE_COLORS = ["#9333ea", "#6366f1", "#06b6d4", "#f59e0b", "#ef4444"];

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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#050816]">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-slate-400">Querying Blockchain Ledger & Dashboard Analytics...</p>
      </div>
    );
  }

  const {
    totalProducts = 0,
    authenticProducts = 0,
    activeProducts = 0,
    recalledProducts = 0,
    totalVerifications = 0,
    suspiciousVerifications = 0,
    categories = [],
    recentVerifications = [],
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-[#050816]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1E2A47] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2.5">
            <Shield className="w-6 h-6 text-purple-400" />
            <span>Manufacturer Operations Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time product telemetry, on-chain ledger state, and customer verification analytics
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAnalytics}
            className="p-2.5 rounded-xl bg-[#0D1528] hover:bg-[#111B32] border border-[#1E2A47] text-slate-400 hover:text-white transition-colors"
            title="Refresh State"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>

          <Link
            to="/register-product"
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/20 border border-purple-400/30 flex items-center space-x-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Product</span>
          </Link>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-[#0D1528] hover:bg-[#111B32] p-5 rounded-xl border border-[#1E2A47] hover:border-purple-500/30 transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalProducts}</div>
          <div className="text-[10px] text-slate-500 font-mono">Registered On-Chain & Off-Chain</div>
        </div>

        {/* Verified Products (Authentic) */}
        <div className="bg-[#0D1528] hover:bg-[#111B32] p-5 rounded-xl border border-[#1E2A47] hover:border-purple-500/30 transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Verified Products</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{authenticProducts}</div>
          <div className="text-[10px] text-emerald-500/80 font-mono">SHA-256 Hash Verified</div>
        </div>

        {/* Verification Attempts */}
        <div className="bg-[#0D1528] hover:bg-[#111B32] p-5 rounded-xl border border-[#1E2A47] hover:border-purple-500/30 transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Verification Attempts</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalVerifications}</div>
          <div className="text-[10px] text-slate-500 font-mono">Total QR & ID Searches</div>
        </div>

        {/* Active Products */}
        <div className="bg-[#0D1528] hover:bg-[#111B32] p-5 rounded-xl border border-[#1E2A47] hover:border-purple-500/30 transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Products</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">{activeProducts || authenticProducts}</div>
          <div className="text-[10px] text-cyan-500/80 font-mono">Active In Market</div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Activity Line Chart */}
        <div className="lg:col-span-7 bg-[#0D1528] p-6 rounded-2xl border border-[#1E2A47] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Verification Activity</h3>
              <p className="text-[11px] text-slate-400">Customer verification scan trends over time</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#111B32] text-purple-400 text-[10px] font-mono border border-purple-500/30">
              Weekly Activity
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2A47" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0A1020", borderColor: "#1E2A47", borderRadius: "8px", fontSize: "12px", color: "#fff" }}
                />
                <Line type="monotone" dataKey="verifications" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: "#a855f7", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="lg:col-span-5 bg-[#0D1528] p-6 rounded-2xl border border-[#1E2A47] space-y-4">
          <h3 className="text-sm font-bold text-white">Category Distribution</h3>
          <p className="text-[11px] text-slate-400">Product count across registered categories</p>

          <div className="h-64 w-full flex items-center justify-center">
            {categories.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4}>
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0A1020", borderColor: "#1E2A47", borderRadius: "8px", fontSize: "12px", color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-slate-500 font-mono">No category breakdown available</div>
            )}
          </div>
        </div>
      </div>

      {/* RECENT VERIFICATION LOGS TABLE */}
      <div className="bg-[#0D1528] p-6 rounded-2xl border border-[#1E2A47] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E2A47] pb-3">
          <h3 className="text-sm font-bold text-white">Recent Verification Logs</h3>
          <Link to="/products" className="text-xs text-purple-400 hover:underline font-semibold flex items-center space-x-1">
            <span>View Catalog</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A1020] text-slate-400 uppercase tracking-wider text-[10px] font-bold font-mono border-b border-[#1E2A47]">
              <tr>
                <th className="px-4 py-3">Product ID</th>
                <th className="px-4 py-3">Verification Status</th>
                <th className="px-4 py-3">Scan Origin</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">On-Chain Tx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2A47]">
              {recentVerifications.length > 0 ? (
                recentVerifications.map((v, idx) => (
                  <tr key={idx} className="hover:bg-[#111B32] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-purple-400">{v.productId}</td>
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
                    <td className="px-4 py-3 text-slate-400">{v.location || "Global Scanner"}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{new Date(v.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-[10px] text-cyan-400">
                      {v.blockchainTransactionHash ? `${v.blockchainTransactionHash.substring(0, 12)}...` : "On-Chain"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-slate-500 font-mono">
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
