import React, { useState } from 'react';
import { api } from '../utils/api';
import { Search, Check, AlertCircle, RefreshCw, Star } from 'lucide-react';

export default function QuickPriceTable({ items = [], categories = [], onItemsUpdated }) {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [savingId, setSavingId] = useState(null);
  const [savedSuccessId, setSavedSuccessId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Filter items
  const filtered = items.filter((item) => {
    const matchesCat = selectedCat === 'ALL' || item.categoryId === selectedCat;
    const matchesSearch = !search.trim() || 
      item.name.toLowerCase().includes(search.toLowerCase().trim());
    return matchesCat && matchesSearch;
  });

  const getCategoryName = (id) => {
    const c = categories.find((cat) => cat.id === id);
    return c ? c.name : 'Unknown';
  };

  const handlePriceChange = async (itemId, currentPrice, newPriceStr) => {
    const newPrice = Number(newPriceStr);
    if (isNaN(newPrice) || newPrice < 0 || newPrice === currentPrice) {
      return;
    }

    try {
      setSavingId(itemId);
      setErrorMsg(null);
      await api.updatePrice(itemId, newPrice);
      
      // Update parent state
      const updatedList = items.map(it => it.id === itemId ? { ...it, price: newPrice } : it);
      onItemsUpdated(updatedList);

      setSavedSuccessId(itemId);
      setTimeout(() => setSavedSuccessId(null), 2000);
    } catch (err) {
      setErrorMsg(`Failed to update price: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleStock = async (itemId, currentStatus) => {
    try {
      setSavingId(itemId);
      const newStatus = !currentStatus;
      await api.updateAvailability(itemId, newStatus);

      const updatedList = items.map(it => it.id === itemId ? { ...it, isAvailable: newStatus } : it);
      onItemsUpdated(updatedList);
    } catch (err) {
      setErrorMsg(`Failed to toggle availability: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Info Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-zinc-800">
        <div>
          <h3 className="font-serif text-lg font-bold text-amber-200">
            Live Quick-Price Editor
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Tap price to change. Changes take effect on the customer QR menu instantly!
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find dish..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Spreadsheet Style Live Table */}
      <div className="rounded-2xl glass-panel border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/90 text-zinc-400 uppercase tracking-wider text-[11px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-4 hidden sm:table-cell">Category</th>
                <th className="py-3 px-4 text-center">Live Price (₹)</th>
                <th className="py-3 px-4 text-center">In Stock</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((item) => {
                const isSaving = savingId === item.id;
                const isJustSaved = savedSuccessId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                    {/* Dish Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-zinc-900 border border-white/10 flex-shrink-0"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'; }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={item.isVeg ? 'veg-indicator scale-75' : 'non-veg-indicator scale-75'} />
                            <span className="font-semibold text-zinc-100 truncate block">
                              {item.name}
                            </span>
                            {item.isBestseller && (
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-400 sm:hidden block mt-0.5">
                            {getCategoryName(item.categoryId)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 hidden sm:table-cell text-zinc-400">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-[11px]">
                        {getCategoryName(item.categoryId)}
                      </span>
                    </td>

                    {/* Inline Price Input */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <span className="text-amber-400 font-bold">₹</span>
                        <input
                          type="number"
                          defaultValue={item.price}
                          key={`price-${item.id}-${item.price}`}
                          min="0"
                          onBlur={(e) => handlePriceChange(item.id, item.price, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handlePriceChange(item.id, item.price, e.target.value);
                              e.target.blur();
                            }
                          }}
                          className="w-20 text-center font-bold text-amber-300 bg-zinc-900 border border-zinc-700 rounded-lg py-1 px-1.5 focus:outline-none focus:border-amber-400 focus:bg-zinc-800 text-sm transition-all"
                        />
                      </div>
                    </td>

                    {/* Quick Stock Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(item.id, item.isAvailable)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                          item.isAvailable
                            ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                            : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                        }`}
                      >
                        {item.isAvailable ? '✓ In Stock' : '✗ Sold Out'}
                      </button>
                    </td>

                    {/* Live Status indicator */}
                    <td className="py-3 px-4 text-right">
                      {isSaving ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Saving...</span>
                        </span>
                      ) : isJustSaved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>Live!</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-400">Synced</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
