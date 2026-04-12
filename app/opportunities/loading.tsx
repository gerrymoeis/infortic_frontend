/**
 * Opportunities Page Loading
 * Shown while opportunities page is loading
 */

import { OpportunityListSkeleton } from '@/components/opportunities/opportunity-list-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function OpportunitiesLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="mb-2 h-9 w-48" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Search and Sort Bar Skeleton */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-full sm:max-w-md" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        {/* Results Count Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-5 w-64" />
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Filters Sidebar Skeleton (Desktop) */}
          <aside className="hidden w-64 shrink-0 sm:block">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <Skeleton className="mb-6 h-6 w-32" />
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="mb-3 h-5 w-24" />
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <Skeleton key={j} className="h-5 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Opportunities List Skeleton */}
          <div className="flex-1">
            <OpportunityListSkeleton count={12} />
          </div>
        </div>
      </div>
    </div>
  )
}
