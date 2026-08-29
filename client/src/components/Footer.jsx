import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ExternalLink, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#070A0F] border-t border-[#1E293B] py-5 px-4 font-mono text-xs text-[#94A3B8]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-2.5">
          <div className="w-5 h-5 rounded bg-cyan-400 flex items-center justify-center text-[#070A0F]">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-xs tracking-tight">VERIFYX</span>
          <span className="text-[#64748B] text-[11px]">
            • Digital Authenticity & Verification Platform
          </span>
        </div>

        {/* Center/Right: Quick Navigation Links */}
        <div className="flex items-center space-x-5 text-[11px]">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/products" className="hover:text-white transition-colors">
            Products
          </Link>
          <Link to="/verify" className="hover:text-white transition-colors">
            Verify Asset
          </Link>
          <a
            href="https://github.com/jessicacharlet/VerifyX"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center space-x-1"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-[10px] text-[#64748B] flex items-center space-x-1">
          <Lock className="w-3 h-3 text-cyan-500/70" />
          <span>© {new Date().getFullYear()} VerifyX Security. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
