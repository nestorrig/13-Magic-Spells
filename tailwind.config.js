/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#6B1E7B",
          200: "#9c4dab",
          300: "#ffadff",
        },
        accent: {
          100: "#FFD700",
          200: "#917800",
        },
        text: {
          100: "#FFFFFF",
          200: "#e0e0e0",
        },
        bg: {
          100: "#1A1A1A",
          200: "#292929",
          300: "#404040",
        },
      },
      fontFamily: {
        "bona-nova": ['"Bona Nova SC"', "serif"],
        rokkitt: ["Rokkitt", "serif"],
      },
    },
  },
  plugins: [],
};
