import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#070B14] border-t border-[#22304A] py-5 px-4 font-sans text-xs text-[#94A3B8]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-2.5">
          <div className="w-5 h-5 rounded bg-sky-400 flex items-center justify-center text-[#070B14]">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-xs tracking-tight">VerifyX</span>
          <span className="text-[#64748B] text-[11px]">
            • Digital Asset Authentication & Verification
          </span>
        </div>

        {/* Minimal Links */}
        <div className="flex items-center space-x-5 text-[11px]">
          <Link to="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link to="/assets" className="hover:text-white transition-colors">
            Assets
          </Link>
          <Link to="/verify" className="hover:text-white transition-colors">
            Verify Asset
          </Link>
          <Link to="/verification-history" className="hover:text-white transition-colors">
            History
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-[10px] text-[#64748B] flex items-center space-x-1">
          <Lock className="w-3 h-3 text-sky-500/70" />
          <span>© {new Date().getFullYear()} VerifyX. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
