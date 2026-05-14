/**
 * Opportunity List Component
 * Grid layout for displaying multiple opportunity cards
 */

import { OpportunityCard } from './opportunity-card'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import type { OpportunityListItem } from '@/types/database'

interface OpportunityListProps {
  opportunities: OpportunityListItem[]
  emptyMessage?: string
  showEmptyAction?: boolean
}

export function OpportunityList({
  opportunities,
  emptyMessage = 'Tidak ada peluang yang ditemukan.',
  showEmptyAction = true,
}: OpportunityListProps) {
  if (opportunities.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="Tidak Ada Hasil"
        description={emptyMessage}
        action={
          showEmptyAction ? (
            <Button variant="outline" onClick={() => window.location.reload()}>
              Muat Ulang
            </Button>
          ) : undefined
        }
      />
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {opportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </div>
  )
}
