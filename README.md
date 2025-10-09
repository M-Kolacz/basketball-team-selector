# Basketball Team Selector

A web-based application designed to streamline the organization of amateur
basketball games through AI-powered team generation. Create balanced, varied
team compositions in under 5 minutes.

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Status](#project-status)
- [License](#license)

## Project Description

Basketball Team Selector addresses the challenge of creating fair and engaging
team compositions for regular basketball games. The application enables a single
administrator to quickly generate balanced teams for a group of approximately 20
players using AI-powered algorithms.

### Key Features

- **AI-Powered Team Generation**: Generate three distinct team propositions per
  game (position-focused, skill-balanced, and general balanced)
- **Player Management**: Track players with skill tier ratings (S/A/B/C/D) and
  multiple positions
- **Two-Tier User System**: Admin access for full control, user access for
  viewing teams and statistics
- **Manual Adjustments**: Fine-tune AI-generated teams through drag-and-drop or
  player swapping
- **Game Management**: Create games, track results, and view historical data
- **Statistics Tracking**: Monitor player participation, win rates, and game
  history

### Problem Solved

The application eliminates the time-consuming manual process of creating
balanced teams (typically 15-30 minutes) by:

- Ensuring competitive balance through tier-based skill ratings
- Providing varied team compositions to prevent repetitive matchups
- Maintaining adequate position coverage across teams
- Reducing administrative burden on organizers

## Tech Stack

### Frontend

- **Next.js** v15.5 with App Router
- **React** v19
- **TypeScript** v5
- **Tailwind CSS** v4
- **Shadcn/ui** - Component library
- **Radix UI** - Accessible component primitives

### Backend

- **Next.js API Routes / Server Actions** - Backend logic
- **Drizzle ORM** - Database management
- **PostgreSQL** - Database (hosted on Supabase)
- **Supabase** - Backend infrastructure
- **AI SDK** v5 - AI model integration (Gemini API)

### Testing

- **Vitest** - Unit and integration tests
- **Playwright** - End-to-end testing
- **Storybook** - UI component testing and documentation

### DevOps

- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Application hosting

## Getting Started Locally

### Prerequisites

- **Node.js** v22.14.0 (specified in `.nvmrc`)
- **npm** or your preferred package manager
- **Supabase account** (for database)
- **AI API key** (Gemini or equivalent free-tier service)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/M-Kolacz/basketball-team-selector.git
   cd basketball-team-selector
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   # Create a .env.local file with the following variables:
   # Database configuration
   DATABASE_URL=your_supabase_connection_string

   # AI API configuration
   AI_API_KEY=your_ai_api_key

   # Add other required environment variables
   ```

4. Run database migrations:

   ```bash
   # Add migration command when available
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

### Development

```bash
npm run dev           # Start development server with Turbopack
npm run build         # Build production bundle with Turbopack
npm start            # Start production server
```

### Testing

```bash
npm test                    # Run unit tests with Vitest
npm run test:e2e:install    # Install Playwright browsers
npm run test:e2e:run        # Run E2E tests
npm run test:e2e:dev        # Run E2E tests in UI mode
```

### Code Quality

```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint errors
npm run format        # Check code formatting with Prettier
npm run format:fix    # Fix formatting issues
npm run typecheck     # Run TypeScript type checking
```

### Storybook

```bash
npm run storybook         # Start Storybook dev server on port 6006
npm run build-storybook   # Build Storybook for production
```

## Project Status

**Current Version**: 0.1.0 **Status**: MVP Development

## License

License information to be determined.

---

For detailed product requirements, see [docs/prd.md](docs/prd.md). For technical
stack details, see [docs/tech-stack.md](docs/tech-stack.md).
