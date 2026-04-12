/**
 * Validation Utilities
 * Zod schemas for runtime validation
 */

import { z } from 'zod'
import { OPPORTUNITY_STATUS, EVENT_TYPE, FEE_TYPE, TEXT_LIMIT, VALIDATION } from './constants'

// ============================================================================
// OPPORTUNITY SCHEMAS
// ============================================================================

/**
 * Opportunity filter schema
 */
export const opportunityFilterSchema = z.object({
  typeCode: z.string().optional(),
  audienceCode: z.string().optional(),
  status: z.enum([OPPORTUNITY_STATUS.ACTIVE, OPPORTUNITY_STATUS.EXPIRED, OPPORTUNITY_STATUS.ARCHIVED]).optional(),
  organizerId: z.string().uuid().optional(),
  hasDeadline: z.boolean().optional(),
  search: z.string().min(VALIDATION.MIN_SEARCH_LENGTH).max(VALIDATION.MAX_SEARCH_LENGTH).optional(),
})

export type OpportunityFilterInput = z.infer<typeof opportunityFilterSchema>

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
})

export type PaginationInput = z.infer<typeof paginationSchema>

/**
 * Sort schema
 */
export const sortSchema = z.object({
  field: z.enum(['createdAt', 'deadlineDate', 'title', 'priority']),
  direction: z.enum(['asc', 'desc']),
})

export type SortInput = z.infer<typeof sortSchema>

/**
 * Search query schema
 */
export const searchQuerySchema = z.object({
  q: z.string().min(VALIDATION.MIN_SEARCH_LENGTH).max(VALIDATION.MAX_SEARCH_LENGTH),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
})

export type SearchQueryInput = z.infer<typeof searchQuerySchema>

// ============================================================================
// SUBMISSION SCHEMAS (for paid features)
// ============================================================================

/**
 * Event submission schema
 */
export const eventSubmissionSchema = z.object({
  title: z.string().min(5).max(TEXT_LIMIT.TITLE_MAX),
  description: z.string().min(20).max(TEXT_LIMIT.DESCRIPTION_MAX),
  typeCode: z.string(),
  organizerName: z.string().min(2).max(200),
  organizerWebsite: z.string().url().optional().or(z.literal('')),
  organizerContact: z.string().optional(),
  applyUrl: z.string().url(),
  startDate: z.string().date().optional().or(z.literal('')),
  endDate: z.string().date().optional().or(z.literal('')),
  deadlineDate: z.string().date(),
  audienceCodes: z.array(z.string()).min(1),
  eventType: z.enum([EVENT_TYPE.ONLINE, EVENT_TYPE.OFFLINE, EVENT_TYPE.HYBRID]).optional(),
  locationCity: z.string().optional(),
  locationProvince: z.string().optional(),
  feeType: z.enum([FEE_TYPE.GRATIS, FEE_TYPE.HTM, FEE_TYPE.RANGE]).optional(),
  feeAmount: z.number().nonnegative().optional(),
  imageFile: z.instanceof(File).optional(),
})

export type EventSubmissionInput = z.infer<typeof eventSubmissionSchema>

/**
 * Promotion purchase schema
 */
export const promotionPurchaseSchema = z.object({
  opportunityId: z.string().uuid(),
  priority: z.number().int().min(1).max(100),
  durationDays: z.number().int().positive().max(90),
})

export type PromotionPurchaseInput = z.infer<typeof promotionPurchaseSchema>

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

/**
 * Admin login schema
 */
export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type AdminLoginInput = z.infer<typeof adminLoginSchema>

/**
 * Submission review schema
 */
export const submissionReviewSchema = z.object({
  submissionId: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
  reason: z.string().optional(),
})

export type SubmissionReviewInput = z.infer<typeof submissionReviewSchema>

/**
 * Opportunity update schema
 */
export const opportunityUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(5).max(TEXT_LIMIT.TITLE_MAX).optional(),
  description: z.string().min(20).max(TEXT_LIMIT.DESCRIPTION_MAX).optional(),
  status: z.enum([OPPORTUNITY_STATUS.ACTIVE, OPPORTUNITY_STATUS.EXPIRED, OPPORTUNITY_STATUS.ARCHIVED]).optional(),
  applyUrl: z.string().url().optional(),
  deadlineDate: z.string().date().optional(),
})

export type OpportunityUpdateInput = z.infer<typeof opportunityUpdateSchema>

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate and parse data with Zod schema
 * 
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Parsed data or throws error
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

/**
 * Safely validate data without throwing
 * 
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Success result with data or error result
 */
export function safeValidateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, error: result.error }
}

/**
 * Format Zod error for user-friendly display
 * 
 * @param error - Zod error
 * @returns Formatted error messages
 */
export function formatZodError(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {}

  error.issues.forEach((err) => {
    const path = err.path.join('.')
    formatted[path] = err.message
  })

  return formatted
}

/**
 * Get first error message from Zod error
 * 
 * @param error - Zod error
 * @returns First error message
 */
export function getFirstErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message || 'Validation error'
}

// ============================================================================
// CUSTOM VALIDATORS
// ============================================================================

/**
 * Validate Indonesian phone number
 */
export const indonesianPhoneSchema = z.string().regex(
  /^(\+62|62|0)[0-9]{9,12}$/,
  'Nomor telepon tidak valid. Format: 08xx-xxxx-xxxx atau +62xxx-xxxx-xxxx'
)

/**
 * Validate date is in the future
 */
export const futureDateSchema = z.string().refine(
  (date) => {
    const dateObj = new Date(date)
    return dateObj > new Date()
  },
  { message: 'Tanggal harus di masa depan' }
)

/**
 * Validate date range (end date after start date)
 */
export function validateDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return end > start
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * Validate image file
 */
export const imageFileSchema = z.instanceof(File).refine(
  (file) => validateFileSize(file, 5), // Max 5MB
  { message: 'Ukuran file maksimal 5MB' }
).refine(
  (file) => validateFileType(file, ['image/jpeg', 'image/png', 'image/webp']),
  { message: 'Format file harus JPEG, PNG, atau WebP' }
)
