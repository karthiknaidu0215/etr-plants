import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ETR Plants brand palette
        forest: {
          50: "#f0f7f4",
          100: "#dcede5",
          200: "#bbdacc",
          300: "#8ec0a9",
          400: "#5da082",
          500: "#3a8463",
          600: "#2d6a4f",
          700: "#1a4731",
          800: "#163d29",
          900: "#0d2818",
          950: "#071510",
        },
        cream: {
          50: "#fdfcf9",
          100: "#faf7f2",
          200: "#f5eee0",
          300: "#ede2cc",
          400: "#e0d0b0",
          500: "#d4be94",
        },
        earth: {
          300: "#c4956a",
          400: "#b07848",
          500: "#8b5e3c",
          600: "#6b4828",
          700: "#4a3019",
        },
        accent: {
          400: "#74c69d",
          500: "#52b788",
          600: "#40916c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
      },
      backgroundImage: {
        "hero-pattern": "linear-gradient(135deg, #0d2818 0%, #1a4731 50%, #2d6a4f 100%)",
        "card-hover": "linear-gradient(135deg, #1a4731 0%, #2d6a4f 100%)",
      },
      boxShadow: {
        card: "0 2px 16px rgba(26, 71, 49, 0.08)",
        "card-hover": "0 8px 32px rgba(26, 71, 49, 0.16)",
        premium: "0 20px 60px rgba(26, 71, 49, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
