
-- Workspace member roles
CREATE TYPE public.workspace_role AS ENUM ('owner', 'editor', 'viewer');

-- Workspace members / invites table
CREATE TABLE public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  role workspace_role NOT NULL DEFAULT 'viewer',
  invited_by UUID,
  invited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Members can view workspace members if they are in the workspace
CREATE POLICY "Members can view workspace members"
  ON public.workspace_members FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'accepted'
    )
    OR user_id = auth.uid()
  );

-- Owners/editors can invite
CREATE POLICY "Owners editors can invite members"
  ON public.workspace_members FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'accepted'
        AND wm.role IN ('owner', 'editor')
    )
    OR invited_by = auth.uid()
  );

-- Users can accept their own invites
CREATE POLICY "Users can accept own invites"
  ON public.workspace_members FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Owners can remove members
CREATE POLICY "Owners can delete members"
  ON public.workspace_members FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'accepted'
        AND wm.role = 'owner'
    )
    OR user_id = auth.uid()
  );

-- Voice messages table
CREATE TABLE public.workspace_voice_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL,
  sender_id UUID NOT NULL,
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  transcript TEXT,
  translated_text JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.workspace_voice_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace participants can view voice messages"
  ON public.workspace_voice_messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members wm
      WHERE wm.workspace_id = workspace_voice_messages.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'accepted'
    )
    OR EXISTS (
      SELECT 1 FROM public.escrow_contracts ec
      WHERE ec.workspace_id = workspace_voice_messages.workspace_id
        AND (ec.buyer_id = auth.uid() OR ec.seller_id = auth.uid())
    )
  );

CREATE POLICY "Participants can send voice messages"
  ON public.workspace_voice_messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Add translated_text column to workspace_messages for auto-translate
ALTER TABLE public.workspace_messages ADD COLUMN IF NOT EXISTS translated_text JSONB DEFAULT '{}'::jsonb;

-- Add requirements columns to workspace_deliverables
ALTER TABLE public.workspace_deliverables ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.workspace_deliverables ADD COLUMN IF NOT EXISTS file_urls TEXT[] DEFAULT '{}';
ALTER TABLE public.workspace_deliverables ADD COLUMN IF NOT EXISTS ai_quality_score NUMERIC DEFAULT NULL;
ALTER TABLE public.workspace_deliverables ADD COLUMN IF NOT EXISTS ai_feedback TEXT DEFAULT NULL;
ALTER TABLE public.workspace_deliverables ADD COLUMN IF NOT EXISTS revision_count INTEGER DEFAULT 0;
ALTER TABLE public.workspace_deliverables ADD COLUMN IF NOT EXISTS max_revisions INTEGER DEFAULT 3;

-- Add file metadata columns to workspace_files
ALTER TABLE public.workspace_files ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'all';
ALTER TABLE public.workspace_files ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.workspace_files ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- Enable realtime for voice messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_voice_messages;
