/**
 * Global Loading Page
 * Shown while any page is loading
 */

import { OpportunityListSkeleton } from '@/components/opportunities/opportunity-list-skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-96 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Content Skeleton */}
        <OpportunityListSkeleton count={12} />
      </div>
    </div>
  )
}
