/**
 * Drizzle ORM Schema Definition
 * Matches ACTUAL PostgreSQL database schema from infortic_scraper backend
 * 
 * Database: Neon PostgreSQL 17.8
 * Tables: 6 tables (verified 2026-04-12)
 * Source: Instagram scraper backend
 */

import { pgTable, uuid, text, timestamp, date, boolean, integer, unique } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

// ============================================================================
// CORE TABLES
// ============================================================================

/**
 * i18n_labels - Internationalization labels
 * Used for translating type codes, audience codes, etc.
 * Currently only Indonesian ('id') language
 */
export const i18nLabels = pgTable('i18n_labels', {
  id: uuid('id').defaultRandom().primaryKey(),
  language: text('language').notNull(), // 'id' for Indonesian
  value: text('value').notNull(),
}, (table) => ({
  // Unique constraint on language + value combination
  languageValueUnique: unique().on(table.language, table.value),
}))

/**
 * opportunity_types - Categories of opportunities
 * 10 types: competition, scholarship, internship, job, freelance, 
 *           festival, training, workshop, hackathon, tryout
 */
export const opportunityTypes = pgTable('opportunity_types', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  labelId: uuid('label_id').references(() => i18nLabels.id),
})

/**
 * audiences - Target audiences for opportunities
 * 9 audiences: smp, sma, d3, d4, s1, umum, sd, smk, d2
 */
export const audiences = pgTable('audiences', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  labelId: uuid('label_id').references(() => i18nLabels.id),
})

/**
 * organizers - Event/opportunity organizers
 * 146 organizers currently
 */
export const organizers = pgTable('organizers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }),
  slug: text('slug'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
})

/**
 * opportunities - Main table for all opportunities
 * 131 opportunities currently (116 active, 15 expired)
 * 
 * Instagram scraper specific fields:
 * - post_id: Instagram post ID
 * - source_url: Instagram URL
 * - source_account: Instagram account
 * - raw_caption: Original Instagram caption
 * - image_url: Instagram image URL
 * - downloaded_image: Local image path
 * - secondary_sources: JSONB for merged duplicates
 */
export const opportunities = pgTable('opportunities', {
  id: uuid('id').defaultRandom().primaryKey(),
  typeId: uuid('type_id').notNull().references(() => opportunityTypes.id),
  organizerId: uuid('organizer_id').references(() => organizers.id),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  rawCaption: text('raw_caption'), // Original Instagram caption
  registrationUrl: text('registration_url'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  deadlineDate: date('deadline_date'),
  status: text('status').notNull(), // 'active' | 'expired' | 'archived'
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  
  // Instagram scraper fields
  postId: text('post_id'), // Instagram post ID
  sourceUrl: text('source_url'), // Instagram URL
  sourceAccount: text('source_account'), // Instagram account
  contact: text('contact'),
  eventType: text('event_type'), // 'online' | 'offline' | 'hybrid'
  feeType: text('fee_type'), // 'gratis' | 'htm' | 'range'
  imageUrl: text('image_url'), // Instagram image URL
  downloadedImage: text('downloaded_image'), // Local image path
  registrationDate: text('registration_date'),
  viewCount: integer('view_count'),
  isFeatured: boolean('is_featured'),
  tags: text('tags').array(), // Text array for tags
  expiredAt: timestamp('expired_at', { withTimezone: false }),
  autoExpired: boolean('auto_expired'),
  secondarySources: text('secondary_sources').$type<Record<string, any>>(), // JSONB for merged duplicates
})

/**
 * opportunity_audiences - Junction table
 * Links opportunities to target audiences (many-to-many)
 */
export const opportunityAudiences = pgTable('opportunity_audiences', {
  opportunityId: uuid('opportunity_id').notNull().references(() => opportunities.id, { onDelete: 'cascade' }),
  audienceId: uuid('audience_id').notNull().references(() => audiences.id, { onDelete: 'cascade' }),
}, (table) => ({
  // Composite primary key
  pk: unique().on(table.opportunityId, table.audienceId),
}))

// ============================================================================
// RELATIONS (For Drizzle Joins)
// ============================================================================

export const opportunitiesRelations = relations(opportunities, ({ one, many }) => ({
  type: one(opportunityTypes, {
    fields: [opportunities.typeId],
    references: [opportunityTypes.id],
  }),
  organizer: one(organizers, {
    fields: [opportunities.organizerId],
    references: [organizers.id],
  }),
  audiences: many(opportunityAudiences),
}))

export const opportunityTypesRelations = relations(opportunityTypes, ({ one, many }) => ({
  label: one(i18nLabels, {
    fields: [opportunityTypes.labelId],
    references: [i18nLabels.id],
  }),
  opportunities: many(opportunities),
}))

export const audiencesRelations = relations(audiences, ({ one, many }) => ({
  label: one(i18nLabels, {
    fields: [audiences.labelId],
    references: [i18nLabels.id],
  }),
  opportunityAudiences: many(opportunityAudiences),
}))

export const organizersRelations = relations(organizers, ({ many }) => ({
  opportunities: many(opportunities),
}))

export const opportunityAudiencesRelations = relations(opportunityAudiences, ({ one }) => ({
  opportunity: one(opportunities, {
    fields: [opportunityAudiences.opportunityId],
    references: [opportunities.id],
  }),
  audience: one(audiences, {
    fields: [opportunityAudiences.audienceId],
    references: [audiences.id],
  }),
}))
