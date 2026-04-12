/**
 * Opportunity Detail Page
 * Full details of a single opportunity
 * Dynamic rendering (will be changed to ISR after database verification)
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getOpportunityBySlug } from '@/lib/db/queries/opportunities'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatDeadline } from '@/lib/utils/formatting'

// Force dynamic rendering for now
export const dynamic = 'force-dynamic'

interface OpportunityDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const { slug } = await params
  const opportunity = await getOpportunityBySlug(slug)

  if (!opportunity) {
    notFound()
  }

  const deadline = formatDeadline(opportunity.deadlineDate)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <Link href="/opportunities" className="mb-6 inline-block">
            <Button variant="ghost" size="sm">
              ← Kembali ke Daftar
            </Button>
          </Link>

          {/* Main Content */}
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            {/* Image */}
            {opportunity.imageUrl && (
              <div className="relative h-96 w-full">
                <Image
                  src={opportunity.imageUrl}
                  alt={opportunity.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="p-8">
              {/* Type Badge */}
              <div className="mb-4">
                <Badge variant="info">
                  {opportunity.type.label?.value || opportunity.type.code}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="mb-4 text-3xl font-bold text-gray-900">{opportunity.title}</h1>

              {/* Meta Info */}
              <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600">
                {opportunity.organizer && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span>{opportunity.organizer.name}</span>
                  </div>
                )}

                {deadline.formatted && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className={deadline.isUrgent ? 'font-medium text-red-600' : ''}>
                      Deadline: {deadline.formatted}
                    </span>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="mb-6 flex flex-wrap gap-2">
                {opportunity.eventType && (
                  <Badge variant="default">{opportunity.eventType}</Badge>
                )}
                {opportunity.feeType && (
                  <Badge variant={opportunity.feeType === 'gratis' ? 'success' : 'default'}>
                    {opportunity.feeType === 'gratis' ? 'Gratis' : opportunity.feeType.toUpperCase()}
                  </Badge>
                )}
                {opportunity.audiences.map((audience) => (
                  <Badge key={audience.code} variant="default">
                    {audience.label || audience.code}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              {opportunity.description && (
                <div className="mb-6">
                  <h2 className="mb-3 text-xl font-semibold text-gray-900">Deskripsi</h2>
                  <div className="prose max-w-none text-gray-700">
                    <p className="whitespace-pre-wrap">{opportunity.description}</p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                {opportunity.startDate && (
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-gray-900">Tanggal Mulai</h3>
                    <p className="text-gray-700">{formatDate(opportunity.startDate)}</p>
                  </div>
                )}
                {opportunity.endDate && (
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-gray-900">Tanggal Selesai</h3>
                    <p className="text-gray-700">{formatDate(opportunity.endDate)}</p>
                  </div>
                )}
              </div>

              {/* Contact */}
              {opportunity.contact && (
                <div className="mb-6">
                  <h3 className="mb-1 text-sm font-medium text-gray-900">Kontak</h3>
                  <p className="text-gray-700">{opportunity.contact}</p>
                </div>
              )}

              {/* Apply Button */}
              {opportunity.registrationUrl && (
                <div className="mt-8">
                  <a
                    href={opportunity.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button size="lg" className="w-full sm:w-auto">
                      Daftar Sekarang →
                    </Button>
                  </a>
                </div>
              )}

              {/* Source Info */}
              {opportunity.sourceUrl && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-500">
                    Sumber:{' '}
                    <a
                      href={opportunity.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      Instagram
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
