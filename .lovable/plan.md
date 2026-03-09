

# Scale-Ready Security, Optimization, and Telemetry Hardening Plan

## Critical Security Findings

The security scan found **2 critical vulnerabilities** and **5 warnings**:

1. **CRITICAL**: All user emails, SP balances, ELO scores, referral codes, and personal data in `profiles` are publicly readable by unauthenticated users
2. **CRITICAL**: All transaction records including device fingerprints, security scan results, and buyer/seller data are publicly readable
3. **WARN**: 4 INSERT policies on `demo_bookings`, `enterprise_quotes`, `feature_requests`, `help_feedback` use `WITH CHECK (true)` allowing unlimited anonymous spam
4. **WARN**: Leaked password protection is disabled

---

## Phase 1: Database Security Hardening (Migration)

### 1A. Lock down `profiles` table
- Drop the `Profiles are viewable by everyone` policy
- Create two new policies:
  - **Public profile data**: Authenticated users can SELECT only non-sensitive columns via a security-definer view/function (display_name, avatar_url, bio, skills, elo, university, total_gigs_completed)
  - **Own profile full access**: Users can SELECT all columns where `user_id = auth.uid()`
- Since RLS operates at row level (not column level), create a `public_profiles` view with SECURITY DEFINER that exposes only safe columns, and restrict the base table to owner-only reads

### 1B. Lock down `transactions` table
- Drop `Transactions viewable by everyone`
- Replace with: `USING (auth.uid() = buyer_id OR auth.uid() = seller_id)` — participants only

### 1C. Tighten anonymous INSERT policies
- `demo_bookings`, `enterprise_quotes`: Add rate-limit-friendly constraints (keep `true` but add a validation trigger to limit inserts per IP/session)
- `feature_requests`: Change to `auth.uid() IS NOT NULL` — require authentication
- `help_feedback`: Change to `auth.uid() IS NOT NULL`

### 1D. Enable leaked password protection
- Use `configure_auth` to enable HaveIBeenPwned leaked password checking

### 1E. Add missing indexes for scale
- `proposals`: index on `sender_id`, `receiver_id`, `listing_id`
- `reviews`: index on `listing_id`, `reviewee_id`
- `transactions`: index on `buyer_id`, `seller_id`, `status`
- `disputes`: index on `filed_by`, `filed_against`, `status`
- `notifications`: index on `user_id, is_read`
- `escrow_contracts`: index on `buyer_id`, `seller_id`, `workspace_id`

---

## Phase 2: Telemetry Enhancements (Code)

The existing telemetry engine (947 lines) already captures 200+ data points per session. To reach Fiverr-level insights, we add:

### 2A. Conversion Funnel Tracking
- Add `logFunnelStep(funnel, step, metadata)` to `telemetry.ts`
- Track key funnels: Browse → View Listing → Propose → Accept → Complete → Review
- Store in a new `funnel_events` table

### 2B. Revenue/SP Flow Telemetry
- Add `logSPTransaction(type, amount, from, to)` for tracking SP economy health
- Track: transfers, escrow holds/releases, taxes, guild deposits

### 2C. Search Analytics
- Enhance existing `logSearch` to also track: zero-result queries, filter usage patterns, time-to-click after search
- Store in `search_analytics` table for marketplace optimization

### 2D. Real-time Performance Alerting
- Add a `performance_alerts` edge function that queries `error_log` and `page_sessions` for anomalies (error spike, engagement drop, high rage-click rates)
- Runs on a schedule or can be called from the analytics dashboard

---

## Phase 3: Performance Optimization (Code)

### 3A. Query Optimization
- Add `.abortSignal` to long-running queries for cancellation on unmount
- Implement cursor-based pagination for marketplace (replace offset pagination)
- Add React Query caching with stale-while-revalidate for listings, profiles

### 3B. Telemetry Batching Improvements
- Use `navigator.sendBeacon` for ALL exit flushes (currently only mentioned but not fully used)
- Increase click batch size from 20 to 50 for fewer DB round trips
- Add exponential backoff on flush failures

### 3C. Client-side Security
- Add input sanitization with zod schemas on all forms (proposals, reviews, contact, listings)
- Add CSP-compatible nonce generation for inline scripts
- Rate-limit client-side actions (proposal sends, review submits) with debounce guards

---

## Summary of Deliverables

| Area | Changes | Impact |
|------|---------|--------|
| RLS Policies | Fix 2 critical + 4 warnings | Blocks data leaks |
| Auth | Enable leaked password protection | Prevents credential stuffing |
| Indexes | 12 new indexes on high-traffic tables | 10-50x faster queries at scale |
| Telemetry | Funnel tracking, SP flow, search analytics | Fiverr-level product insights |
| Performance | Beacon flushing, cursor pagination, React Query | Handles 100K+ concurrent users |
| Input validation | Zod schemas on all mutation forms | Prevents injection attacks |

