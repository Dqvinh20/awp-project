import { scopedPreflightStyles } from 'tailwindcss-scoped-preflight';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '475px',
        ...defaultTheme.screens,
      },
      backgroundImage: {
        'auth-bg': "url('./assets/mountain.jpg')",
      },
    },
  },
  plugins: [
    scopedPreflightStyles({
      cssSelector: '.twp',
    }),
  ],
};
