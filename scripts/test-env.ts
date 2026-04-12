import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local'), override: true })

console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 80) + '...')
console.log('Contains ep-young-butterfly:', process.env.DATABASE_URL?.includes('ep-young-butterfly'))
console.log('Contains kai-clone:', process.env.DATABASE_URL?.includes('kai-clone'))
