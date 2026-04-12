import postgres from 'postgres'
import { config } from 'dotenv'
import { resolve, join } from 'path'
import { existsSync, readFileSync } from 'fs'

// Explicitly load .env.local from the project root
const envPath = join(process.cwd(), '.env.local')
console.log(`📁 Loading environment from: ${envPath}`)
console.log(`   File exists: ${existsSync(envPath) ? '✅' : '❌'}\n`)

if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8')
  const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/)
  if (dbUrlMatch) {
    console.log(`📋 DATABASE_URL from file:`)
    console.log(`   First 50 chars: ${dbUrlMatch[1].substring(0, 50)}...`)
    console.log(`   Contains 'ep-young-butterfly': ${dbUrlMatch[1].includes('ep-young-butterfly') ? '✅' : '❌'}\n`)
  }
}

config({ path: envPath, override: true })

async function testConnection() {
  console.log('🔍 Testing database connection...\n')

  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in environment variables')
    console.error('   Please check your .env.local file')
    process.exit(1)
  }

  console.log('📋 Loaded DATABASE_URL check:')
  console.log(`   Length: ${connectionString.length} characters`)
  console.log(`   Host: ${connectionString.includes('pooler.ap-southeast-1.aws.neon.tech') ? '✅ Neon pooler' : '❌ Unknown host'}`)
  console.log(`   SSL: ${connectionString.includes('sslmode=require') ? '✅ Required' : '⚠️  Not specified'}`)
  console.log(`   First 50 chars: ${connectionString.substring(0, 50)}...\n`)

  try {
    // Create postgres client with explicit SSL configuration
    const sql = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require', // Explicitly require SSL
      connection: {
        application_name: 'infortic_frontend_test',
      },
    })

    // Test basic query
    console.log('1️⃣  Testing basic connection...')
    const result = await sql`SELECT NOW() as server_time, version() as pg_version`
    console.log('   ✅ Connected successfully!')
    console.log(`   Server time: ${result[0].server_time}`)
    console.log(`   PostgreSQL: ${result[0].pg_version.split(',')[0]}\n`)

    // Test opportunities table
    console.log('2️⃣  Testing opportunities table...')
    const opportunities = await sql`
      SELECT COUNT(*) as count FROM opportunities
    `
    console.log(`   ✅ Opportunities table accessible`)
    console.log(`   Total opportunities: ${opportunities[0].count}\n`)

    // Test opportunity_types table
    console.log('3️⃣  Testing opportunity_types table...')
    const types = await sql`
      SELECT code FROM opportunity_types ORDER BY code
    `
    console.log(`   ✅ Opportunity types table accessible`)
    console.log(`   Available types: ${types.map((t) => t.code).join(', ')}\n`)

    // Test audiences table
    console.log('4️⃣  Testing audiences table...')
    const audiences = await sql`
      SELECT code FROM audiences ORDER BY code
    `
    console.log(`   ✅ Audiences table accessible`)
    console.log(`   Available audiences: ${audiences.map((a) => a.code).join(', ')}\n`)

    // Close connection
    await sql.end()

    console.log('✅ All database tests passed!')
    console.log('   Frontend is ready to connect to the backend database.\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Database connection failed:\n')
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`)
    } else {
      console.error(`   Error: ${error}`)
    }
    console.error('\n   Please check:')
    console.error('   1. DATABASE_URL in .env.local is correct')
    console.error('   2. Database is accessible from your network')
    console.error('   3. Database credentials are valid\n')
    process.exit(1)
  }
}

testConnection()
