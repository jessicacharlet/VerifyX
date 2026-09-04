import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Plus, Search, CheckCircle, FileCode, Lock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="space-y-16 py-12 font-sans">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-6">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Digital Asset Authenticator</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
          Confirm the Authenticity of Your Digital Files
        </h1>

        <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
          VerifyX helps you register original digital files, store secure authenticity records, and check whether a file is genuine or modified.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/assets/register"
            className="w-full sm:w-auto px-7 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#070A0F] font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Register New Asset</span>
          </Link>

          <Link
            to="/verify"
            className="w-full sm:w-auto px-7 py-3 rounded-lg bg-[#0D121A] hover:bg-[#111821] text-white border border-[#1E293B] font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Verify an Asset</span>
          </Link>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D121A] p-8 rounded-xl border border-[#1E293B] space-y-6 shadow-xl">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">How VerifyX Works</h2>
            <p className="text-xs text-[#94A3B8]">Simple 3-step digital asset verification process</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs pt-2">
            <div className="p-5 rounded-lg bg-[#111821] border border-[#1E293B] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                01
              </div>
              <h3 className="text-sm font-semibold text-white">Register</h3>
              <p className="text-[#94A3B8] leading-relaxed">
                Upload the original file and create its secure authenticity record.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#111821] border border-[#1E293B] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                02
              </div>
              <h3 className="text-sm font-semibold text-white">Verify</h3>
              <p className="text-[#94A3B8] leading-relaxed">
                Upload the file whenever you need to check it.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#111821] border border-[#1E293B] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                03
              </div>
              <h3 className="text-sm font-semibold text-white">Compare</h3>
              <p className="text-[#94A3B8] leading-relaxed">
                VerifyX compares the file with its original record and reports the result.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
