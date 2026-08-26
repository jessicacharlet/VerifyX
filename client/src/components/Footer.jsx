import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#070A0F] border-t border-[#202A36] py-6 px-4 font-mono text-xs text-[#8B97A7]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-[#06b6d4] flex items-center justify-center text-[#070A0F]">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-xs">VerifyX</span>
          <span className="text-[10px] text-[#8B97A7]">
            • Blockchain-Based Product Authentication System
          </span>
        </div>

        <div className="flex items-center space-x-4 text-[11px]">
          <Link to="/products" className="hover:text-white transition-colors">
            Products
          </Link>
          <Link to="/verify" className="hover:text-white transition-colors">
            Verify
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
      </div>
    </footer>
  );
}
