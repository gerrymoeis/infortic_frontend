'use client'

/**
 * Filter Panel Component
 * Slide-out drawer for mobile filter UI
 * Reuses mobile menu pattern for consistency
 */

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
            className="fixed inset-0 z-overlay bg-black/50 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={slideInRight.initial}
            animate={slideInRight.animate}
            exit={slideInRight.exit}
            transition={slideInRight.transition}
            className="fixed inset-y-0 right-0 z-drawer w-full max-w-sm bg-white shadow-xl lg:hidden"
            style={{ isolation: 'isolate' }}
            role="dialog"
            aria-modal="true"
            aria-label="Filter panel"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
                <h2 className="text-lg font-semibold text-neutral-900">Filter</h2>
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

          {/* Fixed Close Button - Same position as FAB */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            onClick={onClose}
            className="fixed bottom-6 right-6 z-fab flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-all duration-150 hover:bg-neutral-800 hover:shadow-xl active:scale-95 lg:hidden"
            aria-label="Tutup filter"
            title="Tutup filter"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </>
      )}
    </AnimatePresence>
  )
}
