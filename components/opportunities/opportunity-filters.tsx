'use client'

/**
 * Opportunity Filters Component
 * Client-side filtering by type, audience, fee, event type
 */

import { Badge } from '@/components/ui/badge'
import type { OpportunityTypeWithLabel, AudienceWithLabel } from '@/types/database'

export interface FilterState {
  types: string[]
  audiences: string[]
  feeTypes: string[]
  eventTypes: string[]
}

interface OpportunityFiltersProps {
  types: OpportunityTypeWithLabel[]
  audiences: AudienceWithLabel[]
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

export function OpportunityFilters({
  types,
  audiences,
  filters,
  onFilterChange,
}: OpportunityFiltersProps) {
  const toggleFilter = (category: keyof FilterState, value: string) => {
    const current = filters[category]
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]

    onFilterChange({
      ...filters,
      [category]: updated,
    })
  }

  const clearAllFilters = () => {
    onFilterChange({
      types: [],
      audiences: [],
      feeTypes: [],
      eventTypes: [],
    })
  }

  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.audiences.length > 0 ||
    filters.feeTypes.length > 0 ||
    filters.eventTypes.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Hapus Semua
          </button>
        )}
      </div>

      {/* Type Filter */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-900">Kategori</h4>
        <div className="space-y-2">
          {types.map((type) => (
            <label key={type.id} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={filters.types.includes(type.code)}
                onChange={() => toggleFilter('types', type.code)}
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600 focus:ring-2"
              />
              <span className="text-sm text-gray-700">
                {type.label?.value || type.code}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Audience Filter */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-900">Target Peserta</h4>
        <div className="space-y-2">
          {audiences.map((audience) => (
            <label key={audience.id} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={filters.audiences.includes(audience.code)}
                onChange={() => toggleFilter('audiences', audience.code)}
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600 focus:ring-2"
              />
              <span className="text-sm text-gray-700">
                {audience.label?.value || audience.code.toUpperCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Fee Type Filter */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-900">Biaya</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={filters.feeTypes.includes('gratis')}
              onChange={() => toggleFilter('feeTypes', 'gratis')}
              className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Gratis</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={filters.feeTypes.includes('htm')}
              onChange={() => toggleFilter('feeTypes', 'htm')}
              className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Berbayar</span>
          </label>
        </div>
      </div>

      {/* Event Type Filter */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-900">Format Acara</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={filters.eventTypes.includes('online')}
              onChange={() => toggleFilter('eventTypes', 'online')}
              className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Online</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={filters.eventTypes.includes('offline')}
              onChange={() => toggleFilter('eventTypes', 'offline')}
              className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Offline</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={filters.eventTypes.includes('hybrid')}
              onChange={() => toggleFilter('eventTypes', 'hybrid')}
              className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Hybrid</span>
          </label>
        </div>
      </div>
    </div>
  )
}

/**
 * Active Filter Chips Component
 * Shows active filters as removable chips
 */
interface ActiveFiltersProps {
  types: OpportunityTypeWithLabel[]
  audiences: AudienceWithLabel[]
  filters: FilterState
  onRemoveFilter: (category: keyof FilterState, value: string) => void
}

export function ActiveFilters({
  types,
  audiences,
  filters,
  onRemoveFilter,
}: ActiveFiltersProps) {
  const getTypeLabel = (code: string) =>
    types.find((t) => t.code === code)?.label?.value || code

  const getAudienceLabel = (code: string) =>
    audiences.find((a) => a.code === code)?.label?.value || code.toUpperCase()

  const getFeeLabel = (code: string) => (code === 'gratis' ? 'Gratis' : 'Berbayar')

  const getEventLabel = (code: string) =>
    code.charAt(0).toUpperCase() + code.slice(1)

  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.audiences.length > 0 ||
    filters.feeTypes.length > 0 ||
    filters.eventTypes.length > 0

  if (!hasActiveFilters) return null

  return (
    <div className="flex flex-wrap gap-2">
      {filters.types.map((code) => (
        <Badge
          key={code}
          variant="info"
          className="cursor-pointer gap-1 pr-1"
          onClick={() => onRemoveFilter('types', code)}
        >
          {getTypeLabel(code)}
          <span className="ml-1 text-xs">×</span>
        </Badge>
      ))}
      {filters.audiences.map((code) => (
        <Badge
          key={code}
          variant="default"
          className="cursor-pointer gap-1 pr-1"
          onClick={() => onRemoveFilter('audiences', code)}
        >
          {getAudienceLabel(code)}
          <span className="ml-1 text-xs">×</span>
        </Badge>
      ))}
      {filters.feeTypes.map((code) => (
        <Badge
          key={code}
          variant="success"
          className="cursor-pointer gap-1 pr-1"
          onClick={() => onRemoveFilter('feeTypes', code)}
        >
          {getFeeLabel(code)}
          <span className="ml-1 text-xs">×</span>
        </Badge>
      ))}
      {filters.eventTypes.map((code) => (
        <Badge
          key={code}
          variant="default"
          className="cursor-pointer gap-1 pr-1"
          onClick={() => onRemoveFilter('eventTypes', code)}
        >
          {getEventLabel(code)}
          <span className="ml-1 text-xs">×</span>
        </Badge>
      ))}
    </div>
  )
}
