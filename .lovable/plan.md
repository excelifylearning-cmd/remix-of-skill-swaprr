## Plan: Help Scroll Fix, Browse Guilds Page, Browse Users Page, Help Page Cleanup, Status Backend Check, Bug Bounty Live Stats

### 1. Fix Help Category Nav Scroll

The horizontal scroll container (`overflow-x-auto scrollbar-hide`) shows a visible scrollbar in the screenshot. Replace with a cleaner approach: use arrow buttons on either side of the nav that scroll the container programmatically, hiding the native scrollbar entirely. Add left/right fade masks when content overflows.

### 2. Create Browse Guilds Page (`/guilds`)

New page: `src/features/guild/BrowseGuildsPage.tsx`

- Query `guilds` table (already exists with `is_public`, `category`, `rank`, `avg_elo`, `total_sp`, `total_gigs`, `win_rate`, member count via `guild_members`)
- Search by name, filter by category, sort by rank/SP/ELO/members
- Grid of guild cards showing: name, slogan, category, member count, rank, avg ELO, total SP, win rate
- Click navigates to `/guild/:guildId`
- Add route in `App.tsx`

### 3. Create Browse Users Page (`/users`)

New page: `src/features/users/BrowseUsersPage.tsx`

- Query `public_profiles` view (already exists with `display_name`, `avatar_emoji`, `bio`, `elo`, `skills`, `tier`, `university`, `total_gigs_completed`)
- Search by name/skills, filter by tier/university, sort by ELO/gigs
- Grid of user cards with ELO tier coloring, skill chips, gig count
- Click navigates to `/profile/:userId`
- Add route in `App.tsx`

### 4. Remove API Section from Help Page

Remove the entire "API Documentation" section (lines ~598-696 in `HelpPage.tsx`) including the endpoint table, code examples, auth/rate-limit/webhook cards, and SDK badges. This removes the JS code snippet shown in the screenshot.

### 5. Status — Backend Verification

The status section already pulls from `service_status` and `service_incidents` tables (seeded with data in migration `20260308141719`). It falls back to hardcoded data if no rows exist. The system is functional — it queries live data and has a refresh button. No changes needed here; it's already fully wired.

### 6. Bug Bounty Live Stats

Currently the 4 stat cards (Total Paid, Reports Resolved, Avg Resolution, Active Hunters) are hardcoded. Replace with live queries from `bug_bounty_submissions` table:

- **Total Paid**: Sum reward values from resolved submissions
- **Reports Resolved**: Count where `status = 'resolved'`
- **Avg Resolution**: Calculate from `created_at` to resolution timestamps (or keep as derived)
- **Active Hunters**: Count distinct `submitted_by` values

Since the `bug_bounty_submissions` table doesn't store numeric reward amounts or resolution timestamps, we'll aggregate what's available (count by status, distinct submitters) and display real numbers, falling back to the current values when the table is empty.

### Files to Create

- `src/features/guild/BrowseGuildsPage.tsx`
- `src/features/users/BrowseUsersPage.tsx`

### Files to Modify

- `src/features/faq/FAQPage.tsx` — Replace scroll container with arrow-button nav
- `src/features/help/HelpPage.tsx` — Remove API docs section, add live bug bounty stats
- `src/App.tsx` — Add `/guilds` and `/users` routes