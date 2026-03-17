

# Plan: Unified Search, Enhanced Profile/Guild Pages, Auth Guards, Messaging

This is a large multi-part plan covering 7 major areas. Breaking into implementation phases.

---

## Phase 1: Auth Guards (Login Prompts on Protected Pages)

**Problem**: Dashboard, workspace, and other auth-required pages don't redirect unauthenticated users.

**Solution**: Create a `RequireAuth` wrapper component that checks `useAuth()` and shows `LoginPrompt` dialog or redirects to `/login`.

- Create `src/components/shared/RequireAuth.tsx` — wraps children, checks `user` from auth context, shows LoginPrompt if null
- Wrap these routes in `App.tsx`: `/dashboard`, `/workspace/:id`, `/guild-dashboard/:guildId`, `/enterprise-dashboard`, `/saved`, `/clips`, `/profile/me`
- Public pages (marketplace, profiles, guilds, blog, forums) stay accessible but show LoginPrompt on actions (already done in GuildPage)

---

## Phase 2: Merge Browse Users + Browse Guilds → Unified Discovery Page

**Problem**: `/users` and `/guilds` are near-identical layouts (hero + search + filter pills + grid).

**Solution**: Delete both, create a single `/discover` page with tabs/toggle for Users vs Guilds.

- Create `src/features/discover/DiscoverPage.tsx`
- Design: Full-width search bar at top (no hero section — cleaner), horizontal tab toggle "People | Guilds" below search
- **People tab**: User cards with avatar, name, tier badge, top 3 skills, ELO, gig count. Filters: tier, skill category, university, availability. Sort: ELO, gigs, name
- **Guilds tab**: Guild cards with name, rank badge, category, member count, avg ELO, win rate, treasury. Filters: category, public/private. Sort: rank, avg ELO, members, SP
- Sidebar with "Trending Skills", "Top Guilds This Week", "Recently Active" panels
- URL: `/discover` with `?tab=people` / `?tab=guilds` query param
- Update `App.tsx`: Remove `/users` and `/guilds` routes, add `/discover`
- Update `MobileBottomNav.tsx`: Change Guilds tab to point to `/discover?tab=guilds`
- Update all `Link to="/guilds"` and `Link to="/users"` across codebase to `/discover`
- Delete `src/features/users/BrowseUsersPage.tsx` and `src/features/guild/BrowseGuildsPage.tsx`

---

## Phase 3: Redesign Profile Page — Left Sidebar Navigation + Markdown Editing

**Problem**: Profile has a top horizontal nav bar for sections (About, Skills, etc.) which user wants as a left sidebar. Editing is basic inline fields — needs markdown-style rich editing with section management.

### Layout Change
- Replace horizontal sticky nav with a **left sidebar** (desktop only, collapses on mobile)
- Left sidebar: Scrollspy-linked section list (About, Skills, Badges, etc.) + custom user-added sections
- Main content: Single scroll stream (current behavior) but now occupying center column
- Right sidebar: Quick stats, guilds, badges (existing, stays)
- Result: 3-column layout on desktop `[Left Nav 200px | Content flex-1 | Right Sidebar 240px]`

### Enhanced Editing System
When `isEditing = true`:
- **Section Manager**: Each section gets a drag handle, edit/delete buttons, visibility toggle
- **Add Section button**: Opens modal with premade templates (FAQ, Testimonials, Services, Contact Info, Custom) or blank markdown section
- **Markdown Editor per section**: Textarea with markdown preview toggle. Support: headings, bold, italic, lists, code blocks, links, images
- **Markdown preview**: Rendered inline with `react-markdown` (already available or add)
- **Custom widgets**: User can add widget blocks — Stats Bar (like the ELO/SP/Gigs strip), Polls, Dropdowns/Accordions, Embeds (iframe URLs), Animated text blocks
- **Section reordering**: Drag-and-drop or up/down arrow buttons to reorder sections
- **Hero control**: Toggle hero visibility, change avatar, banner color/accent
- **Color customization**: Per-section accent color picker (limited to the 4 accent colors + grayscale)

### New Profile Sections
- **Blog & Forum Activity**: Show recent blog posts authored, forum threads, comments count
- **Saved Items**: Toggle to show/hide saved posts publicly
- **Referrals**: Show referral count and link
- **Message Button**: Already exists ("Request Swap"), add a "Send Message" button that opens global messenger (Phase 6)

### Database Changes
- Add `profile_sections` JSON column to `profiles` table (or new `profile_sections` table) storing: `[{id, type, title, content_markdown, order, visible, widget_config}]`
- Migration to add this column

---

## Phase 4: Redesign Guild Page — Enhanced but Distinct from Profile

**Problem**: Guild page needs same level of widget/sidebar/editing power but must look distinct.

### Layout
- **No left sidebar** (distinct from profile) — use a **top tabbed dashboard** layout instead
- Keep existing tab system (Overview, Members, Projects, Wars, Contributions) but enhance each
- Add new tabs: **Chat**, **Settings** (for guild leaders), **Announcements**
- Guild hero: Full-width banner area with guild avatar, name, rank, scoreboard stats
- Overview tab gets a **widget grid** layout (2-3 column cards) instead of linear scroll

### Guild Editing (for leaders/officers)
- Edit guild description, slogan, requirements, perks as markdown
- Add custom sections (same widget system as profiles — polls, dropdowns, embeds)
- Manage announcement board
- Section reordering within overview tab

### New Guild Features
- **Guild Chat**: Embedded channel list (like Discord) — channels are just categories. For now: General, Announcements, Off-topic. Store in `guild_channels` + `guild_channel_messages` tables
- **Message button on guild profile**: Opens guild's general chat or sends a message to guild leaders
- **Blog/Forum activity**: Show posts by guild members

### Database Changes
- New `guild_channels` table: `id, guild_id, name, type (text), created_at`
- New `guild_channel_messages` table: `id, channel_id, user_id, content, created_at`
- Add `guild_sections` JSON column to `guilds` table for custom sections/widgets
- Enable realtime on `guild_channel_messages`

---

## Phase 5: Global Messaging System

**Problem**: No global messenger — only workspace-scoped chat exists.

### Implementation
- New `direct_messages` table: `id, sender_id, receiver_id, content, read, created_at`
- New `conversations` table: `id, participant_1, participant_2, last_message_at, last_message_preview`
- Add "Messages" section to Dashboard sidebar (between existing items)
- Dashboard Messages panel: Conversation list on left, message thread on right
- Profile pages: "Send Message" button opens DM
- Guild pages: "Message Guild" button messages guild leader
- Enable realtime on `direct_messages`

### Database Changes
- `conversations` table with RLS (participants only)
- `direct_messages` table with RLS (sender or receiver)
- Enable realtime on both

---

## Phase 6: Guild Internal Chat (Discord-style) in Guild Dashboard

- Add "Chat" tab to `GuildDashboardPage.tsx`
- Channel selector on left, messages on right
- Guild leaders can create/delete channels
- Uses `guild_channels` + `guild_channel_messages` from Phase 4
- Also accessible from Guild public page for members

---

## Phase 7: Blog/Forum Profile Integration

- Add `author_id` display on blog posts and forum threads (link to profile)
- On ProfilePage, new "Posts" section showing user's blog posts + forum threads
- Query `blog_posts` and `forum_threads` filtered by `user_id`
- Add "Show Blog Activity" and "Show Forum Activity" toggles in profile editing

---

## Files Summary

**Create:**
- `src/components/shared/RequireAuth.tsx`
- `src/features/discover/DiscoverPage.tsx`

**Heavy Rewrites:**
- `src/features/profile/ProfilePage.tsx` — 3-column layout, markdown editing, section management, widgets
- `src/features/guild/GuildPage.tsx` — enhanced tabs, widget grid, guild chat placeholder
- `src/features/dashboard/DashboardPage.tsx` — add Messages section to sidebar

**Modify:**
- `src/App.tsx` — auth guards, route changes, remove /users /guilds, add /discover
- `src/components/shared/MobileBottomNav.tsx` — update guild link to /discover

**Delete:**
- `src/features/users/BrowseUsersPage.tsx`
- `src/features/guild/BrowseGuildsPage.tsx`

**Database Migrations:**
- Add `profile_sections` JSONB column to `profiles`
- Add `guild_sections` JSONB column to `guilds`
- Create `guild_channels` table
- Create `guild_channel_messages` table (+ realtime)
- Create `conversations` table
- Create `direct_messages` table (+ realtime)

---

## Implementation Order

Given size, this should be done across multiple messages:

1. **Message 1**: Auth guards + Unified Discovery page + route cleanup
2. **Message 2**: Profile page redesign (3-column layout, markdown editing, section system, widgets)
3. **Message 3**: Guild page enhancement (widget grid, editing, chat tab) + database migrations for guild chat
4. **Message 4**: Global messaging (DM tables, dashboard integration, profile/guild message buttons)
5. **Message 5**: Blog/forum profile integration + final wiring

