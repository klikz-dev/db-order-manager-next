const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media',
  theme: {
    fontSize: {
      xs: ['10px', '1.4'],
      sm: ['12px', '1.4'],
      base: ['14px', '1.4'],
      lg: ['16px', '1.4'],
      xl: ['20px', '1.4'],
      '2xl': ['24px', '1.4'],
      '3xl': ['28px', '1.4'],
      '4xl': ['32px', '1.4'],
      '5xl': ['36px', '1.4'],
      '6xl': ['42px', '1.4'],
    },
    extend: {
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
