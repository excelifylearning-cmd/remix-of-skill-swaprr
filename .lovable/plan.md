

# Cookie Consent, Cursor Fix, Marketplace Overhaul, and Contact Page Enhancement

## 1. Cookie Consent — Smaller, Bottom-Right

**CookieConsent.tsx changes:**
- Reduce padding from `p-6` to `p-4`, shrink max-width from `max-w-lg` to `max-w-sm`
- Position bottom-right: change `sm:left-6 sm:right-auto` to `sm:right-6 sm:left-auto`
- Lower the `z-index` to `z-[9995]` so it sits below cursor glow, OR raise the cursor z-index above `z-[9999]`

## 2. Cursor Visibility Over Cookie Popup

The cookie popup has `z-[9999]` while cursor glow is `z-[9990]`. The cookie popup blocks `pointer-events` on the glow. Fix: set `pointer-events-none` is already on cursor glow, so the real issue is the cookie popup blocking the visual glow layer. Solution: lower cookie to `z-[9995]` and keep cursor glow at `z-[9998]`, or simply ensure both coexist. The cookie buttons already capture clicks fine since glow is `pointer-events-none`.

Actually the issue is the cursor *itself* (CustomCursor) — check if it also has z-index issues. The CursorGlow is at `z-[9990]` which is below `z-[9999]` cookie. Raise CursorGlow to `z-[99999]` since it's pointer-events-none anyway.

## 3. Marketplace — Full Rebuild with 8 Blueprint Sections

Current marketplace is a simple search + category filter + gig grid. Blueprint specifies 8 sections. Rebuild `MarketplacePage.tsx` with:

1. **Hero + Semantic Search Bar** — AI suggestion chips, advanced filter panel (format, ELO range, point range, university, trending/popular/curated toggles)
2. **Category Navigation** — Visual category cards with icons and subcategories on click
3. **Trending Gigs** — Horizontal auto-scrolling featured gigs with real-time popularity indicators (views, bids, fire icons)
4. **Main Gig Grid** — Enhanced cards with quick-view overlay on click (modal with full gig details), 3D tilt hover, view toggle (grid/list)
5. **Auction Listings** — Dedicated section with countdown timers, bid counts, current submissions
6. **Co-Creation Projects** — Multi-role project cards with role slots and fill indicators
7. **Flash Market** — Time-limited deals with countdown timers and bonus multiplier badges
8. **Recommended For You** — AI-curated section based on mock user profile

Each section will be a distinct visual block with its own header, scroll behavior, and card style. More mock data (30+ gigs across all formats).

## 4. Contact Page — Better Form + Live Chat

Rebuild `ContactPage.tsx` with:

- **Enhanced Form**: Add subject line field, phone number (optional), file attachment UI, character counter on message, form validation with error states, success animation on submit
- **Live Chat Widget**: A mock chat bubble in bottom-right that opens a chat panel with pre-written bot responses, typing indicators, and message history
- **Map/Location Section**: Embedded map placeholder or illustrated office locations
- **Social Links Row**: Twitter, LinkedIn, Discord, GitHub icons with hover animations
- **Response Time Guarantees**: Visual SLA cards (email: 24h, chat: 5min, enterprise: 1h)
- **FAQ Accordion**: Expandable FAQ section replacing the static cards

## Technical Details

- All sections use existing pattern: `motion` wrappers with `whileInView` for scroll reveals
- Marketplace gig data expanded to ~30 items covering all formats (Direct Swap, Auction, Co-Creation, Flash, Skill Fusion, Projects)
- Auction countdowns use `useState` + `setInterval` for timer display
- Quick-view modal uses `AnimatePresence` slide-up panel
- Live chat widget uses local state for message history, no backend
- Cookie consent z-index adjusted, size reduced with tighter spacing
- CursorGlow z-index raised above all overlays

## Files Modified
- `src/components/shared/CookieConsent.tsx` — smaller, bottom-right, lower z-index
- `src/components/shared/CursorGlow.tsx` — raise z-index
- `src/features/marketplace/MarketplacePage.tsx` — full rebuild with 8 sections
- `src/features/contact/ContactPage.tsx` — enhanced form + live chat widget

