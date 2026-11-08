import React, { useState, useEffect } from 'react';
import { X, Upload, Check, AlertCircle, Image as ImageIcon, Sparkles, Trash2 } from 'lucide-react';
import { api } from '../utils/api';
import { compressToDataUrl } from '../utils/imageCompressor';

export default function ItemModal({ item, categories = [], onClose, onSave }) {
  const isEditing = Boolean(item && item.id);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setCategoryId(item.categoryId || (categories[0]?.id || ''));
      setPrice(item.price !== undefined ? item.price : '');
      setDescription(item.description || '');
      setIsVeg(item.isVeg !== undefined ? item.isVeg : true);
      setIsBestseller(Boolean(item.isBestseller));
      setIsAvailable(item.isAvailable !== false);
      setImageUrl(item.imageUrl || '');
    } else {
      if (categories.length > 0) {
        setCategoryId(categories[0].id);
      }
    }
  }, [item, categories]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      // Compress directly to optimized WebP/JPEG data URL (~20 KB)
      const dataUrl = await compressToDataUrl(file, 480, 0.72);
      setImageUrl(dataUrl);
    } catch (err) {
      setError(err.message || 'Image processing failed. Try another photo or paste a URL.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Dish name is required');
      return;
    }
    if (!categoryId) {
      setError('Please select a category');
      return;
    }
    if (price === '' || isNaN(Number(price))) {
      setError('Please enter a valid price');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name: name.trim(),
      categoryId,
      price: Number(price),
      description: description.trim(),
      isVeg,
      isBestseller,
      isAvailable,
      imageUrl: imageUrl.trim()
    };

    try {
      if (isEditing) {
        const updated = await api.updateItem(item.id, payload);
        onSave(updated);
      } else {
        const created = await api.createItem(payload);
        onSave(created);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save menu item');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl my-8 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h3 className="font-serif text-xl font-bold text-amber-200">
            {isEditing ? 'Edit Dish Details' : 'Add New Dish to Menu'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Dish Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Dish Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Saffron Paneer Tikka"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category & Price in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 340"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Availability Status Toggle */}
          <div className="pt-1">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <span className="text-xs font-semibold text-zinc-200">
                {isAvailable ? 'In Stock (Available on Menu)' : 'Sold Out (Mark as Unavailable)'}
              </span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Short Appetizing Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Charcoal grilled cottage cheese cubes in saffron hung curd marinade..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Direct Photo Upload & URL Section */}
          <div className="pt-3 border-t border-zinc-800 space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              Dish Photo (Live Sync)
            </label>

            {/* If photo is selected, show nice preview card */}
            {imageUrl ? (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 border border-amber-500/40 shadow-inner">
                <img
                  src={imageUrl}
                  alt="Dish Preview"
                  className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Photo Ready</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                    Ready to save and display on customer menu
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Big Direct Upload Card */
              <label className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 transition-all cursor-pointer text-center group">
                <Upload className="w-6 h-6 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-zinc-100">
                  {uploading ? 'Compressing & uploading...' : 'Upload Photo from Phone / PC'}
                </span>
                <span className="text-[10px] text-zinc-400 mt-0.5">
                  Tap to select from Gallery or Camera
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}

            {/* Optional Direct Web Link */}
            <div className="pt-1">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste direct image URL (https://...)"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-glow-gold transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Saving Dish...' : isEditing ? 'Update Dish' : 'Add Dish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
