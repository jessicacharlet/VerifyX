import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  PackageCheck,
  Truck,
  CheckCircle,
  AlertTriangle,
  QrCode,
  ArrowRight,
  Clock,
  ShieldCheck,
  Plus,
  RefreshCw,
} from "lucide-react";
import API from "../services/api";

export default function ManufacturerDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    processing: 0,
    packed: 0,
    dispatched: 0,
    inTransit: 0,
    delivered: 0,
    issues: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes, issuesRes] = await Promise.all([
        API.get("/orders"),
        API.get("/products"),
        API.get("/issues"),
      ]);

      const orders = ordersRes.data?.orders || [];
      const products = productsRes.data?.products || [];
      const issues = issuesRes.data?.issues || [];

      const totalOrders = orders.length;
      const processing = products.filter((p) => p.currentStage === "PRODUCT_ASSIGNED" || p.currentStage === "QR_GENERATED").length;
      const packed = products.filter((p) => p.currentStage === "PACKED" || p.currentStage === "QUALITY_CHECK").length;
      const dispatched = products.filter((p) => p.currentStage === "DISPATCHED").length;
      const inTransit = products.filter((p) => p.currentStage === "IN_TRANSIT").length;
      const delivered = products.filter((p) => p.currentStage === "DELIVERED").length;
      const issueCount = issues.filter((i) => i.status === "OPEN").length;

      setStats({
        totalOrders,
        processing,
        packed,
        dispatched,
        inTransit,
        delivered,
        issues: issueCount,
      });

      setRecentOrders(orders.slice(0, 5));

      let allScans = [];
      for (const p of products.slice(0, 10)) {
        try {
          const sRes = await API.get(`/scans/products/${p.productId}/scans`);
          if (sRes.data && sRes.data.scans) {
            allScans = allScans.concat(sRes.data.scans);
          }
        } catch (e) {}
      }
      allScans.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
      setRecentScans(allScans.slice(0, 6));
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Operational Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Company Operations & Product Lifecycle
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Real-time tracking of order creation, QR packaging, quality control, and customer deliveries.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/scan"
            className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#070A0F] font-semibold text-xs flex items-center space-x-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Product QR</span>
          </Link>

          <Link
            to="/orders/create"
            className="px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-semibold text-xs flex items-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Order</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 text-xs">
        <div className="bg-[#0D121A] p-4 rounded-xl border border-[#1E293B] space-y-1">
          <span className="text-[#94A3B8] text-xs font-medium block">Total orders</span>
          <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
          <span className="text-[11px] text-cyan-400 font-medium">Sales orders</span>
        </div>

        <div className="bg-[#0D121A] p-4 rounded-xl border border-[#1E293B] space-y-1">
          <span className="text-[#94A3B8] text-xs font-medium block">Processing</span>
          <div className="text-2xl font-bold text-amber-400">{stats.processing}</div>
          <span className="text-[11px] text-[#94A3B8]">Assigned & QR</span>
        </div>

        <div className="bg-[#0D121A] p-4 rounded-xl border border-[#1E293B] space-y-1">
          <span className="text-[#94A3B8] text-xs font-medium block">Packed</span>
          <div className="text-2xl font-bold text-cyan-400">{stats.packed}</div>
          <span className="text-[11px] text-[#94A3B8]">Quality checked</span>
        </div>

        <div className="bg-[#0D121A] p-4 rounded-xl border border-[#1E293B] space-y-1">
          <span className="text-[#94A3B8] text-xs font-medium block">Dispatched</span>
          <div className="text-2xl font-bold text-indigo-400">{stats.dispatched}</div>
          <span className="text-[11px] text-[#94A3B8]">Handed to courier</span>
        </div>

        <div className="bg-[#0D121A] p-4 rounded-xl border border-[#1E293B] space-y-1">
          <span className="text-[#94A3B8] text-xs font-medium block">In transit</span>
          <div className="text-2xl font-bold text-blue-400">{stats.inTransit}</div>
          <span className="text-[11px] text-[#94A3B8]">Hub checkpoints</span>
        </div>

        <div className="bg-[#0D121A] p-4 rounded-xl border border-[#1E293B] space-y-1">
          <span className="text-[#94A3B8] text-xs font-medium block">Delivered</span>
          <div className="text-2xl font-bold text-emerald-400">{stats.delivered}</div>
          <span className="text-[11px] text-emerald-400 font-semibold">100% Verified</span>
        </div>

        <div className="bg-[#0D121A] p-4 rounded-xl border border-red-500/40 space-y-1">
          <span className="text-red-400 text-xs font-medium block">Issues</span>
          <div className="text-2xl font-bold text-red-400">{stats.issues}</div>
          <span className="text-[11px] text-red-300 font-medium">Requires attention</span>
        </div>
      </div>

      {/* Main Grid: Orders & Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Section */}
        <div className="lg:col-span-6 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span>Recent sales orders</span>
            </h3>
            <Link to="/orders" className="text-xs text-cyan-400 hover:underline font-medium">
              View all orders ➔
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((ord) => (
              <div key={ord._id} className="p-4 rounded-lg bg-[#111821] border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-cyan-400">{ord.orderId}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-medium">
                    {ord.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-medium">{ord.productName}</span>
                  <span className="text-[#94A3B8]">{ord.customerName}</span>
                </div>
                <div className="pt-1 flex justify-between items-center text-xs text-[#94A3B8]">
                  <span>Order date: {new Date(ord.orderDate).toLocaleDateString()}</span>
                  <Link to={`/orders/${ord.orderId}`} className="text-cyan-400 hover:underline font-medium">
                    Assign Product / Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Scan Events Audit Stream */}
        <div className="lg:col-span-6 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Live scan events</span>
            </h3>
            <Link to="/history" className="text-xs text-cyan-400 hover:underline font-medium">
              Global log ➔
            </Link>
          </div>

          <div className="space-y-3">
            {recentScans.map((s) => (
              <div key={s._id} className="p-3.5 rounded-lg bg-[#111821] border border-[#1E293B] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-white">{s.productId}</span>
                  <span className="text-xs font-medium text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                    {s.stage}
                  </span>
                </div>
                <div className="text-[#94A3B8] flex justify-between text-xs">
                  <span>Location: <strong className="text-cyan-300 font-medium">{s.location}</strong></span>
                  <span>Operator: {s.employeeName}</span>
                </div>
                <div className="text-xs text-[#64748B]">
                  {new Date(s.timestamp || s.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
