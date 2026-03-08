
-- 1. escrow_contracts (created first since other tables reference it in RLS)
CREATE TABLE public.escrow_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id text NOT NULL,
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  total_sp int NOT NULL DEFAULT 0,
  released_sp int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'held',
  terms jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_escrow_workspace ON public.escrow_contracts(workspace_id);
CREATE INDEX idx_escrow_buyer ON public.escrow_contracts(buyer_id);
CREATE INDEX idx_escrow_seller ON public.escrow_contracts(seller_id);
ALTER TABLE public.escrow_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view escrow" ON public.escrow_contracts FOR SELECT TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());
CREATE POLICY "Participants can update escrow" ON public.escrow_contracts FOR UPDATE TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());
CREATE POLICY "Authenticated users can create escrow" ON public.escrow_contracts FOR INSERT TO authenticated
  WITH CHECK (buyer_id = auth.uid() OR seller_id = auth.uid());
CREATE POLICY "Admins can manage all escrow" ON public.escrow_contracts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. workspace_stages
CREATE TABLE public.workspace_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id text NOT NULL,
  name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'locked',
  sp_allocated int NOT NULL DEFAULT 0,
  order_index int NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_workspace_stages_workspace ON public.workspace_stages(workspace_id, order_index);
ALTER TABLE public.workspace_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view workspace stages" ON public.workspace_stages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.escrow_contracts ec WHERE ec.workspace_id = workspace_stages.workspace_id AND (ec.buyer_id = auth.uid() OR ec.seller_id = auth.uid())));
CREATE POLICY "Participants can update workspace stages" ON public.workspace_stages FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.escrow_contracts ec WHERE ec.workspace_id = workspace_stages.workspace_id AND (ec.buyer_id = auth.uid() OR ec.seller_id = auth.uid())));
CREATE POLICY "Admins can manage all stages" ON public.workspace_stages FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. workspace_messages (references escrow_contracts in RLS)
CREATE TABLE public.workspace_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id text NOT NULL,
  sender_id uuid NOT NULL,
  content text NOT NULL DEFAULT '',
  message_type text NOT NULL DEFAULT 'text',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_workspace_messages_workspace ON public.workspace_messages(workspace_id, created_at DESC);
CREATE INDEX idx_workspace_messages_sender ON public.workspace_messages(sender_id);
ALTER TABLE public.workspace_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view workspace messages" ON public.workspace_messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.escrow_contracts ec WHERE ec.workspace_id = workspace_messages.workspace_id AND (ec.buyer_id = auth.uid() OR ec.seller_id = auth.uid())) OR sender_id = auth.uid());
CREATE POLICY "Authenticated users can send messages" ON public.workspace_messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Admins can view all messages" ON public.workspace_messages FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_messages;

-- 4. workspace_files
CREATE TABLE public.workspace_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id text NOT NULL,
  uploaded_by uuid NOT NULL,
  file_name text NOT NULL DEFAULT '',
  file_url text NOT NULL DEFAULT '',
  file_size text NOT NULL DEFAULT '0',
  file_type text NOT NULL DEFAULT 'file',
  version int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_workspace_files_workspace ON public.workspace_files(workspace_id, created_at DESC);
ALTER TABLE public.workspace_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view workspace files" ON public.workspace_files FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.escrow_contracts ec WHERE ec.workspace_id = workspace_files.workspace_id AND (ec.buyer_id = auth.uid() OR ec.seller_id = auth.uid())) OR uploaded_by = auth.uid());
CREATE POLICY "Authenticated users can upload files" ON public.workspace_files FOR INSERT TO authenticated
  WITH CHECK (uploaded_by = auth.uid());
CREATE POLICY "Admins can view all files" ON public.workspace_files FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. workspace_disputes
CREATE TABLE public.workspace_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id text NOT NULL,
  filed_by uuid NOT NULL,
  filed_against uuid NOT NULL,
  reason text NOT NULL DEFAULT '',
  evidence jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'open',
  outcome text,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);
CREATE INDEX idx_workspace_disputes_workspace ON public.workspace_disputes(workspace_id);
ALTER TABLE public.workspace_disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dispute parties can view" ON public.workspace_disputes FOR SELECT TO authenticated
  USING (filed_by = auth.uid() OR filed_against = auth.uid());
CREATE POLICY "Authenticated users can file disputes" ON public.workspace_disputes FOR INSERT TO authenticated
  WITH CHECK (filed_by = auth.uid());
CREATE POLICY "Admins can manage all disputes" ON public.workspace_disputes FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. workspace_deliverables
CREATE TABLE public.workspace_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id text NOT NULL,
  submitted_by uuid NOT NULL,
  stage_id uuid REFERENCES public.workspace_stages(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  file_urls jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  reviewer_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_workspace_deliverables_workspace ON public.workspace_deliverables(workspace_id);
ALTER TABLE public.workspace_deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view deliverables" ON public.workspace_deliverables FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.escrow_contracts ec WHERE ec.workspace_id = workspace_deliverables.workspace_id AND (ec.buyer_id = auth.uid() OR ec.seller_id = auth.uid())) OR submitted_by = auth.uid());
CREATE POLICY "Authenticated users can submit deliverables" ON public.workspace_deliverables FOR INSERT TO authenticated
  WITH CHECK (submitted_by = auth.uid());
CREATE POLICY "Participants can update deliverables" ON public.workspace_deliverables FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.escrow_contracts ec WHERE ec.workspace_id = workspace_deliverables.workspace_id AND (ec.buyer_id = auth.uid() OR ec.seller_id = auth.uid())));
CREATE POLICY "Admins can manage all deliverables" ON public.workspace_deliverables FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('workspace-files', 'workspace-files', true);

CREATE POLICY "Authenticated users can upload workspace files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'workspace-files');
CREATE POLICY "Anyone can view workspace files" ON storage.objects FOR SELECT
  USING (bucket_id = 'workspace-files');
CREATE POLICY "Owners can delete workspace files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'workspace-files' AND (storage.foldername(name))[1] = auth.uid()::text);
