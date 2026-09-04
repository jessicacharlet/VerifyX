import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileCheck, Plus, Search, Eye, FileCode, FileText } from "lucide-react";
import API from "../services/api";
import { SkeletonTable } from "../components/Skeleton";

export default function AssetsPage() {
  const navigate = useNavigate();

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1422] p-6 sm:p-8 rounded-xl border border-[#22304A] shadow-md">
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
          className="px-5 py-3 rounded-lg bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-[#070B14] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-sky-500/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Register New Asset</span>
        </Link>
      </div>

      {/* Search Toolbar */}
      <div className="bg-[#0D1422] p-4 rounded-xl border border-[#22304A]">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name or ID..."
            className="w-full px-4 py-2.5 pl-10 rounded-lg bg-[#111A2A] border border-[#22304A] text-white text-xs placeholder-[#64748B] focus:outline-none focus:border-sky-400 transition-colors"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
        </form>
      </div>

      {/* Assets Table */}
      {loading ? (
        <SkeletonTable rows={5} />
      ) : error ? (
        <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
          {error}
        </div>
      ) : assets.length === 0 ? (
        <div className="p-12 text-center bg-[#0D1422] rounded-xl border border-[#22304A] space-y-3">
          <FileCode className="w-10 h-10 text-[#64748B] mx-auto" />
          <div className="text-base font-semibold text-white">No Registered Assets</div>
          <p className="text-xs text-[#94A3B8]">
            You haven't registered any digital files yet.
          </p>
          <Link
            to="/assets/register"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-[#070B14] font-semibold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New Asset</span>
          </Link>
        </div>
      ) : (
        <div className="bg-[#0D1422] rounded-xl border border-[#22304A] overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111A2A] text-[#94A3B8] border-b border-[#22304A] font-medium">
                <tr>
                  <th className="px-6 py-4">File Name</th>
                  <th className="px-6 py-4">Registration Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22304A] text-slate-200">
                {assets.map((ast) => (
                  <tr
                    key={ast._id}
                    onClick={() => navigate(`/assets/${ast.assetId}`)}
                    className="hover:bg-[#111A2A] cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-white">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                        <span>{ast.assetName || ast.fileName}</span>
                      </div>
                      <div className="text-[11px] text-[#94A3B8] font-normal font-mono mt-0.5 ml-6">
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
                      <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#111A2A] hover:bg-[#162238] text-sky-400 hover:text-white border border-[#22304A] font-medium transition-colors">
                        <span>View Details</span>
                        <Eye className="w-3.5 h-3.5" />
                      </span>
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
