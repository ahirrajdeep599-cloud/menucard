import React, { useState, useEffect, useMemo, useRef } from 'react';
import HeroSection from '../components/HeroSection';
import CategoryNav from '../components/CategoryNav';
import SearchBarAndFilters from '../components/SearchBarAndFilters';
import MenuItemCard from '../components/MenuItemCard';
import GoogleReviewSection from '../components/GoogleReviewSection';
import Footer from '../components/Footer';
import ItemDetailModal from '../components/ItemDetailModal';
import { api } from '../utils/api';
import { Sparkles, UtensilsCrossed, AlertCircle, RefreshCw } from 'lucide-react';

export default function CustomerMenuView({ onNavigateAdmin }) {
  const [data, setData] = useState({ settings: null, categories: [], items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('ALL'); // 'ALL' | 'VEG' | 'NON_VEG' | 'BESTSELLER'
  const [selectedItem, setSelectedItem] = useState(null);

  const menuContainerRef = useRef(null);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMenu();
      setData(res);
    } catch (err) {
      console.error("Failed to load menu:", err);
      setError("Unable to load digital menu card. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Filter items based on activeCategory, searchQuery, and dietaryFilter
  const filteredItems = useMemo(() => {
    let items = data.items || [];

    // Filter by Category
    if (activeCategory !== 'ALL') {
      items = items.filter(i => i.categoryId === activeCategory);
    }

    // Filter by Dietary preference
    if (dietaryFilter === 'VEG') {
      items = items.filter(i => i.isVeg);
    } else if (dietaryFilter === 'NON_VEG') {
      items = items.filter(i => !i.isVeg);
    } else if (dietaryFilter === 'BESTSELLER') {
      items = items.filter(i => i.isBestseller);
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
  }, [data.items, activeCategory, dietaryFilter, searchQuery]);

  // Group items by category if showing all and no specific search query
  const categorySections = useMemo(() => {
    if (activeCategory !== 'ALL' || searchQuery.trim() || dietaryFilter !== 'ALL') {
      return null;
    }

    return (data.categories || []).map(cat => {
      const catItems = (data.items || []).filter(i => i.categoryId === cat.id);
      return {
        ...cat,
        items: catItems
      };
    }).filter(cat => cat.items.length > 0);
  }, [data.categories, data.items, activeCategory, searchQuery, dietaryFilter]);

  const handleExploreClick = () => {
    if (menuContainerRef.current) {
      menuContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCategoryName = (catId) => {
    const c = (data.categories || []).find(cat => cat.id === catId);
    return c ? c.name : '';
  };

  return (
    <div className="relative min-h-screen bg-[#08090d] text-zinc-100 flex flex-col selection:bg-amber-500/30 overflow-x-hidden">
      {/* Subtle blurred ambient restaurant background across the whole UI */}
      {data.settings?.heroBgUrl && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 opacity-12 bg-cover bg-center bg-fixed filter blur-2xl scale-110"
          style={{ backgroundImage: `url(${data.settings.heroBgUrl})` }}
        />
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 1. Hero Landing Section */}
        <HeroSection 
          settings={data.settings} 
          onExploreClick={handleExploreClick} 
        />

      {/* 2. Menu Section Anchor */}
      <div ref={menuContainerRef} className="w-full">
        {/* Sticky Category Tabs */}
        <CategoryNav
          categories={data.categories}
          activeCategory={activeCategory}
          onSelectCategory={(id) => {
            setActiveCategory(id);
            setSearchQuery('');
          }}
        />

        {/* Search Bar & Dietary Filter Chips */}
        <SearchBarAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dietaryFilter={dietaryFilter}
          setDietaryFilter={setDietaryFilter}
          totalResults={filteredItems.length}
        />

        {/* Menu Cards Display */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 w-full">
          {loading ? (
            /* Skeleton Loader */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="flex gap-4 p-4 rounded-2xl glass-panel animate-pulse">
                  <div className="w-24 h-24 rounded-xl bg-zinc-800" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-zinc-800 rounded w-3/4" />
                    <div className="h-3 bg-zinc-800 rounded w-full" />
                    <div className="h-3 bg-zinc-800 rounded w-1/2" />
                    <div className="h-4 bg-zinc-800 rounded w-1/4 mt-2" />
                  </div>
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
              <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                Try clearing search query or choosing another dietary filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDietaryFilter('ALL');
                  setActiveCategory('ALL');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : categorySections ? (
            /* Grouped by Categories (When viewing All and no filters applied) */
            <div className="space-y-8">
              {categorySections.map((sec) => (
                <section key={sec.id} className="space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-200 tracking-wide flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{sec.name}</span>
                    </h2>
                    <span className="text-xs text-zinc-400">
                      {sec.items.length} dishes
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
    </div>
  );
}
