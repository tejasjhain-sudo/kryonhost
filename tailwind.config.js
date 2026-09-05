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
        heading: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', '"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 150, 199, 0.25)',
        'premium': '0 10px 30px -10px rgba(0, 150, 199, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 12px 28px -6px rgba(15, 23, 42, 0.08), 0 0 16px -2px rgba(0, 150, 199, 0.15)',
      }
    },
  },
  plugins: [],
}
