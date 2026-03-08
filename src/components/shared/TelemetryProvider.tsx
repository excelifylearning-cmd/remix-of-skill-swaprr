import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initTelemetry, startPageSession, endSession, cleanupTelemetry } from "@/lib/telemetry";

/**
 * TelemetryProvider — Drop into App.tsx inside <BrowserRouter>.
 * Automatically tracks page sessions, clicks, scrolls, errors, and more.
 * Zero UI — renders nothing.
 */
const TelemetryProvider = () => {
  const location = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initTelemetry();
      initialized.current = true;
    }

    // Flush on unload
    const onBeforeUnload = () => endSession();
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      cleanupTelemetry();
    };
  }, []);

  useEffect(() => {
    startPageSession(location.pathname, document.title);
  }, [location.pathname]);

  return null;
};

export default TelemetryProvider;
