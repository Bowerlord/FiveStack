import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0a12",
          900: "#0f1020",
          800: "#171a2e",
          700: "#1f2340",
        },
        neon: {
          cyan: "#37f0d8",
          blue: "#5b8cff",
          violet: "#9a6bff",
          gold: "#ffcf5c",
          pink: "#ff5c93",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px -6px rgba(91,140,255,0.55)",
      },
    },
  },
  plugins: [],
};

export default config;
