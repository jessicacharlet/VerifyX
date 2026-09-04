import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { History, Search, FileCode, ChevronDown, ChevronUp } from "lucide-react";
import API from "../services/api";
import { SkeletonTable } from "../components/Skeleton";
import Tooltip from "../components/Tooltip";

export default function VerificationHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterQuery = searchParams.get("filter") || "ALL";

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState(filterQuery);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setResultFilter(filterQuery);
  }, [filterQuery]);

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
      setError("Failed to load verification history.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleFilterChange = (key) => {
    setResultFilter(key);
    if (key === "ALL") {
      searchParams.delete("filter");
    } else {
      searchParams.set("filter", key);
    }
    setSearchParams(searchParams);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1422] p-6 sm:p-8 rounded-xl border border-[#22304A] shadow-md">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Verification History
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Review previous verification activity and search records.
          </p>
        </div>
      </div>

      {/* Toolbar: Search & Result Filters */}
      <div className="bg-[#0D1422] p-4 rounded-xl border border-[#22304A] flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name or ID..."
            className="w-full px-4 py-2.5 pl-10 rounded-lg bg-[#111A2A] border border-[#22304A] text-white text-xs placeholder-[#64748B] focus:outline-none focus:border-sky-400 transition-colors"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
        </form>

        <div className="flex flex-wrap gap-1.5 text-xs font-medium w-full md:w-auto">
          {[
            { key: "ALL", label: "All Results" },
            { key: "AUTHENTIC", label: "Original" },
            { key: "MODIFIED", label: "Modified" },
            { key: "NOT_REGISTERED", label: "Not Registered" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleFilterChange(item.key)}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                resultFilter === item.key
                  ? "bg-sky-500 text-[#070B14] font-semibold"
                  : "bg-[#111A2A] text-[#94A3B8] hover:text-white border border-[#22304A]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Log Table */}
      {loading ? (
        <SkeletonTable rows={5} />
      ) : error ? (
        <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="p-12 text-center bg-[#0D1422] rounded-xl border border-[#22304A] space-y-2">
          <FileCode className="w-10 h-10 text-[#64748B] mx-auto" />
          <div className="text-base font-semibold text-white">No Verification Activity</div>
          <p className="text-xs text-[#94A3B8]">
            Verification results will appear here after you verify a file.
          </p>
        </div>
      ) : (
        <div className="bg-[#0D1422] rounded-xl border border-[#22304A] overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111A2A] text-[#94A3B8] border-b border-[#22304A] font-medium">
                <tr>
                  <th className="px-6 py-4">File Name</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Result</th>
                  <th className="px-6 py-4 text-right">Technical Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22304A] text-slate-200">
                {history.map((h) => {
                  const isExpanded = expandedId === h._id;
                  return (
                    <React.Fragment key={h._id}>
                      <tr className="hover:bg-[#111A2A] transition-colors">
                        <td className="px-6 py-4 font-semibold text-white">
                          {h.fileName}
                          {h.assetId && (
                            <div className="text-[11px] text-[#94A3B8] font-mono font-normal mt-0.5">
                              ID: {h.assetId}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[#94A3B8]">
                          {formatDate(h.timestamp)}
                        </td>
                        <td className="px-6 py-4">
                          {h.result === "AUTHENTIC" && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                              ✓ Original
                            </span>
                          )}
                          {h.result === "MODIFIED" && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-500/30">
                              ⚠ Modified
                            </span>
                          )}
                          {h.result === "NOT_REGISTERED" && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#111A2A] text-slate-300 border border-[#22304A]">
                              ? Not Registered
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : h._id)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#111A2A] hover:bg-[#162238] text-[#94A3B8] hover:text-white border border-[#22304A] font-medium transition-colors"
                          >
                            <span>{isExpanded ? "Hide" : "Show"} Details</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-[#111A2A]/80">
                          <td colSpan={4} className="px-6 py-4">
                            <div className="p-4 rounded-lg bg-[#0D1422] border border-[#22304A] space-y-3 text-xs">
                              <div className="flex justify-between">
                                <span className="text-[#94A3B8]">Verification Record ID:</span>
                                <span className="text-sky-400 font-mono">{h.verificationId}</span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                  <span className="text-[#94A3B8] text-[11px]">Submitted File SHA-256 Hash:</span>
                                  <Tooltip text="A unique digital fingerprint generated from the file contents." />
                                </div>
                                <code className="text-slate-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111A2A] border border-[#22304A]">
                                  {h.submittedHash}
                                </code>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
