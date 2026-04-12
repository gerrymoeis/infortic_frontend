'use client'

/**
 * Opportunity Sort Component
 * Client-side sorting options
 */

export type SortOption = 'newest' | 'deadline' | 'title'

interface OpportunitySortProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'deadline', label: 'Deadline Terdekat' },
  { value: 'title', label: 'Judul (A-Z)' },
]

export function OpportunitySort({ value, onChange }: OpportunitySortProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium text-gray-700">
        Urutkan:
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
