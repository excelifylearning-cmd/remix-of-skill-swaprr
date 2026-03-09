

# Complete Marketplace Overhaul + Enterprise Lockdown + Format Pages + Third-Party Readiness

## Current Issues Identified

1. **Marketplace uses 270+ lines of hardcoded mock data** (`mockData.ts`) — all gig cards, projects, fusions, SP-only gigs, requests, and featured sellers are fake
2. **No dedicated pages for gig formats** — Auction, Co-Creation, Skill Fusion, SP Only, Flash Market, Projects all render inline in MarketplacePage with no dedicated routes or detail views
3. **Enterprise dashboard is open to any authenticated user** — no role gating, anyone who logs in can access `/enterprise-dashboard`
4. **GigQuickView has hardcoded mock reviews** (lines 21-25)
5. **GigDetailPage falls back to mock data** when DB lookup fails (lines 59-79)
6. **No third-party integrations** — no payment processor, no email service, no file CDN beyond Supabase storage
7. **No custom workspace creation flow** for format-specific gigs

---

## Phase 1: Enterprise Access Control

### Database Migration
```sql
-- Add 'enterprise' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'enterprise';

-- Create enterprise_accounts table for org management
CREATE TABLE public.enterprise_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid NOT NULL,
  logo_url text,
  plan text NOT NULL DEFAULT 'standard',
  max_seats integer NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE enterprise_accounts ENABLE ROW LEVEL SECURITY;

-- Enterprise members (managed by enterprise admins)
CREATE TABLE public.enterprise_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES enterprise_accounts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  invited_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(account_id, user_id)
);
ALTER TABLE enterprise_members ENABLE ROW LEVEL SECURITY;
```

### RLS Policies
- Enterprise accounts: viewable by members, manageable by owner + admins
- Enterprise members: viewable by same-account members, manageable by account admins
- Enterprise dashboard route: check `has_role(uid, 'enterprise')` or membership in `enterprise_members`

### Code Changes
- **EnterpriseDashboardPage.tsx**: Add role check — redirect non-enterprise users to `/403`
- **SignupPage.tsx**: Remove any enterprise signup option; enterprise accounts created by platform admins only
- Add "People & Roles" tab to Enterprise Dashboard for managing members
- Enterprise admins can invite users via email, assign roles (admin, manager, member, viewer)

---

## Phase 2: Remove All Mock Data & Wire to DB

### Delete `mockData.ts` hardcoded arrays
Replace the entire marketplace data flow:

1. **`useMarketplaceData.ts`**: Already fetches from `listings` table but falls back to mock. Remove the fallback — show empty states instead
2. **MarketplacePage.tsx**: Stop importing from `mockData.ts` — all modes (auctions, cocreation, projects, fusion, sp-only, flash, requests) should query the `listings` table filtered by `format`
3. **GigQuickView.tsx**: Remove `mockReviews` array, fetch real reviews from `reviews` table
4. **GigDetailPage.tsx**: Remove mock fallback (lines 59-79), show "Gig not found" for missing DB records
5. **FeaturedSellers.tsx**: Query `profiles` ordered by `elo DESC, total_gigs_completed DESC` instead of hardcoded array
6. **MarketplacePreviewSection.tsx** (homepage): Already fetches from DB with fallback — remove fallback array

### Keep `mockData.ts` only for type definitions
Strip all data arrays, keep only the TypeScript interfaces (`Gig`, `Project`, `SkillFusion`, etc.) and the `modes` array + `MarketplaceMode` type.

---

## Phase 3: Format-Specific Pages & Routes

Create dedicated pages for each marketplace format with unique UX:

### New Routes in App.tsx
```
/marketplace/auctions        → AuctionsPage
/marketplace/cocreation       → CoCreationPage
/marketplace/skill-fusion     → SkillFusionPage
/marketplace/sp-only          → SPOnlyPage
/marketplace/flash-market     → FlashMarketPage
/marketplace/projects         → ProjectsPage
/marketplace/requests         → RequestsPage
```

### Page Structure (each format page)
Each gets its own file under `src/features/marketplace/pages/`:
- **AuctionsPage**: Live countdown timers, bid history, current bid display, "Place Bid" action
- **CoCreationPage**: Team builder UI, role slots, join request flow
- **SkillFusionPage**: Multi-skill combo display, "looking for" tags, complexity rating
- **SPOnlyPage**: Price-focused cards, SP balance check, instant purchase flow
- **FlashMarketPage**: Urgency indicators, 2.5x multiplier display, time-limited listings
- **ProjectsPage**: Project cards with role grids, deadline tracking, applicant count
- **RequestsPage**: Request board with response count, budget display

All pages query `listings` filtered by `format` column.

### Detail Page Enhancement
Update `GigDetailPage.tsx` to render format-specific sections:
- Auctions: bid panel, bid history, countdown
- Co-Creation: team roster, open roles
- SP Only: purchase button instead of "Propose Swap"

---

## Phase 4: Custom Workspaces for Format Types

### Database Migration
```sql
-- Add format-specific fields to workspace metadata
ALTER TABLE public.workspace_members
  ADD COLUMN IF NOT EXISTS workspace_type text DEFAULT 'standard';
```

### Workspace Creation Flow
When a proposal is accepted or a gig is matched:
1. System creates a workspace with `workspace_type` matching the gig format
2. Format-specific panels are shown/hidden based on type:
   - **Auction**: Escrow auto-created from winning bid amount
   - **Co-Creation**: Members panel pre-populated with team
   - **SP Only**: No "Swap" panel, direct SP transfer flow
   - **Flash Market**: Tight deadline enforcement, auto-escalation

---

## Phase 5: Third-Party Service Readiness

### What's Missing for Launch

| Service | Purpose | Implementation |
|---------|---------|---------------|
| **Stripe** | SP purchases with real money, enterprise billing | Use Lovable's Stripe connector for checkout sessions |
| **Resend/Email** | Transactional emails (welcome, swap accepted, dispute filed) | Edge function + email API |
| **Image CDN** | Profile avatars, gig cover images | Already have `workspace-files` bucket; add `avatars` and `gig-images` buckets |
| **Error Tracking** | Already have `error_log` table | Wire to frontend error boundary |
| **Analytics/Posthog** | User behavior | Already have telemetry system; this is optional |

### Immediate Actions
1. **Add `avatars` and `gig-images` storage buckets** for proper file uploads
2. **Create email notification edge function** using existing secrets for transactional emails
3. **Enable Stripe connector** for SP top-ups and enterprise billing (will prompt user)
4. **Add cover image upload** to Create Gig flow (currently missing)

---

## Phase 6: Create Gig Flow Enhancements

### Missing Formats in Create Gig
Currently only supports: Direct Swap, Auction, Co-Creation, Skill Fusion.

Add:
- **SP Only**: Price field in SP, no "seeking" field
- **Flash Market**: Duration selector (1h, 4h, 12h, 24h), multiplier display
- **Project**: Multi-role builder, deadline picker, total SP budget

### File Upload
Wire the attachment area in Step 2 to upload to `gig-images` bucket.

---

## Summary of Deliverables

| # | Task | Files |
|---|------|-------|
| 1 | Enterprise role gating + member management | Migration, EnterpriseDashboardPage.tsx |
| 2 | Remove all mock data, wire to DB | mockData.ts, MarketplacePage.tsx, GigQuickView.tsx, GigDetailPage.tsx, FeaturedSellers.tsx |
| 3 | 7 format-specific pages + routes | 7 new page files, App.tsx |
| 4 | Format-aware workspace creation | WorkspacePage.tsx, migration |
| 5 | Storage buckets for images | Migration |
| 6 | Email notification edge function | New edge function |
| 7 | Enhanced Create Gig (all formats + upload) | DashboardPage.tsx |
| 8 | Stripe connector prompt | Connector setup |

