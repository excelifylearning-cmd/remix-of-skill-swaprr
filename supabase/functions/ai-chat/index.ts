import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are SkillBot, the AI support assistant for SkillSwap — a skill exchange platform for students. You help users with:
- Account issues, billing, and subscriptions
- Finding and posting gigs on the marketplace
- Understanding Skill Points (SP), ELO ratings, and tiers
- Guild management and Guild Wars
- Skill Court disputes and resolutions
- Enterprise features and consultations
- Technical issues and bug reports

Be friendly, concise, and helpful. Use emojis sparingly. If you can't help with something, suggest contacting human support (Mon–Fri, 9am–6pm EST).`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    
    // Try Lovable AI first, fall back to AI_CHAT_API_KEY
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
    const CUSTOM_KEY = Deno.env.get("AI_CHAT_API_KEY");
    
    const apiKey = LOVABLE_KEY || CUSTOM_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: "No AI API key configured. Please add LOVABLE_API_KEY or AI_CHAT_API_KEY." 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const gatewayUrl = LOVABLE_KEY 
      ? "https://ai.gateway.lovable.dev/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";

    const model = LOVABLE_KEY ? "google/gemini-2.5-flash-lite" : "gpt-4o-mini";

    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
