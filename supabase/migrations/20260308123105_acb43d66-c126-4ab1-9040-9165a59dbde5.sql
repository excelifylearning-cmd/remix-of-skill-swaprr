
-- Add foreign key from guild_members.user_id to profiles.user_id for join queries
-- We can't FK to auth.users, so we reference via profiles
ALTER TABLE public.guild_members
  ADD CONSTRAINT guild_members_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Same for user_badges and user_achievements
ALTER TABLE public.user_badges
  ADD CONSTRAINT user_badges_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.user_achievements
  ADD CONSTRAINT user_achievements_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Listings and disputes
ALTER TABLE public.listings
  ADD CONSTRAINT listings_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.disputes
  ADD CONSTRAINT disputes_filed_by_profiles_fkey
  FOREIGN KEY (filed_by) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.disputes
  ADD CONSTRAINT disputes_filed_against_profiles_fkey
  FOREIGN KEY (filed_against) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
