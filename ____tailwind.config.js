/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#BB86FC',
        primaryVariant: '#3700B3',
        secondary: '#03DAC6',
        bgMain: '#121212', 
        surface: '#121212',
        error: '#CF6679',
        onPrimary: '#000000',
        onSecondary: '#000000',
        onBackground: '#FFFFFF',
        onSurface: '#FFFFFF',
        onError: '#000000',
      },
    },
  },
  plugins: [],
}
