import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: "var(--color-cream)",
        lavender: "var(--color-lavender)",
        purple: "var(--color-purple)",
        deepPurple: "var(--color-deep-purple)",
      },
    },
  },
  plugins: [],
} satisfies Config;
