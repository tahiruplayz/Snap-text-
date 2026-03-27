/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        base:    '#0b1220',
        surface: { 1: '#111827', 2: '#1a2332', 3: '#1f2937', 4: '#2a3441', 5: '#374151' },
        blue:    { 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb' },
        purple:  { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
        cyan:    { 400: '#22d3ee', 500: '#06b6d4' },
      },
      backgroundImage: {
        'grad-btn':  'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        'grad-hero': 'radial-gradient(ellipse at 30% 40%, rgba(59,130,246,0.18) 0%, transparent 55%), radial-gradient(ellipse at 75% 20%, rgba(139,92,246,0.14) 0%, transparent 55%)',
        'grad-card': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.35s ease-out',
        'slide-in':   'slideIn 0.3s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 },                                 to: { opacity: 1 } },
        slideUp:   { from: { transform: 'translateY(20px)', opacity: 0 },  to: { transform: 'translateY(0)', opacity: 1 } },
        slideIn:   { from: { transform: 'translateX(-16px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
        glowPulse: { '0%,100%': { opacity: 0.4 }, '50%': { opacity: 0.8 } },
        float:     { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      boxShadow: {
        'glow-blue':   '0 0 30px rgba(59,130,246,0.25)',
        'glow-purple': '0 0 30px rgba(139,92,246,0.2)',
        'card':        '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':  '0 8px 40px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};
