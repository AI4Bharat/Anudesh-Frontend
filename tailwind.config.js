/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/ui/pages/chat/chat.js',
    './src/app/ui/pages/home/home.js',
    './src/app/ui/pages/login/login.js',
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