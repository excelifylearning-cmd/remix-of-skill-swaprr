

# Dedicated Format Pages with Custom Workflows & Workspaces

## Current State
- All gig formats render inside `MarketplacePage.tsx` via mode switching — no dedicated routes
- Single `GigDetailPage.tsx` handles all formats with minor conditional panels
- One generic `WorkspacePage.tsx` (1324 lines) serves all workspace types identically
- 7 formats exist: Direct Swap, Auction, Co-Creation, Skill Fusion, SP Only, Flash Market, Projects (+ Requests)

## What We'll Build

### 1. Seven Dedicated Format Browse Pages
New directory: `src/features/marketplace/pages/`

Each page queries `listings` filtered by `format`, with format-specific UI:

| Page | Route | Unique Features |
|------|-------|-----------------|
| **AuctionsPage** | `/marketplace/auctions` | Live countdown timers, current bid display, bid history panel, "Place Bid" inline |
| **CoCreationPage** | `/marketplace/cocreation` | Team roster slots, open roles, "Join Team" action, skill-match indicators |
| **SkillFusionPage** | `/marketplace/skill-fusion` | Multi-participant cards, "looking for" skill tags, complexity meter |
| **SPOnlyPage** | `/marketplace/sp-only` | Price-focused grid, instant purchase button, SP balance check |
| **FlashMarketPage** | `/marketplace/flash-market` | Urgency countdown, 2.5x multiplier badge, time-limited visual treatment |
| **ProjectsPage** | `/marketplace/projects` | Role grid cards, deadline tracker, applicant count, progress bars |
| **RequestsPage** | `/marketplace/requests` | Request board, response count, budget range, "Offer Help" action |

Each page includes: AppNav, format-specific header with description/stats, filtered grid of cards, pagination, and links back to main marketplace.

### 2. Format-Specific Detail Pages
Enhance `GigDetailPage.tsx` with dedicated panels per format:
- **Auction**: Real-time bid panel with bid input, bid history list, countdown timer, auto-refresh
- **Co-Creation**: Team roster with filled/open slots, "Request to Join" flow, role descriptions
- **Skill Fusion**: Participant list with skills, "looking for" section, complexity/duration breakdown
- **SP Only**: Prominent SP price, "Buy Now" button, SP balance display
- **Flash Market**: Urgency banner, time remaining, multiplier callout, express purchase
- **Project**: Role grid, deadline, applicant list, "Apply for Role" modal
- **Request**: Requester info, budget, "Submit Offer" flow

### 3. Format-Aware Workspaces
The current workspace has generic panels. We'll add format-specific sidebar sections and behaviors:

**Database change**: Add `workspace_type` column to a new `workspaces` metadata table (or use existing workspace_members pattern):

```sql
CREATE TABLE public.workspaces (
  id text PRIMARY KEY,
  listing_id uuid REFERENCES listings(id),
  workspace_type text NOT NULL DEFAULT 'direct_swap',
  title text NOT NULL DEFAULT '',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
```

RLS: participants (workspace_members) can view; creator can manage.

**Workspace customizations per format**:

| Format | Extra Panels | Behavior Differences |
|--------|-------------|---------------------|
| **Auction** | Bid History panel, Winner announcement | Escrow auto-created from winning bid; no "Propose Swap" |
| **Co-Creation** | Team Management panel, Role Assignment | Multi-member (3+); stages per role; shared deliverables |
| **Skill Fusion** | Skill Map panel, Fusion Progress | Multiple participants contribute different skills |
| **SP Only** | Payment Confirmation panel | No swap; direct SP transfer; simplified stages |
| **Flash Market** | Deadline Enforcer panel | Hard deadline with auto-escalation warning; 2.5x SP display |
| **Project** | Kanban Board panel, Role Tracker | Multi-role tracking; per-role deliverables; project timeline |
| **Direct Swap** | Standard (current) | Default behavior — no changes |

Implementation: `WorkspacePage.tsx` reads `workspace_type` from the new `workspaces` table, then conditionally shows/hides panels and adjusts sidebar sections.

### 4. Routes in App.tsx
Add 7 new lazy-loaded routes:
```
/marketplace/auctions      → AuctionsPage
/marketplace/cocreation     → CoCreationPage  
/marketplace/skill-fusion   → SkillFusionPage
/marketplace/sp-only        → SPOnlyPage
/marketplace/flash-market   → FlashMarketPage
/marketplace/projects       → ProjectsPage
/marketplace/requests       → RequestsPage
```

### 5. MarketplacePage Sidebar Links
Update `MarketplaceSidebar` mode items to link to dedicated pages instead of inline mode switching — each mode label becomes a `Link` to its dedicated route.

## File Summary

| # | Action | File |
|---|--------|------|
| 1 | Migration | Create `workspaces` table with `workspace_type` |
| 2 | Create | `src/features/marketplace/pages/AuctionsPage.tsx` |
| 3 | Create | `src/features/marketplace/pages/CoCreationPage.tsx` |
| 4 | Create | `src/features/marketplace/pages/SkillFusionPage.tsx` |
| 5 | Create | `src/features/marketplace/pages/SPOnlyPage.tsx` |
| 6 | Create | `src/features/marketplace/pages/FlashMarketPage.tsx` |
| 7 | Create | `src/features/marketplace/pages/ProjectsPage.tsx` |
| 8 | Create | `src/features/marketplace/pages/RequestsPage.tsx` |
| 9 | Edit | `src/App.tsx` — add 7 routes |
| 10 | Edit | `src/features/marketplace/components/GigDetailPage.tsx` — format-specific detail panels |
| 11 | Edit | `src/features/workspace/WorkspacePage.tsx` — format-aware sidebar + panels |
| 12 | Edit | `src/features/marketplace/components/MarketplaceSidebar.tsx` — link to dedicated pages |

