/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#070A0F",
          surface: "#0D121A",
          elevated: "#111821",
          border: "#202A36",
        },
        text: {
          main: "#F5F7FA",
          muted: "#8B97A7",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
        blue: {
          500: "#3b82f6",
          600: "#2563eb",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        red: {
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "14px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
