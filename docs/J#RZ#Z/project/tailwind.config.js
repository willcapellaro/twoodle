/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        athletic: ['Athletic', 'sans-serif'],
      },
      colors: {
        chiefs: {
          primary: '#E31837',
          secondary: '#FFB81C',
        },
        eagles: {
          primary: '#004C54',
          secondary: '#A5ACAF',
        },
      },
    },
  },
  plugins: [],
};