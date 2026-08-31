import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserCheck, ShieldCheck, FileCheck, Calendar, Mail, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function ProfilePage() {
  const { user } = useAuth();
  const [userAssets, setUserAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAssets();
  }, []);

  const fetchUserAssets = async () => {
    try {
      setLoading(true);
      const res = await API.get("/assets");
      if (res.data && res.data.assets) {
        setUserAssets(res.data.assets);
      }
    } catch (err) {
      console.error("Fetch profile assets error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 font-sans">
      <div className="bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-[#1E293B] shadow-xl space-y-6">
        <div className="border-b border-[#1E293B] pb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{user ? user.name : "Enterprise User Profile"}</h1>
              <p className="text-xs text-[#94A3B8]">{user ? user.email : "user@example.com"}</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/30 capitalize">
            {user ? user.role : "User"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-[#111821] border border-[#1E293B] space-y-1">
            <span className="text-[#94A3B8] block">Full Name:</span>
            <span className="text-white font-semibold">{user ? user.name : "Authorized User"}</span>
          </div>

          <div className="p-4 rounded-lg bg-[#111821] border border-[#1E293B] space-y-1">
            <span className="text-[#94A3B8] block">Registered Email:</span>
            <span className="text-slate-200 font-mono">{user ? user.email : "user@example.com"}</span>
          </div>
        </div>

        {/* User Assets Summary */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-[#1E293B] pb-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>Registered Digital Assets ({userAssets.length})</span>
          </h3>

          {loading ? (
            <div className="p-6 text-center text-xs text-[#94A3B8]">Loading user assets...</div>
          ) : userAssets.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#94A3B8]">No assets registered under this account yet.</div>
          ) : (
            <div className="space-y-2 text-xs">
              {userAssets.slice(0, 5).map((ast) => (
                <div key={ast._id} className="p-3 rounded-lg bg-[#111821] border border-[#1E293B] flex justify-between items-center">
                  <div>
                    <span className="font-mono text-cyan-400 font-semibold mr-2">{ast.assetId}</span>
                    <span className="text-white">{ast.assetName}</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-300">
                    {ast.sha256Hash.substring(0, 16)}...
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
