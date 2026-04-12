/**
 * Category Detail Page
 * Filter opportunities by type with pagination
 * ISR with 1h revalidation
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOpportunityTypeByCode } from '@/lib/db/queries/types'
import { getOpportunitiesByType } from '@/lib/db/queries/opportunities'
import { OpportunityList } from '@/components/opportunities/opportunity-list'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PAGINATION } from '@/lib/utils/constants'

// ISR: Revalidate every 1 hour (3600 seconds)
export const revalidate = 3600

interface CategoryDetailPageProps {
  params: Promise<{
    code: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: CategoryDetailPageProps) {
  const { code } = await params
  const search = await searchParams
  const currentPage = parseInt(search.page || '1', 10)
  const limit = PAGINATION.DEFAULT_LIMIT
  const offset = (currentPage - 1) * limit

  // Get category info
  const category = await getOpportunityTypeByCode(code)
  if (!category) {
    notFound()
  }

  // Get opportunities for this category
  const opportunities = await getOpportunitiesByType(code, limit, offset)

  // Calculate pagination (simplified - we'll improve this later)
  const hasNextPage = opportunities.length === limit
  const hasPrevPage = currentPage > 1

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-primary-600">
            Kategori
          </Link>
          <span>/</span>
          <span className="text-gray-900">{category.label?.value || category.code}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {category.label?.value || category.code}
            </h1>
            <p className="text-gray-600">
              Menampilkan {opportunities.length} peluang aktif
            </p>
          </div>
          <Badge variant="info" className="text-base">
            {category.code}
          </Badge>
        </div>

        {/* Opportunity List */}
        <OpportunityList
          opportunities={opportunities}
          emptyMessage={`Tidak ada peluang ${category.label?.value || category.code} yang tersedia saat ini.`}
        />

        {/* Pagination */}
        {(hasNextPage || hasPrevPage) && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {/* Previous Button */}
            {hasPrevPage ? (
              <Link href={`/categories/${code}?page=${currentPage - 1}`}>
                <Button variant="outline">← Sebelumnya</Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                ← Sebelumnya
              </Button>
            )}

            {/* Current Page */}
            <span className="px-4 text-sm text-gray-600">
              Halaman {currentPage}
            </span>

            {/* Next Button */}
            {hasNextPage ? (
              <Link href={`/categories/${code}?page=${currentPage + 1}`}>
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
