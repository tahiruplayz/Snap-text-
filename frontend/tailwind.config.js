/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        surface: { DEFAULT: '#0a0f1e', 2: '#0f172a', 3: '#1e293b', 4: '#334155' },
        brand: {
          blue: '#3b82f6', bluehv: '#2563eb',
          purple: '#8b5cf6', cyan: '#06b6d4',
        },
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
        'float':    'float 6s ease-in-out infinite',
        'glow':     'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },                                    to: { opacity: 1 } },
        slideUp: { from: { transform: 'translateY(16px)', opacity: 0 },     to: { transform: 'translateY(0)', opacity: 1 } },
        slideIn: { from: { transform: 'translateX(-16px)', opacity: 0 },    to: { transform: 'translateX(0)', opacity: 1 } },
        float:   { '0%,100%': { transform: 'translateY(0)' },               '50%': { transform: 'translateY(-10px)' } },
        glow:    { from: { boxShadow: '0 0 20px rgba(59,130,246,0.3)' },    to: { boxShadow: '0 0 40px rgba(139,92,246,0.4)' } },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.12) 0%, transparent 60%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'blue-purple':   'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      },
    },
  },
  plugins: [],
};
