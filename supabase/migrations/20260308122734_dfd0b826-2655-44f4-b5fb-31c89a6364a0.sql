
-- ═══════════════════════════════════════
-- BADGES (system-defined)
-- ═══════════════════════════════════════
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '⭐',
  category text NOT NULL DEFAULT 'general',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are viewable by everyone" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Admins can manage badges" ON public.badges FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ═══════════════════════════════════════
-- USER_BADGES (junction)
-- ═══════════════════════════════════════
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User badges viewable by everyone" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users can view own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage user badges" ON public.user_badges FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ═══════════════════════════════════════
-- ACHIEVEMENTS (system-defined)
-- ═══════════════════════════════════════
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '🏆',
  category text NOT NULL DEFAULT 'general',
  threshold integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements viewable by everyone" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Admins can manage achievements" ON public.achievements FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ═══════════════════════════════════════
-- USER_ACHIEVEMENTS (junction)
-- ═══════════════════════════════════════
CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User achievements viewable by everyone" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Users can update own achievements" ON public.user_achievements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage user achievements" ON public.user_achievements FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ═══════════════════════════════════════
-- LISTINGS (user services)
-- ═══════════════════════════════════════
CREATE TABLE public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  price text NOT NULL DEFAULT '0 SP',
  status text NOT NULL DEFAULT 'Active',
  views integer NOT NULL DEFAULT 0,
  inquiries integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Listings viewable by everyone" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Users can create own listings" ON public.listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own listings" ON public.listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own listings" ON public.listings FOR DELETE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════
-- DISPUTES
-- ═══════════════════════════════════════
CREATE TABLE public.disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filed_by uuid NOT NULL,
  filed_against uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Open',
  outcome text,
  sp_amount integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dispute parties can view" ON public.disputes FOR SELECT USING (auth.uid() = filed_by OR auth.uid() = filed_against);
CREATE POLICY "Authenticated users can file disputes" ON public.disputes FOR INSERT WITH CHECK (auth.uid() = filed_by);
CREATE POLICY "Admins can manage disputes" ON public.disputes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ═══════════════════════════════════════
-- GUILDS
-- ═══════════════════════════════════════
CREATE TABLE public.guilds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  slogan text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  rank integer NOT NULL DEFAULT 0,
  is_public boolean NOT NULL DEFAULT true,
  avatar_url text,
  total_sp integer NOT NULL DEFAULT 0,
  total_gigs integer NOT NULL DEFAULT 0,
  avg_elo integer NOT NULL DEFAULT 1000,
  win_rate integer NOT NULL DEFAULT 0,
  requirements text[] DEFAULT '{}',
  perks text[] DEFAULT '{}',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.guilds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public guilds viewable by everyone" ON public.guilds FOR SELECT USING (is_public = true);
CREATE POLICY "Admins can manage guilds" ON public.guilds FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ═══════════════════════════════════════
-- GUILD_MEMBERS
-- ═══════════════════════════════════════
CREATE TABLE public.guild_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id uuid NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'Member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(guild_id, user_id)
);
ALTER TABLE public.guild_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guild members viewable by everyone" ON public.guild_members FOR SELECT USING (true);
CREATE POLICY "Users can join guilds" ON public.guild_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave guilds" ON public.guild_members FOR DELETE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════
-- GUILD_BADGES (junction)
-- ═══════════════════════════════════════
CREATE TABLE public.guild_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id uuid NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(guild_id, badge_id)
);
ALTER TABLE public.guild_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guild badges viewable by everyone" ON public.guild_badges FOR SELECT USING (true);
CREATE POLICY "Admins can manage guild badges" ON public.guild_badges FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ═══════════════════════════════════════
-- GUILD_ACHIEVEMENTS (junction)
-- ═══════════════════════════════════════
CREATE TABLE public.guild_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id uuid NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  UNIQUE(guild_id, achievement_id)
);
ALTER TABLE public.guild_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guild achievements viewable by everyone" ON public.guild_achievements FOR SELECT USING (true);
CREATE POLICY "Admins can manage guild achievements" ON public.guild_achievements FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Guild leaders can manage their own guild
CREATE POLICY "Guild leaders can update guild" ON public.guilds FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.guild_members
    WHERE guild_members.guild_id = guilds.id
    AND guild_members.user_id = auth.uid()
    AND guild_members.role IN ('Guild Master', 'Officer')
  )
);

-- Guild leaders can create guilds
CREATE POLICY "Authenticated users can create guilds" ON public.guilds FOR INSERT
WITH CHECK (auth.uid() = created_by);
