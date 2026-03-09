import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Users, Trophy, Swords, Coins, Filter, ArrowUpDown, Shield } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import Footer from "@/components/shared/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Guild {
  id: string;
  name: string;
  slogan: string;
  category: string;
  rank: number;
  avg_elo: number;
  total_sp: number;
  total_gigs: number;
  win_rate: number;
  is_public: boolean;
  avatar_url: string | null;
  member_count?: number;
}

const categories = ["All", "Development", "Design", "Marketing", "Writing", "Data", "Business", "Other"];
const sortOptions = [
  { value: "rank", label: "Rank" },
  { value: "avg_elo", label: "Avg ELO" },
  { value: "total_sp", label: "Total SP" },
  { value: "members", label: "Members" },
];

const BrowseGuildsPage = () => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rank");

  useEffect(() => {
    (async () => {
      const { data: guildsData } = await supabase
        .from("guilds")
        .select("id, name, slogan, category, rank, avg_elo, total_sp, total_gigs, win_rate, is_public, avatar_url")
        .eq("is_public", true)
        .order("rank");

      if (guildsData) {
        // Get member counts
        const { data: members } = await supabase
          .from("guild_members")
          .select("guild_id");

        const counts: Record<string, number> = {};
        members?.forEach(m => { counts[m.guild_id] = (counts[m.guild_id] || 0) + 1; });

        setGuilds(guildsData.map(g => ({ ...g, member_count: counts[g.id] || 0 })));
      }
      setLoading(false);
    })();
  }, []);

  const filtered = guilds
    .filter(g => category === "All" || g.category === category)
    .filter(g => !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.slogan.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "rank") return a.rank - b.rank;
      if (sortBy === "avg_elo") return b.avg_elo - a.avg_elo;
      if (sortBy === "total_sp") return b.total_sp - a.total_sp;
      return (b.member_count || 0) - (a.member_count || 0);
    });

  const tierColor = (elo: number) => {
    if (elo >= 1800) return "text-court-blue";
    if (elo >= 1500) return "text-badge-gold";
    if (elo >= 1000) return "text-skill-green";
    return "text-muted-foreground";
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--court-blue)/0.04),transparent_60%)]" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}>
              <Shield size={48} className="mx-auto mb-4 text-muted-foreground" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 font-heading text-5xl font-black text-foreground sm:text-6xl">
              Browse <span className="text-muted-foreground">Guilds</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
              Discover teams of skilled creators competing, collaborating, and building together.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mx-auto max-w-lg relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search guilds by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none"
              />
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="pb-6">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={14} className="text-muted-foreground" />
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      category === c ? "bg-foreground text-background" : "bg-surface-1 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown size={14} className="text-muted-foreground" />
                {sortOptions.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setSortBy(s.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      sortBy === s.value ? "bg-foreground text-background" : "bg-surface-1 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-6">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-52 animate-pulse rounded-2xl border border-border bg-card" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <Users size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-foreground font-medium">No guilds found</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((guild, i) => (
                  <motion.div
                    key={guild.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link to={`/guild/${guild.id}`} className="block group">
                      <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:bg-surface-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 border border-border text-lg">
                              {guild.avatar_url ? (
                                <img src={guild.avatar_url} alt="" className="h-full w-full rounded-xl object-cover" />
                              ) : (
                                <Trophy className="w-5 h-5 text-badge-gold" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-foreground/80">{guild.name}</h3>
                              <span className="text-[10px] text-muted-foreground">{guild.category}</span>
                            </div>
                          </div>
                          <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
                            #{guild.rank}
                          </span>
                        </div>

                        <p className="mb-4 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{guild.slogan}</p>

                        <div className="grid grid-cols-4 gap-2">
                          <div className="text-center">
                            <p className={`font-mono text-sm font-bold ${tierColor(guild.avg_elo)}`}>{guild.avg_elo}</p>
                            <p className="text-[9px] text-muted-foreground">Avg ELO</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono text-sm font-bold text-foreground">{guild.member_count}</p>
                            <p className="text-[9px] text-muted-foreground">Members</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono text-sm font-bold text-badge-gold">{guild.total_sp.toLocaleString()}</p>
                            <p className="text-[9px] text-muted-foreground">Total SP</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono text-sm font-bold text-skill-green">{guild.win_rate}%</p>
                            <p className="text-[9px] text-muted-foreground">Win Rate</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
            <p className="mt-6 text-center text-xs text-muted-foreground">{filtered.length} guild{filtered.length !== 1 ? "s" : ""} found</p>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default BrowseGuildsPage;
