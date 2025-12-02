/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pure colors
        black: '#000000',
        white: '#FFFFFF',

        // Gray scale (comprehensive)
        gray: {
          50: '#F9FAFB',   // Lightest gray (backgrounds)
          100: '#F3F4F6',  // Very light gray
          200: '#E5E7EB',  // Light gray (borders)
          300: '#D1D5DB',  // Medium-light gray
          400: '#9CA3AF',  // Medium gray
          500: '#6B7280',  // True gray (text secondary)
          600: '#4B5563',  // Medium-dark gray
          700: '#374151',  // Dark gray (text primary)
          800: '#1F2937',  // Very dark gray
          900: '#111827',  // Almost black
        },
      },

      // Remove all gradient definitions
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #111827 0%, #000000 100%)',
        'gradient-light': 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)',
      },

      // Shadows with gray tones
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
