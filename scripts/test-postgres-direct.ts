import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local'), override: true })

import postgres from 'postgres'

async function test() {
  console.log('Testing direct postgres connection...\n')
  
  const connectionString = process.env.DATABASE_URL!
  console.log('Connection string (first 80 chars):', connectionString.substring(0, 80) + '...')
  console.log('Contains ep-young-butterfly:', connectionString.includes('ep-young-butterfly'))
  console.log()
  
  try {
    const sql = postgres(connectionString, {
      max: 1,
      ssl: 'require',
    })
    
    const result = await sql`SELECT COUNT(*) as count FROM opportunities`
    console.log('✅ Query successful!')
    console.log('Count:', result[0].count)
    
    await sql.end()
  } catch (error) {
    console.error('❌ Error:', error)
  }
  
  process.exit(0)
}

test()
