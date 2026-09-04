import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileCheck,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Plus,
  Search,
  Eye,
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

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* 1. Header & Primary Action Toolbar */}
      <div className="bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-[#1E293B] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Digital Asset Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Register, manage, and verify digital files to confirm their authenticity.
          </p>
        </div>

        {/* 2. Top Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col">
            <Link
              to="/assets/register"
              className="px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#070A0F] font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Register New Asset</span>
            </Link>
            <span className="text-[11px] text-[#94A3B8] mt-1 text-center sm:text-left">
              Create an authenticity record for a file.
            </span>
          </div>

          <div className="flex flex-col">
            <Link
              to="/verify"
              className="px-5 py-3 rounded-lg bg-[#111821] hover:bg-[#1E293B] text-white border border-[#1E293B] font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>Verify an Asset</span>
            </Link>
            <span className="text-[11px] text-[#94A3B8] mt-1 text-center sm:text-left">
              Check whether a file matches its original record.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Registered Assets */}
        <div className="bg-[#0D121A] p-5 rounded-xl border border-[#1E293B] space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium text-slate-300">Registered Assets</span>
            <FileCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {stats.totalRegisteredAssets}
          </div>
          <div className="text-[11px] text-[#94A3B8]">Files protected by VerifyX</div>
        </div>

        {/* Card 2: Verified as Original */}
        <div className="bg-[#0D121A] p-5 rounded-xl border border-[#1E293B] space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium text-slate-300">Verified as Original</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400">
            {stats.authenticVerifications}
          </div>
          <div className="text-[11px] text-[#94A3B8]">Files matching their original record</div>
        </div>

        {/* Card 3: Modified Files Detected */}
        <div className="bg-[#0D121A] p-5 rounded-xl border border-[#1E293B] space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium text-slate-300">Modified Files Detected</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400">
            {stats.modifiedAssets}
          </div>
          <div className="text-[11px] text-[#94A3B8]">Files that do not match their original record</div>
        </div>

        {/* Card 4: Unrecognized Files */}
        <div className="bg-[#0D121A] p-5 rounded-xl border border-[#1E293B] space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium text-slate-300">Unrecognized Files</span>
            <HelpCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-200">
            {stats.notRegisteredCount}
          </div>
          <div className="text-[11px] text-[#94A3B8]">Files with no registered record</div>
        </div>

        {/* Card 5: Secure Records */}
        <div className="bg-[#0D121A] p-5 rounded-xl border border-[#1E293B] space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium text-slate-300">Secure Records</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-cyan-400">
            {stats.blockchainRegisteredCount}
          </div>
          <div className="text-[11px] text-[#94A3B8]">Authenticity records securely stored</div>
        </div>
      </div>

      {/* 4. Recent Tables Row (Two-column layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recently Registered Files */}
        <div className="lg:col-span-6 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="text-sm font-semibold text-white">Recently Registered Files</h3>
            <Link to="/assets" className="text-xs text-cyan-400 hover:underline font-medium">
              View all ➔
            </Link>
          </div>

          {recentAssets.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs text-[#94A3B8]">No files have been registered yet.</p>
              <Link
                to="/assets/register"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#070A0F] font-semibold text-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Your First Asset</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#94A3B8] border-b border-[#1E293B] font-medium">
                  <tr>
                    <th className="pb-3 pt-1">File Name</th>
                    <th className="pb-3 pt-1">Registered On</th>
                    <th className="pb-3 pt-1">Status</th>
                    <th className="pb-3 pt-1 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/60 text-slate-200">
                  {recentAssets.map((ast) => (
                    <tr key={ast._id} className="hover:bg-[#111821]/50 transition-colors">
                      <td className="py-3 font-medium text-white max-w-[160px] truncate" title={ast.assetName || ast.fileName}>
                        {ast.assetName || ast.fileName}
                      </td>
                      <td className="py-3 text-[#94A3B8]">
                        {formatDate(ast.createdAt)}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          Protected
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/assets/${ast.assetId}`}
                          className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                          <span>View</span>
                          <Eye className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Verification Activity */}
        <div className="lg:col-span-6 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="text-sm font-semibold text-white">Recent Verification Activity</h3>
            <Link to="/verification-history" className="text-xs text-cyan-400 hover:underline font-medium">
              View all ➔
            </Link>
          </div>

          {recentVerifications.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-xs text-[#94A3B8]">No verification activity logged yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#94A3B8] border-b border-[#1E293B] font-medium">
                  <tr>
                    <th className="pb-3 pt-1">File Name</th>
                    <th className="pb-3 pt-1">Date</th>
                    <th className="pb-3 pt-1">Result</th>
                    <th className="pb-3 pt-1 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/60 text-slate-200">
                  {recentVerifications.map((vrf) => (
                    <tr key={vrf._id} className="hover:bg-[#111821]/50 transition-colors">
                      <td className="py-3 font-medium text-white max-w-[160px] truncate" title={vrf.fileName}>
                        {vrf.fileName}
                      </td>
                      <td className="py-3 text-[#94A3B8]">
                        {formatDate(vrf.timestamp)}
                      </td>
                      <td className="py-3">
                        {vrf.result === "AUTHENTIC" && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                            ✓ Original
                          </span>
                        )}
                        {vrf.result === "MODIFIED" && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-500/30">
                            ⚠ Modified
                          </span>
                        )}
                        {vrf.result === "NOT_REGISTERED" && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900 text-slate-300 border border-slate-700">
                            ? Not Registered
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {vrf.assetId ? (
                          <Link
                            to={`/assets/${vrf.assetId}`}
                            className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-medium"
                          >
                            <span>View</span>
                            <Eye className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-[#64748B]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 5. How VerifyX Works Section */}
      <div className="bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-[#1E293B] space-y-5 shadow-lg">
        <div className="border-b border-[#1E293B] pb-3">
          <h2 className="text-base font-bold text-white tracking-tight">How VerifyX Works</h2>
          <p className="text-xs text-[#94A3B8]">
            Three simple steps to protect and verify digital document authenticity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="p-5 rounded-lg bg-[#111821] border border-[#1E293B] space-y-2">
            <div className="text-xs font-bold text-cyan-400 tracking-wider">01</div>
            <h3 className="text-sm font-semibold text-white">Register</h3>
            <p className="text-[#94A3B8] leading-relaxed">
              Upload the original file and create its secure authenticity record.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#111821] border border-[#1E293B] space-y-2">
            <div className="text-xs font-bold text-cyan-400 tracking-wider">02</div>
            <h3 className="text-sm font-semibold text-white">Verify</h3>
            <p className="text-[#94A3B8] leading-relaxed">
              Upload the file whenever you need to check it.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#111821] border border-[#1E293B] space-y-2">
            <div className="text-xs font-bold text-cyan-400 tracking-wider">03</div>
            <h3 className="text-sm font-semibold text-white">Compare</h3>
            <p className="text-[#94A3B8] leading-relaxed">
              VerifyX compares the file with its original record and reports the result.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
