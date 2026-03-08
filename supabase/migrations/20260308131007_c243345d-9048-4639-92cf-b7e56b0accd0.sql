
-- Transactions table for gig transaction records
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'Pending',
  gig_title text NOT NULL DEFAULT '',
  format text NOT NULL DEFAULT 'Direct Swap',
  category text NOT NULL DEFAULT '',
  date timestamptz NOT NULL DEFAULT now(),
  completed_date timestamptz,
  duration text DEFAULT '',
  seller_id uuid,
  buyer_id uuid,
  seller_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  buyer_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  points jsonb NOT NULL DEFAULT '{}'::jsonb,
  stages jsonb NOT NULL DEFAULT '[]'::jsonb,
  quality jsonb NOT NULL DEFAULT '{}'::jsonb,
  workspace jsonb NOT NULL DEFAULT '{}'::jsonb,
  deliverables jsonb NOT NULL DEFAULT '[]'::jsonb,
  escrow jsonb NOT NULL DEFAULT '{}'::jsonb,
  security_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  compliance jsonb NOT NULL DEFAULT '{}'::jsonb,
  skill_impact jsonb NOT NULL DEFAULT '{}'::jsonb,
  performance jsonb NOT NULL DEFAULT '{}'::jsonb,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  communication_heatmap jsonb NOT NULL DEFAULT '[]'::jsonb,
  device_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_insights jsonb NOT NULL DEFAULT '[]'::jsonb,
  comments jsonb NOT NULL DEFAULT '[]'::jsonb,
  timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  fingerprint text DEFAULT '',
  blockchain_hash text DEFAULT '',
  dispute_history text DEFAULT 'None',
  satisfaction_survey jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Transactions viewable by everyone" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Admins can manage transactions" ON public.transactions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_transactions_code ON public.transactions(code);
CREATE INDEX idx_transactions_seller ON public.transactions(seller_id);
CREATE INDEX idx_transactions_buyer ON public.transactions(buyer_id);

-- Platform metrics for analytics dashboard
CREATE TABLE public.platform_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date date NOT NULL DEFAULT CURRENT_DATE,
  total_users integer NOT NULL DEFAULT 0,
  total_gigs integer NOT NULL DEFAULT 0,
  points_circulated bigint NOT NULL DEFAULT 0,
  active_guilds integer NOT NULL DEFAULT 0,
  avg_satisfaction numeric(3,2) NOT NULL DEFAULT 0,
  disputes_resolved integer NOT NULL DEFAULT 0,
  universities integer NOT NULL DEFAULT 0,
  enterprise_clients integer NOT NULL DEFAULT 0,
  monthly_signups integer NOT NULL DEFAULT 0,
  monthly_revenue text DEFAULT '$0',
  format_distribution jsonb NOT NULL DEFAULT '{}'::jsonb,
  economy_health jsonb NOT NULL DEFAULT '[]'::jsonb,
  revenue_breakdown jsonb NOT NULL DEFAULT '[]'::jsonb,
  retention_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  community_impact jsonb NOT NULL DEFAULT '{}'::jsonb,
  platform_uptime jsonb NOT NULL DEFAULT '[]'::jsonb,
  content_metrics jsonb NOT NULL DEFAULT '[]'::jsonb,
  hall_of_fame jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(metric_date)
);
ALTER TABLE public.platform_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Platform metrics viewable by everyone" ON public.platform_metrics FOR SELECT USING (true);
CREATE POLICY "Admins can manage platform metrics" ON public.platform_metrics FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Quarterly reports
CREATE TABLE public.quarterly_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quarter_id text NOT NULL UNIQUE,
  label text NOT NULL DEFAULT '',
  period text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'projected',
  kpis jsonb NOT NULL DEFAULT '{}'::jsonb,
  growth jsonb NOT NULL DEFAULT '{}'::jsonb,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  monthly_breakdown jsonb NOT NULL DEFAULT '[]'::jsonb,
  top_skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.quarterly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quarterly reports viewable by everyone" ON public.quarterly_reports FOR SELECT USING (true);
CREATE POLICY "Admins can manage quarterly reports" ON public.quarterly_reports FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Ranking history for leaderboard
CREATE TABLE public.ranking_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  category text NOT NULL DEFAULT 'global',
  rankings jsonb NOT NULL DEFAULT '[]'::jsonb,
  changes jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ranking_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ranking history viewable by everyone" ON public.ranking_history FOR SELECT USING (true);
CREATE POLICY "Admins can manage ranking history" ON public.ranking_history FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_ranking_history_date ON public.ranking_history(snapshot_date DESC);
CREATE INDEX idx_ranking_history_category ON public.ranking_history(category);

-- Leaderboard achievements feed
CREATE TABLE public.leaderboard_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL DEFAULT '',
  badge text NOT NULL DEFAULT '',
  achieved_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.leaderboard_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leaderboard achievements viewable by everyone" ON public.leaderboard_achievements FOR SELECT USING (true);
CREATE POLICY "Admins can manage leaderboard achievements" ON public.leaderboard_achievements FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
