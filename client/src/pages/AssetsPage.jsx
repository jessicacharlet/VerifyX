import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileCheck, Plus, Search, Eye, FileCode } from "lucide-react";
import API from "../services/api";

export default function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (search) params.search = search;

      const res = await API.get("/assets", { params });
      if (res.data && res.data.assets) {
        setAssets(res.data.assets);
      }
    } catch (err) {
      console.error("Fetch assets error:", err);
      setError("Failed to load registered files.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAssets();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-[#1E293B] shadow-lg">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Registered Assets
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            View files that have been registered with VerifyX.
          </p>
        </div>

        <Link
          to="/assets/register"
          className="px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#070A0F] font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Register New Asset</span>
        </Link>
      </div>

      {/* Search Toolbar */}
      <div className="bg-[#0D121A] p-4 rounded-xl border border-[#1E293B]">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name or ID..."
            className="w-full px-4 py-2.5 pl-10 rounded-lg bg-[#111821] border border-[#1E293B] text-white text-xs placeholder-[#64748B] focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
        </form>
      </div>

      {/* Assets Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#94A3B8]">Loading registered files...</div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
          {error}
        </div>
      ) : assets.length === 0 ? (
        <div className="p-12 text-center bg-[#0D121A] rounded-xl border border-[#1E293B] space-y-3">
          <FileCode className="w-10 h-10 text-[#64748B] mx-auto" />
          <div className="text-base font-semibold text-white">No files registered yet.</div>
          <p className="text-xs text-[#94A3B8]">
            Start by registering an original digital file to create its secure record.
          </p>
          <Link
            to="/assets/register"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#070A0F] font-semibold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Your First Asset</span>
          </Link>
        </div>
      ) : (
        <div className="bg-[#0D121A] rounded-xl border border-[#1E293B] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111821] text-[#94A3B8] border-b border-[#1E293B] font-medium">
                <tr>
                  <th className="px-6 py-4">File Name</th>
                  <th className="px-6 py-4">Registration Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] text-slate-200">
                {assets.map((ast) => (
                  <tr key={ast._id} className="hover:bg-[#111821]/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      {ast.assetName || ast.fileName}
                      <div className="text-[11px] text-[#94A3B8] font-normal font-mono mt-0.5">
                        ID: {ast.assetId}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#94A3B8]">
                      {formatDate(ast.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                        Protected
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/assets/${ast.assetId}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded bg-[#111821] hover:bg-[#1E293B] text-cyan-400 hover:text-white border border-[#1E293B] font-medium transition-colors"
                      >
                        <span>View Details</span>
                        <Eye className="w-3.5 h-3.5" />
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
