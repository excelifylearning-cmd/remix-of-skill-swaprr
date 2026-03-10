

# Plan: Mobile App Shell, TikTok Clips, Live Chat Redesign, Page Cleanup

## Summary

Remove standalone Onboarding, Settings, Messages, and Notifications pages (functionality already exists in signup flow and dashboard). Create a mobile-first app shell with bottom navigation bar. Redesign Clips as a full-screen TikTok-style vertical scroll feed. Redesign the Live Chat widget to be cleaner and more premium. Ensure all pages (profiles, gigs, guilds, forums) work on mobile.

---

## 1. Remove Standalone Pages

Delete these files and their routes from `App.tsx`:
- `src/features/onboarding/OnboardingPage.tsx` — signup already has 12-step onboarding
- `src/features/settings/SettingsPage.tsx` — dashboard already has settings tab
- `src/features/messages/MessagesPage.tsx` — will be accessed from dashboard
- `src/features/notifications/NotificationsPage.tsx` — already a popover in dashboard

Remove `/onboarding`, `/settings`, `/messages`, `/notifications` routes and lazy imports.

---

## 2. Mobile Bottom Nav Bar

Create `src/components/shared/MobileBottomNav.tsx`:
- Fixed bottom bar, only visible on screens < 768px (use `useIsMobile`)
- Only shows when user is authenticated (post-login)
- Hidden on marketing pages (home, about, pricing, etc.) — only on app pages
- 5 tabs with minimal icons (no labels by default, active label shows):
  1. **Marketplace** → `/marketplace`
  2. **Dashboard** → `/dashboard`
  3. **Clips** → `/clips`
  4. **Guilds** → `/guilds`
  5. **Forums** → `/forums`
- Active tab highlighted with foreground color, inactive muted
- Render in `App.tsx` alongside other global components
- All existing pages remain accessible via navigation/links, bottom nav is just the primary 5

---

## 3. Redesign Clips Page — TikTok-Style Vertical Scroll

Rewrite `src/features/clips/ClipsPage.tsx`:
- **Full-screen vertical snap scroll** (`snap-y snap-mandatory`) — each clip takes full viewport height
- **No Navbar/Footer** on mobile — immersive experience, use AppNav on desktop
- Search bar floating at top with blur background
- Each clip card: full-screen background (placeholder gradient/emoji for now), overlay with:
  - Right sidebar: like, comment, share, bookmark buttons (vertical stack, TikTok-style)
  - Bottom: author avatar, name, title, category badge, sound icon
  - Duration badge top-right
- Category filter as horizontal pills below search
- Swipe up/down to navigate (CSS scroll-snap handles this)
- "For You" / "Following" / "Trending" tabs at top
- Mock algorithm: randomize order of clips
- Remove the grid layout, "Coming Soon" banner, and marketing header

---

## 4. Redesign Live Chat Widget

Rewrite `src/components/shared/LiveChatWidget.tsx` with a cleaner, premium feel:
- **Remove all emojis** from quick actions (replace with clean text-only chips)
- **Remove the "Tip" suggestion card** with Sparkles icon — too casual
- **Remove language selector bar** from main view — move translate to a settings gear icon within header
- **Consolidate header actions**: only show close (X) and a single menu button (three dots) that opens a dropdown with: Reset Chat, Translate, Talk to Human
- **Cleaner message bubbles**: remove the Bot icon circles, use indentation instead. User messages right-aligned solid, assistant left-aligned with subtle border
- **Remove "Powered by SkillBot AI" footer text**
- **Floating button**: keep the MessageCircle icon but make it 48px, no pulse animation, subtle shadow only
- **No emojis anywhere** in the widget — monotone icons only
- **Quick actions**: plain text buttons with border, no emoji prefixes
- **Premium typography**: tighter spacing, 11px body text, mono timestamps

---

## 5. Ensure All Pages Work on Mobile

Audit and adjust these pages for mobile responsiveness:
- Profile (`/profile/:userId`) — stack layout, full-width cards
- Gig detail (`/marketplace/:gigId`) — single column
- Guild detail (`/guild/:guildId`) — responsive grid
- Forums (`/forums`) — already uses AppNav, verify mobile layout
- Browse Guilds/Users — responsive grids already in place
- Dashboard — already has sidebar that collapses, add bottom nav awareness (add `pb-16` on mobile to avoid nav overlap)
- Add `pb-16` padding-bottom on all authenticated pages when mobile bottom nav is visible

---

## Files to Create
- `src/components/shared/MobileBottomNav.tsx`

## Files to Modify
- `src/App.tsx` — remove 4 routes/imports, add MobileBottomNav
- `src/features/clips/ClipsPage.tsx` — full rewrite to TikTok scroll
- `src/components/shared/LiveChatWidget.tsx` — premium redesign
- `src/features/dashboard/DashboardPage.tsx` — add mobile bottom padding

## Files to Delete
- `src/features/onboarding/OnboardingPage.tsx`
- `src/features/settings/SettingsPage.tsx`
- `src/features/messages/MessagesPage.tsx`
- `src/features/notifications/NotificationsPage.tsx`

