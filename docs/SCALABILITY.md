# SkillSwappr — Scalability & Optimization Guide

## Current Optimizations

### Frontend
- **Code splitting**: Every page lazy-loaded via `React.lazy()`
- **React Query caching**: Prevents redundant API calls, stale-while-revalidate
- **Tailwind purging**: Unused CSS removed at build time
- **Asset immutable caching**: 1-year cache on hashed static assets
- **AbortController**: Marketplace queries cancel on navigation

### Database
- **18 performance indexes** on high-traffic columns (listings, profiles, notifications)
- **Cursor-based pagination** on marketplace and browse pages
- **RLS policies** — row-level security pushes auth to Postgres layer
- **Security definer functions** — `has_role()` avoids recursive RLS

### Backend
- **Edge Functions on Deno** — cold start < 200ms, auto-scaling
- **Connection pooling** via Supabase's built-in pgBouncer

## Future Optimizations (When Needed)

### < 10K Users (Current Phase)
No changes needed. Free/Pro Supabase handles this easily.

### 10K–50K Users
1. **Enable Supabase connection pooling** (pgBouncer in transaction mode)
2. **Add CDN** (Cloudflare) in front of static assets
3. **Implement API response caching** with stale-while-revalidate headers on edge functions
4. **Add database materialized views** for leaderboard/analytics queries

### 50K–200K Users
1. **Read replicas** — route read-heavy queries (marketplace browse, profiles) to replicas
2. **Full-text search** — migrate marketplace search from `ILIKE` to `tsvector` indexes
3. **Background jobs** — move ELO calculation, achievement triggers to async edge functions
4. **Rate limiting** — enforce per-user API rate limits at edge layer

### 200K+ Users
1. **Multi-region deployment** — Supabase Enterprise + edge compute
2. **Sharding** — partition `activity_log`, `click_heatmap` by date
3. **Event sourcing** — SP ledger should be append-only with materialized balances
4. **WebSocket optimization** — selective realtime subscriptions, not broadcast

## Performance Monitoring Checklist

- [ ] Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Supabase query latency dashboard
- [ ] Error rate tracking via `error_log` table
- [ ] Edge function execution time monitoring
- [ ] Bundle size tracking (keep < 500KB initial load)

## Database Index Strategy

```sql
-- Already implemented:
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_profiles_elo ON profiles(elo DESC);
CREATE INDEX idx_profiles_university ON profiles(university);
-- ... 13 more indexes across tables

-- Future (when data grows):
CREATE INDEX idx_listings_search ON listings USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_activity_log_date ON activity_log(created_at DESC);
```

## Bundle Size Budget

| Chunk | Budget | Current |
|-------|--------|---------|
| Initial (vendor) | < 200KB | ~180KB |
| Per-route | < 50KB | ~20-40KB |
| Total (all routes) | < 2MB | ~1.5MB |
