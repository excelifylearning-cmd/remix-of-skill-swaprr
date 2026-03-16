# Skill Swappr — Style Guide

> Definitive design reference. Every component, page, and element must follow these rules.
> No exceptions. No "close enough."

---

## Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Headings | Satoshi | 700-900 | All h1-h6, nav items, button text, card titles |
| Body | General Sans | 400-500 | Paragraphs, descriptions, form labels, tooltips |
| Mono | JetBrains Mono | 400-500 | Stats, transaction codes, SP amounts, timestamps, code blocks |

**Rules:**
- No system fonts anywhere. Every text element uses one of these three
- Imported via `@font-face` in `index.css` — no Google Fonts CDN
- Heading sizes: h1=48-64px, h2=36-42px, h3=24-28px, h4=18-20px
- Body: 14-16px with 1.6 line-height
- Mono: 11-13px for timestamps, 16-20px for stat numbers
- Letter-spacing: -0.02em on headings, 0 on body, 0.05em on mono uppercase labels

---

## Color Palette

### Core (Monotone-First)

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--background` | 0 0% 4% | `#0A0A0A` | Page background (dark mode) |
| `--surface-1` | 0 0% 7% | `#111111` | Card backgrounds, elevated surfaces |
| `--surface-2` | 0 0% 10% | `#1A1A1A` | Hover states, secondary surfaces |
| `--surface-3` | 0 0% 14% | `#242424` | Active states, borders |
| `--foreground` | 0 0% 100% | `#FFFFFF` | Primary text |
| `--silver` | 0 0% 75% | `#C0C0C0` | Secondary text, borders, muted |
| `--silver-accent` | 0 0% 90% | `#E5E5E5` | Hover highlights |

### Accent Colors (Surgical Pops Only)

| Token | HSL | Hex | Only Used For |
|-------|-----|-----|---------------|
| `--skill-green` | 160 84% 39% | `#10B981` | SP amounts, earnings, positive indicators, success |
| `--alert-red` | 0 84% 60% | `#EF4444` | Destructive actions, court penalties, warnings, errors |
| `--badge-gold` | 38 92% 50% | `#F59E0B` | Badges, achievements, premium, featured |
| `--court-blue` | 217 91% 60% | `#3B82F6` | Skill Court elements, links, info |

### Rules

- **NO GRADIENTS.** Anywhere. Ever. Flat colors only
- **NO random colors.** Only the 4 accents above + grayscale
- Page should feel like a premium black-and-white editorial with surgical color pops
- Dark mode is the PRIMARY mode. Light mode is secondary
- Light mode: invert backgrounds to white, text to near-black, keep accent colors identical
- Never use `text-white`, `bg-black` etc. directly — always use semantic tokens
- All colors defined as HSL in `index.css` `:root` and `.dark`

---

## Animation Rules

### Page Transitions
- Full-page fade + slide via Framer Motion `AnimatePresence`
- `PageTransition` component wraps every page
- Duration: 400ms, ease: `[0.25, 0.46, 0.45, 0.94]`

### Scroll Reveals
- Every section animates on scroll entry
- Staggered children (50ms delay between siblings)
- `IntersectionObserver` + Framer Motion `whileInView`
- Threshold: 0.1 for large sections, 0.3 for small elements

### Micro-Interactions
- **Buttons**: scale 1.02x on hover, 0.98x on press, ripple on click
- **Cards**: 3D tilt on hover (CSS `perspective` + `rotateX/Y`), subtle shadow shift
- **Navigation**: magnetic cursor effect on nav items, underline slide animation
- **Numbers/Stats**: count-up animation on scroll into view
- **Inputs**: borderless with bottom-line focus animation

### Loading States
- Skeleton shimmer (silver gradient sweep) — NEVER spinners
- Pulse animation for placeholder content
- Staggered skeleton appearance

### Hero Sections
- Spline 3D embed or particle field (each page unique)
- Parallax on scroll for layered sections
- Cursor-following gradient spotlight on dark backgrounds
- Text reveals: letter-by-letter or word-by-word on hero headlines

### Critical Rule
**No element appears without animation. Static = broken.**

---

## Component Design Rules

### Cards
- Glass-morphism with subtle `backdrop-blur` on dark
- Sharp borders on light mode
- 3D tilt hover effect on interactive cards
- No default shadcn card styling — always customized

### Buttons
- **Primary**: pill-shaped, solid foreground on background
- **Secondary/Ghost**: transparent with border, hover fill
- All buttons have hover state animations (scale + color shift)
- No default shadcn button styling used as-is

### Inputs
- Borderless with bottom-line focus animation
- No outlined inputs
- Label floats above on focus

### Modals/Dialogs
- Slide-up from bottom with backdrop blur
- Not default Radix positioning

### Tooltips
- Custom dark glass style
- Not default Radix tooltip styling

### Icons
- Lucide icons only
- Wrapped in animated containers
- Monotone — no colored icons (except in accent-colored contexts)

### No Emojis in UI
- Use monotone Lucide icons instead
- Emojis only acceptable in user-generated content (chat messages, etc.)

---

## Layout Philosophy

### Unique Design Per Page
- No shared or reused layout components except: Navbar, Footer, MobileBottomNav
- Every page has bespoke sections with unique composition
- No cookie-cutter grid patterns repeated across pages

### Grid & Composition
- Editorial asymmetric grids for profiles, portfolios
- Split-screen heroes for marketing pages
- Generous negative space on desktop
- Full-bleed sections alternating with contained content

### Spacing System
- Base unit: 4px
- Section padding: 80-120px vertical on desktop, 40-60px on mobile
- Card padding: 24-32px
- Component gap: 16-24px

---

## Mobile Design

### Navigation
- `MobileBottomNav.tsx`: 5-tab persistent bottom nav for authenticated users
- Hidden on marketing pages (home, about, pricing, etc.)
- Only shows on app pages (marketplace, dashboard, clips, guilds, forums)
- 56px height, fixed bottom, glass blur background

### Mobile-First Rules
- All pages must work on 320px+ widths
- Stack layouts on mobile (no side-by-side below 768px)
- ClipsPage: full-screen immersive snap scroll
- Touch targets: minimum 44x44px
- `pb-16` on all authenticated pages to clear bottom nav

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768-1024px
- Desktop: > 1024px
- `useIsMobile()` hook for conditional rendering

---

## Dark Mode (Primary) / Light Mode (Secondary)

### Dark Mode (Default)
- Background: `#0A0A0A` → `#111111` → `#1A1A1A` (layered surfaces)
- Text: White primary, Silver secondary
- Borders: `hsl(0 0% 14%)` subtle
- Cards: glass-morphism with backdrop-blur

### Light Mode
- Background: `#FFFFFF` → `#F5F5F5` → `#EBEBEB`
- Text: `#0A0A0A` primary, `#666666` secondary
- Borders: `hsl(0 0% 86%)` subtle
- Cards: sharp borders, subtle shadows
- Accent colors remain identical

---

## Premium Feel Checklist

Every page and component must pass these checks:

- [ ] Uses only Satoshi/General Sans/JetBrains Mono
- [ ] No gradients anywhere
- [ ] Colors only from the defined palette (grayscale + 4 accents)
- [ ] Every element has an entrance animation
- [ ] Cards have 3D tilt or hover effect
- [ ] Stats use count-up animation
- [ ] Loading uses skeleton shimmer, not spinner
- [ ] No default shadcn styling visible
- [ ] No emojis in UI chrome
- [ ] Monotone icons (Lucide) only
- [ ] Responsive down to 320px
- [ ] Dark mode is the primary experience
- [ ] Semantic color tokens used (never raw colors in components)
