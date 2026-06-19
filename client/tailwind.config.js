/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  safelist: [
    "bg-grad-hero",
    "bg-grad-accent",
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
        brand: {
          blue: { 600: "#2563eb", 700: "#1d4ed8" },
          indigo: { 700: "#3730a3" },
          sky: { 400: "#60a5fa" },
          orange: { 500: "#f97316" }
        }
      },
      boxShadow: {
        card: "0 1px 1px rgba(0,0,0,0.02), 0 8px 24px rgba(17,24,39,0.06)",
        cardLg: "0 2px 6px rgba(0,0,0,0.04), 0 16px 36px rgba(17,24,39,0.12)"
      },
      borderRadius: { smd: "10px", mdx: "14px", lgx: "16px" },
      backgroundImage: {
        "grad-hero": "linear-gradient(90deg, #3730a3, #1d4ed8)",
        "grad-accent": "linear-gradient(90deg, #f97316, #2563eb)"
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography")
  ]
};
