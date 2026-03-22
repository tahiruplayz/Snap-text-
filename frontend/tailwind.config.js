/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        slate: {
          950: '#020617',
        },
        surface: {
          DEFAULT: '#0f172a',
          2: '#1e293b',
          3: '#273549',
          4: '#334155',
        },
        brand: {
          blue:   '#3b82f6',
          bluehv: '#2563eb',
          purple: '#8b5cf6',
          cyan:   '#06b6d4',
        },
      },
      animation: {
        'fade-in':   'fadeIn 0.2s ease-out',
        'slide-in':  'slideIn 0.25s ease-out',
        'slide-up':  'slideUp 0.25s ease-out',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },                          to: { opacity: 1 } },
        slideIn: { from: { transform: 'translateX(-12px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
        slideUp: { from: { transform: 'translateY(12px)',  opacity: 0 }, to: { transform: 'translateY(0)',  opacity: 1 } },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        glass: '0 4px 24px 0 rgba(0,0,0,0.4)',
        glow:  '0 0 20px rgba(59,130,246,0.25)',
      },
    },
  },
  plugins: [],
};
