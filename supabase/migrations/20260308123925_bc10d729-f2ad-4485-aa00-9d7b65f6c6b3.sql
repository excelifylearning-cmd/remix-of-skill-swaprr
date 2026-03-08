
-- Fix overly permissive INSERT policies for contact and help tables
-- These need to allow both authenticated and anonymous users to submit
DROP POLICY "Anyone can submit contact" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (
  CASE WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid() OR user_id IS NULL
  ELSE user_id IS NULL END
);

DROP POLICY "Anyone can submit reports" ON public.help_reports;
CREATE POLICY "Anyone can submit reports" ON public.help_reports FOR INSERT WITH CHECK (
  CASE WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid() OR user_id IS NULL
  ELSE user_id IS NULL END
);
