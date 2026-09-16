import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Render Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#05070D] flex items-center justify-center px-4 font-sans text-slate-100">
          <div className="max-w-md w-full bg-[#0D1422] p-6 sm:p-8 rounded-xl border border-[#22304A] shadow-2xl space-y-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Something went wrong</h2>
              <p className="text-xs text-[#94A3B8]">
                An unexpected application rendering error occurred.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/30 text-left font-mono text-[11px] text-red-300 break-words max-h-32 overflow-y-auto">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-[#070B14] font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#111A2A] hover:bg-[#162238] border border-[#22304A] text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
