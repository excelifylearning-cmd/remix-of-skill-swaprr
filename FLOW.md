# Skill Swappr — System Flow & Architecture

> How all pages, components, data, and systems connect.

---

## 1. User Journey (Primary Flow)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MARKETING SITE (Public)                          │
│                                                                             │
│  Home ─── About ─── Features ─── How It Works ─── Pricing ─── Enterprise   │
│  Blog ─── Forums ─── Events ─── Legal ─── FAQ ─── Contact ─── Roadmap     │
│  Help ─── Leaderboard ─── Analytics ─── Success Stories ─── Transaction    │
│                                                                             │
│  All accessible without auth. Shared Navbar + Footer.                       │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                          ┌──────▼──────┐
                          │   SIGNUP     │
                          │  12-step     │
                          │  guided tour │
                          │  +100 SP     │
                          └──────┬──────┘
                                 │
                          ┌──────▼──────┐
                          │   LOGIN      │
                          │  Email/Pass  │
                          └──────┬──────┘
                                 │
                    ┌────────────▼────────────────┐
                    │      AUTHENTICATED APP       │
                    │   (MobileBottomNav visible)  │
                    └────────────┬────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                   │
        ┌─────▼─────┐    ┌──────▼──────┐    ┌──────▼──────┐
        │ DASHBOARD  │    │ MARKETPLACE │    │   CLIPS     │
        │ (Hub)      │    │ (Browse)    │    │ (TikTok)    │
        └─────┬─────┘    └──────┬──────┘    └─────────────┘
              │                  │
              │           ┌──────▼──────┐
              │           │  GIG DETAIL  │
              │           └──────┬──────┘
              │                  │
              │           ┌──────▼──────┐
              │           │  PROPOSAL    │
              │           │  MODAL       │
              │           └──────┬──────┘
              │                  │
              │           ┌──────▼──────┐
              │           │ ACCEPT →     │
              │           │ ORDER CREATED│
              │           └──────┬──────┘
              │                  │
              ├──────────────────┘
              │
        ┌─────▼─────────────────────────────────────────────────┐
        │                    GIG WORKSPACE                       │
        │                                                        │
        │  ┌─────────┐ ┌──────────┐ ┌───────┐ ┌──────────────┐ │
        │  │ Chat    │ │Whiteboard│ │ Video │ │ Files/Stages │ │
        │  │(Realtime)│ │(Canvas) │ │(Placeholder)│ │(Storage)│ │
        │  └─────────┘ └──────────┘ └───────┘ └──────────────┘ │
        │                                                        │
        │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
        │  │ Escrow   │ │ Submit   │ │ Dispute  │ │ AI Panel │ │
        │  │ Panel    │ │Deliverable│ │ Filing  │ │          │ │
        │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────────┘ │
        └───────┼────────────┼────────────┼────────────────────┘
                │            │            │
         ┌──────▼──────┐  ┌──▼───┐  ┌────▼─────┐
         │ SP Released  │  │Review│  │SKILL COURT│
         │ per Stage    │  │Modal │  │           │
         └──────┬──────┘  └──┬───┘  │ Evidence  │
                │            │      │ Jury Vote │
                └────┬───────┘      │ Verdict   │
                     │              └────┬──────┘
               ┌─────▼─────┐            │
               │ TRANSACTION│      ┌─────▼─────┐
               │ CODE GEN   │      │ ELO ADJUST │
               └─────┬─────┘      └───────────┘
                     │
               ┌─────▼─────┐
               │ TRANSACTION│
               │ LOOKUP     │
               └───────────┘
```

---

## 2. Page Map (All Routes)

```
ROUTE                          COMPONENT                               AUTH?
─────────────────────────────────────────────────────────────────────────────
/                              HomePage                                 No
/about                         AboutPage                                No
/features                      FeaturesPage                             No
/how-it-works                  HowItWorksPage                           No
/pricing                       PricingPage                              No
/enterprise                    EnterprisePage                            No
/contact                       ContactPage                              No
/blog                          BlogPage                                 No
/forums                        ForumsPage                               No
/events                        EventsPage                               No
/faq                           FAQPage                                  No
/legal                         LegalPage                                No
/roadmap                       RoadmapPage                              No
/help                          HelpPage                                 No
/leaderboard                   LeaderboardPage                          No
/analytics                     AnalyticsPage                            No
/success-stories               SuccessStoriesPage                       No
/transaction                   TransactionLookupPage                    No
/login                         LoginPage                                No
/signup                        SignupPage                                No
─────────────────────────────────────────────────────────────────────────────
/dashboard                     DashboardPage                            Yes
/marketplace                   MarketplacePage                          No*
/marketplace/auctions          AuctionsPage                             No*
/marketplace/co-creation       CoCreationPage                           No*
/marketplace/skill-fusion      SkillFusionPage                          No*
/marketplace/sp-only           SPOnlyPage                               No*
/marketplace/flash-market      FlashMarketPage                          No*
/marketplace/requests          RequestsPage                             No*
/marketplace/projects          ProjectsPage                             No*
/marketplace/:gigId            GigDetailPage                            No*
/clips                         ClipsPage                                No*
/profile/:userId               ProfilePage                              No*
/guilds                        BrowseGuildsPage                         No*
/guild/:guildId                GuildPage                                No*
/guild-dashboard/:guildId      GuildDashboardPage                       Yes
/users                         BrowseUsersPage                          No*
/workspace/:workspaceId        WorkspacePage                            Yes
/enterprise-dashboard          EnterpriseDashboardPage                  Yes
/saved                         SavedPostsPage                           Yes
─────────────────────────────────────────────────────────────────────────────
/coming-soon                   ComingSoon                               No
/404                           NotFound                                 No
/500                           ServerError                              No
/offline                       Offline                                  No
/maintenance                   Maintenance                              No
/forbidden                     Forbidden                                No

* Browsable without auth but actions (propose, bid, create) require auth
```

---

## 3. Data Flow (Tables → Pages)

```
DATABASE TABLE                 PAGES THAT READ/WRITE
─────────────────────────────────────────────────────────────────
profiles                   →   Dashboard, Profile, Leaderboard, Marketplace cards,
                               Workspace members, Browse Users, Guild members
listings                   →   Marketplace (all 7 sub-pages), Dashboard (My Gigs),
                               Gig Detail, Browse/Search
workspace_messages         →   Workspace (Chat panel) [REALTIME]
workspace_files            →   Workspace (Files panel)
workspace_stages           →   Workspace (Stages panel)
workspace_deliverables     →   Workspace (Submit panel)
workspace_members          →   Workspace (Members panel)
escrow_contracts           →   Workspace (Escrow panel), Dashboard
disputes                   →   Dashboard (Skill Court tab), Workspace (Dispute panel)
case_evidence              →   Dashboard (Skill Court tab)
jury_assignments           →   Dashboard (Skill Court tab)
jury_votes                 →   Dashboard (Skill Court tab)
transactions               →   Transaction Lookup, Dashboard (History)
notifications              →   Dashboard (Notification popover)
guilds                     →   Browse Guilds, Guild Page, Guild Dashboard, Leaderboard
guild_members              →   Guild Page, Guild Dashboard, Leaderboard
guild_projects             →   Guild Dashboard
guild_treasury_log         →   Guild Dashboard
guild_loans                →   Guild Dashboard
guild_wars                 →   Guild Dashboard, Leaderboard
blog_posts                 →   Blog Page
blog_comments              →   Blog Page
blog_likes                 →   Blog Page
forum_categories           →   Forums Page
forum_threads              →   Forums Page
forum_comments             →   Forums Page
forum_votes                →   Forums Page
events                     →   Events Page
event_registrations        →   Events Page
achievements               →   Dashboard, Profile
user_achievements          →   Dashboard, Profile
badges                     →   Profile, Leaderboard
user_badges                →   Profile
help_articles              →   Help Page
help_reports               →   Help Page
contact_submissions        →   Contact Page
feature_requests           →   Roadmap Page
feature_votes              →   Roadmap Page
changelog_entries           →   Roadmap Page
platform_metrics           →   Analytics Page
quarterly_reports          →   Analytics Page
activity_log               →   Telemetry (background)
page_sessions              →   Telemetry (background)
click_heatmap              →   Telemetry (background)
error_log                  →   Telemetry (background)
enterprise_projects        →   Enterprise Dashboard
enterprise_candidates      →   Enterprise Dashboard
enterprise_consultations   →   Enterprise Dashboard
demo_bookings              →   Enterprise Page
enterprise_quotes          →   Enterprise Page
newsletter_subscriptions   →   Footer
sp_transactions            →   Dashboard (Wallet) [NOT YET WIRED]
reviews                    →   Profile, Gig Detail [NOT YET WIRED]
user_roles                 →   Auth context (role checks)
```

---

## 4. Component Architecture

```
src/
├── components/
│   ├── shared/                    # Global components (only these are reused)
│   │   ├── Navbar.tsx             # Top nav (all pages)
│   │   ├── Footer.tsx             # Bottom footer (all pages)
│   │   ├── MobileBottomNav.tsx    # Bottom nav (authenticated mobile only)
│   │   ├── LiveChatWidget.tsx     # AI chat widget (all pages)
│   │   ├── PageTransition.tsx     # Framer Motion wrapper
│   │   ├── LoadingScreen.tsx      # Initial load screen
│   │   ├── CookieConsent.tsx      # GDPR banner
│   │   ├── ScrollToTop.tsx        # Route change scroll reset
│   │   ├── CursorGlow.tsx         # Cursor following effect
│   │   ├── CustomCursor.tsx       # Custom cursor styling
│   │   ├── LoginPrompt.tsx        # Auth gate modal
│   │   ├── AppNav.tsx             # Sub-page navigation
│   │   └── TelemetryProvider.tsx  # Activity/error logging
│   └── ui/                        # shadcn base (customized per style guide)
│       └── [50+ ui primitives]
│
├── features/                      # Domain modules (bespoke per page)
│   ├── home/                      # HomePage + sections
│   ├── about/                     # AboutPage + sections
│   ├── marketplace/               # MarketplacePage + 7 sub-pages + components
│   ├── dashboard/                 # DashboardPage + tabs
│   ├── workspace/                 # WorkspacePage + 15 panels
│   ├── guild/                     # Guild pages (browse, detail, dashboard)
│   ├── profile/                   # ProfilePage
│   ├── auth/                      # Login + Signup
│   ├── analytics/                 # AnalyticsPage + charts
│   ├── leaderboard/               # LeaderboardPage
│   ├── clips/                     # ClipsPage (TikTok feed)
│   ├── blog/                      # BlogPage
│   ├── forums/                    # ForumsPage
│   ├── events/                    # EventsPage
│   ├── help/                      # HelpPage
│   ├── roadmap/                   # RoadmapPage
│   ├── contact/                   # ContactPage
│   ├── pricing/                   # PricingPage
│   ├── features/                  # FeaturesPage
│   ├── how-it-works/              # HowItWorksPage
│   ├── enterprise/                # EnterprisePage + Dashboard
│   ├── legal/                     # LegalPage
│   ├── faq/                       # FAQPage
│   ├── success-stories/           # SuccessStoriesPage
│   ├── transaction/               # TransactionLookupPage
│   └── saved/                     # SavedPostsPage
│
├── lib/                           # Utilities & context
│   ├── auth-context.tsx           # Auth state (Supabase Auth)
│   ├── utils.ts                   # cn(), helpers
│   ├── telemetry.ts               # Event tracking
│   ├── activity-logger.ts         # DB logging
│   ├── transaction-generator.ts   # Transaction code gen
│   └── email-validation.ts        # Email utils
│
├── integrations/
│   └── supabase/
│       ├── client.ts              # Auto-generated client
│       └── types.ts               # Auto-generated types
│
├── hooks/                         # Shared hooks
│   ├── use-mobile.tsx             # useIsMobile()
│   ├── use-toast.ts               # Toast notifications
│   └── useNotifications.ts        # Notification polling
│
└── supabase/
    ├── config.toml                # Auto-managed config
    ├── migrations/                # 24 SQL migration files
    └── functions/                 # Edge functions
        ├── ai-chat/               # Global AI assistant
        ├── workspace-ai/          # Workspace AI helper
        ├── seed-test-data/        # Test data seeder
        └── send-notification/     # Notification sender
```

---

## 5. System Interactions

### SP Economy Flow
```
User Action          │ SP Change              │ Tables Affected
─────────────────────┼────────────────────────┼─────────────────────
Sign up              │ +100 SP (bonus)        │ profiles, sp_transactions
Complete gig (seller)│ +SP earned, -5% tax    │ profiles, sp_transactions
Complete gig (buyer) │ -SP paid, -5% tax      │ profiles, sp_transactions
Referral signup      │ +50 SP (referrer)      │ profiles, sp_transactions
Court duty           │ +10-25 SP              │ profiles, sp_transactions
Achievement unlock   │ +varies                │ profiles, sp_transactions
Streak bonus         │ +varies                │ profiles, sp_transactions
Guild loan           │ ±amount                │ guild_loans, guild_treasury_log
Stage abandon        │ Victim gets both pools │ escrow_contracts, profiles
```

### ELO System Flow
```
Event                │ ELO Change        │ Trigger
─────────────────────┼───────────────────┼──────────────────────
Good review (4-5★)   │ +10-30            │ After review submitted
Bad review (1-2★)    │ -10-30            │ After review submitted
Court win            │ +20-50            │ After verdict
Court loss           │ -20-50            │ After verdict
Good judging         │ +5-15             │ After appeal confirms
Bad judging          │ -10-20            │ After successful appeal
Gig abandonment      │ -30-50            │ After workspace abandoned
```

### Skill Court Flow
```
Dispute Filed
    │
    ▼
Auto-Evidence Collection ──→ workspace_messages, files, stages, logs
    │
    ▼
Jury Assignment ──→ 25% random users (min ELO threshold)
                    25% AI analysis
                    50% experts in relevant skill
    │
    ▼
Voting Period (48-72h) ──→ Each juror: vote + reasoning (weighted by ELO)
    │
    ▼
Verdict ──→ Majority wins
    │
    ├──→ SP redistributed (loser → winner)
    ├──→ ELO adjusted (winner ↑, loser ↓)
    ├──→ Judge ELO adjusted (good judgment ↑)
    └──→ Appeal window (24h) ──→ Higher panel if appealed
```

---

## 6. Auth & Permission Model

```
ROLE           │ Can Access
───────────────┼──────────────────────────────────────────────
anonymous      │ Marketing pages, marketplace browse, profiles (read)
authenticated  │ Dashboard, workspace, gig creation, proposals, clips, forums (write)
moderator      │ All above + moderation queue, content flags, user warnings
admin          │ All above + admin dashboard, user management, role assignment
enterprise     │ All above + enterprise dashboard, expert discovery, hiring pipeline

Check: has_role(auth.uid(), 'admin') — security definer function
Table: user_roles (user_id, role) — separate from profiles
```

---

## 7. Missing Connections (To Build)

```
CURRENT GAP                    │ Connection Needed
───────────────────────────────┼──────────────────────────────────────
Proposal → Workspace           │ accept_proposal() creates order + workspace + escrow
Deliverable Accept → Review    │ complete_order() opens ReviewModal
Review → ELO                   │ update_elo() after review insert
Stage Complete → SP Release    │ execute_stage_release() transfers SP
Dispute → Auto Evidence        │ on dispute insert, auto-collect workspace data
Gig Complete → Transaction     │ generate_transaction() after both reviews
Achievement Threshold → Badge  │ trigger on user_achievements insert
Clips → Database               │ clips table + upload flow
Success Stories → Database     │ success_stories table + admin curation
```
