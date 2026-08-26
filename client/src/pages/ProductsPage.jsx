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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 bg-[#050816]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1E2A47] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2.5">
            <Package className="w-6 h-6 text-purple-400" />
            <span>Registered Product Catalog</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage product identities, print QR labels, and execute on-chain ownership transfers
          </p>
        </div>

        <Link
          to="/register-product"
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/20 border border-purple-400/30 flex items-center space-x-2 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Product</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-[#0D1528] p-4 rounded-xl border border-[#1E2A47] grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
        <div className="sm:col-span-5 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search Product ID, Name, Serial Number..."
            className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-[#0A1020] border border-[#1E2A47] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>

        <div className="sm:col-span-3">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1020] border border-[#1E2A47] text-white focus:outline-none focus:border-purple-500"
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
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1020] border border-[#1E2A47] text-white focus:outline-none focus:border-purple-500"
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
            className="p-2.5 rounded-xl bg-[#0A1020] hover:bg-[#111B32] border border-[#1E2A47] text-slate-400 hover:text-white"
            title="Refresh Catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Catalog Table */}
      <div className="bg-[#0D1528] rounded-2xl border border-[#1E2A47] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A1020] text-slate-400 uppercase tracking-wider text-[10px] font-mono font-bold border-b border-[#1E2A47]">
              <tr>
                <th className="px-4 py-3.5">Product Metadata</th>
                <th className="px-4 py-3.5">Product ID</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Authenticity Status</th>
                <th className="px-4 py-3.5">Blockchain Tx</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2A47]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-500 font-mono">
                    Querying product records...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-[#111B32] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={p.productImage || "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200&auto=format&fit=crop&q=80"}
                          alt={p.productName}
                          className="w-10 h-10 rounded-lg object-cover border border-[#1E2A47]"
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{p.productName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">SN: {p.serialNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-purple-400">{p.productId}</td>
                    <td className="px-4 py-3 text-slate-300">{p.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          p.status === "AUTHENTIC" || p.status === "ACTIVE"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-950/60 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-cyan-400 flex items-center space-x-1 pt-4">
                      <Cpu className="w-3 h-3 text-purple-400" />
                      <span>{p.transactionHash ? `${p.transactionHash.substring(0, 8)}...` : "On-Chain"}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <Link
                          to={`/products/${p.productId}`}
                          className="p-1.5 rounded-lg bg-[#0A1020] hover:bg-[#111B32] text-slate-300 border border-[#1E2A47]"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/verify/${p.productId}`}
                          className="p-1.5 rounded-lg bg-purple-950/40 text-purple-400 border border-purple-500/30"
                          title="Verify Product"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/products/${p.productId}/qr`}
                          className="p-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/30"
                          title="View / Print QR"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setTransferModal(p)}
                          className="p-1.5 rounded-lg bg-indigo-950/40 text-indigo-400 border border-indigo-500/30"
                          title="Transfer Ownership"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </button>
                        {p.status !== "RECALLED" && (
                          <button
                            onClick={() => handleDeactivate(p.productId)}
                            className="p-1.5 rounded-lg bg-red-950/40 text-red-400 border border-red-500/30"
                            title="Deactivate"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-500 font-mono">
                    No products match query criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#0A1020] border-t border-[#1E2A47] flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded bg-[#0D1528] disabled:opacity-40 border border-[#1E2A47] text-slate-300"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded bg-[#0D1528] disabled:opacity-40 border border-[#1E2A47] text-slate-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transfer Ownership Modal */}
      {transferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0D1528] w-full max-w-md p-6 rounded-2xl border border-purple-500/40 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ArrowRightLeft className="w-5 h-5 text-purple-400" />
              <span>Transfer Ownership On-Chain</span>
            </h3>
            <p className="text-slate-400">
              Transfer product <strong className="text-purple-400 font-mono">{transferModal.productId}</strong> to a new wallet address.
            </p>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="font-mono font-bold text-slate-300 uppercase block mb-1">New Owner Wallet Address *</label>
                <input
                  type="text"
                  value={newWallet}
                  onChange={(e) => setNewWallet(e.target.value)}
                  placeholder="0x..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1020] border border-[#1E2A47] text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#0A1020] text-slate-300 font-semibold border border-[#1E2A47]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
