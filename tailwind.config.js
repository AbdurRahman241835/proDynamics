/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",   // if using App Router
    "./node_modules/preline/preline.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [], // ❌ remove preline/plugin here
};
