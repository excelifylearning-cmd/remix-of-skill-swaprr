
-- Allow authenticated users to create transactions (workspace participants)
CREATE POLICY "Participants can create transactions"
  ON public.transactions FOR INSERT TO authenticated
  WITH CHECK (buyer_id = auth.uid() OR seller_id = auth.uid());
