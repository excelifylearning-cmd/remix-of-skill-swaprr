
-- ==============================================
-- TELEMETRY TABLES: page_sessions, click_heatmap, error_log
-- ==============================================

-- 1. page_sessions — per-page visit with timing & engagement
CREATE TABLE public.page_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid NULL,
  page_path text NOT NULL,
  page_title text NOT NULL DEFAULT '',
  entered_at timestamptz NOT NULL DEFAULT now(),
  exited_at timestamptz NULL,
  duration_seconds numeric NULL DEFAULT 0,
  scroll_depth_max integer NOT NULL DEFAULT 0,
  scroll_depth_avg numeric NOT NULL DEFAULT 0,
  clicks_count integer NOT NULL DEFAULT 0,
  rage_clicks_count integer NOT NULL DEFAULT 0,
  mouse_distance_px numeric NOT NULL DEFAULT 0,
  keypresses_count integer NOT NULL DEFAULT 0,
  visibility_hidden_seconds numeric NOT NULL DEFAULT 0,
  idle_seconds numeric NOT NULL DEFAULT 0,
  engagement_score numeric NOT NULL DEFAULT 0,
  metadata jsonb NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page sessions"
  ON public.page_sessions FOR INSERT
  WITH CHECK (
    CASE
      WHEN auth.uid() IS NOT NULL THEN (user_id = auth.uid() OR user_id IS NULL)
      ELSE user_id IS NULL
    END
  );

CREATE POLICY "Admins can view all page sessions"
  ON public.page_sessions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own page sessions"
  ON public.page_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX idx_page_sessions_session_id ON public.page_sessions(session_id);
CREATE INDEX idx_page_sessions_user_id ON public.page_sessions(user_id);
CREATE INDEX idx_page_sessions_page_path ON public.page_sessions(page_path);
CREATE INDEX idx_page_sessions_entered_at ON public.page_sessions(entered_at);

-- 2. click_heatmap — every click with coordinates
CREATE TABLE public.click_heatmap (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid NULL,
  page_path text NOT NULL,
  x_percent numeric NOT NULL DEFAULT 0,
  y_percent numeric NOT NULL DEFAULT 0,
  element_tag text NULL,
  element_id text NULL,
  element_class text NULL,
  element_text text NULL,
  is_rage_click boolean NOT NULL DEFAULT false,
  is_dead_click boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.click_heatmap ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert click heatmap"
  ON public.click_heatmap FOR INSERT
  WITH CHECK (
    CASE
      WHEN auth.uid() IS NOT NULL THEN (user_id = auth.uid() OR user_id IS NULL)
      ELSE user_id IS NULL
    END
  );

CREATE POLICY "Admins can view click heatmap"
  ON public.click_heatmap FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_click_heatmap_session_id ON public.click_heatmap(session_id);
CREATE INDEX idx_click_heatmap_page_path ON public.click_heatmap(page_path);
CREATE INDEX idx_click_heatmap_created_at ON public.click_heatmap(created_at);

-- 3. error_log — JS errors, unhandled rejections, network failures
CREATE TABLE public.error_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid NULL,
  page_path text NOT NULL,
  error_type text NOT NULL DEFAULT 'js_error',
  message text NOT NULL DEFAULT '',
  stack text NULL,
  filename text NULL,
  line_number integer NULL,
  col_number integer NULL,
  metadata jsonb NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.error_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert error logs"
  ON public.error_log FOR INSERT
  WITH CHECK (
    CASE
      WHEN auth.uid() IS NOT NULL THEN (user_id = auth.uid() OR user_id IS NULL)
      ELSE user_id IS NULL
    END
  );

CREATE POLICY "Admins can view error logs"
  ON public.error_log FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own error logs"
  ON public.error_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX idx_error_log_session_id ON public.error_log(session_id);
CREATE INDEX idx_error_log_error_type ON public.error_log(error_type);
CREATE INDEX idx_error_log_created_at ON public.error_log(created_at);
