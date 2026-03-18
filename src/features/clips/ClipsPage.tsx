import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, ChevronUp, ChevronDown, Music, Eye, Tag } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";

/* ─── Types ─── */
interface Clip {
  id: string;
  title: string;
  author: string;
  avatar: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  category: string;
  gradient: string;
  sound: string;
  tags: string[];
  gigId?: string;
}

/* ─── Mock Clips (auto-generated from completed gigs) ─── */
const mockClips: Clip[] = [
  { id: "1", title: "Logo Design Speed Art", author: "Luna M.", avatar: "LM", views: 12400, likes: 843, comments: 56, duration: "0:45", category: "Design", gradient: "from-rose-600 via-purple-700 to-indigo-800", sound: "Original Audio", tags: ["logo", "branding", "speed-art"], gigId: "gig-1" },
  { id: "2", title: "React Hook Tutorial", author: "Dev_Alex", avatar: "DA", views: 8900, likes: 612, comments: 34, duration: "1:20", category: "Code", gradient: "from-cyan-600 via-blue-700 to-slate-900", sound: "Chill Beats", tags: ["react", "hooks", "tutorial"], gigId: "gig-2" },
  { id: "3", title: "Music Production Tips", author: "BeatMaker", avatar: "BM", views: 5600, likes: 390, comments: 22, duration: "0:58", category: "Music", gradient: "from-amber-600 via-orange-700 to-red-900", sound: "Studio Session", tags: ["music", "production", "tips"], gigId: "gig-3" },
  { id: "4", title: "3D Character Sculpt", author: "PolyQueen", avatar: "PQ", views: 15200, likes: 1100, comments: 89, duration: "2:10", category: "3D", gradient: "from-emerald-600 via-teal-700 to-cyan-900", sound: "Lo-Fi Mix", tags: ["3d", "sculpting", "character"], gigId: "gig-4" },
  { id: "5", title: "Copy That Converts", author: "WordSmith", avatar: "WS", views: 3400, likes: 210, comments: 18, duration: "0:35", category: "Writing", gradient: "from-violet-600 via-purple-800 to-fuchsia-900", sound: "Original Audio", tags: ["copywriting", "marketing", "conversion"], gigId: "gig-5" },
  { id: "6", title: "UI Animation Breakdown", author: "MotionPro", avatar: "MP", views: 9800, likes: 720, comments: 41, duration: "1:05", category: "Design", gradient: "from-sky-600 via-indigo-700 to-violet-900", sound: "Ambient", tags: ["ui", "animation", "motion"], gigId: "gig-6" },
  { id: "7", title: "Data Viz Masterclass", author: "ChartGuru", avatar: "CG", views: 4200, likes: 280, comments: 15, duration: "1:45", category: "Data", gradient: "from-lime-600 via-green-700 to-emerald-900", sound: "Focus Mode", tags: ["data", "visualization", "charts"], gigId: "gig-7" },
  { id: "8", title: "Photo Retouching ASMR", author: "PixelPerfect", avatar: "PP", views: 7100, likes: 530, comments: 28, duration: "0:52", category: "Photo", gradient: "from-pink-600 via-rose-700 to-red-900", sound: "ASMR Clicks", tags: ["photo", "retouching", "editing"], gigId: "gig-8" },
];

/* ─── Algorithm: Weighted random based on engagement ─── */
const buildFeed = (clips: Clip[]): Clip[] => {
  const scored = clips.map(c => ({
    clip: c,
    score: c.likes * 2 + c.comments * 5 + c.views * 0.1 + Math.random() * 500,
  }));
  return scored.sort((a, b) => b.score - a.score).map(s => s.clip);
};

const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();

/* ─── Interaction Button ─── */
const ClipAction = ({ icon: Icon, count, active, onClick }: {
  icon: React.ElementType; count?: string; active?: boolean; onClick?: () => void;
}) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 group">
    <div className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${active ? "bg-white/25" : "bg-black/30 backdrop-blur-sm group-hover:bg-white/15"}`}>
      <Icon size={20} className="text-white" fill={active ? "white" : "none"} />
    </div>
    {count && <span className="text-[10px] font-bold text-white/90">{count}</span>}
  </button>
);

/* ─── Single Clip View ─── */
const ClipSlide = ({ clip, isActive, likedClips, savedClips, toggleLike, toggleSave }: {
  clip: Clip; isActive: boolean;
  likedClips: Set<string>; savedClips: Set<string>;
  toggleLike: (id: string) => void; toggleSave: (id: string) => void;
}) => (
  <div className="h-[100dvh] w-full snap-start snap-always relative flex-shrink-0">
    {/* Background */}
    <div className={`absolute inset-0 bg-gradient-to-br ${clip.gradient}`}>
      <div className="absolute inset-0 bg-black/30" />
    </div>

    {/* Right interaction bar */}
    <div className="absolute right-3 bottom-32 z-10 flex flex-col items-center gap-5">
      {/* Avatar */}
      <div className="relative mb-3">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center">
          <span className="text-xs font-bold text-white">{clip.avatar}</span>
        </div>
      </div>

      <ClipAction icon={Heart}
        count={formatCount(likedClips.has(clip.id) ? clip.likes + 1 : clip.likes)}
        active={likedClips.has(clip.id)}
        onClick={() => toggleLike(clip.id)}
      />
      <ClipAction icon={MessageCircle} count={formatCount(clip.comments)} />
      <ClipAction icon={Bookmark} active={savedClips.has(clip.id)} onClick={() => toggleSave(clip.id)} />
      <ClipAction icon={Share2} />
    </div>

    {/* Bottom info */}
    <div className="absolute bottom-0 left-0 right-16 z-10 p-4 pb-8">
      <span className="text-sm font-bold text-white">@{clip.author.replace(/\s/g, "")}</span>
      <p className="text-sm text-white/90 font-medium mt-1 line-clamp-2">{clip.title}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {clip.tags.map(tag => (
          <span key={tag} className="rounded-full bg-white/10 backdrop-blur-sm px-2.5 py-0.5 text-[10px] text-white/80 font-medium">
            #{tag}
          </span>
        ))}
      </div>

      {/* Sound + meta */}
      <div className="flex items-center gap-2 mt-3">
        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
          <Music size={10} className="text-white/70" />
          <span className="text-[10px] text-white/70 font-medium">{clip.sound}</span>
        </div>
        <span className="text-[10px] text-white/50">{clip.duration}</span>
        <div className="flex items-center gap-1">
          <Eye size={9} className="text-white/40" />
          <span className="text-[10px] text-white/50">{formatCount(clip.views)}</span>
        </div>
      </div>

      {clip.gigId && (
        <div className="mt-2 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
          <Tag size={9} className="text-white/60" />
          <span className="text-[10px] text-white/60 font-medium">Auto-generated from completed gig</span>
        </div>
      )}
    </div>
  </div>
);

/* ─── Main Clips Page ─── */
const ClipsPage = () => {
  const [feed] = useState(() => buildFeed(mockClips));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedClips, setLikedClips] = useState<Set<string>>(new Set());
  const [savedClips, setSavedClips] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleLike = useCallback((id: string) => {
    setLikedClips(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSave = useCallback((id: string) => {
    setSavedClips(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const goUp = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollRef.current?.children[newIndex]?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentIndex]);

  const goDown = useCallback(() => {
    if (currentIndex < feed.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollRef.current?.children[newIndex]?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentIndex, feed.length]);

  // Track scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const idx = Math.round(el.scrollTop / el.clientHeight);
      setCurrentIndex(idx);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") { e.preventDefault(); goUp(); }
      if (e.key === "ArrowDown") { e.preventDefault(); goDown(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goUp, goDown]);

  return (
    <PageTransition>
      <div className="h-[100dvh] w-full bg-black relative overflow-hidden">
        {/* Scroll container */}
        <div ref={scrollRef} className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
          {feed.map((clip, i) => (
            <ClipSlide
              key={clip.id}
              clip={clip}
              isActive={i === currentIndex}
              likedClips={likedClips}
              savedClips={savedClips}
              toggleLike={toggleLike}
              toggleSave={toggleSave}
            />
          ))}
        </div>

        {/* Up / Down navigation buttons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
          <button
            onClick={goUp}
            disabled={currentIndex === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronUp size={20} />
          </button>
          <button
            onClick={goDown}
            disabled={currentIndex === feed.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1">
          {feed.map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${i === currentIndex ? "h-6 bg-white" : "h-2 bg-white/20"}`}
            />
          ))}
        </div>

        {/* Clip counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-[11px] font-mono font-bold text-white/80">
              {currentIndex + 1} / {feed.length}
            </span>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ClipsPage;
