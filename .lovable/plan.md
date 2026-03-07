

# Comprehensive Polish, New Pages, and Auth Enhancement

This is a large scope touching ~15+ files. Here is the plan broken into prioritized groups.

---

## Group 1: Cookie Consent Popup
- Create `src/components/shared/CookieConsent.tsx` — a bottom-banner popup with "Accept" / "Manage Preferences" buttons
- Uses `localStorage` to persist choice, only shows once
- Render in `App.tsx` globally

## Group 2: Auth Enhancements (Signup + Login)
**SignupPage.tsx:**
- Add "Confirm password" field in step 1
- Add real-time password strength meter with criteria checklist (green ticks):
  - Min 8 characters
  - Uppercase letter
  - Lowercase letter
  - Number
  - Special character
- Show strength bar (weak/medium/strong) with color coding
- Validate confirm password matches before allowing Continue

**LoginPage.tsx:**
- Minor polish pass (already solid)

## Group 3: Loading Screen Light Mode Fix
- `LoadingScreen.tsx` currently uses `bg-background` which is correct for theming, but the bars use `bg-muted-foreground` — this should work in light mode already since CSS vars change. Verify and ensure no hardcoded dark colors exist.

## Group 4: New Pages (4 new routes)
Create these pages per Blueprint.md specs:

**`src/features/help/HelpPage.tsx`** (PAGE 18 — Help, Docs, Status, Reporting):
- Hero with search bar
- Knowledge base categories grid
- API docs preview section
- Contact & support section
- Platform status indicators with uptime bars
- Bug bounty program section
- Reporting form section

**`src/features/history/HistoryPage.tsx`** (PAGE 21):
- Activity timeline with filterable feed
- Gig history list with expandable cards
- Points ledger with running balance
- Quarterly/Yearly wrap preview sections
- Achievement history timeline

**`src/features/leaderboard/LeaderboardPage.tsx`** (PAGE 20):
- Global leaderboard with animated rank cards
- Skill-specific leaderboards tabs
- Guild leaderboard section
- Court judges leaderboard
- Rising stars section
- University leaderboard
- Hall of fame section

**`src/features/transaction/TransactionLookupPage.tsx`** (PAGE 19):
- Lookup form with transaction code input and verification animation
- Transaction summary card
- Work preview section
- Verification status indicators
- Report from lookup CTA

Add all 4 routes to `App.tsx`.

## Group 5: Polish Existing Pages

**FeaturesPage.tsx** — Currently has 7 categories but Blueprint specifies 10 sections. Add:
- Section for Trust & Quality System
- Section for AI Integration overview
- Enterprise Mode section
- Expand each category panel with more detail and illustrations

**PricingPage.tsx** — Currently has tiers + packages + FAQs. Blueprint specifies 10 sections. Add:
- Interactive pricing calculator (inputs: gigs/month, complexity → recommended tier)
- Badge system grid with hover details
- ROI calculator ("What's your skill worth?")
- Testimonials by tier section
- Enterprise custom quote form

**HowItWorksPage.tsx** — Currently has journey steps + user paths. Blueprint specifies 9 sections. Add:
- Gig lifecycle diagram section
- Guild path section
- Dispute path section
- More detail on each existing section

**EnterprisePage.tsx** — Currently has pipeline + use cases + security. Blueprint specifies 8 sections. Add:
- Expert pool browse preview
- Integrations section (payment, PM tools, APIs)
- Enterprise pricing section
- Contact/Demo booking section with form

**RoadmapPage.tsx** — Currently has phases only. Blueprint specifies 7 sections. Add:
- Feature voting section with upvote cards
- Changelog section with reverse-chronological feed
- Status & uptime indicators
- Bug bounty section
- Security audits section

**LegalPage.tsx** — Add Cookie Policy section (ties into cookie consent popup)

**ForumsPage.tsx** — Enhance with pinned announcements, user highlights, create thread CTA

**BlogPage.tsx** — Enhance with more article cards and category filtering

**AboutPage.tsx** — Verify all 9 Blueprint sections present

**MarketplacePage.tsx** — Verify auction listings, co-creation projects, flash market, and recommended sections exist

## Group 6: Footer Links Update
- Update `CTAFooterSection.tsx` footer links to include Help, Leaderboard, History, Transaction Lookup routes

## Group 7: Mobile Responsiveness Pass
- Ensure all new and existing pages use responsive Tailwind classes
- Test grid layouts collapse properly on mobile
- Auth pages: stack left-right layout vertically on mobile

---

## Technical Details

- All new pages follow existing pattern: `PageTransition` wrapper, `Navbar`, `CustomCursor`, `CursorGlow`, `CTAFooterSection`
- All pages use lazy loading in `App.tsx`
- Cookie consent uses `localStorage.getItem('cookie-consent')` check
- Password strength uses pure JS regex checks, no external library
- Loading screen already uses CSS variable `bg-background` which adapts to theme — just need to verify no hardcoded colors

## Estimated scope
- ~4 new page files
- ~1 new component (CookieConsent)
- ~10 existing files edited
- All content is static/mock data (no backend needed)

