import React, { useState } from 'react';
import { X, Star, Utensils } from 'lucide-react';

export default function ItemDetailModal({ item, categoryName, currencySymbol = '₹', onClose }) {
  const [imageError, setImageError] = useState(false);

  if (!item) return null;

  const {
    name,
    description,
    price,
    isVeg = true,
    isBestseller = false,
    isAvailable = true,
    imageUrl
  } = item;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-amber-500/30 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Food Image */}
        <div className="relative w-full h-64 sm:h-72 bg-zinc-900 flex-shrink-0">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-950/30 via-zinc-900 to-zinc-950 text-amber-300 p-6 text-center border-b border-zinc-800">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-2 shadow-glow-gold">
                <Utensils className="w-7 h-7 text-amber-400" />
              </div>
              <span className="text-sm font-serif font-bold text-amber-200">Dining Delight Kitchen</span>
              <span className="text-xs text-zinc-400 mt-1 max-w-xs">Prepared fresh to order using finest authentic spices</span>
            </div>
          )}

          {/* Badges Over Image */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {!isAvailable && (
              <span className="bg-rose-950/90 border border-rose-500/50 text-rose-300 px-2.5 py-1 rounded-lg text-xs font-bold uppercase shadow-md">
                Temporarily Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Details Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {categoryName && (
            <span className="text-xs uppercase tracking-widest text-amber-400/80 font-bold">
              {categoryName}
            </span>
          )}

          <div className="mt-1 flex items-start gap-2.5">
            <span
              className="mt-1 flex-shrink-0 veg-indicator"
              title="100% Pure Vegetarian"
            />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-zinc-100 leading-snug">
              {name}
            </h2>
          </div>

          {/* Price Highlight */}
          <div className="mt-5 flex items-center justify-between pt-4 border-t border-zinc-800">
            <div>
              <span className="text-xs text-zinc-400 block">Price</span>
              <div className="flex items-baseline gap-1">
                <span className="text-base text-amber-400 font-bold">{currencySymbol}</span>
                <span className="font-sans text-2xl font-black text-amber-300">
                  {price}
                </span>
                <span className="text-xs text-zinc-400 ml-1">(plus applicable taxes)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
