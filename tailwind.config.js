/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    },

    colors: {
      common: {
        white: 'var(--white)',
        black: 'var(--black)',
        purble: 'var(--purble)',
        warn: '#ff9966',
        gray: {
          dark: 'var(--dark-gray)',
          light: 'var(--light-gray)',
          medium: 'var(--medium-gray)'
        },
        danger: '#f57'
      },
      bg: {
        primary: 'var(--background-primary)',
        drawer: '#80808080'
      },
      txt: {
        primary: 'var(--txt-color-primary)',
        gray: 'var(--txt-color-gray)'
      }
    },
    gradientColorStops: {
      button: {
        primary: 'var(--button-gradient)'
      }
    },

    screens: {
      phone: '520px',
      miniTablet: '720px',
      tablet: '920px',
      laptop: '1140px',
      desktop: '1440px'
    }
  },

  plugins: []
}
