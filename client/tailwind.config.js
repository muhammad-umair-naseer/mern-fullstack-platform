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
        // Remap the default blue/sky/indigo scales to the cosmic palette so
        // every existing utility (bg-blue-*, via-sky-*, from-indigo-*) becomes
        // purple/magenta instead of blue — no per-file edits needed.
        blue: { 50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95" },
        indigo: { 50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95" },
        sky: { 50: "#fdf4ff", 100: "#fae8ff", 200: "#f5d0fe", 300: "#f0abfc", 400: "#e879f9", 500: "#e056e5", 600: "#c026d3", 700: "#a21caf", 800: "#86198f", 900: "#701a75" },
        // Cortexis Solution Hub — cosmic brand palette
        brand: {
          orange: { 400: "#fb8c3c", 500: "#f97316", 600: "#e85d10", signal: "#f97316" },
          blue: { 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9" },
          indigo: { 500: "#6d28d9", 600: "#5b21b6", 700: "#4c1d95" },
          sky: { 400: "#c4b5fd", 500: "#a78bfa" },
          cyan: { 400: "#e056e5" },
          // cosmic accents (from reference design)
          accent: { DEFAULT: "#8b5cf6", soft: "#a78bfa" },
          magenta: "#e056e5",
          ink: { DEFAULT: "#07090f", soft: "#0c0f18", surface: "#11141e", raised: "#161a26" }
        }
      },
      fontFamily: {
        sans: ["Space Grotesk", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"]
      },
      boxShadow: {
        card: "0 1px 1px rgba(0,0,0,0.02), 0 8px 24px rgba(17,24,39,0.06)",
        cardLg: "0 2px 6px rgba(0,0,0,0.04), 0 16px 36px rgba(17,24,39,0.12)",
        glow: "0 10px 40px rgba(76,42,134,0.25), 0 6px 20px rgba(244,112,31,0.18)"
      },
      borderRadius: { smd: "10px", mdx: "14px", lgx: "16px" },
      backgroundImage: {
        "grad-hero": "linear-gradient(90deg, #8b5cf6, #e056e5)",
        "grad-accent": "linear-gradient(90deg, #f97316, #8b5cf6)",
        "grad-brand": "linear-gradient(90deg, #7B2D8B, #8b5cf6, #e056e5, #f97316)"
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
