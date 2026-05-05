/**
 * Database Client Configuration
 * Drizzle ORM with Neon serverless driver
 * 
 * Connection: Neon PostgreSQL (serverless)
 * Compatible with: Cloudflare Workers, Edge Runtime, Node.js
 * Uses HTTP for connections (no WebSocket needed)
 */

import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

/**
 * Get database connection string
 * Throws error if not set
 */
function getConnectionString(): string {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please check your .env.local file.'
    )
  }
  
  return connectionString
}

/**
 * Singleton instance
 */
let dbInstance: ReturnType<typeof drizzle> | null = null

/**
 * Get or create database instance
 * Lazy initialization - only creates connection when first used
 */
function getDb() {
  if (!dbInstance) {
    const connectionString = getConnectionString()
    
    // Create Neon HTTP client
    const sql = neon(connectionString)
    
    // Create Drizzle instance with schema
    dbInstance = drizzle(sql, { schema })
  }
  
  return dbInstance
}

/**
 * Drizzle database instance
 * Type-safe query builder with full schema
 * 
 * This uses a Proxy to ensure lazy initialization
 */
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    const instance = getDb()
    return (instance as any)[prop]
  },
})

/**
 * Type export for use in other files
 */
export type Database = typeof db
