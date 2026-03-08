import { supabase } from "@/integrations/supabase/client";

/**
 * Captures comprehensive user metadata for activity logging.
 * Includes device, browser, screen, network, referrer, timezone, and timing info.
 */
export const captureMetadata = () => {
  const nav = navigator as any;
  const perf = performance?.timing;
  const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;

  return {
    // Timing
    timestamp: new Date().toISOString(),
    local_time: new Date().toLocaleString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    utc_offset: new Date().getTimezoneOffset(),

    // Page context
    page_url: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    referrer: document.referrer || null,
    
    // Device & screen
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    device_pixel_ratio: window.devicePixelRatio,
    touch_enabled: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    device_memory: nav?.deviceMemory || null,
    hardware_concurrency: navigator.hardwareConcurrency || null,

    // Browser
    user_agent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages ? Array.from(navigator.languages) : [navigator.language],
    platform: nav?.userAgentData?.platform || navigator.platform || null,
    vendor: navigator.vendor || null,
    cookies_enabled: navigator.cookieEnabled,
    do_not_track: navigator.doNotTrack === "1",
    pdf_viewer: nav?.pdfViewerEnabled ?? null,

    // Network
    connection_type: conn?.effectiveType || null,
    downlink: conn?.downlink || null,
    rtt: conn?.rtt || null,
    save_data: conn?.saveData || false,
    online: navigator.onLine,

    // Performance
    page_load_time: perf ? perf.loadEventEnd - perf.navigationStart : null,
    dom_ready_time: perf ? perf.domContentLoadedEventEnd - perf.navigationStart : null,

    // Session
    session_storage_available: (() => { try { sessionStorage.setItem("_t", "1"); sessionStorage.removeItem("_t"); return true; } catch { return false; } })(),
    local_storage_available: (() => { try { localStorage.setItem("_t", "1"); localStorage.removeItem("_t"); return true; } catch { return false; } })(),
  };
};

/**
 * Detects browser name and version from user agent
 */
const detectBrowser = (): { name: string; version: string } => {
  const ua = navigator.userAgent;
  const browsers: [string, RegExp][] = [
    ["Edge", /Edg\/(\d+\.\d+)/],
    ["Chrome", /Chrome\/(\d+\.\d+)/],
    ["Firefox", /Firefox\/(\d+\.\d+)/],
    ["Safari", /Version\/(\d+\.\d+).*Safari/],
    ["Opera", /OPR\/(\d+\.\d+)/],
  ];
  for (const [name, regex] of browsers) {
    const match = ua.match(regex);
    if (match) return { name, version: match[1] };
  }
  return { name: "Unknown", version: "0" };
};

/**
 * Detects OS from user agent
 */
const detectOS = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Unknown";
};

/**
 * Detects device type from screen size and touch
 */
const detectDeviceType = (): string => {
  const width = window.innerWidth;
  const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (width < 768 && touch) return "mobile";
  if (width < 1024 && touch) return "tablet";
  return "desktop";
};

/**
 * Logs an activity with full metadata to the activity_log table.
 * Works for both authenticated and anonymous users.
 */
export const logActivity = async (
  action: string,
  extra?: {
    entity_type?: string;
    entity_id?: string;
    /** Additional context merged into metadata */
    context?: Record<string, any>;
  }
) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;
    const meta = captureMetadata();
    const browser = detectBrowser();
    const os = detectOS();
    const deviceType = detectDeviceType();

    const metadata = {
      ...meta,
      browser_name: browser.name,
      browser_version: browser.version,
      os: os,
      device_type: deviceType,
      ...(extra?.context || {}),
    };

    await supabase.from("activity_log").insert({
      user_id: userId,
      action,
      entity_type: extra?.entity_type || null,
      entity_id: extra?.entity_id || null,
      user_agent: navigator.userAgent,
      metadata,
    });
  } catch (e) {
    // Silent fail — logging should never break the app
    console.warn("[activity-logger] Failed to log:", e);
  }
};

/**
 * Tracks page views with full metadata
 */
export const logPageView = (pageName: string) => {
  logActivity("page_view", {
    entity_type: "page",
    context: { page_name: pageName },
  });
};

/**
 * Tracks form submissions with form data summary
 */
export const logFormSubmission = (
  formName: string,
  formData: Record<string, any>,
  entityType?: string,
  entityId?: string
) => {
  // Sanitize: never log passwords or sensitive data
  const sanitized = { ...formData };
  delete sanitized.password;
  delete sanitized.confirm_password;
  delete sanitized.token;

  logActivity(`form_submit:${formName}`, {
    entity_type: entityType || "form",
    entity_id: entityId,
    context: {
      form_name: formName,
      form_data: sanitized,
      submitted_at: new Date().toISOString(),
    },
  });
};

/**
 * Tracks button clicks and interactions
 */
export const logInteraction = (
  interactionType: string,
  details?: Record<string, any>
) => {
  logActivity(`interaction:${interactionType}`, {
    entity_type: "ui",
    context: details,
  });
};

/**
 * Tracks search actions with query and result count
 */
export const logSearch = (
  query: string,
  resultsCount: number,
  page?: string
) => {
  logActivity("search", {
    entity_type: "search",
    context: { query, results_count: resultsCount, page: page || window.location.pathname },
  });
};

/**
 * Tracks navigation patterns (link click, back button, direct)
 */
export const logNavigation = (
  from: string,
  to: string,
  method: "link" | "back" | "forward" | "direct" = "link"
) => {
  logActivity("navigation", {
    entity_type: "route",
    context: { from, to, method },
  });
};

/**
 * Tracks copy events
 */
export const logCopy = (textLength: number, page?: string) => {
  logActivity("interaction:copy", {
    entity_type: "ui",
    context: { text_length: textLength, page: page || window.location.pathname },
  });
};

/**
 * Tracks outbound/external link clicks
 */
export const logExternalLink = (url: string, page?: string) => {
  logActivity("interaction:external_link", {
    entity_type: "link",
    context: { url, page: page || window.location.pathname },
  });
};

/**
 * Logs errors to the error_log table via activity_log for correlation
 */
export const logError = (
  error: Error | string,
  context?: Record<string, any>
) => {
  const msg = typeof error === "string" ? error : error.message;
  const stack = typeof error === "string" ? undefined : error.stack;
  logActivity("error", {
    entity_type: "error",
    context: { message: msg, stack, ...context },
  });
};
