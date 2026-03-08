
-- Add marketplace-specific columns to listings
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS format text NOT NULL DEFAULT 'Direct Swap',
  ADD COLUMN IF NOT EXISTS wants text DEFAULT '',
  ADD COLUMN IF NOT EXISTS points integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_days integer NOT NULL DEFAULT 7,
  ADD COLUMN IF NOT EXISTS hot boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS current_bid integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS bid_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ends_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS rating numeric NOT NULL DEFAULT 4.5;

CREATE INDEX IF NOT EXISTS idx_listings_format ON public.listings(format);
CREATE INDEX IF NOT EXISTS idx_listings_hot ON public.listings(hot);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
