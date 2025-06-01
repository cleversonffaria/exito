import { colors } from "./src/constants/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ["Epilogue", "sans-serif"],
      },
    },
  },
  plugins: [],
};
