/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          cardHover: '#F1F5F9',
          navy: '#0F172A',
          navyDark: '#0A101D',
          cyan: '#0096C7',
          cyanLight: '#E0F2FE',
          cyanHover: '#0284C7',
          text: '#0F172A',
          muted: '#475569',
          border: '#E2E8F0',
          borderLight: '#CBD5E1',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
