/**
 * Opportunity Type Queries
 * Repository pattern for opportunity type data access
 * 
 * OPTIMIZATION: All queries are cached with Next.js unstable_cache
 * Cache duration: 24 hours (86400 seconds) - types rarely change
 */

import { unstable_cache } from 'next/cache'
import { db } from '../client'
import { opportunityTypes, i18nLabels } from '../schema'
import { eq } from 'drizzle-orm'
import type { OpportunityTypeWithLabel } from '@/types/database'

/**
 * Get all opportunity types with labels
 * Used for filters and navigation
 * 
 * CACHED: 24 hours (86400 seconds)
 * 
 * @returns Array of opportunity types with labels
 */
export const getAllOpportunityTypes = unstable_cache(
  async (): Promise<OpportunityTypeWithLabel[]> => {
    const results = await db
      .select({
        id: opportunityTypes.id,
        code: opportunityTypes.code,
        labelId: opportunityTypes.labelId,
        label: i18nLabels,
      })
      .from(opportunityTypes)
      .leftJoin(i18nLabels, eq(opportunityTypes.labelId, i18nLabels.id))
      .orderBy(opportunityTypes.code)

    return results.map(row => ({
      id: row.id,
      code: row.code,
      labelId: row.labelId,
      label: row.label,
    }))
  },
  ['opportunity-types-all'],
  {
    revalidate: 86400, // 24 hours
    tags: ['types']
  }
)

/**
 * Get opportunity type by code
 * 
 * @param code - Type code (e.g., 'competition', 'scholarship')
 * @returns Opportunity type with label or null
 */
export async function getOpportunityTypeByCode(code: string): Promise<OpportunityTypeWithLabel | null> {
  const results = await db
    .select({
      id: opportunityTypes.id,
      code: opportunityTypes.code,
      labelId: opportunityTypes.labelId,
      label: i18nLabels,
    })
    .from(opportunityTypes)
    .leftJoin(i18nLabels, eq(opportunityTypes.labelId, i18nLabels.id))
    .where(eq(opportunityTypes.code, code))
    .limit(1)

  if (!results[0]) return null

  return {
    id: results[0].id,
    code: results[0].code,
    labelId: results[0].labelId,
    label: results[0].label,
  }
}

/**
 * Get opportunity type by ID
 * 
 * @param id - Type UUID
 * @returns Opportunity type with label or null
 */
export async function getOpportunityTypeById(id: string): Promise<OpportunityTypeWithLabel | null> {
  const results = await db
    .select({
      id: opportunityTypes.id,
      code: opportunityTypes.code,
      labelId: opportunityTypes.labelId,
      label: i18nLabels,
    })
    .from(opportunityTypes)
    .leftJoin(i18nLabels, eq(opportunityTypes.labelId, i18nLabels.id))
    .where(eq(opportunityTypes.id, id))
    .limit(1)

  if (!results[0]) return null

  return {
    id: results[0].id,
    code: results[0].code,
    labelId: results[0].labelId,
    label: results[0].label,
  }
}

/**
 * Get all opportunity types with count of active opportunities
 * Used for category index page
 * 
 * CACHED: 1 hour (3600 seconds)
 * 
 * @returns Array of opportunity types with labels and counts
 */
export const getOpportunityTypesWithCounts = unstable_cache(
  async () => {
    const { opportunities } = await import('../schema')
    const { sql, and, or, gte } = await import('drizzle-orm')

    const results = await db
      .select({
        id: opportunityTypes.id,
        code: opportunityTypes.code,
        labelId: opportunityTypes.labelId,
        label: i18nLabels,
        count: sql<number>`count(${opportunities.id})`,
      })
      .from(opportunityTypes)
      .leftJoin(i18nLabels, eq(opportunityTypes.labelId, i18nLabels.id))
      .leftJoin(
        opportunities,
        and(
          eq(opportunities.typeId, opportunityTypes.id),
          eq(opportunities.status, 'active'),
          or(
            gte(opportunities.deadlineDate, new Date().toISOString().split('T')[0]),
            sql`${opportunities.deadlineDate} IS NULL`
          )
        )
      )
      .groupBy(opportunityTypes.id, opportunityTypes.code, opportunityTypes.labelId, i18nLabels.id, i18nLabels.language, i18nLabels.value)
      .orderBy(opportunityTypes.code)

    return results.map(row => ({
      id: row.id,
      code: row.code,
      labelId: row.labelId,
      label: row.label,
      count: Number(row.count || 0),
    }))
  },
  ['opportunity-types-with-counts'],
  {
    revalidate: 3600, // 1 hour
    tags: ['types', 'opportunities']
  }
)
