import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import defaultMenuData from '../data/defaultMenu.json';
import CategoryManager from './CategoryManager';
import ItemModal from './ItemModal';

import {
  Utensils,
  Layers,
  LogOut,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Download,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard({ onLogout, onViewCustomerMenu }) {
  const [data, setData] = useState(() => defaultMenuData || { settings: null, categories: [], items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tabs: 'dishes' | 'categories' ONLY (Simplified as requested)
  const [activeTab, setActiveTab] = useState('dishes');

  // Search & filter for dishes tab
  const [dishSearch, setDishSearch] = useState('');
  const [dishCatFilter, setDishCatFilter] = useState('ALL');

  // Modal state
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchMenuData = async () => {
    try {
      const res = await api.getMenu();
      if (res && Array.isArray(res.items) && res.items.length > 0) {
        setData(res);
      }
    } catch (err) {
      console.info("Using embedded menu catalog in AdminDashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setItemModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setItemModalOpen(true);
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}" from the menu?`)) {
      return;
    }

    try {
      await api.deleteItem(item.id);
      setData(prev => ({
        ...prev,
        items: (prev.items || []).filter(i => i.id !== item.id)
      }));
    } catch (err) {
      alert(`Failed to delete item: ${err.message}`);
    }
  };

  const handleItemSaved = (savedItem) => {
    setData(prev => {
      const currentItems = prev.items || [];
      const exists = currentItems.some(i => i.id === savedItem.id);
      const newItems = exists
        ? currentItems.map(i => i.id === savedItem.id ? savedItem : i)
        : [savedItem, ...currentItems];
      return { ...prev, items: newItems };
    });
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore
    } finally {
      onLogout();
    }
  };

  // Filtered dishes for the 'dishes' tab
  const filteredDishes = (data.items || []).filter(item => {
    const matchesCat = dishCatFilter === 'ALL' || item.categoryId === dishCatFilter;
    const matchesSearch = !dishSearch.trim() || 
      item.name.toLowerCase().includes(dishSearch.toLowerCase().trim());
    return matchesCat && matchesSearch;
  });

  const getCategoryName = (id) => {
    const c = (data.categories || []).find(cat => cat.id === id);
    return c ? c.name : 'Unknown';
  };

  const navItems = [
    { id: 'dishes', label: 'Dishes & Photos', icon: Utensils },
    { id: 'categories', label: 'Categories', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 flex flex-col pb-20 md:pb-8 selection:bg-amber-500/30">
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-40 glass-header px-4 sm:px-6 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm">
            DD
          </div>
          <div>
            <h1 className="font-serif text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
              <span>Dining Delight Admin</span>
            </h1>
            <p className="text-[10px] text-zinc-400">
              Manage Dishes, Live Prices & Photos
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Download JSON Menu Backup */}
          <button
            onClick={() => api.downloadOfflineJson()}
            title="Download Updated Menu (JSON)"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download Menu</span>
          </button>

          {/* View Customer Menu Button */}
          <button
            onClick={onViewCustomerMenu}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">View Menu</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-xs font-medium border border-rose-800/60 transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* 2. Main Content Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {/* Navigation Tabs (Dishes vs Categories) */}
        <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-3">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-glow-gold font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: DISHES (Add, Edit, Photo, Price, Availability) */}
        {activeTab === 'dishes' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-zinc-800">
              {/* Search & Category Filter */}
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={dishSearch}
                    onChange={(e) => setDishSearch(e.target.value)}
                    placeholder="Search dish by name..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={dishCatFilter}
                  onChange={(e) => setDishCatFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">All Categories</option>
                  {(data.categories || []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Dish Button */}
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs sm:text-sm shadow-glow-gold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 block">Total Dishes</span>
                <span className="font-serif text-xl font-bold text-amber-200">
                  {(data.items || []).length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 block">Categories</span>
                <span className="font-serif text-xl font-bold text-amber-200">
                  {(data.categories || []).length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 block">Sold Out</span>
                <span className="font-serif text-xl font-bold text-rose-400">
                  {(data.items || []).filter(i => !i.isAvailable).length}
                </span>
              </div>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredDishes.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl glass-panel border border-zinc-800 hover:border-zinc-700 transition-all p-3.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Top image & badge */}
                    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-zinc-900 mb-3">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'; }}
                      />
                      <div className="absolute top-2 left-2">
                        <span className="veg-indicator" />
                      </div>

                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-xs font-bold uppercase border border-rose-500/50">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-zinc-100 leading-snug">
                          {item.name}
                        </h4>
                        <span className="text-[11px] text-amber-400/80 font-medium">
                          {getCategoryName(item.categoryId)}
                        </span>
                      </div>
                      <span className="text-base font-extrabold text-amber-300">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3.5 pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500">
                      {item.isAvailable ? '🟢 In Stock' : '🔴 Sold Out'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Dish & Photo"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES */}
        {activeTab === 'categories' && (
          <CategoryManager
            categories={data.categories}
            items={data.items}
            onCategoriesUpdated={(newCats) => setData(prev => ({ ...prev, categories: newCats }))}
          />
        )}
      </div>

      {/* Item Modal (Add / Edit) */}
      {itemModalOpen && (
        <ItemModal
          item={editingItem}
          categories={data.categories}
          onClose={() => setItemModalOpen(false)}
          onSave={handleItemSaved}
        />
      )}
    </div>
  );
}
