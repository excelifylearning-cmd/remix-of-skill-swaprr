
CREATE TABLE public.workspaces (
  id text PRIMARY KEY,
  listing_id uuid REFERENCES public.listings(id) ON DELETE SET NULL,
  workspace_type text NOT NULL DEFAULT 'direct_swap',
  title text NOT NULL DEFAULT '',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Members of workspace can view
CREATE POLICY "Workspace members can view" ON public.workspaces
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.workspace_members wm
      WHERE wm.workspace_id = workspaces.id AND wm.user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Creator can manage
CREATE POLICY "Creator can manage workspace" ON public.workspaces
  FOR ALL TO authenticated
  USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Authenticated can create
CREATE POLICY "Authenticated users can create workspaces" ON public.workspaces
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
