/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#090d16",
          900: "#0f172a",
        },
        purple: {
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
        },
        indigo: {
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
