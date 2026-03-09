# SkillSwappr — Architecture Guide

## Overview

SkillSwappr is a React SPA with a Supabase backend (via Lovable Cloud). The architecture is designed for **portability** — every piece can run on any standard Supabase + static hosting setup.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui, Framer Motion |
| State | TanStack React Query (server), React Context (auth) |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions) |
| Hosting | Lovable Cloud / Netlify / Vercel / any static host |
| CI/CD | GitHub Actions |

## Directory Structure

```
src/
├── components/
│   ├── shared/          # App-wide components (Navbar, Footer, etc.)
│   └── ui/              # shadcn/ui primitives
├── features/            # Feature-based modules
│   ├── auth/            # Login, Signup
│   ├── marketplace/     # Gig browsing, cards, filters
│   ├── workspace/       # Gig workspace (chat, files, stages)
│   ├── guild/           # Guild system
│   ├── dashboard/       # User dashboards
│   ├── home/            # Landing page sections
│   └── ...              # Each feature is self-contained
├── hooks/               # Global hooks
├── lib/                 # Utilities, auth context, telemetry
├── integrations/        # Auto-generated Supabase client & types
├── pages/               # Error pages (404, 500, etc.)
└── test/                # Test utilities & test files

supabase/
├── config.toml          # Supabase project config
├── migrations/          # SQL migrations (chronological)
└── functions/           # Edge functions
    ├── ai-chat/
    ├── workspace-ai/
    └── seed-test-data/
```

## Key Architectural Decisions

### 1. Feature-Based Module Structure
Each domain (marketplace, workspace, guild, etc.) is a self-contained folder with its own components, hooks, data, and pages. This prevents cross-feature coupling.

### 2. Server State with React Query
All database queries use TanStack React Query for caching, deduplication, background refetching, and optimistic updates. No custom state management library.

### 3. Auth Context (not Redux)
Auth state is a single React Context (`src/lib/auth-context.tsx`) wrapping the Supabase Auth listener. Profile data is fetched on session change and cached.

### 4. Portable Backend
- No Lovable-specific APIs in core code
- Edge functions use standard Deno/Supabase patterns
- OAuth wrapper falls back to standard Supabase Auth
- AI gateway uses configurable env vars

### 5. Design System
All colors use HSL CSS custom properties defined in `src/index.css`. Components use semantic tokens (`--primary`, `--muted`, `--surface-1`, etc.) — never hardcoded colors.

### 6. Code Splitting
Every page is `lazy()` loaded. The main bundle is minimal — each route loads on demand.

## Data Flow

```
User Action
  → React Component
    → React Query mutation/query
      → Supabase Client (auto-generated)
        → Postgres (RLS enforced)
        → Edge Functions (for AI, notifications)
      ← Response
    ← Cache update
  ← UI re-render
```

## Security Model

- **RLS on every table** — Postgres Row Level Security enforces access rules
- **`has_role()` function** — Security definer function for role checks
- **No client-side role checks** — All authorization is server-side
- **Rate limiting** — Trigger-based rate limits on public forms
- **Input validation** — Zod schemas on all forms

## Database Schema Groups

| Group | Tables | Status |
|-------|--------|--------|
| Auth & Identity | `profiles`, `user_roles` | ✅ Functional |
| Workspace | `workspace_*`, `escrow_contracts` | ✅ Functional |
| Marketplace | `listings`, `transactions` | Schema ready |
| Guilds | `guilds`, `guild_*` | Schema ready |
| Gamification | `achievements`, `badges`, `leaderboard_*` | Schema ready |
| Content | `blog_*`, `forum_*`, `events`, `help_*` | Schema ready |
| Platform | `contact_submissions`, `feature_*`, `changelog_*` | Schema ready |
| Analytics | `activity_log`, `click_heatmap`, `page_sessions`, `funnel_events` | ✅ Functional |
