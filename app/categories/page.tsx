/**
 * Categories Index Page
 * Browse all opportunity types
 * ISR with 24h revalidation
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { getOpportunityTypesWithCounts } from '@/lib/db/queries/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { getCategoryIcon } from '@/lib/design-system/icons'

// ISR: Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Kategori Peluang',
  description: 'Jelajahi peluang berdasarkan kategori: kompetisi, beasiswa, magang, lomba, festival, pelatihan, workshop, hackathon, dan tryout.',
  openGraph: {
    title: 'Kategori Peluang | Infortic',
    description: 'Jelajahi peluang berdasarkan kategori yang kamu minati.',
    url: 'https://infortic.com/categories',
  },
}

export default async function CategoriesPage() {
  const types = await getOpportunityTypesWithCounts()

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-neutral-900">Kategori Peluang</h1>
          <p className="text-neutral-600">
            Jelajahi peluang berdasarkan kategori yang kamu minati
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {types.map((type) => (
            <Link key={type.id} href={`/categories/${type.code}`}>
              <Card className="h-full hover:border-primary-600">
                <CardHeader>
                  <div className="mb-3 text-primary-600">
                    <Icon 
                      icon={getCategoryIcon(type.code)} 
                      size={40}
                      aria-hidden={true}
                    />
                  </div>
                  <CardTitle className="text-xl">
                    {type.label?.value || type.code}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">
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
              <p className="text-lg text-neutral-600">Belum ada kategori tersedia.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
