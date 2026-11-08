import React, { useRef, useEffect, useState } from 'react';
import { LayoutGrid, ChevronDown, X, ChevronRight, Sparkles } from 'lucide-react';

export default function CategoryNav({ categories = [], activeCategory, onSelectCategory }) {
  const containerRef = useRef(null);
  const activeTabRef = useRef(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Auto-scroll active tab into center on mobile
  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const tab = activeTabRef.current;
      const containerWidth = container.offsetWidth;
      const tabOffset = tab.offsetLeft;
      const tabWidth = tab.offsetWidth;

      container.scrollTo({
        left: tabOffset - containerWidth / 2 + tabWidth / 2,
        behavior: 'smooth'
      });
    }
  }, [activeCategory]);

  const activeCategoryObj = categories.find(c => c.id === activeCategory);
  const activeCategoryName = activeCategory === 'ALL' ? 'All Dishes' : (activeCategoryObj?.name || 'Menu');

  return (
    <>
      {/* Sticky Category Header Bar */}
      <div className="sticky top-0 z-30 w-full glass-header py-2.5 px-3 shadow-lg border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          {/* 1. Big "Categories ▾" Popup Button (Solves mobile horizontal scroll issue completely) */}
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex-shrink-0 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-glow-gold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-black" />
            <span className="font-extrabold">Categories</span>
            <ChevronDown className="w-3.5 h-3.5 text-black" />
          </button>

          {/* Divider */}
          <div className="w-[1px] h-6 bg-white/10 flex-shrink-0" />

          {/* 2. Scrollable Strip with Visual Hint */}
          <div className="relative flex-1 overflow-hidden min-w-0">
            <div 
              ref={containerRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
            >
              {/* "All Dishes" tab */}
              <button
                ref={activeCategory === 'ALL' ? activeTabRef : null}
                onClick={() => onSelectCategory('ALL')}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === 'ALL'
                    ? 'bg-amber-400 text-black font-bold shadow'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                }`}
              >
                <span>All Dishes</span>
              </button>

              {/* Dynamic Category Chips */}
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    ref={isActive ? activeTabRef : null}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-400 text-black font-bold shadow'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-zinc-400'
                        }`}
                      >
                        {cat.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Gradient Fade + Swipe Indicator */}
            <div 
              onClick={() => setShowCategoryModal(true)}
              className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#08090d] to-transparent pointer-events-none flex items-center justify-end pr-0.5 text-amber-400"
            >
              <ChevronRight className="w-3.5 h-3.5 opacity-80 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Full Category Grid Popup / Drawer (Click on Categories opens this) */}
      {showCategoryModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
          onClick={() => setShowCategoryModal(false)}
        >
          <div 
            className="w-full sm:max-w-xl max-h-[85vh] bg-[#0c0d12] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-amber-200">
                    Menu Categories ({categories.length})
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Tap any category to view all dishes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Grid (2 columns on mobile, 3 on tablet/desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4 overflow-y-auto pr-1 max-h-[60vh]">
              {/* All Dishes Card */}
              <button
                onClick={() => {
                  onSelectCategory('ALL');
                  setShowCategoryModal(false);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer active:scale-95 ${
                  activeCategory === 'ALL'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold shadow-glow-gold'
                    : 'bg-zinc-900/80 border-white/5 hover:border-amber-500/30 text-zinc-300'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>All Dishes</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">
                  View complete menu
                </span>
              </button>

              {/* Each Category Card */}
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setShowCategoryModal(false);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold shadow-glow-gold'
                        : 'bg-zinc-900/80 border-white/5 hover:border-amber-500/30 text-zinc-200'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold line-clamp-1">
                      {cat.name}
                    </span>
                    {cat.count !== undefined && (
                      <span className="text-[10px] text-amber-400 font-medium">
                        {cat.count} {cat.count === 1 ? 'dish' : 'dishes'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
