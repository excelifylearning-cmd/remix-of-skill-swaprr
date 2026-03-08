
-- Feature requests table for voting
CREATE TABLE public.feature_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'tools',
  votes integer NOT NULL DEFAULT 0,
  comments integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open',
  hot boolean NOT NULL DEFAULT false,
  icon text NOT NULL DEFAULT 'Zap',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Feature requests viewable by everyone" ON public.feature_requests FOR SELECT USING (true);
CREATE POLICY "Admins can manage feature requests" ON public.feature_requests FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Feature votes table
CREATE TABLE public.feature_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id uuid NOT NULL REFERENCES public.feature_requests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(feature_id, user_id)
);

ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own votes" ON public.feature_votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can vote" ON public.feature_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own votes" ON public.feature_votes FOR DELETE USING (auth.uid() = user_id);

-- Contact submissions table
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  topic text NOT NULL DEFAULT 'General Inquiry',
  subject text,
  priority text NOT NULL DEFAULT 'Low',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own submissions" ON public.contact_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage submissions" ON public.contact_submissions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Help reports table
CREATE TABLE public.help_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  report_type text NOT NULL,
  priority text NOT NULL DEFAULT 'low',
  description text NOT NULL,
  reference_id text,
  email text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.help_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit reports" ON public.help_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own reports" ON public.help_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage reports" ON public.help_reports FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed feature requests
INSERT INTO public.feature_requests (title, description, category, votes, comments, status, hot, icon) VALUES
  ('AI-Powered Skill Recommendations', 'Smart suggestions for skills to learn based on your profile, goals, and market demand.', 'ai', 342, 28, 'planned', true, 'Bot'),
  ('Real-Time Collaboration Chat', 'Built-in messaging with file sharing, code snippets, and video calls during gigs.', 'social', 289, 45, 'in-progress', false, 'MessageSquare'),
  ('Portfolio Templates', 'Pre-designed portfolio layouts that showcase your work beautifully without design skills.', 'tools', 267, 19, 'under-review', true, 'Palette'),
  ('Offline Mode for Mobile', 'View saved gigs, draft proposals, and manage tasks without an internet connection.', 'mobile', 231, 12, 'open', false, 'Smartphone'),
  ('Team Skill Matrix', 'Visualize your teams collective strengths and gaps with an interactive skill matrix.', 'enterprise', 198, 22, 'planned', false, 'Users'),
  ('Auto-Translation for Gig Listings', 'AI-powered translation so gigs reach a global audience in 12+ languages.', 'ai', 187, 31, 'under-review', false, 'Globe'),
  ('Skill Verification Badges', 'Third-party verified badges for skills through tests, certifications, or peer review.', 'social', 176, 14, 'open', false, 'Shield'),
  ('Advanced Analytics Export', 'Export your performance data as CSV/PDF for reports, tax filing, or portfolio reviews.', 'tools', 154, 8, 'open', false, 'BarChart3'),
  ('Push Notifications', 'Customizable push notifications for gig updates, messages, and milestone alerts.', 'mobile', 143, 17, 'planned', false, 'Smartphone'),
  ('SSO & SAML Integration', 'Enterprise single sign-on support for seamless team onboarding.', 'enterprise', 132, 6, 'under-review', false, 'Briefcase'),
  ('AI Gig Pricing Advisor', 'Get smart pricing suggestions based on skill rarity, complexity, and market rates.', 'ai', 128, 21, 'open', true, 'TrendingUp'),
  ('Guild Mentorship Program', 'Senior guild members can mentor juniors with structured learning paths and milestones.', 'social', 119, 33, 'open', false, 'Users');
