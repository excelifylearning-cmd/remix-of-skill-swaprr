

# Analytics Dashboard Complete Redesign + Demo Data Cleanup Plan

## Current State

### Database
- **Transactions**: 1 demo record (`TXN-2026-0305-AK7B`) with extensive mock seller/buyer/quality data
- **Quarterly Reports**: 4 records (Q1-Q4 2026) with proper structure — these are *platform projections* and should stay
- **Platform Metrics**: 1 comprehensive record with economy health, retention data, etc. — should stay

### Current Analytics Page (651 lines)
The page has 13 sections but lacks the depth needed for enterprise-grade forecasting:
1. Hero
2. Live Stats (8 cards)
3. Quarterly Selector + KPIs
4. Growth Chart (users/gigs)
5. Format Distribution
6. Economy Health Monitor
7. Revenue Breakdown
8. Retention & Engagement
9. Content Metrics
10. Platform Uptime
11. Community Impact
12. Hall of Fame
13. Telemetry Dashboard

**Problems:**
- Limited forecasting (only 4 quarters shown, no projection modeling)
- No revenue forecasting, no market analysis
- No cohort analysis visualization
- No funnel tracking visualization
- No real-time activity feed
- No geographic/demographic breakdowns
- No AI-powered insights section
- Missing: LTV projections, CAC metrics, burn rate, runway

---

## Phase 1: Database Cleanup (Migration)

**Delete demo transaction data:**
```sql
DELETE FROM transactions WHERE code = 'TXN-2026-0305-AK7B';
```

---

## Phase 2: Complete Analytics Page Redesign (20+ Sections)

### New Section Structure

| # | Section | Description |
|---|---------|-------------|
| 1 | **Command Center Hero** | Live pulse indicator, data freshness timestamp, quick metric summary |
| 2 | **Real-Time Activity Feed** | Scrolling feed of live platform events (signups, gigs, transactions) |
| 3 | **Executive Summary Cards** | 12-16 KPI cards: Users, Gigs, SP, Revenue, Guilds, NPS, Churn, CAC, LTV |
| 4 | **Revenue Intelligence** | MRR/ARR tracking, revenue by source, forecasted vs actual, growth rate |
| 5 | **User Acquisition Funnel** | Visit → Signup → First Gig → Repeat → Power User visualization |
| 6 | **Growth Forecasting** | 12-month projection with confidence intervals, scenario modeling (bear/bull/base) |
| 7 | **Quarterly Deep Dive** | Enhanced quarterly selector with expandable month-by-month breakdown |
| 8 | **Cohort Retention Matrix** | Visual heatmap of retention by signup month (D1, D7, D30, D60, D90) |
| 9 | **Geographic Distribution** | World map or regional breakdown of users, revenue, gig volume |
| 10 | **Skill Economy Dashboard** | SP velocity, inflation index, mint rate, burn rate, treasury health |
| 11 | **Marketplace Health** | Gig formats distribution, average pricing, time-to-match, fill rates |
| 12 | **Guild Analytics** | Guild growth, war stats, treasury health, top performers |
| 13 | **University Network** | University adoption, student engagement, partnership pipeline |
| 14 | **Enterprise Metrics** | Enterprise client health, expansion revenue, contract values |
| 15 | **Content & Engagement** | Messages, files, video calls, workspace activity heatmap |
| 16 | **Platform Performance** | Uptime SLA, response times, error rates, infrastructure metrics |
| 17 | **AI Quality Metrics** | Skill Court accuracy, match quality, fraud detection rates |
| 18 | **Behavioral Analytics** | Session duration, page depth, click patterns, rage/dead clicks |
| 19 | **Revenue Forecasting Model** | LTV projections, CAC payback period, runway calculator |
| 20 | **Comparative Benchmarks** | Quarter-over-quarter, year-over-year, vs industry benchmarks |
| 21 | **Risk & Compliance** | Dispute rates, fraud attempts, compliance status, security score |
| 22 | **Hall of Fame & Milestones** | Top users, guilds, recent platform milestones |
| 23 | **Data Export & Reporting** | Download CSV/PDF, schedule reports, API access status |

### Design System

**Visual Language:**
- Dark professional theme with data visualization focus
- Recharts for all charts (already installed)
- Consistent card system with subtle borders
- Animated number counters for key metrics
- Color coding: Green (healthy), Gold (warning), Red (critical)
- Monospace fonts for all numbers
- Subtle gradients for premium sections

**Layout:**
- Full-width hero with command center aesthetic
- 12-column grid system for flexible layouts
- Sticky section navigation sidebar on desktop
- Collapsible sections for mobile
- Smooth scroll animations

### Key Technical Components

1. **useLiveAnalytics hook** — Real-time subscription to activity
2. **ForecastChart** — Recharts area chart with confidence bands
3. **RetentionHeatmap** — Color-coded cohort matrix
4. **FunnelVisualization** — Horizontal funnel with conversion rates
5. **MetricCard** — Reusable KPI card with trend indicator
6. **SectionNav** — Sticky sidebar for quick navigation
7. **DataExportButton** — CSV/PDF generation

### Data Sources

All data will pull from existing tables:
- `platform_metrics` — Core KPIs
- `quarterly_reports` — Quarterly data
- `page_sessions` — Telemetry
- `click_heatmap` — Behavioral data
- `error_log` — Error tracking
- `funnel_events` — Conversion tracking
- `guilds`, `profiles`, `transactions` — Aggregated counts

---

## Summary

| Task | Impact |
|------|--------|
| Delete 1 demo transaction | Removes fake transaction lookup data |
| Redesign Analytics to 23 sections | Enterprise-grade forecasting dashboard |
| Add 7 new visualization components | Professional data presentation |
| Real-time activity feed | Live platform pulse |
| Revenue forecasting model | LTV, CAC, runway projections |
| Behavioral analytics integration | Full telemetry visualization |

**File Changes:**
- 1 migration (delete demo transaction)
- Complete rewrite of `AnalyticsPage.tsx` (~1500 lines)
- New hooks: `useLiveAnalytics.ts`, `useForecasting.ts`
- New components: `ForecastChart.tsx`, `RetentionHeatmap.tsx`, `FunnelVisualization.tsx`

