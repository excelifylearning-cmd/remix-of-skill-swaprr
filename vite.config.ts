import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Gracefully handle lovable-tagger — optional dev dependency
let tagger: any;
try {
  tagger = (await import("lovable-tagger")).componentTagger;
} catch {
  // Not installed (e.g. self-hosted / Netlify) — skip silently
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && tagger?.()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
