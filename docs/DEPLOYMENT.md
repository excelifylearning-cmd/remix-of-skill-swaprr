# SkillSwappr — Deployment Guide

## Quick Start (Lovable Cloud)

If using Lovable Cloud, deployment is automatic:
- **Frontend**: Click "Publish" in the Lovable editor
- **Backend**: Edge functions and migrations deploy automatically

## Self-Hosted Deployment

### Prerequisites
- Node.js 20+
- Supabase CLI
- Netlify CLI (or Vercel, Cloudflare Pages, etc.)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/skillswappr.git
cd skillswappr
npm ci
```

### 2. Set Up Supabase

```bash
# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Run all migrations
supabase db push

# Deploy edge functions
supabase functions deploy ai-chat
supabase functions deploy workspace-ai
supabase functions deploy seed-test-data
```

### 3. Configure Environment

Create `.env`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### 4. Configure Edge Function Secrets

```bash
supabase secrets set AI_CHAT_API_KEY=your_openai_key
supabase secrets set AI_PROVIDER_URL=https://api.openai.com/v1
```

### 5. Build & Deploy

```bash
# Build
npm run build

# Deploy to Netlify
npx netlify deploy --prod --dir=dist

# Or use the script
./scripts/deploy.sh production
```

### 6. Configure Supabase Auth

In Supabase Dashboard → Authentication → Settings:
- Set Site URL to your production domain
- Add redirect URLs for OAuth
- Enable email confirmations for production
- Configure Google OAuth (optional)

## CI/CD Pipeline

The `.github/workflows/ci.yml` pipeline runs:
1. **Lint & Type Check** — catches errors before merge
2. **Unit Tests** — runs vitest suite
3. **Build** — ensures production build succeeds
4. **Preview Deploy** — auto-deploys PR previews to Netlify
5. **Production Deploy** — deploys main branch to production

### Required GitHub Secrets

| Secret | Where to get it |
|--------|----------------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Same as above (anon key) |
| `NETLIFY_AUTH_TOKEN` | Netlify → User Settings → Applications |
| `NETLIFY_SITE_ID` | Netlify → Site Settings → General |
| `SUPABASE_ACCESS_TOKEN` | Supabase Dashboard → Account → Access Tokens |
| `SUPABASE_PROJECT_REF` | Supabase Dashboard → Settings → General |

## Monitoring

### Health Checks
```bash
./scripts/health-check.sh https://your-domain.com
```

### Error Tracking
Errors are logged to `error_log` table. Query via:
```sql
SELECT * FROM error_log ORDER BY created_at DESC LIMIT 50;
```

### Performance
- Vite code splitting per route
- Asset caching via Netlify headers (1 year immutable)
- Database indexes on high-traffic columns
- Cursor-based pagination on list pages

## Scaling Considerations

| Traffic | Recommendation |
|---------|---------------|
| < 1K users | Free tier Supabase, single Netlify site |
| 1K–10K | Supabase Pro, add read replicas if needed |
| 10K–100K | Supabase Pro + connection pooling, CDN |
| 100K+ | Supabase Enterprise, multi-region, edge caching |
