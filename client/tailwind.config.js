/** @type {import('tailwindcss').Config} */

// Burnished copper: Cortexis orange, deepened until it reads as a material
// rather than a signal.
// Sage stands in for emerald and green, so "free" and "success" keep their
// meaning without a saturated green breaking the warm palette.
const sage = {
  50: "#F2F5F0",
  100: "#E3EADF",
  200: "#C9D6C3",
  300: "#A9BCA1",
  400: "#8FA886",
  500: "#62805A",
  600: "#4B6845",
  700: "#3B5337",
  800: "#2F412C",
  900: "#253323",
  950: "#18221A"
};

const copper = {
  50: "#FBF5EF",
  100: "#F5E6D8",
  200: "#EACBB0",
  300: "#DCA883",
  400: "#C9845A",
  500: "#B8612E",
  600: "#9A4A22",
  700: "#7E3B1B",
  800: "#632E16",
  900: "#4A2211",
  950: "#2E150A"
};

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
        // The orange, indigo, blue and sky scales are all remapped to one
        // burnished copper. Pages across the site were written against those
        // utility names, so remapping here restyles every one of them at once
        // instead of editing a hundred components. 600 is the text-safe step
        // (5.9:1 on ivory); 500 is for large type and fills only (4.1:1).
        orange: copper,
        indigo: copper,
        blue: copper,
        sky: copper,
        amber: copper,
        emerald: sage,
        green: sage,
        ivory: { DEFAULT: "#FAF8F4", paper: "#FFFFFF", sand: "#F2EDE4", deep: "#E9E2D6" },
        ink: { DEFAULT: "#16130F", 2: "#3D3833", 3: "#5E574F", 4: "#6E665E" },
        brand: {
          navy: {
            50: "#F2EDE4", 100: "#E9E2D6", 200: "#D8CFC2", 300: "#B9AFA3", 400: "#6E665E",
            500: "#3D3833", 600: "#2A2520", 700: "#1F1B17", 800: "#16130F", 900: "#0E0C0A",
            DEFAULT: "#16130F"
          },
          orange: { ...copper, DEFAULT: copper[500], signal: copper[600] },
          gold: { 300: copper[200], 400: copper[300], 500: copper[400], 600: copper[500], DEFAULT: copper[400] },
          steel: { 300: copper[200], 400: copper[400], 500: copper[500], 600: copper[600] },
          blue: { 400: copper[400], 500: copper[500], 600: copper[600], 700: copper[700] },
          indigo: { 500: copper[500], 600: copper[600], 700: copper[700] },
          sky: { 400: copper[300], 500: copper[400] },
          cyan: { 400: copper[400] },
          accent: { DEFAULT: copper[600], soft: copper[400] },
          magenta: copper[600],
          ink: { DEFAULT: "#16130F", soft: "#3D3833", surface: "#FFFFFF", raised: "#FFFFFF" }
        }
      },
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        serif: ["Instrument Serif", "ui-serif", "Georgia", "serif"],
        display: ["Instrument Serif", "ui-serif", "Georgia", "serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        // Layered from one light source rather than a single wide blur.
        card: "0 1px 1px rgba(22,19,15,0.03), 0 2px 4px rgba(22,19,15,0.03), 0 8px 20px rgba(22,19,15,0.04)",
        cardLg: "0 1px 1px rgba(22,19,15,0.04), 0 4px 8px rgba(22,19,15,0.04), 0 16px 32px rgba(22,19,15,0.06), 0 32px 64px rgba(22,19,15,0.05)",
        glow: "0 1px 1px rgba(22,19,15,0.04), 0 6px 16px rgba(22,19,15,0.08)"
      },
      borderRadius: { smd: "10px", mdx: "16px", lgx: "20px" },
      backgroundImage: {
        "grad-hero": `linear-gradient(135deg, ${copper[600]}, ${copper[700]})`,
        "grad-accent": `linear-gradient(135deg, ${copper[600]}, ${copper[500]})`,
        "grad-brand": "linear-gradient(135deg, #16130F, #2A2520)"
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
