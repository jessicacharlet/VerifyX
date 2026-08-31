import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Plus, Search, CheckCircle, Package, ArrowRight, Clock, MapPin } from "lucide-react";
import API from "../services/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== "ALL") params.status = statusFilter;

      const res = await API.get("/orders", { params });
      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Failed to load incoming orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order Registration Hub</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Incoming Orders</h1>
          <p className="text-xs text-[#94A3B8]">
            Manage orders received from your sales channels (website, ERP, marketplace), assign physical product items, and generate QR codes.
          </p>
        </div>

        <Link
          to="/orders/create"
          className="px-5 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Register Incoming Order</span>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#0D121A] p-4 rounded-xl border border-[#1E293B] flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, Customer, Product..."
            className="w-full px-4 py-2.5 pl-10 rounded-lg bg-[#111821] border border-[#1E293B] text-white text-xs placeholder-[#64748B] focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
        </form>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 text-xs font-medium w-full md:w-auto">
          {["ALL", "ORDER_RECEIVED", "QR_GENERATED", "PACKED", "QUALITY_CHECK", "DISPATCHED", "IN_TRANSIT", "DELIVERED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                statusFilter === st
                  ? "bg-cyan-400 text-[#070A0F] font-semibold"
                  : "bg-[#111821] text-[#94A3B8] hover:text-white border border-[#1E293B]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#94A3B8]">Loading incoming orders database...</div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-[#0D121A] rounded-xl border border-[#1E293B] space-y-2">
          <Package className="w-10 h-10 text-[#64748B] mx-auto" />
          <div className="text-sm font-semibold text-white">No Incoming Orders Found</div>
          <p className="text-xs text-[#94A3B8]">No incoming orders match the selected search criteria.</p>
        </div>
      ) : (
        <div className="bg-[#0D121A] rounded-xl border border-[#1E293B] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111821] text-[#94A3B8] uppercase border-b border-[#1E293B] font-medium">
                <tr>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Sales Channel</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Product Name</th>
                  <th className="px-5 py-3.5">Assigned Product ID</th>
                  <th className="px-5 py-3.5">Registered Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] text-slate-200">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#111821]/60 transition-colors">
                    <td className="px-5 py-4 font-mono font-semibold text-cyan-400">
                      {ord.orderId}
                      {ord.externalOrderId && (
                        <div className="text-[10px] text-[#94A3B8] font-mono">Ext: {ord.externalOrderId}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8] font-medium">
                      {ord.salesChannel || "Direct Sales"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <div className="text-[11px] text-[#94A3B8]">{ord.customerContact}</div>
                    </td>
                    <td className="px-5 py-4 font-medium text-white">{ord.productName}</td>
                    <td className="px-5 py-4">
                      {ord.assignedProducts && ord.assignedProducts.length > 0 ? (
                        <span className="font-mono text-emerald-400 font-semibold">
                          {ord.assignedProducts[0].productId || ord.assignedProducts[0]}
                        </span>
                      ) : (
                        <span className="text-amber-400 text-xs bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 font-medium">
                          Pending Assignment
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8]">
                      {new Date(ord.orderDate || ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/orders/${ord.orderId}`}
                        className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-semibold hover:underline"
                      >
                        <span>View / Assign</span>
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
