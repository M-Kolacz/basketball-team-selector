# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is a Next.js 15 application for basketball team selection, bootstrapped
with `create-next-app`. It uses:

- **Next.js 15.5.4** with App Router
- **React 19.1.0**
- **TypeScript 5**
- **Tailwind CSS 4** (with new `@import` syntax)
- **Turbopack** for fast builds and development

## Common Commands

```bash
# Development server (uses Turbopack)
npm run dev

# Production build (uses Turbopack)
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

The development server runs on [http://localhost:3000](http://localhost:3000).

## Project Structure

- **`src/app/`** - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with Geist fonts and global styles
  - `page.tsx` - Homepage component
  - `globals.css` - Global styles with Tailwind CSS imports and theme variables

## TypeScript Configuration

- **Path alias**: `#app/*` maps to `./src/*` (defined in
  [tsconfig.json:22](tsconfig.json#L22))
- **Target**: ES2017
- **Module resolution**: bundler (Next.js optimized)
- Strict mode enabled

## Styling

Uses Tailwind CSS 4 with the new `@import "tailwindcss"` syntax. Theme variables
are defined in [globals.css:8-13](src/app/globals.css#L8-L13) using
`@theme inline` directive. Dark mode is supported via `prefers-color-scheme`.

## Fonts

Uses Geist and Geist Mono fonts from Google Fonts, configured in
[layout.tsx:5-13](src/app/layout.tsx#L5-L13) with CSS variables.

## Rules to follow

- Be extremely concise, sacrifice grammar for the sake of concision
