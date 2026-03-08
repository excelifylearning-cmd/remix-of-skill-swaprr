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
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let aiMessages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];

    // Action-based routing
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
      // General chat mode
      aiMessages = [...aiMessages, ...(messages || [])];
    }

    const useStream = !action; // Only stream for chat mode

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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

    // Non-streaming: return parsed result
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
