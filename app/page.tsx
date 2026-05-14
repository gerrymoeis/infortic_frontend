/**
 * Homepage
 * Displays recent opportunities with ISR
 * Revalidates every 1 hour
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedOpportunities } from '@/lib/db/queries/opportunities'
import { OpportunityList } from '@/components/opportunities/opportunity-list'
import { Button } from '@/components/ui/button'

// ISR: Revalidate every 1 hour (3600 seconds)
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Beranda',
  description: 'Temukan peluang kompetisi, beasiswa, magang, dan berbagai kesempatan lainnya untuk pelajar dan mahasiswa Indonesia. Update setiap hari.',
  openGraph: {
    title: 'Infortic - Temukan Peluang Terbaikmu',
    description: 'Platform informasi peluang kompetisi, beasiswa, magang, dan berbagai kesempatan lainnya untuk pelajar dan mahasiswa Indonesia.',
    url: 'https://infortic.com',
  },
}

export default async function HomePage() {
  // Fetch recent opportunities (limit 12 for homepage)
  const opportunities = await getPublishedOpportunities(12, 0)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-primary-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-neutral-900 md:text-5xl">
              Temukan Peluang Terbaikmu
            </h1>
            <p className="mb-8 text-lg text-neutral-600">
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
            <h2 className="text-2xl font-bold text-neutral-900">Peluang Terbaru</h2>
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
