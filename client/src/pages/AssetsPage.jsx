import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileCheck, Upload, Search, ArrowRight, Cpu, FileCode } from "lucide-react";
import API from "../services/api";

export default function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchAssets();
  }, [filter]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (search) params.search = search;
      if (filter !== "ALL") params.blockchainStatus = filter;

      const res = await API.get("/assets", { params });
      if (res.data && res.data.assets) {
        setAssets(res.data.assets);
      }
    } catch (err) {
      console.error("Fetch assets error:", err);
      setError("Failed to load registered digital assets.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAssets();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Asset Authenticity Registry</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Registered Digital Assets</h1>
          <p className="text-xs text-[#94A3B8]">
            Browse registered digital assets, view SHA-256 cryptographic fingerprints, and inspect Ethereum blockchain audit proofs.
          </p>
        </div>

        <Link
          to="/assets/register"
          className="px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#070A0F] font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-500/20"
        >
          <Upload className="w-4 h-4" />
          <span>Register New Asset</span>
        </Link>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="bg-[#0D121A] p-4 rounded-xl border border-[#1E293B] flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Asset ID, Name, SHA-256 Hash..."
            className="w-full px-4 py-2.5 pl-10 rounded-lg bg-[#111821] border border-[#1E293B] text-white text-xs placeholder-[#64748B] focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
        </form>

        <div className="flex flex-wrap gap-1.5 text-xs font-medium w-full md:w-auto">
          {["ALL", "CONFIRMED", "NOT_CONFIGURED", "FAILED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filter === st
                  ? "bg-cyan-400 text-[#070A0F] font-semibold"
                  : "bg-[#111821] text-[#94A3B8] hover:text-white border border-[#1E293B]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#94A3B8]">Loading asset registry database...</div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
          {error}
        </div>
      ) : assets.length === 0 ? (
        <div className="p-12 text-center bg-[#0D121A] rounded-xl border border-[#1E293B] space-y-2">
          <FileCode className="w-10 h-10 text-[#64748B] mx-auto" />
          <div className="text-sm font-semibold text-white">No Assets Found</div>
          <p className="text-xs text-[#94A3B8]">No digital asset records match the search parameters.</p>
        </div>
      ) : (
        <div className="bg-[#0D121A] rounded-xl border border-[#1E293B] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111821] text-[#94A3B8] uppercase border-b border-[#1E293B] font-medium">
                <tr>
                  <th className="px-5 py-3.5">Asset ID</th>
                  <th className="px-5 py-3.5">Asset Name</th>
                  <th className="px-5 py-3.5">File Type</th>
                  <th className="px-5 py-3.5">SHA-256 Hash</th>
                  <th className="px-5 py-3.5">Registered Date</th>
                  <th className="px-5 py-3.5">Blockchain Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] text-slate-200">
                {assets.map((ast) => (
                  <tr key={ast._id} className="hover:bg-[#111821]/60 transition-colors">
                    <td className="px-5 py-4 font-mono font-semibold text-cyan-400">
                      {ast.assetId}
                    </td>
                    <td className="px-5 py-4 font-semibold text-white">
                      {ast.assetName}
                      <div className="text-[11px] text-[#94A3B8] font-normal">{ast.fileName}</div>
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8] font-mono">
                      {ast.fileType || "File"}
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-emerald-300">
                      {ast.sha256Hash ? `${ast.sha256Hash.substring(0, 20)}...` : "—"}
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8]">
                      {new Date(ast.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                          ast.blockchainStatus === "CONFIRMED"
                            ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/30"
                            : "bg-[#111821] text-[#94A3B8] border-[#1E293B]"
                        }`}
                      >
                        {ast.blockchainStatus || "NOT_CONFIGURED"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <Link
                        to={`/assets/${ast.assetId}`}
                        className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-semibold hover:underline"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
