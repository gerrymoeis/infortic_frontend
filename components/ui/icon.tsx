/**
 * Icon Component
 * Wrapper for Lucide React icons with consistent sizing and styling
 * 
 * Usage:
 * import { Icon } from '@/components/ui/icon'
 * import { Trophy } from 'lucide-react'
 * 
 * <Icon icon={Trophy} size="md" className="text-primary-600" />
 */

import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { iconSizes } from '@/lib/design-system/icons'

interface IconProps {
  icon: LucideIcon
  size?: keyof typeof iconSizes | number
  className?: string
  'aria-hidden'?: boolean
  'aria-label'?: string
}

export function Icon({ 
  icon: IconComponent, 
  size = 'md', 
  className,
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
}: IconProps) {
  // Get size value (either from preset or custom number)
  const sizeValue = typeof size === 'number' ? size : iconSizes[size]
  
  return (
    <IconComponent 
      size={sizeValue}
      className={cn('shrink-0', className)}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    />
  )
}

/**
 * Icon Button Component
 * Icon wrapped in a button with proper accessibility
 */
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  size?: keyof typeof iconSizes | number
  label: string // Required for accessibility
}

export function IconButton({
  icon,
  size = 'md',
  label,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center rounded-md',
        'transition-colors duration-150',
        'hover:bg-neutral-100 active:bg-neutral-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'p-2',
        className
      )}
      {...props}
    >
      <Icon icon={icon} size={size} aria-hidden={true} />
    </button>
  )
}
