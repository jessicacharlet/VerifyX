import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import {
  Search,
  PlusCircle,
  Eye,
  QrCode,
  CheckCircle,
  ArrowRightLeft,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Package,
  ShieldCheck,
  Check,
  Copy,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [transferModal, setTransferModal] = useState(null);
  const [newWallet, setNewWallet] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products", {
        params: { search, category, status, page, limit: 10 },
      });
      if (res.data.success) {
        setProducts(res.data.products);
        setTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error("Fetch Products Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, status, page]);

  const handleDeactivate = async (productId) => {
    if (!window.confirm(`Deactivate / Recall product ID: ${productId}?`)) return;
    try {
      const res = await API.post(`/products/${productId}/deactivate`);
      if (res.data.success) {
        alert("Product deactivated");
        fetchProducts();
      }
    } catch (err) {
      alert("Deactivation failed.");
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!newWallet || !transferModal) return;

    try {
      const res = await API.post(`/products/${transferModal.productId}/transfer`, {
        newOwnerWallet: newWallet,
      });
      if (res.data.success) {
        alert(`Ownership transferred to ${newWallet}`);
        setTransferModal(null);
        setNewWallet("");
        fetchProducts();
      }
    } catch (err) {
      alert("Transfer failed.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 bg-[#070A0F]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-cyan-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AUTHENTICITY LEDGER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Registered Products</h1>
          <p className="text-xs text-[#94A3B8]">
            Catalog of products registered on Ethereum smart contract with SHA-256 signatures.
          </p>
        </div>

        <Link
          to="/register-product"
          className="px-4 py-2.5 rounded-lg font-bold text-xs text-[#070A0F] bg-cyan-400 hover:bg-cyan-300 transition-all border border-cyan-300/40 shadow-sm flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Product</span>
        </Link>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-[#0D121A] p-4 rounded-xl border border-[#1E293B] grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs shadow-md">
        <div className="sm:col-span-5 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search product ID, name, serial number..."
            className="w-full px-3.5 py-2.5 pl-9 rounded-lg bg-[#111821] border border-[#1E293B] text-white placeholder-[#64748B] focus:outline-none focus:border-cyan-400 font-mono text-xs"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
        </div>

        <div className="sm:col-span-3">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
          >
            <option value="ALL">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Audio">Audio</option>
            <option value="Luxury Watches">Luxury Watches</option>
            <option value="Apparel">Apparel</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="AUTHENTIC">Authentic</option>
            <option value="ACTIVE">Active</option>
            <option value="RECALLED">Recalled</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        <div className="sm:col-span-1 flex items-center justify-center">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-lg bg-[#111821] hover:bg-[#1E293B] border border-[#1E293B] text-[#94A3B8] hover:text-white transition-all"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-[#0D121A] rounded-xl border border-[#1E293B] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#111821] text-[#94A3B8] uppercase tracking-wider text-[10px] font-mono font-bold border-b border-[#1E293B]">
              <tr>
                <th className="px-4 py-3">Product Specs</th>
                <th className="px-4 py-3">Product ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Blockchain Tx</th>
                <th className="px-4 py-3">Created Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#94A3B8] font-mono">
                    Loading product catalog...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-[#111821]/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={p.productImage || "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200&auto=format&fit=crop&q=80"}
                          alt={p.productName}
                          className="w-9 h-9 rounded-lg object-cover border border-[#1E293B]"
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{p.productName}</div>
                          <div className="text-[10px] text-[#94A3B8] font-mono">{p.brandName} • SN: {p.serialNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-cyan-400">{p.productId}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          p.status === "AUTHENTIC" || p.status === "ACTIVE"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-950/60 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {p.status === "AUTHENTIC" || p.status === "ACTIVE" ? "✓ Verified" : "Recalled"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-blue-400">
                      {p.transactionHash ? `${p.transactionHash.substring(0, 10)}...` : "On-Chain"}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#94A3B8]">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/verify/${p.productId}`}
                          className="px-3 py-1 rounded-md bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 font-medium text-xs hover:bg-cyan-900/60 transition-colors"
                        >
                          Verify
                        </Link>
                        <Link
                          to={`/products/${p.productId}/qr`}
                          className="p-1.5 rounded-md bg-[#111821] text-[#94A3B8] border border-[#1E293B] hover:text-white transition-colors"
                          title="QR Code Label"
                        >
                          <QrCode className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#94A3B8] font-mono">
                    No products match query criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#111821] border-t border-[#1E293B] flex items-center justify-between text-xs text-[#94A3B8] font-mono">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-md bg-[#0D121A] disabled:opacity-40 border border-[#1E293B] text-slate-300 hover:border-slate-600"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-md bg-[#0D121A] disabled:opacity-40 border border-[#1E293B] text-slate-300 hover:border-slate-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
