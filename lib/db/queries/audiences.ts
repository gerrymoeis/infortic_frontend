/**
 * Audience Queries
 * Repository pattern for audience data access
 */

import { db } from '../client'
import { audiences, i18nLabels } from '../schema'
import { eq } from 'drizzle-orm'
import type { AudienceWithLabel } from '@/types/database'

/**
 * Get all audiences with labels
 * Used for filters
 * 
 * @returns Array of audiences with labels
 */
export async function getAllAudiences(): Promise<AudienceWithLabel[]> {
  const results = await db
    .select({
      id: audiences.id,
      code: audiences.code,
      labelId: audiences.labelId,
      label: i18nLabels,
    })
    .from(audiences)
    .leftJoin(i18nLabels, eq(audiences.labelId, i18nLabels.id))
    .orderBy(audiences.code)

  return results.map(row => ({
    id: row.id,
    code: row.code,
    labelId: row.labelId,
    label: row.label,
  }))
}

/**
 * Get audience by code
 * 
 * @param code - Audience code (e.g., 'sma', 's1', 'umum')
 * @returns Audience with label or null
 */
export async function getAudienceByCode(code: string): Promise<AudienceWithLabel | null> {
  const results = await db
    .select({
      id: audiences.id,
      code: audiences.code,
      labelId: audiences.labelId,
      label: i18nLabels,
    })
    .from(audiences)
    .leftJoin(i18nLabels, eq(audiences.labelId, i18nLabels.id))
    .where(eq(audiences.code, code))
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
 * Get audience by ID
 * 
 * @param id - Audience UUID
 * @returns Audience with label or null
 */
export async function getAudienceById(id: string): Promise<AudienceWithLabel | null> {
  const results = await db
    .select({
      id: audiences.id,
      code: audiences.code,
      labelId: audiences.labelId,
      label: i18nLabels,
    })
    .from(audiences)
    .leftJoin(i18nLabels, eq(audiences.labelId, i18nLabels.id))
    .where(eq(audiences.id, id))
    .limit(1)

  if (!results[0]) return null

  return {
    id: results[0].id,
    code: results[0].code,
    labelId: results[0].labelId,
    label: results[0].label,
  }
}
