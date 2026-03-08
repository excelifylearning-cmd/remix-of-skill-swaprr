import { supabase } from "@/integrations/supabase/client";

// ============================================================
// TELEMETRY ENGINE — Platform-wide behavioral analytics
// Tracks: page sessions, scroll depth, clicks, mouse movement,
// rage clicks, idle time, tab visibility, errors, performance
// ============================================================

const SCROLL_THROTTLE = 200;
const MOUSE_SAMPLE_INTERVAL = 100;
const IDLE_THRESHOLD = 30_000; // 30s
const RAGE_CLICK_THRESHOLD = 3;
const RAGE_CLICK_WINDOW = 800;
const CLICK_BATCH_SIZE = 20;
const CLICK_FLUSH_INTERVAL = 5_000;

// ---------- Session ----------
let sessionId: string;
let userId: string | null = null;
let sessionStartTime: number;
let pagesVisited: string[] = [];

const getSessionId = (): string => {
  if (sessionId) return sessionId;
  let stored = sessionStorage.getItem("_telemetry_sid");
  if (!stored) {
    stored = crypto.randomUUID();
    sessionStorage.setItem("_telemetry_sid", stored);
  }
  sessionId = stored;
  sessionStartTime = Date.now();
  return sessionId;
};

// ---------- Page Session State ----------
let currentPagePath = "";
let currentPageTitle = "";
let pageEnterTime = 0;
let scrollDepthMax = 0;
let scrollDepthSamples: number[] = [];
let clicksCount = 0;
let rageClicksCount = 0;
let mouseDistance = 0;
let keypressesCount = 0;
let visibilityHiddenStart: number | null = null;
let visibilityHiddenTotal = 0;
let idleStart: number | null = null;
let idleTotal = 0;
let lastActivityTime = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let mouseTrackerInterval: ReturnType<typeof setInterval> | null = null;
let pendingMouseX = 0;
let pendingMouseY = 0;

// ---------- Click tracking ----------
let clickBuffer: Array<{
  session_id: string;
  user_id: string | null;
  page_path: string;
  x_percent: number;
  y_percent: number;
  element_tag: string | null;
  element_id: string | null;
  element_class: string | null;
  element_text: string | null;
  is_rage_click: boolean;
  is_dead_click: boolean;
}> = [];
let clickFlushTimer: ReturnType<typeof setInterval> | null = null;

// Rage click detection
let recentClicks: { time: number; x: number; y: number }[] = [];

// ---------- Performance Vitals ----------
let performanceVitals: Record<string, number> = {};

// ---------- Interaction counters ----------
let copyCount = 0;
let pasteCount = 0;
let rightClickCount = 0;
let textSelections = 0;
let scrollDirectionChanges = 0;
let lastScrollTop = 0;
let lastScrollDirection: "up" | "down" | null = null;
let externalLinkClicks = 0;
let formFocusCount = 0;
let deadClicks = 0;

// ============================================================
// FLUSH: Page Session → DB
// ============================================================
const flushPageSession = async () => {
  if (!currentPagePath || !pageEnterTime) return;
  const now = Date.now();
  const durationMs = now - pageEnterTime;
  const durationSec = Math.round(durationMs / 1000);

  // Check idle
  if (idleStart) {
    idleTotal += now - idleStart;
    idleStart = null;
  }
  // Check visibility
  if (visibilityHiddenStart) {
    visibilityHiddenTotal += now - visibilityHiddenStart;
    visibilityHiddenStart = null;
  }

  const scrollAvg = scrollDepthSamples.length > 0
    ? Math.round(scrollDepthSamples.reduce((a, b) => a + b, 0) / scrollDepthSamples.length)
    : 0;

  // Engagement score: weighted formula (0–100)
  const engagement = Math.min(100, Math.round(
    (Math.min(durationSec, 300) / 300) * 25 +
    (scrollDepthMax / 100) * 25 +
    (Math.min(clicksCount, 20) / 20) * 20 +
    (Math.min(mouseDistance, 50000) / 50000) * 15 +
    (Math.min(keypressesCount, 50) / 50) * 15
  ));

  const payload = {
    session_id: getSessionId(),
    user_id: userId,
    page_path: currentPagePath,
    page_title: currentPageTitle,
    entered_at: new Date(pageEnterTime).toISOString(),
    exited_at: new Date(now).toISOString(),
    duration_seconds: durationSec,
    scroll_depth_max: scrollDepthMax,
    scroll_depth_avg: scrollAvg,
    clicks_count: clicksCount,
    rage_clicks_count: rageClicksCount,
    mouse_distance_px: Math.round(mouseDistance),
    keypresses_count: keypressesCount,
    visibility_hidden_seconds: Math.round(visibilityHiddenTotal / 1000),
    idle_seconds: Math.round(idleTotal / 1000),
    engagement_score: engagement,
    metadata: {
      copy_count: copyCount,
      paste_count: pasteCount,
      right_click_count: rightClickCount,
      text_selections: textSelections,
      scroll_direction_changes: scrollDirectionChanges,
      external_link_clicks: externalLinkClicks,
      form_focus_count: formFocusCount,
      dead_clicks: deadClicks,
      performance_vitals: performanceVitals,
      referrer: document.referrer || null,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      user_agent: navigator.userAgent,
      language: navigator.language,
      connection_type: (navigator as any)?.connection?.effectiveType || null,
      pages_in_session: pagesVisited.length,
    },
  };

  try {
    await supabase.from("page_sessions").insert(payload);
  } catch (e) {
    console.warn("[telemetry] flush page session failed:", e);
  }

  // Flush remaining clicks
  await flushClickBuffer();
};

// ============================================================
// FLUSH: Click buffer → DB
// ============================================================
const flushClickBuffer = async () => {
  if (clickBuffer.length === 0) return;
  const batch = [...clickBuffer];
  clickBuffer = [];
  try {
    await supabase.from("click_heatmap").insert(batch);
  } catch (e) {
    console.warn("[telemetry] flush clicks failed:", e);
  }
};

// ============================================================
// RESET page-level counters
// ============================================================
const resetPageCounters = () => {
  scrollDepthMax = 0;
  scrollDepthSamples = [];
  clicksCount = 0;
  rageClicksCount = 0;
  mouseDistance = 0;
  keypressesCount = 0;
  visibilityHiddenStart = null;
  visibilityHiddenTotal = 0;
  idleStart = null;
  idleTotal = 0;
  lastActivityTime = Date.now();
  recentClicks = [];
  copyCount = 0;
  pasteCount = 0;
  rightClickCount = 0;
  textSelections = 0;
  scrollDirectionChanges = 0;
  lastScrollDirection = null;
  externalLinkClicks = 0;
  formFocusCount = 0;
  deadClicks = 0;
};

// ============================================================
// EVENT HANDLERS
// ============================================================

const onScroll = () => {
  const scrollTop = window.scrollY;
  const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const depth = Math.min(100, Math.round((scrollTop / docHeight) * 100));
  scrollDepthMax = Math.max(scrollDepthMax, depth);
  scrollDepthSamples.push(depth);

  // Direction changes
  const dir = scrollTop > lastScrollTop ? "down" : "up";
  if (lastScrollDirection && dir !== lastScrollDirection) scrollDirectionChanges++;
  lastScrollDirection = dir;
  lastScrollTop = scrollTop;

  resetIdleTimer();
};

const INTERACTIVE_TAGS = new Set(["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT", "LABEL", "SUMMARY"]);

const onClick = (e: MouseEvent) => {
  clicksCount++;
  resetIdleTimer();

  const target = e.target as HTMLElement;
  const x = Math.round((e.clientX / window.innerWidth) * 10000) / 100;
  const y = Math.round(((e.clientY + window.scrollY) / Math.max(document.documentElement.scrollHeight, 1)) * 10000) / 100;

  const isInteractive = INTERACTIVE_TAGS.has(target.tagName) ||
    target.closest("a,button,input,textarea,select,[role='button'],[tabindex]") !== null;

  if (!isInteractive) deadClicks++;

  // Rage click detection
  const now = Date.now();
  recentClicks.push({ time: now, x: e.clientX, y: e.clientY });
  recentClicks = recentClicks.filter(c => now - c.time < RAGE_CLICK_WINDOW);
  const isRage = recentClicks.length >= RAGE_CLICK_THRESHOLD;
  if (isRage) rageClicksCount++;

  clickBuffer.push({
    session_id: getSessionId(),
    user_id: userId,
    page_path: currentPagePath,
    x_percent: x,
    y_percent: y,
    element_tag: target.tagName || null,
    element_id: target.id || null,
    element_class: (target.className && typeof target.className === "string") ? target.className.slice(0, 200) : null,
    element_text: (target.textContent || "").slice(0, 50) || null,
    is_rage_click: isRage,
    is_dead_click: !isInteractive,
  });

  if (clickBuffer.length >= CLICK_BATCH_SIZE) flushClickBuffer();
};

const onKeypress = () => {
  keypressesCount++;
  resetIdleTimer();
};

const onVisibilityChange = () => {
  if (document.hidden) {
    visibilityHiddenStart = Date.now();
  } else if (visibilityHiddenStart) {
    visibilityHiddenTotal += Date.now() - visibilityHiddenStart;
    visibilityHiddenStart = null;
  }
};

const onCopy = () => { copyCount++; resetIdleTimer(); };
const onPaste = () => { pasteCount++; resetIdleTimer(); };
const onContextMenu = () => { rightClickCount++; };
const onSelectionChange = () => {
  const sel = window.getSelection();
  if (sel && sel.toString().length > 0) textSelections++;
};
const onFocusIn = (e: FocusEvent) => {
  const t = e.target as HTMLElement;
  if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT") formFocusCount++;
};

const onMouseMove = (e: MouseEvent) => {
  pendingMouseX = e.clientX;
  pendingMouseY = e.clientY;
  resetIdleTimer();
};

const sampleMouseDistance = () => {
  if (lastMouseX || lastMouseY) {
    const dx = pendingMouseX - lastMouseX;
    const dy = pendingMouseY - lastMouseY;
    mouseDistance += Math.sqrt(dx * dx + dy * dy);
  }
  lastMouseX = pendingMouseX;
  lastMouseY = pendingMouseY;
};

// External link tracking
const onLinkClick = (e: MouseEvent) => {
  const anchor = (e.target as HTMLElement).closest("a");
  if (anchor && anchor.hostname !== window.location.hostname) {
    externalLinkClicks++;
  }
};

// ---------- Idle ----------
let idleTimer: ReturnType<typeof setTimeout> | null = null;
const resetIdleTimer = () => {
  if (idleStart) {
    idleTotal += Date.now() - idleStart;
    idleStart = null;
  }
  lastActivityTime = Date.now();
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    idleStart = Date.now();
  }, IDLE_THRESHOLD);
};

// ============================================================
// ERROR TRACKING
// ============================================================
const logErrorToDb = async (errorType: string, message: string, stack?: string | null, extra?: Record<string, any>) => {
  try {
    await supabase.from("error_log").insert({
      session_id: getSessionId(),
      user_id: userId,
      page_path: window.location.pathname,
      error_type: errorType,
      message: message.slice(0, 2000),
      stack: stack?.slice(0, 5000) || null,
      metadata: { ...extra, user_agent: navigator.userAgent, timestamp: new Date().toISOString() },
    });
  } catch {
    // Silent
  }
};

const onError = (event: ErrorEvent) => {
  logErrorToDb("js_error", event.message, event.error?.stack, {
    filename: event.filename,
    line: event.lineno,
    col: event.colno,
  });
};

const onUnhandledRejection = (event: PromiseRejectionEvent) => {
  const msg = event.reason?.message || String(event.reason);
  logErrorToDb("unhandled_rejection", msg, event.reason?.stack);
};

// ============================================================
// PERFORMANCE VITALS
// ============================================================
const observePerformance = () => {
  try {
    if (typeof PerformanceObserver === "undefined") return;

    // LCP
    const lcpObs = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length) performanceVitals.lcp = Math.round(entries[entries.length - 1].startTime);
    });
    lcpObs.observe({ type: "largest-contentful-paint", buffered: true });

    // FID
    const fidObs = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceEventTiming[];
      if (entries.length) performanceVitals.fid = Math.round(entries[0].processingStart - entries[0].startTime);
    });
    fidObs.observe({ type: "first-input", buffered: true });

    // CLS
    let clsValue = 0;
    const clsObs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) clsValue += entry.value;
      }
      performanceVitals.cls = Math.round(clsValue * 1000) / 1000;
    });
    clsObs.observe({ type: "layout-shift", buffered: true });

    // TTFB
    const navObs = new PerformanceObserver((list) => {
      const nav = list.getEntries()[0] as PerformanceNavigationTiming;
      if (nav) performanceVitals.ttfb = Math.round(nav.responseStart - nav.requestStart);
    });
    navObs.observe({ type: "navigation", buffered: true });
  } catch {
    // PerformanceObserver not supported
  }
};

// ============================================================
// THROTTLE UTILITY
// ============================================================
const throttle = <T extends (...args: any[]) => void>(fn: T, ms: number): T => {
  let last = 0;
  return ((...args: any[]) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  }) as T;
};

// ============================================================
// INIT & CLEANUP
// ============================================================
let initialized = false;
const throttledScroll = throttle(onScroll, SCROLL_THROTTLE);

export const initTelemetry = async () => {
  if (initialized) return;
  initialized = true;

  getSessionId();

  // Resolve user
  try {
    const { data } = await supabase.auth.getSession();
    userId = data?.session?.user?.id || null;
  } catch { /* */ }
  supabase.auth.onAuthStateChange((_event, session) => {
    userId = session?.user?.id || null;
  });

  // Listeners
  window.addEventListener("scroll", throttledScroll, { passive: true });
  window.addEventListener("click", onClick, true);
  window.addEventListener("click", onLinkClick, true);
  window.addEventListener("keypress", onKeypress);
  document.addEventListener("visibilitychange", onVisibilityChange);
  document.addEventListener("copy", onCopy);
  document.addEventListener("paste", onPaste);
  document.addEventListener("contextmenu", onContextMenu);
  document.addEventListener("selectionchange", onSelectionChange);
  document.addEventListener("focusin", onFocusIn);
  window.addEventListener("mousemove", onMouseMove, { passive: true });
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onUnhandledRejection);

  mouseTrackerInterval = setInterval(sampleMouseDistance, MOUSE_SAMPLE_INTERVAL);
  clickFlushTimer = setInterval(flushClickBuffer, CLICK_FLUSH_INTERVAL);

  observePerformance();
  resetIdleTimer();
};

export const startPageSession = (path: string, title: string) => {
  // Flush previous page
  if (currentPagePath) {
    flushPageSession();
  }

  currentPagePath = path;
  currentPageTitle = title;
  pageEnterTime = Date.now();
  pagesVisited.push(path);
  resetPageCounters();
};

export const endSession = () => {
  flushPageSession();
  flushClickBuffer();
};

export const cleanupTelemetry = () => {
  window.removeEventListener("scroll", throttledScroll);
  window.removeEventListener("click", onClick, true);
  window.removeEventListener("click", onLinkClick, true);
  window.removeEventListener("keypress", onKeypress);
  document.removeEventListener("visibilitychange", onVisibilityChange);
  document.removeEventListener("copy", onCopy);
  document.removeEventListener("paste", onPaste);
  document.removeEventListener("contextmenu", onContextMenu);
  document.removeEventListener("selectionchange", onSelectionChange);
  document.removeEventListener("focusin", onFocusIn);
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("error", onError);
  window.removeEventListener("unhandledrejection", onUnhandledRejection);

  if (mouseTrackerInterval) clearInterval(mouseTrackerInterval);
  if (clickFlushTimer) clearInterval(clickFlushTimer);
  if (idleTimer) clearTimeout(idleTimer);
  initialized = false;
};
