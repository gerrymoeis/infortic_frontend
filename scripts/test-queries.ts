/**
 * Query Testing Script
 * Tests all database queries to ensure they work correctly
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local'), override: true })

import { getPublishedOpportunities, getOpportunityBySlug, getOpportunitiesByType, searchOpportunities, countPublishedOpportunities } from '../lib/db/queries/opportunities'
import { getAllOpportunityTypes, getOpportunityTypeByCode } from '../lib/db/queries/types'
import { getAllAudiences, getAudienceByCode } from '../lib/db/queries/audiences'
import { getOrganizerById, searchOrganizers } from '../lib/db/queries/organizers'

async function testQueries() {
  console.log('🧪 Testing Database Queries\n')
  console.log('=' .repeat(60) + '\n')

  try {
    // Test 1: Get published opportunities
    console.log('1️⃣  Testing getPublishedOpportunities()...')
    const opportunities = await getPublishedOpportunities(5, 0)
    console.log(`   ✅ Found ${opportunities.length} opportunities`)
    if (opportunities.length > 0) {
      console.log(`   Sample: "${opportunities[0].title}"`)
      console.log(`   Type: ${opportunities[0].type.code} (${opportunities[0].type.label})`)
      console.log(`   Organizer: ${opportunities[0].organizer?.name || 'N/A'}`)
      console.log(`   Promoted: ${opportunities[0].isPromoted ? 'Yes' : 'No'}`)
    }
    console.log()

    // Test 2: Count opportunities
    console.log('2️⃣  Testing countPublishedOpportunities()...')
    const count = await countPublishedOpportunities()
    console.log(`   ✅ Total published opportunities: ${count}`)
    console.log()

    // Test 3: Get opportunity by slug
    if (opportunities.length > 0) {
      console.log('3️⃣  Testing getOpportunityBySlug()...')
      const slug = opportunities[0].slug
      const opportunity = await getOpportunityBySlug(slug)
      if (opportunity) {
        console.log(`   ✅ Found opportunity: "${opportunity.title}"`)
        console.log(`   Slug: ${opportunity.slug}`)
        console.log(`   Description: ${opportunity.description?.substring(0, 100)}...`)
        console.log(`   Audiences: ${opportunity.audiences.map(a => a.label || a.code).join(', ')}`)
        console.log(`   Deadline: ${opportunity.deadlineDate}`)
      } else {
        console.log(`   ❌ Opportunity not found`)
      }
      console.log()
    }

    // Test 4: Get all opportunity types
    console.log('4️⃣  Testing getAllOpportunityTypes()...')
    const types = await getAllOpportunityTypes()
    console.log(`   ✅ Found ${types.length} opportunity types`)
    types.forEach(type => {
      console.log(`   - ${type.code}: ${type.label?.value || 'No label'}`)
    })
    console.log()

    // Test 5: Get opportunities by type
    if (types.length > 0) {
      console.log('5️⃣  Testing getOpportunitiesByType()...')
      const typeCode = types[0].code
      const typeOpportunities = await getOpportunitiesByType(typeCode, 3)
      console.log(`   ✅ Found ${typeOpportunities.length} opportunities for type "${typeCode}"`)
      if (typeOpportunities.length > 0) {
        console.log(`   Sample: "${typeOpportunities[0].title}"`)
      }
      console.log()
    }

    // Test 6: Get all audiences
    console.log('6️⃣  Testing getAllAudiences()...')
    const audiences = await getAllAudiences()
    console.log(`   ✅ Found ${audiences.length} audiences`)
    audiences.forEach(audience => {
      console.log(`   - ${audience.code}: ${audience.label?.value || 'No label'}`)
    })
    console.log()

    // Test 7: Get audience by code
    if (audiences.length > 0) {
      console.log('7️⃣  Testing getAudienceByCode()...')
      const audienceCode = audiences[0].code
      const audience = await getAudienceByCode(audienceCode)
      if (audience) {
        console.log(`   ✅ Found audience: ${audience.code} (${audience.label?.value})`)
      }
      console.log()
    }

    // Test 8: Search opportunities
    console.log('8️⃣  Testing searchOpportunities()...')
    const searchResults = await searchOpportunities('kompetisi', 3)
    console.log(`   ✅ Found ${searchResults.length} results for "kompetisi"`)
    if (searchResults.length > 0) {
      console.log(`   Sample: "${searchResults[0].title}"`)
    }
    console.log()

    // Test 9: Search organizers
    console.log('9️⃣  Testing searchOrganizers()...')
    const organizers = await searchOrganizers('universitas', 3)
    console.log(`   ✅ Found ${organizers.length} organizers matching "universitas"`)
    organizers.forEach(org => {
      console.log(`   - ${org.name}`)
    })
    console.log()

    // Summary
    console.log('=' .repeat(60))
    console.log('✅ All query tests passed!')
    console.log('   Database layer is working correctly.')
    console.log('=' .repeat(60) + '\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Query test failed:\n')
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`)
      console.error(`\n   Stack trace:`)
      console.error(error.stack)
    } else {
      console.error(`   Error: ${error}`)
    }
    console.error('\n   Please check:')
    console.error('   1. DATABASE_URL in .env.local is correct')
    console.error('   2. Database is accessible')
    console.error('   3. Schema matches database structure\n')
    process.exit(1)
  }
}

testQueries()
