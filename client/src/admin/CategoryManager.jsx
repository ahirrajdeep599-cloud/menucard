import React, { useState } from 'react';
import { Plus, ArrowUp, ArrowDown, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';

export default function CategoryManager({ categories = [], items = [], onCategoriesUpdated }) {
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const created = await api.createCategory(newCatName.trim());
      onCategoriesUpdated([...categories, created]);
      setNewCatName('');
    } catch (err) {
      setError(err.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const updated = await api.updateCategory(id, { name: editName.trim() });
      const updatedList = categories.map(c => c.id === id ? { ...c, name: updated.name } : c);
      onCategoriesUpdated(updatedList);
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const dishCount = items.filter(i => i.categoryId === id).length;
    if (dishCount > 0) {
      setError(`Cannot delete "${name}" because it contains ${dishCount} dishes. Please reassign or delete them first.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.deleteCategory(id);
      onCategoriesUpdated(categories.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const listCopy = [...categories];
    const [moved] = listCopy.splice(index, 1);
    listCopy.splice(targetIndex, 0, moved);

    // Reassign order
    const orderList = listCopy.map((cat, idx) => ({ id: cat.id, order: idx + 1 }));

    try {
      await api.reorderCategories(orderList);
      const updatedWithOrder = listCopy.map((cat, idx) => ({ ...cat, order: idx + 1 }));
      onCategoriesUpdated(updatedWithOrder);
    } catch (err) {
      setError('Failed to update category order');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-zinc-800">
        <h3 className="font-serif text-lg font-bold text-amber-200">
          Menu Category Management
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Create, rename, and arrange the order of food sections appearing on the customer's QR menu card.
        </p>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="e.g. Traditional Thalis or Healthy Salads"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={loading || !newCatName.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Category List */}
      <div className="space-y-2.5">
        {categories.map((cat, index) => {
          const dishCount = items.filter(i => i.categoryId === cat.id).length;
          const isEditing = editingId === cat.id;

          return (
            <div
              key={cat.id}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl glass-panel border border-zinc-800/80 hover:border-zinc-700 transition-colors"
            >
              {/* Category Name & Count */}
              <div className="flex-1 min-w-0 mr-3">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-amber-500 text-xs text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(cat.id)}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-zinc-800/80 text-zinc-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <h4 className="font-semibold text-sm text-zinc-100 truncate">
                      {cat.name}
                    </h4>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                      {dishCount} {dishCount === 1 ? 'dish' : 'dishes'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Move Up / Down, Edit, Delete */}
              <div className="flex items-center gap-1">
                {/* Move Up */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, -1)}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={index === categories.length - 1}
                  onClick={() => handleMove(index, 1)}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Edit Name */}
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(cat.id);
                    setEditName(cat.name);
                  }}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  title="Rename"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
