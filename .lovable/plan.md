

# Profile & Guild Page Redesign Plan

## Current State
Both pages are functional but visually flat — generic card-in-list layouts, emoji-based badges/achievements, no visual hierarchy or editorial feel. The profile reads like a data dump, not a professional identity page.

## Design Direction
**Profile**: Inspired by Dribbble portfolios + Behance + LinkedIn premium — editorial single-scroll with magazine-style section breaks, typographic hierarchy, and dense information architecture. No cards-in-grids; instead use ruled lines, asymmetric layouts, and whitespace as a design element.

**Guild**: Inspired by esports team pages (NAVI, Liquid) + GitHub org pages — bold header with a "banner" feel, stat blocks that feel like a scoreboard, and clean tabbed content.

**Badges & Achievements**: Replace emoji icons with monochrome Lucide icons on clean pill/token shapes. Minimalist, no color — just foreground/border with subtle size variations for rarity.

---

## Profile Page Redesign (ProfilePage.tsx — full rewrite)

### Header Zone
- Full-width top band with avatar (square, rounded-2xl, grayscale-to-color on hover) pinned left
- Name as oversized display type (text-5xl font-black), headline below as text-lg muted
- Verification badge as a tiny inline pill, not a floating circle
- Social links as minimal icon row beneath name (not sidebar)
- "Request Swap" / "Edit Profile" as a single action button, top-right aligned
- Stats as a horizontal ruled strip: `ELO | SP | Gigs | Badges | Streak | Tier` separated by thin vertical dividers, monospaced numbers

### Navigation
- Sticky horizontal pill nav (not sidebar links): About, Skills, Experience, Education, Portfolio, Listings — scrolls to sections
- On mobile: horizontal scroll snap

### Section: About
- Bio as a clean paragraph with max-w-2xl
- Languages as small inline pills

### Section: Skills
- Horizontal layout: each skill as a minimal bordered pill with optional skill-level indicator (thin underline bar — Beginner/Intermediate/Advanced/Master) based on `skill_levels` data

### Section: Badges (Minimalist)
- Replace emoji with Lucide icons mapped by category (e.g., `Star`, `Shield`, `Zap`, `Award`, `Target`)
- Each badge: small 36px square token — border, bg-surface-1, icon centered, tooltip for name
- Completed: foreground icon. Locked: muted-foreground/40 icon
- Grid layout, compact, no cards

### Section: Achievements (Minimalist)
- Clean list rows with thin bottom borders
- Lucide icon (small, left), name, description on right
- Progress: ultra-thin 2px bar beneath text, foreground fill
- Completed: subtle checkmark, no color — just foreground

### Section: Experience
- Timeline with left border line and dots — same as current but with tighter spacing and bolder role titles

### Section: Education
- Same timeline treatment, slightly lighter dots

### Section: Portfolio
- Asymmetric 2-column masonry-feel grid, images grayscale to color, with title overlays

### Section: Listings
- Compact ruled list (gap-px pattern), status as tiny dot indicator not pill

### Section: Disputes
- Compact ruled list, scale icon, status as text

### Section: Activity
- Fetch from `activity_log` table for this user — show last 10 actions as a timeline

---

## Guild Page Redesign (GuildPage.tsx — full rewrite)

### Header Zone
- Large guild name (text-5xl font-black) with rank badge inline as `#N` monospaced pill
- Slogan as subtitle, category + member count + founding date as meta row
- Join/Dashboard + Message buttons right-aligned
- Stats as a bold 5-column scoreboard strip with dividers: `Total SP | Gigs | Avg ELO | Win Rate | Members`

### Tab Bar
- Underline tabs (same pattern but slightly larger touch targets)

### Overview Tab
- Two-column: main content left, sidebar right
- About section with description
- Requirements/Perks as check-list rows (no cards)
- Leadership as compact avatar + name + role rows
- Member Listings as ruled list
- Recent Treasury Activity as compact timeline

### Sidebar (Overview)
- Badges: same minimalist token grid as profile (Lucide icons, no emoji)
- Achievements: compact progress list
- Quick Stats: key-value pairs

### Members Tab
- Clean ruled list with avatar initials, name, role pill, ELO, joined date

### Projects Tab
- Ruled list with progress bars, status dots, SP pool

### Wars Tab
- Score comparison layout with monospaced numbers, status indicators

### Contributions Tab
- Treasury log as ruled list with deposit/withdrawal indicators

---

## Badge & Achievement Icon Mapping Strategy
Create a utility function `getBadgeIcon(category: string)` that maps badge/achievement categories to Lucide icons:
- `general` → `Award`, `skill` → `Zap`, `social` → `Users`, `streak` → `Flame`, `competition` → `Trophy`, `quality` → `Shield`, `milestone` → `Target`

This replaces all emoji rendering across both pages.

---

## Technical Summary
- **Files modified**: `src/features/profile/ProfilePage.tsx` (full rewrite ~600 lines), `src/features/guild/GuildPage.tsx` (full rewrite ~550 lines)
- **New utility**: Badge icon mapper function (inline in each file or shared)
- **Data**: All backend queries remain the same — no schema changes needed
- **Activity section**: New query to `activity_log` for profile page
- **Mobile**: Horizontal scroll nav, stacked layouts, no sidebar on mobile
- **No new dependencies**

