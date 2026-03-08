import { useState, useMemo } from "react";
import { gigs, type Gig, type MarketplaceMode } from "../data/mockData";
import { ITEMS_PER_PAGE_GRID, ITEMS_PER_PAGE_LIST } from "../utils/marketplace-utils";

export interface MarketplaceFilters {
  search: string;
  category: string;
  eloRange: string;
  verifiedOnly: boolean;
  maxDeliveryDays: number | null;
  minSP: number | null;
  maxSP: number | null;
  sort: string;
}

const defaultFilters: MarketplaceFilters = {
  search: "",
  category: "All",
  eloRange: "Any",
  verifiedOnly: false,
  maxDeliveryDays: null,
  minSP: null,
  maxSP: null,
  sort: "Trending",
};

export function useMarketplaceFilters() {
  const [mode, setMode] = useState<MarketplaceMode>("explore");
  const [filters, setFilters] = useState<MarketplaceFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const updateFilter = <K extends keyof MarketplaceFilters>(key: K, value: MarketplaceFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== "All") count++;
    if (filters.eloRange !== "Any") count++;
    if (filters.verifiedOnly) count++;
    if (filters.maxDeliveryDays) count++;
    if (filters.minSP !== null || filters.maxSP !== null) count++;
    return count;
  }, [filters]);

  const filteredGigs = useMemo(() => {
    let result = [...gigs];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(g =>
        g.skill.toLowerCase().includes(q) ||
        g.wants.toLowerCase().includes(q) ||
        g.seller.toLowerCase().includes(q) ||
        g.desc.toLowerCase().includes(q) ||
        g.tags?.some(t => t.includes(q))
      );
    }

    if (filters.category !== "All") {
      result = result.filter(g => g.category === filters.category);
    }

    if (filters.eloRange !== "Any") {
      const ranges: Record<string, [number, number]> = {
        "Bronze": [0, 1299],
        "Silver": [1300, 1499],
        "Gold": [1500, 1699],
        "Diamond": [1700, 9999],
      };
      const r = ranges[filters.eloRange];
      if (r) result = result.filter(g => g.elo >= r[0] && g.elo <= r[1]);
    }

    if (filters.verifiedOnly) {
      result = result.filter(g => g.verified);
    }

    if (filters.maxDeliveryDays) {
      result = result.filter(g => g.deliveryDays <= filters.maxDeliveryDays!);
    }

    // Mode-specific filtering
    if (mode === "trending") result = result.filter(g => g.hot || g.views > 100).sort((a, b) => b.views - a.views);
    else if (mode === "auctions") result = result.filter(g => g.format === "Auction");
    else if (mode === "cocreation") result = result.filter(g => g.format === "Co-Creation");
    else if (mode === "fusion") result = result.filter(g => g.format === "Skill Fusion");
    else if (mode === "flash") result = result.filter(g => g.format === "Flash Market");
    else if (mode === "recommended") result = result.sort((a, b) => b.elo - a.elo);

    // Sort
    if (filters.sort === "Newest") result.sort(() => -1);
    else if (filters.sort === "Highest ELO") result.sort((a, b) => b.elo - a.elo);
    else if (filters.sort === "Most Points") result.sort((a, b) => b.points - a.points);
    else if (filters.sort === "Most Views") result.sort((a, b) => b.views - a.views);

    return result;
  }, [filters, mode]);

  const itemsPerPage = viewMode === "grid" ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;
  const totalPages = Math.max(1, Math.ceil(filteredGigs.length / itemsPerPage));
  const pagedGigs = filteredGigs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return {
    mode, setMode,
    filters, updateFilter, resetFilters, activeFilterCount,
    page, setPage, totalPages,
    viewMode, setViewMode,
    filteredGigs, pagedGigs,
    totalResults: filteredGigs.length,
  };
}
