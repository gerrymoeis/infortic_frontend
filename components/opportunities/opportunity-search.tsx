'use client'

/**
 * Opportunity Search Component
 * Client-side search with debouncing
 */

import { useState, useEffect } from 'react'

interface OpportunitySearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function OpportunitySearch({
  onSearch,
  placeholder = 'Cari peluang...',
}: OpportunitySearchProps) {
  const [query, setQuery] = useState('')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [query, onSearch])

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className="relative">
      {/* Search Icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
      />

      {/* Clear Button */}
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
