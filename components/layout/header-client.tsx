'use client'

/**
 * Header Client Component
 * Only the interactive parts (mobile menu state)
 */

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Lazy load mobile menu
const MobileMenu = dynamic(() => import('./mobile-menu').then(mod => ({ default: mod.MobileMenu })), {
  ssr: false,
  loading: () => null,
})

export function HeaderClient() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="min-h-[44px] min-w-[44px] rounded-lg p-2 text-neutral-700 transition-colors duration-150 hover:bg-neutral-100 active:scale-95 md:hidden"
        aria-label="Open navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  )
}
