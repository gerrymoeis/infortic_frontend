/**
 * Header Component
 * Main navigation header - Server Component for better performance
 */

import Link from 'next/link'
import { NavLink } from '@/components/ui/nav-link'
import { HeaderClient } from './header-client'

export function Header() {
  return (
    <header className="sticky top-0 z-navbar w-full border-b border-neutral-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Infortic Home">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <span className="text-lg font-bold text-white" aria-hidden="true">I</span>
          </div>
          <span className="text-xl font-bold text-neutral-900">Infortic</span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          <NavLink href="/opportunities">
            Semua Peluang
          </NavLink>
          <NavLink href="/categories">
            Kategori
          </NavLink>
        </nav>

        {/* Client-side interactive parts */}
        <HeaderClient />
      </div>
    </header>
  )
}
