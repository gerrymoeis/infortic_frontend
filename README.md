# Infortic Frontend

Modern Next.js frontend for the Infortic opportunity platform.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Database:** Neon PostgreSQL + Drizzle ORM
- **Authentication:** NextAuth.js v5
- **Payments:** Stripe
- **Hosting:** Cloudflare Pages
- **Image Storage:** Cloudflare R2

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- PostgreSQL database (Neon)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
infortic_frontend/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes
│   ├── (admin)/           # Admin routes
│   └── api/               # API routes
├── lib/                   # Core business logic
│   ├── db/               # Database layer
│   ├── services/         # Business logic
│   └── utils/            # Utilities
├── components/            # React components
│   ├── ui/               # Reusable UI
│   ├── opportunities/    # Opportunity components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── types/                 # TypeScript types
└── public/                # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio

## Development Workflow

1. Create feature branch
2. Make changes
3. Run `npm run lint` and `npm run type-check`
4. Test locally
5. Commit and push
6. Create pull request

## Architecture Principles

- **Clean Architecture:** Separation of concerns (UI, business logic, data)
- **Type Safety:** TypeScript strict mode, runtime validation with Zod
- **Performance First:** Server Components by default, ISR for static pages
- **Minimal Code:** DRY, YAGNI, clear over clever

## Environment Variables

See `.env.example` for required environment variables.

## License

MIT
