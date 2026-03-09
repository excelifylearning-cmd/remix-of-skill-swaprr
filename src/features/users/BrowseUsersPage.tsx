import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Users, Filter, ArrowUpDown, GraduationCap, Briefcase } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import Footer from "@/components/shared/Footer";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  user_id: string;
  display_name: string | null;
  avatar_emoji: string | null;
  avatar_url: string | null;
  bio: string | null;
  elo: number | null;
  skills: string[] | null;
  tier: string | null;
  university: string | null;
  total_gigs_completed: number | null;
}

const tierColors: Record<string, string> = {
  Diamond: "text-court-blue",
  Platinum: "text-foreground",
  Gold: "text-badge-gold",
  Silver: "text-muted-foreground",
  Bronze: "text-muted-foreground/60",
};

const tiers = ["All", "Diamond", "Platinum", "Gold", "Silver", "Bronze"];
const sortOptions = [
  { value: "elo", label: "ELO" },
  { value: "gigs", label: "Gigs" },
  { value: "name", label: "Name" },
];

const BrowseUsersPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [sortBy, setSortBy] = useState("elo");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("public_profiles")
        .select("*")
        .order("elo", { ascending: false })
        .limit(200);
      if (data) setUsers(data as UserProfile[]);
      setLoading(false);
    })();
  }, []);

  const filtered = users
    .filter(u => tierFilter === "All" || u.tier === tierFilter)
    .filter(u => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (u.display_name?.toLowerCase().includes(q)) ||
        (u.skills?.some(s => s.toLowerCase().includes(q))) ||
        (u.university?.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      if (sortBy === "elo") return (b.elo || 0) - (a.elo || 0);
      if (sortBy === "gigs") return (b.total_gigs_completed || 0) - (a.total_gigs_completed || 0);
      return (a.display_name || "").localeCompare(b.display_name || "");
    });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--skill-green)/0.04),transparent_60%)]" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}>
              <Users size={48} className="mx-auto mb-4 text-muted-foreground" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 font-heading text-5xl font-black text-foreground sm:text-6xl">
              Browse <span className="text-muted-foreground">Users</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
              Find talented skill providers by expertise, tier, or university.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mx-auto max-w-lg relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, skill, or university..."
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
                {tiers.map(t => (
                  <button
                    key={t}
                    onClick={() => setTierFilter(t)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      tierFilter === t ? "bg-foreground text-background" : "bg-surface-1 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-48 animate-pulse rounded-2xl border border-border bg-card" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <Users size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-foreground font-medium">No users found</p>
                <p className="text-xs text-muted-foreground mt-1">Try different search terms or filters</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((user, i) => (
                  <motion.div
                    key={user.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <Link to={`/profile/${user.user_id}`} className="block group">
                      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-foreground/20 hover:bg-surface-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 border border-border text-lg shrink-0">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                            ) : (
                              <span>{user.avatar_emoji || "👤"}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-heading text-sm font-bold text-foreground truncate">{user.display_name || "Anonymous"}</h3>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-bold ${tierColors[user.tier || "Bronze"] || "text-muted-foreground"}`}>{user.tier || "Bronze"}</span>
                              <span className="text-[9px] text-muted-foreground">·</span>
                              <span className="font-mono text-[10px] text-muted-foreground">{user.elo || 0} ELO</span>
                            </div>
                          </div>
                        </div>

                        {user.bio && (
                          <p className="mb-3 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{user.bio}</p>
                        )}

                        {user.skills && user.skills.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-1">
                            {user.skills.slice(0, 4).map(s => (
                              <span key={s} className="rounded-full bg-surface-2 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">{s}</span>
                            ))}
                            {user.skills.length > 4 && (
                              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[9px] text-muted-foreground/60">+{user.skills.length - 4}</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between border-t border-border/50 pt-3">
                          <div className="flex items-center gap-1.5">
                            <Briefcase size={10} className="text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">{user.total_gigs_completed || 0} gigs</span>
                          </div>
                          {user.university && (
                            <div className="flex items-center gap-1">
                              <GraduationCap size={10} className="text-muted-foreground" />
                              <span className="text-[9px] text-muted-foreground truncate max-w-[100px]">{user.university}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
            <p className="mt-6 text-center text-xs text-muted-foreground">{filtered.length} user{filtered.length !== 1 ? "s" : ""} found</p>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default BrowseUsersPage;
