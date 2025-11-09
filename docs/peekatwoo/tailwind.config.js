/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber': {
          'bg': '#0a0a0f',
          'bg-light': '#141420',
          'primary': '#00f5ff',
          'secondary': '#0066cc', 
          'accent': '#ff00ff',
          'green': '#39ff14',
          'yellow': '#ffff00',
          'grid': '#1a1a2e'
        }
      },
      fontFamily: {
        'oxanium': ['Oxanium', 'monospace'],
      },
      backgroundImage: {
        'grid': `linear-gradient(rgba(26, 26, 46, 0.3) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(26, 26, 46, 0.3) 1px, transparent 1px)`
      },
      backgroundSize: {
        'grid': '20px 20px'
      }
    },
  },
  plugins: [],
}

