/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ocean:   { DEFAULT: '#0B4F6C', light: '#1A7FA8', dark: '#062F41' },
        sand:    { DEFAULT: '#E8D5A3', light: '#F5EDD0', dark: '#C4A96B' },
        palm:    { DEFAULT: '#2D6A4F', light: '#52B788', dark: '#1B4332' },
        coral:   { DEFAULT: '#E07B54', light: '#F4A27D', dark: '#B85C38' },
        lagoon:  { DEFAULT: '#48CAE4', light: '#90E0EF', dark: '#0096C7' },
        ivory:   '#FAF8F2',
        slate:   '#2C3E50',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body:    ['system-ui', '-apple-system', 'sans-serif'],
        mono:    ['ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'wave-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230B4F6C' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'slide-in':   'slideIn 0.5s ease-out forwards',
        'wave':       'wave 8s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        wave:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
};
