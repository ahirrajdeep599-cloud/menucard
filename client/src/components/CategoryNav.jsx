import React, { useRef, useEffect, useState } from 'react';
import { LayoutGrid, ChevronDown, X, ChevronRight, Sparkles, UtensilsCrossed, Award } from 'lucide-react';

export default function CategoryNav({ categories = [], activeCategory, onSelectCategory }) {
  const containerRef = useRef(null);
  const activeTabRef = useRef(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Auto-scroll active tab into center smoothly on mobile & desktop
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

  const chefSpecialCategory = categories.find(
    (c) => c.id === 'cat-chef-special' || c.name.toLowerCase().includes("chef")
  );
  const otherCategories = categories.filter((c) => c.id !== chefSpecialCategory?.id);

  return (
    <>
      {/* Premium Sticky Floating Glass Navigation Bar */}
      <nav
        aria-label="Menu Categories"
        className="sticky top-0 z-30 w-full glass-header py-2.5 px-3 sm:px-6"
      >
        <div className="max-w-5xl mx-auto flex items-center gap-2 sm:gap-3">
          {/* 1. 3D "Categories" Drawer Trigger */}
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex-shrink-0 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-br from-[#FFF1D0] via-[#D9AD52] to-[#FFB91F] text-[#090909] shadow-[0_4px_14px_rgba(217,173,82,0.35)] hover:brightness-105 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#090909]" />
            <span>Categories</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#090909]" />
          </button>

          {/* Champagne Divider */}
          <div className="w-px h-6 bg-[#D9AD52]/25 flex-shrink-0" />

          {/* 2. Smooth Horizontal Scrollable Navigation Strip */}
          <div className="relative flex-1 overflow-hidden min-w-0">
            <div
              ref={containerRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 pr-8"
            >
              {/* "All Dishes" Tab */}
              <button
                ref={activeCategory === 'ALL' ? activeTabRef : null}
                onClick={() => onSelectCategory('ALL')}
                className={`relative flex-shrink-0 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeCategory === 'ALL'
                    ? 'bg-[#D9AD52]/20 text-[#FFF1D0] border border-[#D9AD52]/60 shadow-[0_0_15px_rgba(217,173,82,0.2)]'
                    : 'bg-[#151515]/80 hover:bg-[#1f1f22] text-[#FFF1D0]/75 hover:text-[#FFF1D0] border border-white/10'
                }`}
              >
                <UtensilsCrossed className={`w-3.5 h-3.5 ${activeCategory === 'ALL' ? 'text-[#FFB91F]' : 'text-[#D9AD52]/70'}`} />
                <span>All Dishes</span>
                {/* Animated Golden Underline */}
                {activeCategory === 'ALL' && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-[#D9AD52] via-[#FFB91F] to-[#D9AD52] animate-fade-in" />
                )}
              </button>

              {/* Dedicated Chef's Special Tab (Highlighted if present in menu) */}
              {chefSpecialCategory && (
                <button
                  ref={activeCategory === chefSpecialCategory.id ? activeTabRef : null}
                  onClick={() => onSelectCategory(chefSpecialCategory.id)}
                  className={`relative flex-shrink-0 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeCategory === chefSpecialCategory.id
                      ? 'bg-[#D9AD52]/20 text-[#FFF1D0] border border-[#FFB91F]/70 shadow-[0_0_16px_rgba(255,185,31,0.25)]'
                      : 'bg-[#151515]/80 hover:bg-[#1f1f22] text-[#FFF1D0]/85 hover:text-[#FFF1D0] border border-[#D9AD52]/25'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-[#FFB91F]" />
                  <span>{chefSpecialCategory.name.replace(/^⭐\s*/, '')}</span>
                  {chefSpecialCategory.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        activeCategory === chefSpecialCategory.id
                          ? 'bg-[#FFB91F] text-[#090909]'
                          : 'bg-[#D9AD52]/15 text-[#D9AD52]'
                      }`}
                    >
                      {chefSpecialCategory.count}
                    </span>
                  )}
                  {activeCategory === chefSpecialCategory.id && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-[#D9AD52] via-[#FFB91F] to-[#D9AD52] animate-fade-in" />
                  )}
                </button>
              )}

              {/* Remaining Dynamic Categories */}
              {otherCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    ref={isActive ? activeTabRef : null}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`relative flex-shrink-0 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-[#D9AD52]/20 text-[#FFF1D0] font-bold border border-[#D9AD52]/60 shadow-[0_0_15px_rgba(217,173,82,0.2)]'
                        : 'bg-[#151515]/80 hover:bg-[#1f1f22] text-[#FFF1D0]/75 hover:text-[#FFF1D0] border border-white/10'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-[#FFB91F] text-[#090909]'
                            : 'bg-white/10 text-[#FFF1D0]/65'
                        }`}
                      >
                        {cat.count}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-[#D9AD52] via-[#FFB91F] to-[#D9AD52] animate-fade-in" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Gradient Fade & Tap Affordance */}
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              aria-label="Open all categories"
              className="absolute right-0 top-0 bottom-0 w-9 bg-gradient-to-l from-[#090909] via-[#090909]/85 to-transparent flex items-center justify-end pr-0.5 text-[#FFB91F] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 opacity-90 animate-pulse" />
            </button>
          </div>
        </div>
      </nav>

      {/* 3. Full Luxury Category Drawer Modal */}
      {showCategoryModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
          onClick={() => setShowCategoryModal(false)}
        >
          <div
            className="w-full sm:max-w-xl max-h-[85vh] bg-[#0f0f11] border border-[#D9AD52]/35 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#D9AD52]/15">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D9AD52]/15 border border-[#D9AD52]/40 text-[#FFB91F] flex items-center justify-center shadow-inner">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#FFF1D0]">
                    Explore Categories ({categories.length})
                  </h3>
                  <p className="text-xs text-[#FFF1D0]/60">
                    Select a section to jump straight to those dishes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 rounded-full bg-[#151515] hover:bg-[#222226] text-[#FFF1D0]/70 hover:text-[#FFF1D0] border border-[#D9AD52]/25 cursor-pointer transition-colors"
                aria-label="Close categories"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Grid (2 columns mobile, 3 tablet/desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4 overflow-y-auto pr-1 max-h-[60vh]">
              {/* All Dishes Card */}
              <button
                onClick={() => {
                  onSelectCategory('ALL');
                  setShowCategoryModal(false);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer active:scale-95 ${
                  activeCategory === 'ALL'
                    ? 'bg-gradient-to-br from-[#D9AD52]/25 to-[#FFB91F]/10 border-[#FFB91F] text-[#FFF1D0] font-bold shadow-glow-gold'
                    : 'bg-[#151515] border-white/10 hover:border-[#D9AD52]/40 text-[#FFF1D0]/85'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFB91F]" />
                  <span>All Dishes</span>
                </span>
                <span className="text-[10px] text-[#D9AD52] font-medium">
                  Full complete menu
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
                        ? 'bg-gradient-to-br from-[#D9AD52]/25 to-[#FFB91F]/10 border-[#FFB91F] text-[#FFF1D0] font-bold shadow-glow-gold'
                        : 'bg-[#151515] border-white/10 hover:border-[#D9AD52]/40 text-[#FFF1D0]/85'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug">
                      {cat.name}
                    </span>
                    {cat.count !== undefined && (
                      <span className="text-[10px] text-[#D9AD52] font-semibold">
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
