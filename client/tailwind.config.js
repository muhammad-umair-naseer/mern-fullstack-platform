/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  safelist: [
    "bg-grad-hero",
    "bg-grad-accent",
    "bg-grad-brand",
    "btn-primary",
    "card",
    "focus-ring"
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", md: "1.25rem", lg: "2rem", xl: "2.5rem", "2xl": "3rem" },
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1320px" }
    },
    extend: {
      colors: {
        // Cortexis Solution Hub brand palette (from the brain/circuit logo)
        brand: {
          orange: { 400: "#fb8c3c", 500: "#f4701f", 600: "#e85d10" },
          blue: { 400: "#3b9eea", 500: "#2575d6", 600: "#2563eb", 700: "#1d4ed8" },
          indigo: { 500: "#5b3aa8", 600: "#4c2a86", 700: "#3730a3" },
          sky: { 400: "#60a5fa", 500: "#38bdf8" },
          cyan: { 400: "#29abe2" }
        }
      },
      fontFamily: {
        sans: ["Poppins", "Segoe UI", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 1px 1px rgba(0,0,0,0.02), 0 8px 24px rgba(17,24,39,0.06)",
        cardLg: "0 2px 6px rgba(0,0,0,0.04), 0 16px 36px rgba(17,24,39,0.12)",
        glow: "0 10px 40px rgba(76,42,134,0.25), 0 6px 20px rgba(244,112,31,0.18)"
      },
      borderRadius: { smd: "10px", mdx: "14px", lgx: "16px" },
      backgroundImage: {
        "grad-hero": "linear-gradient(90deg, #4c2a86, #2563eb)",
        "grad-accent": "linear-gradient(90deg, #f4701f, #2563eb)",
        "grad-brand": "linear-gradient(120deg, #4c2a86 0%, #2563eb 45%, #29abe2 70%, #f4701f 100%)"
      },
      keyframes: {
        "gradient-pan": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" }
        },
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(40px, -50px) scale(1.12)" },
          "66%": { transform: "translate(-30px, 30px) scale(0.92)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" }
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { "background-position": "-200% 0" },
          "100%": { "background-position": "200% 0" }
        }
      },
      animation: {
        "gradient-pan": "gradient-pan 12s ease infinite",
        blob: "blob 18s ease-in-out infinite",
        "blob-slow": "blob 26s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 6s linear infinite"
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography")
  ]
};
