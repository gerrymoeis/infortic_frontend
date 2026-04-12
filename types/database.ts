/**
 * TypeScript Type Definitions
 * Inferred from Drizzle schema + custom composite types
 * Based on ACTUAL 6-table database structure
 */

import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import * as schema from '@/lib/db/schema'

// ============================================================================
// BASE TABLE TYPES (Select)
// ============================================================================

export type Opportunity = InferSelectModel<typeof schema.opportunities>
export type OpportunityType = InferSelectModel<typeof schema.opportunityTypes>
export type Audience = InferSelectModel<typeof schema.audiences>
export type Organizer = InferSelectModel<typeof schema.organizers>
export type I18nLabel = InferSelectModel<typeof schema.i18nLabels>

// Junction tables
export type OpportunityAudience = InferSelectModel<typeof schema.opportunityAudiences>

// ============================================================================
// INSERT TYPES (for creating new records)
// ============================================================================

export type OpportunityInsert = InferInsertModel<typeof schema.opportunities>
export type OpportunityTypeInsert = InferInsertModel<typeof schema.opportunityTypes>
export type AudienceInsert = InferInsertModel<typeof schema.audiences>
export type OrganizerInsert = InferInsertModel<typeof schema.organizers>

// ============================================================================
// COMPOSITE TYPES (with relations)
// ============================================================================

/**
 * Opportunity with all related data
 * Used for detail pages
 */
export type OpportunityWithRelations = Opportunity & {
  type: OpportunityType & {
    label: I18nLabel | null
  }
  organizer: Organizer | null
  audiences: Array<{
    code: string
    label: string | null
  }>
}

/**
 * Simplified opportunity for list views
 * Optimized for performance
 */
export type OpportunityListItem = {
  id: string
  title: string
  slug: string
  description: string | null
  deadlineDate: string | null
  status: string
  type: {
    code: string
    label: string | null
  }
  organizer: {
    name: string
  } | null
  eventType: string | null
  feeType: string | null
  imageUrl: string | null
  createdAt: Date | null
}

/**
 * Opportunity type with label
 */
export type OpportunityTypeWithLabel = OpportunityType & {
  label: I18nLabel | null
}

/**
 * Audience with label
 */
export type AudienceWithLabel = Audience & {
  label: I18nLabel | null
}

// ============================================================================
// FILTER & SEARCH TYPES
// ============================================================================

/**
 * Filters for opportunity queries
 */
export type OpportunityFilters = {
  typeCode?: string
  audienceCode?: string
  status?: 'active' | 'expired' | 'archived'
  organizerId?: string
  eventType?: 'online' | 'offline' | 'hybrid'
  feeType?: 'gratis' | 'htm' | 'range'
  hasDeadline?: boolean
  search?: string
}

/**
 * Pagination parameters
 */
export type PaginationParams = {
  limit?: number
  offset?: number
}

/**
 * Sort parameters
 */
export type SortParams = {
  field: 'createdAt' | 'deadlineDate' | 'title'
  direction: 'asc' | 'desc'
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Paginated list response
 */
export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

/**
 * Single item response
 */
export type SingleResponse<T> = {
  data: T
}

/**
 * Error response
 */
export type ErrorResponse = {
  error: {
    message: string
    code?: string
    details?: unknown
  }
}

// ============================================================================
// CONSTANTS (Type-safe enums)
// ============================================================================

/**
 * Opportunity status values (ACTUAL values from database)
 */
export const OpportunityStatus = {
  ACTIVE: 'active', // Published and visible
  EXPIRED: 'expired', // Past deadline
  ARCHIVED: 'archived', // Manually archived
} as const

export type OpportunityStatusType = typeof OpportunityStatus[keyof typeof OpportunityStatus]

/**
 * Event type values
 */
export const EventType = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid',
} as const

export type EventTypeType = typeof EventType[keyof typeof EventType]

/**
 * Fee type values
 */
export const FeeType = {
  GRATIS: 'gratis', // Free
  HTM: 'htm', // Fixed price (Harga Tiket Masuk)
  RANGE: 'range', // Price range
} as const

export type FeeTypeType = typeof FeeType[keyof typeof FeeType]
