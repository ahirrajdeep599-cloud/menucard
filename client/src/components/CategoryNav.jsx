import React, { useRef, useEffect } from 'react';

export default function CategoryNav({ categories = [], activeCategory, onSelectCategory }) {
  const containerRef = useRef(null);
  const activeTabRef = useRef(null);

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

  return (
    <div className="sticky top-0 z-30 w-full glass-header py-2.5 px-3 shadow-md">
      <div 
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth max-w-4xl mx-auto py-0.5"
      >
        {/* "All Items" tab */}
        <button
          ref={activeCategory === 'ALL' ? activeTabRef : null}
          onClick={() => onSelectCategory('ALL')}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'ALL'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md font-bold'
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
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
              }`}
            >
              <span>{cat.name}</span>
              {cat.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
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
    </div>
  );
}
