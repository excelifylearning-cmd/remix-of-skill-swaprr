# Skill Swappr — Comprehensive Design & Feature Document

---

## Design System (Non-Negotiable Standards)

**Typography**

- Primary: "Satoshi" (headings, bold UI) — imported via @font-face, no Google Fonts fallback
- Secondary: "General Sans" (body text, descriptions)
- Mono: "JetBrains Mono" (codes, transaction IDs, stats)
- No system fonts anywhere. Every text element uses one of these three.

**Color Palette (Monotone-First)**

- Background: `#0A0A0A` (near-black), `#111111`, `#1A1A1A` (layered surfaces)
- Primary Surface: `#FFFFFF` (white text, white cards on dark)
- Silver: `#C0C0C0` (secondary text, borders, muted elements)
- Accent Silver: `#E5E5E5` (hover states, highlights)
- Skill Points Green: `#10B981` (only for points, earnings, positive)
- Alert Red: `#EF4444` (only for destructive, court penalties, warnings)
- Badge Gold: `#F59E0B` (only for badges, achievements, premium)
- Court Blue: `#3B82F6` (only for Skill Court elements)
- Everything else is grayscale. No random colors. The page should feel like a premium black-and-white editorial with surgical color pops.

**Animation Rules**

- Every page transition: full-page fade + slide (Framer Motion `AnimatePresence`)
- Every section on scroll: staggered reveal with `IntersectionObserver` + Framer Motion
- Every button: micro-scale on hover (1.02x), press animation (0.98x), ripple on click
- Every card: 3D tilt on hover (CSS `perspective` + `rotateX/Y`), subtle shadow shift
- Navigation: magnetic cursor effect on nav items, underline slide animation
- Numbers/stats: count-up animation on scroll into view
- Loading states: skeleton shimmer (silver gradient sweep), never spinners
- Page hero sections: Spline 3D embed or particle field (each page unique)
- Parallax on scroll for layered sections
- Cursor-following gradient spotlight on dark backgrounds
- Text reveals: letter-by-letter or word-by-word on hero headlines
- No element appears without animation. Static = broken.

**Component Design Rules**

- No shadcn defaults used as-is — every component gets custom styling matching the monotone theme
- Cards: glass-morphism with subtle backdrop-blur on dark, sharp borders on light
- Buttons: pill-shaped primary, ghost secondary, all with hover state animations
- Inputs: borderless with bottom-line focus animation
- Modals: slide-up from bottom with backdrop blur
- Tooltips: custom dark glass style, not default radix
- Every icon is Lucide but wrapped in animated containers
- Custom layouts for everything
- No shared or re used components anywhere except nav bar, logo and footer

---

## Page-by-Page Breakdown

---

### PAGE 1: HOME

The home page is the flagship. It must feel like a Webflow/Awwwards site, not a SaaS template.

**Section 1 — Hero**

- Full-viewport dark background with Spline 3D interactive scene (floating skill icons orbiting a central node)
- Headline with word-by-word reveal animation: "Trade Skills. Build Together."
- Subtext in silver explaining the concept in one line
- Two CTAs: "Start Swapping" (white pill button) and "Watch How" (ghost button that opens embedded video modal)
- Cursor-following gradient spotlight effect
- Floating skill point coins animating in background (CSS 3D)

**Section 2 — How Skill Points Work (Animated Infographic)**

- Horizontal scroll-triggered animation showing the flow:
  1. You sign up → earn 100 points
  2. You post a gig (e.g., "I'll design your logo")
  3. Someone accepts and offers their skill (e.g., "I'll code your site")
  4. Points balance the difference (website > logo, so logo person adds 50 points)
  5. Both users taxed 5% points on completion (economy control)
  6. Points can also be earned via referrals, court duty, achievements
- Each step is a custom illustrated panel that animates in sequence
- Interactive: user can click each step to see more detail in a slide-out panel

**Section 3 — Live Marketplace Preview**

- Real-time ticker of trending gigs (horizontally scrolling cards)
- Each card shows: skill offered, skill wanted, point balance, seller avatar, ELO badge
- Cards have 3D tilt hover effect
- "Browse Marketplace" CTA at end of ticker
- Category filter chips above (Design, Dev, Writing, Video, etc.) with magnetic hover

**Section 4 — Platform Formats Showcase**

- Tabbed interface (not accordion, not cards) — each tab reveals a unique animated panel:
  - **Direct Swap**: 1-on-1 skill exchange visualization
  - **Auction**: Multiple sellers competing, countdown timer mockup
  - **Co-Creation Studio**: Multi-person workspace preview with avatar stack
  - **Skill Fusion**: Combined skill gig (frontend + backend = full app)
  - **Projects**: Multi-gig project breakdown visualization
- Each tab has its own micro-animation and illustration

**Section 5 — Gamification Preview**

- Interactive ELO rating visualization (gauge that animates)
- Badge collection showcase (3D rotating badges)
- Achievement unlock animation preview
- Streak counter with fire animation
- Guild wars leaderboard mini-preview
- "Level up by doing great work" messaging

**Section 6 — Gig Workspace Preview**

- Embedded interactive mockup of a gig workspace showing:
  - Messenger with auto-translate indicator
  - Whiteboard (tldraw preview screenshot)
  - Video call interface
  - File sharing with timestamps
  - Stage progress bar with point allocation
- Hover on each section to see it expand with description
- "Every gig gets its own workspace" headline

**Section 7 — Skill Court Teaser**

- Dark dramatic section with court-themed design (gavel icon, scales)
- Explains: disputes resolved by community + AI + experts
- Animated breakdown of judge composition (25% users, 25% AI, 50% experts)
- "Your reputation matters" with ELO impact visualization
- Verdict animation preview (guilty/not guilty scale tipping)

**Section 8 — Guild System Preview**

- Guild card with treasury, member count, ELO average
- Guild benefits list with icon animations
- "Form your team. Share resources. Compete." messaging
- Guild wars mini-leaderboard
- Lending system quick explainer (guild lends points to members)

**Section 9 — University Partners & Trust**

- Partner university logos in an infinite horizontal scroll marquee
- Verified university badge showcase
- Trust indicators: verified identity, ELO system, transaction codes, AI quality checks
- Stats counters: gigs completed, points exchanged, disputes resolved

**Section 10 — Success Stories (Integrated)**

- Featured story: full-width card with student photo, before/after, quote
- 3 additional story cards in a staggered grid
- Video testimonial embed
- "Submit Your Story" CTA
- Partnership mentions woven into stories (e.g., "through our partnership with X University")

**Section 11 — Pricing Quick View**

- Three tier cards (Free / Pro / Enterprise) with 3D flip on hover to show details
- Skill points package pricing below
- "Calculate your value" CTA linking to full pricing page
- Animated comparison slider

**Section 12 — CTA Footer Section**

- Large "Start Swapping Skills Today" headline
- Email signup with animated input
- App store badges (future)
- Social links with hover animations
- Full sitemap in grid layout

---

### PAGE 2: ABOUT + SUCCESS STORIES + PARTNERSHIPS (Merged)

**Section 1 — Mission Hero**

- Full-viewport with Spline 3D scene (hands exchanging skills)
- "Built by students, for students" headline with letter animation
- Mission statement in large silver text

**Section 2 — The Problem We Solve**

- Split layout: left side shows traditional freelancing pain points (high fees, cash barriers, no trust)
- Right side shows Skill Swappr solution for each
- Animated line connecting problems to solutions

**Section 3 — Platform Timeline**

- Vertical scrolling timeline with milestones
- Each milestone has a date, description, and icon
- Parallax scroll effect on the timeline line

**Section 4 — Success Stories Gallery**

- Featured story: cinematic full-width with video background
- Filterable grid of stories by skill type, university, format used
- Each card expands into a full case study overlay
- Impact metrics per story (points earned, skills gained, gigs completed)

**Section 5 — University Partnerships**

- Interactive map showing partner universities
- Each pin click shows university details, custom badge, student count
- Partnership benefits breakdown (for universities and students)
- "Become a Partner" application form with multi-step wizard

**Section 6 — Industry Partnerships**

- Tool and platform integrations showcase
- Enterprise partner logos and case studies
- Co-marketing highlights

**Section 7 — Team Section**

- Team member cards with 3D flip (front: photo/name, back: bio/links)
- Advisory board row
- "Join the Team" CTA

**Section 8 — Community Stats**

- Large animated counter section
- Active users, gigs completed, points in circulation, guilds formed, disputes resolved
- Updated in real-time feel (count-up animation)

**Section 9 — Values & Culture**

- Icon-driven values grid (fairness, transparency, gamification, community)
- Each value card has hover animation revealing how it manifests in features

---

### PAGE 3: FEATURES

**Section 1 — Hero**

- "Everything you need to swap skills" with particle animation background
- Feature category navigation (sticky horizontal scroll)

**Section 2 — Skill Points Economy (Deep Dive)**

- Animated flow diagram: earning → spending → taxation → buying → referral earning
- Interactive calculator: "If you do X gigs, you earn Y points, taxed Z"
- Economy health indicators explanation (why taxation prevents inflation)
- Point allocation on gig stages explained with visual

**Section 3 — Gig Formats (Expanded)**

- Each format gets its own expandable panel with unique illustration:
  - **Direct Swap**: Two users exchange, points balance the difference. Both taxed. Stages with point insurance.
  - **Auction**: Poster sets task, multiple people submit work, best wins most points, others get consolation. Prevents gaming by requiring deliverable proof.
  - **Co-Creation Studio**: Project owner breaks project into roles, invites or posts each role, shared workspace with whiteboard and video. Points distributed per role completion.
  - **Skill Fusion**: Multi-skill gig (e.g., full app). One gig, multiple skill requirements. Can be filled by one person or split.
  - **Projects**: Like a mini product — user defines "build an app," platform suggests component gigs (logo, database, frontend). Each is a sub-gig with own workspace.
  - **Reverse Auction / Skill Rental**: You pay points to rent someone's time for consultation or help. Specific person, not public competition.
  - **Flash Market**: Time-limited gigs with bonus point multipliers.
  - **Subscription Gigs**: Recurring service exchanges (e.g., weekly content writing for weekly design work).
  - **Gig Bundling**: Package multiple small gigs together.

**Section 4 — Gig Workspace Features**

- Visual workspace mockup with labeled sections:
  - **Messenger**: Real-time chat, auto-translated to preferred language, voice notes, file sharing with timestamps and references (Discord-style threading). Built with WebSocket, no third-party chat SDK visible to user.
  - **Whiteboard**: tldraw embedded, shared real-time, saved per gig for reference.
  - **Video Call**: WebRTC-based, built-in screen sharing, recorded and saved to workspace. No Zoom/Meet — fully in-platform.
  - **File Library**: All shared files time-stamped, versioned, searchable. Referenced in chat like attachments.
  - **Stage Tracker**: Visual progress bar with stages. Each stage has allocated points. If a party abandons, the other gets their points back + the abandoner's allocated points for that stage. This is the insurance mechanism.
  - **Deliverable Submission**: Final submission form. Buyer must accept. Pre-specified revision count honored. Guild/expert pre-approval optional before submission.
  - **AI Quality Panel**: Plagiarism check, quality score, version comparison, delivery standard compliance — all visible in sidebar.

**Section 5 — Trust & Quality System**

- Progressive work reveal: work shown in stages so buyer sees progress, AI predicts satisfaction
- Transaction codes: every gig gets a unique code, lookupable by anyone for verification
- Fingerprinting: work contains digital fingerprints for authenticity
- Review & rating system: only after gig completion and verification, both parties rate
- Reporting: flag system with evidence submission
- Reputation insurance: high-ELO users get priority in disputes
- Scam pattern detection: AI monitors for suspicious behavior patterns

**Section 6 — Gamification System**

- **ELO Rating**: Chess-like rating. Win gigs = gain ELO. Bad reviews = lose ELO. Court losses = lose ELO. Displayed on profile.
- **Skill Mastery**: Per-skill progression (Beginner → Intermediate → Advanced → Expert → Master). Unlocks based on completed gigs + ratings in that skill.
- **Achievements**: Specific milestones (first gig, 10 gigs, first auction win, guild leader, court judge). Each has a badge and a small benefit (e.g., reduced tax, featured listing).
- **Streaks**: Daily/weekly activity streaks. Bonus points for maintaining streaks. Streak freeze purchasable with points.
- **Challenges**: Platform-issued challenges (complete 3 gigs this week, try a new skill). Rewards in points and badges.
- **Guild Wars**: Guilds compete on metrics (gigs completed, average rating, points earned). Winners get treasury bonus.
- **Competitions**: Open competitions where many users submit work for a theme. Community votes. Winners get major point awards.
- **Quarterly Wraps**: Every 3 months, users get a visual summary (like Spotify Wrapped) of their activity, growth, skills gained.
- **Yearly Wraps**: Annual deep dive with nostalgia timeline.
- **Lifetime Tiers**: Bronze → Silver → Gold → Platinum → Diamond based on lifetime activity. Each tier unlocks features (Projects mode needs Gold, Co-Creation needs Silver, etc.).
- **Milestone Celebrations**: Animated celebrations on key milestones (100th gig, 1000 points earned, etc.).

**Section 7 — Guild System (Deep Dive)**

- What is a guild: team of users who pool resources, share reputation, compete together
- **Treasury**: Guild has a shared point pool. Members contribute. Guild can lend points to members for gigs.
- **Lending**: Guild lends member X points for a gig. Member pays back after completion. Interest optional.
- **Delegation**: Guild leader can assign incoming gigs to specific members.
- **Guild ELO**: Average of member ELOs. Affects guild ranking and war matchmaking.
- **Guild Portfolio**: Collective showcase of member work.
- **Guild Profile Page**: Public page showing members, stats, portfolio, wars won.
- **Guild Wars**: Periodic competitions between guilds. Metrics-based. Treasury rewards.
- **Guild Approval**: Members can review each other's deliverables before submission for quality control.
- **Guild Page**: Dedicated page per guild with management tools, treasury dashboard, member list, lending log, war history.

**Section 8 — Skill Court (Deep Dive)**

- When triggered: dispute between buyer and seller (abandonment, quality complaint, non-delivery)
- **Case Submission**: Both parties submit evidence (screenshots, chat logs, deliverables, workspace history — all auto-attached from gig workspace)
- **Judge Composition**: 25% random users (minimum ELO threshold), 25% AI analysis, 50% experts/high-rated users in the relevant skill field
- **Voting**: Judges review evidence, cast vote with written reasoning. Weighted by judge ELO.
- **Verdict**: Majority wins. Points redistributed accordingly. Loser's ELO decreases, winner's increases.
- **Judge Rewards**: Judges earn points and ELO for participating. Bad/lazy judgments (flagged by AI or appealed successfully) reduce judge ELO.
- **Free Tier Requirement**: Free users must serve as court judges periodically to maintain gig posting privileges. Cannot post above X gigs without court duty.
- **Expert Incentive**: Experts gain skill points and ELO for judging, making it worthwhile.
- **Appeal System**: One appeal allowed per case. Goes to higher-ELO panel.

**Section 9 — AI Integration (Not a Page — Woven Into Platform)**

- AI is not a separate page. It appears contextually:
  - **In Gig Creation**: Dynamic pricing recommendations, skill market intelligence, demand forecasting
  - **In Workspace**: Quality checks, plagiarism detection, version comparison, delivery standard compliance, predicted buyer satisfaction
  - **In Court**: AI as 25% of judges, evidence analysis, pattern detection
  - **In Profiles**: Portfolio improvement suggestions, case study generation help
  - **In Search**: Semantic search engine, gig recommendations, proximity matching
  - **In Moderation**: Behavior flags, fake account detection, scam patterns
  - **In Analytics**: Earnings forecast, skill market intelligence, performance benchmarks, client intelligence
  - **Personal AI Helper**: Floating assistant available on all pages (slide-out panel), contextually aware of what you're doing

**Section 10 — Enterprise Mode**

- Enterprises access a curated pool of vetted platform experts
- Post projects, consultations, or job listings
- AI-matched expert recommendations
- Direct hire pipeline
- Enterprise dashboard (separate from user dashboard)

---

### PAGE 4: HOW IT WORKS

**Section 1 — Hero**

- "From signup to your first swap in 5 minutes" with step counter animation
- Animated path/journey line that guides the page

**Section 2 — Sign Up & Guided Tour**

- Step-by-step walkthrough of onboarding:
  1. Email signup with verification
  2. Profile creation (name, avatar, university, skills)
  3. Guided tour begins — interactive walkthrough of marketplace, gig creation, workspace, points
  4. Earn 100 skill points on tour completion
  5. University badge verification (if applicable)
- Tour rewards breakdown with point animations

**Section 3 — Browsing & Discovering**

- How marketplace search works: categories, trending, popular, curated, recommended, proximity-based, semantic search
- Filter demonstration with animated UI mockup
- How recommendations work (skill matching, ELO compatibility)

**Section 4 — Creating a Gig**

- Step-by-step gig creation flow:
  1. Choose format (direct, auction, co-creation, etc.)
  2. Define skill offered and skill wanted
  3. Set stages with point allocation per stage
  4. AI suggests pricing based on market intelligence
  5. Set deliverable specs and revision count
  6. Publish
- Visual of each step with animated form mockup

**Section 5 — The Gig Lifecycle**

- Full lifecycle diagram (animated on scroll):
  1. Gig posted → Buyer browses → Match/bid/auction
  2. Both parties enter workspace
  3. Work through stages, progressive reveal, AI monitoring
  4. Final deliverable submitted
  5. Buyer reviews, requests revisions or accepts
  6. Both rate and review
  7. Points distributed, tax deducted
  8. Transaction code generated for verification
- Insurance mechanism explained: if party A abandons at stage 3 of 5, party B gets their own allocated points back + party A's stage points

**Section 6 — Buyer Path**

- Browse → Select gig or post want → Match with seller → Enter workspace → Receive work → Accept/revise → Rate
- Buyer-specific features: subscription management, favorites, bid tracking

**Section 7 — Seller Path**

- Create gig → Get matched/win auction → Enter workspace → Deliver work → Get rated → Earn points
- Seller-specific features: analytics, portfolio building, clips, keyword optimization

**Section 8 — Guild Path**

- Form/join guild → Pool treasury → Delegate gigs → Compete in wars → Collective reputation
- How lending works with visual example

**Section 9 — Dispute Path**

- Disagreement → File case → Evidence auto-collected → Judges assigned → Vote → Verdict → ELO adjusted
- Timeline of a typical case

---

### PAGE 5: PRICING

**Section 1 — Hero**

- "Invest in your skills" with animated skill point coins
- Quick value proposition

**Section 2 — Tier Comparison**

- Three tiers with unique card designs (not a boring table):
  - **Free**: X gigs/month, basic search, must do court duty, standard profile, no projects/co-creation
  - **Pro**: Unlimited gigs, all formats unlocked, featured listings, profile highlighting, priority support, advanced analytics, reduced tax rate
  - **Enterprise**: Everything in Pro + vetted expert access, hiring pipeline, custom integrations, dedicated support
- Each card has 3D flip animation (front: price + headline, back: full feature list)
- Toggle for monthly/yearly with discount animation

**Section 3 — Skill Points Packages**

- Point bundles with volume discounts
- Animated coin stack visualization
- Use cases: "50 points = balance a small gig difference," "200 points = fund a full project"

**Section 4 — Interactive Pricing Calculator**

- Inputs: number of gigs per month, average gig complexity, skill level
- Outputs: recommended tier, estimated points needed, estimated earnings, tax impact
- Animated calculation with results reveal

**Section 5 — Lifetime Tiers Progression**

- Visual progression: Bronze → Silver → Gold → Platinum → Diamond
- What unlocks at each tier (formats, features, reduced taxes, etc.)
- "You're not just paying — you're leveling up"

**Section 6 — Badge System**

- All available badges displayed in a grid
- Hover to see unlock criteria and benefits
- Premium badges for Pro/Enterprise tiers
- University partnership badges

**Section 7 — ROI Calculator**

- "What's your skill worth?" tool
- Input your skill, see market demand, average point value, potential earnings
- Powered by skill market intelligence data

**Section 8 — Testimonials by Tier**

- Real stories from Free, Pro, and Enterprise users
- Each shows their journey and what the tier enabled

**Section 9 — Enterprise Custom Quote**

- Multi-step form for enterprise inquiries
- Custom pricing based on team size, needs, integrations

**Section 10 — FAQ**

- Accordion with common pricing questions
- "Can I earn without paying?" — Yes, via gigs, referrals, court duty, achievements

---

### PAGE 6: PRIVACY & LEGAL (Multi-Tab Single Page)

**Section 1 — Navigation**

- Sidebar with sections: Privacy Policy, Terms of Service, GDPR Compliance, Community Guidelines, IP Policy, Cookie Policy
- Sticky table of contents per section

**Section 2-7 — Each Policy**

- Clean typography, searchable
- Last updated date
- Key points summary at top of each
- Data export request form (in Privacy)
- Account deletion flow (in Privacy)
- Cookie consent preferences (in Cookie Policy)
- Report violation form (in Community Guidelines)

---

### PAGE 7: ENTERPRISE

**Section 1 — Hero**

- "Access vetted student talent" with enterprise-themed 3D scene
- CTA: "Book a Demo"

**Section 2 — How Enterprise Mode Works**

- Post a project/job → AI matches experts → Review profiles/ELO → Hire → Workspace → Deliver
- Visual pipeline diagram

**Section 3 — Expert Pool**

- Browse vetted experts by skill, ELO, university, portfolio
- Preview cards with ratings and badges

**Section 4 — Use Cases**

- Consultation, project-based work, full-time hiring, team augmentation
- Case study per use case

**Section 5 — Security & Compliance**

- Data encryption, verified identities, NDA support, IP protection
- Compliance badges (GDPR, SOC2 aspirational)

**Section 6 — Integrations**

- Payment processors, project management tools, communication platforms
- API access preview

**Section 7 — Pricing**

- Enterprise tier details
- Custom quote CTA

**Section 8 — Contact / Demo**

- Calendar embed for demo booking
- Contact form
- Direct line for enterprise clients

---

### PAGE 8: ROADMAP

**Section 1 — Hero**

- "Built in public, shaped by you"

**Section 2 — Interactive Roadmap Timeline**

- Vertical timeline with phases, each expandable
- Color-coded: completed (green), in progress (amber), planned (silver)
- Click to see details and vote

**Section 3 — Feature Voting**

- Submit feature requests
- Upvote existing requests
- Most voted highlighted

**Section 4 — Changelog**

- Reverse-chronological update feed
- Each entry: date, title, description, category tag

**Section 5 — Status & Uptime**

- Current platform status indicators (API, Marketplace, Messenger, etc.)
- Uptime percentage over 30/90 days
- Incident history log

**Section 6 — Bug Bounty & Open Issues**

- How to report bugs
- Bug bounty reward tiers (points-based)
- Open issues that community can help with (earn points)

**Section 7 — Security Audits**

- Audit history and results summary
- Pentest schedule
- Incident response process overview

---

### PAGE 9: USER PROFILE / PORTFOLIO

**Section 1 — Profile Header**

- Customizable banner and avatar
- Name, university badge, ELO rating display, lifetime tier badge
- Skill tags with mastery level indicators
- Follow/endorse buttons
- Verified identity badge

**Section 2 — Portfolio Gallery**

- Grid of work items with 3D card hover
- Each item: thumbnail, title, skill tags, rating received
- Expandable into full case study view
- Time-lapse of work documentation (if enabled)
- Video feed recordings from gigs

**Section 3 — Clips**

- Short video clips of portfolio work
- Shareable as challenge templates on socials
- Social widgets for proof of work

**Section 4 — Stats Dashboard**

- Gigs completed, points earned, ELO history graph, achievement count
- Skill breakdown radar chart
- Rating distribution

**Section 5 — Endorsements & Reviews**

- Peer endorsements (LinkedIn-style)
- Gig reviews with verified badges
- Rating breakdown by skill

**Section 6 — Guild Membership**

- Current guild display with link to guild page
- Role in guild, contribution stats

**Section 7 — Activity Feed**

- Recent gigs, achievements, badge unlocks
- Nostalgia timeline (yearly wrap link)

**Section 8 — Case Study Builder**

- Create detailed case studies from completed gigs
- Featured on blog/portfolio
- Interactive elements support

---

### PAGE 10: MARKETPLACE / GIG BROWSING

**Section 1 — Search Bar & Filters**

- Semantic search with AI suggestions
- Filter by: category, format, point range, seller ELO, university, proximity, trending/popular/curated/recommended

**Section 2 — Category Navigation**

- Visual category cards with icons (Design, Dev, Writing, Video, Marketing, etc.)
- Subcategories on click

**Section 3 — Trending Gigs**

- Horizontally scrolling featured gigs
- Real-time popularity indicators

**Section 4 — Gig Grid**

- Card-based grid with 3D tilt hover
- Each card: title, skill offered/wanted, point value, seller avatar, ELO, rating
- Quick-view overlay on click

**Section 5 — Auction Listings**

- Active auctions with countdown timers
- Bid count, current submissions

**Section 6 — Co-Creation Projects**

- Multi-role projects seeking collaborators
- Role slots with fill indicators

**Section 7 — Flash Market**

- Time-limited deals with countdown
- Bonus multiplier badges

**Section 8 — Recommended For You**

- AI-curated based on skills, history, network

---

### PAGE 11: GIG CREATION

**Section 1 — Format Selection**

- Choose: Direct Swap, Auction, Co-Creation, Skill Fusion, Project, Subscription, Flash
- Each format has tooltip explanation with animation

**Section 2 — Skill Definition**

- Skill offered (with mastery level auto-filled)
- Skill wanted (or "open to offers")
- AI market intelligence sidebar: demand for this skill, suggested point value, competition level

**Section 3 — Stage Builder**

- Add stages with descriptions
- Allocate points per stage (visual slider)
- Insurance explanation: "If they leave at stage 2, you keep their stage 1-2 points"

**Section 4 — Deliverable Specs**

- Define what final deliverable looks like
- Set revision count
- Set delivery timeline
- AI suggests standards based on skill type

**Section 5 — Pricing & Points**

- AI dynamic pricing recommendation
- Manual override
- Point balance preview (what you'll earn/spend)

**Section 6 — Preview & Publish**

- Full preview of how gig appears in marketplace
- Edit before publishing
- Publish with confirmation animation

**Section 7 — Post-Publish**

- Share to socials
- Track views and bids in real-time
- Edit/pause/close gig

---

### PAGE 12: GIG WORKSPACE (Contains Messenger, Whiteboard, Video — NOT Separate Pages)

**Section 1 — Workspace Header**

- Gig title, stage indicator, both party avatars, point allocation bar
- Status: In Progress / Review / Completed / Disputed

**Section 2 — Stage Progress Panel**

- Visual progress bar with stages
- Click stage to see allocated points, deliverables, status
- Abandon protection indicator

**Section 3 — Messenger (Embedded Section)**

- Real-time chat (WebSocket-based)
- Auto-translate to preferred language
- Voice notes with playback
- File sharing with drag-drop, timestamps, version tracking
- Message threading/referencing (Discord-style)
- Message search
- All messages logged and stored for dispute evidence

**Section 4 — Whiteboard (Embedded Section)**

- tldraw embedded canvas
- Real-time collaboration
- Save snapshots to workspace files
- Reference in chat

**Section 5 — Video Call (Embedded Section)**

- WebRTC peer-to-peer video/audio
- Built-in screen sharing (show your work live)
- Recording saved to workspace (buyer can give live feedback)
- No third-party: fully in-platform

**Section 6 — File Library**

- All shared files organized chronologically
- Version history per file
- Preview support (images, PDFs, code)
- Search and filter

**Section 7 — Deliverable Submission**

- Submit final work with description
- Attach files from library
- AI quality check runs automatically (plagiarism, quality score, standard compliance)
- Optional: guild/expert pre-approval before submission
- Buyer accepts or requests revision (within pre-specified count)

**Section 8 — Review & Close**

- Both parties leave review and rating
- Transaction code generated
- Points distributed with tax deduction visualization
- Workspace archived but accessible for lookup

---

### PAGE 13: SELLER DASHBOARD

**Section 1 — Overview**

- Key metrics: active gigs, total earnings, ELO, current streak, pending deliverables
- Earnings graph (weekly/monthly)
- Quick actions: create gig, view workspace, check messages

**Section 2 — Active Gigs & Workspaces**

- List of in-progress gigs with stage indicators
- Click to enter workspace
- Bid/auction status on pending gigs

**Section 3 — Earnings & Wallet**

- Point balance, earning history, tax deductions log
- Withdraw options (future cash-out, merch store)
- Wallet transaction history

**Section 4 — Analytics**

- Gig performance: views, clicks, conversion rate
- Keyword performance (which tags drive traffic)
- Skill market intelligence: demand trends for your skills
- Earnings forecast based on activity
- Portfolio impact tracking
- Performance benchmarks vs similar sellers

**Section 5 — Profile & Portfolio Management**

- Edit profile, skills, portfolio items
- Clips management
- Case study builder access
- Social widget generator

**Section 6 — Gamification Hub**

- Achievements progress (with unlock criteria)
- Current challenges
- Streak status with freeze option
- Badge collection
- Leaderboard position
- Practice gigs available

**Section 7 — Network & Social**

- Followers/following lists
- Guild membership and tools
- Endorsements received/given
- Smart contracts (active agreements)
- Referral dashboard with earnings

**Section 8 — Account & Settings**

- Notification preferences
- Language and timezone
- Privacy settings
- Data export
- Account recovery/deletion

---

### PAGE 14: BUYER DASHBOARD

**Section 1 — Overview**

- Active orders, pending deliverables, points spent, gigs completed

**Section 2 — Active Orders**

- In-progress gigs with workspace links
- Stage progress per order
- Pending reviews

**Section 3 — Browse & Discover**

- Quick access to marketplace with personalized recommendations
- Saved/favorited gigs and sellers
- Bid tracking on auctions

**Section 4 — Reviews & Ratings Given**

- History of reviews left
- Rating summary

**Section 5 — Subscription Management**

- Active subscription gigs
- Tier management (Free/Pro)

**Section 6 — Transaction History**

- All completed gigs with codes
- Points spent/received breakdown
- Invoice generation

**Section 7 — Wallet & Points**

- Balance, purchase history, tax deductions

---

### PAGE 15: GUILD DASHBOARD & PROFILE

**Section 1 — Guild Profile (Public)**

- Guild name, banner, description, member count, average ELO
- Portfolio of collective work
- War history and trophies
- Join request CTA

**Section 2 — Member Management**

- Member list with roles, ELO, contribution stats
- Invite/remove members
- Role assignment

**Section 3 — Treasury**

- Point pool balance
- Contribution history
- Lending log (who borrowed, how much, repayment status)
- Treasury allocation controls

**Section 4 — Guild Wars**

- Active war status
- Historical war results
- Leaderboard position

**Section 5 — Delegation**

- Incoming gig assignments
- Task distribution interface
- Progress tracking per delegated task

**Section 6 — Guild Analytics**

- Collective stats, growth trends, skill distribution
- Member performance comparison

**Section 7 — Settings**

- Guild rules, joining criteria, treasury policies

---

### PAGE 16: SKILL COURT

**Section 1 — Court Overview**

- Active cases count, your judge rating, cases judged, verdict accuracy
- "Court is in session" dramatic header

**Section 2 — Active Cases**

- List of cases you can judge
- Filter by skill area, severity
- Case summary preview

**Section 3 — Case View (Expandable/Modal)**

- Full evidence display: chat logs, deliverables, workspace history, file timeline
- Both party statements
- AI analysis summary
- Vote panel with reasoning text area
- Judge composition indicator

**Section 4 — Your Cases (As Plaintiff/Defendant)**

- Cases you're involved in
- Status, assigned judges, timeline
- Evidence submission interface

**Section 5 — Verdict History**

- Past verdicts with reasoning
- ELO impact per verdict
- Appeal status

**Section 6 — Your Judge Stats**

- Judge ELO, accuracy rate, cases completed
- Rewards earned from judging
- "Judges gain skill points and ELO for participating"

**Section 7 — Court Rules**

- How judging works
- Weighted voting explanation
- Free tier court duty requirements
- Appeal process

---

### PAGE 17: FORUMS

**Section 1 — Category Navigation**

- Forum categories: General, Skills, Guilds, Feedback, Help, Off-Topic
- Each with post count and latest activity

**Section 2 — Thread List**

- Sortable by latest, popular, unanswered
- Thread cards with author, preview, reply count, tags

**Section 3 — Thread View**

- Original post with rich text
- Reply chain with vote/like
- Author badges and ELO visible

**Section 4 — Create Thread**

- Rich text editor
- Category and tag selection
- AI suggestion for similar existing threads

**Section 5 — User Highlights**

- Featured community members
- Weekly top contributors

**Section 6 — Search**

- Full-text search across threads
- Filter by category, date, author

**Section 7 — Pinned / Announcements**

- Official announcements section
- Community guidelines reminder

---

### PAGE 18: HELP, DOCS, STATUS & REPORTING (Merged)

**Section 1 — Help Center Hero**

- Search bar with AI-powered suggestions
- Popular topics quick links

**Section 2 — Knowledge Base**

- Categorized articles
- Step-by-step guides with screenshots
- Video tutorials

**Section 3 — API Documentation**

- Endpoint reference
- Code examples
- Authentication guide
- Rate limits

**Section 4 — AI Chatbot**

- Floating chatbot (same as AI helper integrated everywhere)
- Contextual help based on current page

**Section 5 — Contact & Support**

- Ticket submission form
- Email support
- Phone for premium/enterprise
- Help desk queue status

**Section 6 — Platform Status & Uptime**

- Real-time status of all services
- Uptime history (30/90/365 day)
- Incident log with postmortems
- Subscribe to status updates

**Section 7 — Bug Bounty Program**

- How to report vulnerabilities
- Reward tiers (points + badges)
- Hall of fame for contributors

**Section 8 — Reporting**

- Report a user/gig/guild
- Evidence attachment
- Report tracking
- Reputation insurance explanation

**Section 9 — Certifications & Compliance**

- Platform certifications
- Security practices overview

---

### PAGE 19: TRANSACTION LOOKUP

**Section 1 — Lookup Form**

- Enter transaction/gig code
- Animated search with verification animation

**Section 2 — Transaction Summary**

- Gig details, parties involved, timeline
- Point distribution breakdown
- Stage completion status

**Section 3 — Work Preview**

- Deliverable preview (limited, respecting IP)
- Quality score and AI assessment

**Section 4 — Verification Status**

- Verified/unverified indicator
- Seller identity verification level
- Review summary

**Section 5 — Report from Lookup**

- Flag suspicious transaction
- Submit evidence

---

### PAGE 20: LEADERBOARD

**Section 1 — Global Leaderboard**

- Top users by ELO, animated rank cards
- Filter by skill, time period, university

**Section 2 — Skill Leaderboards**

- Per-skill rankings
- Mastery level distribution

**Section 3 — Guild Leaderboard**

- Guild rankings by ELO, wars won, treasury size
- War history highlights

**Section 4 — Court Judges Leaderboard**

- Top judges by accuracy and cases handled
- Judge tier badges

**Section 5 — Rising Stars**

- New users climbing fast
- Streak leaders

**Section 6 — University Leaderboard**

- Rankings by partner university
- Inter-university competitions

**Section 7 — Hall of Fame**

- Lifetime achievement spotlights
- Diamond tier showcase

---

### PAGE 21: HISTORY

**Section 1 — Activity Timeline**

- Chronological feed of all user actions
- Filterable by type (gigs, points, achievements, court, guild)

**Section 2 — Gig History**

- Completed and cancelled gigs
- Each expandable with workspace archive link

**Section 3 — Points Ledger**

- Every point transaction: earned, spent, taxed, bought, gifted, lent
- Running balance graph

**Section 4 — Quarterly Wrap**

- Latest wrap with animated stats reveal
- Past wraps archive

**Section 5 — Yearly Wrap**

- Annual deep dive
- Nostalgia timeline with milestones

**Section 6 — Achievement History**

- When each badge/achievement was earned
- Milestone celebrations replay

---

### PAGE 22: ENTERPRISE PRO DASHBOARD

**Section 1 — Overview**

- Active projects, experts engaged, budget spent, hiring pipeline stats

**Section 2 — Expert Discovery**

- AI-matched expert recommendations
- Browse by skill, ELO, university, availability
- Shortlist management

**Section 3 — Project Management**

- Active enterprise projects
- Expert assignments
- Deliverable tracking

**Section 4 — Hiring Pipeline**

- Candidates in pipeline stages
- Interview scheduling
- Offer management

**Section 5 — Consultation Booking**

- Schedule consultations with experts
- Calendar integration

**Section 6 — Analytics & Reports**

- Project completion rates, expert performance, ROI
- Exportable reports

**Section 7 — Billing & Invoicing**

- Invoice history
- Budget allocation
- Payment method management

---

## Feature Interaction Map

How major systems interact:

```text
SIGN UP → Guided Tour (earn 100 pts) → Profile Creation → Marketplace
                                                              │
                    ┌─────────────────────────────────────────┘
                    ▼
              MARKETPLACE ──→ Browse / Search / Filter / AI Recommend
                    │
                    ├──→ Direct Swap ──→ Match ──→ GIG WORKSPACE
                    ├──→ Auction ──→ Submit Work ──→ Winner Selected ──→ WORKSPACE
                    ├──→ Co-Creation ──→ Multi-Role Fill ──→ Shared WORKSPACE
                    ├──→ Skill Fusion ──→ Multi-Skill Match ──→ WORKSPACE
                    └──→ Project ──→ Sub-Gigs Created ──→ Multiple WORKSPACES
                                                              │
                    ┌─────────────────────────────────────────┘
                    ▼
            GIG WORKSPACE (messenger, whiteboard, video, files, stages)
                    │
                    ├──→ Stage Progress ──→ Points Allocated Per Stage
                    │                         └──→ Abandon? → Other party gets points (INSURANCE)
                    │
                    ├──→ AI Quality Monitor (plagiarism, quality, satisfaction prediction)
                    │
                    ├──→ Deliverable Submit ──→ Guild/Expert Pre-Approval? ──→ Buyer Review
                    │                                                              │
                    │                              ┌───────────────────────────────┘
                    │                              ▼
                    │                    Accept ──→ POINTS DISTRIBUTED (minus tax)
                    │                         └──→ Transaction Code Generated
                    │                         └──→ Both Parties Rate & Review
                    │
                    │                    Reject ──→ Revision (if within count)
                    │                         └──→ Dispute ──→ SKILL COURT
                    │
                    └──→ Dispute Filed ──→ SKILL COURT
                                              │
                    ┌─────────────────────────┘
                    ▼
              SKILL COURT
                    ├──→ Evidence Auto-Collected from Workspace
                    ├──→ Judges Assigned (25% users, 25% AI, 50% experts)
                    ├──→ Voting with Reasoning (weighted by judge ELO)
                    ├──→ Verdict ──→ Points Redistributed
                    │            └──→ ELO Adjusted (winner up, loser down)
                    │            └──→ Judge ELO Adjusted (good judgment = up)
                    └──→ Appeal? ──→ Higher Panel Re-Review

POINTS ECONOMY:
  Earn: Gigs, Referrals, Achievements, Court Duty, Challenges, Sign-up
  Spend: Balancing gig value, Buying services, Streak freeze, Flash market
  Tax: X% on every completed gig (both parties) — prevents inflation
  Buy: Real money → Points packages
  Cash Out (Future): Points → Merch, Plaques, Cash
  Lend: Guild treasury → Member → Repay after gig

GUILDS ──→ Treasury (pooled points)
       ──→ Lending to members
       ──→ Delegation of gigs
       ──→ Guild Wars (compete with other guilds)
       ──→ Collective Portfolio
       ──→ Member approval of deliverables

ELO SYSTEM:
  Increases: Good reviews, gig completions, court wins, good judging
  Decreases: Bad reviews, court losses, abandonment, bad judging
  Affects: Search ranking, court eligibility, feature unlocks, guild wars matchmaking

LIFETIME TIERS (unlock features):
  Bronze (start) → Silver (unlock Co-Creation) → Gold (unlock Projects)
  → Platinum (unlock Enterprise features) → Diamond (all features, reduced tax)

NOTIFICATIONS:
  Every action triggers relevant notifications
  Duolingo-style push for streaks, achievements, gig updates
  Customizable preferences

LOGGING:
  activity_log captures: every click, upload, message, transaction,
  rating, search, page view, gig action, court action — everything.
  Used for: AI training, analytics, dispute evidence, wraps, insights
```

---

## Development Rules

1. **No code truncation** — every file written completely, no `// ... rest of code`
2. **User approval required** — no moving to next section/page without explicit approval
3. **Tests for every component** — vitest + @testing-library/react
4. **TRACKER.md** — manual file tracking: phases, pages, sections, bugs, status
5. **Supabase-portable** — all migrations, RLS, edge functions in `supabase/` folder
6. **Unique design per page** — no reused layouts, every page has bespoke sections
7. **Animation on everything** — no static elements, Framer Motion + CSS 3D + Spline throughout
8. **Custom fonts only** — Satoshi, General Sans, JetBrains Mono imported via @font-face
9. **Monotone palette** — silver/white/black with surgical color pops (green, red, gold, blue)
10. **AI integrated contextually** — not a separate page, appears as helper/panel on relevant pages
11. **Messenger/whiteboard/video in workspace** — not separate pages, embedded sections in gig workspace
12. **Comprehensive logging** — every user action logged to activity_log
13. **No admin dashboard in Phase 1** — deferred to later phase
14. **Modular architecture** — `src/features/{domain}/` structure for easy migration
15. **No Lovable lock-in** — standard React + Supabase SDK only

---

## Phase Execution Order

1. **Project Setup**: Folder structure, design tokens, custom fonts, animation utilities, TRACKER.md
2. **Home Page**: All 12 sections with full animations and 3D
3. **About + Stories + Partnerships**: 9 sections merged page
4. **Features**: 10 sections deep dive
5. **How It Works**: 9 sections walkthrough
6. **Pricing**: 10 sections with calculators
7. **Privacy & Legal**: Multi-tab legal pages
8. **Enterprise**: 8 sections
9. **Roadmap**: 7 sections with voting
10. **Auth & Onboarding**: Sign up, guided tour, profile creation
11. **User Profile / Portfolio**: 8 sections
12. **Marketplace / Gig Browsing**: 8 sections
13. **Gig Creation**: 7 sections
14. **Gig Workspace**: 8 sections (contains messenger, whiteboard, video)
15. **Seller Dashboard**: 8 sections
16. **Buyer Dashboard**: 7 sections
17. **Guild Dashboard**: 7 sections
18. **Skill Court**: 7 sections
19. **Forums**: 7 sections
20. **Help/Docs/Status/Reporting**: 9 sections merged
21. **Transaction Lookup**: 5 sections
22. **Leaderboard**: 7 sections
23. **History**: 6 sections
24. **Enterprise Dashboard**: 7 sections

Each page built and approved before moving to the next.