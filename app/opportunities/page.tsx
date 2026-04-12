/**
 * Opportunities List Page
 * Paginated list of all active opportunities
 * Dynamic rendering (will be changed to ISR after database verification)
 */

import Link from 'next/link'
import { getPublishedOpportunities, countPublishedOpportunities } from '@/lib/db/queries/opportunities'
import { OpportunityList } from '@/components/opportunities/opportunity-list'
import { Button } from '@/components/ui/button'
import { PAGINATION } from '@/lib/utils/constants'

// Force dynamic rendering for now
export const dynamic = 'force-dynamic'

interface OpportunitiesPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1', 10)
  const limit = PAGINATION.DEFAULT_LIMIT
  const offset = (currentPage - 1) * limit

  // Fetch opportunities and total count
  const [opportunities, totalCount] = await Promise.all([
    getPublishedOpportunities(limit, offset),
    countPublishedOpportunities(),
  ])

  const totalPages = Math.ceil(totalCount / limit)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Semua Peluang</h1>
          <p className="text-gray-600">
            Menampilkan {opportunities.length} dari {totalCount} peluang aktif
          </p>
        </div>

        {/* Opportunity List */}
        <OpportunityList
          opportunities={opportunities}
          emptyMessage="Tidak ada peluang yang tersedia saat ini."
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {/* Previous Button */}
            {hasPrevPage ? (
              <Link href={`/opportunities?page=${currentPage - 1}`}>
                <Button variant="outline">← Sebelumnya</Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                ← Sebelumnya
              </Button>
            )}

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <Link key={pageNum} href={`/opportunities?page=${pageNum}`}>
                    <Button
                      variant={currentPage === pageNum ? 'primary' : 'outline'}
                      size="sm"
                    >
                      {pageNum}
                    </Button>
                  </Link>
                )
              })}
            </div>

            {/* Next Button */}
            {hasNextPage ? (
              <Link href={`/opportunities?page=${currentPage + 1}`}>
                <Button variant="outline">Selanjutnya →</Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                Selanjutnya →
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
