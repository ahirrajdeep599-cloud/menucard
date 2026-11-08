import React, { useState } from 'react';
import { Star, ExternalLink, QrCode, Heart, Sparkles, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';

const OFFICIAL_GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJXRcodi7JWTkRUoTbfu-3QWA";

export default function GoogleReviewSection({ googleReviewUrl, hotelName = "Dining Delight Multicuisine Restaurant" }) {
  const [selectedStars, setSelectedStars] = useState(5);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [showQrModal, setShowQrModal] = useState(false);

  // Directly use the user's exact official Google review link
  const targetUrl = (googleReviewUrl && googleReviewUrl.trim().length > 10) 
    ? googleReviewUrl.trim() 
    : OFFICIAL_GOOGLE_REVIEW_URL;

  const handleStarClick = (rating) => {
    setSelectedStars(rating);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#fbbf24', '#ffffff', '#ef4444']
      });
    } catch (e) {
      // ignore
    }
  };

  const handleReviewClick = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.85 },
        colors: ['#f59e0b', '#fbbf24', '#ffffff', '#22c55e']
      });
    } catch (e) {
      // ignore
    }
  };

  const ratingFeedback = {
    1: "We strive to improve! Please let us know your feedback.",
    2: "We appreciate your honest dining experience.",
    3: "Thank you! We'd love to make your next visit 5-stars.",
    4: "Great to hear! Thank you for dining with us.",
    5: "Outstanding! Thank you for the glowing 5-star love! 🌟"
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 my-12">
      {/* Decorative Gradient Background Container */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-panel border border-amber-500/30 shadow-2xl text-center">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Customer Delight & Feedback</span>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400">
            Loved your meal? Rate us on Google!
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-zinc-300 max-w-md">
            Your generous review helps fellow food lovers discover {hotelName} and inspires our culinary team.
          </p>

          {/* Large Interactive Star Rating Visual */}
          <div className="mt-5 flex items-center justify-center gap-2 sm:gap-3 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoveredStars ? star <= hoveredStars : star <= selectedStars;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStars(star)}
                  onMouseLeave={() => setHoveredStars(0)}
                  onClick={() => handleStarClick(star)}
                  className="p-1 sm:p-2 cursor-pointer transition-transform hover:scale-125 active:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-7 h-7 sm:w-9 sm:h-9 transition-colors duration-200 ${
                      active
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                        : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <p className="text-xs text-amber-300/90 font-medium italic mt-1 min-h-[1.25rem]">
            {ratingFeedback[hoveredStars || selectedStars]}
          </p>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {/* Primary Google Review CTA Button with EXACT URL */}
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleReviewClick}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-bold text-sm sm:text-base tracking-wide shadow-glow-gold hover:shadow-amber-500/50 hover:brightness-105 active:scale-95 transition-all"
            >
              <span>Write a Google Review</span>
              <ExternalLink className="w-4 h-4 text-black" />
            </a>

            {/* Optional QR Code Button */}
            <button
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-medium text-sm border border-white/10 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Show Review QR</span>
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-6 pt-5 border-t border-white/10 w-full flex items-center justify-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 font-bold text-sm">4.9 ★</span>
              <span>Average Rating</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <div>
              <span className="text-zinc-200 font-semibold">850+</span> Happy Diners
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Lightbox Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-zinc-900 border border-amber-500/30 p-6 text-center shadow-2xl">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-serif text-lg font-bold text-amber-200">
              Scan to Review on Google
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Ask your table companion to scan this with their camera.
            </p>

            <div className="my-5 p-4 bg-white rounded-2xl inline-block shadow-lg">
              <QRCodeSVG
                value={targetUrl}
                size={200}
                level="M"
                includeMargin={false}
              />
            </div>

            <p className="text-xs text-amber-300 font-medium">
              ★ Opens Google Reviews directly on mobile
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
