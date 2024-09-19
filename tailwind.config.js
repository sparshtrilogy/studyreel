/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}",
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#E6F0FF',
          500: '#4A90E2',
          600: '#3B5998',
        },
        secondary: {
          100: '#F3F4F6',
          500: '#6B7280',
        },
        black: {
          45: 'rgba(0, 0, 0, 0.45)',
          DEFAULT: '#000000',
        },
      },
      fontFamily: {
        sans: ['Archivo', 'sans-serif'],
        archivo: ['Archivo', 'sans-serif'],
      },
      fontSize: {
        '14': '14px',
        '20': '20px',
        '32': '32px',
      },
      fontWeight: {
        medium: 500,
        semibold: 600,
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

