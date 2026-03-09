import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the SkillSwap Workspace AI Assistant. You help users throughout the gig workspace process:

**Your capabilities:**
- Help users understand workspace stages, escrow, and deliverables
- Review deliverable descriptions and suggest improvements
- Help draft dispute reasons with proper evidence formatting
- Suggest quality improvements for submitted work
- Help translate messages between workspace participants
- Provide guidance on requirements and acceptance criteria
- Help write clear deliverable titles and descriptions
- Advise on escrow terms and stage planning
- Do plagiarism/quality pre-checks on text content
- Help resolve conflicts between workspace members

**Context awareness:**
- You understand the SP (Skill Points) economy
- You know about workspace roles: owner, editor, viewer
- You understand the stage-based progressive reveal system
- You know about the Skill Court dispute resolution process

Be concise, helpful, and professional. Use bullet points for clarity. If asked to translate, translate accurately and preserve tone.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, action, content, targetLanguage } = await req.json();
    
    // Portable AI provider: check env vars in priority order
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
    const CUSTOM_KEY = Deno.env.get("AI_CHAT_API_KEY") || Deno.env.get("OPENAI_API_KEY");
    
    const apiKey = LOVABLE_KEY || CUSTOM_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "No AI API key configured. Set LOVABLE_API_KEY, AI_CHAT_API_KEY, or OPENAI_API_KEY." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const defaultUrl = LOVABLE_KEY 
      ? "https://ai.gateway.lovable.dev/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    const gatewayUrl = Deno.env.get("AI_PROVIDER_URL") || defaultUrl;
    const model = LOVABLE_KEY ? "google/gemini-3-flash-preview" : "gpt-4o-mini";

    let aiMessages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];

    if (action === "translate") {
      aiMessages.push({
        role: "user",
        content: `Translate the following text to ${targetLanguage}. Return ONLY the translated text, nothing else:\n\n${content}`,
      });
    } else if (action === "review_deliverable") {
      aiMessages.push({
        role: "user",
        content: `Review this deliverable submission and provide quality feedback, suggestions for improvement, and a quality score (1-100):\n\nTitle: ${content.title}\nDescription: ${content.description}\nRequirements: ${JSON.stringify(content.requirements || [])}`,
      });
    } else if (action === "suggest_requirements") {
      aiMessages.push({
        role: "user",
        content: `Suggest 5-8 clear, measurable acceptance criteria/requirements for a deliverable with this description: "${content}". Return as a JSON array of strings.`,
      });
    } else if (action === "help_dispute") {
      aiMessages.push({
        role: "user",
        content: `Help me write a clear, well-structured dispute reason for Skill Court. The issue is: "${content}". Include suggested evidence to gather.`,
      });
    } else {
      aiMessages = [...aiMessages, ...(messages || [])];
    }

    const useStream = !action;

    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: aiMessages,
        stream: useStream,
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

    if (useStream) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("workspace-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
