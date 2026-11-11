import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

export default function SearchBarAndFilters({
  searchQuery,
  setSearchQuery,
  totalResults
}) {
  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 pt-5 pb-2">
      {/* Luxury Glass Search Container */}
      <div className="relative w-full group">
        {/* Subtle Ambient Focus Glow */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#D9AD52]/30 via-[#FFB91F]/25 to-[#D9AD52]/30 opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-300 pointer-events-none" />

        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#D9AD52] group-focus-within:text-[#FFB91F] group-focus-within:scale-110 transition-all duration-200" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes, paneer, pizza, sizzlers, drinks..."
            aria-label="Search menu dishes"
            className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-[#151515]/95 border border-[#D9AD52]/25 text-sm sm:text-base text-[#FFF1D0] placeholder-[#FFF1D0]/40 focus:outline-none focus:border-[#FFB91F]/80 focus:bg-[#18181b] transition-all duration-200 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#FFF1D0]/60 hover:text-[#FFB91F] transition-colors cursor-pointer"
            >
              <span className="p-1 rounded-full bg-[#242428] hover:bg-[#D9AD52]/20 border border-white/10">
                <X className="w-3.5 h-3.5" />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Info Bar: 100% Pure Veg & Dynamic Dish Counter */}
      <div className="mt-3.5 flex items-center justify-between text-xs px-0.5 gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-semibold shadow-sm">
          <span className="veg-indicator scale-90" />
          <span>100% Pure Vegetarian</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151515] border border-[#D9AD52]/20 text-[#FFF1D0]/85 font-semibold shadow-sm">
          <Sparkles className="w-3 h-3 text-[#FFB91F]" />
          <span>
            <strong className="text-[#FFB91F]">{totalResults}</strong>{' '}
            {totalResults === 1 ? 'dish' : 'dishes'}
          </span>
        </div>
      </div>
    </div>
  );
}
