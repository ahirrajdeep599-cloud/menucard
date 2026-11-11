/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        luxury: {
          black: '#090909',
          dark: '#090909',
          charcoal: '#151515',
          card: '#151515',
          surface: '#1c1c1e',
          border: 'rgba(217, 173, 82, 0.2)',
          gold: '#D9AD52',
          amber: '#FFB91F',
          cream: '#FFF1D0',
          lightGold: '#FFF1D0',
        }
      },
      boxShadow: {
        'glow-gold': '0 0 28px -4px rgba(217, 173, 82, 0.32)',
        'glow-amber': '0 0 35px -5px rgba(255, 185, 31, 0.4)',
        'card-3d': '0 16px 36px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(217, 173, 82, 0.14)',
        'card-3d-hover': '0 24px 48px -12px rgba(0, 0, 0, 0.95), 0 0 24px -6px rgba(217, 173, 82, 0.28), 0 0 0 1px rgba(217, 173, 82, 0.45)',
        'btn-3d': '0 6px 0 #9E7322, 0 12px 24px rgba(217, 173, 82, 0.35)',
        'btn-3d-active': '0 2px 0 #9E7322, 0 4px 10px rgba(217, 173, 82, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-3d': 'float3d 5s ease-in-out infinite',
        'pulse-gold': 'pulseGold 4s ease-in-out infinite',
        'shimmer-sweep': 'shimmerSweep 3.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float3d: {
          '0%, 100%': { transform: 'translateY(0px) rotateX(0deg)' },
          '50%': { transform: 'translateY(-7px) rotateX(2deg)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.06)' },
        },
        shimmerSweep: {
          '0%': { transform: 'translateX(-120%) skewX(-20deg)' },
          '45%, 100%': { transform: 'translateX(220%) skewX(-20deg)' },
        }
      }
    },
  },
  plugins: [],
}
