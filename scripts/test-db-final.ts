import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local'), override: true })

import { getPublishedOpportunities, countPublishedOpportunities } from '../lib/db/queries/opportunities'
import { getAllOpportunityTypes } from '../lib/db/queries/types'
import { getAllAudiences } from '../lib/db/queries/audiences'

async function test() {
  console.log('🧪 Testing Phase 1 Database Layer\n')
  console.log('='  .repeat(60) + '\n')
  
  try {
    // Test 1: Count opportunities
    console.log('1️⃣  Counting active opportunities...')
    const count = await countPublishedOpportunities()
    console.log(`   ✅ Found ${count} active opportunities\n`)
    
    // Test 2: Get opportunities
    console.log('2️⃣  Fetching first 5 opportunities...')
    const opportunities = await getPublishedOpportunities(5, 0)
    console.log(`   ✅ Retrieved ${opportunities.length} opportunities`)
    if (opportunities.length > 0) {
      console.log(`   Sample: "${opportunities[0].title}"`)
      console.log(`   Type: ${opportunities[0].type.code} (${opportunities[0].type.label})`)
      console.log(`   Organizer: ${opportunities[0].organizer?.name || 'N/A'}`)
      console.log(`   Event Type: ${opportunities[0].eventType || 'N/A'}`)
      console.log(`   Fee Type: ${opportunities[0].feeType || 'N/A'}\n`)
    }
    
    // Test 3: Get types
    console.log('3️⃣  Fetching opportunity types...')
    const types = await getAllOpportunityTypes()
    console.log(`   ✅ Found ${types.length} types`)
    types.forEach(t => console.log(`   - ${t.code}: ${t.label?.value || 'No label'}`))
    console.log()
    
    // Test 4: Get audiences
    console.log('4️⃣  Fetching audiences...')
    const audiences = await getAllAudiences()
    console.log(`   ✅ Found ${audiences.length} audiences`)
    audiences.forEach(a => console.log(`   - ${a.code}: ${a.label?.value || 'No label'}`))
    console.log()
    
    console.log('='  .repeat(60))
    console.log('✅ Phase 1 Complete - All tests passed!')
    console.log('   Database layer is working correctly.')
    console.log('='  .repeat(60) + '\n')
    
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Test failed:\n')
    console.error(error)
    process.exit(1)
  }
}

test()
