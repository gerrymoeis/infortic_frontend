/**
 * Animation System
 * Snappy, smooth, performance-focused animations
 * 
 * Philosophy: Fast (snappy) but smooth - no jarring transitions
 * Performance: Only animate transform and opacity (GPU-accelerated)
 */

// ============================================================================
// DURATIONS
// ============================================================================

export const duration = {
  fast: 150,      // Hover, focus - snappy interactions
  normal: 250,    // Default - smooth but quick
  slow: 350,      // Page transitions - noticeable but not sluggish
} as const

// ============================================================================
// EASING CURVES
// ============================================================================

export const easing = {
  // Snappy: Fast start, smooth end - feels responsive
  snappy: [0.4, 0, 0.2, 1] as const,
  
  // Smooth: Balanced acceleration - feels natural
  smooth: [0.4, 0, 0.6, 1] as const,
  
  // Bounce: Playful overshoot - use sparingly
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  
  // Linear: Constant speed - for progress indicators
  linear: [0, 0, 1, 1] as const,
} as const

// ============================================================================
// FRAMER MOTION VARIANTS
// ============================================================================

/**
 * Fade In Animation
 * Use for: Page content, modals, tooltips
 */
export const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { 
    duration: duration.normal / 1000, 
    ease: easing.snappy 
  }
} as const

/**
 * Scale In Animation
 * Use for: Dropdowns, popovers, badges
 */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { 
    duration: duration.fast / 1000, 
    ease: easing.snappy 
  }
} as const

/**
 * Slide In Animation
 * Use for: Mobile menu, side panels, notifications
 */
export const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
  transition: { 
    duration: duration.normal / 1000, 
    ease: easing.snappy 
  }
} as const

/**
 * Slide In From Right
 * Use for: Mobile menu specifically
 */
export const slideInRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
  transition: { 
    duration: duration.normal / 1000, 
    ease: easing.snappy 
  }
} as const

/**
 * Stagger Children Animation
 * Use for: Lists, grids that appear sequentially
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05, // 50ms delay between children
      delayChildren: 0.1,    // 100ms delay before first child
    }
  }
} as const

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { 
    duration: duration.fast / 1000, 
    ease: easing.snappy 
  }
} as const

// ============================================================================
// CSS TRANSITION CLASSES
// ============================================================================

/**
 * CSS class names for common transitions
 * Use these in className for simple hover/focus effects
 */
export const transitionClasses = {
  // All properties - use sparingly (can cause jank)
  all: 'transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]',
  
  // Colors only - best for hover states
  colors: 'transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]',
  
  // Transform only - best for scale/translate
  transform: 'transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]',
  
  // Opacity only - best for fade effects
  opacity: 'transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]',
  
  // Shadow only - best for elevation changes
  shadow: 'transition-shadow duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]',
} as const

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

/**
 * Hover Lift Effect
 * Lifts element up slightly on hover
 */
export const hoverLift = {
  className: 'transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5',
} as const

/**
 * Active Press Effect
 * Scales down slightly when pressed
 */
export const activePress = {
  className: 'active:scale-[0.98] transition-transform duration-75',
} as const

/**
 * Focus Ring
 * Consistent focus indicator
 */
export const focusRing = {
  className: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
} as const

// ============================================================================
// PERFORMANCE TIPS
// ============================================================================

/**
 * GPU-Accelerated Properties (FAST):
 * - transform (translate, scale, rotate)
 * - opacity
 * 
 * CPU-Heavy Properties (AVOID):
 * - width, height
 * - top, left, right, bottom
 * - margin, padding
 * - border-width
 * 
 * Use will-change sparingly:
 * - Only add before animation starts
 * - Remove after animation ends
 * - Don't apply to many elements at once
 */
