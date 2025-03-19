/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        lavender: '#9370DB',
        'lavender-light': '#E6E6FA',
        'lavender-dark': '#7B68EE',
        skyblue: '#87CEEB',
        'skyblue-light': '#F0F8FF',
        'skyblue-dark': '#00BFFF',
        mint: '#98FB98',
        'mint-light': '#F0FFF0',
        'mint-dark': '#3CB371',
        darkbg: '#1A1A1A',
        softpink: {
          light: '#FFDDF4',
          DEFAULT: '#FFBBDD',
          dark: '#FFC0CB',
        },
        lightbg: '#F8FAFC',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dots-pattern': 'url("/patterns/dots.svg")',
        'waves-pattern': 'url("/patterns/waves.svg")',
        'abstract-pattern': 'url("/patterns/abstract.svg")',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
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
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
} 