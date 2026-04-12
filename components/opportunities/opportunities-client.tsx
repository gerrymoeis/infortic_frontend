'use client'

/**
 * Opportunities Client Component
 * Handles client-side search, filter, and sort
 */

import { useState, useMemo } from 'react'
import { OpportunityList } from './opportunity-list'
import { OpportunitySearch } from './opportunity-search'
import { OpportunityFilters, ActiveFilters, type FilterState } from './opportunity-filters'
import { OpportunitySort, type SortOption } from './opportunity-sort'
import type { OpportunityListItem, OpportunityTypeWithLabel, AudienceWithLabel } from '@/types/database'

interface OpportunitiesClientProps {
  initialOpportunities: OpportunityListItem[]
  types: OpportunityTypeWithLabel[]
  audiences: AudienceWithLabel[]
}

export function OpportunitiesClient({
  initialOpportunities,
  types,
  audiences,
}: OpportunitiesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    audiences: [],
    feeTypes: [],
    eventTypes: [],
  })
  const [showMobileFilters, setShowMobileFilters] = useState(false)

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

  const handleRemoveFilter = (category: keyof FilterState, value: string) => {
    setFilters({
      ...filters,
      [category]: filters[category].filter((v) => v !== value),
    })
  }

  return (
    <div className="space-y-6">
      {/* Search and Sort Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 sm:max-w-md">
          <OpportunitySearch onSearch={setSearchQuery} />
        </div>
        <div className="flex items-center gap-4">
          <OpportunitySort value={sortBy} onChange={setSortBy} />
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
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
      <div className="text-sm text-gray-600">
        Menampilkan {filteredOpportunities.length} dari {initialOpportunities.length} peluang
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Filters Sidebar - Desktop (always visible on lg+) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6">
            <OpportunityFilters
              types={types}
              audiences={audiences}
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
        </aside>

        {/* Filters Panel - Mobile (collapsible) */}
        {showMobileFilters && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <OpportunityFilters
              types={types}
              audiences={audiences}
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
        )}

        {/* Opportunities List */}
        <div className="flex-1 min-w-0">
          <OpportunityList
            opportunities={filteredOpportunities}
            emptyMessage={
              searchQuery || filters.types.length > 0
                ? 'Tidak ada peluang yang sesuai dengan pencarian atau filter Anda.'
                : 'Tidak ada peluang yang tersedia saat ini.'
            }
          />
        </div>
      </div>
    </div>
  )
}
