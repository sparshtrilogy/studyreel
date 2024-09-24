/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}",
    "./styles/**/*.css",
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      fontSmoothing: {
        antialiased: [
          '-webkit-font-smoothing: antialiased',
          '-moz-osx-font-smoothing: grayscale',
        ],
      },
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
        'custom-bg': '#F4F2FA',
        'custom-blue': '#3D75EA',
      },
      fontFamily: {
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        archivo: ['Archivo', 'sans-serif'],
      },
      fontSize: {
        '14': '14px',
        '18': '18px',
        '20': '20px',
        '32': '32px',
        '9': '9px',
        '12': '12px',
      },
      fontWeight: {
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontFamily: 'Archivo, sans-serif',
              fontSize: '32px',
              fontWeight: '500',
              textAlign: 'center',
            },
            h3: {
              fontFamily: 'Archivo, sans-serif',
              fontSize: '20px',
              fontWeight: '500',
              textAlign: 'center',
            },
            h4: {
              fontFamily: 'Archivo, sans-serif',
              fontSize: '18px',
              fontWeight: '700',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  variants: {
    fontSmoothing: ['responsive'],
  },
}

