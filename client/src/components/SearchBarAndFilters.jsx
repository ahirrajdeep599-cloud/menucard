import React from 'react';
import { Search, X, Star, Sparkles } from 'lucide-react';

export default function SearchBarAndFilters({
  searchQuery,
  setSearchQuery,
  dietaryFilter,
  setDietaryFilter,
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
          placeholder="Search appetizers, biryani, desserts, drinks..."
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

      {/* Filter Badges Bar */}
      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {/* All */}
          <button
            onClick={() => setDietaryFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
              dietaryFilter === 'ALL'
                ? 'bg-zinc-200 text-black font-semibold shadow'
                : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            All
          </button>

          {/* Veg Only */}
          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'VEG' ? 'ALL' : 'VEG')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
              dietaryFilter === 'VEG'
                ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-semibold'
                : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <span className="veg-indicator scale-90" />
            <span>Veg</span>
          </button>

          {/* Non-Veg Only */}
          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'NON_VEG' ? 'ALL' : 'NON_VEG')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
              dietaryFilter === 'NON_VEG'
                ? 'bg-rose-500/20 border border-rose-500 text-rose-300 font-semibold'
                : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <span className="non-veg-indicator scale-90" />
            <span>Non-Veg</span>
          </button>

          {/* Bestseller Filter */}
          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'BESTSELLER' ? 'ALL' : 'BESTSELLER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
              dietaryFilter === 'BESTSELLER'
                ? 'bg-amber-500/20 border border-amber-500 text-amber-300 font-semibold'
                : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Chef's Special</span>
          </button>
        </div>

        {/* Counter */}
        <span className="text-xs text-zinc-400 font-medium">
          {totalResults} {totalResults === 1 ? 'item' : 'items'}
        </span>
      </div>
    </div>
  );
}
