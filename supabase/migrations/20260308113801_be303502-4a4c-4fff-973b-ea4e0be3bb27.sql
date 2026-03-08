-- Forum categories
CREATE TABLE public.forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text DEFAULT 'MessageSquare',
  color text DEFAULT 'blue',
  thread_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Forum threads
CREATE TABLE public.forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL DEFAULT 'Anonymous',
  title text NOT NULL,
  content text NOT NULL,
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  view_count integer DEFAULT 0,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Forum comments
CREATE TABLE public.forum_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES public.forum_threads(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL DEFAULT 'Anonymous',
  content text NOT NULL,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Forum votes (for threads and comments)
CREATE TABLE public.forum_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  thread_id uuid REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  vote_type smallint NOT NULL CHECK (vote_type IN (-1, 1)),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, thread_id),
  UNIQUE(user_id, comment_id)
);

-- Blog posts
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL DEFAULT 'System',
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content jsonb NOT NULL DEFAULT '[]',
  cover_image text,
  category text NOT NULL DEFAULT 'General',
  tags text[] DEFAULT '{}',
  read_time integer DEFAULT 5,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog comments
CREATE TABLE public.blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL DEFAULT 'Anonymous',
  content text NOT NULL,
  like_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Blog likes
CREATE TABLE public.blog_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);

-- Enable RLS
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Forum categories (public read)
CREATE POLICY "Forum categories are viewable by everyone" ON public.forum_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.forum_categories FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies: Forum threads
CREATE POLICY "Forum threads are viewable by everyone" ON public.forum_threads FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create threads" ON public.forum_threads FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update their threads" ON public.forum_threads FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete their threads" ON public.forum_threads FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies: Forum comments
CREATE POLICY "Forum comments are viewable by everyone" ON public.forum_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.forum_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update their comments" ON public.forum_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete their comments" ON public.forum_comments FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies: Forum votes
CREATE POLICY "Users can view their own votes" ON public.forum_votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can vote" ON public.forum_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can change their votes" ON public.forum_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can remove their votes" ON public.forum_votes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies: Blog posts
CREATE POLICY "Published blog posts are viewable by everyone" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies: Blog comments
CREATE POLICY "Blog comments are viewable by everyone" ON public.blog_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create blog comments" ON public.blog_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update their blog comments" ON public.blog_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete their blog comments" ON public.blog_comments FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies: Blog likes
CREATE POLICY "Users can view their own likes" ON public.blog_likes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can like" ON public.blog_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their likes" ON public.blog_likes FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_forum_threads_category ON public.forum_threads(category_id);
CREATE INDEX idx_forum_threads_created ON public.forum_threads(created_at DESC);
CREATE INDEX idx_forum_comments_thread ON public.forum_comments(thread_id);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_created ON public.blog_posts(created_at DESC);
CREATE INDEX idx_blog_comments_post ON public.blog_comments(post_id);