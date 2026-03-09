
-- Add 'enterprise' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'enterprise';

-- Create enterprise_accounts table for org management
CREATE TABLE public.enterprise_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid NOT NULL,
  logo_url text,
  plan text NOT NULL DEFAULT 'standard',
  max_seats integer NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.enterprise_accounts ENABLE ROW LEVEL SECURITY;

-- Enterprise members (managed by enterprise admins)
CREATE TABLE public.enterprise_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.enterprise_accounts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  invited_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(account_id, user_id)
);
ALTER TABLE public.enterprise_members ENABLE ROW LEVEL SECURITY;

-- RLS for enterprise_accounts
CREATE POLICY "Enterprise members can view their account"
  ON public.enterprise_accounts FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.enterprise_members WHERE enterprise_members.account_id = enterprise_accounts.id AND enterprise_members.user_id = auth.uid())
    OR owner_id = auth.uid()
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Owner and admins can manage accounts"
  ON public.enterprise_accounts FOR ALL TO authenticated
  USING (
    owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)
  );

-- RLS for enterprise_members
CREATE POLICY "Same-account members can view members"
  ON public.enterprise_members FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.enterprise_members em WHERE em.account_id = enterprise_members.account_id AND em.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Account admins can manage members"
  ON public.enterprise_members FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.enterprise_members em
      WHERE em.account_id = enterprise_members.account_id
      AND em.user_id = auth.uid()
      AND em.role IN ('admin', 'owner')
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Add workspace_type to track format-specific workspaces
ALTER TABLE public.workspace_members ADD COLUMN IF NOT EXISTS workspace_type text DEFAULT 'standard';

-- Create storage buckets for avatars and gig images
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gig-images', 'gig-images', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Users can update own avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage policies for gig-images
CREATE POLICY "Anyone can view gig images" ON storage.objects FOR SELECT USING (bucket_id = 'gig-images');
CREATE POLICY "Authenticated users can upload gig images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gig-images');
