import React from "react";
import { Link } from "react-router-dom";
import { Shield, Github, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-purple-500/20 bg-slate-950/90 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Tagline */}
        <div className="flex items-center space-x-3 text-center md:text-left">
          <div className="w-7 h-7 rounded-md bg-purple-600 flex items-center justify-center text-white">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-extrabold text-white">VeriMark</span>
            <span className="text-xs text-slate-500 block">Blockchain-Based Product Authentication System</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-300">
          <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
          <a href="#project-overview" className="hover:text-purple-400 transition-colors">Project</a>
          <Link to="/verify" className="hover:text-purple-400 transition-colors">Verification</Link>
          <a href="#technology-stack" className="hover:text-purple-400 transition-colors">Technology</a>
          <a
            href="https://github.com/jessicacharlet/VerifyX"
            target="_blank"
            rel="noreferrer"
            className="hover:text-purple-400 transition-colors flex items-center space-x-1"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-slate-500 font-mono text-center md:text-right">
          © {new Date().getFullYear()} VeriMark. Built for Technical Portfolio.
        </div>
      </div>
    </footer>
  );
}
