/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { 500: '#667eea', 600: '#5568d3', 700: '#4c51bf' },
        secondary: { 500: '#764ba2', 600: '#68409a', 700: '#5a3689' },
        success: { 500: '#10b981', 600: '#059669' },
        error: { 500: '#ef4444', 600: '#dc2626' },
        warning: { 500: '#f59e0b', 600: '#d97706' },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      }
    },
  },
  plugins: [],
}
