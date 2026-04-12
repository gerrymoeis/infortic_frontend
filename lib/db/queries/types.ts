/**
 * Opportunity Type Queries
 * Repository pattern for opportunity type data access
 */

import { db } from '../client'
import { opportunityTypes, i18nLabels } from '../schema'
import { eq } from 'drizzle-orm'
import type { OpportunityTypeWithLabel } from '@/types/database'

/**
 * Get all opportunity types with labels
 * Used for filters and navigation
 * 
 * @returns Array of opportunity types with labels
 */
export async function getAllOpportunityTypes(): Promise<OpportunityTypeWithLabel[]> {
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
}

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
 * @returns Array of opportunity types with labels and counts
 */
export async function getOpportunityTypesWithCounts() {
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
}
