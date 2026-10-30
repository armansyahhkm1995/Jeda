export const COLORS = {
  // Sage Green scale (Zen, calm, grounding)
  sage: {
    50: '#F0F5F0',
    100: '#E0EBDF',
    200: '#C2D8BF',
    300: '#A3C49F',
    400: '#85B17F',
    500: '#6B9E66', // Primary Brand Color
    600: '#527B4E',
    700: '#3D5B3A',
    800: '#283D27',
    900: '#141E13',
  },
  // Warm Off-White / Cream (Zen backgrounds)
  cream: {
    50: '#FDFCFB',
    100: '#FAF8F5', // Card / Sheet Background
    200: '#F5F0EB', // Main Screen Background
    300: '#EDE5DC', // Border / Divider
    400: '#E0D4C7',
  },
  // Earth text tones
  earth: {
    100: '#F2EBE1',
    200: '#E8DDD0',
    300: '#CBBFB0',
    400: '#A8998A', // Subtitle / Placeholder
    500: '#7D6E61', // Secondary text
    600: '#695C51',
    700: '#53473D',
    800: '#3E342B', // Main dark body text
    900: '#241D16', // Title text
  },
  // Emotion intensity levels (muted colors)
  emotion: {
    ringan: '#8FB487', // Muted soft green
    sedang: '#DEB352', // Muted amber
    kuat: '#CF7356',   // Muted terracotta / warm clay
  },
  // Functional
  status: {
    success: '#6B9E66',
    error: '#C2574F',
    missed: '#CF7356',
    activeDot: '#6B9E66',
  },
  // Exact Figma/Design tokens for Auth screens
  brand: {
    primary: '#2D5A38',      // Forest Pine Green
    primaryDark: '#23462C',
    bg: '#F7F4EE',           // Warm Paper / Cream Background
    card: '#FFFFFF',
    cardMuted: '#EFECE4',    // Botanical card background
    chipBg: '#EBF3EA',       // Quick Help Pill Background
    chipBorder: '#BACFBA',   // Quick Help Pill Border
    border: '#E2DCD2',       // Clean subtle input border
    textDark: '#1E2522',     // Editorial dark text
    textMuted: '#6D756E',    // Editorial secondary text
    textPlaceholder: '#A2AAA4',
    error: '#D32F2F',
    errorBorder: '#E53935',
    errorBg: '#FDF2F2',
  },
  overlay: 'rgba(20, 20, 20, 0.45)',
  transparent: 'transparent',
  white: '#FFFFFF',
} as const;

export const SERIF_FONT = 'Georgia, serif';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const RADIUS = {
  sm: 8,
  md: 14,
  card: 20,
  sheet: 28,
  pill: 9999,
} as const;

export const TYPOGRAPHY = {
  h1: { fontSize: 28, lineHeight: 36, fontWeight: '700' as const },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '600' as const },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  body: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  captionMedium: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const },
} as const;
