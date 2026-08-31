import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Cpu,
  Upload,
  Search,
  ArrowRight,
  Clock,
} from "lucide-react";
import API from "../services/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRegisteredAssets: 0,
    authenticVerifications: 0,
    modifiedAssets: 0,
    notRegisteredCount: 0,
    blockchainRegisteredCount: 0,
  });

  const [recentAssets, setRecentAssets] = useState([]);
  const [recentVerifications, setRecentVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, assetsRes, verifRes] = await Promise.all([
        API.get("/dashboard/stats"),
        API.get("/dashboard/recent-assets"),
        API.get("/dashboard/recent-verifications"),
      ]);

      if (statsRes.data && statsRes.data.stats) {
        setStats(statsRes.data.stats);
      }
      if (assetsRes.data && assetsRes.data.assets) {
        setRecentAssets(assetsRes.data.assets);
      }
      if (verifRes.data && verifRes.data.verifications) {
        setRecentVerifications(verifRes.data.verifications);
      }
    } catch (err) {
      console.error("Fetch dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Header & Quick Action Toolbar */}
      <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Digital Asset Operations</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Enterprise Asset Dashboard</h1>
          <p className="text-xs text-[#94A3B8]">
            Overview of registered digital assets, SHA-256 cryptographic fingerprints, and verification history logs.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/assets/register"
            className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#070A0F] font-semibold text-xs flex items-center space-x-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <Upload className="w-4 h-4" />
            <span>Register Asset</span>
          </Link>

          <Link
            to="/verify"
            className="px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-semibold text-xs flex items-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
          >
            <Search className="w-4 h-4" />
            <span>Verify Asset</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
        <div className="bg-[#0D121A] p-5 rounded-xl border border-[#1E293B] space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span>Total Registered Assets</span>
            <FileCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalRegisteredAssets}</div>
          <div className="text-[11px] text-cyan-400 font-medium">Stored in Database</div>
        </div>

        <div className="bg-[#0D121A] p-5 rounded-xl border border-[#1E293B] space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span>Authentic Verifications</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400">{stats.authenticVerifications}</div>
          <div className="text-[11px] text-[#94A3B8]">Hash Matches ✓</div>
        </div>

        <div className="bg-[#0D121A] p-5 rounded-xl border border-[#1E293B] space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span>Modified / Invalid Assets</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400">{stats.modifiedAssets}</div>
          <div className="text-[11px] text-red-300">Hash Mismatches ✕</div>
        </div>

        <div className="bg-[#0D121A] p-5 rounded-xl border border-[#1E293B] space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span>Unregistered Uploads</span>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400">{stats.notRegisteredCount}</div>
          <div className="text-[11px] text-[#94A3B8]">No Record Found</div>
        </div>

        <div className="bg-[#0D121A] p-5 rounded-xl border border-[#1E293B] space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span>Blockchain Proofs</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-cyan-400">{stats.blockchainRegisteredCount}</div>
          <div className="text-[11px] text-[#94A3B8]">Ethereum Confirmed</div>
        </div>
      </div>

      {/* Main Content Grid: Recent Assets & Recent Verifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Assets Section */}
        <div className="lg:col-span-6 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Recent Registered Assets</span>
            </h3>
            <Link to="/assets" className="text-xs text-cyan-400 hover:underline font-medium">
              View all assets ➔
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {recentAssets.length === 0 ? (
              <div className="p-8 text-center text-[#94A3B8]">No digital assets registered yet.</div>
            ) : (
              recentAssets.map((ast) => (
                <div
                  key={ast._id}
                  className="p-3.5 rounded-lg bg-[#111821] border border-[#1E293B] flex items-center justify-between hover:border-cyan-500/30 transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center space-x-2">
                      <span className="font-mono text-cyan-400">{ast.assetId}</span>
                      <span>•</span>
                      <span>{ast.assetName}</span>
                    </div>
                    <div className="font-mono text-[11px] text-[#94A3B8]">
                      SHA-256: {ast.sha256Hash.substring(0, 24)}...
                    </div>
                  </div>

                  <Link
                    to={`/assets/${ast.assetId}`}
                    className="p-1.5 text-cyan-400 hover:text-white rounded hover:bg-[#1E293B] transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Verifications Section */}
        <div className="lg:col-span-6 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Recent Verification Attempts</span>
            </h3>
            <Link to="/verification-history" className="text-xs text-cyan-400 hover:underline font-medium">
              View full history ➔
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {recentVerifications.length === 0 ? (
              <div className="p-8 text-center text-[#94A3B8]">No verification attempts logged yet.</div>
            ) : (
              recentVerifications.map((vrf) => (
                <div
                  key={vrf._id}
                  className="p-3.5 rounded-lg bg-[#111821] border border-[#1E293B] flex items-center justify-between hover:border-cyan-500/30 transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center space-x-2">
                      <span>{vrf.fileName}</span>
                      <span className="font-mono text-[11px] text-[#94A3B8]">({vrf.assetId})</span>
                    </div>
                    <div className="text-[11px] text-[#94A3B8]">
                      {new Date(vrf.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                      vrf.result === "AUTHENTIC"
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                        : vrf.result === "MODIFIED"
                        ? "bg-red-950/80 text-red-300 border-red-500/40"
                        : "bg-amber-950/80 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {vrf.result}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
