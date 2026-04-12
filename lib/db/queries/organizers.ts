/**
 * Organizer Queries
 * Repository pattern for organizer data access
 */

import { db } from '../client'
import { organizers } from '../schema'
import { eq, ilike } from 'drizzle-orm'
import type { Organizer } from '@/types/database'

/**
 * Get organizer by ID
 * 
 * @param id - Organizer UUID
 * @returns Organizer or null
 */
export async function getOrganizerById(id: string): Promise<Organizer | null> {
  const results = await db
    .select()
    .from(organizers)
    .where(eq(organizers.id, id))
    .limit(1)

  return results[0] || null
}

/**
 * Get organizer by name (exact match)
 * 
 * @param name - Organizer name
 * @returns Organizer or null
 */
export async function getOrganizerByName(name: string): Promise<Organizer | null> {
  const results = await db
    .select()
    .from(organizers)
    .where(eq(organizers.name, name))
    .limit(1)

  return results[0] || null
}

/**
 * Search organizers by name (partial match)
 * 
 * @param query - Search query
 * @param limit - Number of results
 * @returns Array of organizers
 */
export async function searchOrganizers(query: string, limit: number = 10): Promise<Organizer[]> {
  const searchPattern = `%${query}%`

  const results = await db
    .select()
    .from(organizers)
    .where(ilike(organizers.name, searchPattern))
    .limit(limit)

  return results
}

/**
 * Get all organizers
 * 
 * @returns Array of organizers
 */
export async function getAllOrganizers(): Promise<Organizer[]> {
  const results = await db
    .select()
    .from(organizers)
    .orderBy(organizers.name)

  return results
}
