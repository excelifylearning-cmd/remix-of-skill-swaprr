import { motion } from "framer-motion";
import { Play, Heart, MessageCircle, Share2, Plus, TrendingUp, Clock, Sparkles } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockClips = [
  { id: "1", title: "Logo Design Speed Art", author: "Luna M.", avatar: "🎨", views: 12400, likes: 843, comments: 56, duration: "0:45", category: "Design", thumbnail: "🖼️" },
  { id: "2", title: "React Hook Tutorial", author: "Dev_Alex", avatar: "💻", views: 8900, likes: 612, comments: 34, duration: "1:20", category: "Code", thumbnail: "⚛️" },
  { id: "3", title: "Music Production Tips", author: "BeatMaker", avatar: "🎵", views: 5600, likes: 390, comments: 22, duration: "0:58", category: "Music", thumbnail: "🎧" },
  { id: "4", title: "3D Character Sculpt", author: "PolyQueen", avatar: "🎭", views: 15200, likes: 1100, comments: 89, duration: "2:10", category: "3D", thumbnail: "🗿" },
  { id: "5", title: "Copy That Converts", author: "WordSmith", avatar: "✍️", views: 3400, likes: 210, comments: 18, duration: "0:35", category: "Writing", thumbnail: "📝" },
  { id: "6", title: "UI Animation Breakdown", author: "MotionPro", avatar: "✨", views: 9800, likes: 720, comments: 41, duration: "1:05", category: "Design", thumbnail: "🎞️" },
  { id: "7", title: "Data Viz Masterclass", author: "ChartGuru", avatar: "📊", views: 4200, likes: 280, comments: 15, duration: "1:45", category: "Data", thumbnail: "📈" },
  { id: "8", title: "Photo Retouching ASMR", author: "PixelPerfect", avatar: "📸", views: 7100, likes: 530, comments: 28, duration: "0:52", category: "Photo", thumbnail: "🌅" },
];

const categories = ["All", "Design", "Code", "Music", "3D", "Writing", "Data", "Photo", "Video"];

const ClipsPage = () => (
  <PageTransition>
    <Navbar />
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Portfolio Clips</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">
            Show Your Work in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--skill-green))] to-[hsl(var(--court-blue))]">Motion</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Short-form portfolio clips. Speed arts, tutorials, process breakdowns — 
            let your skills speak for themselves.
          </p>
          <Button className="mt-6 gap-2" size="lg">
            <Plus className="w-4 h-4" /> Upload Clip
          </Button>
        </motion.div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat, i) => (
            <Badge key={cat} variant={i === 0 ? "default" : "outline"} className="cursor-pointer whitespace-nowrap px-4 py-1.5 text-sm hover:bg-primary/20 transition-colors">
              {cat}
            </Badge>
          ))}
        </div>

        {/* Trending Banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="rounded-xl bg-gradient-to-r from-[hsl(var(--skill-green)/0.15)] to-[hsl(var(--court-blue)/0.15)] border border-border/50 p-6 mb-8 flex items-center gap-4">
          <TrendingUp className="w-6 h-6 text-[hsl(var(--skill-green))]" />
          <div>
            <h3 className="font-semibold text-foreground">Trending This Week</h3>
            <p className="text-sm text-muted-foreground">Design speed arts are getting 3x more views — show your process!</p>
          </div>
        </motion.div>

        {/* Clips Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockClips.map((clip, i) => (
            <motion.div key={clip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group relative rounded-xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 transition-all cursor-pointer">
              {/* Thumbnail */}
              <div className="aspect-[9/16] bg-gradient-to-br from-surface-2 to-surface-3 flex items-center justify-center relative">
                <span className="text-6xl">{clip.thumbnail}</span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs bg-black/60 text-white border-none">
                    <Clock className="w-3 h-3 mr-1" />{clip.duration}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="text-xs bg-black/60 text-white border-none">{clip.category}</Badge>
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">{clip.avatar}</span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{clip.title}</h4>
                    <p className="text-xs text-muted-foreground">{clip.author}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{clip.views.toLocaleString()} views</span>
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{clip.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{clip.comments}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-12 text-center p-8 rounded-xl bg-card border border-border/50">
          <Sparkles className="w-8 h-8 text-[hsl(var(--badge-gold))] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Clips Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Upload speed arts, tutorials, and process videos. Earn SP from views and engagement. 
            Currently in development.
          </p>
        </motion.div>
      </div>
    </main>
    <Footer />
  </PageTransition>
);

export default ClipsPage;
