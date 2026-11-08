import React, { useState, useEffect } from 'react';
import { X, Upload, Check, AlertCircle, Image as ImageIcon, Sparkles } from 'lucide-react';
import { api } from '../utils/api';
import { compressImage } from '../utils/imageCompressor';

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

  // Gallery picker state
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [showGallery, setShowGallery] = useState(false);

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

  // Load scanned photos for quick picker
  const loadGallery = async () => {
    try {
      const res = await api.scanMedia();
      setGalleryFiles(res.dishesFiles || []);
      setShowGallery(true);
    } catch (err) {
      console.error("Failed to scan gallery:", err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      // Compress in browser canvas before uploading
      const compressed = await compressImage(file, 1200, 0.82);
      const res = await api.uploadImage(compressed, 'dishes');
      setImageUrl(res.url);
    } catch (err) {
      setError(err.message || 'Image upload failed. Try pasting an image URL instead.');
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

          {/* Image Upload / URL Section */}
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Dish Photo
              </label>
              <button
                type="button"
                onClick={loadGallery}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Pick from Uploaded Media</span>
              </button>
            </div>

            {/* Direct File Upload button */}
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-medium cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>{uploading ? 'Compressing & Uploading...' : 'Upload Image from PC/Phone'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* OR image URL input */}
            <div className="mt-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste image URL (Unsplash or web link)..."
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Image Preview */}
            {imageUrl && (
              <div className="mt-3 flex items-center gap-3 p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover border border-white/10"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] text-emerald-400 font-medium block">
                    ✓ Photo ready
                  </span>
                  <span className="text-[10px] text-zinc-400 truncate block">
                    {imageUrl}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Scanned Gallery Drawer if open */}
            {showGallery && galleryFiles.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-zinc-900 border border-amber-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-amber-300">
                    Select from uploaded folder ({galleryFiles.length} photos)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowGallery(false)}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto no-scrollbar">
                  {galleryFiles.map((gf) => (
                    <button
                      key={gf.filename}
                      type="button"
                      onClick={() => {
                        setImageUrl(gf.url);
                        setShowGallery(false);
                      }}
                      className="group relative rounded-lg overflow-hidden border border-zinc-800 hover:border-amber-500 aspect-square"
                    >
                      <img
                        src={gf.url}
                        alt={gf.filename}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
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
