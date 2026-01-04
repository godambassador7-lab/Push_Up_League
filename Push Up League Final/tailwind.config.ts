import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0a0e27',
        'dark-card': '#0f1535',
        'dark-border': '#1a2451',
        'glass-dark': 'rgba(15, 21, 53, 0.7)',
        'glass-light': 'rgba(26, 36, 81, 0.5)',
        accent: '#00bcd4',
        'accent-light': '#33d4e8',
        'electric-blue': '#0099ff',
        'athletic-blue': '#00a8cc',
        'cyan-bright': '#00e5ff',
        'blue-glow': '#1e40af',
        gold: '#ffd700',
        'rank-bronze': '#cd7f32',
        'rank-silver': '#c0c0c0',
        'rank-gold': '#ffd700',
        'rank-mythic': '#9d4edd',
        success: '#10b981',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'coin-drop': 'coinDrop 0.8s ease-out',
        'rank-glow': 'rankGlow 1s ease-in-out infinite',
        'flame-flicker': 'flameFlicker 0.6s ease-in-out infinite',
        'glass-shimmer': 'glassShimmer 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'shine': 'shine 2s infinite',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '12px',
      },
      scale: {
        '98': '0.98',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 188, 212, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(0, 188, 212, 0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        coinDrop: {
          '0%': { transform: 'translateY(-20px)', opacity: '1' },
          '100%': { transform: 'translateY(100px)', opacity: '0' },
        },
        rankGlow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(0, 188, 212, 0.5)' },
          '50%': { textShadow: '0 0 20px rgba(0, 188, 212, 1)' },
        },
        flameFlicker: {
          '0%, 100%': { opacity: '1', transform: 'scaleY(1)' },
          '50%': { opacity: '0.8', transform: 'scaleY(0.95)' },
        },
        glassShimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '200%' },
        },
      },
    },
  },
  plugins: [],
}

export default config
