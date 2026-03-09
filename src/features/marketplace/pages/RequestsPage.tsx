import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HandHeart, ChevronRight, MessageSquare, Shield, ArrowRight } from "lucide-react";
import AppNav from "@/components/shared/AppNav";
import { supabase } from "@/integrations/supabase/client";
import { eloTier } from "../utils/marketplace-utils";
import MarketplacePagination from "../components/MarketplacePagination";
import { useAuth } from "@/lib/auth-context";
import LoginPrompt from "@/components/shared/LoginPrompt";

function timeAgo(d: string) { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`; }

export default function RequestsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("listings")
        .select("*, profiles!listings_user_id_profiles_fkey(display_name, full_name, elo, id_verified, university, total_gigs_completed, avatar_url)")
        .eq("status", "active").eq("format", "Request")
        .order("created_at", { ascending: false }).limit(200);
      setListings(data || []);
      setLoading(false);
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(listings.length / perPage));
  const paged = listings.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNav />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
        <div className="border-b border-border bg-skill-green/5">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
              <Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
              <ChevronRight className="w-3 h-3" /><span className="text-foreground">Requests</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-skill-green/10 flex items-center justify-center"><HandHeart className="w-6 h-6 text-skill-green" /></div>
              <div>
                <h1 className="font-heading font-black text-3xl text-foreground">Request Board</h1>
                <p className="text-sm text-muted-foreground">People looking for help. Browse requests and offer your skills.</p>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground"><HandHeart className="w-3.5 h-3.5 text-skill-green" /><span>{listings.length} open requests</span></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="h-5 w-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" /></div>
          ) : paged.length === 0 ? (
            <div className="py-20 text-center"><p className="text-lg font-heading font-bold text-foreground">No open requests</p><p className="text-sm text-muted-foreground mt-1">Post what you're looking for from your dashboard!</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {paged.map(l => {
                const tier = eloTier(l.profiles?.elo || 1000);
                const name = l.profiles?.display_name || l.profiles?.full_name || "User";
                return (
                  <motion.div key={l.id} whileHover={{ y: -2 }} className="rounded-2xl border border-skill-green/20 bg-card p-5 transition-shadow hover:shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-1.5 text-[10px] font-mono text-skill-green bg-skill-green/10 px-2 py-1 rounded-lg"><HandHeart className="w-3 h-3" /> REQUEST</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{timeAgo(l.created_at)}</span>
                    </div>
                    <h3 className="font-heading font-bold text-foreground text-lg mb-1 line-clamp-1">{l.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{l.description}</p>

                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <span className="text-muted-foreground">Offering:</span>
                      <span className="text-foreground font-heading font-semibold">{l.category}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Seeking:</span>
                      <span className="text-foreground font-heading font-semibold">{l.wants || "Open"}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                      <span className="font-mono text-skill-green font-bold text-sm">Budget: {l.points} SP</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{l.inquiries || 0} responses</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg ${tier.bg} ${tier.border} border flex items-center justify-center text-xs font-bold ${tier.color}`}>{name.slice(0, 2).toUpperCase()}</div>
                        <div>
                          <span className="text-xs text-foreground font-semibold flex items-center gap-1">{name} {l.profiles?.id_verified && <Shield className="w-3 h-3 text-skill-green" />}</span>
                          <span className={`text-[10px] ${tier.color}`}>{tier.label} · {l.profiles?.elo || 1000}</span>
                        </div>
                      </div>
                      <Link to={`/marketplace/${l.id}`}
                        className="h-8 px-4 rounded-lg bg-skill-green text-background text-xs font-heading font-bold hover:bg-skill-green/90 transition-colors inline-flex items-center">
                        Offer Help
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          <MarketplacePagination page={page} totalPages={totalPages} totalResults={listings.length} onPageChange={setPage} />
        </div>
      </motion.div>
      <LoginPrompt open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
