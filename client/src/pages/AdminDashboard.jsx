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
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'users' | 'products' | 'verifications' | 'suspicious'
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400">Loading Governance & Security Analytics...</p>
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Lock className="w-6 h-6 text-purple-400" />
            <span>Admin Governance Console</span>
          </h1>
          <p className="text-xs text-slate-400">Security monitoring, user access management, and suspicious activity flagging</p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Governance State</span>
        </button>
      </div>

      {/* METRICS CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Total Users</span>
          <div className="text-2xl font-extrabold text-white">{totalUsers}</div>
          <span className="text-[10px] text-blue-400 font-semibold">{manufacturers} Manufacturers</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Registered Products</span>
          <div className="text-2xl font-extrabold text-blue-400">{totalProducts}</div>
          <span className="text-[10px] text-slate-400 font-semibold">Off-Chain & On-Chain</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Total Scans</span>
          <div className="text-2xl font-extrabold text-emerald-400">{totalVerifications}</div>
          <span className="text-[10px] text-emerald-500 font-semibold">Global Queries</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Suspicious Scans</span>
          <div className="text-2xl font-extrabold text-red-400">{suspiciousVerifications}</div>
          <span className="text-[10px] text-red-400 font-semibold">Hash Failures</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Blockchain Tx Status</span>
          <div className="text-2xl font-extrabold text-purple-400">Active</div>
          <span className="text-[10px] text-purple-400 font-semibold">Ethereum Local Node</span>
        </div>
      </div>

      {/* ADMIN SECTION TABS */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        {[
          { id: "overview", label: "System Overview" },
          { id: "users", label: `User Management (${users.length})` },
          { id: "products", label: `Product Monitoring (${products.length})` },
          { id: "verifications", label: `Verification Logs (${verifications.length})` },
          { id: "suspicious", label: `Suspicious Alerts (${suspiciousList.length})`, badge: true },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === t.id
                ? t.badge
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: USERS MANAGEMENT */}
      {activeTab === "users" && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Registered Users & Authorization</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Wallet Address</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/50">
                    <td className="px-4 py-3 font-bold text-white">{u.name}</td>
                    <td className="px-4 py-3 text-slate-400">{u.email}</td>
                    <td className="px-4 py-3 font-semibold uppercase text-[10px] text-blue-400">{u.role}</td>
                    <td className="px-4 py-3 text-slate-300">{u.companyName || "N/A"}</td>
                    <td className="px-4 py-3 font-mono text-[10px] text-purple-400">
                      {u.walletAddress ? `${u.walletAddress.substring(0, 10)}...` : "None"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        {u.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleToggleUser(u._id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                          u.isActive ? "bg-red-950/60 text-red-400 hover:bg-red-900" : "bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900"
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

      {/* TAB 2: PRODUCTS MONITORING */}
      {activeTab === "products" && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">All System Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Product ID</th>
                  <th className="px-4 py-3">Manufacturer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Reg Date</th>
                  <th className="px-4 py-3 text-right">Flag Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-900/50">
                    <td className="px-4 py-3 font-bold text-white">{p.productName}</td>
                    <td className="px-4 py-3 font-mono text-blue-400">{p.productId}</td>
                    <td className="px-4 py-3 text-slate-300">{p.manufacturer?.companyName || p.manufacturer?.name || "N/A"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === "AUTHENTIC" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {p.status !== "SUSPENDED" && (
                        <button
                          onClick={() => handleFlagProduct(p.productId, "SUSPENDED")}
                          className="px-2.5 py-1 rounded bg-amber-950/60 text-amber-400 hover:bg-amber-900 text-[10px] font-bold"
                        >
                          Suspend
                        </button>
                      )}
                      {p.status !== "COUNTERFEIT" && (
                        <button
                          onClick={() => handleFlagProduct(p.productId, "COUNTERFEIT")}
                          className="px-2.5 py-1 rounded bg-red-950/60 text-red-400 hover:bg-red-900 text-[10px] font-bold"
                        >
                          Flag Fake
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SUSPICIOUS ALERTS */}
      {(activeTab === "suspicious" || activeTab === "overview") && (
        <div className="glass-panel p-6 rounded-3xl border border-red-800/40 bg-red-950/10 space-y-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-bold text-white">Flagged Suspicious Verification Attempts</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Queried ID</th>
                  <th className="px-4 py-3">Failure Reason</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {suspiciousList.length > 0 ? (
                  suspiciousList.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="px-4 py-3 font-mono font-bold text-red-400">{v.productId}</td>
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
