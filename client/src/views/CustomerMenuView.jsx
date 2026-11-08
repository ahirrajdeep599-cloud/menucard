import React, { useState, useEffect, useMemo, useRef } from 'react';
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

  const fetchMenu = async () => {
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
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Filter items based on activeCategory and searchQuery
  const filteredItems = useMemo(() => {
    let items = data.items || [];

    // Filter by Category
    if (activeCategory !== 'ALL') {
      items = items.filter(i => i.categoryId === activeCategory);
    }

    // Search query filter (name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(i => 
        (i.name && i.name.toLowerCase().includes(q))
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

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    if (menuContainerRef.current) {
      const offsetTop = menuContainerRef.current.offsetTop - 80;
      window.scrollTo({
        top: offsetTop > 0 ? offsetTop : 0,
        behavior: 'smooth'
      });
    }
  };

  const getCategoryName = (catId) => {
    const found = (data.categories || []).find(c => c.id === catId);
    return found ? found.name : '';
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Hero Ambiance & Branding Header */}
      <HeroSection
        settings={data.settings}
        onExploreClick={() => handleSelectCategory('ALL')}
        onAdminClick={onNavigateAdmin}
      />

      <div ref={menuContainerRef} className="relative z-20 -mt-6">
        {/* Sticky Floating Category Navigation Bar */}
        <CategoryNav
          categories={data.categories || []}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Clean Search Bar & 100% Pure Veg Counter */}
        <SearchBarAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalResults={filteredItems.length}
        />

        {/* Menu Cards Display (2-column grid on mobile!) */}
        <main className="max-w-4xl mx-auto px-3 sm:px-6 py-4 w-full">
          {loading ? (
            /* Skeleton Loader */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="p-3 rounded-2xl glass-panel animate-pulse flex flex-col gap-2">
                  <div className="w-full aspect-square rounded-xl bg-zinc-800" />
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  <div className="h-4 bg-zinc-800 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="my-12 p-6 rounded-2xl glass-panel border border-rose-500/30 text-center max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-2" />
              <p className="text-zinc-200 text-sm">{error}</p>
              <button
                onClick={fetchMenu}
                className="mt-4 px-4 py-2 rounded-xl bg-rose-600/30 text-rose-300 text-xs font-semibold hover:bg-rose-600/40 inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            /* No Results State */
            <div className="my-16 text-center py-12 rounded-3xl glass-panel border border-white/5">
              <UtensilsCrossed className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-zinc-300">No dishes match your selection</h3>
              <p className="text-xs text-zinc-400 mt-1">Try another category or clear your search terms.</p>
              <button
                onClick={() => {
                  setActiveCategory('ALL');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 border border-amber-500/30 transition-all cursor-pointer"
              >
                View Full Menu
              </button>
            </div>
          ) : categorySections ? (
            /* Grouped View by Category Sections */
            <div className="space-y-10">
              {categorySections.map((sec) => (
                <section key={sec.id} className="space-y-3.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                    <h2 className="font-serif text-base sm:text-xl font-bold text-amber-200 tracking-wide flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{sec.name}</span>
                    </h2>
                    <span className="text-xs text-zinc-400 font-medium">
                      {sec.items.length} dishes
                    </span>
                  </div>

                  {/* 2 items per row on mobile! */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
                    {sec.items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        currencySymbol={data.settings?.currencySymbol || '₹'}
                        onItemClick={(it) => setSelectedItem(it)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            /* Flattened Grid (When filtering or inside specific category) */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  currencySymbol={data.settings?.currencySymbol || '₹'}
                  onItemClick={(it) => setSelectedItem(it)}
                />
              ))}
            </div>
          )}
        </main>

        {/* 3. Google Review Section (Directly Below Menu) */}
        <GoogleReviewSection
          googleReviewUrl={data.settings?.googleReviewUrl}
          hotelName={data.settings?.hotelName}
        />

        {/* 4. Footer */}
        <Footer
          settings={data.settings}
          onAdminClick={onNavigateAdmin}
        />
      </div>

      {/* Item Detail Lightbox Modal */}
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
