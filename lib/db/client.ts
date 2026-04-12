/**
 * Database Client Configuration
 * Drizzle ORM with postgres.js driver
 * 
 * Connection: Neon PostgreSQL (serverless)
 * Pool: 10 connections max
 * SSL: Required
 */

import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
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
 * Singleton instances
 */
let clientInstance: ReturnType<typeof postgres> | null = null
let dbInstance: PostgresJsDatabase<typeof schema> | null = null

/**
 * Get or create database instance
 * Lazy initialization - only creates connection when first used
 */
function getDb(): PostgresJsDatabase<typeof schema> {
  if (!dbInstance) {
    const connectionString = getConnectionString()
    
    clientInstance = postgres(connectionString, {
      max: 10, // Connection pool size
      idle_timeout: 20, // Close idle connections after 20s
      connect_timeout: 10, // Timeout for new connections
      ssl: 'require', // Required for Neon PostgreSQL
      connection: {
        application_name: 'infortic_frontend',
      },
    })
    
    dbInstance = drizzle(clientInstance, { schema })
  }
  
  return dbInstance
}

/**
 * Drizzle database instance
 * Type-safe query builder with full schema
 * 
 * This uses a Proxy to ensure lazy initialization
 */
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(target, prop) {
    const instance = getDb()
    return (instance as any)[prop]
  },
})

/**
 * Type export for use in other files
 */
export type Database = typeof db

/**
 * Graceful shutdown helper
 * Call this when shutting down the application
 */
export async function closeDatabase() {
  if (clientInstance) {
    await clientInstance.end()
    clientInstance = null
    dbInstance = null
  }
}
