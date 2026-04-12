/**
 * TypeScript Type Definitions
 * Inferred from Drizzle schema + custom composite types
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
export type Location = InferSelectModel<typeof schema.locations>
export type Fee = InferSelectModel<typeof schema.fees>
export type Tag = InferSelectModel<typeof schema.tags>
export type Attribute = InferSelectModel<typeof schema.attributes>
export type I18nLabel = InferSelectModel<typeof schema.i18nLabels>
export type Promotion = InferSelectModel<typeof schema.promotions>

// Junction tables
export type OpportunityAudience = InferSelectModel<typeof schema.opportunityAudiences>
export type OpportunityFee = InferSelectModel<typeof schema.opportunityFees>
export type OpportunityTag = InferSelectModel<typeof schema.opportunityTags>
export type OpportunityAttribute = InferSelectModel<typeof schema.opportunityAttributes>

// ============================================================================
// INSERT TYPES (for creating new records)
// ============================================================================

export type OpportunityInsert = InferInsertModel<typeof schema.opportunities>
export type OpportunityTypeInsert = InferInsertModel<typeof schema.opportunityTypes>
export type AudienceInsert = InferInsertModel<typeof schema.audiences>
export type OrganizerInsert = InferInsertModel<typeof schema.organizers>
export type LocationInsert = InferInsertModel<typeof schema.locations>
export type FeeInsert = InferInsertModel<typeof schema.fees>
export type TagInsert = InferInsertModel<typeof schema.tags>
export type PromotionInsert = InferInsertModel<typeof schema.promotions>

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
  location: Location | null
  audiences: Array<{
    audience: Audience & {
      label: I18nLabel | null
    }
  }>
  fees: Array<{
    fee: Fee
  }>
  tags: Array<{
    tag: Tag & {
      label: I18nLabel | null
    }
  }>
  promotion: Promotion | null
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
  isPromoted: boolean
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

/**
 * Tag with label
 */
export type TagWithLabel = Tag & {
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
  status?: 'draft' | 'published' | 'expired'
  organizerId?: string
  hasDeadline?: boolean
  isPromoted?: boolean
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
  field: 'createdAt' | 'deadlineDate' | 'title' | 'priority'
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
 * Opportunity status values
 */
export const OpportunityStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active', // Published and visible
  EXPIRED: 'expired',
} as const

export type OpportunityStatusType = typeof OpportunityStatus[keyof typeof OpportunityStatus]

/**
 * Location type values
 */
export const LocationType = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid',
} as const

export type LocationTypeType = typeof LocationType[keyof typeof LocationType]

/**
 * Fee type values
 */
export const FeeType = {
  GRATIS: 'gratis', // Free
  HTM: 'htm', // Fixed price (Harga Tiket Masuk)
  RANGE: 'range', // Price range
} as const

export type FeeTypeType = typeof FeeType[keyof typeof FeeType]

/**
 * Attribute data type values
 */
export const AttributeDataType = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ENUM: 'enum',
} as const

export type AttributeDataTypeType = typeof AttributeDataType[keyof typeof AttributeDataType]
