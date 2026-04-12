/**
 * Header Component
 * Main navigation header for public pages
 */

import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <span className="text-lg font-bold text-white">I</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Infortic</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/opportunities"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            Semua Peluang
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            Kategori
          </Link>
        </nav>

        {/* Mobile menu button - placeholder for future */}
        <button className="md:hidden">
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}
