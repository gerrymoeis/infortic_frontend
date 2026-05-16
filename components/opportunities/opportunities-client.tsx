'use client'

/**
 * Opportunities Client Component
 * Handles client-side search, filter, sort, and pagination
 */

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { OpportunityList } from './opportunity-list'
import { OpportunitySearch } from './opportunity-search'
import { OpportunityFilters, ActiveFilters, type FilterState } from './opportunity-filters'
import { OpportunitySort, type SortOption } from './opportunity-sort'
import { FilterFAB } from './filter-fab'
import { FilterPanel } from './filter-panel'
import { Pagination } from '@/components/ui/pagination'
import type { OpportunityListItem, OpportunityTypeWithLabel, AudienceWithLabel } from '@/types/database'

interface OpportunitiesClientProps {
  initialOpportunities: OpportunityListItem[]
  types: OpportunityTypeWithLabel[]
  audiences: AudienceWithLabel[]
}

const ITEMS_PER_PAGE = 20

export function OpportunitiesClient({
  initialOpportunities,
  types,
  audiences,
}: OpportunitiesClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    audiences: [],
    feeTypes: [],
    eventTypes: [],
  })
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  
  // Get current page from URL or default to 1
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return (
      filters.types.length +
      filters.audiences.length +
      filters.feeTypes.length +
      filters.eventTypes.length
    )
  }, [filters])

  // Filter and sort opportunities
  const filteredOpportunities = useMemo(() => {
    let result = [...initialOpportunities]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (opp) =>
          opp.title.toLowerCase().includes(query) ||
          opp.description?.toLowerCase().includes(query) ||
          opp.organizer?.name.toLowerCase().includes(query)
      )
    }

    // Type filter
    if (filters.types.length > 0) {
      result = result.filter((opp) => filters.types.includes(opp.type.code))
    }

    // Fee type filter
    if (filters.feeTypes.length > 0) {
      result = result.filter((opp) => opp.feeType && filters.feeTypes.includes(opp.feeType))
    }

    // Event type filter
    if (filters.eventTypes.length > 0) {
      result = result.filter((opp) => opp.eventType && filters.eventTypes.includes(opp.eventType))
    }

    // Audience filter (requires checking if opportunity has any of the selected audiences)
    // Note: This is simplified - in production you'd need to fetch audience data per opportunity
    if (filters.audiences.length > 0) {
      // For now, we'll skip audience filtering since we don't have that data in OpportunityListItem
      // This would require a more complex query or additional data
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        })
        break
      case 'deadline':
        result.sort((a, b) => {
          if (!a.deadlineDate) return 1
          if (!b.deadlineDate) return -1
          return new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime()
        })
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title, 'id'))
        break
    }

    return result
  }, [initialOpportunities, searchQuery, filters, sortBy])

  // Paginate filtered results
  const totalPages = Math.ceil(filteredOpportunities.length / ITEMS_PER_PAGE)
  const paginatedOpportunities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredOpportunities.slice(start, end)
  }, [filteredOpportunities, currentPage])

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    if (currentPage > 1) {
      router.push('/opportunities?page=1', { scroll: false })
    }
  }, [searchQuery, filters, sortBy]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (page: number) => {
    router.push(`/opportunities?page=${page}`, { scroll: true })
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRemoveFilter = (category: keyof FilterState, value: string) => {
    setFilters({
      ...filters,
      [category]: filters[category].filter((v) => v !== value),
    })
  }

  const handleResetFilters = () => {
    setFilters({
      types: [],
      audiences: [],
      feeTypes: [],
      eventTypes: [],
    })
  }

  // Calculate display range
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredOpportunities.length)

  return (
    <div className="space-y-6">
      {/* Sticky Search and Sort Bar */}
      <div className="sticky top-16 z-sticky-search -mx-4 bg-white px-4 pb-4 border-b border-neutral-200 sm:mx-0 sm:rounded-lg sm:border">
        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 sm:max-w-md">
            <OpportunitySearch onSearch={setSearchQuery} />
          </div>
          <div className="flex items-center gap-4">
            <OpportunitySort value={sortBy} onChange={setSortBy} />
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters
        types={types}
        audiences={audiences}
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
      />

      {/* Results Count */}
      <div className="text-sm text-neutral-600">
        {filteredOpportunities.length > 0 ? (
          <>
            Menampilkan {startItem}-{endItem} dari {filteredOpportunities.length} peluang
          </>
        ) : (
          <>Tidak ada peluang ditemukan</>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Filters Sidebar - Desktop (always visible on lg+) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-44 max-h-[calc(100vh-12rem)] overflow-y-auto rounded-lg border border-gray-200 bg-white">
            <div className="p-6">
              <OpportunityFilters
                types={types}
                audiences={audiences}
                filters={filters}
                onFilterChange={setFilters}
              />
            </div>
          </div>
        </aside>

        {/* Opportunities List */}
        <div className="flex-1 min-w-0 space-y-8">
          <OpportunityList
            opportunities={paginatedOpportunities}
            emptyMessage={
              searchQuery || filters.types.length > 0
                ? 'Tidak ada peluang yang sesuai dengan pencarian atau filter Anda.'
                : 'Tidak ada peluang yang tersedia saat ini.'
            }
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Filter FAB - Mobile only */}
      <FilterFAB
        activeFilterCount={activeFilterCount}
        onClick={() => setIsFilterPanelOpen(true)}
      />

      {/* Filter Panel - Mobile only */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        types={types}
        audiences={audiences}
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        onApply={() => {
          // Filter already applied via setFilters
          // This just closes the panel
        }}
      />
    </div>
  )
}
