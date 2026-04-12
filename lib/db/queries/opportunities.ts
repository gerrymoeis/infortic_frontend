/**
 * Opportunity Queries
 * Repository pattern for opportunity data access
 * Based on ACTUAL 6-table database structure
 */

import { db } from '../client'
import { opportunities, opportunityTypes, audiences, organizers, i18nLabels, opportunityAudiences } from '../schema'
import { eq, desc, and, gte, or, ilike, sql } from 'drizzle-orm'
import type { OpportunityListItem } from '@/types/database'

/**
 * Get active opportunities with basic relations
 * Optimized for list views
 * 
 * @param limit - Number of results (default: 20)
 * @param offset - Offset for pagination (default: 0)
 * @returns Array of opportunity list items
 */
export async function getPublishedOpportunities(
  limit: number = 20,
  offset: number = 0
): Promise<OpportunityListItem[]> {
  const results = await db
    .select({
      id: opportunities.id,
      title: opportunities.title,
      slug: opportunities.slug,
      description: opportunities.description,
      deadlineDate: opportunities.deadlineDate,
      status: opportunities.status,
      createdAt: opportunities.createdAt,
      eventType: opportunities.eventType,
      feeType: opportunities.feeType,
      imageUrl: opportunities.imageUrl,
      typeCode: opportunityTypes.code,
      typeLabel: i18nLabels.value,
      organizerName: organizers.name,
    })
    .from(opportunities)
    .leftJoin(opportunityTypes, eq(opportunities.typeId, opportunityTypes.id))
    .leftJoin(i18nLabels, eq(opportunityTypes.labelId, i18nLabels.id))
    .leftJoin(organizers, eq(opportunities.organizerId, organizers.id))
    .where(
      and(
        eq(opportunities.status, 'active'),
        or(
          gte(opportunities.deadlineDate, new Date().toISOString().split('T')[0]),
          sql`${opportunities.deadlineDate} IS NULL`
        )
      )
    )
    .orderBy(desc(opportunities.createdAt))
    .limit(limit)
    .offset(offset)

  return results.map(row => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    deadlineDate: row.deadlineDate,
    status: row.status,
    createdAt: row.createdAt,
    eventType: row.eventType,
    feeType: row.feeType,
    imageUrl: row.imageUrl,
    type: {
      code: row.typeCode || '',
      label: row.typeLabel,
    },
    organizer: row.organizerName ? {
      name: row.organizerName,
    } : null,
  }))
}

/**
 * Get opportunity by slug with all relations
 * Used for detail pages
 * 
 * @param slug - Opportunity slug
 * @returns Opportunity with all relations or null
 */
export async function getOpportunityBySlug(slug: string) {
  // Get main opportunity data
  const result = await db
    .select({
      opportunity: opportunities,
      type: opportunityTypes,
      typeLabel: i18nLabels,
      organizer: organizers,
    })
    .from(opportunities)
    .leftJoin(opportunityTypes, eq(opportunities.typeId, opportunityTypes.id))
    .leftJoin(i18nLabels, eq(opportunityTypes.labelId, i18nLabels.id))
    .leftJoin(organizers, eq(opportunities.organizerId, organizers.id))
    .where(eq(opportunities.slug, slug))
    .limit(1)

  if (!result[0]) return null

  const opp = result[0]

  // Get audiences
  const audiencesData = await db
    .select({
      code: audiences.code,
      label: i18nLabels.value,
    })
    .from(opportunityAudiences)
    .leftJoin(audiences, eq(opportunityAudiences.audienceId, audiences.id))
    .leftJoin(i18nLabels, eq(audiences.labelId, i18nLabels.id))
    .where(eq(opportunityAudiences.opportunityId, opp.opportunity.id))

  return {
    ...opp.opportunity,
    type: {
      ...opp.type!,
      label: opp.typeLabel,
    },
    organizer: opp.organizer,
    audiences: audiencesData.map(a => ({
      code: a.code || '',
      label: a.label,
    })),
  }
}

/**
 * Get opportunity by ID
 * 
 * @param id - Opportunity UUID
 * @returns Opportunity or null
 */
export async function getOpportunityById(id: string) {
  const result = await db
    .select()
    .from(opportunities)
    .where(eq(opportunities.id, id))
    .limit(1)

  return result[0] || null
}

/**
 * Get opportunities filtered by type
 * 
 * @param typeCode - Opportunity type code (e.g., 'competition', 'scholarship')
 * @param limit - Number of results
 * @param offset - Offset for pagination
 * @returns Array of opportunity list items
 */
export async function getOpportunitiesByType(
  typeCode: string,
  limit: number = 20,
  offset: number = 0
): Promise<OpportunityListItem[]> {
  const results = await db
    .select({
      id: opportunities.id,
      title: opportunities.title,
      slug: opportunities.slug,
      description: opportunities.description,
      deadlineDate: opportunities.deadlineDate,
      status: opportunities.status,
      createdAt: opportunities.createdAt,
      eventType: opportunities.eventType,
      feeType: opportunities.feeType,
      imageUrl: opportunities.imageUrl,
      typeCode: opportunityTypes.code,
      typeLabel: i18nLabels.value,
      organizerName: organizers.name,
    })
    .from(opportunities)
    .leftJoin(opportunityTypes, eq(opportunities.typeId, opportunityTypes.id))
    .leftJoin(i18nLabels, eq(opportunityTypes.labelId, i18nLabels.id))
    .leftJoin(organizers, eq(opportunities.organizerId, organizers.id))
    .where(
      and(
        eq(opportunities.status, 'active'),
        eq(opportunityTypes.code, typeCode),
        or(
          gte(opportunities.deadlineDate, new Date().toISOString().split('T')[0]),
          sql`${opportunities.deadlineDate} IS NULL`
        )
      )
    )
    .orderBy(desc(opportunities.createdAt))
    .limit(limit)
    .offset(offset)

  return results.map(row => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    deadlineDate: row.deadlineDate,
    status: row.status,
    createdAt: row.createdAt,
    eventType: row.eventType,
    feeType: row.feeType,
    imageUrl: row.imageUrl,
    type: {
      code: row.typeCode || '',
      label: row.typeLabel,
    },
    organizer: row.organizerName ? {
      name: row.organizerName,
    } : null,
  }))
}

/**
 * Get opportunities filtered by audience
 * 
 * @param audienceCode - Audience code (e.g., 'sma', 's1', 'umum')
 * @param limit - Number of results
 * @param offset - Offset for pagination
 * @returns Array of opportunity list items
 */
export async function getOpportunitiesByAudience(
  audienceCode: string,
  limit: number = 20,
  offset: number = 0
): Promise<OpportunityListItem[]> {
  const results = await db
    .select({
      id: opportunities.id,
      title: opportunities.title,
      slug: opportunities.slug,
      description: opportunities.description,
      deadlineDate: opportunities.deadlineDate,
      status: opportunities.status,
      createdAt: opportunities.createdAt,
      eventType: opportunities.eventType,
      feeType: opportunities.feeType,
      imageUrl: opportunities.imageUrl,
      typeCode: opportunityTypes.code,
      typeLabel: i18nLabels.value,
      organizerName: organizers.name,
    })
    .from(opportunities)
    .leftJoin(opportunityTypes, eq(opportunities.typeId, opportunityTypes.id))
    .leftJoin(i18nLabels, eq(opportunityTypes.labelId, i18nLabels.id))
    .leftJoin(organizers, eq(opportunities.organizerId, organizers.id))
    .innerJoin(opportunityAudiences, eq(opportunities.id, opportunityAudiences.opportunityId))
    .innerJoin(audiences, and(
      eq(opportunityAudiences.audienceId, audiences.id),
      eq(audiences.code, audienceCode)
    ))
    .where(
      and(
        eq(opportunities.status, 'active'),
        or(
          gte(opportunities.deadlineDate, new Date().toISOString().split('T')[0]),
          sql`${opportunities.deadlineDate} IS NULL`
        )
      )
    )
    .orderBy(desc(opportunities.createdAt))
    .limit(limit)
    .offset(offset)

  return results.map(row => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    deadlineDate: row.deadlineDate,
    status: row.status,
    createdAt: row.createdAt,
    eventType: row.eventType,
    feeType: row.feeType,
    imageUrl: row.imageUrl,
    type: {
      code: row.typeCode || '',
      label: row.typeLabel,
    },
    organizer: row.organizerName ? {
      name: row.organizerName,
    } : null,
  }))
}

/**
 * Search opportunities by title or description
 * 
 * @param query - Search query
 * @param limit - Number of results
 * @param offset - Offset for pagination
 * @returns Array of opportunity list items
 */
export async function searchOpportunities(
  query: string,
  limit: number = 20,
  offset: number = 0
): Promise<OpportunityListItem[]> {
  const searchPattern = `%${query}%`

  const results = await db
    .select({
      id: opportunities.id,
      title: opportunities.title,
      slug: opportunities.slug,
      description: opportunities.description,
      deadlineDate: opportunities.deadlineDate,
      status: opportunities.status,
      createdAt: opportunities.createdAt,
      eventType: opportunities.eventType,
      feeType: opportunities.feeType,
      imageUrl: opportunities.imageUrl,
      typeCode: opportunityTypes.code,
      typeLabel: i18nLabels.value,
      organizerName: organizers.name,
    })
    .from(opportunities)
    .leftJoin(opportunityTypes, eq(opportunities.typeId, opportunityTypes.id))
    .leftJoin(i18nLabels, eq(opportunityTypes.labelId, i18nLabels.id))
    .leftJoin(organizers, eq(opportunities.organizerId, organizers.id))
    .where(
      and(
        eq(opportunities.status, 'active'),
        or(
          ilike(opportunities.title, searchPattern),
          ilike(opportunities.description, searchPattern)
        )
      )
    )
    .orderBy(desc(opportunities.createdAt))
    .limit(limit)
    .offset(offset)

  return results.map(row => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    deadlineDate: row.deadlineDate,
    status: row.status,
    createdAt: row.createdAt,
    eventType: row.eventType,
    feeType: row.feeType,
    imageUrl: row.imageUrl,
    type: {
      code: row.typeCode || '',
      label: row.typeLabel,
    },
    organizer: row.organizerName ? {
      name: row.organizerName,
    } : null,
  }))
}

/**
 * Count total active opportunities
 * Used for pagination
 * 
 * @returns Total count
 */
export async function countPublishedOpportunities(): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(opportunities)
    .where(
      and(
        eq(opportunities.status, 'active'),
        or(
          gte(opportunities.deadlineDate, new Date().toISOString().split('T')[0]),
          sql`${opportunities.deadlineDate} IS NULL`
        )
      )
    )

  return Number(result[0]?.count || 0)
}
