import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, Users, Shield, Filter, ArrowUpDown, Briefcase,
  GraduationCap, Trophy, Coins, TrendingUp, Swords, Sparkles,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorGlow from "@/components/shared/CursorGlow";
import PageTransition from "@/components/shared/PageTransition";
import Footer from "@/components/shared/Footer";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
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

/* ─── Constants ─── */
const TABS = [
  { key: "people", label: "People", icon: Users },
  { key: "guilds", label: "Guilds", icon: Shield },
] as const;

const TIERS = ["All", "Diamond", "Platinum", "Gold", "Silver", "Bronze"];
const CATEGORIES = ["All", "Development", "Design", "Marketing", "Writing", "Data", "Business", "Other"];

const USER_SORTS = [
  { value: "elo", label: "ELO" },
  { value: "gigs", label: "Gigs" },
  { value: "name", label: "Name" },
];
const GUILD_SORTS = [
  { value: "rank", label: "Rank" },
  { value: "avg_elo", label: "Avg ELO" },
  { value: "total_sp", label: "Total SP" },
  { value: "members", label: "Members" },
];

const tierColors: Record<string, string> = {
  Diamond: "text-court-blue",
  Platinum: "text-foreground",
  Gold: "text-badge-gold",
  Silver: "text-muted-foreground",
  Bronze: "text-muted-foreground/60",
};

const eloTierColor = (elo: number) => {
  if (elo >= 1800) return "text-court-blue";
  if (elo >= 1500) return "text-badge-gold";
  if (elo >= 1000) return "text-skill-green";
  return "text-muted-foreground";
};

/* ─── Pill Button ─── */
const Pill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={cn(
      "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
      active ? "bg-foreground text-background" : "bg-surface-1 text-muted-foreground hover:text-foreground"
    )}
  >
    {children}
  </button>
);

/* ─── Skeleton ─── */
const CardSkeleton = ({ count, cols }: { count: number; cols: string }) => (
  <div className={`grid gap-4 ${cols}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-52 animate-pulse rounded-2xl border border-border bg-card" />
    ))}
  </div>
);

/* ─── User Card ─── */
const UserCard = ({ user, index }: { user: UserProfile; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.02 }}
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
              <span className={cn("text-[10px] font-bold", tierColors[user.tier || "Bronze"] || "text-muted-foreground")}>{user.tier || "Bronze"}</span>
              <span className="text-[9px] text-muted-foreground">·</span>
              <span className="font-mono text-[10px] text-muted-foreground">{user.elo || 0} ELO</span>
            </div>
          </div>
        </div>

        {user.bio && <p className="mb-3 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{user.bio}</p>}

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
);

/* ─── Guild Card ─── */
const GuildCard = ({ guild, index }: { guild: Guild; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.03 }}
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
            <p className={cn("font-mono text-sm font-bold", eloTierColor(guild.avg_elo))}>{guild.avg_elo}</p>
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
);

/* ─── Sidebar Widget ─── */
const SidebarWidget = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-card p-4">
    <div className="flex items-center gap-2 mb-3">
      <Icon size={14} className="text-muted-foreground" />
      <h3 className="text-xs font-bold text-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

/* ─── Main Page ─── */
const DiscoverPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as "people" | "guilds") || "people";

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingGuilds, setLoadingGuilds] = useState(true);

  // People filters
  const [tierFilter, setTierFilter] = useState("All");
  const [userSort, setUserSort] = useState("elo");

  // Guild filters
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [guildSort, setGuildSort] = useState("rank");

  const setTab = (tab: string) => {
    setSearchParams({ tab });
    setSearch("");
  };

  // Fetch users
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("public_profiles")
        .select("*")
        .order("elo", { ascending: false })
        .limit(200);
      if (data) setUsers(data as UserProfile[]);
      setLoadingUsers(false);
    })();
  }, []);

  // Fetch guilds
  useEffect(() => {
    (async () => {
      const { data: guildsData } = await supabase
        .from("guilds")
        .select("id, name, slogan, category, rank, avg_elo, total_sp, total_gigs, win_rate, is_public, avatar_url")
        .eq("is_public", true)
        .order("rank");

      if (guildsData) {
        const { data: members } = await supabase.from("guild_members").select("guild_id");
        const counts: Record<string, number> = {};
        members?.forEach(m => { counts[m.guild_id] = (counts[m.guild_id] || 0) + 1; });
        setGuilds(guildsData.map(g => ({ ...g, member_count: counts[g.id] || 0 })));
      }
      setLoadingGuilds(false);
    })();
  }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users
      .filter(u => tierFilter === "All" || u.tier === tierFilter)
      .filter(u => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (u.display_name?.toLowerCase().includes(q)) ||
          (u.skills?.some(s => s.toLowerCase().includes(q))) ||
          (u.university?.toLowerCase().includes(q));
      })
      .sort((a, b) => {
        if (userSort === "elo") return (b.elo || 0) - (a.elo || 0);
        if (userSort === "gigs") return (b.total_gigs_completed || 0) - (a.total_gigs_completed || 0);
        return (a.display_name || "").localeCompare(b.display_name || "");
      });
  }, [users, tierFilter, search, userSort]);

  // Filtered guilds
  const filteredGuilds = useMemo(() => {
    return guilds
      .filter(g => categoryFilter === "All" || g.category === categoryFilter)
      .filter(g => !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.slogan.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (guildSort === "rank") return a.rank - b.rank;
        if (guildSort === "avg_elo") return b.avg_elo - a.avg_elo;
        if (guildSort === "total_sp") return b.total_sp - a.total_sp;
        return (b.member_count || 0) - (a.member_count || 0);
      });
  }, [guilds, categoryFilter, search, guildSort]);

  // Sidebar data
  const topSkills = useMemo(() => {
    const freq: Record<string, number> = {};
    users.forEach(u => u.skills?.forEach(s => { freq[s] = (freq[s] || 0) + 1; }));
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [users]);

  const topGuilds = useMemo(() => guilds.slice(0, 5), [guilds]);

  const isPeople = activeTab === "people";
  const filters = isPeople ? TIERS : CATEGORIES;
  const activeFilter = isPeople ? tierFilter : categoryFilter;
  const setFilter = isPeople ? setTierFilter : setCategoryFilter;
  const sorts = isPeople ? USER_SORTS : GUILD_SORTS;
  const activeSort = isPeople ? userSort : guildSort;
  const setSort = isPeople ? setUserSort : setGuildSort;
  const resultCount = isPeople ? filteredUsers.length : filteredGuilds.length;
  const loading = isPeople ? loadingUsers : loadingGuilds;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <CursorGlow />
        <Navbar />

        {/* Search Header */}
        <section className="pt-28 pb-6">
          <div className="mx-auto max-w-7xl px-6">
            {/* Title Row */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <h1 className="font-heading text-4xl font-black text-foreground sm:text-5xl">
                Discover
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Find talented creators and powerful guilds across the platform.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative mb-5">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={isPeople ? "Search by name, skill, or university..." : "Search guilds by name or slogan..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-13 w-full rounded-2xl border border-border bg-card pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none transition-colors"
              />
            </motion.div>

            {/* Tab Toggle */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex items-center gap-1 rounded-xl bg-surface-1 p-1 w-fit">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold transition-all",
                    activeTab === key
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon size={14} />
                  {label}
                  <span className={cn(
                    "rounded-full px-1.5 py-0.5 font-mono text-[9px]",
                    activeTab === key ? "bg-background/20 text-background" : "bg-surface-2 text-muted-foreground"
                  )}>
                    {key === "people" ? users.length : guilds.length}
                  </span>
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="pb-4">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={14} className="text-muted-foreground" />
                {filters.map(f => (
                  <Pill key={f} active={activeFilter === f} onClick={() => setFilter(f)}>{f}</Pill>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown size={14} className="text-muted-foreground" />
                {sorts.map(s => (
                  <Pill key={s.value} active={activeSort === s.value} onClick={() => setSort(s.value)}>{s.label}</Pill>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content + Sidebar */}
        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex gap-6">
              {/* Main Grid */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <CardSkeleton
                      count={isPeople ? 8 : 6}
                      cols={isPeople ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-2"}
                    />
                  ) : resultCount === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-20 text-center"
                    >
                      {isPeople ? <Users size={40} className="mx-auto mb-3 text-muted-foreground/30" /> : <Shield size={40} className="mx-auto mb-3 text-muted-foreground/30" />}
                      <p className="text-sm text-foreground font-medium">No {isPeople ? "users" : "guilds"} found</p>
                      <p className="text-xs text-muted-foreground mt-1">Try different search terms or filters</p>
                    </motion.div>
                  ) : isPeople ? (
                    <motion.div key="people" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredUsers.map((user, i) => (
                        <UserCard key={user.user_id} user={user} index={i} />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div key="guilds" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 sm:grid-cols-2">
                      {filteredGuilds.map((guild, i) => (
                        <GuildCard key={guild.id} guild={guild} index={i} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                  {resultCount} {isPeople ? "user" : "guild"}{resultCount !== 1 ? "s" : ""} found
                </p>
              </div>

              {/* Right Sidebar (hidden on mobile) */}
              <div className="hidden lg:block w-64 shrink-0 space-y-4">
                <SidebarWidget title="Trending Skills" icon={TrendingUp}>
                  <div className="flex flex-wrap gap-1.5">
                    {topSkills.map(([skill, count]) => (
                      <button
                        key={skill}
                        onClick={() => { setTab("people"); setSearch(skill); }}
                        className="rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
                      >
                        {skill} <span className="text-muted-foreground/50 ml-0.5">{count}</span>
                      </button>
                    ))}
                  </div>
                </SidebarWidget>

                <SidebarWidget title="Top Guilds" icon={Trophy}>
                  <div className="space-y-2.5">
                    {topGuilds.map((g, i) => (
                      <Link key={g.id} to={`/guild/${g.id}`} className="flex items-center gap-2.5 group">
                        <span className="font-mono text-[10px] font-bold text-muted-foreground w-4">#{i + 1}</span>
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-2 border border-border shrink-0">
                          {g.avatar_url ? (
                            <img src={g.avatar_url} alt="" className="h-full w-full rounded-lg object-cover" />
                          ) : (
                            <Shield size={12} className="text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-foreground truncate group-hover:text-foreground/80">{g.name}</p>
                          <p className="text-[9px] text-muted-foreground">{g.avg_elo} ELO · {g.member_count} members</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </SidebarWidget>

                <SidebarWidget title="Quick Stats" icon={Sparkles}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Total Users</span>
                      <span className="font-mono text-xs font-bold text-foreground">{users.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Active Guilds</span>
                      <span className="font-mono text-xs font-bold text-foreground">{guilds.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Avg ELO</span>
                      <span className="font-mono text-xs font-bold text-foreground">
                        {users.length > 0 ? Math.round(users.reduce((a, u) => a + (u.elo || 0), 0) / users.length) : 0}
                      </span>
                    </div>
                  </div>
                </SidebarWidget>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default DiscoverPage;
