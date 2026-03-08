
-- Performance indexes for scaling
CREATE INDEX IF NOT EXISTS idx_profiles_elo_desc ON public.profiles (elo DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_university ON public.profiles (university) WHERE university IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON public.profiles (tier);
CREATE INDEX IF NOT EXISTS idx_profiles_sp_desc ON public.profiles (sp DESC);
CREATE INDEX IF NOT EXISTS idx_guilds_avg_elo_desc ON public.guilds (avg_elo DESC);
CREATE INDEX IF NOT EXISTS idx_listings_status_views ON public.listings (status, views DESC);
CREATE INDEX IF NOT EXISTS idx_page_sessions_page_path ON public.page_sessions (page_path);
CREATE INDEX IF NOT EXISTS idx_page_sessions_created_at ON public.page_sessions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_click_heatmap_created_at ON public.click_heatmap (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_log_created_at ON public.error_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_metrics_date ON public.platform_metrics (metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_quarterly_reports_qid ON public.quarterly_reports (quarter_id);
CREATE INDEX IF NOT EXISTS idx_guild_members_guild_id ON public.guild_members (guild_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_achievements_at ON public.leaderboard_achievements (achieved_at DESC);
