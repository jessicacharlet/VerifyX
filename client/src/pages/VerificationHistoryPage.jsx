import React, { useState, useEffect } from "react";
import { History, Search, CheckCircle, AlertTriangle, HelpCircle, FileCode } from "lucide-react";
import API from "../services/api";

export default function VerificationHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("ALL");

  useEffect(() => {
    fetchHistory();
  }, [resultFilter]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (search) params.search = search;
      if (resultFilter !== "ALL") params.result = resultFilter;

      const res = await API.get("/verify/history", { params });
      if (res.data && res.data.history) {
        setHistory(res.data.history);
      }
    } catch (err) {
      console.error("Fetch verification history error:", err);
      setError("Failed to load verification history logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail Registry</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Verification History</h1>
          <p className="text-xs text-[#94A3B8]">
            Persistent audit history of all digital asset verification attempts, submitted SHA-256 hashes, and match statuses.
          </p>
        </div>
      </div>

      {/* Toolbar: Search & Result Filters */}
      <div className="bg-[#0D121A] p-4 rounded-xl border border-[#1E293B] flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Verification ID, Asset ID, File Name..."
            className="w-full px-4 py-2.5 pl-10 rounded-lg bg-[#111821] border border-[#1E293B] text-white text-xs placeholder-[#64748B] focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
        </form>

        <div className="flex flex-wrap gap-1.5 text-xs font-medium w-full md:w-auto">
          {["ALL", "AUTHENTIC", "MODIFIED", "NOT_REGISTERED"].map((resKey) => (
            <button
              key={resKey}
              onClick={() => setResultFilter(resKey)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                resultFilter === resKey
                  ? "bg-cyan-400 text-[#070A0F] font-semibold"
                  : "bg-[#111821] text-[#94A3B8] hover:text-white border border-[#1E293B]"
              }`}
            >
              {resKey}
            </button>
          ))}
        </div>
      </div>

      {/* History Log Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#94A3B8]">Loading verification history logs...</div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="p-12 text-center bg-[#0D121A] rounded-xl border border-[#1E293B] space-y-2">
          <FileCode className="w-10 h-10 text-[#64748B] mx-auto" />
          <div className="text-sm font-semibold text-white">No Verification History Logged</div>
          <p className="text-xs text-[#94A3B8]">No verification attempts match the selected query.</p>
        </div>
      ) : (
        <div className="bg-[#0D121A] rounded-xl border border-[#1E293B] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111821] text-[#94A3B8] uppercase border-b border-[#1E293B] font-medium">
                <tr>
                  <th className="px-5 py-3.5">Verification ID</th>
                  <th className="px-5 py-3.5">Asset ID</th>
                  <th className="px-5 py-3.5">File Name</th>
                  <th className="px-5 py-3.5">Submitted SHA-256 Hash</th>
                  <th className="px-5 py-3.5">Verification Result</th>
                  <th className="px-5 py-3.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] text-slate-200">
                {history.map((h) => (
                  <tr key={h._id} className="hover:bg-[#111821]/60 transition-colors">
                    <td className="px-5 py-4 font-mono font-semibold text-cyan-400">
                      {h.verificationId}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-200">
                      {h.assetId || "UNREGISTERED"}
                    </td>
                    <td className="px-5 py-4 font-medium text-white">
                      {h.fileName}
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-emerald-300">
                      {h.submittedHash ? `${h.submittedHash.substring(0, 20)}...` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          h.result === "AUTHENTIC"
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                            : h.result === "MODIFIED"
                            ? "bg-red-950/80 text-red-300 border-red-500/40"
                            : "bg-amber-950/80 text-amber-300 border-amber-500/40"
                        }`}
                      >
                        {h.result}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-[#94A3B8]">
                      {new Date(h.timestamp).toLocaleString()}
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
