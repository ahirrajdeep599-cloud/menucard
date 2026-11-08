import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import defaultMenuData from '../data/defaultMenu.json';
import QuickPriceTable from './QuickPriceTable';
import CategoryManager from './CategoryManager';
import SettingsManager from './SettingsManager';
import QRCodeDesigner from './QRCodeDesigner';
import MediaFolderHelper from './MediaFolderHelper';
import ActivityLog from './ActivityLog';
import ItemModal from './ItemModal';

import {
  Utensils,
  DollarSign,
  Layers,
  FolderOpen,
  Settings,
  QrCode,
  LogOut,
  Plus,
  Search,
  Star,
  Edit2,
  Trash2,
  Eye,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  History
} from 'lucide-react';

export default function AdminDashboard({ onLogout, onViewCustomerMenu }) {
  const [data, setData] = useState(() => defaultMenuData || { settings: null, categories: [], items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tabs: 'dishes' | 'prices' | 'categories' | 'media' | 'qr' | 'logs' | 'settings'
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
        items: prev.items.filter(i => i.id !== item.id)
      }));
    } catch (err) {
      alert(`Failed to delete item: ${err.message}`);
    }
  };

  const handleItemSaved = (savedItem) => {
    setData(prev => {
      const exists = prev.items.some(i => i.id === savedItem.id);
      const newItems = exists
        ? prev.items.map(i => i.id === savedItem.id ? savedItem : i)
        : [...prev.items, savedItem];
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
      item.name.toLowerCase().includes(dishSearch.toLowerCase().trim()) ||
      (item.description && item.description.toLowerCase().includes(dishSearch.toLowerCase().trim()));
    return matchesCat && matchesSearch;
  });

  const getCategoryName = (id) => {
    const c = (data.categories || []).find(cat => cat.id === id);
    return c ? c.name : 'Unknown';
  };

  const navItems = [
    { id: 'dishes', label: 'Dishes', icon: Utensils },
    { id: 'prices', label: 'Quick Prices', icon: DollarSign },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'media', label: 'Photos Folder', icon: FolderOpen },
    { id: 'qr', label: 'Table QR', icon: QrCode },
    { id: 'logs', label: 'Activity Log', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 flex flex-col pb-20 md:pb-8 selection:bg-amber-500/30">
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-40 glass-header px-4 sm:px-6 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm">
            👑
          </div>
          <div>
            <h1 className="font-serif text-base sm:text-lg font-bold text-zinc-100 truncate max-w-[180px] sm:max-w-md">
              {data.settings?.hotelName || "Dining Delight"}
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-zinc-400 font-medium">
                Owner Portal (OWASP Hardened)
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Export JSON / CSV Backup Dropdown */}
          <a
            href="/api/backup/export"
            download
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-all"
            title="Download Full JSON Backup"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Backup</span>
          </a>

          <a
            href="/api/backup/export-csv"
            download
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-all"
            title="Export Dishes as CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </a>

          {/* Customer View Button */}
          <button
            onClick={onViewCustomerMenu}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer"
            title="Preview Customer Menu"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Menu</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-medium transition-all cursor-pointer"
            title="Sign Out (Revoke Session)"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5 flex-1">
        {/* Desktop Tab Selector */}
        <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel border border-zinc-800 mb-6 overflow-x-auto no-scrollbar">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md font-bold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-amber-400/80'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: DISHES (Full Menu CRUD) */}
        {activeTab === 'dishes' && (
          <div className="space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-zinc-800">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={dishSearch}
                    onChange={(e) => setDishSearch(e.target.value)}
                    placeholder="Search dishes by name..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={dishCatFilter}
                  onChange={(e) => setDishCatFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">All Categories</option>
                  {data.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Dish Button */}
              <button
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-glow-gold active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>

            {/* Quick Stats Strip */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 block">Total Dishes</span>
                <span className="font-serif text-xl font-bold text-amber-200">
                  {data.items.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 block">Categories</span>
                <span className="font-serif text-xl font-bold text-amber-200">
                  {data.categories.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 block">Sold Out</span>
                <span className="font-serif text-xl font-bold text-rose-400">
                  {data.items.filter(i => !i.isAvailable).length}
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
                    {/* Top image & badges */}
                    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-zinc-900 mb-3">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'; }}
                      />
                      <div className="absolute top-2 left-2 flex gap-1.5">
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

                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                      <span>{getCategoryName(item.categoryId)}</span>
                      <span className="text-base font-extrabold text-amber-300">
                        ₹{item.price}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-zinc-100 line-clamp-1">
                      {item.name}
                    </h4>

                    {item.description && (
                      <p className="mt-1 text-xs text-zinc-400 line-clamp-2 font-light">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className={`text-[11px] font-semibold ${item.isAvailable ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.isAvailable ? '● In Stock' : '○ Out of stock'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Dish"
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

        {/* Tab 2: QUICK INLINE PRICE TABLE */}
        {activeTab === 'prices' && (
          <QuickPriceTable
            items={data.items}
            categories={data.categories}
            onItemsUpdated={(newItems) => setData(prev => ({ ...prev, items: newItems }))}
          />
        )}

        {/* Tab 3: CATEGORIES */}
        {activeTab === 'categories' && (
          <CategoryManager
            categories={data.categories}
            items={data.items}
            onCategoriesUpdated={(newCats) => setData(prev => ({ ...prev, categories: newCats }))}
          />
        )}

        {/* Tab 4: MEDIA & LOCAL FOLDER HELPER */}
        {activeTab === 'media' && (
          <MediaFolderHelper />
        )}

        {/* Tab 5: TABLE QR CODE & STANDEE */}
        {activeTab === 'qr' && (
          <QRCodeDesigner
            hotelName={data.settings?.hotelName}
            logoUrl={data.settings?.logoUrl}
          />
        )}

        {/* Tab 6: ACTIVITY LOG & AUDIT TRAIL */}
        {activeTab === 'logs' && (
          <ActivityLog />
        )}

        {/* Tab 7: SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsManager
            settings={data.settings}
            onSettingsUpdated={(newSettings) => setData(prev => ({ ...prev, settings: newSettings }))}
          />
        )}
      </div>

      {/* 3. Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 px-1 py-1.5 flex items-center justify-around shadow-2xl">
        {navItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-xl text-[9px] font-medium transition-all cursor-pointer ${
                isActive
                  ? 'text-amber-400 font-bold scale-105'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5 mb-0.5" />
              <span className="truncate max-w-[48px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>

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
