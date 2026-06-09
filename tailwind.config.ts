/** @format */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#135292",
          steel: "#42849E",
          mint: "#C6E5DD",
          "mint-green": "#9BD4BA",
          gray: "#E6E9EE",
          "dark-hover": "#0e3d6e",
        },
      },
    },
  },
  plugins: [],
};
export default config;
