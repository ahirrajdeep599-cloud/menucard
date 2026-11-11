import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';

export default function WaiterOrderModal({
  cartItems = [],
  totalItems = 0,
  totalPrice = 0,
  currencySymbol = '₹',
  settings,
  onBackToCart
}) {
  const hotelName = settings?.hotelName || 'Dining Delight Multicuisine Restaurant';
  const logoUrl = settings?.logoUrl || '/uploads/branding/dining-delight-logo.jpg';

  return (
    <div className="fixed inset-0 z-50 bg-[#090909] text-[#FFF1D0] flex flex-col overflow-y-auto animate-fade-in">
      {/* Subtle Ambient Top Golden Glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-56 bg-[#D9AD52]/12 rounded-full blur-3xl" />

      {/* Top Sticky Return Bar */}
      <header className="sticky top-0 z-20 bg-[#090909]/92 backdrop-blur-md border-b border-[#D9AD52]/20 px-4 sm:px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToCart}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151515] hover:bg-[#202024] border border-[#D9AD52]/35 text-[#FFF1D0] text-xs sm:text-sm font-bold active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FFB91F]" />
            <span>Back to Cart</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/35 text-emerald-300 text-[11px] font-bold">
            <span className="veg-indicator scale-75" />
            <span>100% Pure Veg</span>
          </div>
        </div>
      </header>

      {/* Main Digital Food Selection Slip */}
      <main className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-between gap-6">
        <div className="rounded-3xl bg-[#151515] border-2 border-[#D9AD52]/45 shadow-[0_24px_65px_rgba(0,0,0,0.95),0_0_40px_rgba(217,173,82,0.16)] overflow-hidden">
          {/* Top Gold Strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#D9AD52] via-[#FFB91F] to-[#D9AD52]" />

          {/* Branding & Waiter Heading */}
          <div className="px-5 sm:px-8 pt-6 pb-5 text-center border-b border-[#D9AD52]/20 bg-[#111113]">
            {/* Restaurant Logo */}
            <div className="inline-block p-1 rounded-full bg-gradient-to-br from-[#FFF1D0] via-[#D9AD52] to-[#8F6419] shadow-lg mb-3">
              <img
                src={logoUrl}
                alt={hotelName}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full bg-[#fffdf7] p-1"
                onError={(e) => {
                  const fallback = '/uploads/branding/dining-delight-logo.jpg';
                  if (!e.target.dataset.retried) {
                    e.target.dataset.retried = '1';
                    e.target.src = fallback;
                  }
                }}
              />
            </div>

            <p className="font-cinzel text-sm sm:text-base font-bold tracking-[0.2em] uppercase text-[#D9AD52]">
              DINING DELIGHT
            </p>

            <h1 className="mt-2 font-cinzel text-2xl sm:text-3xl md:text-4xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1D0] via-[#FFB91F] to-[#FFF1D0]">
              PLEASE TAKE MY ORDER
            </h1>

            <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[#D9AD52]/85">
              CUSTOMER FOOD SELECTION
            </p>
          </div>

          {/* Large Readable Food Items List */}
          <div className="px-5 sm:px-8 py-5 divide-y divide-[#D9AD52]/15">
            {cartItems.map(({ item, quantity }, index) => (
              <div
                key={item.id}
                className="py-3.5 sm:py-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <span className="mt-1.5 flex-shrink-0 w-6 h-6 rounded-full bg-[#D9AD52]/15 border border-[#D9AD52]/35 text-[#FFB91F] text-xs font-extrabold flex items-center justify-center">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <span className="veg-indicator mt-1.5 flex-shrink-0 scale-90" />
                      <h2 className="font-sans text-lg sm:text-xl font-extrabold text-[#FFF1D0] leading-snug break-words">
                        {item.name}
                      </h2>
                    </div>

                    <p className="mt-1 text-xs sm:text-sm text-[#FFF1D0]/65 font-medium pl-6">
                      {currencySymbol}{item.price} × {quantity}
                    </p>
                  </div>
                </div>

                {/* Quantity Badge & Line Total */}
                <div className="flex flex-col items-end flex-shrink-0 gap-1">
                  <span className="px-3 py-1 rounded-xl bg-[#FFB91F] text-[#090909] font-black text-base sm:text-lg shadow-md">
                    × {quantity}
                  </span>
                  <span className="font-sans text-sm sm:text-base font-bold text-[#D9AD52]">
                    {currencySymbol}{item.price * quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total Strip */}
          <div className="px-5 sm:px-8 py-5 bg-[#0e0e10] border-t-2 border-[#D9AD52]/35 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-[0.16em] text-[#FFF1D0]/60 font-bold block">
                {totalItems} {totalItems === 1 ? 'Dish' : 'Dishes'} Selected
              </span>
              <span className="font-cinzel text-lg sm:text-xl font-extrabold text-[#D9AD52] tracking-wider">
                TOTAL
              </span>
            </div>

            <div className="font-sans text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1D0] via-[#FFB91F] to-[#D9AD52]">
              {currencySymbol}{totalPrice}
            </div>
          </div>

          {/* Explicit Disclaimer Note */}
          <div className="px-5 sm:px-8 py-4 bg-[#D9AD52]/10 border-t border-[#D9AD52]/25 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#FFB91F] flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#FFF1D0]/90 font-medium leading-relaxed">
              <strong className="text-[#FFB91F]">IMPORTANT:</strong> This is only a food selection list for the waiter to read. It is NOT a confirmed order.
            </p>
          </div>
        </div>

        {/* Bottom Return Button */}
        <button
          type="button"
          onClick={onBackToCart}
          className="w-full py-3.5 rounded-2xl bg-[#151515] hover:bg-[#1f1f24] border border-[#D9AD52]/40 text-[#FFF1D0] font-bold text-sm sm:text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-[#FFB91F]" />
          <span>Back to Cart (Edit Items)</span>
        </button>
      </main>
    </div>
  );
}
