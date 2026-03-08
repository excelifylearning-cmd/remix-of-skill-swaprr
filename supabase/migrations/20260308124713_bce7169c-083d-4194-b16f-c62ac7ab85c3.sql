
-- Enterprise tables
CREATE TABLE public.enterprise_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Planning',
  progress integer NOT NULL DEFAULT 0,
  team_size integer NOT NULL DEFAULT 1,
  budget integer NOT NULL DEFAULT 0,
  deadline date,
  priority text NOT NULL DEFAULT 'medium',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.enterprise_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.enterprise_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  candidate_user_id uuid NOT NULL,
  role text NOT NULL DEFAULT '',
  stage text NOT NULL DEFAULT 'Screening',
  posted_at timestamptz NOT NULL DEFAULT now(),
  urgency text NOT NULL DEFAULT 'normal',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.enterprise_consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  expert_user_id uuid,
  expert_name text NOT NULL DEFAULT '',
  topic text NOT NULL DEFAULT '',
  scheduled_date date,
  scheduled_time text DEFAULT '',
  status text NOT NULL DEFAULT 'Pending',
  sp_cost integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Events & Tournaments
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  event_type text NOT NULL DEFAULT 'Workshop',
  category text NOT NULL DEFAULT 'General',
  event_date timestamptz NOT NULL,
  end_date timestamptz,
  time_label text DEFAULT '',
  location text DEFAULT 'Online',
  spots integer,
  spots_filled integer NOT NULL DEFAULT 0,
  prize text,
  icon text NOT NULL DEFAULT 'Calendar',
  is_featured boolean NOT NULL DEFAULT false,
  is_recurring boolean NOT NULL DEFAULT false,
  recurrence_rule text,
  status text NOT NULL DEFAULT 'upcoming',
  tags text[] DEFAULT '{}',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  format text NOT NULL DEFAULT 'Elimination',
  max_teams integer,
  team_size integer NOT NULL DEFAULT 1,
  entry_fee integer NOT NULL DEFAULT 0,
  prize_pool text NOT NULL DEFAULT '0 SP',
  min_elo integer NOT NULL DEFAULT 0,
  min_tier text NOT NULL DEFAULT 'Bronze',
  min_gigs integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'upcoming',
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  registration_deadline timestamptz,
  icon text NOT NULL DEFAULT 'Trophy',
  is_quarterly boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tournament_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES public.tournaments(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  team_name text,
  status text NOT NULL DEFAULT 'registered',
  score integer NOT NULL DEFAULT 0,
  placement integer,
  registered_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'registered',
  registered_at timestamptz NOT NULL DEFAULT now()
);

-- Guild-specific tables for dashboard
CREATE TABLE public.guild_treasury_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id uuid REFERENCES public.guilds(id) ON DELETE CASCADE NOT NULL,
  user_id uuid,
  type text NOT NULL DEFAULT 'deposit',
  amount integer NOT NULL DEFAULT 0,
  reason text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.guild_loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id uuid REFERENCES public.guilds(id) ON DELETE CASCADE NOT NULL,
  borrower_id uuid NOT NULL,
  amount integer NOT NULL DEFAULT 0,
  interest_rate integer NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'active',
  borrowed_at timestamptz NOT NULL DEFAULT now(),
  due_date timestamptz NOT NULL
);

CREATE TABLE public.guild_wars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id uuid REFERENCES public.guilds(id) ON DELETE CASCADE NOT NULL,
  opponent_guild_id uuid REFERENCES public.guilds(id),
  opponent_name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Upcoming',
  start_date timestamptz NOT NULL,
  stakes integer NOT NULL DEFAULT 0,
  our_score integer NOT NULL DEFAULT 0,
  their_score integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.guild_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id uuid REFERENCES public.guilds(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  client text NOT NULL DEFAULT 'Internal',
  status text NOT NULL DEFAULT 'Planning',
  progress integer NOT NULL DEFAULT 0,
  sp_pool integer NOT NULL DEFAULT 0,
  members_count integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS for all new tables
ALTER TABLE public.enterprise_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_treasury_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_wars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_projects ENABLE ROW LEVEL SECURITY;

-- Events & Tournaments: public read
CREATE POLICY "Events viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Tournaments viewable by everyone" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Admins can manage tournaments" ON public.tournaments FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Registrations
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can cancel registration" ON public.event_registrations FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can register for tournaments" ON public.tournament_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Tournament participants viewable by everyone" ON public.tournament_participants FOR SELECT USING (true);
CREATE POLICY "Users can withdraw from tournaments" ON public.tournament_participants FOR DELETE USING (auth.uid() = user_id);

-- Enterprise: owner access
CREATE POLICY "Users can view own enterprise projects" ON public.enterprise_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own enterprise projects" ON public.enterprise_projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own candidates" ON public.enterprise_candidates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own candidates" ON public.enterprise_candidates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own consultations" ON public.enterprise_consultations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own consultations" ON public.enterprise_consultations FOR ALL USING (auth.uid() = user_id);

-- Guild tables: members can view, leaders can manage
CREATE POLICY "Guild treasury viewable by members" ON public.guild_treasury_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM guild_members WHERE guild_members.guild_id = guild_treasury_log.guild_id AND guild_members.user_id = auth.uid())
);
CREATE POLICY "Guild leaders can manage treasury" ON public.guild_treasury_log FOR ALL USING (
  EXISTS (SELECT 1 FROM guild_members WHERE guild_members.guild_id = guild_treasury_log.guild_id AND guild_members.user_id = auth.uid() AND guild_members.role IN ('Guild Master', 'Officer'))
);

CREATE POLICY "Guild loans viewable by members" ON public.guild_loans FOR SELECT USING (
  EXISTS (SELECT 1 FROM guild_members WHERE guild_members.guild_id = guild_loans.guild_id AND guild_members.user_id = auth.uid())
);
CREATE POLICY "Guild leaders can manage loans" ON public.guild_loans FOR ALL USING (
  EXISTS (SELECT 1 FROM guild_members WHERE guild_members.guild_id = guild_loans.guild_id AND guild_members.user_id = auth.uid() AND guild_members.role IN ('Guild Master', 'Officer'))
);

CREATE POLICY "Guild wars viewable by members" ON public.guild_wars FOR SELECT USING (
  EXISTS (SELECT 1 FROM guild_members WHERE guild_members.guild_id = guild_wars.guild_id AND guild_members.user_id = auth.uid())
);
CREATE POLICY "Guild leaders can manage wars" ON public.guild_wars FOR ALL USING (
  EXISTS (SELECT 1 FROM guild_members WHERE guild_members.guild_id = guild_wars.guild_id AND guild_members.user_id = auth.uid() AND guild_members.role IN ('Guild Master', 'Officer'))
);

CREATE POLICY "Guild projects viewable by members" ON public.guild_projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM guild_members WHERE guild_members.guild_id = guild_projects.guild_id AND guild_members.user_id = auth.uid())
);
CREATE POLICY "Guild leaders can manage projects" ON public.guild_projects FOR ALL USING (
  EXISTS (SELECT 1 FROM guild_members WHERE guild_members.guild_id = guild_projects.guild_id AND guild_members.user_id = auth.uid() AND guild_members.role IN ('Guild Master', 'Officer'))
);

-- Admin override for guild tables
CREATE POLICY "Admins can manage guild treasury" ON public.guild_treasury_log FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage guild loans" ON public.guild_loans FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage guild wars" ON public.guild_wars FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage guild projects" ON public.guild_projects FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Indexes
CREATE INDEX idx_events_date ON public.events(event_date);
CREATE INDEX idx_events_type ON public.events(event_type);
CREATE INDEX idx_tournaments_start ON public.tournaments(start_date);
CREATE INDEX idx_tournament_participants_tournament ON public.tournament_participants(tournament_id);
CREATE INDEX idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX idx_enterprise_projects_user ON public.enterprise_projects(user_id);
CREATE INDEX idx_guild_treasury_guild ON public.guild_treasury_log(guild_id);
CREATE INDEX idx_guild_wars_guild ON public.guild_wars(guild_id);
CREATE INDEX idx_guild_projects_guild ON public.guild_projects(guild_id);
CREATE INDEX idx_guild_loans_guild ON public.guild_loans(guild_id);
