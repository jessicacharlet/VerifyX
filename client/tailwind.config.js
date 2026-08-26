/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#05070D",
          surface: "#0B111B",
          card: "#101722",
          border: "#1D2938",
        },
        cyan: {
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
        },
        teal: {
          400: "#2dd4bf",
          500: "#14b8a6",
        },
        blue: {
          400: "#60a5fa",
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
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
