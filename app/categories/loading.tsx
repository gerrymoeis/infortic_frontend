/**
 * Categories Page Loading
 * Shown while categories page is loading
 */

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="mb-2 h-9 w-56" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Categories Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card key={i} className="h-full">
              <CardHeader>
                {/* Icon Skeleton */}
                <Skeleton className="mb-3 h-12 w-12 rounded-full" />
                {/* Title Skeleton */}
                <Skeleton className="h-7 w-32" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
