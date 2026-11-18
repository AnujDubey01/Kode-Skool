/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          darkNavy: '#183B56',
          navy: '#414D8E',
          indigo: '#424F90',
          blue: '#5D74BD',
          sky: '#169BDF',
          ice: '#6EAAF3',
          bgLight: '#F2F2F2',
          bgDark: '#0D0D0D'
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        mitr: ['Mitr', 'sans-serif']
      },
      keyframes: {
        typingBounce: {
          '0%, 80%, 100%': { transform: 'scale(0.4)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        typingBounce: 'typingBounce 1.4s infinite ease-in-out both'
      }
    },
  },
  plugins: [],
}
