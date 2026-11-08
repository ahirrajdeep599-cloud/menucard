import React, { useState } from 'react';
import { Star, ImageOff, Utensils } from 'lucide-react';

export default function MenuItemCard({ item, currencySymbol = '₹', onItemClick }) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
    <div
      onClick={() => onItemClick && onItemClick(item)}
      className={`relative group flex gap-3.5 sm:gap-4 p-3 sm:p-4 rounded-2xl glass-panel border border-white/5 hover:border-amber-500/30 transition-all duration-300 cursor-pointer overflow-hidden ${
        !isAvailable ? 'opacity-65 grayscale-[30%]' : ''
      }`}
    >
      {/* Food Photo Container */}
      <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shadow-md">
        {imageUrl && !imageError ? (
          <>
            {/* Skeleton Shimmer while loading */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
            )}
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950 text-amber-400/70 p-1.5 text-center border border-amber-500/20">
            <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-1 shadow-sm">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-[9px] text-amber-300/80 font-bold tracking-wider uppercase leading-none">Dining Delight</span>
          </div>
        )}

        {/* Bestseller Ribbon overlay on image on mobile */}
        {isBestseller && (
          <div className="absolute top-1 left-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-1.5 py-0.5 rounded-md text-[9px] font-extrabold flex items-center gap-0.5 shadow-md">
            <Star className="w-2.5 h-2.5 fill-black" />
            <span>SPECIAL</span>
          </div>
        )}

        {/* Out of stock overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center p-1">
            <span className="px-2 py-0.5 rounded-md bg-rose-950/90 border border-rose-500/40 text-rose-300 text-[10px] font-bold tracking-wider uppercase">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Header Row: Veg/Non-Veg Badge + Title */}
          <div className="flex items-start gap-2">
            <span
              className={`mt-1 flex-shrink-0 ${isVeg ? 'veg-indicator' : 'non-veg-indicator'}`}
              title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            />
            <h3 className="font-serif text-base sm:text-lg font-bold text-zinc-100 group-hover:text-amber-200 transition-colors leading-snug line-clamp-2">
              {name}
            </h3>
          </div>

          {/* Description */}
          {description && (
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Price & Status Row */}
        <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-white/5">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-amber-400 font-semibold">{currencySymbol}</span>
            <span className="font-sans text-base sm:text-lg font-extrabold text-amber-300 tracking-tight">
              {price}
            </span>
          </div>

          {!isAvailable ? (
            <span className="text-[11px] text-zinc-500 font-medium italic">
              Currently Unavailable
            </span>
          ) : (
            <span className="text-[10px] text-zinc-400 font-light tracking-wide uppercase">
              View details →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
