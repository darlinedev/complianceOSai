import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1B3A6B",
          dark: "#0F2447", // Navy foncé de la sidebar
        },
        accent: {
          DEFAULT: "#2E6BE6", // Bleu électrique
          hover: "#1a53c5",
        },
        surface: "#F8F9FB",
        card: "#FFFFFF",
        border: "#E5E8EE",
        text: {
          primary: "#0F172A",
          secondary: "#64748B",
          muted: "#94A3B8",
        },
        risk: {
          HIGH: "#DC2626",
          LIMITED: "#F59E0B",
          MINIMAL: "#16A34A",
          PROHIBITED: "#991B1B",
        },
        status: {
          COMPLIANT: "#16A34A",
          IN_PROGRESS: "#F59E0B",
          NON_COMPLIANT: "#DC2626",
          DRAFT: "#94A3B8",
        },
        alert: {
          CRITICAL: "#DC2626",
          WARNING: "#F59E0B",
          INFO: "#2E6BE6",
        },
      },
      borderRadius: {
        badge: "6px",
        card: "12px",
        modal: "12px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.06)",
        raised: "0 4px 12px rgba(15, 23, 42, 0.08)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
