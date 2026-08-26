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
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
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
        fetchAdminData();
      }
    } catch (err) {
      alert("Failed to update user status.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#070A0F]">
        <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-[#8B97A7]">Loading admin governance panel...</p>
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
    highRiskCount = 0,
  } = analytics || {};

  const suspiciousList = verifications.filter((v) => v.verificationStatus !== "SUCCESS" || (v.aiRiskScore && v.aiRiskScore > 40));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 bg-[#070A0F]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#202A36] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin</h1>
          <p className="text-xs text-[#8B97A7] mt-0.5">
            System governance, user authorization, and suspicious activity logs.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-3 py-1.5 rounded bg-[#0D121A] hover:bg-[#111821] border border-[#202A36] text-slate-300 text-xs font-mono font-medium flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-[#0D121A] p-4 rounded-lg border border-[#202A36] space-y-1">
          <span className="text-[#8B97A7] block text-[10px]">Total users</span>
          <div className="text-xl font-bold text-white">{totalUsers}</div>
          <span className="text-cyan-400 text-[10px] block">{manufacturers} Manufacturers</span>
        </div>

        <div className="bg-[#0D121A] p-4 rounded-lg border border-[#202A36] space-y-1">
          <span className="text-[#8B97A7] block text-[10px]">Total products</span>
          <div className="text-xl font-bold text-cyan-400">{totalProducts}</div>
          <span className="text-[#8B97A7] text-[10px] block">Off & On-chain</span>
        </div>

        <div className="bg-[#0D121A] p-4 rounded-lg border border-[#202A36] space-y-1">
          <span className="text-[#8B97A7] block text-[10px]">Total verifications</span>
          <div className="text-xl font-bold text-emerald-400">{totalVerifications}</div>
          <span className="text-emerald-500 text-[10px] block">Global scans</span>
        </div>

        <div className="bg-[#0D121A] p-4 rounded-lg border border-[#202A36] space-y-1">
          <span className="text-[#8B97A7] block text-[10px]">Suspicious alerts</span>
          <div className="text-xl font-bold text-red-400">{suspiciousVerifications}</div>
          <span className="text-red-400 text-[10px] block">Flagged items</span>
        </div>
      </div>

      {/* TABS CONTROL */}
      <div className="flex items-center space-x-2 border-b border-[#202A36] pb-2 text-xs font-mono">
        {[
          { id: "users", label: `Users (${users.length})` },
          { id: "products", label: `Products (${products.length})` },
          { id: "verifications", label: `Verification logs (${verifications.length})` },
          { id: "suspicious", label: `Suspicious activity (${suspiciousList.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === t.id
                ? "bg-[#06b6d4] text-[#070A0F] font-bold"
                : "text-[#8B97A7] hover:text-slate-200 hover:bg-[#0D121A]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* USERS TABLE */}
      {activeTab === "users" && (
        <div className="bg-[#0D121A] rounded-lg border border-[#202A36] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="bg-[#111821] text-[#8B97A7] uppercase text-[10px] font-bold border-b border-[#202A36]">
                <tr>
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5">Role</th>
                  <th className="px-4 py-2.5">Company</th>
                  <th className="px-4 py-2.5">Wallet</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202A36]">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#111821] transition-colors">
                    <td className="px-4 py-2.5 font-bold text-white font-sans">{u.name}</td>
                    <td className="px-4 py-2.5 text-[#8B97A7]">{u.email}</td>
                    <td className="px-4 py-2.5 font-bold uppercase text-[10px] text-cyan-400">{u.role}</td>
                    <td className="px-4 py-2.5 text-slate-300 font-sans">{u.companyName || "N/A"}</td>
                    <td className="px-4 py-2.5 text-blue-400 text-[10px]">
                      {u.walletAddress ? `${u.walletAddress.substring(0, 8)}...` : "None"}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.isActive ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30" : "bg-red-950/60 text-red-400 border border-red-500/30"}`}>
                        {u.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => handleToggleUser(u._id)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold ${
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

      {/* SUSPICIOUS ACTIVITY TABLE */}
      {activeTab === "suspicious" && (
        <div className="bg-[#0D121A] rounded-lg border border-red-500/40 overflow-hidden font-mono text-xs">
          <div className="p-4 bg-[#111821] border-b border-[#202A36] flex items-center space-x-2 text-red-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Flagged verification alerts & image anomaly log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#111821] text-[#8B97A7] uppercase text-[10px] font-bold border-b border-[#202A36]">
                <tr>
                  <th className="px-4 py-2.5">Queried ID</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Image risk</th>
                  <th className="px-4 py-2.5">Origin</th>
                  <th className="px-4 py-2.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202A36]">
                {suspiciousList.length > 0 ? (
                  suspiciousList.map((v, idx) => (
                    <tr key={idx} className="hover:bg-[#111821]">
                      <td className="px-4 py-2.5 font-bold text-red-400">{v.productId}</td>
                      <td className="px-4 py-2.5 font-bold text-amber-400">{v.verificationStatus}</td>
                      <td className="px-4 py-2.5 text-emerald-400">
                        {v.aiRiskScore !== undefined ? `${v.aiRiskScore}% Risk` : "12% Risk"}
                      </td>
                      <td className="px-4 py-2.5 text-[#8B97A7]">{v.location || "Global scanner"}</td>
                      <td className="px-4 py-2.5 text-[#8B97A7]">{new Date(v.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-[#8B97A7]">
                      No suspicious verification alerts recorded.
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
