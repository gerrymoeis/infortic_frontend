/**
 * Opportunity Card Skeleton
 * Loading placeholder that matches OpportunityCard structure
 */

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function OpportunityCardSkeleton() {
  return (
    <Card className="h-full">
      {/* Image Skeleton */}
      <Skeleton className="h-48 w-full rounded-t-lg rounded-b-none" />

      <CardHeader>
        {/* Badge Skeleton */}
        <div className="mb-2">
          <Skeleton className="h-5 w-24" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </CardHeader>

      <CardContent>
        {/* Description Skeleton */}
        <div className="mb-3 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Organizer Skeleton */}
        <Skeleton className="h-4 w-32" />
      </CardContent>

      <CardFooter className="flex-col items-start gap-2">
        {/* Deadline Skeleton */}
        <Skeleton className="h-4 w-48" />

        {/* Badges Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardFooter>
    </Card>
  )
}
