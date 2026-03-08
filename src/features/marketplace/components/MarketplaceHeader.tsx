import { useState } from "react";
import { Search, Grid3X3, List, ArrowUpDown, Sparkles, X } from "lucide-react";
import { categories, aiSuggestions } from "../data/mockData";
import { categoryIcon, categoryColor } from "../utils/marketplace-utils";

const sortOptions = ["Trending", "Newest", "Highest ELO", "Most Points", "Most Views"];

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (v: "grid" | "list") => void;
  category: string;
  onCategoryChange: (v: string) => void;
  totalResults: number;
}

export default function MarketplaceHeader({
  search, onSearchChange, sort, onSortChange, viewMode, onViewModeChange,
  category, onCategoryChange, totalResults,
}: Props) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSort, setShowSort] = useState(false);

  return (
    <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="px-6 py-4 space-y-3">
        {/* Search row */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => { onSearchChange(e.target.value); setShowSuggestions(false); }}
              onFocus={() => !search && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search skills, sellers, or keywords…"
              className="w-full h-10 pl-10 pr-10 bg-surface-1 border border-border rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/20 transition-colors"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {/* AI Suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl p-2 shadow-lg z-30">
                <p className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  <Sparkles className="w-3 h-3" />Suggestions
                </p>
                {aiSuggestions.map(s => (
                  <button
                    key={s}
                    onMouseDown={() => { onSearchChange(s); setShowSuggestions(false); }}
                    className="w-full px-2 py-1.5 text-left text-xs text-muted-foreground hover:text-foreground hover:bg-surface-2 rounded-md transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="h-10 px-3 flex items-center gap-1.5 border border-border rounded-xl text-xs font-body text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sort}</span>
            </button>
            {showSort && (
              <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-xl p-1 shadow-lg z-30 w-40">
                {sortOptions.map(s => (
                  <button
                    key={s}
                    onClick={() => { onSortChange(s); setShowSort(false); }}
                    className={`w-full px-3 py-1.5 text-left text-xs rounded-md transition-colors ${
                      sort === s ? "bg-foreground text-background font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View toggle */}
          <div className="flex border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`h-10 w-10 flex items-center justify-center transition-colors ${
                viewMode === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`h-10 w-10 flex items-center justify-center transition-colors ${
                viewMode === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {categories.map(c => {
            const Icon = categoryIcon(c.label);
            const active = category === c.label;
            return (
              <button
                key={c.label}
                onClick={() => onCategoryChange(c.label)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body transition-all ${
                  active
                    ? "bg-foreground text-background font-semibold"
                    : "bg-surface-1 text-muted-foreground hover:text-foreground hover:bg-surface-2"
                }`}
              >
                <Icon className="w-3 h-3" />
                {c.label}
                <span className="font-mono text-[10px] opacity-60">{c.count}</span>
              </button>
            );
          })}
          <div className="flex-shrink-0 text-xs text-muted-foreground font-mono pl-2">
            {totalResults} results
          </div>
        </div>
      </div>
    </div>
  );
}
