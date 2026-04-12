'use client'

/**
 * Error Page
 * Catches errors in the application and shows user-friendly message
 * Next.js convention for error handling
 */

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console (in production, send to error tracking service)
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Terjadi Kesalahan</h1>
        <p className="mb-6 text-gray-600">
          Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.
        </p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 rounded-lg bg-gray-100 p-4 text-left">
            <p className="text-sm font-mono text-gray-700">{error.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} size="lg">
            Coba Lagi
          </Button>
          <Button variant="outline" size="lg" onClick={() => (window.location.href = '/')}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  )
}
