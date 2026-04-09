/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c3aed',
          light: '#9f67ff',
          dark: '#5b21b6',
        },
        accent: {
          DEFAULT: '#00d9ff',
          light: '#67eaff',
          dark: '#0097b3',
        },
        dark: {
          DEFAULT: '#0f0f1a',
          100: '#1a1a2e',
          200: '#16213e',
          300: '#1f2040',
          400: '#252547',
          500: '#2d2d5e',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          hover: 'rgba(255,255,255,0.1)',
          border: 'rgba(255,255,255,0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        equalizer: 'equalizer 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        equalizer: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 217, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.4)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
};
