import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  QrCode,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Plus,
  ArrowRight,
  UserCheck,
  MapPin,
  Calendar,
} from "lucide-react";
import API from "../services/api";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignSuccess, setAssignSuccess] = useState("");

  // Product Assignment Form State
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignForm, setAssignForm] = useState({
    serialNumber: "",
    batchNumber: "BATCH-2026-A1",
    brandName: "Samsung",
    category: "Smartphones",
    imei: "",
    warehouse: "Chennai Central Warehouse",
  });

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/orders/${id}`);
      if (res.data && res.data.order) {
        setOrder(res.data.order);
        if (res.data.order.productName?.toLowerCase().includes("apple")) {
          setAssignForm((prev) => ({ ...prev, brandName: "Apple", category: "Electronics" }));
        }
      }
    } catch (err) {
      console.error("Fetch order detail error:", err);
      setError("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsAssigning(true);
      setError("");
      setAssignSuccess("");

      const res = await API.post(`/orders/${id}/assign-product`, assignForm);
      if (res.data && res.data.product) {
        setAssignSuccess(
          `✓ Physical Product ${res.data.product.productId} successfully assigned to Order! Unique QR code generated.`
        );
        fetchOrderDetails();
      }
    } catch (err) {
      console.error("Assign product error:", err);
      setError(err.response?.data?.message || "Failed to assign product to order.");
    } finally {
      setIsAssigning(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs font-mono text-[#94A3B8]">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4 font-mono">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
        <div className="text-base font-bold text-white">Order Not Found</div>
        <p className="text-xs text-[#94A3B8]">{error || "The requested order ID does not exist."}</p>
        <Link to="/orders" className="inline-block px-4 py-2 bg-[#111821] text-cyan-400 rounded border border-[#1E293B] text-xs">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/orders"
        className="inline-flex items-center space-x-2 text-xs font-mono text-[#94A3B8] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Orders List</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold font-mono text-cyan-400">{order.orderId}</span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              {order.status}
            </span>
          </div>
          <h1 className="text-lg font-bold text-white">{order.productName}</h1>
          <div className="text-xs text-[#94A3B8] font-mono">
            Customer: {order.customerName} • Date: {new Date(order.orderDate).toLocaleDateString()}
          </div>
        </div>

        <div className="flex gap-2">
          {order.assignedProducts && order.assignedProducts.length > 0 && (
            <Link
              to={`/scan?id=${order.assignedProducts[0].productId || order.assignedProducts[0]}`}
              className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#070A0F] font-bold text-xs font-mono flex items-center space-x-2 transition-all shadow-sm"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan Product</span>
            </Link>
          )}
        </div>
      </div>

      {assignSuccess && (
        <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-start space-x-2 font-mono">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{assignSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Order & Customer Information */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-[#1E293B] pb-3">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Customer Information</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded bg-[#111821] border border-[#1E293B] flex justify-between">
                <span className="text-[#94A3B8]">Customer Name:</span>
                <span className="text-white font-bold">{order.customerName}</span>
              </div>

              <div className="p-3 rounded bg-[#111821] border border-[#1E293B] flex justify-between">
                <span className="text-[#94A3B8]">Contact / Phone:</span>
                <span className="text-white">{order.customerContact}</span>
              </div>

              <div className="p-3 rounded bg-[#111821] space-y-1 border border-[#1E293B]">
                <span className="text-[#94A3B8] block">Delivery Address:</span>
                <span className="text-slate-200 block font-sans">{order.customerAddress}</span>
              </div>

              <div className="p-3 rounded bg-[#111821] border border-[#1E293B] flex justify-between">
                <span className="text-[#94A3B8]">Expected Delivery:</span>
                <span className="text-cyan-300">
                  {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : "3 Business Days"}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Physical Products List */}
          <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-[#1E293B] pb-3">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Assigned Physical Product Item</span>
            </h3>

            {order.assignedProducts && order.assignedProducts.length > 0 ? (
              <div className="space-y-3">
                {order.assignedProducts.map((prod) => (
                  <div key={prod._id || prod} className="p-4 rounded-lg bg-[#111821] border border-cyan-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-white">{prod.productName || order.productName}</div>
                        <div className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
                          Product ID: {prod.productId || prod}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {prod.currentStage || "ASSIGNED"}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-[#94A3B8] space-y-1">
                      <div>Serial Number: <span className="text-slate-200">{prod.serialNumber || "SN-AUTO-ASSIGNED"}</span></div>
                      <div>Batch: <span className="text-slate-200">{prod.batchNumber || "BATCH-2026-A1"}</span></div>
                      <div>Current Location: <span className="text-cyan-300">{prod.currentLocation || "Warehouse"}</span></div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <Link
                        to={`/products/${prod.productId || prod}`}
                        className="px-3 py-1.5 rounded bg-[#0D121A] hover:bg-[#1E293B] text-xs font-mono text-cyan-400 border border-[#1E293B] inline-flex items-center space-x-1"
                      >
                        <span>Product Page & Timeline</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      <Link
                        to={`/products/${prod.productId || prod}/qr`}
                        className="px-3 py-1.5 rounded bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-bold text-xs font-mono inline-flex items-center space-x-1"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>Print Box QR</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center rounded bg-[#111821] border border-[#1E293B] space-y-2">
                <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto" />
                <div className="text-xs font-mono font-bold text-amber-400">NO PHYSICAL PRODUCT ASSIGNED</div>
                <p className="text-[11px] text-[#94A3B8]">
                  Assign an individual physical unit from the warehouse inventory on the right to generate its unique QR code.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Physical Product Assignment Form */}
        <div className="lg:col-span-6">
          <div className="bg-[#0D121A] p-6 rounded-xl border border-cyan-500/40 space-y-5 shadow-2xl relative">
            <div className="border-b border-[#1E293B] pb-3 space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Assign Physical Product & Generate QR</span>
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Assign unique Serial Number and Batch to generate ONE unique QR code for this individual box.
              </p>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300 block">Serial Number (Unique Box ID):</label>
                <input
                  type="text"
                  value={assignForm.serialNumber}
                  onChange={(e) => setAssignForm({ ...assignForm, serialNumber: e.target.value })}
                  placeholder="e.g. SN-S21FE-928374 (leave blank for auto)"
                  className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 block">Batch Number:</label>
                  <input
                    type="text"
                    value={assignForm.batchNumber}
                    onChange={(e) => setAssignForm({ ...assignForm, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 block">Brand Name:</label>
                  <input
                    type="text"
                    value={assignForm.brandName}
                    onChange={(e) => setAssignForm({ ...assignForm, brandName: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 block">IMEI / Unique Identifier:</label>
                  <input
                    type="text"
                    value={assignForm.imei}
                    onChange={(e) => setAssignForm({ ...assignForm, imei: e.target.value })}
                    placeholder="e.g. 359821098234123"
                    className="w-full px-3 py-2 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 block">Warehouse Location:</label>
                  <input
                    type="text"
                    value={assignForm.warehouse}
                    onChange={(e) => setAssignForm({ ...assignForm, warehouse: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAssigning}
                className="w-full py-3.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
              >
                <QrCode className="w-4 h-4" />
                <span>{isAssigning ? "Assigning Product..." : "Assign Product & Generate Unique QR"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
