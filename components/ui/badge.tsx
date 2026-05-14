/**
 * Badge Component
 * Small label/tag component with variants and sizes
 */

import { cn } from '@/lib/utils/cn'
import { X } from 'lucide-react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary'
  size?: 'sm' | 'md' | 'lg'
  removable?: boolean
  onRemove?: () => void
}

export function Badge({ 
  className, 
  variant = 'default', 
  size = 'md',
  removable = false,
  onRemove,
  children, 
  ...props 
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        'transition-colors duration-150',
        // Variants
        {
          'bg-neutral-100 text-neutral-800': variant === 'default',
          'bg-success-100 text-success-800': variant === 'success',
          'bg-warning-100 text-warning-800': variant === 'warning',
          'bg-error-100 text-error-800': variant === 'error',
          'bg-primary-100 text-primary-800': variant === 'info',
          'bg-primary-600 text-white': variant === 'primary',
        },
        // Sizes
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-0.5 text-xs': size === 'md',
          'px-3 py-1 text-sm': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
      
      {/* Remove button */}
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={cn(
            'inline-flex items-center justify-center rounded-full',
            'transition-colors duration-150',
            'hover:bg-black/10 active:scale-95',
            {
              'h-3 w-3': size === 'sm',
              'h-3.5 w-3.5': size === 'md',
              'h-4 w-4': size === 'lg',
            }
          )}
          aria-label="Remove"
        >
          <X 
            size={size === 'lg' ? 12 : 10} 
            className="shrink-0"
          />
        </button>
      )}
    </span>
  )
}
