import { scopedPreflightStyles } from 'tailwindcss-scoped-preflight';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
