-- Phase 1: Delete all test data from blog and forum tables
DELETE FROM blog_comments WHERE author_name = 'System';
DELETE FROM forum_comments WHERE author_name = 'System';
DELETE FROM blog_posts WHERE author_id IS NULL OR author_name = 'System';
DELETE FROM forum_threads WHERE author_name = 'System';

-- Phase 2: Create saved_posts table with RLS policies
CREATE TABLE IF NOT EXISTS public.saved_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('blog', 'forum')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id, post_type)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_posts_user_id ON saved_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_post_id ON saved_posts(post_id, post_type);

-- Enable RLS and create policies
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved posts"
  ON saved_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save posts"
  ON saved_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave posts"
  ON saved_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Phase 3: Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for newsletter subscriptions
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view newsletter subscriptions"
  ON newsletter_subscriptions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Phase 4: Seed production-ready system posts
INSERT INTO blog_posts (
  title, slug, excerpt, content, cover_image, category, tags, 
  read_time, is_published, is_featured, author_name
) VALUES (
  'Welcome to SkillSwappr: We''re Officially Live!',
  'welcome-to-skillswappr-live',
  'After 18 months of development, we''re thrilled to announce the official launch of SkillSwappr. Join us as we revolutionize peer-to-peer skill exchange.',
  '[
    {"type": "paragraph", "content": "Today marks a milestone we''ve been working toward since day one: SkillSwappr is officially live and ready for the world."},
    {"type": "heading", "content": "Our Mission", "level": 2},
    {"type": "paragraph", "content": "We built SkillSwappr to solve a simple problem: traditional education and hiring are broken. Skills matter more than credentials, and everyone has something valuable to teach."},
    {"type": "list", "items": ["No upfront costs — trade skills directly", "Build your portfolio through real projects", "Earn Skill Points (SP) for quality work", "Join guilds and compete in challenges"]},
    {"type": "paragraph", "content": "We''d love to hear your feedback as we continue improving the platform. Drop a comment below or join us in the forums!"}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
  'Community',
  ARRAY['Launch', 'Announcement', 'Community'],
  4,
  true,
  true,
  'SkillSwappr Team'
);

-- Add a blog post about platform features
INSERT INTO blog_posts (
  title, slug, excerpt, content, cover_image, category, tags, 
  read_time, is_published, is_featured, author_name
) VALUES (
  'How to Get Started with Skill Trading',
  'how-to-get-started-skill-trading',
  'New to peer-to-peer skill exchange? This comprehensive guide will help you navigate the platform and land your first successful swap.',
  '[
    {"type": "paragraph", "content": "Starting your skill trading journey can feel overwhelming, but it doesn''t have to be. Here''s everything you need to know to succeed on SkillSwappr."},
    {"type": "heading", "content": "Setting Up Your Profile", "level": 2},
    {"type": "paragraph", "content": "Your profile is your digital storefront. Make it count by showcasing your best skills and previous work."},
    {"type": "list", "items": ["Add a professional profile photo", "Write a compelling bio that highlights your expertise", "List your top 5-7 skills with examples", "Include portfolio links when possible"]},
    {"type": "heading", "content": "Finding Your First Gig", "level": 2},
    {"type": "paragraph", "content": "Browse the marketplace and look for opportunities that match your skillset. Don''t be afraid to start small and build your reputation."}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
  'Guide',
  ARRAY['Getting Started', 'Tutorial', 'Tips'],
  6,
  true,
  false,
  'SkillSwappr Team'
);

-- Seed forum thread for getting started
INSERT INTO forum_threads (
  category_id, title, content, is_pinned, tags, author_name
) VALUES (
  (SELECT id FROM forum_categories WHERE slug = 'general-discussion' LIMIT 1),
  'New to SkillSwappr? Start Here! 🎉',
  E'Welcome to the SkillSwappr community! \n\nIf you''re new to the platform, here''s how to get started:\n\n**1. Complete Your Profile**\nAdd your skills, portfolio links, and a compelling bio that showcases your expertise.\n\n**2. Browse the Marketplace**\nFind gigs that match your skillset. Use filters to narrow down opportunities.\n\n**3. Post Your First Gig**\nOffer a skill you want to swap. Be clear about deliverables and timelines.\n\n**4. Join a Guild**\nTeam up with others in your field for collaborative projects and networking.\n\n**5. Earn Skill Points**\nComplete swaps to build your reputation and unlock platform benefits.\n\n**Community Guidelines:**\n• Be respectful and professional\n• Deliver quality work on time\n• Communicate clearly with swap partners\n• Ask questions if you''re unsure about anything\n\nGot questions? Drop them in the comments below. The community is here to help!',
  true,
  ARRAY['getting-started', 'guide', 'welcome'],
  'SkillSwappr Team'
);

-- Add a community feedback thread
INSERT INTO forum_threads (
  category_id, title, content, is_pinned, tags, author_name
) VALUES (
  (SELECT id FROM forum_categories WHERE slug = 'general-discussion' LIMIT 1),
  'Share Your Launch Feedback & Suggestions',
  E'We''re officially live! 🚀\n\nYour feedback is invaluable as we continue improving SkillSwappr. Please share:\n\n**What''s working well?**\n• Which features do you love?\n• What made your experience smooth?\n\n**What could be better?**\n• Any pain points or confusing areas?\n• Features you''d like to see added?\n\n**Bug reports**\n• Encountered any issues? Let us know the details.\n\nAll feedback will be reviewed by our team and prioritized for upcoming updates. Thank you for being part of the SkillSwappr community!',
  false,
  ARRAY['feedback', 'suggestions', 'community'],
  'SkillSwappr Team'
);