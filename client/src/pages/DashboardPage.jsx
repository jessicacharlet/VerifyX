import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Plus,
  Search,
  History,
  ArrowRight,
  Eye,
  FileText,
  ShieldCheck,
  Check,
} from "lucide-react";
import API from "../services/api";
import Tooltip from "../components/Tooltip";
import { SkeletonCard, SkeletonTable } from "../components/Skeleton";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRegisteredAssets: 0,
    authenticVerifications: 0,
    modifiedAssets: 0,
    notRegisteredCount: 0,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      {/* 5. Dashboard Hero Header */}
      <div className="bg-[#0D1422] p-6 sm:p-8 rounded-xl border border-[#22304A] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Asset Authenticator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Digital Asset Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Register, manage, and verify digital files with confidence.
          </p>
        </div>

        {/* Primary & Secondary Hero Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/assets/register"
            className="px-5 py-3 rounded-lg bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-[#070B14] font-bold text-xs flex items-center justify-center space-x-2 transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-sky-500/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Register New Asset</span>
          </Link>

          <Link
            to="/verify"
            className="px-5 py-3 rounded-lg bg-[#111A2A] hover:bg-[#162238] text-white border border-[#22304A] font-semibold text-xs flex items-center justify-center space-x-2 transition-all duration-200 hover:-translate-y-0.5"
          >
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span>Verify an Asset</span>
          </Link>
        </div>
      </div>

      {/* 6. Quick Actions Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/assets/register"
          className="group p-6 rounded-xl bg-[#111A2A] hover:bg-[#162238] border border-[#22304A] hover:border-sky-500/40 transition-all duration-200 hover:-translate-y-1 shadow-md space-y-4"
        >
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Plus className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors">
              REGISTER AN ASSET
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Create a secure authenticity record for a file.
            </p>
          </div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-sky-400 group-hover:text-sky-300">
            <span>Register File</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/verify"
          className="group p-6 rounded-xl bg-[#111A2A] hover:bg-[#162238] border border-[#22304A] hover:border-sky-500/40 transition-all duration-200 hover:-translate-y-1 shadow-md space-y-4"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Search className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors">
              VERIFY AN ASSET
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Check whether a file matches its original record.
            </p>
          </div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-sky-400 group-hover:text-sky-300">
            <span>Verify File</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/verification-history"
          className="group p-6 rounded-xl bg-[#111A2A] hover:bg-[#162238] border border-[#22304A] hover:border-sky-500/40 transition-all duration-200 hover:-translate-y-1 shadow-md space-y-4"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <History className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors">
              VIEW HISTORY
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Review previous verification activity.
            </p>
          </div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-sky-400 group-hover:text-sky-300">
            <span>View History</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* 7. Interactive Statistics Row */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: REGISTERED ASSETS */}
          <div
            onClick={() => navigate("/assets")}
            className="group p-5 rounded-xl bg-[#111A2A] hover:bg-[#162238] border border-[#22304A] hover:border-sky-500/40 cursor-pointer transition-all duration-200 space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">
                REGISTERED ASSETS
              </span>
              <FileCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-bold text-white tracking-tight">
              {stats.totalRegisteredAssets}
            </div>
            <div className="text-xs text-[#94A3B8]">Files protected</div>
          </div>

          {/* Card 2: VERIFIED AS ORIGINAL */}
          <div
            onClick={() => navigate("/verification-history?filter=AUTHENTIC")}
            className="group p-5 rounded-xl bg-[#111A2A] hover:bg-[#162238] border border-[#22304A] hover:border-emerald-500/40 cursor-pointer transition-all duration-200 space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                VERIFIED AS ORIGINAL
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-400 tracking-tight">
              {stats.authenticVerifications}
            </div>
            <div className="text-xs text-[#94A3B8]">Successful matches</div>
          </div>

          {/* Card 3: MODIFIED FILES */}
          <div
            onClick={() => navigate("/verification-history?filter=MODIFIED")}
            className="group p-5 rounded-xl bg-[#111A2A] hover:bg-[#162238] border border-[#22304A] hover:border-amber-500/40 cursor-pointer transition-all duration-200 space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                MODIFIED FILES
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-amber-400 tracking-tight">
              {stats.modifiedAssets}
            </div>
            <div className="text-xs text-[#94A3B8]">Changes detected</div>
          </div>

          {/* Card 4: UNRECOGNIZED FILES */}
          <div
            onClick={() => navigate("/verification-history?filter=NOT_REGISTERED")}
            className="group p-5 rounded-xl bg-[#111A2A] hover:bg-[#162238] border border-[#22304A] hover:border-slate-400/40 cursor-pointer transition-all duration-200 space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                UNRECOGNIZED FILES
              </span>
              <HelpCircle className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-bold text-slate-200 tracking-tight">
              {stats.notRegisteredCount}
            </div>
            <div className="text-xs text-[#94A3B8]">No registered record</div>
          </div>
        </div>
      )}

      {/* 11. Visual "How It Works" Section */}
      <div className="bg-[#0D1422] p-6 sm:p-8 rounded-xl border border-[#22304A] space-y-6 shadow-md">
        <div className="border-b border-[#22304A] pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">How VerifyX Works</h2>
            <p className="text-xs text-[#94A3B8]">Clear 4-step digital asset authenticity workflow</p>
          </div>
        </div>

        {/* 4-Step Horizontal Timeline on Desktop / Stacked on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="p-5 rounded-xl bg-[#111A2A] border border-[#22304A] space-y-2 relative">
            <div className="text-xs font-bold text-sky-400 tracking-wider">STEP 01</div>
            <h3 className="text-sm font-semibold text-white">REGISTER</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Upload your original file.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#111A2A] border border-[#22304A] space-y-2 relative">
            <div className="text-xs font-bold text-sky-400 tracking-wider">STEP 02</div>
            <h3 className="text-sm font-semibold text-white">PROTECT</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              VerifyX creates its secure authenticity record.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#111A2A] border border-[#22304A] space-y-2 relative">
            <div className="text-xs font-bold text-sky-400 tracking-wider">STEP 03</div>
            <h3 className="text-sm font-semibold text-white">VERIFY</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Upload the file later to check its authenticity.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#111A2A] border border-[#22304A] space-y-2 relative">
            <div className="text-xs font-bold text-sky-400 tracking-wider">STEP 04</div>
            <h3 className="text-sm font-semibold text-white">RESULT</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              VerifyX tells you whether the file is original or modified.
            </p>
          </div>
        </div>
      </div>

      {/* 9 & 10. Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recently Registered Files */}
        <div className="lg:col-span-6 bg-[#0D1422] p-6 rounded-xl border border-[#22304A] space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#22304A] pb-3">
            <h3 className="text-base font-semibold text-white">Recently Registered Files</h3>
            <Link to="/assets" className="text-xs text-sky-400 hover:underline font-medium">
              View all ➔
            </Link>
          </div>

          {loading ? (
            <SkeletonTable rows={3} />
          ) : recentAssets.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs text-[#94A3B8]">
                No files registered yet. Start by registering your first digital asset.
              </p>
              <Link
                to="/assets/register"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-[#070B14] font-semibold text-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Your First File</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#94A3B8] border-b border-[#22304A] font-medium">
                  <tr>
                    <th className="pb-3 pt-1">File Name</th>
                    <th className="pb-3 pt-1">Registered On</th>
                    <th className="pb-3 pt-1">Status</th>
                    <th className="pb-3 pt-1 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#22304A]/60 text-slate-200">
                  {recentAssets.map((ast) => (
                    <tr
                      key={ast._id}
                      onClick={() => navigate(`/assets/${ast.assetId}`)}
                      className="hover:bg-[#111A2A] cursor-pointer transition-colors"
                    >
                      <td className="py-3 font-semibold text-white flex items-center space-x-2 max-w-[160px] truncate">
                        <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                        <span title={ast.assetName || ast.fileName}>{ast.assetName || ast.fileName}</span>
                      </td>
                      <td className="py-3 text-[#94A3B8]">{formatDate(ast.createdAt)}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          Protected
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="inline-flex items-center space-x-1 text-sky-400 font-medium hover:underline">
                          <span>View</span>
                          <Eye className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Verification Activity */}
        <div className="lg:col-span-6 bg-[#0D1422] p-6 rounded-xl border border-[#22304A] space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#22304A] pb-3">
            <h3 className="text-base font-semibold text-white">Recent Verification Activity</h3>
            <Link to="/verification-history" className="text-xs text-sky-400 hover:underline font-medium">
              View all ➔
            </Link>
          </div>

          {loading ? (
            <SkeletonTable rows={3} />
          ) : recentVerifications.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-xs text-[#94A3B8]">No verification activity logged yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#94A3B8] border-b border-[#22304A] font-medium">
                  <tr>
                    <th className="pb-3 pt-1">File Name</th>
                    <th className="pb-3 pt-1">Date</th>
                    <th className="pb-3 pt-1">Result</th>
                    <th className="pb-3 pt-1 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#22304A]/60 text-slate-200">
                  {recentVerifications.map((vrf) => (
                    <tr
                      key={vrf._id}
                      onClick={() =>
                        vrf.assetId
                          ? navigate(`/assets/${vrf.assetId}`)
                          : navigate("/verification-history")
                      }
                      className="hover:bg-[#111A2A] cursor-pointer transition-colors"
                    >
                      <td className="py-3 font-semibold text-white max-w-[160px] truncate" title={vrf.fileName}>
                        {vrf.fileName}
                      </td>
                      <td className="py-3 text-[#94A3B8]">{formatDate(vrf.timestamp)}</td>
                      <td className="py-3">
                        {vrf.result === "AUTHENTIC" && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                            ✓ Original
                          </span>
                        )}
                        {vrf.result === "MODIFIED" && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-500/30">
                            ⚠ Modified
                          </span>
                        )}
                        {vrf.result === "NOT_REGISTERED" && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#111A2A] text-slate-300 border border-[#22304A]">
                            ? Not Registered
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <span className="inline-flex items-center space-x-1 text-sky-400 font-medium hover:underline">
                          <span>View</span>
                          <Eye className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
