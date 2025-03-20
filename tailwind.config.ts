import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        futuraPTBold: "var(--font-futura-pt-bold)",
        futuraPTLight: "var(--font-futura-pt-light)",
        futuraPTMedium: "var(--font-futura-pt-medium)",
        futuraPTBook: "var(--font-futura-pt-book)",
        futuraPTHeavy: "var(--font-futura-pt-heavy)",
      },
      colors: {
        cream: "#FDEAD8",
        "dark-blue": "#084784",
        "vivid-red": "#F87060",
        "dark-gray": "#2D3142",
        "fluo-green": "#47E5BC",
        "nav-overlay-color": "rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
} satisfies Config;
