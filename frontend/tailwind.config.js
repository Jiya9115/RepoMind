/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F0F7FF",
          page: "#EFF8FF",
          secondary: "#F8FAFC",
          card: "#FFFFFF",
          hover: "#F1F5F9",
          muted: "#E2E8F0",
          subtle: "#EBF3FE",
        },
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          light: "#60A5FA",
          dark: "#1E40AF",
          soft: "#EFF6FF",
        },
        navy: {
          DEFAULT: "#0F172A",
          light: "#1E293B",
          muted: "#475569",
          subtle: "#64748B",
        },
        border: {
          DEFAULT: "#E2E8F0",
          subtle: "#E2E8F0",
          blue: "#DBEAFE",
          light: "#F1F5F9",
          focus: "#2563EB",
        },
        accent: {
          DEFAULT: "#2563EB",
          light: "#3B82F6",
          dark: "#1D4ED8",
          glow: "rgba(37, 99, 235, 0.12)",
        },
        severity: {
          critical: "#EF4444",
          high: "#F97316",
          medium: "#F59E0B",
          low: "#3B82F6",
          info: "#64748B",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Menlo", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)",
        card: "0 4px 20px -2px rgba(37, 99, 235, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)",
        glow: "0 0 20px -5px rgba(37, 99, 235, 0.3)",
        float: "0 10px 30px -5px rgba(37, 99, 235, 0.15)",
      },
    },
  },
  plugins: [],
}
