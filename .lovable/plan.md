

# Fix Build Error + Add Real Images Throughout

## Problem 1: Build Error
Line 35 in `AboutPage.tsx` has `ease: [0.25, 0.46, 0.45, 0.94]` which TypeScript rejects because `number[]` is not assignable to `Easing`. Fix: cast as tuple `[0.25, 0.46, 0.45, 0.94] as const` or use a named easing string.

This same pattern appears in `sectionVariants` and likely `fadeUp` — all need fixing.

## Problem 2: No Images Anywhere
Zero `<img>` tags across all feature pages. The plan calls for student photos, workspace screenshots, team photos, university logos, success story visuals, etc. Currently everything is icon-based or pure CSS/SVG.

### Image Strategy
Use high-quality Unsplash photos via URL (free, no API key needed) for:

**Home Page:**
- Success Stories section: student profile photos and project screenshots
- University Partners: real university building photos or abstract campus shots
- Workspace Preview: mockup screenshot of the workspace UI
- Guild section: team collaboration imagery

**About Page:**
- Mission Hero: students collaborating photo
- Problem/Solution: contrasting imagery (frustrated freelancer vs happy student)
- Success Stories Gallery: student portraits, before/after project shots
- Team Section: placeholder professional headshots
- University Partnerships: campus/building photos

### Implementation
- Use `<img>` tags with Unsplash URLs (e.g., `https://images.unsplash.com/photo-{id}?w=600&h=400&fit=crop`)
- Add subtle reveal animations on images (scale from 1.05 to 1, opacity fade)
- Use `aspect-ratio` containers for consistent sizing
- Add glass-morphism overlays on hero images matching the monotone theme
- Grayscale filter on images by default, color on hover (matches monotone-first design)

### Sections Getting Images (both pages)
1. Home Hero — background student workspace photo behind the 3D scene (subtle, blended)
2. Home Success Stories — 4 student photos + project thumbnails
3. Home Workspace Preview — UI mockup screenshot
4. Home University Partners — campus photos beside logos
5. About Mission Hero — large hero image of students collaborating
6. About Problem/Solution — contrasting photos per column
7. About Success Stories — student portraits with project visuals
8. About Team — headshot photos for each team member
9. About University Partnerships — campus photos on the interactive map section

