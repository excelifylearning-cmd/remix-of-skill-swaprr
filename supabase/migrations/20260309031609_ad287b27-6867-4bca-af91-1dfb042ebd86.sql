
-- Create all tables first, then add policies

-- Jury assignments
CREATE TABLE public.jury_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  juror_id uuid NOT NULL,
  juror_type text NOT NULL DEFAULT 'random',
  assigned_at timestamptz NOT NULL DEFAULT now(),
  deadline timestamptz,
  status text NOT NULL DEFAULT 'pending',
  UNIQUE(case_id, juror_id)
);
CREATE INDEX idx_jury_case ON public.jury_assignments(case_id);
CREATE INDEX idx_jury_juror ON public.jury_assignments(juror_id);
ALTER TABLE public.jury_assignments ENABLE ROW LEVEL SECURITY;

-- Jury votes
CREATE TABLE public.jury_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  juror_id uuid NOT NULL,
  vote text NOT NULL DEFAULT 'abstain',
  reasoning text NOT NULL DEFAULT '',
  weight numeric NOT NULL DEFAULT 1.0,
  voted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(case_id, juror_id)
);
CREATE INDEX idx_jury_votes_case ON public.jury_votes(case_id);
ALTER TABLE public.jury_votes ENABLE ROW LEVEL SECURITY;

-- Case evidence
CREATE TABLE public.case_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  submitted_by uuid NOT NULL,
  evidence_type text NOT NULL DEFAULT 'text',
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_case_evidence_case ON public.case_evidence(case_id);
ALTER TABLE public.case_evidence ENABLE ROW LEVEL SECURITY;

-- Case comments
CREATE TABLE public.case_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  content text NOT NULL DEFAULT '',
  is_judge_note boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_case_comments_case ON public.case_comments(case_id);
ALTER TABLE public.case_comments ENABLE ROW LEVEL SECURITY;

-- Support conversations
CREATE TABLE public.support_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  assigned_admin uuid,
  status text NOT NULL DEFAULT 'waiting',
  subject text NOT NULL DEFAULT 'General Support',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_support_conv_user ON public.support_conversations(user_id);
CREATE INDEX idx_support_conv_status ON public.support_conversations(status);
ALTER TABLE public.support_conversations ENABLE ROW LEVEL SECURITY;

-- Support messages
CREATE TABLE public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.support_conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL DEFAULT '',
  is_system boolean NOT NULL DEFAULT false,
  translated_content text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_support_msg_conv ON public.support_messages(conversation_id);
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- ═══ RLS POLICIES ═══

-- jury_assignments
CREATE POLICY "Jurors can view own assignments" ON public.jury_assignments FOR SELECT USING (juror_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Case parties can view jury" ON public.jury_assignments FOR SELECT USING (EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = jury_assignments.case_id AND (d.filed_by = auth.uid() OR d.filed_against = auth.uid())));
CREATE POLICY "Admins can manage jury" ON public.jury_assignments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- jury_votes
CREATE POLICY "Jurors can cast votes" ON public.jury_votes FOR INSERT WITH CHECK (auth.uid() = juror_id AND EXISTS (SELECT 1 FROM public.jury_assignments ja WHERE ja.case_id = jury_votes.case_id AND ja.juror_id = auth.uid() AND ja.status = 'pending'));
CREATE POLICY "Jurors can view own votes" ON public.jury_votes FOR SELECT USING (juror_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Case parties can view votes after resolution" ON public.jury_votes FOR SELECT USING (EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = jury_votes.case_id AND (d.filed_by = auth.uid() OR d.filed_against = auth.uid()) AND d.status IN ('Resolved', 'Closed')));

-- case_evidence
CREATE POLICY "Case parties can view evidence" ON public.case_evidence FOR SELECT USING (EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = case_evidence.case_id AND (d.filed_by = auth.uid() OR d.filed_against = auth.uid())) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Assigned jurors can view evidence" ON public.case_evidence FOR SELECT USING (EXISTS (SELECT 1 FROM public.jury_assignments ja WHERE ja.case_id = case_evidence.case_id AND ja.juror_id = auth.uid()));
CREATE POLICY "Case parties can submit evidence" ON public.case_evidence FOR INSERT WITH CHECK (auth.uid() = submitted_by AND EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = case_evidence.case_id AND (d.filed_by = auth.uid() OR d.filed_against = auth.uid())));

-- case_comments
CREATE POLICY "Case participants can view comments" ON public.case_comments FOR SELECT USING (EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = case_comments.case_id AND (d.filed_by = auth.uid() OR d.filed_against = auth.uid())) OR EXISTS (SELECT 1 FROM public.jury_assignments ja WHERE ja.case_id = case_comments.case_id AND ja.juror_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authenticated users can comment" ON public.case_comments FOR INSERT WITH CHECK (auth.uid() = author_id AND (EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = case_comments.case_id AND (d.filed_by = auth.uid() OR d.filed_against = auth.uid())) OR EXISTS (SELECT 1 FROM public.jury_assignments ja WHERE ja.case_id = case_comments.case_id AND ja.juror_id = auth.uid())));

-- support_conversations
CREATE POLICY "Users can view own conversations" ON public.support_conversations FOR SELECT USING (user_id = auth.uid() OR assigned_admin = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can create conversations" ON public.support_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage conversations" ON public.support_conversations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR assigned_admin = auth.uid());
CREATE POLICY "Users can update own conversations" ON public.support_conversations FOR UPDATE USING (user_id = auth.uid());

-- support_messages
CREATE POLICY "Conversation participants can view messages" ON public.support_messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.support_conversations sc WHERE sc.id = support_messages.conversation_id AND (sc.user_id = auth.uid() OR sc.assigned_admin = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))));
CREATE POLICY "Conversation participants can send messages" ON public.support_messages FOR INSERT WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.support_conversations sc WHERE sc.id = support_messages.conversation_id AND (sc.user_id = auth.uid() OR sc.assigned_admin = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_conversations;
