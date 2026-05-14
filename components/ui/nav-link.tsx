/**
 * NavLink Component
 * Navigation link with active state indicator animation
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={cn(
        'relative text-sm font-medium transition-colors duration-150',
        'hover:text-primary-600',
        isActive ? 'text-primary-600' : 'text-neutral-700',
        className
      )}
    >
      {children}
      
      {/* Active indicator - animated underline */}
      <span
        className={cn(
          'absolute -bottom-1 left-0 h-0.5 bg-primary-600',
          'transition-all',
          isActive ? 'w-full' : 'w-0'
        )}
        style={{ 
          transitionDuration: '250ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
    </Link>
  )
}
