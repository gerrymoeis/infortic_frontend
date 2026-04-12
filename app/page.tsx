/**
 * Homepage
 * Displays recent opportunities
 * Dynamic rendering (will be changed to ISR after database verification)
 */

import Link from 'next/link'
import { getPublishedOpportunities } from '@/lib/db/queries/opportunities'
import { OpportunityList } from '@/components/opportunities/opportunity-list'
import { Button } from '@/components/ui/button'

// Force dynamic rendering for now
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Fetch recent opportunities (limit 12 for homepage)
  const opportunities = await getPublishedOpportunities(12, 0)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-primary-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Temukan Peluang Terbaikmu
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              Informasi kompetisi, beasiswa, magang, dan berbagai kesempatan lainnya untuk
              pelajar dan mahasiswa Indonesia.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/opportunities">
                <Button size="lg">Lihat Semua Peluang</Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg">
                  Jelajahi Kategori
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Opportunities */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Peluang Terbaru</h2>
            <Link href="/opportunities">
              <Button variant="ghost">Lihat Semua →</Button>
            </Link>
          </div>

          <OpportunityList
            opportunities={opportunities}
            emptyMessage="Belum ada peluang tersedia saat ini."
          />
        </div>
      </section>
    </div>
  )
}
