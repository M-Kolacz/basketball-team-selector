<!-- Claude session: https://claude.ai/share/284dfb6e-8e6c-406b-ae8d-82dc3ec3a20f -->

# Frontend

## Core Framework
- Next.js v16.0.3 with App Router and Turbopack
- React v19
- TypeScript v5

## Forms & Validation
- Conform (`@conform-to/react`, `@conform-to/zod`) for form handling
- Zod for schema validation

## Styling & UI
- Tailwind CSS v4
- Shadcn/ui component library
- Radix UI primitives
- Lucide React icons
- `class-variance-authority` and `tailwind-merge` for styling utilities

## Notable Libraries
- `@dnd-kit` - Drag-and-drop functionality for team management
- `date-fns` - Date formatting and manipulation
- `recharts` - Charts and statistics visualization
- `sonner` - Toast notifications
- `next-themes` - Dark mode support

# Backend

## Server & Database
- Next.js Server Actions for backend logic
- Prisma ORM with PostgreSQL (hosted on Neon)
- Generated Prisma client in `generated/prisma/`

## Authentication
- JWT-based auth via `jsonwebtoken`
- Password hashing with `bcryptjs`
- Session management with HTTP-only cookies

## AI Integration
- AI SDK v5 (`ai` package)
- Google Gemini 2.0 Flash (`@ai-sdk/google`)
- Team generation via structured output

# Testing

- Vitest for unit (`*.test.ts` in Node env) and Storybook component tests (browser with Playwright)
- Playwright for E2E tests (`src/e2e/`)
- Storybook for UI component testing, documentation, and accessibility testing

# Code Quality

- ESLint with Next.js config and custom rules
- Prettier with Tailwind plugin
- TypeScript strict mode
- `@t3-oss/env-nextjs` for environment variable validation

# DevOps (CI/CD and Hosting)

- GitHub Actions for CI/CD pipeline
- Vercel for hosting Next.js application
