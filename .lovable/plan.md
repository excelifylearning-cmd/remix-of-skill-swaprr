

# Fix Duplicates, Redesign Roadmap, Auth Panels, and FAQ Nav

## Issues Identified

1. **Features page duplicate tabs**: Category pills appear both in the hero section AND as a sticky bar below — remove the hero pills, keep only the sticky nav bar
2. **Leaderboard duplicate "Get Started"**: The "Where do you rank?" CTA at bottom (line 446-454) + CTAFooterSection both say "Get Started" — remove the standalone CTA section, keep only CTAFooterSection
3. **FAQ sticky nav cutting off**: The sticky tab bar at `top-16` with `overflow-x-auto` clips on smaller screens — needs horizontal scroll indicators or wrapping
4. **Login/Signup right panels**: Currently basic (SS logo + stats for login, +100 SP for signup) — redesign with more engaging content
5. **Roadmap page**: Too premature for changelog/voting/bug bounty — redesign as a simpler, more detailed phase-focused page with next update countdown and vision sections

## Changes

### 1. Features Page — Remove Duplicate Tabs
- Remove the `motion.div` with category pills inside the hero section (lines 256-263)
- Keep only the sticky `div` tab bar below

### 2. Leaderboard — Remove Duplicate CTA
- Remove the "Where do you rank?" section (lines 445-455) since CTAFooterSection already has a Get Started CTA

### 3. FAQ — Fix Nav Bar
- Add scroll padding and gradient fade indicators on the sticky nav to hint at scrollability
- Ensure all 10 section titles are visible without clipping

### 4. Roadmap — Full Redesign
Remove feature voting, changelog, bug bounty, and security sections. Replace with:

- **Hero**: Keep existing but add a "Next Update" countdown timer (target date: Apr 15, 2026)
- **Vision Section**: "Our Vision" — where SkillSwappr is headed long-term (3-4 paragraphs with icons)
- **How We Build**: Transparent development process — community-first, build in public, iterative
- **Who It Helps**: Student profiles showing different use cases (designers, devs, marketers, researchers)
- **Detailed Phase Cards**: Expand each phase from simple item list to rich cards with descriptions, expected dates, and progress bars
- **What's Next Section**: Specific upcoming features with estimated timelines
- **Community Input**: Simple "suggest a feature" form (name + idea fields) instead of voting system
- Keep CTAFooterSection

### 5. Login Right Panel — Redesign
Replace the basic SS logo + stats with:
- Animated testimonial carousel (3 user quotes cycling)
- Visual skill-swap illustration (abstract geometric shapes with connection lines)
- "Trusted by students at" university logos row
- More dynamic, less static

### 6. Signup Right Panel — Redesign
Replace the basic +100 SP block with:
- Step-by-step journey preview that updates based on current signup step
  - Step 1: "Create Profile" with profile card preview
  - Step 2: "Choose University" with campus community visual
  - Step 3: "Pick Skills" with skill constellation visual
- Dynamic content that changes with each step

## Files Modified
- `src/features/features/FeaturesPage.tsx` — remove hero pills
- `src/features/leaderboard/LeaderboardPage.tsx` — remove duplicate CTA
- `src/features/faq/FAQPage.tsx` — fix nav scroll
- `src/features/roadmap/RoadmapPage.tsx` — full redesign
- `src/features/auth/LoginPage.tsx` — redesign right panel
- `src/features/auth/SignupPage.tsx` — redesign right panel

