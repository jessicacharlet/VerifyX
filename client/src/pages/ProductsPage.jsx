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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 bg-[#070A0F]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#202A36] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Products</h1>
          <p className="text-xs text-[#8B97A7] mt-0.5">
            Registered product catalog and blockchain ownership records.
          </p>
        </div>

        <Link
          to="/register-product"
          className="px-4 py-2 rounded font-bold text-xs text-[#070A0F] bg-[#06b6d4] hover:bg-[#0891b2] transition-colors border border-cyan-400/30 flex items-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register product</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-[#0D121A] p-3 rounded-lg border border-[#202A36] grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
        <div className="sm:col-span-5 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search product ID, name, serial number..."
            className="w-full px-3 py-2 pl-9 rounded bg-[#111821] border border-[#202A36] text-white placeholder-[#8B97A7] focus:outline-none focus:border-cyan-500"
          />
          <Search className="w-4 h-4 text-[#8B97A7] absolute left-3 top-2.5" />
        </div>

        <div className="sm:col-span-3">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded bg-[#111821] border border-[#202A36] text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All categories</option>
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
            className="w-full px-3 py-2 rounded bg-[#111821] border border-[#202A36] text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All statuses</option>
            <option value="AUTHENTIC">Authentic</option>
            <option value="ACTIVE">Active</option>
            <option value="RECALLED">Recalled</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        <div className="sm:col-span-1 flex items-center justify-center">
          <button
            onClick={fetchProducts}
            className="p-2 rounded bg-[#111821] hover:bg-[#202A36] border border-[#202A36] text-[#8B97A7] hover:text-white"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Enterprise Software Product Table */}
      <div className="bg-[#0D121A] rounded-lg border border-[#202A36] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#111821] text-[#8B97A7] uppercase tracking-wider text-[10px] font-mono font-bold border-b border-[#202A36]">
              <tr>
                <th className="px-4 py-2.5">Product</th>
                <th className="px-4 py-2.5">Product ID</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Blockchain</th>
                <th className="px-4 py-2.5">Last verified</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202A36]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#8B97A7] font-mono">
                    Loading product catalog...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-[#111821] transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center space-x-3">
                        <img
                          src={p.productImage || "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200&auto=format&fit=crop&q=80"}
                          alt={p.productName}
                          className="w-8 h-8 rounded object-cover border border-[#202A36]"
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{p.productName}</div>
                          <div className="text-[10px] text-[#8B97A7] font-mono">{p.brandName} • SN: {p.serialNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-mono font-bold text-cyan-400">{p.productId}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          p.status === "AUTHENTIC" || p.status === "ACTIVE"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-950/60 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {p.status === "AUTHENTIC" || p.status === "ACTIVE" ? "✓ Verified" : "Recalled"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-blue-400">
                      {p.transactionHash ? `${p.transactionHash.substring(0, 10)}...` : "On-chain"}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-[#8B97A7]">
                      {new Date(p.updatedAt || p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/products/${p.productId}`}
                          className="px-2.5 py-1 rounded bg-[#111821] hover:bg-[#202A36] text-slate-200 border border-[#202A36] font-medium text-[11px]"
                        >
                          View
                        </Link>
                        <Link
                          to={`/verify/${p.productId}`}
                          className="px-2.5 py-1 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 font-medium text-[11px]"
                        >
                          Verify
                        </Link>
                        <Link
                          to={`/products/${p.productId}/qr`}
                          className="p-1 rounded bg-[#111821] text-[#8B97A7] border border-[#202A36] hover:text-white"
                          title="QR label"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#8B97A7] font-mono">
                    No products match query criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 bg-[#111821] border-t border-[#202A36] flex items-center justify-between text-xs text-[#8B97A7] font-mono">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded bg-[#0D121A] disabled:opacity-40 border border-[#202A36] text-slate-300"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded bg-[#0D121A] disabled:opacity-40 border border-[#202A36] text-slate-300"
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
          <div className="bg-[#0D121A] w-full max-w-md p-6 rounded-lg border border-[#202A36] space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
              <span>Transfer ownership on-chain</span>
            </h3>
            <p className="text-[#8B97A7]">
              Transfer product <strong className="text-cyan-400 font-mono">{transferModal.productId}</strong> to a new wallet address.
            </p>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="font-mono font-medium text-slate-300 text-[11px] block mb-1">New owner wallet address *</label>
                <input
                  type="text"
                  value={newWallet}
                  onChange={(e) => setNewWallet(e.target.value)}
                  placeholder="0x..."
                  required
                  className="w-full px-3 py-2 rounded bg-[#111821] border border-[#202A36] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferModal(null)}
                  className="px-3 py-1.5 rounded bg-[#111821] text-slate-300 font-medium border border-[#202A36]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#06b6d4] text-[#070A0F] font-bold"
                >
                  Confirm transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
