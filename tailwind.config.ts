import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ember: "#f0441a",
        emberDark: "#b72a13",
        emberSoft: "#ff6938",
        graphite: "#070809",
        graphiteSoft: "#0e1014",
        graphiteEdge: "#16191f",
        paper: "#f4efe6",
        paperDim: "#cfc8bb",
        champagne: "#f3e4c8",
        signal: "#16d4bd"
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"]
      },
      boxShadow: {
        glow: "0 0 80px rgba(240, 68, 26, 0.32)",
        ember: "0 28px 80px rgba(240, 68, 26, 0.28)",
        panel: "0 30px 90px rgba(0, 0, 0, 0.5)",
        innerGlow: "inset 0 0 0 1px rgba(255,255,255,0.06)"
      },
      animation: {
        spinSlow: "spin 18s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite"
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      }
    }
  },
  plugins: []
};

export default config;
