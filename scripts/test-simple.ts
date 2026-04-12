import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local'), override: true })

import { db } from '../lib/db/client'
import { opportunities } from '../lib/db/schema'

async function test() {
  console.log('Testing simple query...\n')
  
  try {
    const results = await db.select().from(opportunities).limit(5)
    console.log(`✅ Found ${results.length} opportunities`)
    if (results.length > 0) {
      console.log(`First: ${results[0].title}`)
      console.log(`Status: ${results[0].status}`)
    }
  } catch (error) {
    console.error('Error:', error)
  }
  
  process.exit(0)
}

test()
