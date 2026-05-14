/**
 * Input Component
 * Form input with validation states and label
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const hasError = !!error
    const hasSuccess = !!success

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-md border px-3 py-2 text-sm',
              'transition-colors duration-150',
              'placeholder:text-neutral-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              // Default state
              !hasError && !hasSuccess && [
                'border-neutral-300 bg-white text-neutral-900',
                'hover:border-neutral-400',
                'focus:border-primary-600 focus:ring-primary-600/20',
              ],
              // Error state
              hasError && [
                'border-error-500 bg-error-50 text-error-900',
                'focus:border-error-600 focus:ring-error-600/20',
                'pr-10', // Space for icon
              ],
              // Success state
              hasSuccess && [
                'border-success-500 bg-success-50 text-success-900',
                'focus:border-success-600 focus:ring-success-600/20',
                'pr-10', // Space for icon
              ],
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : 
              success ? `${inputId}-success` : 
              helperText ? `${inputId}-helper` : 
              undefined
            }
            {...props}
          />

          {/* Error icon */}
          {hasError && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <AlertCircle size={16} className="text-error-500" aria-hidden="true" />
            </div>
          )}

          {/* Success icon */}
          {hasSuccess && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <CheckCircle size={16} className="text-success-500" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Helper/Error/Success text */}
        {(error || success || helperText) && (
          <p
            id={
              error ? `${inputId}-error` : 
              success ? `${inputId}-success` : 
              `${inputId}-helper`
            }
            className={cn(
              'mt-1.5 text-xs',
              error && 'text-error-600',
              success && 'text-success-600',
              !error && !success && 'text-neutral-500'
            )}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
