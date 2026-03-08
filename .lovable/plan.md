

## Plan: Comprehensive Platform-Wide Analytics & Telemetry System

### What We're Building

A deep telemetry layer that automatically tracks everything: page visits with time-on-page, scroll depth heatmaps, click coordinates, mouse movement patterns, session journeys, rage clicks, idle time, tab visibility, copy/paste events, link clicks, error tracking, performance metrics, and more -- all persisted to dedicated database tables.

### Database Changes (1 migration)

Create 3 new tables:

1. **`page_sessions`** -- Per-page visit with timing
   - `id`, `session_id` (text), `user_id` (nullable), `page_path`, `page_title`, `entered_at`, `exited_at`, `duration_seconds`, `scroll_depth_max` (int 0-100), `scroll_depth_avg`, `clicks_count`, `rage_clicks_count`, `mouse_distance_px`, `keypresses_count`, `visibility_hidden_seconds`, `idle_seconds`, `metadata` (jsonb)
   - RLS: anyone can INSERT (with user_id check like activity_log), admins can SELECT

2. **`click_heatmap`** -- Every click with coordinates for heatmap rendering
   - `id`, `session_id`, `user_id` (nullable), `page_path`, `x_percent` (numeric), `y_percent` (numeric), `element_tag`, `element_id`, `element_class`, `element_text` (first 50 chars), `timestamp`
   - RLS: anyone INSERT, admins SELECT

3. **`error_log`** -- JS errors, unhandled rejections, network failures
   - `id`, `session_id`, `user_id` (nullable), `page_path`, `error_type` (text: 'js_error'|'unhandled_rejection'|'network_error'|'console_error'), `message`, `stack`, `metadata` (jsonb), `created_at`
   - RLS: anyone INSERT, admins SELECT

### New File: `src/lib/telemetry.ts`

A self-contained telemetry engine that auto-initializes. Key trackers:

- **Session Manager**: Generates a `session_id` (stored in sessionStorage), tracks pages visited count, session start time
- **Page Session Tracker**: On route change, records enter time. On leave (route change or unload), flushes `page_sessions` row with duration, scroll depth, click count, etc.
- **Scroll Tracker**: Listens to scroll events (throttled), records max and average scroll depth percentage
- **Click Tracker**: On every click, logs to `click_heatmap` with x/y as percentage of viewport, target element info. Also detects rage clicks (3+ clicks within 800ms on same area)
- **Mouse Tracker**: Tracks cumulative mouse distance moved (sampled every 100ms)
- **Idle Tracker**: Resets on any input event. After 30s of no input, counts as idle time
- **Visibility Tracker**: Uses `document.visibilitychange` to track time tab is hidden
- **Error Tracker**: `window.onerror`, `unhandledrejection`, and monkey-patches `console.error` to log to `error_log`
- **Interaction Trackers**: Copy/paste, text selection, right-click, form focus/blur, external link clicks, scroll direction changes
- **Performance Tracker**: Web Vitals (LCP, FID, CLS, TTFB, INP) via PerformanceObserver
- **Engagement Score**: Computed per page session = weighted formula of scroll depth, clicks, time, mouse movement

### New Component: `src/components/shared/TelemetryProvider.tsx`

A React component placed in App.tsx that:
- Initializes the telemetry engine on mount
- Listens to route changes via `useLocation()` to trigger page session start/end
- Flushes data on `beforeunload` using `navigator.sendBeacon`
- Batches `click_heatmap` inserts (every 5 seconds or 20 clicks, whichever first)

### Enhanced `activity-logger.ts`

Add new convenience functions:
- `logSearch(query, results_count, page)` -- for any search action
- `logError(error, context)` -- wraps error_log insertion
- `logNavigation(from, to, method)` -- tracks navigation patterns (link click vs back button vs direct)
- `logCopy(text_length, page)` -- copy events
- `logExternalLink(url, page)` -- outbound link tracking

### App.tsx Integration

Add `<TelemetryProvider />` inside `<BrowserRouter>` so it has access to router context. Runs silently, zero UI impact.

### What Gets Logged (100+ data points per session)

**Per page visit**: duration, scroll depth (max/avg), clicks, rage clicks, mouse distance, keypresses, idle time, tab-hidden time, engagement score, entry/exit timestamps

**Per click**: x/y coordinates (% of page), element tag/id/class/text, timestamp, session context

**Per error**: type, message, stack trace, page context, session info

**Per session (in metadata)**: total pages visited, session duration, pages sequence, device fingerprint, referrer chain, performance vitals (LCP, CLS, FID, TTFB)

**Behavioral signals**: Rage clicks, dead clicks (click on non-interactive element), excessive scrolling, rapid page bounces, form abandonment (focus then navigate away without submit)

### Technical Details

- All DB writes use `navigator.sendBeacon` fallback on page unload to prevent data loss
- Click heatmap uses batched inserts to minimize DB calls
- Scroll listener is throttled to 200ms
- Mouse distance sampling at 100ms intervals
- Session ID persists across page navigations but resets on new tab/window
- All operations are wrapped in try/catch -- telemetry never breaks the app
- Total bundle size impact: ~4KB gzipped

