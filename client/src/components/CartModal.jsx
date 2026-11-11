import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Utensils, HandPlatter } from 'lucide-react';

export default function CartModal({
  cartItems = [],
  totalItems = 0,
  totalPrice = 0,
  currencySymbol = '₹',
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onClose,
  onShowToWaiter
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[90vh] bg-[#151515] border border-[#D9AD52]/35 rounded-t-3xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Luminous Highlight */}
        <div className="pointer-events-none h-[2px] w-full bg-gradient-to-r from-transparent via-[#FFB91F]/80 to-transparent" />

        {/* Header */}
        <div className="px-5 py-4 border-b border-[#D9AD52]/20 flex items-center justify-between bg-[#0f0f11]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D9AD52]/15 border border-[#D9AD52]/40 text-[#FFB91F] flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#FFF1D0]">
                Your Food Selection
              </h3>
              <p className="text-[11px] text-[#FFF1D0]/60">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} selected • Show to waiter at your table
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 rounded-full bg-[#1a1a1d] hover:bg-[#252529] text-[#FFF1D0]/75 hover:text-[#FFF1D0] border border-[#D9AD52]/25 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingBag className="w-12 h-12 text-[#D9AD52]/40 mx-auto mb-3" />
              <h4 className="font-serif text-base font-bold text-[#FFF1D0]">
                Your selection list is empty
              </h4>
              <p className="text-xs text-[#FFF1D0]/60 mt-1">
                Tap Add (+) on dishes from the menu to build your list for the waiter.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#D9AD52]/20 border border-[#D9AD52]/40 text-[#FFB91F] text-xs font-bold cursor-pointer hover:bg-[#D9AD52]/30 transition-all"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            cartItems.map(({ item, quantity }) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#0e0e10] border border-[#D9AD52]/15 shadow-inner"
              >
                {/* Dish Image Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#18181b] border border-[#D9AD52]/20 flex-shrink-0 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Utensils className="w-5 h-5 text-[#D9AD52]/65" />
                  )}
                </div>

                {/* Dish Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-1.5">
                    <span className="veg-indicator mt-0.5 flex-shrink-0 scale-75" />
                    <h4 className="font-sans font-bold text-xs sm:text-sm text-[#FFF1D0] leading-snug line-clamp-2">
                      {item.name}
                    </h4>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="text-[#FFF1D0]/55">
                      {currencySymbol}{item.price} each
                    </span>
                    <span className="text-[#D9AD52]/40">•</span>
                    <span className="font-bold text-[#FFB91F]">
                      {currencySymbol}{item.price * quantity}
                    </span>
                  </div>
                </div>

                {/* Stepper + Delete */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <div className="inline-flex items-center rounded-xl bg-[#1a1a1d] border border-[#D9AD52]/40 overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                      aria-label={`Decrease ${item.name}`}
                      className="px-2.5 py-1.5 text-[#FFB91F] hover:bg-[#D9AD52]/20 active:bg-[#D9AD52]/30 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-extrabold text-[#FFF1D0] min-w-[1.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                      aria-label={`Increase ${item.name}`}
                      className="px-2.5 py-1.5 text-[#FFB91F] hover:bg-[#D9AD52]/20 active:bg-[#D9AD52]/30 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="inline-flex items-center gap-1 text-[10px] text-rose-400/80 hover:text-rose-300 cursor-pointer transition-colors pr-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Totals & SHOW TO WAITER CTA */}
        {cartItems.length > 0 && (
          <div className="px-5 py-4 bg-[#0f0f11] border-t border-[#D9AD52]/25 space-y-3">
            {/* Estimated Total & Clear Cart */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#FFF1D0]/55 block">
                  Selection Total ({totalItems} {totalItems === 1 ? 'Item' : 'Items'})
                </span>
                <span className="font-sans text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1D0] via-[#FFB91F] to-[#D9AD52]">
                  {currencySymbol}{totalPrice}
                </span>
              </div>

              <button
                type="button"
                onClick={onClearCart}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#18181b] hover:bg-rose-950/60 border border-white/10 hover:border-rose-500/40 text-xs font-semibold text-[#FFF1D0]/70 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Cart</span>
              </button>
            </div>

            {/* Prominent Golden SHOW TO WAITER Button */}
            <button
              type="button"
              onClick={onShowToWaiter}
              className="btn-gold-3d w-full py-3.5 rounded-2xl text-[#090909] font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <HandPlatter className="w-5 h-5 text-[#090909]" />
              <span>SHOW TO WAITER</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-[#D9AD52] hover:text-[#FFF1D0] transition-colors cursor-pointer"
            >
              + Add More Dishes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
