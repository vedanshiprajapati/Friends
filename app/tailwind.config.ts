import type { Config } from "tailwindcss";

// --color-light-cream: #fcf8f2;
// --color-cream: #f7efe5;
// --color-lavender: #e2bfd9;
// --color-purple: #c8a1e0;
// --color-deep-purple: #674188;
// --color-purple-light-1: #e2d4f2;
// --color-purple-light-2: #f0e8fa;

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lightCream: "var(--color-light-cream)",
        cream: "var(--color-cream)",
        lavender: "var(--color-lavender)",
        lightPurple2: "var(--color-purple-light-2)",
        lightPurple1: "var(--color-purple-light-1)",
        purple: "var(--color-purple)",
        deepPurple: "var(--color-deep-purple)",
      },
    },
  },
  plugins: [],
} satisfies Config;
