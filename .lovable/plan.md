

# Plan: New Blueprint, Style Guide, Flow Diagram, and Comprehensive Launch Plan

## What We Are Doing

1. **Delete `Blueprint.md`** and create a new `Blueprint.md` — a comprehensive requirements table with every numbered point from the uploaded 130-point document, status, difficulty, priority, and implementation notes. Blank numbers are excluded.
2. **Create `STYLE-GUIDE.md`** — consolidated design/style guide extracted from Blueprint.md design system + user's preferences from history (monotone-first, no gradients, premium editorial, Satoshi/General Sans/JetBrains Mono, surgical color pops, no shared layouts, animation on everything).
3. **Create `FLOW.md`** — ASCII/text diagram showing how all pages, components, and systems connect (user journey, data flow, page relationships).
4. **Update `AUDIT.md`** — refresh with current status.

## Files to Create/Modify

### 1. Delete + Recreate: `Blueprint.md`

Complete requirements table with all 130 points (blanks excluded). Each row includes:
- Req number, title, description
- Status: Done / Partial / Not Built / Needs Redesign
- Difficulty: Easy / Medium / Hard
- Priority: Critical / High / Low
- Tags: what category it falls into
- Implementation notes: what exists, what's missing, how to build

Requirements tagged "Needs Redesign" (from user saying "remake" means "I don't like the design, will share later"):
- Req 4 (User Dashboard) — Needs Redesign
- Req 6 (Profile portfolios) — Needs Redesign
- Req 45 (Analytics Page) — Needs Redesign
- Req 92 (Main dashboard) — Needs Redesign
- Req 94 (Guild pages) — Needs Redesign
- Req 102 (Leaderboard) — Needs Redesign
- Req 103 (Help center) — Needs Redesign
- Req 119 (Marketplace, dashboard, profiles, workspaces) — Needs Redesign
- Req 122 (Analytics 80+ sections) — Needs Redesign
- Req 123 (Leaderboard remake) — Needs Redesign
- Req 124 (Events remake) — Needs Redesign
- Req 127 (Blog + Forums) — Needs Redesign

All other requirements get accurate status based on the audit.

### 2. Create: `STYLE-GUIDE.md`

Extracted from Blueprint.md design system section + user history preferences:

**Typography**: Satoshi (headings), General Sans (body), JetBrains Mono (code/stats)
**Colors**: Monotone-first. #0A0A0A backgrounds, white text, silver #C0C0C0 secondary. Color pops: Green (#10B981 SP), Red (#EF4444 alerts), Gold (#F59E0B badges), Blue (#3B82F6 court). No gradients anywhere.
**Animations**: Every element animated. Framer Motion page transitions, staggered scroll reveals, 3D card tilt, count-up stats, skeleton shimmers, Spline 3D heroes, parallax, cursor glow.
**Components**: No shadcn defaults as-is. Glass-morphism cards, pill buttons, borderless inputs, slide-up modals, custom tooltips. No shared/reused components except Navbar, Logo, Footer.
**Layout**: Unique design per page, bespoke sections, editorial asymmetric grids, split-screen heroes.
**Mobile**: Bottom nav for authenticated users, immersive full-screen for clips, responsive everywhere.
**Premium feel**: No emojis in UI, monotone icons only, tight typography, mono timestamps.

### 3. Create: `FLOW.md`

Text-based diagram showing:
- **User Journey**: Signup → Onboarding → Dashboard → Marketplace → Workspace → Delivery → Review
- **Page Map**: All routes and how they connect
- **Data Flow**: Which tables feed which pages
- **Component Tree**: Shared components, feature modules
- **System Interactions**: SP Economy, ELO, Skill Court, Guilds, AI

### 4. Refresh: `AUDIT.md`

Updated status table matching new Blueprint requirements numbering.

---

## Blueprint Requirements Table Structure

The table will have ~85 rows (130 minus blanks). Here is the categorization:

**CRITICAL PRIORITY (Must have for launch):**
- Req 1: Signup + onboarding — Done
- Req 2: Starting SP rewards — Partial (schema, no trigger)
- Req 3: SP economy + tax — Partial (schema only)
- Req 4: User dashboard — Needs Redesign (functional, design pending)
- Req 7: Messenger/Gigs/Whiteboard/Video — Partial (workspace done, whiteboard/video mock)
- Req 21: Multiple buyer/seller formats — Done
- Req 22: Skill Court — Done
- Req 25: ELO Rating — Partial (display only, no calc engine)
- Req 29: Multi-stage escrow — Done
- Req 69: Reviews/ratings — Partial (schema + modal, no flow)
- Req 72: Gig reports — Done
- Req 74: Role access — Done
- Req 86: Marketplace search/filters — Done
- Req 88: Test suite — Minimal (15 tests)
- Req 90: Email verification — Partial (disabled)
- Req 92: Main dashboard — Needs Redesign

**HIGH PRIORITY:**
- Req 5: Admin dashboard — Not Built
- Req 6: Profile portfolios — Needs Redesign
- Req 14: Guilds — Partial
- Req 18: Clips — Partial (TikTok UI, mock data)
- Req 19: Badges — Done (schema + display)
- Req 20: Events — Done
- Req 27: AI helper — Done
- Req 28: Transaction verification — Done
- Req 31: Guild projects/delegation — Partial
- Req 33: Co-Creation — Done
- Req 35: Auctions — Done
- Req 43: Achievements/streaks — Partial
- Req 45: Analytics — Needs Redesign
- Req 49: Reporting/trust — Partial
- Req 53: Clips with tags — Partial (mock)
- Req 61: AI in workspaces — Partial
- Req 63: 10K stress test — Not Done
- Req 64: Optimizations — Partial
- Req 76: Micro tipping/guild funding — Partial (schema)
- Req 78: Global messenger — Partial (workspace only)
- Req 80: File storage — Done
- Req 102: Leaderboard — Needs Redesign
- Req 119: Marketplace/dashboard redesign — Needs Redesign

**LOW PRIORITY (Post-launch):**
- Req 10: Skill Academy — Not Built
- Req 11: Real-time tutors — Not Built
- Req 12: Certificates — Partial (schema)
- Req 15: Teams — Partial
- Req 16: Smart contracts — Partial (escrow)
- Req 37: LinkedIn-style network — Not Built
- Req 39: Skill Fusion — Done
- Req 41: Progressive reveal + AI QA — Partial
- Req 47: Dynamic pricing/subscriptions — Not Built
- Req 51: Live video/timelapse — Mock
- Req 55: Success stories — Partial (hardcoded)
- Req 57: Bundles/consultation — Partial
- Req 59: Subscription gigs — Partial
- Req 68: Fingerprinting — Partial (schema)
- Req 71: Spectating — Not Built
- Req 73: Moderators/admin — Partial (schema)
- Req 81: Plagiarism/quality checks — Partial
- Req 83: Wraps/milestones — Partial
- Req 84: Automated moderation — Not Built
- Req 95: Progressive format unlock — Not Built
- Req 106: Payment processors — Not Built
- Req 107: Currency conversion — Not Built
- Req 112: Newsletter/surveys — Partial
- Req 113: Backups — Not Built
- Req 114: Password reset/deletion — Partial
- Req 116: Refunds/invoices/analytics — Partial
- Req 118: Logging/enterprise/migration — Partial
- Req 120: Clips algorithm — Mock
- Req 121: Backend wiring audit — Mostly Done
- Req 122-128: Various redesigns — Needs Redesign
- Req 129: Core order lifecycle — Not Built
- Req 130: MCP/connectors — Not Built

**Difficulty breakdown:**
- Easy (1-2 sessions): Profile edit UI, notifications, test suite expansion, email verification toggle, newsletter
- Medium (2-4 sessions): SP economy, reviews, orders, guild CRUD, ELO engine, admin dashboard, clips backend, achievement triggers
- Hard (4+ sessions): Stress testing, full Skill Court flow, global messenger, payment integration, AI quality engine, video/whiteboard, spectating

---

## Estimated Scope

- `Blueprint.md`: ~800 lines (comprehensive table + implementation notes per requirement)
- `STYLE-GUIDE.md`: ~200 lines
- `FLOW.md`: ~300 lines (ASCII diagrams + page map + data flow)
- `AUDIT.md`: refreshed ~200 lines

Total: 4 files created/modified. No code changes — documentation only.

