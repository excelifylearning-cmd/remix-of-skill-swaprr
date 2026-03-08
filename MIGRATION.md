# SkillSwappr — Self-Hosting & Migration Guide

This project is **fully portable** — zero vendor lock-in. You can run the entire backend on any Supabase instance (Cloud, self-hosted, or local Docker).

---

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) (`npm i -g supabase`)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local hosting)
- Node.js 18+

---

## Option 1: Local Self-Hosted (Docker)

```bash
# 1. Clone the repo
git clone <your-repo-url> && cd skillswappr

# 2. Start local Supabase (spins up Postgres, Auth, Storage, etc.)
supabase start

# 3. Apply all migrations
supabase db reset

# 4. Get your local credentials
supabase status
# → Copy API URL and anon key

# 5. Create .env for the frontend
cat > .env.local << EOF
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
EOF

# 6. Install & run frontend
npm install
npm run dev
```

Your full stack is now running locally — database, auth, storage, everything.

---

## Option 2: Migrate to Your Own Supabase Cloud Project

```bash
# 1. Create a project at https://supabase.com/dashboard

# 2. Link to your project
supabase link --project-ref <your-project-ref>

# 3. Push all migrations
supabase db push

# 4. Update .env with your project credentials
VITE_SUPABASE_URL=https://<your-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

---

## Option 3: Migrate to Any Postgres Database

The migrations in `supabase/migrations/` are **standard PostgreSQL SQL**. If you're migrating to a non-Supabase Postgres:

1. Run each `.sql` file in `supabase/migrations/` in order against your database
2. You'll need to provide your own auth layer (the `auth.users` and `auth.uid()` references are Supabase-specific — replace with your auth system's user table/function)
3. RLS policies use Supabase's `auth.uid()` — adapt to your auth middleware

---

## What's in the Backend

### Database Schema (all in `supabase/migrations/`)

| Table | Purpose |
|-------|---------|
| `profiles` | Full user profiles (40+ fields: skills, bio, SP, ELO, tier, work/education history, social links, preferences) |
| `user_roles` | Role-based access control (`admin`, `moderator`, `user`, `enterprise`) — separate table to prevent privilege escalation |
| `activity_log` | Comprehensive audit trail for all user actions, metadata, AI training data |

### Functions & Triggers

| Function | Purpose |
|----------|---------|
| `has_role(user_id, role)` | Security definer function — checks roles without recursive RLS |
| `handle_new_user()` | Auto-creates profile + default `user` role on signup |
| `update_updated_at_column()` | Auto-updates `updated_at` timestamp on any row change |

### RLS Policies

All tables have Row Level Security enabled:

- **profiles**: Public read, owner-only write/delete
- **user_roles**: Owner can view own roles, admins can manage all
- **activity_log**: Owner can view/insert own logs, admins can view all

### Indexes

Performance indexes on all foreign keys and frequently queried columns.

---

## Frontend Integration

The frontend connects via two environment variables only:

```
VITE_SUPABASE_URL        → Your Supabase API endpoint
VITE_SUPABASE_PUBLISHABLE_KEY → Your Supabase anon/public key
```

The Supabase client is initialized in `src/integrations/supabase/client.ts` using the standard `@supabase/supabase-js` SDK — no proprietary wrappers.

Auth context in `src/lib/auth-context.tsx` uses standard Supabase auth methods:
- `supabase.auth.signUp()`
- `supabase.auth.signInWithPassword()`
- `supabase.auth.signOut()`
- `supabase.auth.onAuthStateChange()`
- `supabase.auth.getSession()`

---

## Migration Checklist

- [x] All SQL in `supabase/migrations/` — no manual DB setup needed
- [x] No hardcoded project IDs in application code
- [x] No Lovable-specific backend dependencies
- [x] Standard `@supabase/supabase-js` client
- [x] Environment variables for all configuration
- [x] RLS policies included in migrations
- [x] Triggers and functions included in migrations
- [x] Indexes included in migrations
- [x] Types auto-generated from schema (`src/integrations/supabase/types.ts`)

---

## Regenerating Types After Schema Changes

```bash
# If you modify the schema, regenerate TypeScript types:
supabase gen types typescript --local > src/integrations/supabase/types.ts
# Or for remote:
supabase gen types typescript --project-id <ref> > src/integrations/supabase/types.ts
```

---

## Data Export

To export existing data from Lovable Cloud before migrating:

```bash
# Export via pg_dump (get connection string from Cloud settings)
pg_dump <DATABASE_URL> --data-only --inserts > data_export.sql

# Import into your new instance
psql <NEW_DATABASE_URL> < data_export.sql
```
