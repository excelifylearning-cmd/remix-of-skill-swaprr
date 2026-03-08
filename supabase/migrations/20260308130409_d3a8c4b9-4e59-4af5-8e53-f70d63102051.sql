
-- Enterprise quote requests table
CREATE TABLE public.enterprise_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  team_size text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'pricing',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.enterprise_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit enterprise quotes" ON public.enterprise_quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view enterprise quotes" ON public.enterprise_quotes FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Demo booking requests table
CREATE TABLE public.demo_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  company_name text NOT NULL DEFAULT '',
  team_size text NOT NULL DEFAULT '',
  use_case text NOT NULL DEFAULT '',
  message text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.demo_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit demo bookings" ON public.demo_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view demo bookings" ON public.demo_bookings FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Help feedback table
CREATE TABLE public.help_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rating text NOT NULL DEFAULT '',
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.help_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit feedback" ON public.help_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view feedback" ON public.help_feedback FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Bug bounty submissions table
CREATE TABLE public.bug_bounty_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  severity text NOT NULL DEFAULT 'low',
  status text NOT NULL DEFAULT 'submitted',
  reward text DEFAULT '',
  submitted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bug_bounty_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can lookup bounties" ON public.bug_bounty_submissions FOR SELECT USING (true);
CREATE POLICY "Admins can manage bounties" ON public.bug_bounty_submissions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authenticated users can submit bounties" ON public.bug_bounty_submissions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Changelog entries table
CREATE TABLE public.changelog_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  highlight text,
  changes jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.changelog_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Changelog viewable by everyone" ON public.changelog_entries FOR SELECT USING (true);
CREATE POLICY "Admins can manage changelog" ON public.changelog_entries FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
