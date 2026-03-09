import { supabase } from "@/integrations/supabase/client";

/**
 * Portable OAuth wrapper — works on any Supabase instance.
 * On Lovable Cloud, the managed Google credentials are used automatically.
 * On self-hosted, configure Google OAuth in your Supabase dashboard.
 */
export const portableAuth = {
  signInWithGoogle: async (redirectTo?: string) => {
    // Try Lovable Cloud OAuth first (if available), fall back to standard Supabase OAuth
    try {
      const { lovable } = await import("@/integrations/lovable/index");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: redirectTo || window.location.origin,
      });
      return result;
    } catch {
      // Lovable module not available — use standard Supabase OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo || window.location.origin,
        },
      });
      if (error) return { error };
      return { data };
    }
  },
};
