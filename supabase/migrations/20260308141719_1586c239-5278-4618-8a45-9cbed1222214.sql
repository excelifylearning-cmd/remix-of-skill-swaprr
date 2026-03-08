
-- Feature comments table
CREATE TABLE public.feature_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id uuid NOT NULL REFERENCES public.feature_requests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  user_name text NOT NULL DEFAULT 'Anonymous',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_feature_comments_feature ON public.feature_comments(feature_id);
CREATE INDEX idx_feature_comments_user ON public.feature_comments(user_id);

ALTER TABLE public.feature_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Feature comments viewable by everyone" ON public.feature_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON public.feature_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authors can delete own comments" ON public.feature_comments FOR DELETE USING (auth.uid() = user_id);

-- Help articles table
CREATE TABLE public.help_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'General',
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL DEFAULT '',
  excerpt text DEFAULT '',
  tags text[] DEFAULT '{}',
  view_count integer NOT NULL DEFAULT 0,
  helpful_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_help_articles_category ON public.help_articles(category);
CREATE INDEX idx_help_articles_slug ON public.help_articles(slug);

ALTER TABLE public.help_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Help articles viewable by everyone" ON public.help_articles FOR SELECT USING (true);
CREATE POLICY "Admins can manage help articles" ON public.help_articles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Service status table
CREATE TABLE public.service_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'operational',
  uptime numeric NOT NULL DEFAULT 99.99,
  latency text NOT NULL DEFAULT '0ms',
  icon text NOT NULL DEFAULT 'Server',
  region text NOT NULL DEFAULT 'Global',
  last_checked_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.service_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service status viewable by everyone" ON public.service_status FOR SELECT USING (true);
CREATE POLICY "Admins can manage service status" ON public.service_status FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Incidents table
CREATE TABLE public.service_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  severity text NOT NULL DEFAULT 'minor',
  status text NOT NULL DEFAULT 'investigating',
  duration text DEFAULT '',
  started_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.service_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Incidents viewable by everyone" ON public.service_incidents FOR SELECT USING (true);
CREATE POLICY "Admins can manage incidents" ON public.service_incidents FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed service statuses
INSERT INTO public.service_status (name, status, uptime, latency, icon, region) VALUES
  ('Marketplace', 'operational', 99.98, '42ms', 'Package', 'Global'),
  ('Messenger', 'operational', 99.95, '18ms', 'MessageSquare', 'US-East, EU-West'),
  ('Video Calls', 'degraded', 99.90, '65ms', 'Video', 'Global'),
  ('Skill Court', 'operational', 99.99, '31ms', 'Shield', 'US-East'),
  ('API Gateway', 'operational', 99.97, '12ms', 'Server', 'Multi-region'),
  ('SP Payments', 'operational', 99.99, '89ms', 'Zap', 'Global'),
  ('File Storage', 'operational', 99.96, '55ms', 'HardDrive', 'US-East, AP-South'),
  ('Auth Service', 'operational', 99.99, '8ms', 'Key', 'Global'),
  ('Search & Index', 'operational', 99.94, '35ms', 'Search', 'US-East'),
  ('Notifications', 'operational', 99.92, '22ms', 'Activity', 'Global'),
  ('CDN / Assets', 'operational', 99.99, '6ms', 'Cloud', '200+ PoPs'),
  ('Database', 'operational', 99.99, '3ms', 'Database', 'US-East (primary)');

-- Seed incidents
INSERT INTO public.service_incidents (title, severity, status, duration, started_at) VALUES
  ('Video call CDN optimization rollout', 'minor', 'Monitoring', 'Ongoing', now() - interval '1 day'),
  ('Messenger latency spike — EU region', 'minor', 'Resolved', '12 min', now() - interval '3 days'),
  ('Scheduled maintenance — Database migration v4.2', 'maintenance', 'Completed', '45 min', now() - interval '8 days'),
  ('Video call CDN degradation — AP-South', 'minor', 'Resolved', '28 min', now() - interval '21 days'),
  ('Search indexing delay — new gigs', 'major', 'Resolved', '2h 15m', now() - interval '34 days'),
  ('Scheduled maintenance — Auth service upgrade', 'maintenance', 'Completed', '15 min', now() - interval '47 days');

-- Seed help articles
INSERT INTO public.help_articles (category, title, slug, excerpt, tags) VALUES
  ('Getting Started', 'Create your account', 'create-your-account', 'Step-by-step guide to creating and verifying your SkillSwappr account.', '{"account","signup","getting-started"}'),
  ('Getting Started', 'Set up your profile', 'set-up-your-profile', 'Complete your profile with skills, bio, and portfolio to attract swaps.', '{"profile","setup","getting-started"}'),
  ('Getting Started', 'Post your first gig', 'post-your-first-gig', 'Learn how to create and publish your first skill gig on the marketplace.', '{"gig","marketplace","getting-started"}'),
  ('Getting Started', 'Earn your first SP', 'earn-your-first-sp', 'Quick ways to earn your first Skill Points and start swapping.', '{"sp","earning","getting-started"}'),
  ('Skill Points', 'How SP works', 'how-sp-works', 'Understanding the Skill Points economy, earning, spending, and transfers.', '{"sp","economy","points"}'),
  ('Skill Points', 'Tax brackets explained', 'tax-brackets-explained', 'How progressive taxation works on SP transactions and why it matters.', '{"sp","tax","economy"}'),
  ('Skill Points', 'Buy SP packages', 'buy-sp-packages', 'Premium SP packages for accelerated growth and enterprise needs.', '{"sp","packages","premium"}'),
  ('Skill Points', 'Transfer limits', 'transfer-limits', 'Daily and monthly SP transfer limits by tier and how to increase them.', '{"sp","transfer","limits"}'),
  ('Gig Workspace', 'Start a video call', 'start-a-video-call', 'How to initiate and manage video calls within gig workspaces.', '{"video","workspace","calls"}'),
  ('Gig Workspace', 'Use the whiteboard', 'use-the-whiteboard', 'Collaborate in real-time with the built-in whiteboard tool.', '{"whiteboard","workspace","collaboration"}'),
  ('Gig Workspace', 'Share files securely', 'share-files-securely', 'Upload and share files with end-to-end encryption in workspaces.', '{"files","security","workspace"}'),
  ('Gig Workspace', 'AI assistant tips', 'ai-assistant-tips', 'Get the most out of the AI assistant during your gig sessions.', '{"ai","assistant","workspace"}'),
  ('Skill Court', 'File a dispute', 'file-a-dispute', 'Step-by-step guide to filing a dispute in Skill Court.', '{"dispute","court","filing"}'),
  ('Skill Court', 'Become a judge', 'become-a-judge', 'Requirements and process to become a Skill Court judge.', '{"judge","court","community"}'),
  ('Skill Court', 'Appeal a verdict', 'appeal-a-verdict', 'How to appeal a Skill Court verdict and what to expect.', '{"appeal","court","verdict"}'),
  ('Skill Court', 'Evidence guidelines', 'evidence-guidelines', 'What counts as valid evidence and how to submit it properly.', '{"evidence","court","guidelines"}'),
  ('Account & Settings', 'Two-factor auth', 'two-factor-auth', 'Enable and manage two-factor authentication for your account.', '{"2fa","security","account"}'),
  ('Account & Settings', 'Export your data', 'export-your-data', 'Download all your data including profile, gigs, and transaction history.', '{"data","export","privacy"}'),
  ('Account & Settings', 'Delete account', 'delete-account', 'How to permanently delete your account and all associated data.', '{"delete","account","privacy"}'),
  ('Account & Settings', 'Notification prefs', 'notification-prefs', 'Customize which notifications you receive and how.', '{"notifications","settings","preferences"}'),
  ('Guilds & Teams', 'Create a guild', 'create-a-guild', 'Found your own guild and start building a community.', '{"guild","create","community"}'),
  ('Guilds & Teams', 'Invite members', 'invite-members', 'How to invite and onboard new members to your guild.', '{"guild","invite","members"}'),
  ('Guilds & Teams', 'Guild treasury', 'guild-treasury', 'Managing the shared SP treasury and loan system.', '{"guild","treasury","sp"}'),
  ('Guilds & Teams', 'Rank system', 'rank-system', 'Understanding guild ranks, promotions, and permissions.', '{"guild","ranks","permissions"}'),
  ('Marketplace', 'Search filters', 'search-filters', 'Use advanced filters to find exactly the skills you need.', '{"search","filters","marketplace"}'),
  ('Marketplace', 'Category tags', 'category-tags', 'Browse by category and use tags to discover relevant gigs.', '{"categories","tags","marketplace"}'),
  ('Marketplace', 'Save favorites', 'save-favorites', 'Bookmark gigs and profiles for quick access later.', '{"favorites","bookmarks","marketplace"}'),
  ('Marketplace', 'Gig analytics', 'gig-analytics', 'Track views, inquiries, and performance of your listings.', '{"analytics","gigs","marketplace"}'),
  ('Security & Privacy', 'Password security', 'password-security', 'Best practices for keeping your account password secure.', '{"password","security","account"}'),
  ('Security & Privacy', 'Session management', 'session-management', 'View and manage active sessions across your devices.', '{"sessions","security","devices"}'),
  ('Security & Privacy', 'Data encryption', 'data-encryption', 'How we encrypt your data at rest and in transit.', '{"encryption","security","privacy"}'),
  ('Security & Privacy', 'Report abuse', 'report-abuse', 'How to report abusive behavior or content on the platform.', '{"report","abuse","safety"}'),
  ('Video Tutorials', 'Platform tour', 'platform-tour', 'A guided tour of all major platform features and navigation.', '{"tutorial","tour","getting-started"}'),
  ('Video Tutorials', 'Gig walkthrough', 'gig-walkthrough', 'End-to-end walkthrough of creating and completing a gig.', '{"tutorial","gig","walkthrough"}'),
  ('Video Tutorials', 'Court demo', 'court-demo', 'See how a Skill Court case is filed, reviewed, and resolved.', '{"tutorial","court","demo"}'),
  ('Video Tutorials', 'Guild setup', 'guild-setup', 'Video guide to creating and configuring your guild.', '{"tutorial","guild","setup"}');
