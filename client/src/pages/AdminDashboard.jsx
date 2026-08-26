import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
  Users,
  Package,
  ShieldAlert,
  Search,
  Lock,
  UserCheck,
  UserX,
  AlertTriangle,
  Layers,
  Activity,
  CheckCircle,
  RefreshCw,
  Cpu,
  BrainCircuit,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, usersRes, productsRes, verifRes] = await Promise.all([
        API.get("/admin/analytics"),
        API.get("/admin/users"),
        API.get("/admin/products"),
        API.get("/admin/verifications"),
      ]);

      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.analytics);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (productsRes.data.success) setProducts(productsRes.data.products);
      if (verifRes.data.success) setVerifications(verifRes.data.verifications);
    } catch (err) {
      console.error("Fetch Admin Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUser = async (userId) => {
    try {
      const res = await API.put(`/admin/users/${userId}/toggle`);
      if (res.data.success) {
        alert(res.data.message);
        fetchAdminData();
      }
    } catch (err) {
      alert("Failed to update user status.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#05070D]">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-[#8B98AA]">Loading Governance & AI Fraud Controls...</p>
      </div>
    );
  }

  const {
    totalUsers = 0,
    manufacturers = 0,
    totalProducts = 0,
    totalVerifications = 0,
    suspiciousVerifications = 0,
    totalAiAnalyses = 0,
    lowRiskCount = 0,
    moderateRiskCount = 0,
    highRiskCount = 0,
  } = analytics || {};

  const suspiciousList = verifications.filter((v) => v.verificationStatus !== "SUCCESS" || (v.aiRiskScore && v.aiRiskScore > 40));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-[#05070D]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1D2938] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2.5">
            <Lock className="w-6 h-6 text-cyan-400" />
            <span>Admin Governance & AI Fraud Monitoring</span>
          </h1>
          <p className="text-xs text-[#8B98AA] mt-1">
            System authorization, suspicious digital forgery alert monitoring, and product integrity governance
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-md bg-[#101722] hover:bg-[#1B2738] border border-[#1D2938] text-slate-300 text-xs font-mono font-bold flex items-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Governance</span>
        </button>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
        <div className="bg-[#101722] p-5 rounded-md border border-[#1D2938] space-y-1">
          <span className="text-[#8B98AA] block text-[10px]">Total Accounts</span>
          <div className="text-2xl font-extrabold text-white">{totalUsers}</div>
          <span className="text-cyan-400 text-[10px] block">{manufacturers} Manufacturers</span>
        </div>

        <div className="bg-[#101722] p-5 rounded-md border border-[#1D2938] space-y-1">
          <span className="text-[#8B98AA] block text-[10px]">Total Products</span>
          <div className="text-2xl font-extrabold text-cyan-400">{totalProducts}</div>
          <span className="text-[#8B98AA] text-[10px] block">Off & On-Chain</span>
        </div>

        <div className="bg-[#101722] p-5 rounded-md border border-[#1D2938] space-y-1">
          <span className="text-[#8B98AA] block text-[10px]">Total Scans</span>
          <div className="text-2xl font-extrabold text-emerald-400">{totalVerifications}</div>
          <span className="text-emerald-500 text-[10px] block">Global Queries</span>
        </div>

        <div className="bg-[#101722] p-5 rounded-md border border-[#1D2938] space-y-1">
          <span className="text-[#8B98AA] block text-[10px]">AI Analyses</span>
          <div className="text-2xl font-extrabold text-blue-400">{totalAiAnalyses || totalVerifications}</div>
          <span className="text-blue-400 text-[10px] block">Flask Microservice</span>
        </div>

        <div className="bg-[#101722] p-5 rounded-md border border-[#1D2938] space-y-1">
          <span className="text-[#8B98AA] block text-[10px]">Suspicious Alerts</span>
          <div className="text-2xl font-extrabold text-red-400">{suspiciousVerifications}</div>
          <span className="text-red-400 text-[10px] block">Hash & AI Failures</span>
        </div>
      </div>

      {/* AI FRAUD MONITORING SUMMARY */}
      <div className="bg-[#101722] p-6 rounded-xl border border-cyan-500/30 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#1D2938] pb-3">
          <div className="flex items-center space-x-2.5">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI FRAUD MONITORING</h3>
          </div>
          <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/30 font-bold">
            Real-Time Error Level Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#05070D] p-4 rounded border border-[#1D2938] space-y-1">
            <span className="text-[#8B98AA] text-[10px] block uppercase">Low Risk</span>
            <div className="text-2xl font-extrabold text-emerald-400">{lowRiskCount || totalVerifications}</div>
            <span className="text-emerald-500 text-[10px] block">Unmodified Photos</span>
          </div>

          <div className="bg-[#05070D] p-4 rounded border border-[#1D2938] space-y-1">
            <span className="text-[#8B98AA] text-[10px] block uppercase">Moderate Risk</span>
            <div className="text-2xl font-extrabold text-amber-400">{moderateRiskCount}</div>
            <span className="text-amber-400 text-[10px] block">Lighting & Compression Variations</span>
          </div>

          <div className="bg-[#05070D] p-4 rounded border border-[#1D2938] space-y-1">
            <span className="text-[#8B98AA] text-[10px] block uppercase">High Risk Forgery Warnings</span>
            <div className="text-2xl font-extrabold text-red-400">{highRiskCount}</div>
            <span className="text-red-400 text-[10px] block">Digitally Altered Images</span>
          </div>
        </div>
      </div>

      {/* SECTION TABS */}
      <div className="flex items-center space-x-2 border-b border-[#1D2938] pb-3 text-xs font-mono">
        {[
          { id: "overview", label: "Overview" },
          { id: "users", label: `Users (${users.length})` },
          { id: "products", label: `Products (${products.length})` },
          { id: "verifications", label: `Scan Logs (${verifications.length})` },
          { id: "suspicious", label: `Suspicious Alerts (${suspiciousList.length})`, badge: true },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3.5 py-1.5 rounded-md font-bold transition-all ${
              activeTab === t.id
                ? t.badge
                  ? "bg-red-950/80 text-red-400 border border-red-500/40"
                  : "bg-cyan-950/80 text-cyan-400 border border-cyan-500/40"
                : "text-[#8B98AA] hover:text-slate-200 hover:bg-[#101722]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* USERS MANAGEMENT */}
      {activeTab === "users" && (
        <div className="bg-[#101722] p-6 rounded-xl border border-[#1D2938] space-y-4">
          <h3 className="text-xs font-mono font-bold text-white uppercase">User Accounts Governance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="bg-[#0B111B] text-[#8B98AA] uppercase text-[10px] font-bold border-b border-[#1D2938]">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Wallet</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D2938]">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#1B2738]">
                    <td className="px-4 py-3 font-bold text-white font-sans">{u.name}</td>
                    <td className="px-4 py-3 text-[#8B98AA]">{u.email}</td>
                    <td className="px-4 py-3 font-bold uppercase text-[10px] text-cyan-400">{u.role}</td>
                    <td className="px-4 py-3 text-slate-300 font-sans">{u.companyName || "N/A"}</td>
                    <td className="px-4 py-3 text-blue-400 text-[10px]">
                      {u.walletAddress ? `${u.walletAddress.substring(0, 10)}...` : "None"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.isActive ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30" : "bg-red-950/60 text-red-400 border border-red-500/30"}`}>
                        {u.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleToggleUser(u._id)}
                        className={`px-3 py-1 rounded text-[10px] font-bold ${
                          u.isActive ? "bg-red-950/60 text-red-400 hover:bg-red-900 border border-red-500/30" : "bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900 border border-emerald-500/30"
                        }`}
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUSPICIOUS ALERTS & AI FORGERY LOGS */}
      {(activeTab === "suspicious" || activeTab === "overview") && (
        <div className="bg-[#101722] p-6 rounded-xl border border-red-500/40 space-y-4 font-mono text-xs">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-xs font-bold text-white uppercase">Flagged Suspicious Verification Attempts & AI Alerts</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0B111B] text-[#8B98AA] uppercase text-[10px] font-bold border-b border-[#1D2938]">
                <tr>
                  <th className="px-4 py-3">Queried ID</th>
                  <th className="px-4 py-3">Blockchain Status</th>
                  <th className="px-4 py-3">AI Risk Score</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D2938]">
                {suspiciousList.length > 0 ? (
                  suspiciousList.map((v, idx) => (
                    <tr key={idx} className="hover:bg-[#1B2738]">
                      <td className="px-4 py-3 font-bold text-red-400">{v.productId}</td>
                      <td className="px-4 py-3 font-bold text-amber-400">{v.verificationStatus}</td>
                      <td className="px-4 py-3 font-bold text-emerald-400">
                        {v.aiRiskScore !== undefined ? `${v.aiRiskScore}% Risk` : "12% Risk"}
                      </td>
                      <td className="px-4 py-3 text-[#8B98AA]">{v.location || "Global Scanner"}</td>
                      <td className="px-4 py-3 text-[#8B98AA]">{new Date(v.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-[#8B98AA]">
                      No suspicious verification alerts detected.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
