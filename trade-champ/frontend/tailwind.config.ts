import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#05070f",
        card: "rgba(18, 24, 38, 0.65)",
        neon: "#22d3ee",
        glow: "#7c3aed"
      },
      boxShadow: {
        neon: "0 0 35px rgba(34, 211, 238, 0.25)",
        purple: "0 0 25px rgba(124, 58, 237, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
