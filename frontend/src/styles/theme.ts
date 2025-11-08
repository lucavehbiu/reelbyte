/**
 * ReelByte Design System - Sophisticated & Trustworthy
 * Premium color palette for Amsterdam's finest influencer-restaurant platform
 */

export const colors = {
  // Primary Brand - Deep Navy Blue (Trust, Authority, Professionalism)
  primary: {
    DEFAULT: '#1A2F4B',
    50: '#E8EDF3',
    100: '#D1DBE7',
    200: '#A3B7CF',
    300: '#7593B7',
    400: '#476F9F',
    500: '#1A2F4B',
    600: '#15263C',
    700: '#101C2D',
    800: '#0A131E',
    900: '#05090F',
  },

  // Secondary Accent - Muted Gold (Premium, Sophistication, Warmth)
  gold: {
    DEFAULT: '#B28E4D',
    50: '#F8F4EC',
    100: '#F1E9D9',
    200: '#E3D3B3',
    300: '#D5BD8D',
    400: '#C7A767',
    500: '#B28E4D',
    600: '#8E723E',
    700: '#6B552E',
    800: '#47391F',
    900: '#241C0F',
  },

  // Alternative Accent - Warm Copper
  copper: {
    DEFAULT: '#C48E66',
    50: '#F9F3ED',
    100: '#F3E7DB',
    200: '#E7CFB7',
    300: '#DBB793',
    400: '#CF9F6F',
    500: '#C48E66',
    600: '#9D7252',
    700: '#76553D',
    800: '#4E3929',
    900: '#271C14',
  },

  // Neutral Base - Soft Off-White (Clean, Spacious, Inviting)
  cream: {
    DEFAULT: '#FCFCF8',
    50: '#FFFFFF',
    100: '#FCFCF8',
    200: '#F8F8F8',
    300: '#F4F4F0',
    400: '#F0F0E8',
    500: '#ECECDF',
    600: '#E8E8D7',
    700: '#E0E0CB',
    800: '#D8D8BF',
    900: '#D0D0B3',
  },

  // Dark Neutral - Charcoal Grey (Readable, Refined)
  charcoal: {
    DEFAULT: '#333333',
    50: '#F5F5F5',
    100: '#E6E6E6',
    200: '#CCCCCC',
    300: '#B3B3B3',
    400: '#999999',
    500: '#808080',
    600: '#666666',
    700: '#4A4A4A',
    800: '#333333',
    900: '#1A1A1A',
  },

  // Tertiary Accent - Soft Sage Green (Growth, Balance, Subtle Vibrancy)
  sage: {
    DEFAULT: '#6E8B7C',
    50: '#F1F4F2',
    100: '#E3E9E5',
    200: '#C7D3CB',
    300: '#ABBDB1',
    400: '#8FA797',
    500: '#6E8B7C',
    600: '#586F63',
    700: '#42534A',
    800: '#2C3831',
    900: '#161C19',
  },

  // Alternative Tertiary - Dusty Teal
  teal: {
    DEFAULT: '#5C858C',
    50: '#EFF3F4',
    100: '#DFE7E9',
    200: '#BFCFD3',
    300: '#9FB7BD',
    400: '#7F9FA7',
    500: '#5C858C',
    600: '#4A6A70',
    700: '#375054',
    800: '#253538',
    900: '#121B1C',
  },

  // Utility Colors
  success: '#6E8B7C', // Sage green
  warning: '#B28E4D', // Muted gold
  error: '#8B4D4D',   // Muted burgundy (trust-worthy error color)
  info: '#5C858C',    // Dusty teal

  // Instagram Brand (for social integration)
  instagram: {
    gradient: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    purple: '#C13584',
    pink: '#E1306C',
    orange: '#F56040',
    yellow: '#FFDC80',
  },
} as const;

export const typography = {
  fonts: {
    display: '"Playfair Display", Georgia, serif', // Sophisticated headings
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', // Clean, modern body
    accent: '"Montserrat", sans-serif', // Premium accent font
  },

  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },
} as const;

export const spacing = {
  section: {
    xs: '2rem',   // 32px
    sm: '3rem',   // 48px
    md: '4rem',   // 64px
    lg: '6rem',   // 96px
    xl: '8rem',   // 128px
  },
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export const effects = {
  shadows: {
    subtle: '0 1px 3px 0 rgba(26, 47, 75, 0.1), 0 1px 2px 0 rgba(26, 47, 75, 0.06)',
    soft: '0 4px 6px -1px rgba(26, 47, 75, 0.1), 0 2px 4px -1px rgba(26, 47, 75, 0.06)',
    medium: '0 10px 15px -3px rgba(26, 47, 75, 0.1), 0 4px 6px -2px rgba(26, 47, 75, 0.05)',
    large: '0 20px 25px -5px rgba(26, 47, 75, 0.1), 0 10px 10px -5px rgba(26, 47, 75, 0.04)',
    xl: '0 25px 50px -12px rgba(26, 47, 75, 0.25)',
    gold: '0 10px 25px -5px rgba(178, 142, 77, 0.2)',
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  gradients: {
    primary: 'linear-gradient(135deg, #1A2F4B 0%, #2A4F6B 100%)',
    gold: 'linear-gradient(135deg, #B28E4D 0%, #C48E66 100%)',
    subtle: 'linear-gradient(180deg, #FCFCF8 0%, #F8F8F8 100%)',
    overlay: 'linear-gradient(180deg, rgba(26, 47, 75, 0) 0%, rgba(26, 47, 75, 0.8) 100%)',
  },
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  DEFAULT: '0.5rem', // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  full: '9999px',
} as const;

// Export theme object for easy consumption
export const theme = {
  colors,
  typography,
  spacing,
  effects,
  borderRadius,
} as const;

export default theme;
