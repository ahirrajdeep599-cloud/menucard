import React from 'react';
import { Search, X, ShieldCheck } from 'lucide-react';

export default function SearchBarAndFilters({
  searchQuery,
  setSearchQuery,
  totalResults
}) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-2">
      {/* Search Input Box */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-4 h-4 text-amber-400/80" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search dishes, soup, paneer, roti, pizza, drinks..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-sm sm:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-4 h-4 bg-zinc-800 p-0.5 rounded-full" />
          </button>
        )}
      </div>

      {/* Info Bar: 100% Pure Veg & Counter */}
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-400 px-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-medium">
          <span className="veg-indicator scale-90" />
          <span>100% Pure Vegetarian</span>
        </div>

        {/* Counter */}
        <span className="font-medium text-zinc-400">
          {totalResults} {totalResults === 1 ? 'dish' : 'dishes'}
        </span>
      </div>
    </div>
  );
}
