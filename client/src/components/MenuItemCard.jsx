import React, { useState } from 'react';
import { Utensils, Award, Plus, Minus } from 'lucide-react';

function DishThumbnail({ imageUrl, name }) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!imageUrl || imageError) {
    return (
      /* Retained Original Fallback Design in Luxury Black & Gold */
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#D9AD52]/10 via-[#151515] to-[#090909] text-[#D9AD52]/85 p-2 text-center">
        <div className="w-9 h-9 rounded-full bg-[#D9AD52]/15 border border-[#D9AD52]/35 flex items-center justify-center mb-1.5 shadow-sm">
          <Utensils className="w-4 h-4 text-[#FFB91F]" />
        </div>
        <span className="font-cinzel text-[9px] sm:text-[10px] text-[#D9AD52]/90 font-bold tracking-widest uppercase leading-tight">
          Dining Delight
        </span>
      </div>
    );
  }

  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#1a1a1d] animate-pulse" />
      )}
      <img
        src={imageUrl}
        alt={name}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setImageError(true)}
        className={`w-full h-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Soft Bottom Image Depth Vignette */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#090909]/65 to-transparent" />
    </>
  );
}

function MenuItemCard({
  item,
  currencySymbol = '₹',
  quantity = 0,
  onUpdateQuantity,
  onItemClick
}) {
  const {
    id,
    name,
    price,
    categoryId,
    isBestseller = false,
    isAvailable = true,
    imageUrl
  } = item;

  const isChefSpecial =
    Boolean(isBestseller) ||
    categoryId === 'cat-chef-special';

  const handleAdd = (e) => {
    e.stopPropagation();
    if (onUpdateQuantity) onUpdateQuantity(id, quantity + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (onUpdateQuantity) onUpdateQuantity(id, Math.max(0, quantity - 1));
  };

  return (
    <article
      onClick={() => onItemClick && onItemClick(item)}
      className={`menu-card-3d relative group flex flex-col justify-between p-2.5 sm:p-3.5 rounded-2xl cursor-pointer overflow-hidden ${
        quantity > 0 ? 'border-[#FFB91F]/55' : ''
      } ${!isAvailable ? 'opacity-65 grayscale-[40%]' : ''}`}
    >
      {/* Subtle Top Champagne Highlight Line on Hover */}
      <div className="pointer-events-none absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[#FFB91F]/0 group-hover:via-[#FFB91F]/70 to-transparent transition-all duration-300" />

      {/* Food Photo Container (Square Aspect Ratio) */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#0e0e10] border border-[#D9AD52]/15 shadow-inner">
        <DishThumbnail key={imageUrl || 'no-img'} imageUrl={imageUrl} name={name} />

        {/* 100% Pure Veg Indicator */}
        <div
          className="absolute top-2 left-2 bg-[#090909]/80 backdrop-blur-sm p-1 rounded-md border border-white/15 shadow-md"
          title="100% Pure Vegetarian"
        >
          <span className="veg-indicator block scale-90" />
        </div>

        {/* Chef's Special Badge where applicable */}
        {isChefSpecial && isAvailable && (
          <div className="absolute top-2 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[#090909]/90 to-[#151515]/90 border border-[#FFB91F]/50 text-[#FFB91F] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-sm">
            <Award className="w-2.5 h-2.5 text-[#FFB91F] flex-shrink-0" />
            <span className="hidden xs:inline sm:inline">Special</span>
          </div>
        )}

        {/* Sold Out Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-[#090909]/75 backdrop-blur-[2px] flex items-center justify-center p-1">
            <span className="px-2.5 py-1 rounded-lg bg-rose-950/90 border border-rose-500/50 text-rose-200 text-[10px] font-bold uppercase tracking-wider shadow-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Dish Name, Price & Add/Stepper Button */}
      <div className="mt-2.5 sm:mt-3 flex-1 flex flex-col justify-between">
        <h3 className="font-sans font-bold text-xs sm:text-sm text-[#FFF1D0] group-hover:text-[#FFB91F] transition-colors leading-snug line-clamp-2 min-h-[2.1rem]">
          {name}
        </h3>

        <div className="mt-2.5 pt-2 border-t border-[#D9AD52]/15 flex items-center justify-between gap-1.5">
          {/* Golden Price */}
          <div className="flex items-baseline gap-0.5 min-w-0">
            <span className="text-xs text-[#D9AD52] font-bold">{currencySymbol}</span>
            <span className="font-sans text-sm sm:text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1D0] via-[#FFB91F] to-[#D9AD52] tracking-tight">
              {price}
            </span>
          </div>

          {/* Add (+) or Active Quantity Stepper (- qty +) */}
          {isAvailable && (
            quantity > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#D9AD52] to-[#FFB91F] text-[#090909] shadow-[0_4px_12px_rgba(255,185,31,0.3)] flex-shrink-0 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={handleDecrement}
                  aria-label={`Decrease quantity of ${name}`}
                  className="px-2 py-1.5 hover:bg-black/10 active:bg-black/20 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.75]" />
                </button>
                <span className="px-1.5 text-xs font-black min-w-[1.2rem] text-center select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleAdd}
                  aria-label={`Increase quantity of ${name}`}
                  className="px-2 py-1.5 hover:bg-black/10 active:bg-black/20 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.75]" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                aria-label={`Add ${name} to cart`}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#090909] hover:bg-gradient-to-r hover:from-[#D9AD52] hover:to-[#FFB91F] text-[#FFB91F] hover:text-[#090909] border border-[#D9AD52]/45 hover:border-transparent text-[11px] sm:text-xs font-extrabold transition-all active:scale-95 flex-shrink-0 cursor-pointer shadow-sm"
              >
                <span>Add</span>
                <Plus className="w-3.5 h-3.5 stroke-[2.75]" />
              </button>
            )
          )}
        </div>
      </div>
    </article>
  );
}

export default React.memo(MenuItemCard);
