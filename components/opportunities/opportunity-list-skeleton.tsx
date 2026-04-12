/**
 * Opportunity List Skeleton
 * Grid of loading placeholders
 */

import { OpportunityCardSkeleton } from './opportunity-card-skeleton'

interface OpportunityListSkeletonProps {
  count?: number
}

export function OpportunityListSkeleton({ count = 12 }: OpportunityListSkeletonProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <OpportunityCardSkeleton key={i} />
      ))}
    </div>
  )
}
