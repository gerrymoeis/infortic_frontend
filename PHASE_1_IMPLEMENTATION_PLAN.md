# Phase 1 Implementation Plan - Foundation & Database Layer
**Date**: April 12, 2026  
**Status**: 🚧 IN PROGRESS

## Overview
Phase 1 focuses on building the foundation: database layer with Drizzle ORM, type system, and basic query functions. This phase establishes the data access patterns that all other features will build upon.

## Key Principles
- Clean Architecture: Separation of concerns (data access, business logic, presentation)
- Type Safety: Full TypeScript coverage with runtime validation
- Minimal Code: Only what's needed, no over-engineering
- Performance: Efficient queries with proper indexing
- Maintainability: Clear naming, logical structure, comprehensive comments

## Database Schema Analysis

### Core Tables (from full.sql)
1. **opportunities** - Main table (131 records currently)
   - Primary fields: id, title, slug, description, apply_url
   - Dates: start_date, end_date, deadline_date
   - Status: draft | published | expired
   - Foreign keys: type_id, organizer_id, location_id

2. **opportunity_types** - Categories (10 types)
   - competition, scholarship, internship, job, freelance, festival, training, workshop, hackathon, tryout
   - Has i18n support via label_id

3. **audiences** - Target audiences (9 audiences)
   - smp, sma, d3, d4, s1, umum, sd, smk, d2
   - Has i18n support via label_id

4. **organizers** - Event organizers (146 currently)
   - name, website, contact, verified status

5. **i18n_labels** - Internationalization
   - language, value pairs
   - Currently only 'id' (Indonesian) language

6. **locations** - Event locations
   - city, province, country, type (online/offline/hybrid)

7. **fees** - Fee information
   - amount, currency, fee_type (gratis/htm/range)

8. **tags** - Tagging system
   - code, label_id

9. **attributes** - EAV pattern for flexible attributes
   - code, data_type (text/number/boolean/enum)

10. **promotions** - Paid promotion features
    - opportunity_id, priority, starts_at, ends_at, active

### Junction Tables (Many-to-Many)
- opportunity_audiences
- opportunity_fees
- opportunity_tags
- opportunity_attributes

### View
- v_opportunities_public - Simplified public view

## Implementation Tasks

### Task 1.1: Drizzle Schema Definition ✅
**File**: `lib/db/schema.ts`

**Approach**:
1. Define all tables matching PostgreSQL schema exactly
2. Use Drizzle's type-safe column definitions
3. Set up relations for joins
4. Export types for use in queries

**Key Decisions**:
- Use `uuid()` with `.defaultRandom()` for primary keys
- Use `text()` for string fields (matches PostgreSQL)
- Use `timestamp()` with `{ withTimezone: true }` for dates
- Use `date()` for date-only fields
- Define relations for type-safe joins

**Tables to Define**:
- Core: opportunities, opportunity_types, audiences, organizers, i18n_labels, locations, fees, tags, attributes, promotions
- Junction: opportunity_audiences, opportunity_fees, opportunity_tags, opportunity_attributes
- Note: Skip view (v_opportunities_public) - will query directly

### Task 1.2: Database Client Setup ✅
**File**: `lib/db/client.ts`

**Approach**:
1. Create postgres client with connection pooling
2. Initialize Drizzle with schema
3. Export typed database instance
4. Handle connection errors gracefully

**Configuration**:
- Connection pool: max 10 connections
- Idle timeout: 20 seconds
- Connect timeout: 10 seconds
- SSL: required (Neon PostgreSQL)

### Task 1.3: TypeScript Type Definitions ✅
**File**: `types/database.ts`

**Approach**:
1. Export types from Drizzle schema (using `InferSelectModel`, `InferInsertModel`)
2. Create composite types for joined queries
3. Define API response types
4. Create Zod schemas for validation

**Types to Define**:
- Select types: `Opportunity`, `OpportunityType`, `Audience`, etc.
- Insert types: `OpportunityInsert`, `OpportunityTypeInsert`, etc.
- Composite types: `OpportunityWithRelations`, `OpportunityListItem`
- API types: `OpportunityResponse`, `OpportunityListResponse`

### Task 1.4: Query Layer (Repository Pattern) ✅
**Files**: `lib/db/queries/*.ts`

**Approach**:
1. Create separate query files for each domain
2. Use Drizzle's query builder for type safety
3. Implement common patterns (list, get by ID, filter, search)
4. Add pagination support
5. Optimize with proper joins

**Query Files**:

#### `opportunities.ts`
- `getPublishedOpportunities(limit?, offset?)` - List active opportunities
- `getOpportunityBySlug(slug)` - Get single opportunity with all relations
- `getOpportunityById(id)` - Get by UUID
- `getOpportunitiesByType(typeCode, limit?, offset?)` - Filter by type
- `getOpportunitiesByAudience(audienceCode, limit?, offset?)` - Filter by audience
- `searchOpportunities(query, filters?)` - Full-text search
- `getPromotedOpportunities(limit?)` - Get promoted opportunities

#### `types.ts`
- `getAllOpportunityTypes()` - Get all types with labels
- `getOpportunityTypeByCode(code)` - Get single type

#### `audiences.ts`
- `getAllAudiences()` - Get all audiences with labels
- `getAudienceByCode(code)` - Get single audience

#### `organizers.ts`
- `getOrganizerById(id)` - Get organizer details
- `getOrganizerByName(name)` - Search by name

### Task 1.5: Utility Functions ✅
**Files**: `lib/utils/*.ts`

#### `validation.ts`
- Zod schemas for form validation
- Runtime type checking
- Error message formatting

#### `formatting.ts`
- Date formatting (Indonesian locale)
- Currency formatting (IDR)
- Text truncation
- Slug generation

#### `constants.ts`
- Opportunity statuses
- Fee types
- Location types
- Pagination defaults

## Testing Strategy

### Database Connection Test ✅
- Already implemented in `scripts/test-db.ts`
- Verifies connection to Neon PostgreSQL
- Tests basic queries on all tables

### Query Tests (To Implement)
Create `scripts/test-queries.ts`:
1. Test each query function
2. Verify returned data structure
3. Check type safety
4. Test edge cases (empty results, invalid params)

### Manual Testing
1. Run `npm run db:test` - verify connection
2. Run `npm run db:studio` - inspect data with Drizzle Studio
3. Test queries in development environment

## Success Criteria

### Phase 1 Complete When:
- ✅ All tables defined in Drizzle schema
- ✅ Database client configured and tested
- ✅ All TypeScript types exported
- ✅ Core query functions implemented
- ✅ Utility functions created
- ✅ No TypeScript errors
- ✅ Database connection verified
- ✅ Sample queries return expected data
- ✅ Code follows clean architecture principles
- ✅ All files properly documented

## File Structure After Phase 1

```
infortic_frontend/
├── lib/
│   ├── db/
│   │   ├── schema.ts              ✅ Complete Drizzle schema
│   │   ├── client.ts              ✅ Database client
│   │   └── queries/
│   │       ├── opportunities.ts   ✅ Opportunity queries
│   │       ├── types.ts           ✅ Type queries
│   │       ├── audiences.ts       ✅ Audience queries
│   │       └── organizers.ts      ✅ Organizer queries
│   └── utils/
│       ├── validation.ts          ✅ Zod schemas
│       ├── formatting.ts          ✅ Formatters
│       └── constants.ts           ✅ Constants
├── types/
│   └── database.ts                ✅ TypeScript types
└── scripts/
    ├── test-db.ts                 ✅ Connection test
    └── test-queries.ts            ✅ Query tests
```

## Dependencies Check
- ✅ drizzle-orm@0.45.2 - installed
- ✅ postgres@3.4.9 - installed
- ✅ drizzle-kit@0.31.10 - installed
- ✅ zod@4.3.6 - installed
- ✅ date-fns@4.1.0 - installed
- ✅ slugify@1.6.9 - installed

## Next Phase Preview
**Phase 2: Core Pages & ISR**
- Homepage with opportunity list
- Opportunity detail pages
- Category pages
- Search and filter functionality
- ISR (Incremental Static Regeneration) setup

## Notes
- Backend has 131 opportunities, 146 organizers, 10 types, 9 audiences
- All data is in Indonesian language
- Status values: 'draft', 'published', 'expired' (backend uses 'active' but schema says 'published')
- Need to verify actual status values in database
- Promotions table is empty (paid feature not yet used)
- Locations, fees, tags, attributes tables are empty (not used by scraper yet)

## Implementation Order
1. Schema definition (foundation for everything)
2. Database client (enables queries)
3. Type definitions (type safety)
4. Query layer (data access)
5. Utility functions (helpers)
6. Testing (verification)

---

**Ready to implement**: All prerequisites met, dependencies installed, database verified.
