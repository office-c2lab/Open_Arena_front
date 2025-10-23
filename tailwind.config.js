/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      fontSize: {
        // 데스크탑 폰트 크기
        'heading-1': ['36px', '44px'],
        'heading-2': ['24px', '36px'],
        'heading-3': ['20px', '26px'],
        'body-large': ['16px', '24px'],
        'body-medium': ['14px', '20px'],
        'body-small': ['12px', '18px'],
      },
      fontWeight: {
        300: '300',
        500: '500',
        700: '700',
      },
    },
  },
  plugins: [],
};

{
  /* <span className="body-small font-700 ">예시</span>; */
}
