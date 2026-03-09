

# Portability Audit + Live Chat Enhancement

## Part 1: Lovable-Specific Dependencies to Abstract

There are 5 Lovable-specific lock-in points in the codebase that will break on Netlify/self-hosted:

### 1. Google OAuth via `@lovable.dev/cloud-auth-js`
**File**: `src/integrations/lovable/index.ts` → imported in `LoginPage.tsx`
- Replace with standard `supabase.auth.signInWithOAuth({ provider: 'google' })` which works on any Supabase instance
- Update `LoginPage.tsx` to use the standard Supabase OAuth flow instead of the Lovable wrapper
- The `src/integrations/lovable/index.ts` file becomes unnecessary — we'll create a portable `src/lib/oauth.ts` that wraps `supabase.auth.signInWithOAuth`

### 2. `lovable-tagger` in vite.config.ts
- Already guarded with `mode === "development"` so it won't break production builds, but we'll add a try/catch or optional import so it gracefully degrades if the package isn't installed

### 3. AI Gateway URL hardcoded in edge functions
**Files**: `supabase/functions/ai-chat/index.ts`, `supabase/functions/workspace-ai/index.ts`
- Both use `https://ai.gateway.lovable.dev/v1/chat/completions` with `LOVABLE_API_KEY`
- Make this configurable: check for `AI_PROVIDER_URL` env var first, then fall back to OpenAI's standard endpoint
- The `ai-chat` function already has a fallback to OpenAI — extend this pattern to `workspace-ai` too
- This way, self-hosters just set `AI_CHAT_API_KEY` to their OpenAI key and it works

### 4. "Powered by Lovable AI" branding
**File**: `WorkspacePage.tsx` line 1116
- Change to "AI Powered" (neutral)

### 5. MIGRATION.md update
- Document the new env vars needed for self-hosting AI features (`AI_CHAT_API_KEY` or `OPENAI_API_KEY`)
- Document Google OAuth setup (Supabase dashboard → Auth → Providers → Google)

---

## Part 2: Enhanced Live Chat Widget

Current widget is minimal — small, basic styling, no features beyond text chat. Enhancements:

### Visual Overhaul
- **Larger chat window**: 380px wide, 500px tall (was 340x420)
- **Glassmorphic header** with gradient accent bar
- **Animated typing indicator** with "SkillBot is thinking..." text
- **Message timestamps** on each bubble
- **Markdown rendering** for bot responses (bold, lists, code blocks) using simple regex parsing
- **Quick action chips** below the initial greeting: "How do SP work?", "Report a bug", "Find a gig", "Pricing help"
- **Sound notification** option toggle
- **Chat history clear** button in header
- **Resize handle** to expand/collapse height
- **Mobile-responsive**: full-width on small screens

### Floating Button Enhancement
- **Pulse animation** on first visit (attention-grabbing ring pulse)
- **Unread badge** counter when chat is closed and bot has responded
- **Tooltip** on hover: "Chat with SkillBot"

### Functional Improvements
- **Quick action chips** that pre-fill common questions
- **Error retry** button when a message fails
- **Character count** indicator (optional)
- **"New conversation"** button to reset chat

---

## Files to Create/Edit

| # | Action | File |
|---|--------|------|
| 1 | Create | `src/lib/oauth.ts` — portable OAuth wrapper using standard Supabase auth |
| 2 | Edit | `src/features/auth/LoginPage.tsx` — replace lovable import with portable oauth |
| 3 | Edit | `supabase/functions/ai-chat/index.ts` — make AI gateway URL configurable |
| 4 | Edit | `supabase/functions/workspace-ai/index.ts` — same configurable gateway pattern |
| 5 | Edit | `src/features/workspace/WorkspacePage.tsx` — neutral branding |
| 6 | Rewrite | `src/components/shared/LiveChatWidget.tsx` — full enhancement |
| 7 | Edit | `vite.config.ts` — graceful lovable-tagger degradation |
| 8 | Edit | `MIGRATION.md` — document AI + OAuth self-hosting steps |

