'use client'

/**
 * Filter FAB (Floating Action Button)
 * Mobile-only button for opening filter panel
 */

import { Filter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface FilterFABProps {
  activeFilterCount: number
  onClick: () => void
}

export function FilterFAB({ activeFilterCount, onClick }: FilterFABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[40] flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-all duration-150 hover:bg-primary-700 hover:shadow-xl active:scale-95 lg:hidden"
      aria-label={`Open filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ''}`}
    >
      <Filter className="h-6 w-6" aria-hidden="true" />
      {activeFilterCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-600 text-xs font-semibold text-white">
          {activeFilterCount}
        </span>
      )}
    </button>
  )
}
