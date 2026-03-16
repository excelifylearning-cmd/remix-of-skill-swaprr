# Skill Swappr — Blueprint (Launch Requirements)

> Master reference for all 85 requirements (blanks excluded from original 130-point doc).
> Status key: ✅ Done | 🟡 Partial | 🔴 Not Built | 🎨 Needs Redesign (functional but design pending)
> Difficulty: 🟢 Easy (1-2 sessions) | 🟠 Medium (2-4 sessions) | 🔴 Hard (4+ sessions)
> Priority: 🔥 Critical | ⚡ High | 📌 Low

---

## Requirements Table

| # | Requirement | Status | Difficulty | Priority | Category | What Exists | What's Missing | How to Build |
|---|------------|--------|-----------|----------|----------|-------------|----------------|--------------|
| 1 | Sign up with guided tour and onboarding | ✅ Done | 🟢 Easy | 🔥 Critical | Auth | 12-step signup flow in `SignupPage.tsx`, `handle_new_user()` trigger creates profile + role, `profiles.onboarding_complete` flag | SP reward trigger on tour completion not logged as transaction | Add `sp_transactions` insert in `handle_new_user()` trigger for 100 SP signup bonus |
| 2 | Starting skill points rewards | 🟡 Partial | 🟢 Easy | 🔥 Critical | Economy | `profiles.sp` defaults to 100, `sp_transactions` table exists | No trigger logging the initial 100 SP as a transaction entry | DB trigger: on profile creation, insert into `sp_transactions` (amount: 100, type: 'signup_bonus') |
| 3 | Skill points tax and economy | 🟡 Partial | 🟠 Medium | 🔥 Critical | Economy | `sp_transactions` table with `tax_amount` column, `profiles.sp` balance | No SP transfer function, no tax calculation, no balance enforcement, no payment integration | Create `transfer_sp()` DB function: debit sender, credit receiver, calculate 5% tax, insert transaction records, enforce balance >= 0 |
| 4 | User dashboard | 🎨 Needs Redesign | 🟠 Medium | 🔥 Critical | Dashboard | `DashboardPage.tsx` (1,124 lines), 8 tabs (Overview/Gigs/Create/Court/Guilds/Wallet/Analytics/Settings), queries `listings`, `escrow_contracts`, `profiles`, `notifications` | Design not approved — awaiting new design from user | Rebuild UI once design provided. Backend wiring is functional |
| 5 | Admin dashboard | 🔴 Not Built | 🔴 Hard | ⚡ High | Dashboard | `user_roles` table with `admin` role, `has_role()` security definer function | No admin UI page, no moderation queue, no user management | Create `src/features/admin/AdminDashboardPage.tsx` with user management, content moderation queue, platform stats, role management. Gate with `has_role(uid, 'admin')` |
| 6 | Profile portfolios | 🎨 Needs Redesign | 🟠 Medium | ⚡ High | Profile | `ProfilePage.tsx` (674 lines), reads from `profiles` table (40+ columns), portfolio items as JSON, badges/achievements rendered, inline edit mode | Design not approved | Rebuild UI once design provided. Backend fully wired |
| 7 | Messenger, Gigs, Whiteboard, Video Calls | 🟡 Partial | 🔴 Hard | 🔥 Critical | Workspace | Workspace messenger: real-time via `workspace_messages` + Supabase realtime. Gig creation in dashboard. Whiteboard: canvas element (local only). Video: UI placeholder | Whiteboard not collaborative (no CRDT/Yjs). Video has no WebRTC. No global messenger outside workspaces | Whiteboard: integrate tldraw or Excalidraw with Supabase realtime sync. Video: evaluate Daily.co/LiveKit integration. Global messenger: new `messages` table + realtime channel |
| 10 | Skill Academy of Tutorials and Playlists | 🔴 Not Built | 🔴 Hard | 📌 Low | Education | Nothing | No tables, no pages, no UI | Create `tutorials`, `playlists`, `tutorial_progress` tables. Build `src/features/academy/AcademyPage.tsx` with video player, progress tracking, playlist navigation |
| 11 | Real-time tutors | 🔴 Not Built | 🔴 Hard | 📌 Low | Education | Nothing | No live tutoring system | Would need video call infrastructure (see Req 7) + tutor matching + booking system. Depends on Req 7 video |
| 12 | Skill Certificates | 🟡 Partial | 🟠 Medium | 📌 Low | Gamification | `profiles.certificates` JSON column | No certification system, no issuing, no verification, no PDF generation | Create `certificates` table (user_id, skill, issued_at, verified_by, pdf_url). Edge function to generate PDF certificate. Verify via transaction code |
| 14 | Guilds | 🟡 Partial | 🟠 Medium | ⚡ High | Guilds | 8 guild tables exist (`guilds`, `guild_members`, `guild_projects`, `guild_treasury_log`, `guild_loans`, `guild_wars`, `guild_achievements`, `guild_badges`). `GuildPage.tsx`, `BrowseGuildsPage.tsx`, `GuildDashboardPage.tsx` exist. Browse queries live data | Create guild UI not fully wired, join flow incomplete, treasury/lending UI missing | Wire create guild form → `guilds` insert. Wire join → `guild_members` insert. Build treasury/lending management panels in guild dashboard |
| 15 | Teams | 🟡 Partial | 🟠 Medium | 📌 Low | Workspace | `workspace_members` table with roles (admin/editor/viewer), invite-by-email in workspace | No standalone teams concept outside workspaces | Could create `teams` table or extend guild system. Low priority — workspace members serve this purpose |
| 16 | Smart Contracts | 🟡 Partial | 🟠 Medium | ⚡ High | Economy | `escrow_contracts` table (buyer/seller, terms JSON, total_sp, released_sp, status). Workspace escrow panel reads/writes | No actual contract execution engine, no automated SP release on stage completion | Create `execute_stage_release()` DB function: on stage mark complete → release allocated SP → update escrow. Add automation triggers |
| 18 | Clip generator and viewer with cross-platform posting + referral | 🟡 Partial | 🔴 Hard | ⚡ High | Clips | `ClipsPage.tsx` — TikTok-style vertical scroll UI with snap scrolling, category filters | All clips are hardcoded mock data. No `clips` table. No video upload. No clip generation. No referral links. No cross-platform posting | Create `clips` table (user_id, title, video_url, tags, views, likes). Storage bucket for clip videos. Upload UI in dashboard. Referral link generator. Social share buttons with UTM params |
| 19 | Badges | ✅ Done | 🟢 Easy | ⚡ High | Gamification | `badges`, `user_badges`, `guild_badges` tables. ProfilePage renders badges from DB | No automated badge awarding triggers | Create DB triggers: on gig completion count → award "First Gig" badge. On ELO threshold → award tier badge. Edge function for complex badge logic |
| 20 | Events | ✅ Done | 🟢 Easy | ⚡ High | Community | `events`, `event_registrations` tables (20+ columns). `EventsPage.tsx` queries DB. `tournaments`, `tournament_participants` tables | Registration flow works. Event creation admin UI missing | Add event creation form (admin/enterprise only). Tournament bracket visualization |
| 21 | Multiple Buyer Seller Formats | ✅ Done | — | 🔥 Critical | Marketplace | 7 formats: Direct, Auction, Co-Creation, Skill Fusion, SP Only, Flash Market, Requests, Projects. Each has dedicated route + page + card component. All query `listings` filtered by `format` | Proposal acceptance doesn't auto-create workspace | Wire `ProposalModal` submit → create `escrow_contracts` + workspace entry + `workspace_members` |
| 22 | Skill Court | ✅ Done | — | 🔥 Critical | Court | `disputes`, `case_evidence`, `case_comments`, `jury_assignments`, `jury_votes` tables. `SkillCourtTab.tsx` (680+ lines) — case viewer, evidence, voting, AI assist. Dashboard integration | Weighted voting not enforced server-side. ELO impact not calculated on verdict | Create `resolve_case()` DB function: tally weighted votes → set verdict → adjust ELO for both parties + judges → redistribute SP |
| 24 | Mobile App | 🟡 Partial | 🟠 Medium | ⚡ High | Mobile | `MobileBottomNav.tsx` — 5-tab bottom nav. Responsive design across pages. ClipsPage immersive mobile design. `useIsMobile()` hook | No native app, no PWA manifest, no service worker | Add `manifest.json` for PWA installability. Add service worker for offline. Native app would be separate React Native project |
| 25 | ELO Rating | 🟡 Partial | 🟠 Medium | 🔥 Critical | Gamification | `profiles.elo` (default 1000). ELO displayed on profile, leaderboard, marketplace. Tier system (Bronze/Silver/Gold/Platinum/Diamond) | No ELO calculation engine — no function to update after gig/court | Create `update_elo()` DB function: K-factor based calc. Call after: gig review (winner/loser based on rating), court verdict, judge participation. Update `profiles.elo` + insert `ranking_history` |
| 27 | AI helper throughout entire journey | ✅ Done | — | ⚡ High | AI | `ai-chat` edge function, `workspace-ai` edge function, `LiveChatWidget.tsx` (global), Workspace AI panel, Court AI assist, AI quality scoring on deliverables | Image/video AI generation in workspace not built | Extend `workspace-ai` to support image gen via Lovable AI models. Add code assistance panel |
| 28 | Transaction verification with gig summary, clips, telemetry | ✅ Done | — | 🔥 Critical | Transactions | `transactions` table (30+ JSON columns), `TransactionLookupPage.tsx`, `transaction-generator.ts` | Clip attachment to transactions missing | Add `clip_id` column to transactions. Link workspace clips to transaction record |
| 29 | Multiple gig stages with escrow for abandonment insurance | ✅ Done | — | 🔥 Critical | Workspace | `workspace_stages` (name, status, sp_allocated, order_index). `escrow_contracts` (total_sp, released_sp). Workspace Stages + Escrow panels | Automated SP release on stage complete not triggered | See Req 16 — `execute_stage_release()` function |
| 31 | Guilds: big projects, delegation, lending, reward sharing, quality checks | 🟡 Partial | 🔴 Hard | ⚡ High | Guilds | `guild_projects`, `guild_loans`, `guild_treasury_log` tables. `GuildDashboardPage.tsx` | Delegation flow, reward sharing logic, quality check workflow not wired | Build delegation UI: guild leader assigns incoming gigs to members. Reward split config on guild projects. Pre-submission review queue for guild members |
| 33 | Co-Creation Studios | ✅ Done | — | ⚡ High | Marketplace | `CoCreationPage.tsx` + `CoCreationCard.tsx`. Listings with `format = "Co-Creation"`. Workspace supports multiple members | Role slot filling visualization could improve | Enhance card to show role slots filled/open |
| 35 | Auction bidding system | 🟡 Partial | 🟠 Medium | ⚡ High | Marketplace | `AuctionsPage.tsx` + `AuctionCard.tsx`. `listings` has `current_bid`, `bid_count`, `ends_at` | No bid submission endpoint. No bid history table | Create `bids` table (listing_id, bidder_id, amount, submitted_at). `place_bid()` function with validation. Real-time bid updates via Supabase realtime |
| 37 | LinkedIn-style network | 🔴 Not Built | 🔴 Hard | 📌 Low | Social | Nothing | No follow/connection system, no feed, no endorsements | Create `connections` table (user_a, user_b, status), `endorsements` table, `feed_items` table. Build network page with connection requests, feed, endorsement giving |
| 39 | Skill Fusion gigs | ✅ Done | — | ⚡ High | Marketplace | `SkillFusionPage.tsx` + `SkillFusionCard.tsx`. Listings with `format = "Skill Fusion"` | — | Done |
| 41 | Progressive work reveal + AI quality assurance | 🟡 Partial | 🟠 Medium | ⚡ High | Workspace | Workspace stages provide progressive reveal. AI quality scoring exists (`ai_quality_score`, `ai_feedback`) | Live process streaming, expert hire-to-review flow | Add satisfaction prediction endpoint in `workspace-ai`. Build expert review marketplace |
| 43 | Skill Mastery, Achievements, Notifications, Streaks, Challenges | 🟡 Partial | 🟠 Medium | ⚡ High | Gamification | `achievements`, `user_achievements` tables. `notifications` table. `profiles.streak_days`. `useNotifications` hook, popover in dashboard | No automated triggers for achievements. No challenges system. No streak calculation | Create `calculate_streak()` function (run daily via cron). Achievement triggers on gig count thresholds. `challenges` table + weekly challenge generation |
| 45 | Earning Insights / Analytics Page | 🎨 Needs Redesign | 🔴 Hard | ⚡ High | Analytics | `AnalyticsPage.tsx` (753 lines, 22 sections). `useLiveAnalytics.ts`, `useForecasting.ts`. Queries `platform_metrics`, `quarterly_reports`, telemetry tables | Design not approved. Missing: PDF export, scheduled reports, 80+ sections requested | Rebuild UI once design provided. Add PDF generation edge function. Expand sections |
| 47 | Dynamic Pricing, Subscriptions, Tiers | 🔴 Not Built | 🔴 Hard | 📌 Low | Economy | Nothing | No pricing engine, no subscription system, no buyer tiers | Create `subscriptions` table. Integrate Stripe for payments. Build pricing recommendation engine using market data from `listings` |
| 49 | Reporting, Reputation Insurance, Identity verification, Scam detection | 🟡 Partial | 🔴 Hard | ⚡ High | Trust | `help_reports` table. `disputes` + Skill Court. `profiles.id_verified` boolean | No reputation insurance, no scam pattern detection, no automated flagging | Build scam detection edge function using AI. Create `reputation_insurance` table. Automated flagging on suspicious patterns |
| 51 | Live video feed, Portfolio timelapse, Notes, Case studies, Clips | 🟡 Partial | 🔴 Hard | 📌 Low | Workspace | Video panel exists (UI only). Notes on workspace files. Portfolio JSON on profiles | No actual video streaming, no timelapse generation, no case study builder | Video: requires external service (Daily.co/LiveKit). Timelapse: edge function to stitch file version screenshots. Case study: template builder in dashboard |
| 53 | Clips with tags on clips page | 🟡 Partial | 🟠 Medium | ⚡ High | Clips | ClipsPage has category filters and tags on mock clips | No `clips` database table, no tagging system | See Req 18 — `clips` table with `tags` array column. Tag-based filtering queries |
| 55 | Post success stories based on popularity | 🟡 Partial | 🟠 Medium | 📌 Low | Community | `SuccessStoriesPage.tsx` exists with hardcoded content | No database table, no popularity tracking | Create `success_stories` table (user_id, title, content, views, featured). Admin curation flow |
| 57 | Buy gigs in Bundles, Points-only, Consultation | 🟡 Partial | 🟠 Medium | 📌 Low | Marketplace | `SPOnlyPage.tsx` exists. `enterprise_consultations` table | No bundle purchasing, consultation booking flow incomplete | Create `bundles` table. Wire consultation booking calendar. SP-only checkout flow |
| 59 | Subscription Gigs, Flash Market, Skill Rental | 🟡 Partial | 🟠 Medium | 📌 Low | Marketplace | `FlashMarketPage.tsx` with time-limited listings | No subscription gig model, no skill rental | Add `format` values for subscription/rental. Recurring escrow logic |
| 61 | AI in workspaces for image, video, chat, code | 🟡 Partial | 🟠 Medium | ⚡ High | AI | Workspace AI panel with chat. `workspace-ai` edge function | No image generation, no video AI, no code execution | Extend edge function to use Lovable AI image models. Add code sandbox panel. Video summarization |
| 63 | Stress test for 10K concurrent users | 🔴 Not Done | 🔴 Hard | 🔥 Critical | Infrastructure | 18 DB indexes, React Query caching, code splitting, abort controllers, connection pooling available | No load testing scripts, no performance benchmarks | Create k6/Artillery test scripts. Test: auth flow, marketplace browse, workspace realtime, search. Target: 10K concurrent with <500ms p95 |
| 64 | Optimizations | 🟡 Partial | 🟠 Medium | 🔥 Critical | Infrastructure | Code splitting (React.lazy on every page), React Query caching, Tailwind purging, 18 DB indexes, cursor pagination on marketplace | No CDN, no read replicas, no materialized views, no full-text search indexes | Add `pg_trgm` extension for search. Materialized views for leaderboard aggregations. Image CDN for avatars/files |
| 68 | Fingerprinting work | 🟡 Partial | 🟠 Medium | 📌 Low | Trust | `transactions.fingerprint` column, `transactions.blockchain_hash` column | No actual fingerprinting or hashing implementation | Create `fingerprint_deliverable()` function: hash file contents on submission → store in transaction. Optional: anchor hash to public blockchain |
| 69 | Gig review and rating after completion | 🟡 Partial | 🟠 Medium | 🔥 Critical | Reviews | `reviews` table (rating, quality/communication/timeliness ratings, content, response, verified). `ReviewModal.tsx` | Review submission flow after workspace completion not wired | Wire workspace "Accept Deliverable" → open ReviewModal → insert into `reviews` → update seller `profiles.rating`. Calculate new average |
| 71 | Spectating people work | 🔴 Not Built | 🔴 Hard | 📌 Low | Workspace | Nothing | No spectator mode, no live streaming | Would need read-only workspace access + optional video stream. Complex — low priority |
| 72 | Gig reports into skill court or admins | ✅ Done | — | 🔥 Critical | Trust | `help_reports` table. Workspace dispute filing → `disputes` table. Skill Court handles resolution | — | Done |
| 73 | Moderators and role access in admin dashboard | 🟡 Partial | 🟠 Medium | ⚡ High | Admin | `user_roles` enum: admin/moderator/user/enterprise. `has_role()` function | No admin dashboard UI, no moderator tools | Build admin dashboard (Req 5). Add moderator queue for flagged content. Role-gated routes |
| 74 | Role access in guilds, dashboards, workspaces | ✅ Done | — | 🔥 Critical | Roles | `guild_members.role` (leader/officer/member). `workspace_members.role` (admin/editor/viewer). Role-based UI rendering | — | Done |
| 76 | Micro Tipping, Bonus Pools, Guild Funding, Points sharing, loaning, withdrawal | 🟡 Partial | 🔴 Hard | ⚡ High | Economy | `guild_loans` with interest_rate. `guild_treasury_log`. `sp_transactions` | No UI for tipping, bonus pools, loan approval, withdrawal | Build SP transfer UI. `tip_user()` function. Guild loan request/approve flow. Bonus pool distribution on guild war win |
| 78 | Global Messenger with Translation, Voice, Photos | 🟡 Partial | 🔴 Hard | ⚡ High | Communication | Workspace messenger with translation (`translated_text`). `workspace_voice_messages` table. Voice recording UI | Global messenger (only workspace-scoped). No GIFs, no emoji picker | Create `direct_messages` table + `dm_channels` table. Build `src/features/messages/DirectMessagesPage.tsx`. Reuse workspace chat components. Add emoji/GIF picker library |
| 80 | Gig Shared File storage with access perms and notes | ✅ Done | — | ⚡ High | Workspace | `workspace_files` table (file_name, url, size, type, version, access_level, tags, description). `workspace-files` storage bucket. Upload/download in workspace | — | Done |
| 81 | Plagiarism checks, quality AI/human, expert reviews, version comparison, delivery standards | 🟡 Partial | 🔴 Hard | ⚡ High | AI/Quality | AI quality scoring (`ai_quality_score`, `ai_feedback`). `workspace_deliverables` with requirements, revision_count | No plagiarism detection, no human expert review marketplace, no version diff | Plagiarism: edge function using AI to compare submissions. Expert review: create `expert_reviews` table + marketplace for hiring reviewers. Version diff: file comparison UI |
| 83 | Wraps, Timelines, Lifetime Tiers, Milestone Celebrations | 🟡 Partial | 🟠 Medium | 📌 Low | Gamification | `profiles.tier` (Bronze-Diamond). `leaderboard_achievements`. `quarterly_reports` table | No yearly wrap generation, no milestone celebration UI, no timeline view | Create wrap generation edge function (quarterly cron). Build `src/features/history/HistoryPage.tsx` with timeline, wraps, milestones |
| 84 | Mods, Automated flags, Fake detection, Content moderation queue, Appeals | 🔴 Not Built | 🔴 Hard | ⚡ High | Moderation | Nothing beyond `user_roles` | No moderation queue, no automated flagging, no fake detection | Create `moderation_queue` table. AI-based content scanning edge function. Appeal flow extending Skill Court. Admin dashboard integration |
| 86 | Gig filters, Search, Recommendations | ✅ Done | — | 🔥 Critical | Marketplace | `MarketplaceSidebar.tsx` — category, ELO range, verified, delivery days, SP range. Search by title/description. Sort by Trending/Newest/Price. `useMarketplaceData.ts` queries with all filters | AI-powered recommendations missing | Add recommendation engine: edge function using user history + skill matching to suggest gigs |
| 88 | Test Suite | 🟡 Partial | 🟠 Medium | 🔥 Critical | Infrastructure | vitest configured. 5 test files, ~15 tests. `Footer.test`, `Navbar.test`, `email-validation.test`, `utils.test`, `routes.test` | ~0% meaningful coverage. No integration tests, no E2E, no API tests | Expand unit tests per feature. Add integration tests for auth flow, SP transfer, workspace creation. E2E with Playwright for critical paths |
| 90 | Email Verification, Uni badges | 🟡 Partial | 🟢 Easy | 🔥 Critical | Auth | `config.toml` has `enable_confirmations = false`. `profiles.university` field. `profiles.id_verified` | Email verification DISABLED. No university badge system | Enable email confirmations in config. Create `university_badges` table with partner unis. Verify .edu email domains |
| 92 | Main dashboard (buyer + seller) | 🎨 Needs Redesign | 🟠 Medium | 🔥 Critical | Dashboard | Same as Req 4. Full dashboard with Overview/Gigs/Create/Court/Guilds/Wallet/Analytics/Settings | Design not approved. Missing: order history, tax breakdown, bid tracking | Rebuild UI once design provided. Add order lifecycle tracking. SP ledger view with tax details |
| 94 | Guild pages | 🎨 Needs Redesign | 🟠 Medium | ⚡ High | Guilds | `GuildPage.tsx`, `BrowseGuildsPage.tsx`, `GuildDashboardPage.tsx`. Browse queries live data | Design not approved | Rebuild UI once design provided |
| 95 | Unlock swapping formats progressively | 🔴 Not Built | 🟠 Medium | 📌 Low | Gamification | All formats available to all users | No progression gating | Add `format_access` logic: check `profiles.tier` before allowing format use. Bronze=Direct only, Silver=+Co-Creation, Gold=+Projects, etc. |
| 96 | Workspace: messenger, video feed, whiteboard, status, settings | ✅ Done | — | 🔥 Critical | Workspace | `WorkspacePage.tsx` (1,390 lines). 15 panels: chat, whiteboard, video, files, stages, escrow, submit, dispute, settings, members, ai, bids, team, kanban, deadline | Whiteboard/video are placeholders (see Req 7) | See Req 7 for whiteboard + video |
| 97 | Submit deliverable at end | ✅ Done | — | 🔥 Critical | Workspace | Submit panel — title, description, requirements checklist, file attachments. `workspace_deliverables` table | — | Done |
| 98 | Revisions recorded | ✅ Done | — | 🔥 Critical | Workspace | `workspace_deliverables.revision_count` and `max_revisions` columns | Approve/request revision UI flow could be clearer | Add explicit "Request Revision" button on buyer side with reason field |
| 99 | Pre-specify revision requests | 🟡 Partial | 🟢 Easy | ⚡ High | Workspace | Requirements can be added to deliverables. Max revisions configurable | No pre-specified revision templates | Add revision template builder in gig creation (Req 92 dashboard). Store as JSON on listing |
| 100 | Automatic evidence submission in Skill Court | 🟡 Partial | 🟠 Medium | ⚡ High | Court | Evidence submission form in SkillCourtTab. `case_evidence` table | No automatic evidence collection (time tracking, activity logs) | On dispute filing: auto-attach `workspace_messages`, `workspace_files`, `workspace_stages` data as evidence entries. Log time spent viewing evidence |
| 101 | Guild menu: settings, treasury, messenger, requests, invites, lending, roles | 🟡 Partial | 🟠 Medium | ⚡ High | Guilds | `GuildDashboardPage.tsx`. Treasury/loans tables exist | Most guild management UI is mock. No invitation flow, no lending UI | Wire treasury panel to `guild_treasury_log`. Build loan request/approve flow. Add guild messenger (reuse workspace chat components) |
| 102 | Leaderboard with real-time data and badges | 🎨 Needs Redesign | 🟠 Medium | ⚡ High | Gamification | `LeaderboardPage.tsx` (679 lines, 7 tabs). Queries `profiles`, `guilds`, `guild_members`. `leaderboard_achievements`, `ranking_history` tables | Design not approved | Rebuild UI once design provided. Backend fully wired |
| 103 | Full help center, knowledge base, docs, chatbot, forums, blog, success stories, certifications | 🎨 Needs Redesign | 🟠 Medium | ⚡ High | Help | `HelpPage.tsx` — knowledge base, status, bug bounty, reports (DB wired). AI chatbot (LiveChatWidget). Forums + Blog (DB wired). SuccessStories (hardcoded) | Design not approved. Missing: phone/email premium support, certifications page | Rebuild UI. Add success stories backend (Req 128). Build certifications page |
| 105 | Featured listing, Profile highlighting (subscription-based) | 🟡 Partial | 🟠 Medium | 📌 Low | Economy | `listings.hot` boolean. `blog_posts.is_featured` | No subscription-based featuring, no profile highlighting | Add `is_featured` to listings with expiry. Profile highlight CSS variant for Pro subscribers |
| 106 | Social Media and Payment processors | 🔴 Not Built | 🔴 Hard | 📌 Low | Payments | Social links on profiles (display only) | No Stripe, PayPal, payment integration | Integrate Stripe via edge function. Social OAuth (Google/GitHub login). Social sharing APIs |
| 107 | Currency conversion and regional payment | 🔴 Not Built | 🔴 Hard | 📌 Low | Payments | Nothing | Nothing | Requires payment processor first (Req 106). Currency conversion API. Regional payment method support |
| 108 | Matching on timezones, availability, ratings | 🟡 Partial | 🟠 Medium | ⚡ High | Marketplace | `profiles.timezone`, `profiles.availability`, `profiles.response_time` columns exist | No matching algorithm | Build matching edge function: score potential matches by timezone overlap, availability alignment, ELO compatibility. Surface in marketplace recommendations |
| 110 | Marketplace search by category/trending/curated + like/follow system + verification | 🟡 Partial | 🟠 Medium | ⚡ High | Marketplace | Category filtering done. Trending sort (by views). Hot flag for popular | No curated/recommended. No like system. No follow system. No profile verification flow | Create `user_follows` table. `listing_likes` table. Curation: admin-flagged featured. Verification: ID upload + admin approval flow |
| 112 | Newsletter, Email campaigns, Surveys | 🟡 Partial | 🟠 Medium | 📌 Low | Communication | `newsletter_subscriptions` table. Footer newsletter signup | No email campaign system, no survey system | Integrate email service (Resend/SendGrid via edge function). Create `surveys` table + survey builder |
| 113 | Automatic Snapshots, backups, restores | 🟡 Partial | 🟠 Medium | 📌 Low | Infrastructure | Supabase provides automatic backups at infra level | No application-level snapshot/restore UI | Document backup procedures. Create manual snapshot edge function for critical data |
| 114 | Password reset, account deletion, recovery, data export | 🟡 Partial | 🟢 Easy | ⚡ High | Auth | Supabase Auth handles password reset natively | No account deletion UI, no data export UI | Add "Delete Account" button in settings → `supabase.auth.admin.deleteUser()`. Data export: edge function to compile user data as JSON/CSV download |
| 116 | Refunds, Chargebacks, Invoices, Tax forms, Analytics (revenue/growth/retention/cohort/funnel), Data viz, Scheduled reports, Real-time dashboards | 🟡 Partial | 🔴 Hard | ⚡ High | Analytics | Analytics page has revenue sections, growth charts, retention heatmap, funnel viz, cohort analysis, forecasting. `quarterly_reports` table | No refunds (no payment system). No invoices. No tax forms. No PDF export. No scheduled reports | Requires payment system first (Req 106). Invoice generation edge function. PDF report generation. Cron job for scheduled reports |
| 118 | Log everything + Enterprise mode + Migration readiness | 🟡 Partial | 🟠 Medium | 🔥 Critical | Infrastructure | **Logging**: `activity_log`, `page_sessions`, `click_heatmap`, `error_log`, `search_analytics`, `funnel_events` tables. 200+ data points per session. **Enterprise**: `EnterprisePage.tsx`, `EnterpriseDashboardPage.tsx`, 5 enterprise tables, demo booking + quotes wired. **Migration**: `MIGRATION.md` with full guide. Standard Supabase SDK. All SQL in migrations. Only Lovable dep: `@lovable.dev/cloud-auth-js` with fallback | Enterprise hiring pipeline not functional. Some logging gaps | Expand telemetry to capture all file uploads, messages, gig actions. Wire enterprise candidate pipeline |
| 119 | Remake: Marketplace, Dashboard, Profiles, User/Guild search, Workspaces | 🎨 Needs Redesign | 🔴 Hard | 🔥 Critical | Design | All pages exist and are functional with backend wiring | Design not approved — user will provide new designs | Full UI rebuild of: `MarketplacePage.tsx` + all sub-pages, `DashboardPage.tsx`, `ProfilePage.tsx`, `BrowseUsersPage.tsx`, `BrowseGuildsPage.tsx`, `WorkspacePage.tsx`. Keep all backend logic |
| 120 | Clips algorithm with tags and prefetch | 🟡 Partial | 🟠 Medium | ⚡ High | Clips | TikTok scroll UI. Mock clips with gradients. Randomized order | No real algorithm, no prefetch, no DB | See Req 18. Add prefetch: load next 3 clips ahead. Algorithm: score by recency, views, user skill match. Tag-based filtering from `clips.tags` |
| 121 | Check backend wiring, buttons, search bars, operations/help/roadmap | 🟡 Partial | 🟠 Medium | 🔥 Critical | QA | Most pages wired. Known issues: proposal modal doesn't create workspace, auction bids have no submission endpoint | Dead-end buttons on proposals and bids | Wire ProposalModal submit → workspace creation. Wire bid placement. Audit all CTAs across all pages |
| 122 | Remake Analytics page (80+ sections, PDFs, monthly reports) | 🎨 Needs Redesign | 🔴 Hard | ⚡ High | Analytics | 22 sections exist. Charts, heatmaps, funnels, forecasting | Design not approved. Missing PDF generation, scheduled reports, 60+ more sections | Rebuild UI. PDF: edge function with html-to-pdf. Monthly: cron + email delivery |
| 123 | Remake Leaderboard + backend | 🎨 Needs Redesign | 🟠 Medium | ⚡ High | Gamification | 7-tab leaderboard reading live data | Design not approved | Rebuild UI once design provided. Backend fully wired |
| 124 | Remake Events (functional + backend) | 🎨 Needs Redesign | 🟠 Medium | ⚡ High | Community | `events`, `event_registrations`, `tournaments` tables. `EventsPage.tsx` queries DB | Design not approved | Rebuild UI. Add event creation form. Tournament bracket system |
| 125 | Check for dummy links on all pages | 🟡 Partial | 🟢 Easy | 🔥 Critical | QA | Most internal nav uses React Router `Link`. Known: social media links (# hrefs), some CTAs → `/coming-soon` | Systematic audit not done | Run codebase search for `href="#"` and `/coming-soon`. Replace with real routes or remove. Audit every page manually |
| 126 | Mobile-first design plan | ✅ Done | — | ⚡ High | Mobile | `MobileBottomNav.tsx`. Responsive layouts. ClipsPage immersive mobile. `useIsMobile()` hook | Not a native app | Plan documented. PWA enhancements possible |
| 127 | Enhance Blog and Forums + backend | 🎨 Needs Redesign | 🟠 Medium | ⚡ High | Community | Blog: `blog_posts`, `blog_comments`, `blog_likes` — CRUD wired. Forums: `forum_categories`, `forum_threads`, `forum_comments`, `forum_votes` — wired | Design not approved. Missing: rich text editor, image uploads, pinning/moderation | Rebuild UI. Add TipTap/ProseMirror editor. Image upload to storage bucket. Admin pin/lock controls |
| 128 | Backend for success stories | 🔴 Not Built | 🟠 Medium | ⚡ High | Community | `SuccessStoriesPage.tsx` with hardcoded content | No `success_stories` table | Create `success_stories` table (user_id, title, content, cover_image, metrics JSON, is_featured, created_at). Seed with existing hardcoded data. Admin curation panel |
| 129 | Core functionality: order lifecycle | 🔴 Not Built | 🔴 Hard | 🔥 Critical | Core | Proposals exist but don't trigger workspace creation. No SP transfer on completion. Review submission not linked | Complete order lifecycle: Browse → Propose → Accept → Workspace → Deliver → Review → Pay | Create `orders` table (listing_id, buyer_id, seller_id, status, workspace_id). `accept_proposal()` function: create order + workspace + escrow + members. `complete_order()`: trigger review + SP transfer + transaction code. This is THE critical missing piece |
| 130 | Connectors and MCP servers for workspaces | 🔴 Not Built | 🔴 Hard | 📌 Low | Infrastructure | Nothing | No third-party API connectors, no MCP | Evaluate MCP integration for workspace AI. Add connector framework for GitHub, Figma, etc. Premium feature |

---

## Priority Summary

### 🔥 Critical (Must ship for launch) — 20 items
| # | Requirement | Status |
|---|------------|--------|
| 1 | Signup + onboarding | ✅ Done |
| 2 | Starting SP rewards | 🟡 Needs trigger |
| 3 | SP economy + tax | 🟡 Needs transfer function |
| 4 | User dashboard | 🎨 Awaiting design |
| 21 | Multiple formats | ✅ Done |
| 22 | Skill Court | ✅ Done |
| 25 | ELO Rating | 🟡 Needs calc engine |
| 28 | Transaction verification | ✅ Done |
| 29 | Multi-stage escrow | ✅ Done |
| 63 | 10K stress test | 🔴 Not done |
| 64 | Optimizations | 🟡 Partial |
| 69 | Reviews/ratings | 🟡 Needs wiring |
| 72 | Gig reports | ✅ Done |
| 74 | Role access | ✅ Done |
| 86 | Search/filters | ✅ Done |
| 88 | Test suite | 🟡 Minimal |
| 90 | Email verification | 🟡 Disabled |
| 92 | Main dashboard | 🎨 Awaiting design |
| 96 | Workspace | ✅ Done |
| 97 | Submit deliverable | ✅ Done |
| 98 | Revisions | ✅ Done |
| 118 | Logging/enterprise/migration | 🟡 Partial |
| 119 | Redesign core pages | 🎨 Awaiting design |
| 121 | Backend wiring audit | 🟡 Partial |
| 125 | Dummy link audit | 🟡 Not done |
| 129 | Core order lifecycle | 🔴 Not built |

### ⚡ High (Important for good launch) — 35 items
See table above for all items marked ⚡ High.

### 📌 Low (Post-launch) — 15 items
See table above for all items marked 📌 Low.

---

## Difficulty Summary

### 🟢 Easy (1-2 sessions) — 8 items
Reqs: 2, 19, 90, 99, 114, 125, 126 + parts of 1

### 🟠 Medium (2-4 sessions) — 35 items
Reqs: 3, 4, 5, 6, 12, 14, 15, 16, 18-parts, 24, 25, 35, 41, 43, 45-parts, 53, 55, 57, 59, 61, 64, 68, 69, 73, 83, 88, 92, 94, 95, 100, 101, 102, 108, 110, 112, 113, 116-parts, 120, 121, 122-parts, 123, 124, 127, 128

### 🔴 Hard (4+ sessions) — 22 items
Reqs: 5, 7, 10, 11, 18, 31, 37, 45, 47, 49, 51, 63, 76, 78, 81, 84, 106, 107, 116, 119, 129, 130

---

## Redesign Queue (Awaiting User Design)
These items are functionally built but need UI rebuild once design is provided:

| # | Page | Current File | Lines |
|---|------|-------------|-------|
| 4/92 | Dashboard | `src/features/dashboard/DashboardPage.tsx` | 1,124 |
| 6 | Profile | `src/features/profile/ProfilePage.tsx` | 674 |
| 45/122 | Analytics | `src/features/analytics/AnalyticsPage.tsx` | 753 |
| 94 | Guild Pages | `src/features/guild/GuildPage.tsx` + 2 more | ~600 |
| 102/123 | Leaderboard | `src/features/leaderboard/LeaderboardPage.tsx` | 679 |
| 103 | Help Center | `src/features/help/HelpPage.tsx` | ~500 |
| 119 | Marketplace | `src/features/marketplace/MarketplacePage.tsx` + 7 sub-pages | ~2,000 |
| 119 | Workspaces | `src/features/workspace/WorkspacePage.tsx` | 1,390 |
| 119 | Browse Users/Guilds | `src/features/users/BrowseUsersPage.tsx` + guilds | ~400 |
| 124 | Events | `src/features/events/EventsPage.tsx` | ~500 |
| 127 | Blog + Forums | `src/features/blog/BlogPage.tsx` + `ForumsPage.tsx` | ~800 |

---

## Execution Order (Recommended)

### Phase 1: Core Engine (Before any redesign)
1. **Req 129**: Order lifecycle (`orders` table, `accept_proposal()`, `complete_order()`)
2. **Req 3**: SP transfer function with tax
3. **Req 2**: SP signup bonus trigger
4. **Req 25**: ELO calculation engine
5. **Req 69**: Wire reviews after completion
6. **Req 90**: Enable email verification
7. **Req 16**: Stage-based SP release automation

### Phase 2: Backend Completion
8. **Req 35**: Auction bid submission
9. **Req 18/53/120**: Clips backend (table, upload, algorithm)
10. **Req 43**: Achievement/streak triggers
11. **Req 19**: Badge automation
12. **Req 100**: Auto evidence in court
13. **Req 14/101**: Guild CRUD + management
14. **Req 128**: Success stories backend
15. **Req 121**: Full backend wiring audit + fix dead buttons
16. **Req 125**: Dummy link audit

### Phase 3: Redesign (After user provides designs)
17. **Req 119**: Marketplace, Dashboard, Profiles, Workspaces
18. **Req 102/123**: Leaderboard
19. **Req 45/122**: Analytics
20. **Req 124**: Events
21. **Req 127**: Blog + Forums
22. **Req 94**: Guild pages
23. **Req 103**: Help center

### Phase 4: Advanced Features
24. **Req 5/73**: Admin dashboard + moderator tools
25. **Req 78**: Global messenger
26. **Req 84**: Automated moderation
27. **Req 76**: Tipping, lending, bonus pools
28. **Req 110**: Like/follow system
29. **Req 108**: Smart matching

### Phase 5: Infrastructure & Scale
30. **Req 63**: Stress testing
31. **Req 64**: Optimizations (materialized views, FTS indexes)
32. **Req 88**: Comprehensive test suite
33. **Req 114**: Account deletion + data export
34. **Req 113**: Backup documentation

### Phase 6: Post-Launch
35. **Req 47**: Dynamic pricing + subscriptions
36. **Req 106/107**: Payment processors + currency
37. **Req 37**: LinkedIn-style network
38. **Req 10/11**: Skill Academy + tutors
39. **Req 130**: MCP/connectors
40. **Req 71**: Spectating
41. **Req 51**: Video feed + timelapse
