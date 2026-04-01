/**
 * Design System Constants
 * 
 * Centralized design tokens for consistent styling across the PandaGarde website.
 * These constants ensure visual consistency and make it easier to maintain the design system.
 * 
 * @see UI_UX_INCONSISTENCIES_REPORT.md for rationale and usage examples
 */

// ============================================================================
// TYPOGRAPHY
// ============================================================================

/**
 * Responsive typography scale using clamp() for fluid sizing
 * Usage: style={{ ...typography.h1 }}
 */
export const typography = {
  h1: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',      // 32px - 40px
    fontWeight: 700,
    lineHeight: 1.2
  },
  h2: {
    fontSize: 'clamp(1.875rem, 3vw, 2.25rem)', // 30px - 36px
    fontWeight: 700,
    lineHeight: 1.3
  },
  h3: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',      // 24px - 32px
    fontWeight: 600,
    lineHeight: 1.4
  },
  h4: {
    fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',   // 20px - 24px
    fontWeight: 600,
    lineHeight: 1.4
  },
  h5: {
    fontSize: 'clamp(1.125rem, 2vw, 1.25rem)', // 18px - 20px
    fontWeight: 600,
    lineHeight: 1.5
  },
  body: {
    fontSize: '1.125rem',  // 18px
    lineHeight: 1.75
  },
  bodySmall: {
    fontSize: '1rem',      // 16px
    lineHeight: 1.6
  },
  small: {
    fontSize: '0.875rem',  // 14px
    lineHeight: 1.5
  },
  tiny: {
    fontSize: '0.75rem',   // 12px
    lineHeight: 1.4
  }
} as const;

// ============================================================================
// SPACING
// ============================================================================

/**
 * Responsive spacing scale
 * Usage: style={{ padding: spacing.section.hero }}
 */
export const spacing = {
  section: {
    hero: 'clamp(4rem, 8vw, 6rem) 0',       // 64px - 96px vertical
    large: 'clamp(3rem, 6vw, 4rem) 0',      // 48px - 64px vertical
    standard: 'clamp(2rem, 4vw, 3rem) 0',   // 32px - 48px vertical
    compact: 'clamp(1.5rem, 3vw, 2rem) 0'   // 24px - 32px vertical
  },
  card: {
    large: '2rem',      // 32px
    standard: '1.5rem', // 24px
    compact: '1rem',    // 16px
    tight: '0.75rem'    // 12px
  },
  container: {
    horizontal: '1.5rem', // 24px (matches PageLayout)
    maxWidth: '1200px'
  }
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

/**
 * Consistent border radius values
 * Usage: style={{ borderRadius: borderRadius.card }}
 */
export const borderRadius = {
  card: '16px',      // Large cards, containers
  button: '12px',    // Buttons, interactive elements
  badge: '9999px',   // Pills, badges, fully rounded
  small: '8px',      // Small elements
  input: '8px'       // Form inputs
} as const;

// ============================================================================
// COLORS
// ============================================================================

/**
 * Color constants (prefer CSS variables for theming)
 * Usage: style={{ color: colors.primary }}
 * 
 * Note: For production, use CSS variables like 'var(--primary)'
 * These are provided as fallbacks or for specific use cases
 */
export const colors = {
  // Primary Brand Colors
  primary: '#1B5E20',
  primaryLight: '#2E7D32',
  primaryDark: '#0D4A0F',
  
  // Secondary Colors
  secondary: '#66BB6A',
  tertiary: '#81C784',
  
  // Accent Colors
  accent: '#D32F2F',
  accentLight: '#E57373',
  warning: '#F57C00',
  info: '#1976D2',
  
  // Gray Scale
  white: '#FFFFFF',
  gray100: '#FAFAFA',
  gray200: '#F5F5F5',
  gray300: '#EEEEEE',
  gray400: '#E0E0E0',
  gray500: '#BDBDBD',
  gray600: '#757575',
  gray700: '#424242',
  gray800: '#212121',
  gray900: '#000000',
  
  // Semantic Colors
  success: '#4CAF50',
  danger: '#DC3545',
  
  // Family Hub Theme
  familyHubPrimary: '#0D7377',
  familyHubAccent: '#F59E0B'
} as const;

/**
 * CSS Variable references (preferred approach)
 * Usage: style={{ color: cssVariables.primary }}
 */
export const cssVariables = {
  // Colors
  primary: 'var(--primary)',
  primaryLight: 'var(--primary-light)',
  primaryDark: 'var(--primary-dark)',
  secondary: 'var(--secondary)',
  tertiary: 'var(--tertiary)',
  accent: 'var(--accent)',
  warning: 'var(--warning)',
  info: 'var(--info)',
  
  // Grays
  white: 'var(--white)',
  light: 'var(--light)',
  gray100: 'var(--gray-100)',
  gray200: 'var(--gray-200)',
  gray300: 'var(--gray-300)',
  gray400: 'var(--gray-400)',
  gray500: 'var(--gray-500)',
  gray600: 'var(--gray-600)',
  gray700: 'var(--gray-700)',
  gray800: 'var(--gray-800)',
  gray900: 'var(--gray-900)',
  
  // Semantic
  success: 'var(--success)',
  danger: 'var(--danger)',
  cardColor: 'var(--card-color)',
  
  // Border Radius
  borderRadius: 'var(--border-radius)',
  borderRadiusLg: 'var(--border-radius-lg)',
  
  // Shadows
  shadowSm: 'var(--shadow-sm)',
  shadowMd: 'var(--shadow-md)',
  shadowLg: 'var(--shadow-lg)',
  shadowXl: 'var(--shadow-xl)',
  
  // Transitions
  transition: 'var(--transition)',
  bounce: 'var(--bounce)',
  wiggle: 'var(--wiggle)'
} as const;

// ============================================================================
// BUTTON STYLES
// ============================================================================

/**
 * Standard button styles
 * Usage: style={{ ...buttonStyles.primary }}
 */
export const buttonStyles = {
  primary: {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
    color: 'white',
    padding: '0.875rem 1.5rem',
    borderRadius: '12px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  secondary: {
    backgroundColor: 'white',
    color: '#1B5E20',
    border: '2px solid #1B5E20',
    padding: '0.875rem 1.5rem',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#1B5E20',
    border: '2px solid #1B5E20',
    padding: '0.875rem 1.5rem',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#1B5E20',
    border: 'none',
    padding: '0.875rem 1.5rem',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  // Size variations
  small: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem'
  },
  medium: {
    padding: '0.875rem 1.5rem',
    fontSize: '1rem'
  },
  large: {
    padding: '1rem 2rem',
    fontSize: '1.125rem'
  }
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

/**
 * Shadow presets
 * Usage: style={{ boxShadow: shadows.card }}
 */
export const shadows = {
  card: '0 4px 12px rgba(0, 0, 0, 0.15)',
  cardHover: '0 8px 25px rgba(0, 0, 0, 0.15)',
  button: '0 2px 8px rgba(0, 0, 0, 0.1)',
  buttonHover: '0 4px 12px rgba(0, 0, 0, 0.15)',
  elevated: '0 20px 40px rgba(0, 0, 0, 0.1)',
  none: 'none'
} as const;

// ============================================================================
// TRANSITIONS
// ============================================================================

/**
 * Transition presets
 * Usage: style={{ transition: transitions.smooth }}
 */
export const transitions = {
  smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

/**
 * Responsive breakpoints (matches Tailwind defaults)
 * Usage: @media (min-width: ${breakpoints.md})
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// ============================================================================
// GRADIENTS
// ============================================================================

/**
 * Gradient presets
 * Usage: style={{ background: gradients.primary }}
 */
export const gradients = {
  primary: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
  secondary: 'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)',
  hero: 'linear-gradient(135deg, #0D4A0F 0%, #1B5E20 50%, #2E7D32 100%)',
  success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
  info: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
  warning: 'linear-gradient(135deg, #F57C00 0%, #FFB74D 100%)',
  familyHub: 'linear-gradient(135deg, #0D7377 0%, #14919B 50%, #32B8C0 100%)'
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Helper function to combine styles
 * Usage: const styles = combineStyles(buttonStyles.primary, { margin: '1rem' })
 */
export const combineStyles = (...styles: React.CSSProperties[]): React.CSSProperties => {
  return Object.assign({}, ...styles);
};

/**
 * Helper to get responsive typography
 * Usage: <h1 style={getTypography('h1', { color: 'var(--primary)' })}>
 */
export const getTypography = (
  level: keyof typeof typography,
  overrides?: React.CSSProperties
): React.CSSProperties => {
  return { ...typography[level], ...overrides };
};

/**
 * Helper to get button styles with size
 * Usage: <button style={getButtonStyle('primary', 'large')}>
 */
export const getButtonStyle = (
  variant: 'primary' | 'secondary' | 'outline' | 'ghost',
  size: 'small' | 'medium' | 'large' = 'medium'
): React.CSSProperties => {
  return {
    ...buttonStyles[variant],
    ...buttonStyles[size]
  };
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  typography,
  spacing,
  borderRadius,
  colors,
  cssVariables,
  buttonStyles,
  shadows,
  transitions,
  breakpoints,
  gradients,
  combineStyles,
  getTypography,
  getButtonStyle
};

