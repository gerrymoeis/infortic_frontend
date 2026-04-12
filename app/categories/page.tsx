/**
 * Categories Index Page
 * Browse all opportunity types
 * ISR with 24h revalidation
 */

import Link from 'next/link'
import { getOpportunityTypesWithCounts } from '@/lib/db/queries/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// ISR: Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400

// Type icons mapping
const typeIcons: Record<string, string> = {
  competition: '🏆',
  scholarship: '🎓',
  internship: '💼',
  job: '👔',
  freelance: '💻',
  festival: '🎉',
  training: '📚',
  workshop: '🛠️',
  hackathon: '⚡',
  tryout: '✍️',
}

export default async function CategoriesPage() {
  const types = await getOpportunityTypesWithCounts()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Kategori Peluang</h1>
          <p className="text-gray-600">
            Jelajahi peluang berdasarkan kategori yang kamu minati
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {types.map((type) => (
            <Link key={type.id} href={`/categories/${type.code}`}>
              <Card className="h-full transition-all hover:border-primary-600 hover:shadow-md">
                <CardHeader>
                  <div className="mb-3 text-4xl">
                    {typeIcons[type.code] || '📌'}
                  </div>
                  <CardTitle className="text-xl">
                    {type.label?.value || type.code}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {type.count} peluang aktif
                    </span>
                    <Badge variant="info">{type.code}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {types.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-gray-600">Belum ada kategori tersedia.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
