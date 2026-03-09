import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, to, subject, body, metadata } = await req.json();

    // Log the notification intent to the database
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Store notification record
    const notifRes = await fetch(`${SUPABASE_URL}/rest/v1/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        user_id: metadata?.user_id || null,
        type: type || "system",
        title: subject || "Notification",
        message: body || "",
        metadata: metadata || {},
      }),
    });

    if (!notifRes.ok) {
      console.error("Failed to store notification:", await notifRes.text());
    }

    // Email sending placeholder - connect Resend or similar service
    // For now, notifications are stored in DB and can be read via the app
    console.log(`Notification queued: ${type} -> ${to} | ${subject}`);

    return new Response(
      JSON.stringify({ success: true, message: "Notification queued" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Notification error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
