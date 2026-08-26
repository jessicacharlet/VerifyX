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

  const handleFlagProduct = async (productId, status) => {
    try {
      const res = await API.put(`/admin/products/${productId}/status`, { status });
      if (res.data.success) {
        alert(`Product status updated to ${status}`);
        fetchAdminData();
      }
    } catch (err) {
      alert("Failed to update product status.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#050816]">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-slate-400">Loading Governance & Security Controls...</p>
      </div>
    );
  }

  const {
    totalUsers = 0,
    manufacturers = 0,
    totalProducts = 0,
    totalVerifications = 0,
    suspiciousVerifications = 0,
  } = analytics || {};

  const suspiciousList = verifications.filter((v) => v.verificationStatus !== "SUCCESS");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-[#050816]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1E2A47] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2.5">
            <Lock className="w-6 h-6 text-cyan-400" />
            <span>Admin Governance Console</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System authorization, suspicious alert monitoring, and product integrity governance
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-xl bg-[#0D1528] hover:bg-[#111B32] border border-[#1E2A47] text-slate-300 text-xs font-mono font-bold flex items-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Governance</span>
        </button>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
        <div className="bg-[#0D1528] p-5 rounded-xl border border-[#1E2A47] space-y-1">
          <span className="text-slate-400 block text-[10px]">Total Accounts</span>
          <div className="text-2xl font-extrabold text-white">{totalUsers}</div>
          <span className="text-purple-400 text-[10px] block">{manufacturers} Manufacturers</span>
        </div>

        <div className="bg-[#0D1528] p-5 rounded-xl border border-[#1E2A47] space-y-1">
          <span className="text-slate-400 block text-[10px]">Total Products</span>
          <div className="text-2xl font-extrabold text-purple-400">{totalProducts}</div>
          <span className="text-slate-500 text-[10px] block">Off & On-Chain</span>
        </div>

        <div className="bg-[#0D1528] p-5 rounded-xl border border-[#1E2A47] space-y-1">
          <span className="text-slate-400 block text-[10px]">Total Scans</span>
          <div className="text-2xl font-extrabold text-emerald-400">{totalVerifications}</div>
          <span className="text-emerald-500 text-[10px] block">Global Queries</span>
        </div>

        <div className="bg-[#0D1528] p-5 rounded-xl border border-[#1E2A47] space-y-1">
          <span className="text-slate-400 block text-[10px]">Suspicious Alerts</span>
          <div className="text-2xl font-extrabold text-red-400">{suspiciousVerifications}</div>
          <span className="text-red-400 text-[10px] block">Hash Failures</span>
        </div>

        <div className="bg-[#0D1528] p-5 rounded-xl border border-[#1E2A47] space-y-1">
          <span className="text-slate-400 block text-[10px]">Smart Contract</span>
          <div className="text-2xl font-extrabold text-cyan-400">Active</div>
          <span className="text-cyan-400 text-[10px] block">Paris Hardhat 31337</span>
        </div>
      </div>

      {/* SECTION TABS */}
      <div className="flex items-center space-x-2 border-b border-[#1E2A47] pb-3 text-xs font-mono">
        {[
          { id: "overview", label: "Overview" },
          { id: "users", label: `Users (${users.length})` },
          { id: "products", label: `Products (${products.length})` },
          { id: "verifications", label: `Scan Logs (${verifications.length})` },
          { id: "suspicious", label: `Suspicious (${suspiciousList.length})`, badge: true },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === t.id
                ? t.badge
                  ? "bg-red-950/80 text-red-400 border border-red-500/40"
                  : "bg-cyan-950/80 text-cyan-400 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-[#0D1528]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* USERS MANAGEMENT */}
      {activeTab === "users" && (
        <div className="bg-[#0D1528] p-6 rounded-2xl border border-[#1E2A47] space-y-4">
          <h3 className="text-xs font-mono font-bold text-white uppercase">User Accounts Governance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="bg-[#0A1020] text-slate-400 uppercase text-[10px] font-bold border-b border-[#1E2A47]">
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
              <tbody className="divide-y divide-[#1E2A47]">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#111B32]">
                    <td className="px-4 py-3 font-bold text-white font-sans">{u.name}</td>
                    <td className="px-4 py-3 text-slate-400">{u.email}</td>
                    <td className="px-4 py-3 font-bold uppercase text-[10px] text-purple-400">{u.role}</td>
                    <td className="px-4 py-3 text-slate-300 font-sans">{u.companyName || "N/A"}</td>
                    <td className="px-4 py-3 text-cyan-400 text-[10px]">
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

      {/* SUSPICIOUS ALERTS */}
      {(activeTab === "suspicious" || activeTab === "overview") && (
        <div className="bg-[#0D1528] p-6 rounded-2xl border border-red-500/40 space-y-4 font-mono text-xs">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-xs font-bold text-white uppercase">Flagged Suspicious Verification Attempts</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0A1020] text-slate-400 uppercase text-[10px] font-bold border-b border-[#1E2A47]">
                <tr>
                  <th className="px-4 py-3">Queried ID</th>
                  <th className="px-4 py-3">Failure Reason</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2A47]">
                {suspiciousList.length > 0 ? (
                  suspiciousList.map((v, idx) => (
                    <tr key={idx} className="hover:bg-[#111B32]">
                      <td className="px-4 py-3 font-bold text-red-400">{v.productId}</td>
                      <td className="px-4 py-3 font-bold text-amber-400">{v.verificationStatus}</td>
                      <td className="px-4 py-3 text-slate-400">{v.location || "Global Scanner"}</td>
                      <td className="px-4 py-3 text-slate-400">{new Date(v.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
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
