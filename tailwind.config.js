/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        bold: '700',
      },
      fontSize: {
        // === Headings ===
        'h1-700': ['36px', { lineHeight: '44px', fontWeight: '700' }],
        'h1-500': ['36px', { lineHeight: '44px', fontWeight: '500' }],
        'h1-300': ['36px', { lineHeight: '44px', fontWeight: '300' }],

        'h2-700': ['24px', { lineHeight: '36px', fontWeight: '700' }],
        'h2-500': ['24px', { lineHeight: '36px', fontWeight: '500' }],
        'h2-300': ['24px', { lineHeight: '36px', fontWeight: '300' }],

        'h3-700': ['20px', { lineHeight: '26px', fontWeight: '700' }],
        'h3-500': ['20px', { lineHeight: '26px', fontWeight: '500' }],
        'h3-300': ['20px', { lineHeight: '26px', fontWeight: '300' }],

        // === Body ===
        'body-lg-700': ['16px', { lineHeight: '24px', fontWeight: '700' }],
        'body-lg-500': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'body-lg-300': ['16px', { lineHeight: '24px', fontWeight: '300' }],

        'body-md-700': ['14px', { lineHeight: '20px', fontWeight: '700' }],
        'body-md-500': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'body-md-300': ['14px', { lineHeight: '20px', fontWeight: '300' }],

        'body-sm-700': ['12px', { lineHeight: '18px', fontWeight: '700' }],
        'body-sm-500': ['12px', { lineHeight: '18px', fontWeight: '500' }],
        'body-sm-300': ['12px', { lineHeight: '18px', fontWeight: '300' }],
      },
    },
  },
  plugins: [],
};
