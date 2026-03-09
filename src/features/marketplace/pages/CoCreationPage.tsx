import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layers, ChevronRight, Users, Star, UserPlus, Shield } from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import { supabase } from "@/integrations/supabase/client";
import { eloTier } from "../utils/marketplace-utils";
import GigQuickView from "../components/GigQuickView";
import MarketplacePagination from "../components/MarketplacePagination";
import { type Gig } from "../data/mockData";

function timeAgo(d: string) { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`; }

export default function CoCreationPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("listings")
        .select("*, profiles!listings_user_id_profiles_fkey(display_name, full_name, elo, id_verified, university, total_gigs_completed, avatar_url)")
        .eq("status", "active").eq("format", "Co-Creation")
        .order("created_at", { ascending: false }).limit(200);
      setListings(data || []);
      setLoading(false);
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(listings.length / perPage));
  const paged = listings.slice((page - 1) * perPage, page * perPage);

  const toGig = (l: any): Gig => {
    const name = l.profiles?.display_name || l.profiles?.full_name || "User";
    return { id: l.id, skill: l.title, wants: l.wants || "Team Members", points: l.points, seller: name, sellerId: l.user_id, elo: l.profiles?.elo || 1000, rating: l.rating, avatar: name.slice(0, 2).toUpperCase(), category: l.category, hot: l.hot, format: l.format, posted: timeAgo(l.created_at), views: l.views, uni: l.profiles?.university || "", verified: l.profiles?.id_verified || false, desc: l.description, deliveryDays: l.delivery_days, completedSwaps: l.profiles?.total_gigs_completed || 0, tags: [] };
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNav />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
        <div className="border-b border-border bg-court-blue/5">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
              <Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
              <ChevronRight className="w-3 h-3" /><span className="text-foreground">Co-Creation</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-court-blue/10 flex items-center justify-center"><Layers className="w-6 h-6 text-court-blue" /></div>
              <div>
                <h1 className="font-heading font-black text-3xl text-foreground">Co-Creation Hub</h1>
                <p className="text-sm text-muted-foreground">Team up on collaborative projects. Fill roles, combine skills, build together.</p>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground"><Users className="w-3.5 h-3.5 text-court-blue" /><span>{listings.length} open projects</span></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="h-5 w-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" /></div>
          ) : paged.length === 0 ? (
            <div className="py-20 text-center"><p className="text-lg font-heading font-bold text-foreground">No co-creation projects</p><p className="text-sm text-muted-foreground mt-1">Start a collaborative project from your dashboard!</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {paged.map(l => {
                const tier = eloTier(l.profiles?.elo || 1000);
                const name = l.profiles?.display_name || l.profiles?.full_name || "User";
                return (
                  <motion.div key={l.id} whileHover={{ y: -2 }} className="rounded-2xl border border-court-blue/20 bg-card p-5 cursor-pointer transition-shadow hover:shadow-lg" onClick={() => { setSelectedGig(toGig(l)); setDrawerOpen(true); }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-1.5 text-[10px] font-mono text-court-blue bg-court-blue/10 px-2 py-1 rounded-lg"><Layers className="w-3 h-3" /> CO-CREATION</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{timeAgo(l.created_at)}</span>
                    </div>
                    <h3 className="font-heading font-bold text-foreground text-lg mb-1 line-clamp-1">{l.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{l.description}</p>

                    {l.wants && (
                      <div className="mb-4">
                        <p className="text-[10px] font-mono uppercase text-muted-foreground mb-1.5">Looking for</p>
                        <div className="flex flex-wrap gap-1.5">
                          {l.wants.split(",").map((w: string, i: number) => (
                            <span key={i} className="text-xs bg-court-blue/10 text-court-blue px-2 py-0.5 rounded-md">{w.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg ${tier.bg} ${tier.border} border flex items-center justify-center text-xs font-bold ${tier.color}`}>{name.slice(0, 2).toUpperCase()}</div>
                        <div>
                          <span className="text-xs text-foreground font-semibold flex items-center gap-1">{name} {l.profiles?.id_verified && <Shield className="w-3 h-3 text-skill-green" />}</span>
                          <span className={`text-[10px] ${tier.color}`}>{tier.label} · {l.profiles?.elo || 1000}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-skill-green font-bold">+{l.points} SP</span>
                        <button className="h-8 px-3 rounded-lg bg-court-blue text-white text-xs font-heading font-bold hover:bg-court-blue/90 transition-colors flex items-center gap-1"><UserPlus className="w-3 h-3" /> Join</button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          <MarketplacePagination page={page} totalPages={totalPages} totalResults={listings.length} onPageChange={setPage} />
        </div>
      </motion.div>
      <GigQuickView gig={selectedGig} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
