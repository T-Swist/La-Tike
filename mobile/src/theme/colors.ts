// La-Tike Brand Colors
export const BRAND_COLORS = {
  orange: '#f97316',
  orangeLight: '#fb923c',
  orangeDark: '#ea580c',
  black: '#000000',
  white: '#ffffff',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// Light Theme
export const LIGHT_THEME = {
  primary: BRAND_COLORS.orange,
  primaryLight: BRAND_COLORS.orangeLight,
  primaryDark: BRAND_COLORS.orangeDark,
  
  background: BRAND_COLORS.white,
  surface: BRAND_COLORS.gray[50],
  card: BRAND_COLORS.white,
  
  text: BRAND_COLORS.black,
  textSecondary: BRAND_COLORS.gray[600],
  textMuted: BRAND_COLORS.gray[500],
  
  border: BRAND_COLORS.gray[200],
  borderLight: BRAND_COLORS.gray[100],
  
  input: BRAND_COLORS.gray[100],
  inputBorder: BRAND_COLORS.gray[200],
  placeholder: BRAND_COLORS.gray[400],
  
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Dark Theme
export const DARK_THEME = {
  primary: BRAND_COLORS.orange,
  primaryLight: BRAND_COLORS.orangeLight,
  primaryDark: BRAND_COLORS.orangeDark,
  
  background: '#0a0a0a',
  surface: '#1a1a1a',
  card: '#1f1f1f',
  
  text: BRAND_COLORS.white,
  textSecondary: BRAND_COLORS.gray[300],
  textMuted: BRAND_COLORS.gray[400],
  
  border: BRAND_COLORS.gray[700],
  borderLight: BRAND_COLORS.gray[800],
  
  input: '#2a2a2a',
  inputBorder: BRAND_COLORS.gray[700],
  placeholder: BRAND_COLORS.gray[500],
  
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  shadow: 'rgba(0, 0, 0, 0.5)',
};

export type Theme = typeof LIGHT_THEME;
