
-- Allow anyone to submit feature suggestions
CREATE POLICY "Anyone can submit feature requests" ON public.feature_requests FOR INSERT WITH CHECK (true);
