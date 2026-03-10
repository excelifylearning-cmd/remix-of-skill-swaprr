import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Play, Search, Music, Plus, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { Badge } from "@/components/ui/badge";

const mockClips = [
  { id: "1", title: "Logo Design Speed Art", author: "Luna M.", avatar: "LM", views: 12400, likes: 843, comments: 56, duration: "0:45", category: "Design", gradient: "from-rose-600 via-purple-700 to-indigo-800", sound: "Original Audio" },
  { id: "2", title: "React Hook Tutorial", author: "Dev_Alex", avatar: "DA", views: 8900, likes: 612, comments: 34, duration: "1:20", category: "Code", gradient: "from-cyan-600 via-blue-700 to-slate-900", sound: "Chill Beats" },
  { id: "3", title: "Music Production Tips", author: "BeatMaker", avatar: "BM", views: 5600, likes: 390, comments: 22, duration: "0:58", category: "Music", gradient: "from-amber-600 via-orange-700 to-red-900", sound: "Studio Session" },
  { id: "4", title: "3D Character Sculpt", author: "PolyQueen", avatar: "PQ", views: 15200, likes: 1100, comments: 89, duration: "2:10", category: "3D", gradient: "from-emerald-600 via-teal-700 to-cyan-900", sound: "Lo-Fi Mix" },
  { id: "5", title: "Copy That Converts", author: "WordSmith", avatar: "WS", views: 3400, likes: 210, comments: 18, duration: "0:35", category: "Writing", gradient: "from-violet-600 via-purple-800 to-fuchsia-900", sound: "Original Audio" },
  { id: "6", title: "UI Animation Breakdown", author: "MotionPro", avatar: "MP", views: 9800, likes: 720, comments: 41, duration: "1:05", category: "Design", gradient: "from-sky-600 via-indigo-700 to-violet-900", sound: "Ambient" },
  { id: "7", title: "Data Viz Masterclass", author: "ChartGuru", avatar: "CG", views: 4200, likes: 280, comments: 15, duration: "1:45", category: "Data", gradient: "from-lime-600 via-green-700 to-emerald-900", sound: "Focus Mode" },
  { id: "8", title: "Photo Retouching ASMR", author: "PixelPerfect", avatar: "PP", views: 7100, likes: 530, comments: 28, duration: "0:52", category: "Photo", gradient: "from-pink-600 via-rose-700 to-red-900", sound: "ASMR Clicks" },
];

const feedTabs = ["For You", "Following", "Trending"];

const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();

const ClipInteraction = ({ icon: Icon, count, active }: { icon: any; count?: string; active?: boolean }) => (
  <button className="flex flex-col items-center gap-1">
    <div className={`flex h-11 w-11 items-center justify-center rounded-full ${active ? "bg-white/20" : "bg-white/10"} backdrop-blur-sm transition-all`}>
      <Icon size={22} className="text-white" fill={active ? "white" : "none"} />
    </div>
    {count && <span className="text-[10px] font-semibold text-white/90">{count}</span>}
  </button>
);

const ClipsPage = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("For You");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [likedClips, setLikedClips] = useState<Set<string>>(new Set());
  const [savedClips, setSavedClips] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const shuffled = [...mockClips].sort(() => Math.random() - 0.5);

  const toggleLike = (id: string) => {
    setLikedClips(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSave = (id: string) => {
    setSavedClips(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ── Full-screen immersive feed ── */
  const renderFeed = () => (
    <div ref={scrollRef} className="h-[100dvh] overflow-y-auto snap-y snap-mandatory scrollbar-hide">
      {shuffled.map((clip) => (
        <div key={clip.id} className="h-[100dvh] w-full snap-start snap-always relative">
          {/* Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${clip.gradient}`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Play size={40} className="text-white/60 ml-1" />
              </div>
            </div>
          </div>

          {/* Top overlay — search + tabs */}
          <div className="absolute top-0 left-0 right-0 z-10 pt-[env(safe-area-inset-top)]">
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.div key="search" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "100%" }} exit={{ opacity: 0, width: 0 }} className="flex items-center gap-2 w-full">
                    <div className="flex-1 flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-4 py-2">
                      <Search size={14} className="text-white/60" />
                      <input
                        autoFocus
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search clips..."
                        className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                      />
                    </div>
                    <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-white/70">
                      <X size={20} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="tabs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-5">
                      {feedTabs.map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`text-sm font-semibold transition-all ${activeTab === tab ? "text-white" : "text-white/40"}`}
                        >
                          {tab}
                          {activeTab === tab && <div className="h-0.5 w-full bg-white rounded-full mt-0.5" />}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSearchOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm">
                        <Search size={16} className="text-white/70" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right interaction bar */}
          <div className="absolute right-3 bottom-28 z-10 flex flex-col items-center gap-5">
            {/* Author avatar */}
            <div className="relative mb-2">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center">
                <span className="text-xs font-bold text-white">{clip.avatar}</span>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Plus size={12} className="text-primary-foreground" />
              </div>
            </div>
            <ClipInteraction icon={Heart} count={formatCount(likedClips.has(clip.id) ? clip.likes + 1 : clip.likes)} active={likedClips.has(clip.id)} />
            <ClipInteraction icon={MessageCircle} count={formatCount(clip.comments)} />
            <ClipInteraction icon={Bookmark} active={savedClips.has(clip.id)} />
            <ClipInteraction icon={Share2} />
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-16 z-10 p-4 pb-20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-white">@{clip.author.replace(/\s/g, "")}</span>
              <Badge variant="secondary" className="bg-white/15 text-white/90 border-none text-[10px] backdrop-blur-sm">{clip.category}</Badge>
            </div>
            <p className="text-sm text-white/90 font-medium mb-3 line-clamp-2">{clip.title}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                <Music size={10} className="text-white/70" />
                <span className="text-[10px] text-white/70 font-medium">{clip.sound}</span>
              </div>
              <span className="text-[10px] text-white/50">{clip.duration}</span>
              <span className="text-[10px] text-white/50">{formatCount(clip.views)} views</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  /* ── Desktop layout with Navbar ── */
  if (!isMobile) {
    return (
      <PageTransition>
        <Navbar />
        <main className="min-h-screen bg-black pt-16">
          <div className="max-w-[420px] mx-auto relative" style={{ height: "calc(100vh - 64px)" }}>
            <div className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide rounded-xl overflow-hidden">
              {shuffled.map((clip) => (
                <div key={clip.id} className="h-full w-full snap-start snap-always relative flex-shrink-0" style={{ height: "calc(100vh - 64px)" }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${clip.gradient}`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                        <Play size={32} className="text-white/60 ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-4">
                    <div className="flex items-center gap-5">
                      {feedTabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`text-sm font-semibold ${activeTab === tab ? "text-white" : "text-white/40"}`}>
                          {tab}
                          {activeTab === tab && <div className="h-0.5 w-full bg-white rounded-full mt-0.5" />}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setSearchOpen(!searchOpen)} className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm">
                      <Search size={14} className="text-white/70" />
                    </button>
                  </div>

                  {/* Right bar */}
                  <div className="absolute right-3 bottom-20 z-10 flex flex-col items-center gap-4">
                    <div className="relative mb-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">{clip.avatar}</span>
                      </div>
                    </div>
                    <ClipInteraction icon={Heart} count={formatCount(clip.likes)} active={likedClips.has(clip.id)} />
                    <ClipInteraction icon={MessageCircle} count={formatCount(clip.comments)} />
                    <ClipInteraction icon={Bookmark} active={savedClips.has(clip.id)} />
                    <ClipInteraction icon={Share2} />
                  </div>

                  {/* Bottom */}
                  <div className="absolute bottom-0 left-0 right-14 z-10 p-4 pb-6">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-bold text-white">@{clip.author.replace(/\s/g, "")}</span>
                      <Badge variant="secondary" className="bg-white/15 text-white/90 border-none text-[10px]">{clip.category}</Badge>
                    </div>
                    <p className="text-sm text-white/90 mb-2">{clip.title}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-0.5">
                        <Music size={9} className="text-white/70" />
                        <span className="text-[10px] text-white/70">{clip.sound}</span>
                      </div>
                      <span className="text-[10px] text-white/50">{clip.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </PageTransition>
    );
  }

  /* ── Mobile: full immersive ── */
  return renderFeed();
};

export default ClipsPage;
