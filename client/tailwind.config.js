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
        // Remap indigo and blue utilities to premium luxury orange so interactive
        // elements across pages automatically adopt the luxury orange aesthetic
        indigo: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12"
        },
        blue: {
          50: "#fff8f1",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12"
        },
        sky: {
          50: "#fffaf5",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12"
        },
        // Cortexis Solution Hub — luxury palette (Dark Blue + Orange + Crisp White)
        brand: {
          navy: {
            50: "#f0f4f8",
            100: "#d9e2ec",
            200: "#bcccdc",
            300: "#9fb3c8",
            400: "#627d98",
            500: "#102a43",
            600: "#0b1a30",
            700: "#0a1426",
            800: "#070e1e",
            900: "#040813",
            DEFAULT: "#070e1e"
          },
          orange: {
            50: "#fff7ed",
            100: "#ffedd5",
            200: "#fed7aa",
            300: "#fdba74",
            400: "#fb923c",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c",
            DEFAULT: "#f97316",
            signal: "#ff6b00"
          },
          gold: { 300: "#fed7aa", 400: "#fdba74", 500: "#fb923c", 600: "#f97316", DEFAULT: "#fb923c" },
          steel: { 300: "#fed7aa", 400: "#fb923c", 500: "#f97316", 600: "#ea580c" },
          blue: { 400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c" },
          indigo: { 500: "#f97316", 600: "#ea580c", 700: "#c2410c" },
          sky: { 400: "#fdba74", 500: "#fb923c" },
          cyan: { 400: "#fb923c" },
          accent: { DEFAULT: "#f97316", soft: "#fb923c" },
          magenta: "#ea580c",
          ink: { DEFAULT: "#0f172a", soft: "#1e293b", surface: "#ffffff", raised: "#ffffff" }
        }
      },
      fontFamily: {
        sans: ["Space Grotesk", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"]
      },
      boxShadow: {
        card: "0 2px 4px rgba(0,0,0,0.02), 0 8px 24px rgba(15,23,42,0.06)",
        cardLg: "0 4px 8px rgba(0,0,0,0.03), 0 16px 36px rgba(249,115,22,0.14)",
        glow: "0 10px 32px rgba(249,115,22,0.35), 0 4px 14px rgba(234,88,12,0.25)"
      },
      borderRadius: { smd: "10px", mdx: "14px", lgx: "16px" },
      backgroundImage: {
        "grad-hero": "linear-gradient(135deg, #ff6b00, #f97316, #ea580c)",
        "grad-accent": "linear-gradient(135deg, #ea580c, #f97316, #fdba74)",
        "grad-brand": "linear-gradient(135deg, #070e1e, #0a1426, #0f2744)"
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
