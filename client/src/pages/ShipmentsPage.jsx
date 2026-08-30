import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Truck, MapPin, Search, ArrowRight, Clock, CheckCircle } from "lucide-react";
import API from "../services/api";

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchShipments();
  }, [statusFilter]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (statusFilter !== "ALL") params.status = statusFilter;

      const res = await API.get("/shipments", { params });
      if (res.data && res.data.shipments) {
        setShipments(res.data.shipments);
      }
    } catch (err) {
      console.error("Fetch shipments error:", err);
      setError("Failed to fetch logistics shipments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
            <Truck className="w-3.5 h-3.5" />
            <span>LOGISTICS & SHIPMENT TRACKING</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Active Shipments & In-Transit Hubs</h1>
          <p className="text-xs text-[#94A3B8]">
            Track dispatches, courier tracking numbers, and hub scans across the supply chain network.
          </p>
        </div>

        <Link
          to="/scan"
          className="px-5 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
        >
          <MapPin className="w-4 h-4" />
          <span>Scan Transit Checkpoint</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="flex gap-2 text-xs">
        {["ALL", "DISPATCHED", "IN_TRANSIT", "DELIVERED"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded transition-all ${
              statusFilter === st
                ? "bg-cyan-400 text-[#070A0F] font-bold"
                : "bg-[#0D121A] text-[#94A3B8] hover:text-white border border-[#1E293B]"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Shipments Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#94A3B8]">Loading shipment tracking data...</div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">{error}</div>
      ) : shipments.length === 0 ? (
        <div className="p-12 text-center bg-[#0D121A] rounded-xl border border-[#1E293B] space-y-2">
          <Truck className="w-10 h-10 text-[#64748B] mx-auto" />
          <div className="text-sm font-bold text-white">No Shipments Found</div>
          <p className="text-xs text-[#94A3B8]">No active shipments match the selected filter.</p>
        </div>
      ) : (
        <div className="bg-[#0D121A] rounded-xl border border-[#1E293B] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111821] text-[#94A3B8] uppercase border-b border-[#1E293B]">
                <tr>
                  <th className="px-5 py-3.5">Tracking Number</th>
                  <th className="px-5 py-3.5">Product ID</th>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Courier</th>
                  <th className="px-5 py-3.5">Current Location</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] text-slate-200">
                {shipments.map((shp) => (
                  <tr key={shp._id} className="hover:bg-[#111821]/60 transition-colors">
                    <td className="px-5 py-4 font-bold text-cyan-400">{shp.trackingNumber}</td>
                    <td className="px-5 py-4 font-bold text-white">{shp.productId}</td>
                    <td className="px-5 py-4 text-[#94A3B8]">{shp.orderId}</td>
                    <td className="px-5 py-4">{shp.courier}</td>
                    <td className="px-5 py-4 font-semibold text-cyan-300">{shp.currentLocation}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                        {shp.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/products/${shp.productId}`}
                        className="text-cyan-400 hover:underline font-bold inline-flex items-center space-x-1"
                      >
                        <span>View Product</span>
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
