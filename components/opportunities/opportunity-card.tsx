/**
 * Opportunity Card Component
 * Displays opportunity summary in card format
 */

import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatDeadline, truncateText } from '@/lib/utils/formatting'
import { BLUR_DATA_URL } from '@/lib/constants/images'
import { OptimizedImage } from '@/components/ui/optimized-image'
import type { OpportunityListItem } from '@/types/database'

interface OpportunityCardProps {
  opportunity: OpportunityListItem
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const deadline = formatDeadline(opportunity.deadlineDate)
  
  return (
    <Link href={`/opportunities/${opportunity.slug}`}>
      <Card className="h-full transition-all hover:border-blue-300">
        {/* Image */}
        {opportunity.imageUrl && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gray-100">
            <OptimizedImage
              src={opportunity.imageUrl}
              alt={opportunity.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>
        )}
        
        <CardHeader>
          {/* Type Badge */}
          <div className="mb-2">
            <Badge variant="info">
              {opportunity.type.label || opportunity.type.code}
            </Badge>
          </div>
          
          {/* Title */}
          <CardTitle className="line-clamp-2">
            {opportunity.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Description */}
          {opportunity.description && (
            <p className="mb-3 line-clamp-2 text-sm text-gray-600">
              {truncateText(opportunity.description, 100)}
            </p>
          )}
          
          {/* Organizer */}
          {opportunity.organizer && (
            <p className="text-sm text-gray-500">
              oleh {opportunity.organizer.name}
            </p>
          )}
        </CardContent>
        
        <CardFooter className="flex-col items-start gap-2">
          {/* Deadline */}
          {deadline.formatted && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Deadline:</span>
              <span className={deadline.isUrgent ? 'font-medium text-red-600' : 'text-gray-900'}>
                {deadline.formatted}
              </span>
            </div>
          )}
          
          {/* Event Type & Fee */}
          <div className="flex gap-2">
            {opportunity.eventType && (
              <Badge variant="default">
                {opportunity.eventType}
              </Badge>
            )}
            {opportunity.feeType && (
              <Badge variant={opportunity.feeType === 'gratis' ? 'success' : 'default'}>
                {opportunity.feeType === 'gratis' ? 'Gratis' : opportunity.feeType.toUpperCase()}
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
