/**
 * Drizzle ORM Schema Definition
 * Matches PostgreSQL database schema from infortic_scraper backend
 * 
 * Database: Neon PostgreSQL 17.8
 * Tables: 15 tables + 1 view
 * Relations: Fully normalized with foreign keys
 */

import { pgTable, uuid, text, timestamp, date, boolean, integer, numeric, unique } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ============================================================================
// CORE TABLES
// ============================================================================

/**
 * i18n_labels - Internationalization labels
 * Used for translating type codes, audience codes, etc.
 */
export const i18nLabels = pgTable('i18n_labels', {
  id: uuid('id').defaultRandom().primaryKey(),
  language: text('language').notNull(), // e.g., 'id' for Indonesian
  value: text('value').notNull(),
}, (table) => ({
  // Unique constraint on language + value combination
  languageValueUnique: unique().on(table.language, table.value),
}))

/**
 * opportunity_types - Categories of opportunities
 * Examples: competition, scholarship, internship, job, freelance
 */
export const opportunityTypes = pgTable('opportunity_types', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(), // e.g., 'competition', 'scholarship'
  labelId: uuid('label_id').references(() => i18nLabels.id),
})

/**
 * audiences - Target audiences for opportunities
 * Examples: smp, sma, d3, d4, s1, umum (general)
 */
export const audiences = pgTable('audiences', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(), // e.g., 'sma', 's1', 'umum'
  labelId: uuid('label_id').references(() => i18nLabels.id),
})

/**
 * organizers - Event/opportunity organizers
 */
export const organizers = pgTable('organizers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  website: text('website'),
  contact: text('contact'),
  verified: boolean('verified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

/**
 * locations - Physical or online locations
 */
export const locations = pgTable('locations', {
  id: uuid('id').defaultRandom().primaryKey(),
  city: text('city'),
  province: text('province'),
  country: text('country').default('Indonesia'),
  type: text('type'), // 'online' | 'offline' | 'hybrid'
})

/**
 * fees - Fee information for opportunities
 */
export const fees = pgTable('fees', {
  id: uuid('id').defaultRandom().primaryKey(),
  amount: numeric('amount'), // Decimal for currency
  currency: text('currency').default('IDR'),
  feeType: text('fee_type'), // 'gratis' | 'htm' | 'range'
})

/**
 * tags - Tagging system for opportunities
 */
export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  labelId: uuid('label_id').references(() => i18nLabels.id),
})

/**
 * attributes - EAV pattern for flexible attributes
 */
export const attributes = pgTable('attributes', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  dataType: text('data_type').notNull(), // 'text' | 'number' | 'boolean' | 'enum'
})

/**
 * opportunities - Main table for all opportunities
 */
export const opportunities = pgTable('opportunities', {
  id: uuid('id').defaultRandom().primaryKey(),
  typeId: uuid('type_id').notNull().references(() => opportunityTypes.id),
  organizerId: uuid('organizer_id').references(() => organizers.id),
  locationId: uuid('location_id').references(() => locations.id),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  applyUrl: text('apply_url'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  deadlineDate: date('deadline_date'),
  status: text('status').notNull(), // 'draft' | 'published' | 'expired'
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

/**
 * promotions - Paid promotion features
 */
export const promotions = pgTable('promotions', {
  id: uuid('id').defaultRandom().primaryKey(),
  opportunityId: uuid('opportunity_id').references(() => opportunities.id, { onDelete: 'cascade' }),
  priority: integer('priority').default(10), // Higher = more prominent
  startsAt: timestamp('starts_at', { withTimezone: true }).defaultNow(),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  active: boolean('active').default(true),
})

// ============================================================================
// JUNCTION TABLES (Many-to-Many Relationships)
// ============================================================================

/**
 * opportunity_audiences - Links opportunities to target audiences
 */
export const opportunityAudiences = pgTable('opportunity_audiences', {
  opportunityId: uuid('opportunity_id').notNull().references(() => opportunities.id, { onDelete: 'cascade' }),
  audienceId: uuid('audience_id').notNull().references(() => audiences.id, { onDelete: 'cascade' }),
}, (table) => ({
  // Composite primary key
  pk: unique().on(table.opportunityId, table.audienceId),
}))

/**
 * opportunity_fees - Links opportunities to fees
 */
export const opportunityFees = pgTable('opportunity_fees', {
  opportunityId: uuid('opportunity_id').notNull().references(() => opportunities.id, { onDelete: 'cascade' }),
  feeId: uuid('fee_id').notNull().references(() => fees.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: unique().on(table.opportunityId, table.feeId),
}))

/**
 * opportunity_tags - Links opportunities to tags
 */
export const opportunityTags = pgTable('opportunity_tags', {
  opportunityId: uuid('opportunity_id').notNull().references(() => opportunities.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: unique().on(table.opportunityId, table.tagId),
}))

/**
 * opportunity_attributes - EAV pattern for flexible attributes
 */
export const opportunityAttributes = pgTable('opportunity_attributes', {
  opportunityId: uuid('opportunity_id').notNull().references(() => opportunities.id, { onDelete: 'cascade' }),
  attributeId: uuid('attribute_id').notNull().references(() => attributes.id, { onDelete: 'cascade' }),
  valueText: text('value_text'),
  valueNumber: numeric('value_number'),
  valueBoolean: boolean('value_boolean'),
}, (table) => ({
  pk: unique().on(table.opportunityId, table.attributeId),
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
  location: one(locations, {
    fields: [opportunities.locationId],
    references: [locations.id],
  }),
  audiences: many(opportunityAudiences),
  fees: many(opportunityFees),
  tags: many(opportunityTags),
  attributes: many(opportunityAttributes),
  promotion: one(promotions, {
    fields: [opportunities.id],
    references: [promotions.opportunityId],
  }),
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

export const opportunityFeesRelations = relations(opportunityFees, ({ one }) => ({
  opportunity: one(opportunities, {
    fields: [opportunityFees.opportunityId],
    references: [opportunities.id],
  }),
  fee: one(fees, {
    fields: [opportunityFees.feeId],
    references: [fees.id],
  }),
}))

export const opportunityTagsRelations = relations(opportunityTags, ({ one }) => ({
  opportunity: one(opportunities, {
    fields: [opportunityTags.opportunityId],
    references: [opportunities.id],
  }),
  tag: one(tags, {
    fields: [opportunityTags.tagId],
    references: [tags.id],
  }),
}))

export const tagsRelations = relations(tags, ({ one, many }) => ({
  label: one(i18nLabels, {
    fields: [tags.labelId],
    references: [i18nLabels.id],
  }),
  opportunityTags: many(opportunityTags),
}))

export const promotionsRelations = relations(promotions, ({ one }) => ({
  opportunity: one(opportunities, {
    fields: [promotions.opportunityId],
    references: [opportunities.id],
  }),
}))
