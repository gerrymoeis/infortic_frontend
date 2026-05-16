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
  onReset: () => void
}

export function FilterPanel({
  isOpen,
  onClose,
  types,
  audiences,
  filters,
  onFilterChange,
  onApply,
  onReset,
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

          {/* Drawer - Full Height */}
          <motion.div
            initial={slideInRight.initial}
            animate={slideInRight.animate}
            exit={slideInRight.exit}
            transition={slideInRight.transition}
            className="fixed inset-y-0 right-0 z-drawer h-full w-full max-w-xs bg-white shadow-xl lg:hidden"
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

              {/* Footer with Reset and Apply Buttons */}
              <div className="space-y-3 border-t border-neutral-200 px-4 py-4">
                <Button
                  onClick={onReset}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Reset Filter
                </Button>
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
