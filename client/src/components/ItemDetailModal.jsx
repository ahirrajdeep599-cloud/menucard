import React, { useState } from 'react';
import { X, Utensils, Award, Plus, Minus } from 'lucide-react';

export default function ItemDetailModal({
  item,
  categoryName,
  currencySymbol = '₹',
  quantity = 0,
  onUpdateQuantity,
  onClose
}) {
  const [imageError, setImageError] = useState(false);

  if (!item) return null;

  const {
    name,
    price,
    categoryId,
    isBestseller = false,
    isAvailable = true,
    imageUrl
  } = item;

  const isChefSpecial = Boolean(isBestseller) || categoryId === 'cat-chef-special';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#151515] border border-[#D9AD52]/40 overflow-hidden shadow-[0_28px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(217,173,82,0.18)] flex flex-col max-h-[90vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-[#090909]/80 hover:bg-[#090909] text-[#FFF1D0] backdrop-blur-md border border-[#D9AD52]/35 transition-all active:scale-90 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Food Photo */}
        <div className="relative w-full h-64 sm:h-72 bg-[#0d0d0f] flex-shrink-0">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#D9AD52]/12 via-[#151515] to-[#090909] text-[#FFF1D0] p-6 text-center border-b border-[#D9AD52]/20">
              <div className="w-16 h-16 rounded-2xl bg-[#D9AD52]/15 border border-[#D9AD52]/40 flex items-center justify-center mb-3 shadow-glow-gold">
                <Utensils className="w-7 h-7 text-[#FFB91F]" />
              </div>
              <span className="font-cinzel text-sm font-bold text-[#FFF1D0] tracking-wider">
                DINING DELIGHT KITCHEN
              </span>
              <span className="text-xs text-[#FFF1D0]/65 mt-1 max-w-xs">
                Prepared fresh to order using authentic vegetarian ingredients
              </span>
            </div>
          )}

          {/* Subtle gradient overlay bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#151515] to-transparent" />

          {/* Badges Over Image */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            {isChefSpecial && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#090909]/90 border border-[#FFB91F]/60 text-[#FFB91F] text-xs font-bold shadow-lg backdrop-blur-sm">
                <Award className="w-3.5 h-3.5 text-[#FFB91F]" />
                <span>Chef's Special</span>
              </span>
            )}

            {!isAvailable && (
              <span className="bg-rose-950/95 border border-rose-500/50 text-rose-200 px-2.5 py-1 rounded-lg text-xs font-bold uppercase shadow-md">
                Temporarily Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Details Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {categoryName && (
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#D9AD52] font-bold">
              {categoryName}
            </span>
          )}

          <div className="mt-1.5 flex items-start gap-2.5">
            <span
              className="mt-1.5 flex-shrink-0 veg-indicator"
              title="100% Pure Vegetarian"
            />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#FFF1D0] leading-snug">
              {name}
            </h2>
          </div>

          {/* Price Highlight & CTA */}
          <div className="mt-5 flex flex-wrap items-center justify-between pt-4 border-t border-[#D9AD52]/20 gap-3">
            <div>
              <span className="text-[11px] text-[#FFF1D0]/55 uppercase tracking-wider block">Price</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base text-[#D9AD52] font-bold">{currencySymbol}</span>
                <span className="font-sans text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1D0] via-[#FFB91F] to-[#D9AD52]">
                  {price}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {isAvailable !== false && onUpdateQuantity && (
                quantity > 0 ? (
                  <div className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#FFB91F] to-[#D9AD52] p-0.5 shadow-lg shadow-[#D9AD52]/20">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#090909] hover:bg-[#090909]/10 active:scale-90 transition-all cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 stroke-[2.6]" />
                    </button>
                    <span className="min-w-[26px] text-center text-sm font-black text-[#090909] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#090909] hover:bg-[#090909]/10 active:scale-90 transition-all cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 stroke-[2.6]" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="btn-gold-3d inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.6]" />
                    <span>Add</span>
                  </button>
                )
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#090909] hover:bg-[#1f1f22] border border-[#D9AD52]/35 hover:border-[#FFB91F]/70 text-[#FFF1D0] text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
