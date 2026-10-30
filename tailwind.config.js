/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // NativeWind v4: content points to all RN files
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ── Jeda Zen Color System ─────────────────────────────────
        // Primary: Sage Green (calm, grounding)
        sage: {
          50:  '#F0F5F0',
          100: '#E0EBDF',
          200: '#C2D8BF',
          300: '#A3C49F',
          400: '#85B17F',
          500: '#6B9E66', // Primary sage
          600: '#527B4E',
          700: '#3D5B3A',
          800: '#283D27',
          900: '#141E13',
        },
        // Warm Off-White (Zen backgrounds)
        cream: {
          50:  '#FDFCFB',
          100: '#FAF8F5',
          200: '#F5F0EB',  // Main background
          300: '#EDE5DC',
          400: '#E0D4C7',
        },
        // Muted earth tones
        earth: {
          100: '#F2EBE1',
          200: '#E8DDD0',
          300: '#CBBFB0',
          400: '#A8998A',
          500: '#7D6E61',
        },
        // Semantic states (muted, not harsh)
        emotion: {
          ringan: '#A8C5A0',  // Muted green — calm
          sedang: '#E8C97A',  // Muted amber — moderate
          kuat:   '#D4896A',  // Muted terracotta — intense
        },
        // UI functional
        error:   '#C0392B',
        success: '#6B9E66',
        overlay: 'rgba(20, 20, 20, 0.5)',
      },
      fontFamily: {
        // Will be populated after font assets are loaded
        sans:    ['System'],
        heading: ['System'],
      },
      borderRadius: {
        'card': '20px',
        'pill': '100px',
        'sheet': '28px',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top':    'env(safe-area-inset-top)',
      },
    },
  },
  plugins: [],
};
