/**
 * Button Component
 * Reusable button with variants, animations, and loading state
 */

import { cn } from '@/lib/utils/cn'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base styles with animations
          'inline-flex items-center justify-center gap-2 rounded-md font-medium',
          'transition-all duration-150',
          'active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          
          // Variants
          {
            'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600':
              variant === 'primary',
            'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus-visible:ring-neutral-500':
              variant === 'secondary',
            'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 focus-visible:ring-neutral-500':
              variant === 'outline',
            'text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-500':
              variant === 'ghost',
          },
          
          // Sizes (WCAG: minimum 44x44px for touch targets)
          {
            'min-h-[44px] h-11 px-3 text-sm': size === 'sm',
            'min-h-[44px] h-11 px-4 text-base': size === 'md',
            'min-h-[44px] h-12 px-6 text-lg': size === 'lg',
          },
          
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 
            size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} 
            className="animate-spin" 
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
