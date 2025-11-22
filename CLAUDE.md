# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

Basketball team selection app for organizing amateur basketball games. Single
admin creates balanced teams for ~20 players using AI algorithms (Gemini via AI
SDK v5). Built with Next.js 15, React 19, TypeScript 5, Tailwind CSS 4, Prisma,
PostgreSQL and Conform.

## Common Commands

```bash
# Development
npm run dev              # Start dev server (Turbopack)
npm run build            # Build production (Turbopack)
npm start               # Start production server

# Database
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:generate     # Generate Prisma client
npm run db:seed         # Seed database
npm run db:studio       # Open Prisma Studio

# Testing
npm test                        # Run unit tests (Vitest)
npm run test:e2e:install        # Install Playwright browsers
npm run test:e2e:run            # Run E2E tests (CI mode)
npm run test:e2e:dev            # Run E2E tests (UI mode)

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run format          # Check formatting (Prettier)
npm run format:fix      # Fix formatting
npm run typecheck       # Type check TypeScript

# Storybook
npm run storybook           # Start Storybook on port 6006
npm run build-storybook     # Build Storybook
```

## Architecture

### App Structure

- **Next.js App Router** - Uses app directory for routing
- **Server Actions** - Backend logic in `src/lib/actions/` (auth, players)
- **Prisma ORM** - Database client generated to `generated/prisma/`
- **Path Alias** - `#app/*` maps to `./src/*` (defined in
  [tsconfig.json:15](tsconfig.json#L15))

### Database Schema (Prisma)

Key models:

- **User/Password/Session** - JWT auth with role-based access (admin/user)
- **Player** - Name, skillTier (S/A/B/C/D), positions (PG/SG/SF/PF/C)
- **Team** - Contains players
- **GameSession** - Game date, description, selected proposition
- **Proposition** - Three types: position_focused, skill_balanced, general
- **Game/Score** - Track game results and team scores

### Authentication

- JWT-based auth using `jsonwebtoken` and `bcryptjs`
- Session stored in `bts-session` cookie (7 day expiry)
- Authentication helpers in [auth.server.ts](src/lib/auth.server.ts)

### Form Validation

- Uses `@conform-to/react` + `@conform-to/zod` for form handling
- Validation schemas in `src/lib/validations/` (auth, player, user)
- Server actions use `parseWithZod` with async transforms for DB checks

### AI Team Generation

- Uses `ai` SDK v5 with `@ai-sdk/google` (Gemini 2.0 Flash)
- `generatePropositions()` in `src/lib/createTeamPropositions.ts` creates 3
  balanced team setups
- Proposition types: skill_balanced, position_focused, general (mixed approach)

### Testing Setup

- **Vitest** - Two projects: `unit` (Node env, `*.test.ts`) and `storybook`
  (browser with Playwright)
- **Playwright** - E2E tests in `src/e2e/`, runs on Chromium
- **Storybook** - Component testing with accessibility addon

### Styling

- Tailwind CSS 4 with `@import "tailwindcss"` syntax in
  [globals.css](src/app/globals.css)
- Theme variables defined with `@theme inline` directive
- Shadcn/ui components in `src/components/ui/` (configured via
  [components.json](components.json))
- Uses `#app/*` aliases for imports (components, utils, ui, lib, hooks)
- Geist Sans/Mono fonts via Google Fonts

## Environment Variables

Required in `.env.local`:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT signing
- `GOOGLE_GENERATIVE_AI_API_KEY` - Gemini API key for AI team generation
- `NODE_ENV` - development/test/production

Validated by `@t3-oss/env-nextjs` in [env.mjs](src/lib/env.mjs).

## Rules to follow

- Be extremely concise, sacrifice grammar for the sake of concision
