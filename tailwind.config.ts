import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Univers "Blush Romance & Gold" — clair, chaleureux, romantique
        night: "#FFF6F1", // Fond de page (blush crème)
        surface: "#FFFFFF", // Cartes & sections
        romance: "#DB2E5B", // Accent principal (rose framboise passion)
        gold: "#B58433", // Accent secondaire (or profond, lisible sur clair)
        cream: "#FFFFFF", // Surfaces claires / texte sur fond coloré
        ink: "#2B1A20", // Texte principal (prune profond chaleureux)
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        "float-slow": "float-slow 6s ease-in-out infinite",
        shimmer: "shimmer 4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
