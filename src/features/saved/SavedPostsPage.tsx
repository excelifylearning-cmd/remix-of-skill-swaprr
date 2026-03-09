import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, MessageSquare, FileText, Trash2 } from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import PageTransition from "@/components/shared/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface SavedPost {
  id: string;
  post_id: string;
  post_type: "blog" | "forum";
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
}

interface ForumThread {
  id: string;
  title: string;
  content: string;
}

const SavedPostsPage = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState<SavedPost[]>([]);
  const [blogMap, setBlogMap] = useState<Record<string, BlogPost>>({});
  const [forumMap, setForumMap] = useState<Record<string, ForumThread>>({});
  const [filter, setFilter] = useState<"all" | "blog" | "forum">("all");

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data } = await supabase
        .from("saved_posts")
        .select("id,post_id,post_type,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const rows = (data || []) as SavedPost[];
      setSaved(rows);

      const blogIds = rows.filter((r) => r.post_type === "blog").map((r) => r.post_id);
      const forumIds = rows.filter((r) => r.post_type === "forum").map((r) => r.post_id);

      if (blogIds.length) {
        const { data: blogRows } = await supabase.from("blog_posts").select("id,title,excerpt").in("id", blogIds);
        const map: Record<string, BlogPost> = {};
        (blogRows || []).forEach((b) => (map[b.id] = b));
        setBlogMap(map);
      }

      if (forumIds.length) {
        const { data: forumRows } = await supabase.from("forum_threads").select("id,title,content").in("id", forumIds);
        const map: Record<string, ForumThread> = {};
        (forumRows || []).forEach((f) => (map[f.id] = f));
        setForumMap(map);
      }
    };

    load();
  }, [user]);

  const visible = useMemo(
    () => saved.filter((row) => filter === "all" || row.post_type === filter),
    [saved, filter],
  );

  const removeSaved = async (row: SavedPost) => {
    if (!user) return;
    await supabase.from("saved_posts").delete().eq("id", row.id).eq("user_id", user.id);
    setSaved((prev) => prev.filter((x) => x.id !== row.id));
    toast.success("Removed from saved");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <AppNav backTo="/blog" backLabel="Back" />

        <main className="mx-auto max-w-5xl px-6 py-24">
          <h1 className="text-3xl font-bold text-foreground mb-2">Saved Posts</h1>
          <p className="text-muted-foreground mb-6">Your saved blog posts and forum threads.</p>

          <div className="flex gap-2 mb-8">
            <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>All</button>
            <button onClick={() => setFilter("blog")} className={`px-3 py-1.5 rounded-lg text-sm ${filter === "blog" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>Blog</button>
            <button onClick={() => setFilter("forum")} className={`px-3 py-1.5 rounded-lg text-sm ${filter === "forum" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>Forums</button>
          </div>

          {visible.length === 0 ? (
            <div className="border border-border rounded-xl p-8 bg-card text-center">
              <Bookmark className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-card-foreground font-medium">No saved posts yet</p>
              <p className="text-muted-foreground text-sm mt-1">Save posts from Blog or Forums to find them here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {visible.map((row) => {
                const blog = row.post_type === "blog" ? blogMap[row.post_id] : null;
                const forum = row.post_type === "forum" ? forumMap[row.post_id] : null;

                return (
                  <article key={row.id} className="border border-border rounded-xl p-5 bg-card">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground mb-2 inline-flex items-center gap-2">
                          {row.post_type === "blog" ? <FileText size={12} /> : <MessageSquare size={12} />}
                          {row.post_type === "blog" ? "Blog" : "Forum"}
                        </div>

                        <h2 className="text-lg font-semibold text-card-foreground mb-1">
                          {blog?.title || forum?.title || "Content unavailable"}
                        </h2>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {blog?.excerpt || forum?.content || ""}
                        </p>

                        <div className="mt-3">
                          <Link
                            to={row.post_type === "blog" ? "/blog" : "/forums"}
                            className="text-sm text-primary hover:underline"
                          >
                            Open in {row.post_type === "blog" ? "Blog" : "Forums"}
                          </Link>
                        </div>
                      </div>

                      <button onClick={() => removeSaved(row)} className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-muted">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default SavedPostsPage;
