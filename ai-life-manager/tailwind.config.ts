import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Fraunces", "serif"],
      },
      colors: {
        sage: {
          50: "#e8f5ec",
          100: "#c8e6d0",
          200: "#a3d4b1",
          400: "#4a7c59",
          600: "#2d6a4f",
          800: "#1b4332",
        },
        sky: {
          50: "#e8f0fb",
          100: "#c5d9f5",
          400: "#3a7bd5",
          600: "#1d5aa8",
          800: "#0d3b72",
        },
        amber: {
          50: "#fdf3e3",
          100: "#f9ddb0",
          400: "#c97d2a",
          600: "#9e5f15",
          800: "#6b3e08",
        },
        rose: {
          50: "#fceef1",
          100: "#f7ccd4",
          400: "#c4556a",
          600: "#9e3349",
          800: "#6b1e30",
        },
      },
      borderRadius: {
        "2xl": "14px",
        "3xl": "18px",
      },
    },
  },
  plugins: [],
};
export default config;
