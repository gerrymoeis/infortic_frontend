/**
 * Formatting Utilities
 * Date, currency, text formatting functions
 */

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import slugify from 'slugify'
import { TEXT_LIMIT, DATE_FORMAT, DEFAULT_CURRENCY } from './constants'

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Format date to Indonesian locale
 * 
 * @param date - Date string or Date object
 * @param formatStr - Format string (default: 'dd MMMM yyyy')
 * @returns Formatted date string or null if invalid
 */
export function formatDate(date: string | Date | null | undefined, formatStr: string = DATE_FORMAT.FULL): string | null {
  if (!date) return null

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return null

    return format(dateObj, formatStr, { locale: idLocale })
  } catch (error) {
    console.error('Error formatting date:', error)
    return null
  }
}

/**
 * Format date to relative time (e.g., "2 hari lalu")
 * 
 * @param date - Date string or Date object
 * @returns Relative time string or null if invalid
 */
export function formatRelativeTime(date: string | Date | null | undefined): string | null {
  if (!date) return null

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return null

    return formatDistanceToNow(dateObj, { addSuffix: true, locale: idLocale })
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return null
  }
}

/**
 * Format deadline with urgency indicator
 * 
 * @param deadline - Deadline date
 * @returns Object with formatted date and urgency level
 */
export function formatDeadline(deadline: string | Date | null | undefined): {
  formatted: string | null
  relative: string | null
  isUrgent: boolean
  daysLeft: number | null
} {
  if (!deadline) {
    return {
      formatted: null,
      relative: null,
      isUrgent: false,
      daysLeft: null,
    }
  }

  const deadlineDate = typeof deadline === 'string' ? parseISO(deadline) : deadline
  if (!isValid(deadlineDate)) {
    return {
      formatted: null,
      relative: null,
      isUrgent: false,
      daysLeft: null,
    }
  }

  const now = new Date()
  const diffTime = deadlineDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return {
    formatted: formatDate(deadlineDate, DATE_FORMAT.FULL),
    relative: formatRelativeTime(deadlineDate),
    isUrgent: diffDays <= 7 && diffDays >= 0, // Urgent if 7 days or less
    daysLeft: diffDays >= 0 ? diffDays : null,
  }
}

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Format currency to Indonesian Rupiah
 * 
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'IDR')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | string | null | undefined, currency: string = DEFAULT_CURRENCY): string {
  if (amount === null || amount === undefined) return '-'

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numAmount)) return '-'

  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount)
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
  }).format(numAmount)
}

/**
 * Format currency range
 * 
 * @param min - Minimum amount
 * @param max - Maximum amount
 * @param currency - Currency code
 * @returns Formatted range string
 */
export function formatCurrencyRange(
  min: number | string | null | undefined,
  max: number | string | null | undefined,
  currency: string = DEFAULT_CURRENCY
): string {
  if (!min && !max) return '-'
  if (!min) return `Hingga ${formatCurrency(max, currency)}`
  if (!max) return `Mulai dari ${formatCurrency(min, currency)}`

  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`
}

// ============================================================================
// TEXT FORMATTING
// ============================================================================

/**
 * Truncate text to specified length
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 150)
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated text
 */
export function truncateText(text: string | null | undefined, maxLength: number = TEXT_LIMIT.EXCERPT_LENGTH, suffix: string = '...'): string {
  if (!text) return ''
  if (text.length <= maxLength) return text

  return text.substring(0, maxLength).trim() + suffix
}

/**
 * Generate URL-friendly slug from text
 * 
 * @param text - Text to slugify
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'id',
    trim: true,
  })
}

/**
 * Capitalize first letter of each word
 * 
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalizeWords(text: string | null | undefined): string {
  if (!text) return ''

  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Format phone number to Indonesian format
 * 
 * @param phone - Phone number
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return ''

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  // Format: 0812-3456-7890 or +62 812-3456-7890
  if (cleaned.startsWith('62')) {
    return `+62 ${cleaned.slice(2, 5)}-${cleaned.slice(5, 9)}-${cleaned.slice(9)}`
  }

  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`
  }

  return phone
}

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

/**
 * Format number with thousand separators
 * 
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined) return '0'

  const numValue = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(numValue)) return '0'

  return new Intl.NumberFormat('id-ID').format(numValue)
}

/**
 * Format percentage
 * 
 * @param value - Value to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number | null | undefined, decimals: number = 0): string {
  if (value === null || value === undefined) return '0%'

  return `${value.toFixed(decimals)}%`
}

// ============================================================================
// URL FORMATTING
// ============================================================================

/**
 * Ensure URL has protocol
 * 
 * @param url - URL to format
 * @returns URL with protocol
 */
export function ensureProtocol(url: string | null | undefined): string | null {
  if (!url) return null

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return `https://${url}`
}

/**
 * Extract domain from URL
 * 
 * @param url - URL to extract domain from
 * @returns Domain or null
 */
export function extractDomain(url: string | null | undefined): string | null {
  if (!url) return null

  try {
    const urlObj = new URL(ensureProtocol(url) || '')
    return urlObj.hostname.replace('www.', '')
  } catch (error) {
    return null
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Check if string is valid email
 * 
 * @param email - Email to validate
 * @returns True if valid email
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check if string is valid URL
 * 
 * @param url - URL to validate
 * @returns True if valid URL
 */
export function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false

  try {
    new URL(ensureProtocol(url) || '')
    return true
  } catch (error) {
    return false
  }
}
