/**
 * Opportunities List Page
 * All active opportunities with client-side search, filter, and sort
 * ISR with 1h revalidation
 */

import { getPublishedOpportunities } from '@/lib/db/queries/opportunities'
import { getAllOpportunityTypes } from '@/lib/db/queries/types'
import { getAllAudiences } from '@/lib/db/queries/audiences'
import { OpportunitiesClient } from '@/components/opportunities/opportunities-client'

// ISR: Revalidate every 1 hour (3600 seconds)
export const revalidate = 3600

export default async function OpportunitiesPage() {
  // Fetch all active opportunities (no pagination - client-side filtering)
  // For 1,000 opportunities, this is acceptable for client-side filtering
  const [opportunities, types, audiences] = await Promise.all([
    getPublishedOpportunities(1000, 0), // Get up to 1000 opportunities
    getAllOpportunityTypes(),
    getAllAudiences(),
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Semua Peluang</h1>
          <p className="text-gray-600">
            Temukan peluang yang sesuai dengan minat dan kebutuhanmu
          </p>
        </div>

        {/* Client-side Search, Filter, Sort */}
        <OpportunitiesClient
          initialOpportunities={opportunities}
          types={types}
          audiences={audiences}
        />
      </div>
    </div>
  )
}
