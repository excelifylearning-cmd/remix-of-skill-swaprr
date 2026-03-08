
-- Allow anonymous activity logging (user_id can be null for non-authenticated visitors)
DROP POLICY IF EXISTS "Users can insert their own activity" ON public.activity_log;

CREATE POLICY "Anyone can insert activity logs"
ON public.activity_log
FOR INSERT
TO anon, authenticated
WITH CHECK (
  CASE
    WHEN auth.uid() IS NOT NULL THEN (user_id = auth.uid() OR user_id IS NULL)
    ELSE user_id IS NULL
  END
);
