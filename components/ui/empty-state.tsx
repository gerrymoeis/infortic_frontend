/**
 * Empty State Component
 * Shows when there's no data to display
 */

import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mb-4 text-6xl">{icon}</div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>

        {/* Description */}
        {description && <p className="mb-6 text-gray-600">{description}</p>}

        {/* Action */}
        {action && <div className="flex justify-center">{action}</div>}
      </div>
    </div>
  )
}
