/**
 * Opportunity List Component
 * Grid layout for displaying multiple opportunity cards
 */

import { OpportunityCard } from './opportunity-card'
import type { OpportunityListItem } from '@/types/database'

interface OpportunityListProps {
  opportunities: OpportunityListItem[]
  emptyMessage?: string
}

export function OpportunityList({
  opportunities,
  emptyMessage = 'Tidak ada peluang yang ditemukan.',
}: OpportunityListProps) {
  if (opportunities.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {opportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </div>
  )
}
