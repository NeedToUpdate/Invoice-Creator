/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#C1D9EB",
          200: "#84B3D7",
          300: "#468DC3",
          400: "#3C83B9",
          500: "#2F6690",
          600: "#326D9A",
          700: "#28577B",
          800: "#1E415C",
          900: "#142C3E",
        },
      },
    },
  },
  plugins: [],
};
