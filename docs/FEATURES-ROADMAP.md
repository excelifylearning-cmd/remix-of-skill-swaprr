# SkillSwappr — Feature Roadmap & Implementation Guide

## Remaining Features (Prioritized)

### Phase 1: Core MVP (Required for Launch)

| Feature | Effort | Dependencies |
|---------|--------|-------------|
| SP Economy & Ledger | 3-4 sessions | New `sp_transactions` table |
| Gig CRUD (Create/Edit Listings) | 2-3 sessions | `listings` table (exists) |
| Order/Proposal System | 3-4 sessions | New `orders` table |
| Reviews & Ratings | 2 sessions | New `reviews` table |
| Notifications (in-app) | 2 sessions | New `notifications` table |
| Profile Edit UI | 1 session | `profiles` table (exists) |
| Dashboard → Real Data | 2 sessions | Orders + listings wired |

### Phase 2: Social & Discovery

| Feature | Effort | Dependencies |
|---------|--------|-------------|
| Global Messenger | 3 sessions | New `conversations` + `messages` tables |
| Portfolio Management | 1-2 sessions | Profile JSON column |
| Follow/Endorse System | 1-2 sessions | New `follows`, `endorsements` tables |
| Clips (Portfolio Shorts) | 2 sessions | New `clips` table + storage |
| Settings Page | 1 session | Profile update API |
| Onboarding Tour | 1 session | SP reward trigger |

### Phase 3: Advanced Platform

| Feature | Effort | Dependencies |
|---------|--------|-------------|
| Guild CRUD & Management | 3 sessions | Tables exist |
| Skill Court (Full Flow) | 4-5 sessions | Dispute + jury tables exist |
| ELO Calculation Engine | 2 sessions | DB function |
| Achievement/Badge Triggers | 2 sessions | Tables exist |
| Tournament System | 2-3 sessions | Tables exist |
| Leaderboard (Live Data) | 1 session | Profile ELO data |

### Phase 4: Enterprise & Financial

| Feature | Effort | Dependencies |
|---------|--------|-------------|
| Stripe Integration | 3-4 sessions | Stripe connector |
| Enterprise Dashboard (Live) | 2 sessions | Tables exist |
| Admin Dashboard | 3-4 sessions | Role-based access |
| Buyer Dashboard | 2 sessions | Orders data |

### Phase 5: AI & Intelligence

| Feature | Effort | Dependencies |
|---------|--------|-------------|
| AI Personal Helper | 2 sessions | Edge function exists |
| Dynamic Pricing AI | 2 sessions | Lovable AI models |
| Plagiarism Detection | 2 sessions | Lovable AI models |
| Smart Matching | 2 sessions | Lovable AI models |

### Not Feasible on Current Stack

| Feature | Reason | Alternative |
|---------|--------|------------|
| Native iOS/Android | React web only | PWA with service worker |
| WebRTC Video Calls | Needs media servers | Integrate Daily.co or Twilio |
| Real-time Whiteboard | Needs CRDT | Integrate tldraw or Excalidraw embed |
| Push Notifications | Needs service worker | Web push via OneSignal |
| Crypto Payments | Complex integration | Defer to Phase 5+ |

## How to Implement Each Feature

### SP Economy (Example)

```sql
-- 1. Create migration
CREATE TABLE sp_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  type text NOT NULL, -- 'earn', 'spend', 'tax', 'transfer', 'reward'
  reference_type text, -- 'gig', 'signup', 'referral', 'court_duty'
  reference_id uuid,
  balance_after integer NOT NULL,
  created_at timestamptz DEFAULT now()
);
-- Add RLS, indexes, etc.
```

```typescript
// 2. Create hook
const useSpBalance = (userId: string) => {
  return useQuery({
    queryKey: ['sp-balance', userId],
    queryFn: () => supabase
      .from('sp_transactions')
      .select('balance_after')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
  });
};
```

### Reviews System (Example)

```sql
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid NOT NULL,
  reviewed_id uuid NOT NULL,
  listing_id uuid REFERENCES listings(id),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  content text,
  created_at timestamptz DEFAULT now()
);
```
