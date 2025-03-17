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
        futuraPt: "var(--font-futura-pt)",
      },
      colors: {
        cream: "#FDEAD8",
        "dark-blue": "#084784",
        "vivid-red": "#F87060",
        "dark-gray": "#2D3142",
        "fluo-green": "#47E5BC",
      },
    },
  },
  plugins: [],
} satisfies Config;
