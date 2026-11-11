import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import HeroSection from '../components/HeroSection';
import CategoryNav from '../components/CategoryNav';
import SearchBarAndFilters from '../components/SearchBarAndFilters';
import MenuItemCard from '../components/MenuItemCard';
import GoogleReviewSection from '../components/GoogleReviewSection';
import Footer from '../components/Footer';
import ItemDetailModal from '../components/ItemDetailModal';
import { api } from '../utils/api';
import defaultMenuData from '../data/defaultMenu.json';
import { Sparkles, UtensilsCrossed, AlertCircle, RefreshCw } from 'lucide-react';

export default function CustomerMenuView({ onNavigateAdmin }) {
  const [data, setData] = useState(defaultMenuData || { settings: null, categories: [], items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const menuContainerRef = useRef(null);

  const fetchMenu = useCallback(async () => {
    try {
      const res = await api.getMenu();
      if (res && res.items && res.items.length > 0) {
        setData(res);
      }
    } catch (err) {
      // Graceful fallback to bundled high-speed static data
      console.info("Using bundled menu catalog");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();

    // Real-time Cloud Sync: Updates instantly when Admin changes dishes or prices
    const unsubscribe = api.subscribeMenu((updatedMenu) => {
      if (updatedMenu && Array.isArray(updatedMenu.items) && updatedMenu.items.length > 0) {
        setData(updatedMenu);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [fetchMenu]);

  // Filter items based on activeCategory and searchQuery
  const filteredItems = useMemo(() => {
    let items = data.items || [];

    // Filter by Category
    if (activeCategory !== 'ALL') {
      items = items.filter(i => i.categoryId === activeCategory);
    }

    // Search query filter (name or description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(i =>
        (i.name && i.name.toLowerCase().includes(q)) ||
        (i.description && i.description.toLowerCase().includes(q))
      );
    }

    return items;
  }, [data.items, activeCategory, searchQuery]);

  // Group items by category if showing all and no specific search query
  const categorySections = useMemo(() => {
    if (activeCategory !== 'ALL' || searchQuery.trim()) {
      return null;
    }

    const categories = data.categories || [];
    const items = data.items || [];

    return categories
      .map((cat) => ({
        ...cat,
        items: items.filter((item) => item.categoryId === cat.id)
      }))
      .filter((sec) => sec.items.length > 0);
  }, [data.categories, data.items, activeCategory, searchQuery]);

  const handleSelectCategory = useCallback((catId) => {
    setActiveCategory(catId);
    if (menuContainerRef.current) {
      const offsetTop = menuContainerRef.current.offsetTop - 20;
      window.scrollTo({
        top: offsetTop > 0 ? offsetTop : 0,
        behavior: 'smooth'
      });
    }
  }, []);

  const getCategoryName = useCallback((catId) => {
    const found = (data.categories || []).find(c => c.id === catId);
    return found ? found.name : '';
  }, [data.categories]);

  // Categories enriched with dish count for category drawer & tabs
  const categoriesWithCounts = useMemo(() => {
    const items = data.items || [];
    return (data.categories || []).map(cat => ({
      ...cat,
      count: items.filter(i => i.categoryId === cat.id).length
    }));
  }, [data.categories, data.items]);

  return (
    <div className="min-h-screen bg-[#090909] text-[#FFF1D0] flex flex-col selection:bg-[#D9AD52]/30 selection:text-[#FFF1D0]">
      {/* 1. Luxury 3D Hero Showcase (Original Background & Logo Preserved) */}
      <HeroSection
        settings={data.settings}
        onExploreClick={() => handleSelectCategory('ALL')}
        onAdminClick={onNavigateAdmin}
      />

      <div ref={menuContainerRef} className="relative z-20 -mt-4">
        {/* Sticky Floating Glass Navigation Bar */}
        <CategoryNav
          categories={categoriesWithCounts}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Glass Search Bar & Pure Veg Info */}
        <SearchBarAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalResults={filteredItems.length}
        />

        {/* Menu Cards Display (2-column luxury grid on mobile) */}
        <main className="max-w-5xl mx-auto px-3 sm:px-6 py-4 w-full">
          {loading ? (
            /* Skeleton Loader */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="p-3 rounded-2xl glass-panel animate-pulse flex flex-col gap-2">
                  <div className="w-full aspect-square rounded-xl bg-[#1e1e22]" />
                  <div className="h-4 bg-[#1e1e22] rounded w-3/4" />
                  <div className="h-4 bg-[#1e1e22] rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="my-12 p-6 rounded-2xl glass-panel border border-rose-500/30 text-center max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-2" />
              <p className="text-[#FFF1D0] text-sm">{error}</p>
              <button
                onClick={fetchMenu}
                className="mt-4 px-4 py-2 rounded-xl bg-rose-600/30 text-rose-300 text-xs font-semibold hover:bg-rose-600/40 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            /* Empty Search / Filter State */
            <div className="my-16 text-center py-12 px-4 rounded-3xl glass-panel border border-[#D9AD52]/20 animate-fade-in">
              <UtensilsCrossed className="w-12 h-12 text-[#D9AD52]/60 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#FFF1D0]">No dishes match your selection</h3>
              <p className="text-xs text-[#FFF1D0]/60 mt-1">Try another category or clear your search terms.</p>
              <button
                onClick={() => {
                  setActiveCategory('ALL');
                  setSearchQuery('');
                }}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#D9AD52]/20 text-[#FFB91F] text-xs font-bold hover:bg-[#D9AD52]/30 border border-[#D9AD52]/40 transition-all cursor-pointer active:scale-95"
              >
                View Full Menu
              </button>
            </div>
          ) : categorySections ? (
            /* Grouped View by Category Sections */
            <div className="space-y-11 animate-fade-in">
              {categorySections.map((sec) => (
                <section key={sec.id} className="space-y-4">
                  {/* Animated Section Header Separator */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-serif text-base sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1D0] via-[#F3D188] to-[#D9AD52] tracking-wide flex items-center gap-2 min-w-0">
                        <Sparkles className="w-4 h-4 text-[#FFB91F] flex-shrink-0" />
                        <span className="truncate">{sec.name}</span>
                      </h2>
                      <span className="flex-shrink-0 text-[11px] px-2.5 py-0.5 rounded-full bg-[#151515] border border-[#D9AD52]/25 text-[#D9AD52] font-semibold">
                        {sec.items.length} {sec.items.length === 1 ? 'dish' : 'dishes'}
                      </span>
                    </div>
                    <div className="gold-divider w-full" />
                  </div>

                  {/* 2 items per row on mobile, 3 on tablet, 4 on desktop */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
                    {sec.items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        currencySymbol={data.settings?.currencySymbol || '₹'}
                        onItemClick={setSelectedItem}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            /* Flattened Grid (When searching or viewing single category) */
            <div className="space-y-4 animate-fade-in">
              {activeCategory !== 'ALL' && !searchQuery.trim() && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-serif text-base sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1D0] via-[#F3D188] to-[#D9AD52] tracking-wide flex items-center gap-2 min-w-0">
                      <Sparkles className="w-4 h-4 text-[#FFB91F] flex-shrink-0" />
                      <span className="truncate">{getCategoryName(activeCategory)}</span>
                    </h2>
                    <span className="flex-shrink-0 text-[11px] px-2.5 py-0.5 rounded-full bg-[#151515] border border-[#D9AD52]/25 text-[#D9AD52] font-semibold">
                      {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
                    </span>
                  </div>
                  <div className="gold-divider w-full" />
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    currencySymbol={data.settings?.currencySymbol || '₹'}
                    onItemClick={setSelectedItem}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* 3. Google Review Loyalty Section */}
        <GoogleReviewSection
          googleReviewUrl={data.settings?.googleReviewUrl}
          hotelName={data.settings?.hotelName}
          settings={data.settings}
          totalDishes={(data.items || []).length}
          totalCategories={(data.categories || []).length}
        />

        {/* 4. Luxury Footer */}
        <Footer
          settings={data.settings}
          onAdminClick={onNavigateAdmin}
        />
      </div>

      {/* Dish Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          categoryName={getCategoryName(selectedItem.categoryId)}
          currencySymbol={data.settings?.currencySymbol || '₹'}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
