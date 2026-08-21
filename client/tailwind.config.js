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
        // Remap the default blue/sky/indigo scales to the corporate navy
        // palette so every existing utility (bg-blue-*, via-sky-*,
        // from-indigo-*) becomes navy/steel instead of purple — no per-file
        // edits needed. Same trick the cosmic theme used, different target.
        blue: { 50: "#eef4fb", 100: "#d7e6f5", 200: "#b0cceb", 300: "#7fabdb", 400: "#4a86c4", 500: "#2b6ba8", 600: "#1d5488", 700: "#17426c", 800: "#123354", 900: "#0d2440" },
        indigo: { 50: "#eef3fa", 100: "#d6e3f2", 200: "#adc6e4", 300: "#7ea3d0", 400: "#4f7db5", 500: "#2f6098", 600: "#234b79", 700: "#1b3b60", 800: "#152e4b", 900: "#101f38" },
        sky: { 50: "#eef6fb", 100: "#d5eaf5", 200: "#a9d3ea", 300: "#74b6d9", 400: "#3f95c2", 500: "#1f79a8", 600: "#166087", 700: "#134d6c", 800: "#113d56", 900: "#0e3145" },
        // Cortexis Solution Hub — corporate navy & gold
        brand: {
          gold: { 300: "#e2c07a", 400: "#d3a244", 500: "#c8922e", 600: "#b07f24", DEFAULT: "#c8922e" },
          navy: { 500: "#17426c", 600: "#123354", 700: "#0d2440", 800: "#0a1b32", 900: "#071426" },
          steel: { 300: "#7fabdb", 400: "#4a86c4", 500: "#2b6ba8", 600: "#1d5488" },
          orange: { 400: "#e8964a", 500: "#d97b2b", 600: "#bd6620", signal: "#d97b2b" },
          blue: { 400: "#4a86c4", 500: "#2b6ba8", 600: "#1d5488", 700: "#17426c" },
          indigo: { 500: "#234b79", 600: "#1b3b60", 700: "#152e4b" },
          sky: { 400: "#7fabdb", 500: "#4a86c4" },
          cyan: { 400: "#3f95c2" },
          accent: { DEFAULT: "#2b6ba8", soft: "#4a86c4" },
          magenta: "#4a86c4",
          ink: { DEFAULT: "#071426", soft: "#0a1b32", surface: "#0e2340", raised: "#132c4d" }
        }
      },
      fontFamily: {
        sans: ["Space Grotesk", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"]
      },
      boxShadow: {
        card: "0 1px 1px rgba(0,0,0,0.02), 0 8px 24px rgba(17,24,39,0.06)",
        cardLg: "0 2px 6px rgba(0,0,0,0.04), 0 16px 36px rgba(17,24,39,0.12)",
        glow: "0 10px 40px rgba(13,36,64,0.35), 0 6px 20px rgba(200,146,46,0.16)"
      },
      borderRadius: { smd: "10px", mdx: "14px", lgx: "16px" },
      backgroundImage: {
        "grad-hero": "linear-gradient(90deg, #17426c, #2b6ba8)",
        "grad-accent": "linear-gradient(90deg, #b07f24, #d3a244)",
        "grad-brand": "linear-gradient(90deg, #0d2440, #17426c, #2b6ba8, #4a86c4)"
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
