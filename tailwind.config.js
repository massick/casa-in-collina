/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./things-to-do.html",
    "./contact.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#fdf4f6",
          100: "#fbe8ec",
          200: "#f7d1db",
          300: "#f0a9bc",
          400: "#e67896",
          500: "#d94d73",
          600: "#c5325d",
          700: "#8E2141",
          800: "#7a1d38",
          900: "#661a31",
        },
        secondary: {
          50: "#f5fbe9",
          100: "#e9f6cf",
          200: "#d4eda5",
          300: "#b7e070",
          400: "#9dd147",
          500: "#8BC53F",
          600: "#6a9b2e",
          700: "#507527",
          800: "#405d23",
          900: "#374f21",
        },
        accent: {
          50: "#fefde8",
          100: "#fefcc3",
          200: "#fef68a",
          300: "#feeb47",
          400: "#D1D83A",
          500: "#c4c926",
          600: "#a19f1d",
          700: "#79761a",
          800: "#625d1b",
          900: "#534e1c",
        },
      },
    },
  },
  plugins: [],
};
