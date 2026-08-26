import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import {
  Search,
  Filter,
  PlusCircle,
  Eye,
  QrCode,
  CheckCircle,
  ArrowRightLeft,
  AlertTriangle,
  RefreshCw,
  MoreVertical,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [transferModal, setTransferModal] = useState(null); // product obj to transfer
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
    if (!window.confirm(`Are you sure you want to deactivate/recall product ID: ${productId}?`)) return;
    try {
      const res = await API.post(`/products/${productId}/deactivate`);
      if (res.data.success) {
        alert("Product marked as RECALLED");
        fetchProducts();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Deactivation failed.");
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
      alert(err.response?.data?.message || "Transfer failed.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Registered Product Catalog</h1>
          <p className="text-xs text-slate-400">Manage authenticated items, view QR codes, and execute ownership transfers</p>
        </div>

        <Link
          to="/register-product"
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Product</span>
        </Link>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
        <div className="sm:col-span-5 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search Product ID, Name, Serial Number, or Brand..."
            className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        </div>

        <div className="sm:col-span-3">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
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
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
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
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
            title="Refresh Catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PRODUCTS CATALOG TABLE */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Product Info</th>
                <th className="px-4 py-3.5">Product ID</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Reg Date</th>
                <th className="px-4 py-3.5">Blockchain Tx</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                    Loading products list...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={p.productImage || "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200&auto=format&fit=crop&q=80"}
                          alt={p.productName}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{p.productName}</div>
                          <div className="text-[10px] text-slate-400">Brand: {p.brandName} | SN: {p.serialNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-400">{p.productId}</td>
                    <td className="px-4 py-3 text-slate-300">{p.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === "AUTHENTIC" || p.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-mono text-[10px] text-purple-400">
                      {p.transactionHash ? `${p.transactionHash.substring(0, 8)}...` : "On-Chain"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/products/${p.productId}`}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/verify/${p.productId}`}
                          className="p-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/40 text-blue-400 border border-blue-800/40"
                          title="Verify Product"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/products/${p.productId}/qr`}
                          className="p-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/40 text-purple-400 border border-purple-800/40"
                          title="View / Print QR"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setTransferModal(p)}
                          className="p-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-400 border border-cyan-800/40"
                          title="Transfer Ownership"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </button>
                        {p.status !== "RECALLED" && (
                          <button
                            onClick={() => handleDeactivate(p.productId)}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-800/40"
                            title="Recall / Deactivate Product"
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
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                    No products match the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded-lg bg-slate-900 disabled:opacity-40 text-slate-200 border border-slate-800"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded-lg bg-slate-900 disabled:opacity-40 text-slate-200 border border-slate-800"
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
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
              <span>Transfer Ownership</span>
            </h3>
            <p className="text-xs text-slate-400">
              Transfer ownership of product <strong className="text-blue-400 font-mono">{transferModal.productId}</strong> on Ethereum smart contract.
            </p>

            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">New Owner Wallet Address *</label>
                <input
                  type="text"
                  value={newWallet}
                  onChange={(e) => setNewWallet(e.target.value)}
                  placeholder="0x..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
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
