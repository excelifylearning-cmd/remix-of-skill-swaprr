import { supabase } from "@/integrations/supabase/client";

// ============================================================
// TELEMETRY ENGINE v2 — Maximum-coverage behavioral analytics
// 200+ data points per session. Tracks everything loggable.
// ============================================================

const SCROLL_THROTTLE = 200;
const MOUSE_SAMPLE_INTERVAL = 100;
const IDLE_THRESHOLD = 30_000;
const RAGE_CLICK_THRESHOLD = 3;
const RAGE_CLICK_WINDOW = 800;
const CLICK_BATCH_SIZE = 20;
const CLICK_FLUSH_INTERVAL = 5_000;
const HOVER_THRESHOLD = 1500; // 1.5s hover = meaningful

// ============================================================
// SESSION & REFERRER TRACKING
// ============================================================
let sessionId: string;
let userId: string | null = null;
let sessionStartTime: number;
let pagesVisited: string[] = [];
let pageSequenceWithTimestamps: Array<{ path: string; ts: number }> = [];

// Persist referrer chain across the session
const getReferrerChain = (): string[] => {
  try {
    const stored = sessionStorage.getItem("_telemetry_referrers");
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};
const pushReferrer = (ref: string) => {
  try {
    const chain = getReferrerChain();
    if (chain[chain.length - 1] !== ref) chain.push(ref);
    sessionStorage.setItem("_telemetry_referrers", JSON.stringify(chain.slice(-20)));
  } catch { /* */ }
};

// UTM parameter extraction
const getUtmParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref", "source", "via", "from", "gclid", "fbclid", "msclkid"]) {
    const val = params.get(key);
    if (val) utms[key] = val;
  }
  return utms;
};

// Store initial landing data once per session
const captureSessionEntry = () => {
  if (sessionStorage.getItem("_telemetry_entry")) return;
  sessionStorage.setItem("_telemetry_entry", JSON.stringify({
    landing_page: window.location.pathname,
    landing_url: window.location.href,
    referrer: document.referrer || null,
    utm: getUtmParams(),
    entered_at: new Date().toISOString(),
  }));
  if (document.referrer) pushReferrer(document.referrer);
};

const getSessionEntry = (): Record<string, any> => {
  try {
    return JSON.parse(sessionStorage.getItem("_telemetry_entry") || "{}");
  } catch { return {}; }
};

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

// ============================================================
// DEVICE & ENVIRONMENT SNAPSHOT
// ============================================================
const captureEnvironment = async (): Promise<Record<string, any>> => {
  const nav = navigator as any;
  const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;

  const env: Record<string, any> = {
    // Screen & viewport
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    screen_avail_width: window.screen.availWidth,
    screen_avail_height: window.screen.availHeight,
    screen_color_depth: window.screen.colorDepth,
    screen_pixel_depth: window.screen.pixelDepth,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    device_pixel_ratio: window.devicePixelRatio,
    orientation: screen?.orientation?.type || null,

    // Device capabilities
    touch_enabled: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    max_touch_points: navigator.maxTouchPoints,
    device_memory: nav?.deviceMemory || null,
    hardware_concurrency: navigator.hardwareConcurrency || null,
    platform: nav?.userAgentData?.platform || navigator.platform || null,

    // Browser
    user_agent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages ? Array.from(navigator.languages) : [],
    vendor: navigator.vendor || null,
    cookies_enabled: navigator.cookieEnabled,
    do_not_track: navigator.doNotTrack === "1",
    pdf_viewer: nav?.pdfViewerEnabled ?? null,
    java_enabled: false,
    webdriver: nav?.webdriver || false,

    // Network
    online: navigator.onLine,
    connection_type: conn?.effectiveType || null,
    connection_downlink: conn?.downlink || null,
    connection_rtt: conn?.rtt || null,
    connection_save_data: conn?.saveData || false,

    // Timezone & locale
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    utc_offset: new Date().getTimezoneOffset(),
    locale: Intl.DateTimeFormat().resolvedOptions().locale,

    // Storage
    session_storage_available: (() => { try { sessionStorage.setItem("_t", "1"); sessionStorage.removeItem("_t"); return true; } catch { return false; } })(),
    local_storage_available: (() => { try { localStorage.setItem("_t", "1"); localStorage.removeItem("_t"); return true; } catch { return false; } })(),
    indexed_db_available: !!window.indexedDB,
    service_worker_available: "serviceWorker" in navigator,

    // Media
    media_devices_available: !!navigator.mediaDevices,
    speech_synthesis_available: "speechSynthesis" in window,
    bluetooth_available: "bluetooth" in navigator,
    usb_available: "usb" in navigator,
    geolocation_available: "geolocation" in navigator,
    notification_permission: typeof Notification !== "undefined" ? Notification.permission : null,
    clipboard_available: !!navigator.clipboard,

    // Page context
    referrer: document.referrer || null,
    page_url: window.location.href,
    page_path: window.location.pathname,
    page_hash: window.location.hash || null,
    page_search: window.location.search || null,
    document_title: document.title,

    // Referrer & attribution
    utm_params: getUtmParams(),
    referrer_chain: getReferrerChain(),
    session_entry: getSessionEntry(),

    // Ad blocker detection (heuristic)
    ad_blocker_likely: false,
  };

  // Battery
  try {
    if (nav.getBattery) {
      const battery = await nav.getBattery();
      env.battery_level = battery.level;
      env.battery_charging = battery.charging;
      env.battery_charging_time = battery.chargingTime;
      env.battery_discharging_time = battery.dischargingTime;
    }
  } catch { /* */ }

  // Storage estimate
  try {
    if (navigator.storage?.estimate) {
      const est = await navigator.storage.estimate();
      env.storage_quota_mb = est.quota ? Math.round(est.quota / 1024 / 1024) : null;
      env.storage_usage_mb = est.usage ? Math.round(est.usage / 1024 / 1024) : null;
    }
  } catch { /* */ }

  // GPU info via WebGL
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl && gl instanceof WebGLRenderingContext) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        env.gpu_vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
        env.gpu_renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
      }
    }
  } catch { /* */ }

  return env;
};

// ============================================================
// PAGE SESSION STATE
// ============================================================
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
let timeToFirstInteraction: number | null = null;
let firstInteractionType: string | null = null;

// Click buffer
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
let recentClicks: { time: number; x: number; y: number }[] = [];

// Performance
let performanceVitals: Record<string, number> = {};

// Interaction counters
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
let doubleClickCount = 0;
let touchStartCount = 0;
let touchEndCount = 0;
let pinchZoomCount = 0;
let scrollVelocityMax = 0;
let lastScrollTime = 0;
let printAttempts = 0;
let formAbandons = 0;
let activeFormField: string | null = null;
let hoverEvents: Array<{ element: string; durationMs: number }> = [];
let currentHoverTarget: string | null = null;
let hoverStartTime = 0;
let internalNavClicks = 0;
let backButtonPresses = 0;
let totalScrollDistancePx = 0;
let tabFocusChanges = 0;
let windowResizeCount = 0;
let lastViewportWidth = 0;
let lastViewportHeight = 0;
let onlineOfflineChanges = 0;
let maxConsecutiveIdleSec = 0;
let currentIdleStreak = 0;

// Cached environment
let environmentSnapshot: Record<string, any> = {};

// ============================================================
// FLUSH: Page Session → DB
// ============================================================
const flushPageSession = async () => {
  if (!currentPagePath || !pageEnterTime) return;
  const now = Date.now();
  const durationMs = now - pageEnterTime;
  const durationSec = Math.round(durationMs / 1000);

  if (idleStart) { idleTotal += now - idleStart; idleStart = null; }
  if (visibilityHiddenStart) { visibilityHiddenTotal += now - visibilityHiddenStart; visibilityHiddenStart = null; }

  const scrollAvg = scrollDepthSamples.length > 0
    ? Math.round(scrollDepthSamples.reduce((a, b) => a + b, 0) / scrollDepthSamples.length)
    : 0;

  // Engagement score (0–100)
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
      // Interaction counts
      copy_count: copyCount,
      paste_count: pasteCount,
      right_click_count: rightClickCount,
      double_click_count: doubleClickCount,
      text_selections: textSelections,
      scroll_direction_changes: scrollDirectionChanges,
      external_link_clicks: externalLinkClicks,
      internal_nav_clicks: internalNavClicks,
      form_focus_count: formFocusCount,
      form_abandons: formAbandons,
      dead_clicks: deadClicks,
      print_attempts: printAttempts,
      back_button_presses: backButtonPresses,

      // Touch
      touch_start_count: touchStartCount,
      touch_end_count: touchEndCount,
      pinch_zoom_count: pinchZoomCount,

      // Scroll
      total_scroll_distance_px: Math.round(totalScrollDistancePx),
      scroll_velocity_max: Math.round(scrollVelocityMax),

      // Time metrics
      time_to_first_interaction_ms: timeToFirstInteraction,
      first_interaction_type: firstInteractionType,
      max_consecutive_idle_sec: maxConsecutiveIdleSec,

      // Tab & window
      tab_focus_changes: tabFocusChanges,
      window_resize_count: windowResizeCount,
      online_offline_changes: onlineOfflineChanges,

      // Hover data (top 10 longest)
      hover_events: hoverEvents
        .sort((a, b) => b.durationMs - a.durationMs)
        .slice(0, 10),

      // Performance
      performance_vitals: performanceVitals,

      // Referrer & attribution
      referrer: document.referrer || null,
      referrer_chain: getReferrerChain(),
      utm_params: getUtmParams(),
      session_entry: getSessionEntry(),
      landing_page: getSessionEntry().landing_page || null,

      // Navigation context
      pages_in_session: pagesVisited.length,
      page_sequence: pageSequenceWithTimestamps.slice(-30),
      session_duration_sec: Math.round((Date.now() - sessionStartTime) / 1000),

      // Environment snapshot (full device/browser/network info)
      environment: environmentSnapshot,
    },
  };

  try {
    await supabase.from("page_sessions").insert(payload);
  } catch (e) {
    console.warn("[telemetry] flush page session failed:", e);
  }

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
  doubleClickCount = 0;
  touchStartCount = 0;
  touchEndCount = 0;
  pinchZoomCount = 0;
  scrollVelocityMax = 0;
  lastScrollTime = 0;
  printAttempts = 0;
  formAbandons = 0;
  activeFormField = null;
  hoverEvents = [];
  currentHoverTarget = null;
  hoverStartTime = 0;
  internalNavClicks = 0;
  backButtonPresses = 0;
  totalScrollDistancePx = 0;
  tabFocusChanges = 0;
  windowResizeCount = 0;
  onlineOfflineChanges = 0;
  maxConsecutiveIdleSec = 0;
  currentIdleStreak = 0;
  timeToFirstInteraction = null;
  firstInteractionType = null;
  lastViewportWidth = window.innerWidth;
  lastViewportHeight = window.innerHeight;
};

// ============================================================
// FIRST INTERACTION TRACKER
// ============================================================
const recordFirstInteraction = (type: string) => {
  if (timeToFirstInteraction !== null) return;
  timeToFirstInteraction = Date.now() - pageEnterTime;
  firstInteractionType = type;
};

// ============================================================
// EVENT HANDLERS
// ============================================================
const INTERACTIVE_TAGS = new Set(["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT", "LABEL", "SUMMARY"]);

const onScroll = () => {
  const scrollTop = window.scrollY;
  const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const depth = Math.min(100, Math.round((scrollTop / docHeight) * 100));
  scrollDepthMax = Math.max(scrollDepthMax, depth);
  scrollDepthSamples.push(depth);

  // Scroll distance
  totalScrollDistancePx += Math.abs(scrollTop - lastScrollTop);

  // Scroll velocity
  const now = Date.now();
  if (lastScrollTime) {
    const dt = now - lastScrollTime;
    if (dt > 0) {
      const velocity = Math.abs(scrollTop - lastScrollTop) / dt * 1000; // px/s
      scrollVelocityMax = Math.max(scrollVelocityMax, velocity);
    }
  }
  lastScrollTime = now;

  // Direction changes
  const dir = scrollTop > lastScrollTop ? "down" : "up";
  if (lastScrollDirection && dir !== lastScrollDirection) scrollDirectionChanges++;
  lastScrollDirection = dir;
  lastScrollTop = scrollTop;

  recordFirstInteraction("scroll");
  resetIdleTimer();
};

const onClick = (e: MouseEvent) => {
  clicksCount++;
  recordFirstInteraction("click");
  resetIdleTimer();

  const target = e.target as HTMLElement;
  const x = Math.round((e.clientX / window.innerWidth) * 10000) / 100;
  const y = Math.round(((e.clientY + window.scrollY) / Math.max(document.documentElement.scrollHeight, 1)) * 10000) / 100;

  const isInteractive = INTERACTIVE_TAGS.has(target.tagName) ||
    target.closest("a,button,input,textarea,select,[role='button'],[tabindex]") !== null;

  if (!isInteractive) deadClicks++;

  // Internal nav detection
  const anchor = target.closest("a");
  if (anchor) {
    if (anchor.hostname === window.location.hostname) {
      internalNavClicks++;
      pushReferrer(window.location.href);
    } else {
      externalLinkClicks++;
    }
  }

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

const onDblClick = () => { doubleClickCount++; };

const onKeypress = () => {
  keypressesCount++;
  recordFirstInteraction("keypress");
  resetIdleTimer();
};

const onVisibilityChange = () => {
  if (document.hidden) {
    visibilityHiddenStart = Date.now();
  } else {
    if (visibilityHiddenStart) {
      visibilityHiddenTotal += Date.now() - visibilityHiddenStart;
      visibilityHiddenStart = null;
    }
    tabFocusChanges++;
  }
};

const onCopy = () => { copyCount++; recordFirstInteraction("copy"); resetIdleTimer(); };
const onPaste = () => { pasteCount++; recordFirstInteraction("paste"); resetIdleTimer(); };
const onContextMenu = () => { rightClickCount++; };
const onSelectionChange = () => {
  const sel = window.getSelection();
  if (sel && sel.toString().length > 0) textSelections++;
};

const onFocusIn = (e: FocusEvent) => {
  const t = e.target as HTMLElement;
  if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT") {
    formFocusCount++;
    activeFormField = t.id || t.getAttribute("name") || t.tagName;
    recordFirstInteraction("form_focus");
  }
};

const onFocusOut = (e: FocusEvent) => {
  const t = e.target as HTMLElement;
  if ((t.tagName === "INPUT" || t.tagName === "TEXTAREA") && activeFormField) {
    activeFormField = null;
  }
};

// Form abandon: if user focused a form field then navigates away without submitting
const checkFormAbandon = () => {
  if (activeFormField) {
    formAbandons++;
    activeFormField = null;
  }
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

// Hover tracking
const onMouseOver = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const identifier = target.id || target.getAttribute("data-testid") || `${target.tagName}.${(target.className || "").toString().slice(0, 50)}`;
  if (currentHoverTarget !== identifier) {
    // Flush previous hover
    if (currentHoverTarget && hoverStartTime) {
      const dur = Date.now() - hoverStartTime;
      if (dur >= HOVER_THRESHOLD) {
        hoverEvents.push({ element: currentHoverTarget, durationMs: dur });
      }
    }
    currentHoverTarget = identifier;
    hoverStartTime = Date.now();
  }
};

// Touch events
let lastTouchDistance = 0;
const onTouchStart = (e: TouchEvent) => {
  touchStartCount++;
  recordFirstInteraction("touch");
  resetIdleTimer();
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
  }
};

const onTouchEnd = () => { touchEndCount++; };

const onTouchMove = (e: TouchEvent) => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (Math.abs(dist - lastTouchDistance) > 30) {
      pinchZoomCount++;
      lastTouchDistance = dist;
    }
  }
};

// Print
const onBeforePrint = () => { printAttempts++; };

// Popstate (back/forward)
const onPopState = () => { backButtonPresses++; };

// Resize
const onResize = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w !== lastViewportWidth || h !== lastViewportHeight) {
    windowResizeCount++;
    lastViewportWidth = w;
    lastViewportHeight = h;
  }
};

// Online/offline
const onOnline = () => { onlineOfflineChanges++; };
const onOffline = () => { onlineOfflineChanges++; };

// ============================================================
// IDLE TRACKING
// ============================================================
let idleTimer: ReturnType<typeof setTimeout> | null = null;
const resetIdleTimer = () => {
  if (idleStart) {
    const idleDur = (Date.now() - idleStart) / 1000;
    idleTotal += idleDur * 1000;
    maxConsecutiveIdleSec = Math.max(maxConsecutiveIdleSec, Math.round(idleDur));
    idleStart = null;
  }
  lastActivityTime = Date.now();
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { idleStart = Date.now(); }, IDLE_THRESHOLD);
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
      metadata: {
        ...extra,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        utm: getUtmParams(),
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      },
    });
  } catch { /* Silent */ }
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

    // Navigation timing (TTFB, DNS, TCP, etc.)
    try {
      const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      if (navEntries.length) {
        const nav = navEntries[0];
        performanceVitals.ttfb = Math.round(nav.responseStart - nav.requestStart);
        performanceVitals.dns_time = Math.round(nav.domainLookupEnd - nav.domainLookupStart);
        performanceVitals.tcp_time = Math.round(nav.connectEnd - nav.connectStart);
        performanceVitals.ssl_time = Math.round(nav.secureConnectionStart > 0 ? nav.connectEnd - nav.secureConnectionStart : 0);
        performanceVitals.request_time = Math.round(nav.responseStart - nav.requestStart);
        performanceVitals.response_time = Math.round(nav.responseEnd - nav.responseStart);
        performanceVitals.dom_interactive = Math.round(nav.domInteractive);
        performanceVitals.dom_complete = Math.round(nav.domComplete);
        performanceVitals.load_event = Math.round(nav.loadEventEnd);
        performanceVitals.transfer_size = nav.transferSize;
        performanceVitals.encoded_body_size = nav.encodedBodySize;
        performanceVitals.decoded_body_size = nav.decodedBodySize;
        performanceVitals.redirect_count = nav.redirectCount;
      }
    } catch { /* */ }

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

    // INP (Interaction to Next Paint)
    try {
      let maxInp = 0;
      const inpObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceEventTiming[]) {
          const dur = entry.processingEnd - entry.startTime;
          if (dur > maxInp) { maxInp = dur; performanceVitals.inp = Math.round(dur); }
        }
      });
      inpObs.observe({ type: "event", buffered: true });
    } catch { /* */ }

    // Resource count
    try {
      const resources = performance.getEntriesByType("resource");
      performanceVitals.resource_count = resources.length;
      performanceVitals.total_transfer_kb = Math.round(
        resources.reduce((sum, r) => sum + ((r as PerformanceResourceTiming).transferSize || 0), 0) / 1024
      );
    } catch { /* */ }

    // Paint timing
    try {
      const paints = performance.getEntriesByType("paint");
      for (const p of paints) {
        if (p.name === "first-paint") performanceVitals.fp = Math.round(p.startTime);
        if (p.name === "first-contentful-paint") performanceVitals.fcp = Math.round(p.startTime);
      }
    } catch { /* */ }

  } catch { /* */ }
};

// ============================================================
// THROTTLE
// ============================================================
const throttle = <T extends (...args: any[]) => void>(fn: T, ms: number): T => {
  let last = 0;
  return ((...args: any[]) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...args); }
  }) as T;
};

// ============================================================
// INIT & CLEANUP
// ============================================================
let initialized = false;
const throttledScroll = throttle(onScroll, SCROLL_THROTTLE);
const throttledMouseOver = throttle(onMouseOver, 300);

export const initTelemetry = async () => {
  if (initialized) return;
  initialized = true;

  getSessionId();
  captureSessionEntry();

  // Resolve user
  try {
    const { data } = await supabase.auth.getSession();
    userId = data?.session?.user?.id || null;
  } catch { /* */ }
  supabase.auth.onAuthStateChange((_event, session) => {
    userId = session?.user?.id || null;
  });

  // Capture environment once
  environmentSnapshot = await captureEnvironment();

  // Core listeners
  window.addEventListener("scroll", throttledScroll, { passive: true });
  window.addEventListener("click", onClick, true);
  window.addEventListener("dblclick", onDblClick, true);
  window.addEventListener("keypress", onKeypress);
  document.addEventListener("visibilitychange", onVisibilityChange);
  document.addEventListener("copy", onCopy);
  document.addEventListener("paste", onPaste);
  document.addEventListener("contextmenu", onContextMenu);
  document.addEventListener("selectionchange", onSelectionChange);
  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("focusout", onFocusOut);
  window.addEventListener("mousemove", onMouseMove, { passive: true });
  window.addEventListener("mouseover", throttledMouseOver, { passive: true });
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onUnhandledRejection);

  // Touch
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });

  // Misc
  window.addEventListener("beforeprint", onBeforePrint);
  window.addEventListener("popstate", onPopState);
  window.addEventListener("resize", onResize);
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);

  mouseTrackerInterval = setInterval(sampleMouseDistance, MOUSE_SAMPLE_INTERVAL);
  clickFlushTimer = setInterval(flushClickBuffer, CLICK_FLUSH_INTERVAL);

  observePerformance();
  resetIdleTimer();
  lastViewportWidth = window.innerWidth;
  lastViewportHeight = window.innerHeight;
};

export const startPageSession = (path: string, title: string) => {
  if (currentPagePath) {
    checkFormAbandon();
    flushPageSession();
  }
  currentPagePath = path;
  currentPageTitle = title;
  pageEnterTime = Date.now();
  pagesVisited.push(path);
  pageSequenceWithTimestamps.push({ path, ts: Date.now() });
  resetPageCounters();
};

export const endSession = () => {
  checkFormAbandon();
  flushPageSession();
  flushClickBuffer();
};

export const cleanupTelemetry = () => {
  window.removeEventListener("scroll", throttledScroll);
  window.removeEventListener("click", onClick, true);
  window.removeEventListener("dblclick", onDblClick, true);
  window.removeEventListener("keypress", onKeypress);
  document.removeEventListener("visibilitychange", onVisibilityChange);
  document.removeEventListener("copy", onCopy);
  document.removeEventListener("paste", onPaste);
  document.removeEventListener("contextmenu", onContextMenu);
  document.removeEventListener("selectionchange", onSelectionChange);
  document.removeEventListener("focusin", onFocusIn);
  document.removeEventListener("focusout", onFocusOut);
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseover", throttledMouseOver);
  window.removeEventListener("error", onError);
  window.removeEventListener("unhandledrejection", onUnhandledRejection);
  window.removeEventListener("touchstart", onTouchStart);
  window.removeEventListener("touchend", onTouchEnd);
  window.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("beforeprint", onBeforePrint);
  window.removeEventListener("popstate", onPopState);
  window.removeEventListener("resize", onResize);
  window.removeEventListener("online", onOnline);
  window.removeEventListener("offline", onOffline);

  if (mouseTrackerInterval) clearInterval(mouseTrackerInterval);
  if (clickFlushTimer) clearInterval(clickFlushTimer);
  if (idleTimer) clearTimeout(idleTimer);
  initialized = false;
};
