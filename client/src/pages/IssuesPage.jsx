import React, { useState, useEffect } from "react";
import { AlertOctagon, CheckCircle, Search, ArrowRight, ShieldAlert } from "lucide-react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchIssues();
  }, [statusFilter]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (statusFilter !== "ALL") params.status = statusFilter;

      const res = await API.get("/issues", { params });
      if (res.data && res.data.issues) {
        setIssues(res.data.issues);
      }
    } catch (err) {
      console.error("Fetch issues error:", err);
      setError("Failed to fetch product issue logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (issueId) => {
    try {
      await API.put(`/issues/${issueId}`, {
        status: "RESOLVED",
        resolutionRemarks: "Inspected by Quality Control Manager. Cleared for packaging.",
      });
      fetchIssues();
    } catch (err) {
      console.error("Resolve issue error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-medium">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Damage & Quality Issues</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Product Issues & Replacements</h1>
          <p className="text-xs text-[#94A3B8]">
            Manage reported product box damages, broken seals, missing accessories, and replacement requests.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs font-medium">
        {["ALL", "OPEN", "UNDER_REVIEW", "RESOLVED"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-md transition-all ${
              statusFilter === st
                ? "bg-red-500 text-white font-semibold"
                : "bg-[#0D121A] text-[#94A3B8] hover:text-white border border-[#1E293B]"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Issues Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#94A3B8]">Loading issue records...</div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">{error}</div>
      ) : issues.length === 0 ? (
        <div className="p-12 text-center bg-[#0D121A] rounded-xl border border-[#1E293B] space-y-2">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
          <div className="text-sm font-semibold text-white">No Issues Reported</div>
          <p className="text-xs text-[#94A3B8]">All products in processing are in good condition.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {issues.map((iss) => (
            <div key={iss._id} className="bg-[#0D121A] p-5 rounded-xl border border-red-500/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <span className="text-xs font-mono font-semibold text-red-400">{iss.issueId}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/30 font-medium">
                  {iss.status}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-cyan-400 font-semibold">Product ID: <span className="font-mono">{iss.productId}</span></div>
                <div className="text-xs text-white font-semibold">Type: {iss.issueType}</div>
                <div className="text-xs text-[#94A3B8]">Location: {iss.location}</div>
                <div className="text-xs text-[#94A3B8]">Reported by: {iss.reportedByName}</div>
              </div>

              <div className="p-3 rounded bg-[#111821] border border-[#1E293B] text-xs text-slate-300">
                {iss.description}
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <Link to={`/products/${iss.productId}`} className="text-cyan-400 hover:underline flex items-center space-x-1 font-medium">
                  <span>Product details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                {iss.status === "OPEN" && (
                  <button
                    onClick={() => handleResolve(iss.issueId)}
                    className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-[#070A0F] font-semibold"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
