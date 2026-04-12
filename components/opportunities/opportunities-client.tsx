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
  const [showFilters, setShowFilters] = useState(false)

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
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:hidden"
          >
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
      <div className="flex gap-8">
        {/* Filters Sidebar (Desktop) */}
        <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} sm:block`}>
          <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6">
            <OpportunityFilters
              types={types}
              audiences={audiences}
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
        </aside>

        {/* Opportunities List */}
        <div className="flex-1">
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
