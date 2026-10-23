/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: "#060913",
          900: "#0B0F19",
          850: "#0E1524",
          800: "#131C31",
          700: "#1E2C4B",
          600: "#2B3D66",
          500: "#3E558A",
        },
        gold: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
      },
      boxShadow: {
        glow: "0 0 20px -3px rgba(139, 92, 246, 0.4)",
        "glow-cyan": "0 0 20px -3px rgba(6, 182, 212, 0.4)",
        "glow-gold": "0 0 20px -3px rgba(245, 158, 11, 0.4)",
      },
      keyframes: {
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out forwards",
        "fade-in": "fade-in 0.25s ease-out forwards",
      },
    },
  },
  plugins: [],
};
