import { colors } from "./src/constants/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily: {
        Epilogue: ["Epilogue"],
        WorkSans: ["WorkSans"],
      },
      minHeight: {
        screen: "100vh",
        full: "100%",
      },
      spacing: {
        safe: "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};
