
-- ================================================================
-- 1. SP TRANSACTIONS LEDGER
-- ================================================================
CREATE TABLE public.sp_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  type text NOT NULL DEFAULT 'transfer',
  reason text NOT NULL DEFAULT '',
  reference_id uuid NULL,
  reference_type text NULL,
  tax_amount integer NOT NULL DEFAULT 0,
  balance_after integer NOT NULL DEFAULT 0,
  metadata jsonb NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own SP transactions"
  ON public.sp_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert SP transactions"
  ON public.sp_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all SP transactions"
  ON public.sp_transactions FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_sp_transactions_user ON public.sp_transactions(user_id);
CREATE INDEX idx_sp_transactions_type ON public.sp_transactions(type);
CREATE INDEX idx_sp_transactions_created ON public.sp_transactions(created_at DESC);

-- ================================================================
-- 2. REVIEWS & RATINGS
-- ================================================================
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid NOT NULL,
  reviewee_id uuid NOT NULL,
  listing_id uuid NULL REFERENCES public.listings(id) ON DELETE SET NULL,
  workspace_id text NULL,
  rating integer NOT NULL DEFAULT 5,
  communication_rating integer NULL,
  quality_rating integer NULL,
  timeliness_rating integer NULL,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  is_verified boolean NOT NULL DEFAULT false,
  helpful_count integer NOT NULL DEFAULT 0,
  response text NULL,
  response_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Reviewees can respond to reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewee_id);

CREATE POLICY "Admins can manage reviews"
  ON public.reviews FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_reviews_reviewee ON public.reviews(reviewee_id);
CREATE INDEX idx_reviews_listing ON public.reviews(listing_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- ================================================================
-- 3. NOTIFICATIONS
-- ================================================================
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  link text NULL,
  is_read boolean NOT NULL DEFAULT false,
  metadata jsonb NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- ================================================================
-- 4. PROPOSALS / ORDERS
-- ================================================================
CREATE TABLE public.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  message text NOT NULL DEFAULT '',
  offered_sp integer NOT NULL DEFAULT 0,
  counter_sp integer NULL,
  counter_message text NULL,
  delivery_days integer NOT NULL DEFAULT 7,
  requirements text NULL,
  workspace_id text NULL,
  expires_at timestamptz NULL,
  accepted_at timestamptz NULL,
  rejected_at timestamptz NULL,
  completed_at timestamptz NULL,
  cancelled_at timestamptz NULL,
  metadata jsonb NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view proposals"
  ON public.proposals FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Authenticated users can create proposals"
  ON public.proposals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Participants can update proposals"
  ON public.proposals FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Admins can manage proposals"
  ON public.proposals FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_proposals_listing ON public.proposals(listing_id);
CREATE INDEX idx_proposals_sender ON public.proposals(sender_id);
CREATE INDEX idx_proposals_receiver ON public.proposals(receiver_id);
CREATE INDEX idx_proposals_status ON public.proposals(status);

-- Add updated_at triggers
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
