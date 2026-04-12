/**
 * Application Constants
 * Centralized configuration values
 */

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
} as const

// ============================================================================
// OPPORTUNITY STATUS
// ============================================================================

export const OPPORTUNITY_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active', // Published and visible
  EXPIRED: 'expired',
} as const

export type OpportunityStatus = typeof OPPORTUNITY_STATUS[keyof typeof OPPORTUNITY_STATUS]

// ============================================================================
// LOCATION TYPES
// ============================================================================

export const LOCATION_TYPE = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid',
} as const

export type LocationType = typeof LOCATION_TYPE[keyof typeof LOCATION_TYPE]

// ============================================================================
// FEE TYPES
// ============================================================================

export const FEE_TYPE = {
  GRATIS: 'gratis', // Free
  HTM: 'htm', // Fixed price (Harga Tiket Masuk)
  RANGE: 'range', // Price range
} as const

export type FeeType = typeof FEE_TYPE[keyof typeof FEE_TYPE]

// ============================================================================
// ATTRIBUTE DATA TYPES
// ============================================================================

export const ATTRIBUTE_DATA_TYPE = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ENUM: 'enum',
} as const

export type AttributeDataType = typeof ATTRIBUTE_DATA_TYPE[keyof typeof ATTRIBUTE_DATA_TYPE]

// ============================================================================
// LANGUAGE
// ============================================================================

export const LANGUAGE = {
  INDONESIAN: 'id',
  ENGLISH: 'en',
} as const

export const DEFAULT_LANGUAGE = LANGUAGE.INDONESIAN

// ============================================================================
// CURRENCY
// ============================================================================

export const CURRENCY = {
  IDR: 'IDR',
  USD: 'USD',
} as const

export const DEFAULT_CURRENCY = CURRENCY.IDR

// ============================================================================
// DATE FORMATS
// ============================================================================

export const DATE_FORMAT = {
  FULL: 'dd MMMM yyyy', // e.g., 12 April 2026
  SHORT: 'dd MMM yyyy', // e.g., 12 Apr 2026
  NUMERIC: 'dd/MM/yyyy', // e.g., 12/04/2026
  ISO: 'yyyy-MM-dd', // e.g., 2026-04-12
} as const

// ============================================================================
// ISR REVALIDATION (Incremental Static Regeneration)
// ============================================================================

export const REVALIDATE = {
  HOMEPAGE: 3600, // 1 hour
  OPPORTUNITY_LIST: 3600, // 1 hour
  OPPORTUNITY_DETAIL: 3600, // 1 hour
  CATEGORY_PAGE: 86400, // 24 hours
  STATIC_PAGE: 604800, // 1 week
} as const

// ============================================================================
// CACHE TAGS (for on-demand revalidation)
// ============================================================================

export const CACHE_TAG = {
  OPPORTUNITIES: 'opportunities',
  OPPORTUNITY_TYPES: 'opportunity-types',
  AUDIENCES: 'audiences',
  ORGANIZERS: 'organizers',
} as const

// ============================================================================
// OPPORTUNITY TYPE CODES
// ============================================================================

export const OPPORTUNITY_TYPE_CODE = {
  COMPETITION: 'competition',
  SCHOLARSHIP: 'scholarship',
  INTERNSHIP: 'internship',
  JOB: 'job',
  FREELANCE: 'freelance',
  FESTIVAL: 'festival',
  TRAINING: 'training',
  WORKSHOP: 'workshop',
  HACKATHON: 'hackathon',
  TRYOUT: 'tryout',
} as const

// ============================================================================
// AUDIENCE CODES
// ============================================================================

export const AUDIENCE_CODE = {
  SD: 'sd', // Elementary school
  SMP: 'smp', // Junior high school
  SMA: 'sma', // Senior high school
  SMK: 'smk', // Vocational high school
  D2: 'd2', // Diploma 2
  D3: 'd3', // Diploma 3
  D4: 'd4', // Diploma 4
  S1: 's1', // Bachelor's degree
  UMUM: 'umum', // General/public
} as const

// ============================================================================
// PROMOTION
// ============================================================================

export const PROMOTION = {
  DEFAULT_PRIORITY: 10,
  MAX_PRIORITY: 100,
  MIN_PRIORITY: 1,
} as const

// ============================================================================
// TEXT LIMITS
// ============================================================================

export const TEXT_LIMIT = {
  TITLE_MAX: 200,
  DESCRIPTION_MAX: 5000,
  SLUG_MAX: 100,
  EXCERPT_LENGTH: 150, // For truncated descriptions
} as const

// ============================================================================
// VALIDATION
// ============================================================================

export const VALIDATION = {
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
} as const
