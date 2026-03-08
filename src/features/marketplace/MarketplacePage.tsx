import { useState } from "react";
import { motion } from "framer-motion";
import AppNav from "@/components/shared/AppNav";
import MarketplaceSidebar from "./components/MarketplaceSidebar";
import MarketplaceHeader from "./components/MarketplaceHeader";
import GigCard from "./components/GigCard";
import AuctionCard from "./components/AuctionCard";
import CoCreationCard from "./components/CoCreationCard";
import ProjectCard from "./components/ProjectCard";
import SkillFusionCard from "./components/SkillFusionCard";
import FlashMarketCard from "./components/FlashMarketCard";
import SPOnlyCard from "./components/SPOnlyCard";
import RequestCard from "./components/RequestCard";
import FeaturedSellers from "./components/FeaturedSellers";
import GigQuickView from "./components/GigQuickView";
import MarketplacePagination from "./components/MarketplacePagination";
import { useMarketplaceData } from "./hooks/useMarketplaceData";
import { gigs, projects, skillFusions, spOnlyGigs, requests, type Gig } from "./data/mockData";

const MarketplacePage = () => {
  const {
    mode, setMode, filters, updateFilter, resetFilters, activeFilterCount,
    page, setPage, totalPages, viewMode, setViewMode, pagedGigs, totalResults,
  } = useMarketplaceData();

  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openQuickView = (gig: Gig) => {
    setSelectedGig(gig);
    setDrawerOpen(true);
  };

  const renderContent = () => {
    switch (mode) {
      case "explore":
      case "trending":
      case "recommended":
        return (
          <>
            {mode === "explore" && (
              <div className="mb-6">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Featured Sellers</p>
                <FeaturedSellers />
              </div>
            )}
            {mode === "recommended" && (
              <div className="mb-4 p-3 rounded-xl bg-surface-1 border border-border">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="text-[10px] font-mono bg-foreground text-background px-1.5 py-0.5 rounded">AI</span>
                  Personalized recommendations based on your skills and swap history
                </p>
              </div>
            )}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
              {pagedGigs.map(gig => (
                <GigCard key={gig.id} gig={gig} viewMode={viewMode} onClick={() => openQuickView(gig)} />
              ))}
            </div>
            {pagedGigs.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-lg font-heading font-bold text-foreground">No gigs found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search</p>
              </div>
            )}
            <MarketplacePagination page={page} totalPages={totalPages} totalResults={totalResults} onPageChange={setPage} />
          </>
        );

      case "auctions":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {gigs.filter(g => g.format === "Auction").map(gig => (
              <AuctionCard key={gig.id} gig={gig} onClick={() => openQuickView(gig)} />
            ))}
          </div>
        );

      case "cocreation":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {gigs.filter(g => g.format === "Co-Creation").map(gig => (
              <CoCreationCard key={gig.id} gig={gig} onClick={() => openQuickView(gig)} />
            ))}
          </div>
        );

      case "projects":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} onClick={() => {}} />
            ))}
          </div>
        );

      case "fusion":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillFusions.map(f => (
              <SkillFusionCard key={f.id} fusion={f} onClick={() => {}} />
            ))}
          </div>
        );

      case "sp-only":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {spOnlyGigs.map(g => (
              <SPOnlyCard key={g.id} gig={g} onClick={() => {}} />
            ))}
          </div>
        );

      case "flash":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {gigs.filter(g => g.format === "Flash Market").map(gig => (
              <FlashMarketCard key={gig.id} gig={gig} onClick={() => openQuickView(gig)} />
            ))}
          </div>
        );

      case "requests":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map(r => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNav />
      <div className="flex flex-1 overflow-hidden">
        <MarketplaceSidebar
          mode={mode}
          onModeChange={m => { setMode(m); setPage(1); }}
          filters={filters}
          onFilterChange={updateFilter}
          activeFilterCount={activeFilterCount}
          onResetFilters={resetFilters}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <MarketplaceHeader
            search={filters.search}
            onSearchChange={v => updateFilter("search", v)}
            sort={filters.sort}
            onSortChange={v => updateFilter("sort", v)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            category={filters.category}
            onCategoryChange={v => updateFilter("category", v)}
            totalResults={totalResults}
          />
          <main className="flex-1 overflow-y-auto px-6 py-6">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>
      </div>
      <GigQuickView gig={selectedGig} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};

export default MarketplacePage;
