/**
 * Opportunity Queries
 * Repository pattern for opportunity data access
 */

import { db } from '../client'
import { opportunities, opportunityTypes, audiences, organizers, i18nLabels, opportunityAudiences, promotions } from '../schema'
import { eq, desc, and, gte, or, ilike, sql, asc } from 'drizzle-orm'
import type { OpportunityFilters, PaginationParams, SortParams, OpportunityListItem } from '@/types/database'

/**
 * Get published opportunities with basic relations
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
      typeCode: opportunityTypes.code,
      typeLabel: i18nLabels.value,
      organizerName: organizers.name,
      isPromoted: sql<boolean>`CASE 
        WHEN ${promotions.active} = true 
        AND (${promotions.endsAt} IS NULL OR ${promotions.endsAt} > NOW()) 
        THEN true 
        ELSE false 
      END`,
      promotionPriority: promotions.priority,
    })
    .from(opportunities)
    .leftJoin(opportunityTypes, eq(opportunities.typeId, opportunityTypes.id))
    .leftJoin(i18nLabels, eq(opportunityTypes.labelId, i18nLabels.id))
    .leftJoin(organizers, eq(opportunities.organizerId, organizers.id))
    .leftJoin(promotions, eq(opportunities.id, promotions.opportunityId))
    .where(
      and(
        eq(opportunities.status, 'active'),
        or(
          gte(opportunities.deadlineDate, new Date().toISOString().split('T')[0]),
          sql`${opportunities.deadlineDate} IS NULL`
        )
      )
    )
    .orderBy(
      desc(sql`CASE WHEN ${promotions.active} = true THEN ${promotions.priority} ELSE 0 END`),
      desc(opportunities.createdAt)
    )
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
    type: {
      code: row.typeCode || '',
      label: row.typeLabel,
    },
    organizer: row.organizerName ? {
      name: row.organizerName,
    } : null,
    isPromoted: row.isPromoted || false,
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

  // Get promotion
  const promotionData = await db
    .select()
    .from(promotions)
    .where(eq(promotions.opportunityId, opp.opportunity.id))
    .limit(1)

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
    promotion: promotionData[0] || null,
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
      typeCode: opportunityTypes.code,
      typeLabel: i18nLabels.value,
      organizerName: organizers.name,
      isPromoted: sql<boolean>`CASE 
        WHEN ${promotions.active} = true 
        AND (${promotions.endsAt} IS NULL OR ${promotions.endsAt} > NOW()) 
        THEN true 
        ELSE false 
      END`,
    })
    .from(opportunities)
    .leftJoin(opportunityTypes, eq(opportunities.typeId, opportunityTypes.id))
    .leftJoin(i18nLabels, eq(opportunityTypes.labelId, i18nLabels.id))
    .leftJoin(organizers, eq(opportunities.organizerId, organizers.id))
    .leftJoin(promotions, eq(opportunities.id, promotions.opportunityId))
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
    .orderBy(
      desc(sql`CASE WHEN ${promotions.active} = true THEN ${promotions.priority} ELSE 0 END`),
      desc(opportunities.createdAt)
    )
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
    type: {
      code: row.typeCode || '',
      label: row.typeLabel,
    },
    organizer: row.organizerName ? {
      name: row.organizerName,
    } : null,
    isPromoted: row.isPromoted || false,
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
      typeCode: opportunityTypes.code,
      typeLabel: i18nLabels.value,
      organizerName: organizers.name,
      isPromoted: sql<boolean>`CASE 
        WHEN ${promotions.active} = true 
        AND (${promotions.endsAt} IS NULL OR ${promotions.endsAt} > NOW()) 
        THEN true 
        ELSE false 
      END`,
    })
    .from(opportunities)
    .leftJoin(opportunityTypes, eq(opportunities.typeId, opportunityTypes.id))
    .leftJoin(i18nLabels, eq(opportunityTypes.labelId, i18nLabels.id))
    .leftJoin(organizers, eq(opportunities.organizerId, organizers.id))
    .leftJoin(promotions, eq(opportunities.id, promotions.opportunityId))
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
    .orderBy(
      desc(sql`CASE WHEN ${promotions.active} = true THEN ${promotions.priority} ELSE 0 END`),
      desc(opportunities.createdAt)
    )
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
    type: {
      code: row.typeCode || '',
      label: row.typeLabel,
    },
    organizer: row.organizerName ? {
      name: row.organizerName,
    } : null,
    isPromoted: row.isPromoted || false,
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
      typeCode: opportunityTypes.code,
      typeLabel: i18nLabels.value,
      organizerName: organizers.name,
      isPromoted: sql<boolean>`CASE 
        WHEN ${promotions.active} = true 
        AND (${promotions.endsAt} IS NULL OR ${promotions.endsAt} > NOW()) 
        THEN true 
        ELSE false 
      END`,
    })
    .from(opportunities)
    .leftJoin(opportunityTypes, eq(opportunities.typeId, opportunityTypes.id))
    .leftJoin(i18nLabels, eq(opportunityTypes.labelId, i18nLabels.id))
    .leftJoin(organizers, eq(opportunities.organizerId, organizers.id))
    .leftJoin(promotions, eq(opportunities.id, promotions.opportunityId))
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
    type: {
      code: row.typeCode || '',
      label: row.typeLabel,
    },
    organizer: row.organizerName ? {
      name: row.organizerName,
    } : null,
    isPromoted: row.isPromoted || false,
  }))
}

/**
 * Get promoted opportunities
 * 
 * @param limit - Number of results
 * @returns Array of opportunity list items
 */
export async function getPromotedOpportunities(limit: number = 5): Promise<OpportunityListItem[]> {
  const results = await db
    .select({
      id: opportunities.id,
      title: opportunities.title,
      slug: opportunities.slug,
      description: opportunities.description,
      deadlineDate: opportunities.deadlineDate,
      status: opportunities.status,
      createdAt: opportunities.createdAt,
      typeCode: opportunityTypes.code,
      typeLabel: i18nLabels.value,
      organizerName: organizers.name,
      isPromoted: sql<boolean>`true`,
      promotionPriority: promotions.priority,
    })
    .from(opportunities)
    .leftJoin(opportunityTypes, eq(opportunities.typeId, opportunityTypes.id))
    .leftJoin(i18nLabels, eq(opportunityTypes.labelId, i18nLabels.id))
    .leftJoin(organizers, eq(opportunities.organizerId, organizers.id))
    .innerJoin(promotions, eq(opportunities.id, promotions.opportunityId))
    .where(
      and(
        eq(opportunities.status, 'active'),
        eq(promotions.active, true),
        or(
          sql`${promotions.endsAt} IS NULL`,
          gte(promotions.endsAt, new Date())
        )
      )
    )
    .orderBy(desc(promotions.priority), desc(opportunities.createdAt))
    .limit(limit)

  return results.map(row => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    deadlineDate: row.deadlineDate,
    status: row.status,
    createdAt: row.createdAt,
    type: {
      code: row.typeCode || '',
      label: row.typeLabel,
    },
    organizer: row.organizerName ? {
      name: row.organizerName,
    } : null,
    isPromoted: true,
  }))
}

/**
 * Count total published opportunities
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

