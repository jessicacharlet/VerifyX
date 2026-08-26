import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Github, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#05070D] border-t border-[#1D2938] mt-16 text-[#8B98AA] text-xs">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-[#06b6d4] flex items-center justify-center text-[#05070D]">
              <ShieldCheck className="w-4 h-4 font-bold" />
            </div>
            <span className="font-extrabold text-white text-sm tracking-tight">VerifyX</span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              v1.0
            </span>
          </div>

          <p className="text-center text-[11px] font-mono">
            Cryptographic Product Authenticity Platform • Ethereum Smart Contract Ledger & SHA-256 Hashing
          </p>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/jessicacharlet/VerifyX"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-slate-300 hover:text-cyan-400 transition-colors font-mono"
            >
              <Github className="w-3.5 h-3.5" />
              <span>VerifyX GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#1D2938]/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 font-mono">
          <div>© {new Date().getFullYear()} VerifyX System. All rights reserved.</div>
          <div className="flex items-center space-x-4">
            <Link to="/verify" className="hover:text-slate-300">Public Verification Portal</Link>
            <Link to="/products" className="hover:text-slate-300">Catalog</Link>
            <Link to="/login" className="hover:text-slate-300">Manufacturer Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
