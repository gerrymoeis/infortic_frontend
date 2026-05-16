'use client'

/**
 * Filter Panel Component
 * Slide-out drawer for mobile filter UI
 * Reuses mobile menu pattern for consistency
 */

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { slideInRight } from '@/lib/design-system/animations'
import { OpportunityFilters, type FilterState } from './opportunity-filters'
import { Button } from '@/components/ui/button'
import type { OpportunityTypeWithLabel, AudienceWithLabel } from '@/types/database'

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  types: OpportunityTypeWithLabel[]
  audiences: AudienceWithLabel[]
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onApply: () => void
}

export function FilterPanel({
  isOpen,
  onClose,
  types,
  audiences,
  filters,
  onFilterChange,
  onApply,
}: FilterPanelProps) {
  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleApply = () => {
    onApply()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[50] bg-black/50 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={slideInRight.initial}
            animate={slideInRight.animate}
            exit={slideInRight.exit}
            transition={slideInRight.transition}
            className="fixed inset-y-0 right-0 z-[60] w-full max-w-sm bg-white shadow-xl lg:hidden"
            style={{ isolation: 'isolate' }}
            role="dialog"
            aria-modal="true"
            aria-label="Filter panel"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
                <h2 className="text-lg font-semibold text-neutral-900">Filter</h2>
                <button
                  onClick={onClose}
                  className="min-h-[44px] min-w-[44px] rounded-lg p-2 text-neutral-400 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-600 active:scale-95"
                  aria-label="Close filter panel"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <OpportunityFilters
                  types={types}
                  audiences={audiences}
                  filters={filters}
                  onFilterChange={onFilterChange}
                />
              </div>

              {/* Footer with Apply Button */}
              <div className="border-t border-neutral-200 px-4 py-4">
                <Button
                  onClick={handleApply}
                  className="w-full"
                  size="lg"
                >
                  Terapkan Filter
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
