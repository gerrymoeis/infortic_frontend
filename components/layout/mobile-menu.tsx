'use client'

/**
 * Mobile Menu Component
 * Slide-out navigation drawer with smooth animations
 */

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { slideInRight } from '@/lib/design-system/animations'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Prevent body scroll when menu is open
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
            className="fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={slideInRight.initial}
            animate={slideInRight.animate}
            exit={slideInRight.exit}
            transition={slideInRight.transition}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
            <h2 className="text-lg font-semibold text-neutral-900">Menu</h2>
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] rounded-lg p-2 text-neutral-400 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-600 active:scale-95"
              aria-label="Close navigation menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile navigation">
            <div className="space-y-1">
              <Link
                href="/"
                onClick={onClose}
                className="block min-h-[44px] rounded-lg px-4 py-3 text-base font-medium text-neutral-700 transition-colors duration-150 hover:bg-neutral-100 hover:text-primary-600"
              >
                Beranda
              </Link>
              <Link
                href="/opportunities"
                onClick={onClose}
                className="block min-h-[44px] rounded-lg px-4 py-3 text-base font-medium text-neutral-700 transition-colors duration-150 hover:bg-neutral-100 hover:text-primary-600"
              >
                Semua Peluang
              </Link>
              <Link
                href="/categories"
                onClick={onClose}
                className="block min-h-[44px] rounded-lg px-4 py-3 text-base font-medium text-neutral-700 transition-colors duration-150 hover:bg-neutral-100 hover:text-primary-600"
              >
                Kategori
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-neutral-200 px-4 py-4">
            <p className="text-sm text-neutral-500">© 2026 Infortic</p>
          </div>
        </div>
      </motion.div>
    </>
      )}
    </AnimatePresence>
  )
}
