/**
 * Empty State Component
 * Shows when there's no data to display
 */

import { ReactNode } from 'react'
import { Icon } from '@/components/ui/icon'
import { Inbox, type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ 
  icon = Inbox, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mb-4 flex justify-center text-neutral-400">
          <Icon icon={icon} size={64} aria-hidden={true} />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-semibold text-neutral-900">{title}</h3>

        {/* Description */}
        {description && <p className="mb-6 text-neutral-600">{description}</p>}

        {/* Action */}
        {action && <div className="flex justify-center">{action}</div>}
      </div>
    </div>
  )
}
