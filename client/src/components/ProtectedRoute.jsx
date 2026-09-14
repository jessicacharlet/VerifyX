import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#070A0F] text-slate-400 font-sans">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-white">Verifying Session Authorization...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = Boolean(user && token);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: location.pathname.includes("register")
            ? "Sign in to register and manage your digital assets."
            : "Please sign in to access protected VerifyX features.",
        }}
        replace
      />
    );
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user.role || "").toLowerCase();
    const isAllowed = allowedRoles.some((r) => r.toLowerCase() === userRole);
    if (!isAllowed) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
