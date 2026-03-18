ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_sections jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hero_color text DEFAULT '#0A0A0A';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banner_url text DEFAULT '';
ALTER TABLE public.guilds ADD COLUMN IF NOT EXISTS guild_sections jsonb DEFAULT '[]'::jsonb;