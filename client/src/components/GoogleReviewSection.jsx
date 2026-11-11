import React, { useState } from 'react';
import { Star, ExternalLink, QrCode, Heart, X, ShieldCheck, Utensils } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';

const OFFICIAL_GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJXRcodi7JWTkRUoTbfu-3QWA";

export default function GoogleReviewSection({
  googleReviewUrl,
  hotelName = "Dining Delight Multicuisine Restaurant",
  settings,
  totalDishes = 0,
  totalCategories = 0
}) {
  const [selectedStars, setSelectedStars] = useState(5);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [showQrModal, setShowQrModal] = useState(false);

  const targetUrl = (googleReviewUrl && googleReviewUrl.trim().length > 10)
    ? googleReviewUrl.trim()
    : OFFICIAL_GOOGLE_REVIEW_URL;

  const dynamicRating = settings?.googleRating || settings?.rating;
  const dynamicReviewCount = settings?.reviewCount || settings?.googleReviewCount;

  const handleStarClick = (rating) => {
    setSelectedStars(rating);
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.8 },
        colors: ['#D9AD52', '#FFB91F', '#FFF1D0', '#ffffff']
      });
    } catch (e) {
      // ignore
    }
  };

  const handleReviewClick = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 85,
        origin: { y: 0.85 },
        colors: ['#D9AD52', '#FFB91F', '#FFF1D0', '#22c55e']
      });
    } catch (e) {
      // ignore
    }
  };

  const ratingFeedback = {
    1: "We strive for excellence — please let us know how we can improve.",
    2: "Thank you for your honest feedback. We value every detail.",
    3: "Thank you! We'd love to make your next visit extraordinary.",
    4: "Delighted you enjoyed your meal with us!",
    5: "Magnificent! Thank you for sharing your 5-star Dining Delight love!"
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-3 sm:px-6 my-12">
      {/* Premium 3D Dark Glass Loyalty & Feedback Card */}
      <div className="relative overflow-hidden rounded-[2rem] p-6 sm:p-10 glass-panel border border-[#D9AD52]/35 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_-12px_rgba(217,173,82,0.18)] text-center">
        {/* Top Luminous Champagne Highlight */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-[#FFB91F]/80 to-transparent" />
        {/* Ambient Radial Golden Spotlight */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D9AD52]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Loyalty Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#090909]/80 border border-[#D9AD52]/35 text-[#D9AD52] text-xs font-semibold mb-4 shadow-md">
            <Heart className="w-3.5 h-3.5 fill-[#FFB91F] text-[#FFB91F]" />
            <span>Guest Experience & Loyalty</span>
          </div>

          {/* Golden Heading (Exact Text Required) */}
          <h2 className="font-cinzel text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1D0] via-[#FFB91F] to-[#D9AD52] leading-snug max-w-xl">
            Loved Your Meal? Share Your Experience!
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-[#FFF1D0]/75 max-w-md leading-relaxed">
            Your thoughtful review helps fellow food lovers discover {hotelName} and inspires our culinary team every day.
          </p>

          {/* Interactive 5-Star Rating Row */}
          <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3.5 py-1.5 px-4 rounded-2xl bg-[#090909]/60 border border-[#D9AD52]/20 shadow-inner">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoveredStars ? star <= hoveredStars : star <= selectedStars;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStars(star)}
                  onMouseLeave={() => setHoveredStars(0)}
                  onClick={() => handleStarClick(star)}
                  className="p-1 sm:p-1.5 cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-7 h-7 sm:w-9 sm:h-9 transition-all duration-200 ${
                      active
                        ? 'fill-[#FFB91F] text-[#FFB91F] drop-shadow-[0_0_12px_rgba(255,185,31,0.65)]'
                        : 'text-zinc-600 hover:text-[#D9AD52]/60'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <p className="text-xs text-[#D9AD52] font-medium italic mt-2.5 min-h-[1.25rem]">
            {ratingFeedback[hoveredStars || selectedStars]}
          </p>

          {/* Primary Golden CTA + Show Review QR Button */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleReviewClick}
              className="btn-gold-3d inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-2xl text-[#090909] font-extrabold text-sm sm:text-base tracking-wide cursor-pointer"
            >
              <span>Write a Google Review</span>
              <ExternalLink className="w-4 h-4 text-[#090909]" />
            </a>

            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#090909]/85 hover:bg-[#1e1e22] active:scale-95 text-[#FFF1D0] font-semibold text-sm border border-[#D9AD52]/35 hover:border-[#FFB91F]/65 transition-all cursor-pointer shadow-lg"
            >
              <QrCode className="w-4 h-4 text-[#FFB91F]" />
              <span>Show Review QR</span>
            </button>
          </div>

          {/* Dynamic Statistics Bar (Never invents ratings/counts) */}
          <div className="mt-7 pt-5 border-t border-[#D9AD52]/20 w-full flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#FFF1D0]/75">
            {dynamicRating && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090909]/60 border border-[#D9AD52]/20">
                <span className="text-[#FFB91F] font-bold text-sm">{dynamicRating} ★</span>
                <span>Google Rating</span>
              </div>
            )}

            {dynamicReviewCount && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090909]/60 border border-[#D9AD52]/20">
                <span className="text-[#FFF1D0] font-bold">{dynamicReviewCount}</span>
                <span>Verified Reviews</span>
              </div>
            )}

            {totalDishes > 0 && (
              <div className="flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-[#FFB91F]" />
                <span>
                  <strong className="text-[#FFF1D0]">{totalDishes}</strong> Pure Veg Dishes
                </span>
              </div>
            )}

            {totalCategories > 0 && (
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  <strong className="text-[#FFF1D0]">{totalCategories}</strong> Curated Sections
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review QR Code Lightbox Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-[#151515] border border-[#D9AD52]/40 p-6 text-center shadow-[0_25px_70px_rgba(0,0,0,0.95)] animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 text-[#FFF1D0]/70 hover:text-[#FFF1D0] rounded-full bg-[#090909] border border-[#D9AD52]/25 cursor-pointer"
              aria-label="Close QR modal"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-cinzel text-lg font-bold text-[#FFF1D0]">
              Scan to Review on Google
            </h3>
            <p className="text-xs text-[#FFF1D0]/65 mt-1">
              Point any smartphone camera here to review {hotelName}.
            </p>

            <div className="my-5 p-4 bg-white rounded-2xl inline-block shadow-[0_0_30px_rgba(217,173,82,0.25)] border-4 border-[#D9AD52]/60">
              <QRCodeSVG
                value={targetUrl}
                size={200}
                level="M"
                includeMargin={false}
              />
            </div>

            <p className="text-xs text-[#FFB91F] font-semibold">
              ★ Opens official Google Reviews page directly
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#090909] hover:bg-[#1f1f22] border border-[#D9AD52]/30 text-[#FFF1D0] text-xs font-semibold cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
