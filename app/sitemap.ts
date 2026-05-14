import { MetadataRoute } from 'next'
import { getPublishedOpportunities } from '@/lib/db/queries/opportunities'
import { getAllOpportunityTypes } from '@/lib/db/queries/types'

/**
 * Dynamic Sitemap Generation
 * Automatically includes all published opportunities and categories
 * Updates when content changes
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://infortic.com'
  
  // Fetch all published opportunities and types
  const [opportunities, types] = await Promise.all([
    getPublishedOpportunities(1000, 0), // Get all opportunities
    getAllOpportunityTypes(),
  ])

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/opportunities`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = types.map((type) => ({
    url: `${baseUrl}/categories/${type.code}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  // Opportunity detail pages
  const opportunityPages: MetadataRoute.Sitemap = opportunities.map((opp) => ({
    url: `${baseUrl}/opportunities/${opp.slug}`,
    lastModified: opp.createdAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages, ...opportunityPages]
}
