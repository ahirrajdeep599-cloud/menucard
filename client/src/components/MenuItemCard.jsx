import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

export default function MenuItemCard({ item, currencySymbol = '₹', onItemClick }) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    name,
    price,
    isAvailable = true,
    imageUrl
  } = item;

  return (
    <div
      onClick={() => onItemClick && onItemClick(item)}
      className={`relative group flex flex-col justify-between p-2.5 sm:p-3 rounded-2xl glass-panel border border-white/5 hover:border-amber-500/40 transition-all duration-300 cursor-pointer overflow-hidden shadow-md hover:shadow-xl active:scale-[0.98] ${
        !isAvailable ? 'opacity-60 grayscale-[40%]' : ''
      }`}
    >
      {/* Top: Food Photo (Square Aspect Ratio) */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-white/10">
        {imageUrl && !imageError ? (
          <>
            {!isLoaded && (
              <div className="absolute inset-0 bg-zinc-800/80 animate-pulse" />
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
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950 text-amber-400/80 p-2 text-center border border-amber-500/20">
            <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-1 shadow-sm">
              <Utensils className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[10px] text-amber-300/80 font-bold tracking-wider uppercase leading-tight">
              Dining Delight
            </span>
          </div>
        )}

        {/* 100% Pure Veg Dot badge in corner */}
        <div className="absolute top-1.5 left-1.5 bg-black/75 backdrop-blur-sm p-1 rounded-md border border-white/10 shadow">
          <span className="veg-indicator block scale-90" />
        </div>

        {/* Sold out overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center p-1">
            <span className="px-2 py-0.5 rounded-md bg-rose-950/90 border border-rose-500/50 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Bottom: Dish Name & Price Only (No Description) */}
      <div className="mt-2.5 flex-1 flex flex-col justify-between">
        <h3 className="font-sans font-bold text-xs sm:text-sm text-zinc-100 group-hover:text-amber-200 transition-colors leading-snug line-clamp-2 min-h-[2rem]">
          {name}
        </h3>

        <div className="mt-2 pt-1.5 border-t border-white/5 flex items-baseline justify-between">
          <div className="flex items-baseline gap-0.5">
            <span className="text-xs text-amber-400 font-bold">{currencySymbol}</span>
            <span className="font-sans text-sm sm:text-base font-extrabold text-amber-300 tracking-tight">
              {price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
