import React, { useState, useEffect } from "react";
import { Clock, Search, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchGlobalScans();
  }, []);

  const fetchGlobalScans = async () => {
    try {
      setLoading(true);
      setError("");
      const pRes = await API.get("/products");
      let allScans = [];
      if (pRes.data && pRes.data.products) {
        for (const p of pRes.data.products.slice(0, 10)) {
          try {
            const sRes = await API.get(`/scans/products/${p.productId}/scans`);
            if (sRes.data && sRes.data.scans) {
              allScans = allScans.concat(sRes.data.scans);
            }
          } catch (e) {}
        }
      }
      allScans.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setScans(allScans);
    } catch (err) {
      console.error("Fetch scans error:", err);
      setError("Failed to fetch scan event history.");
    } finally {
      setLoading(false);
    }
  };

  const filteredScans = scans.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.productId?.toLowerCase().includes(q) ||
      s.orderId?.toLowerCase().includes(q) ||
      s.stage?.toLowerCase().includes(q) ||
      s.location?.toLowerCase().includes(q) ||
      s.employeeName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Global Scan Audit Log</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Lifecycle Scan Events History</h1>
          <p className="text-xs text-[#94A3B8]">
            Chronological audit trail of all employee QR scans, stage transitions, and location updates.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter Product ID, Location, Stage..."
            className="w-full px-3.5 py-2.5 pl-10 rounded-lg bg-[#111821] border border-[#1E293B] text-white text-xs placeholder-[#64748B] focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
        </div>
      </div>

      {/* History Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#94A3B8]">Loading scan audit log...</div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">{error}</div>
      ) : filteredScans.length === 0 ? (
        <div className="p-12 text-center bg-[#0D121A] rounded-xl border border-[#1E293B] space-y-2">
          <Clock className="w-10 h-10 text-[#64748B] mx-auto" />
          <div className="text-sm font-semibold text-white">No Scan Events Found</div>
          <p className="text-xs text-[#94A3B8]">No employee scan events recorded matching criteria.</p>
        </div>
      ) : (
        <div className="bg-[#0D121A] rounded-xl border border-[#1E293B] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111821] text-[#94A3B8] uppercase border-b border-[#1E293B] font-medium">
                <tr>
                  <th className="px-5 py-3.5">Date & time</th>
                  <th className="px-5 py-3.5">Product ID</th>
                  <th className="px-5 py-3.5">Stage</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Employee / Operator</th>
                  <th className="px-5 py-3.5">Condition</th>
                  <th className="px-5 py-3.5">Remarks</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] text-slate-200">
                {filteredScans.map((s) => (
                  <tr key={s._id} className="hover:bg-[#111821]/60 transition-colors">
                    <td className="px-5 py-4 text-[#94A3B8]">
                      {new Date(s.timestamp || s.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 font-mono font-semibold text-cyan-400">{s.productId}</td>
                    <td className="px-5 py-4 font-semibold text-white">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                        {s.stage}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-cyan-300">{s.location}</td>
                    <td className="px-5 py-4">{s.employeeName}</td>
                    <td className="px-5 py-4">
                      <span className={s.condition === "DAMAGED" ? "text-red-400 font-semibold" : "text-emerald-400 font-semibold"}>
                        {s.condition}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8] max-w-xs truncate">{s.remarks || "—"}</td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/products/${s.productId}`}
                        className="text-cyan-400 hover:underline font-semibold inline-flex items-center space-x-1"
                      >
                        <span>View</span>
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
