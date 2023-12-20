/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/home/page.js',
    './src/app/login/page.js',
  ],
  theme: {
    extend: {
      colors: {
        "orange-dark": "#ee6633",
        "orange-light": "#edc9bc"
      }
    },
  },
  plugins: [],
}