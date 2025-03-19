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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
