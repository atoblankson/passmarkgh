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
          blue: "#3B82F6",
          darkBlue: "#2563EB",
          black: "#000000",
          white: "#FFFFFF",
          lightGrey: "#F1F5F9",
          muted: "#64748B",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["'Sora'", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
        highlight: "0 0 0 1px rgba(59, 130, 246, 0.5), 0 8px 24px -4px rgba(59, 130, 246, 0.2)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.04)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s infinite linear",
        float: "float 4s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        fadeInUp: "fadeInUp 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
