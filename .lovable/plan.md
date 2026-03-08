

# Marketplace Complete Redesign — Frontend Only

## Current State
The marketplace is a single 1873-line monolith file with everything rendered in one long vertical scroll. Sidebar scrolls to sections on the same page. Quick-view modal is a small bottom sheet. No dedicated gig pages. No user/guild profile preview popover. No pagination — just "Load More." All mock data hardcoded inline.

## Design Direction
Fiverr-inspired page-wise marketplace. You land directly in the market (no hero banner). Persistent left sidebar with filters, not just mode navigation. Each gig card click opens a rich Quick-View drawer (right slide-in, not bottom sheet), with a "View Full Gig" button leading to a dedicated route. User avatars show a hoverable profile preview card. Guild badges link to guild preview popover. Paginated results, not infinite scroll.

## Architecture — Split Into Multiple Files

```text
src/features/marketplace/
├── MarketplacePage.tsx          — Layout shell: sidebar + main area + routing
├── components/
│   ├── MarketplaceSidebar.tsx   — Persistent left sidebar (modes + filters)
│   ├── MarketplaceHeader.tsx    — Search bar, sort, view toggle, breadcrumb
│   ├── GigCard.tsx              — Standard gig card (grid + list variants)
│   ├── AuctionCard.tsx          — Live auction card with countdown
│   ├── CoCreationCard.tsx       — Co-creation team card
│   ├── ProjectCard.tsx          — Project card with roles
│   ├── SkillFusionCard.tsx      — Multi-skill fusion card
│   ├── FlashMarketCard.tsx      — Time-limited flash deal card
│   ├── SPOnlyCard.tsx           — SP-only purchase card
│   ├── RequestCard.tsx          — Request board card
│   ├── GigQuickView.tsx         — Right-side slide-in drawer (full details)
│   ├── GigDetailPage.tsx        — Full dedicated gig page (/marketplace/:gigId)
│   ├── UserPreviewPopover.tsx   — Hover card showing user mini-profile
│   ├── GuildPreviewPopover.tsx  — Hover card showing guild mini-profile
│   ├── Pagination.tsx           — Page-wise pagination controls
│   └── FeaturedSellers.tsx      — Featured sellers horizontal strip
├── data/
│   └── mockData.ts              — All mock gig/project/fusion/request data
├── utils/
│   └── marketplace-utils.ts     — eloTier, formatIcon, formatColor, filters
└── hooks/
    └── useMarketplaceFilters.ts — Filter/sort/search/pagination state
```

## Layout

```text
┌──────────────────────────────────────────────────────┐
│  Header: Search │ Sort │ View │ Category pills       │
├────────────┬─────────────────────────────────────────┤
│ Sidebar    │  Content Area (page-wise)               │
│ (240px)    │                                         │
│            │  ┌─────────────────────────────────┐    │
│ MODES      │  │  Active mode content             │    │
│ · Explore  │  │  (grid or list of cards)         │    │
│ · Trending │  │                                   │    │
│ · SP Only  │  │                                   │    │
│ · Auctions │  └─────────────────────────────────┘    │
│ · Co-Create│                                         │
│ · Fusion   │  ┌─ Pagination ─────────────────┐      │
│ · Projects │  │  < 1 2 3 ... 12 >            │      │
│ · Flash    │  └──────────────────────────────┘      │
│ · Requests │                                         │
│ · For You  │                                         │
│ ────────── │                                         │
│ FILTERS    │  ┌── Quick View Drawer ──────────┐     │
│ Category   │  │  (slides from right)           │     │
│ ELO Range  │  │  Full gig details              │     │
│ Verified   │  │  User preview + actions        │     │
│ Delivery   │  │  "View Full Page" button       │     │
│ SP Range   │  └────────────────────────────────┘     │
│ ────────── │                                         │
│ [Post Gig] │                                         │
└────────────┴─────────────────────────────────────────┘
```

## Key Design Changes

### 1. No Hero Banner
Remove the large hero section at the top. You enter directly into the marketplace grid. The sidebar + search header IS the landing experience.

### 2. Persistent Sidebar with Collapsible Filters
Top section: mode navigation (Explore, Trending, SP Only, Auctions, etc.) — clicking switches what content area shows (different card types per mode).
Bottom section: collapsible filter groups (Category, ELO, Verified, Delivery Time, SP Range, Format). Each is an accordion. Active filter count badge on the sidebar.

### 3. Page-Wise Pagination
Replace "Load More" with proper pagination: `< 1 2 3 ... 12 >`. 12 items per page for grid, 20 for list. Show total result count + current page indicator.

### 4. Right-Side Quick View Drawer
Instead of a bottom-sheet modal, clicking a gig card opens a smooth right-side slide-in drawer (480px wide). Contains:
- Full gig details (offering, wants, description, requirements)
- Seller mini-profile with hoverable link to full profile
- SP balance info
- Delivery timeline
- Reviews preview (mock)
- Action buttons: Propose Swap, Like, Save, Share, Report
- "View Full Gig Page" button at bottom

### 5. Dedicated Gig Detail Page
New route: `/marketplace/:gigId`. Full page layout with:
- Gig header (title, format badge, posted time)
- Seller card (avatar, ELO, rating, university, link to profile)
- Description, requirements, delivery stages
- SP breakdown
- Review section (mock)
- Related gigs carousel
- Back to marketplace breadcrumb

### 6. User Preview Popover
Hovering over any seller avatar/name shows a popover with:
- Avatar, name, ELO tier badge, verified status
- Rating, completed swaps, university
- Top 3 skills
- "View Profile" link → `/profile/:userId`
- "Message" button

### 7. Guild Preview Popover
If a gig shows guild affiliation, hovering shows:
- Guild name, member count, tier
- "View Guild" link → `/guild/:guildId`

### 8. Category Pills in Header
Horizontal scrollable category pills below the search bar (Design, Development, Writing, Video, Marketing, etc.). Active state styling. Works as a quick filter without opening the sidebar filters.

### 9. Each Mode Gets Its Own View
- **Explore**: Standard gig grid with all formats mixed
- **Trending**: Sorted by views/hot, fire indicators
- **SP Only**: SP-only purchase cards with price display
- **Auctions**: Auction cards with live countdowns, bid info
- **Co-Creation**: Team cards with role slots, apply buttons
- **Skill Fusion**: Fusion cards with participant list, looking-for tags
- **Projects**: Project cards with role grids, SP pools, deadlines
- **Flash Market**: Flash cards with multiplier badges, urgency timers
- **Request Board**: Request cards in 2-column layout
- **For You**: AI-recommended gigs with match percentage badges

### 10. Visual Polish
- Cards: Subtle border glow per ELO tier (Diamond=blue, Gold=gold, Silver=neutral, Bronze=orange)
- Hover: Cards lift 4px with shadow expansion, no jarring animations
- Sidebar: Semi-transparent backdrop blur, active item has solid background
- Header: Sticky, blur backdrop, clean search with AI suggestion pills
- Pagination: Minimal, monochrome, current page highlighted
- No gradients anywhere (per design system)
- Consistent 8px spacing grid, 2xl rounded corners on cards

## New Route
Add `/marketplace/:gigId` route in `App.tsx` pointing to `GigDetailPage`.

## Files Created/Modified
- **Create**: All files under `src/features/marketplace/components/`, `data/`, `utils/`, `hooks/`
- **Rewrite**: `src/features/marketplace/MarketplacePage.tsx` (shell only, ~150 lines)
- **Modify**: `src/App.tsx` (add `/marketplace/:gigId` route)

## No Backend Changes
All data remains mock/hardcoded in `data/mockData.ts`. Backend integration deferred per user request.

