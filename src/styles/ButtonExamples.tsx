/**
 * Button Standardization Examples
 * 
 * This file demonstrates how to use the button styles from the design system constants.
 * Use these patterns to ensure consistent button styling throughout the application.
 */

import { buttonStyles, getButtonStyle, combineStyles } from '../styles/constants';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Plus } from 'lucide-react';

// ============================================================================
// EXAMPLE 1: Basic Button Usage
// ============================================================================

export const PrimaryButtonExample = () => {
  return (
    <button style={buttonStyles.primary}>
      Click Me
    </button>
  );
};

export const SecondaryButtonExample = () => {
  return (
    <button style={buttonStyles.secondary}>
      Learn More
    </button>
  );
};

// ============================================================================
// EXAMPLE 2: Button with Icon
// ============================================================================

export const ButtonWithIconExample = () => {
  return (
    <button style={buttonStyles.primary}>
      <Download size={20} />
      <span>Download</span>
    </button>
  );
};

// ============================================================================
// EXAMPLE 3: Button as Link
// ============================================================================

export const LinkButtonExample = () => {
  return (
    <Link 
      to="/family-hub" 
      style={buttonStyles.primary}
    >
      <ArrowRight size={20} />
      <span>Get Started</span>
    </Link>
  );
};

// ============================================================================
// EXAMPLE 4: Button with Size Variants
// ============================================================================

export const SizedButtonExamples = () => {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <button style={getButtonStyle('primary', 'small')}>
        Small
      </button>
      <button style={getButtonStyle('primary', 'medium')}>
        Medium
      </button>
      <button style={getButtonStyle('primary', 'large')}>
        Large
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 5: Custom Styled Button (with overrides)
// ============================================================================

export const CustomStyledButtonExample = () => {
  return (
    <button style={combineStyles(
      buttonStyles.primary,
      { 
        marginTop: '1rem',
        width: '100%' 
      }
    )}>
      Full Width Button
    </button>
  );
};

// ============================================================================
// EXAMPLE 6: All Button Variants
// ============================================================================

export const AllVariantsExample = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
      {/* Primary */}
      <button style={buttonStyles.primary}>
        Primary Button
      </button>
      
      {/* Secondary */}
      <button style={buttonStyles.secondary}>
        Secondary Button
      </button>
      
      {/* Outline */}
      <button style={buttonStyles.outline}>
        Outline Button
      </button>
      
      {/* Ghost */}
      <button style={buttonStyles.ghost}>
        Ghost Button
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 7: Loading State Button
// ============================================================================

export const LoadingButtonExample = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <button 
      style={combineStyles(
        buttonStyles.primary,
        { 
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }
      )}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : 'Submit'}
    </button>
  );
};

// ============================================================================
// EXAMPLE 8: Button Group
// ============================================================================

export const ButtonGroupExample = () => {
  return (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <button style={buttonStyles.primary}>
        Save
      </button>
      <button style={buttonStyles.secondary}>
        Cancel
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 9: Icon-Only Button
// ============================================================================

export const IconButtonExample = () => {
  return (
    <button style={combineStyles(
      buttonStyles.primary,
      { 
        padding: '0.75rem',
        aspectRatio: '1'
      }
    )}>
      <Plus size={20} />
    </button>
  );
};

// ============================================================================
// EXAMPLE 10: Responsive Button
// ============================================================================

export const ResponsiveButtonExample = () => {
  return (
    <button 
      className="w-full sm:w-auto"
      style={buttonStyles.primary}
    >
      <span className="hidden sm:inline">Get Started</span>
      <span className="sm:hidden">Start</span>
    </button>
  );
};

// ============================================================================
// MIGRATION GUIDE: From Tailwind to Constants
// ============================================================================

/**
 * BEFORE (Tailwind classes):
 * 
 * <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
 *   Click Me
 * </button>
 * 
 * 
 * AFTER (Design constants):
 * 
 * import { buttonStyles } from '../styles/constants';
 * 
 * <button style={buttonStyles.primary}>
 *   Click Me
 * </button>
 * 
 * 
 * WHY THIS IS BETTER:
 * - Single source of truth for button styles
 * - Easy to update all buttons at once
 * - Type-safe with TypeScript
 * - Consistent hover states and transitions
 * - Less code, more maintainable
 */

// ============================================================================
// COMMON PATTERNS
// ============================================================================

// CTA Button (Call to Action)
export const CTAButton = ({ children, href }: { children: React.ReactNode; href: string }) => {
  return (
    <Link to={href} style={getButtonStyle('primary', 'large')}>
      {children}
      <ArrowRight size={20} />
    </Link>
  );
};

// Download Button
export const DownloadButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
  return (
    <button onClick={onClick} style={buttonStyles.primary}>
      <Download size={20} />
      {children}
    </button>
  );
};

// Cancel/Close Button
export const CancelButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button onClick={onClick} style={buttonStyles.secondary}>
      Cancel
    </button>
  );
};

// Add/Create Button
export const AddButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
  return (
    <button onClick={onClick} style={buttonStyles.primary}>
      <Plus size={20} />
      {children}
    </button>
  );
};

// ============================================================================
// BEST PRACTICES
// ============================================================================

/**
 * 1. ALWAYS use buttonStyles for consistency
 *    ✅ <button style={buttonStyles.primary}>
 *    ❌ <button className="bg-green-600 ...">
 * 
 * 2. Use getButtonStyle() for size variants
 *    ✅ style={getButtonStyle('primary', 'large')}
 *    ❌ style={{...buttonStyles.primary, padding: '1rem 2rem'}}
 * 
 * 3. Use combineStyles() for custom overrides
 *    ✅ style={combineStyles(buttonStyles.primary, { margin: '1rem' })}
 *    ❌ Copying and modifying buttonStyles object
 * 
 * 4. Maintain accessibility
 *    ✅ <button aria-label="Close" style={buttonStyles.primary}>
 *    ✅ Add proper disabled states
 *    ✅ Include loading indicators
 * 
 * 5. Keep text concise
 *    ✅ "Get Started"
 *    ❌ "Click Here To Get Started With Privacy Panda"
 */

// ============================================================================
// HOVER STATES (automatically included)
// ============================================================================

/**
 * All button styles include transition: 'all 0.3s ease'
 * 
 * To add custom hover effects:
 * 
 * const [isHovered, setIsHovered] = useState(false);
 * 
 * <button 
 *   style={combineStyles(
 *     buttonStyles.primary,
 *     isHovered ? { transform: 'translateY(-2px)' } : {}
 *   )}
 *   onMouseEnter={() => setIsHovered(true)}
 *   onMouseLeave={() => setIsHovered(false)}
 * >
 *   Hover Me
 * </button>
 */

// ============================================================================
// TAILWIND ALTERNATIVE (when you need it)
// ============================================================================

/**
 * Sometimes you need Tailwind classes for responsive behavior.
 * That's OK! You can combine both:
 * 
 * <button 
 *   className="w-full md:w-auto"  // Responsive width
 *   style={buttonStyles.primary}   // Consistent button style
 * >
 *   Click Me
 * </button>
 * 
 * Use Tailwind for:
 * - Layout (flex, grid, spacing)
 * - Responsive behavior (sm:, md:, lg:)
 * - Utilities that aren't in constants
 * 
 * Use Constants for:
 * - Button styles
 * - Typography
 * - Colors
 * - Spacing (when consistent)
 */

export default {
  PrimaryButtonExample,
  SecondaryButtonExample,
  ButtonWithIconExample,
  LinkButtonExample,
  SizedButtonExamples,
  CustomStyledButtonExample,
  AllVariantsExample,
  LoadingButtonExample,
  ButtonGroupExample,
  IconButtonExample,
  ResponsiveButtonExample,
  CTAButton,
  DownloadButton,
  CancelButton,
  AddButton
};

