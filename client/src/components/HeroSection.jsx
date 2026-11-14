import React from 'react';
import { Phone, MessageCircle, MapPin, ChevronDown, Clock, Sparkles, Star } from 'lucide-react';

const OFFICIAL_GOOGLE_REVIEW_URL = "https://reviews.to/dining-delight";

export default function HeroSection({ settings, onExploreClick }) {
  const {
    hotelName = "Dining Delight Multicuisine Restaurant",
    tagline = "100% Pure Vegetarian Fine Dining & Exquisite Flavors",
    phone = "09428925716",
    whatsapp = "+919428925716",
    address = "Bhavana Society, opp. Viral Vatika, near Shital Park Road, Puneet Nagar, Bajrang Wadi, Rajkot, Gujarat 360006",
    googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Dining+Delight+Multicuisine+Restaurant+Rajkot",
    googleReviewUrl,
    logoUrl = "/uploads/branding/dining-delight-logo.jpg",
    heroBgUrl = "/uploads/branding/dining-delight-ambiance.jpg",
    openingHours = "11:00 AM – 3:30 PM, 7:00 PM – 12:30 AM",
    googleRating = "4.9",
  } = settings || {};

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWa = whatsapp.replace(/[^0-9]/g, '');
  const bgImageSrc = heroBgUrl || '/uploads/branding/dining-delight-ambiance.jpg';
  const targetReviewUrl = (googleReviewUrl && googleReviewUrl.trim().length > 10)
    ? googleReviewUrl.trim()
    : OFFICIAL_GOOGLE_REVIEW_URL;

  return (
    <section className="relative w-full overflow-hidden min-h-[78vh] md:min-h-[85vh] flex flex-col justify-between bg-[#090909]">
      {/* Exact Preserved Original Restaurant Background Image with Subtle Readability Overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.02] transition-transform duration-1000 ease-out will-change-transform"
        style={{
          backgroundImage: `url(${bgImageSrc})`
        }}
      >
        {/* Multi-layer Dark Charcoal & Champagne Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090909]/85 via-[#090909]/50 to-[#090909]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,173,82,0.12)_0%,transparent_65%)] pointer-events-none" />
      </div>

      {/* Top Navigation Pill Bar */}
      <header className="relative z-10 pt-4 px-3 sm:px-6 max-w-6xl w-full mx-auto flex items-center justify-between flex-wrap gap-2">
        {/* Opening Hours Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#151515]/80 backdrop-blur-md border border-[#D9AD52]/25 text-[11px] sm:text-xs font-medium text-[#FFF1D0] shadow-lg">
          <Clock className="w-3.5 h-3.5 text-[#FFB91F] flex-shrink-0" />
          <span className="truncate max-w-[200px] sm:max-w-none">{openingHours}</span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Top Header Review Quick Link */}
          <a
            href={targetReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Review Dining Delight on Google (4.9 ★)"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D9AD52]/25 to-[#FFB91F]/20 hover:from-[#D9AD52]/40 hover:to-[#FFB91F]/35 backdrop-blur-md border border-[#FFB91F]/50 text-[11px] sm:text-xs font-bold text-[#FFF1D0] shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <Star className="w-3.5 h-3.5 text-[#FFB91F] fill-[#FFB91F]" />
            <span>Review</span>
            <span className="text-[#FFB91F] font-black">{googleRating} ★</span>
          </a>

          {/* 100% PURE VEG HIGHLIGHT */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/75 backdrop-blur-md border border-emerald-400/40 text-[11px] sm:text-xs font-bold text-emerald-300 shadow-lg">
            <span className="veg-indicator scale-90" />
            <span>100% Pure Veg</span>
          </div>
        </div>
      </header>

      {/* Center Floating 3D Glass Restaurant Showcase */}
      <div className="relative z-10 px-3 sm:px-6 py-6 sm:py-10 flex flex-col items-center justify-center my-auto w-full">
        <div className="hero-glass-3d relative w-full max-w-xl rounded-[2rem] px-5 py-7 sm:px-9 sm:py-10 flex flex-col items-center text-center animate-slide-up">
          {/* Subtle Top Corner Light Accents */}
          <div className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-[#FFB91F]/80 to-transparent" />

          {/* Floating 3D Circular Logo Frame */}
          {logoUrl ? (
            <div className="relative mb-5 animate-float-3d group">
              {/* Soft Golden Halo Glow */}
              <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-[#D9AD52]/45 via-[#FFB91F]/35 to-[#FFF1D0]/30 blur-xl animate-pulse-gold pointer-events-none" />
              {/* Outer 3D Champagne Ring */}
              <div className="relative p-1.5 rounded-full bg-gradient-to-br from-[#FFF1D0] via-[#D9AD52] to-[#8F6419] shadow-[0_14px_30px_rgba(0,0,0,0.85)]">
                <div className="rounded-full p-1 bg-[#151515]">
                  <img
                    src={logoUrl || '/uploads/branding/dining-delight-logo.jpg'}
                    alt={hotelName}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-full bg-[#fffdf7] p-1 shadow-inner"
                    onError={(e) => {
                      const fallback = '/uploads/branding/dining-delight-logo.jpg';
                      if (!e.target.dataset.retried) {
                        e.target.dataset.retried = '1';
                        e.target.src = fallback;
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-[#D9AD52] bg-[#151515] flex items-center justify-center text-3xl mb-4 shadow-glow-gold animate-float-3d">
              🍽️
            </div>
          )}

          {/* 4.9 Rating Badge Out of 5 */}
          <a
            href={targetReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Rated 4.9 out of 5 on Google Reviews"
            className="mb-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#090909]/85 hover:bg-[#1a1a1d] border border-[#FFB91F]/50 shadow-[0_4px_16px_rgba(255,185,31,0.2)] transition-all active:scale-95 cursor-pointer group"
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-3.5 h-3.5 text-[#FFB91F] fill-[#FFB91F]" />
              ))}
            </div>
            <span className="font-extrabold text-xs sm:text-sm text-[#FFF1D0]">
              <strong className="text-[#FFB91F] font-black">{googleRating}</strong> / 5 Rating
            </span>
            <span className="text-[10px] text-[#D9AD52] uppercase tracking-wider font-bold border-l border-[#D9AD52]/35 pl-2">
              Google Reviews
            </span>
          </a>

          {/* Restaurant Name with Luxury Typography */}
          <h1 className="font-cinzel text-2xl sm:text-4xl md:text-[2.6rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#FFF1D0] via-[#F2D184] to-[#D9AD52] tracking-wide leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
            {hotelName}
          </h1>

          {/* Ornamental Gold Divider */}
          <div className="mt-3 mb-2.5 flex items-center justify-center gap-3 w-48 sm:w-64">
            <div className="gold-divider flex-1" />
            <Sparkles className="w-3.5 h-3.5 text-[#FFB91F] flex-shrink-0" />
            <div className="gold-divider flex-1" />
          </div>

          {/* Tagline */}
          <p className="text-xs sm:text-sm md:text-base text-[#FFF1D0]/85 font-light max-w-md italic tracking-wide leading-relaxed">
            "{tagline}"
          </p>

          {/* Location & Rajkot's Best Various Menu Badges */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090909]/80 border border-[#D9AD52]/30 text-[#FFF1D0]/90">
              <MapPin className="w-3.5 h-3.5 text-[#FFB91F] flex-shrink-0" />
              <span>Rajkot, Gujarat</span>
            </span>

            {/* Requested: Rajkot Best Various Menu Restaurant */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#D9AD52]/20 via-[#FFB91F]/15 to-[#D9AD52]/20 border border-[#FFB91F]/45 text-[#FFF1D0] font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB91F] flex-shrink-0" />
              <span>Rajkot's Best Various Menu Restaurant</span>
            </span>
          </div>

          {/* Quick 3D Action Pills: Call / WhatsApp / Location / Review */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 w-full">
            {phone && (
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#090909]/80 hover:bg-[#1c1c1e] active:scale-95 border border-[#D9AD52]/30 hover:border-[#D9AD52]/65 text-xs sm:text-sm font-medium text-[#FFF1D0] transition-all shadow-md"
                title={`Call ${phone}`}
              >
                <Phone className="w-3.5 h-3.5 text-[#FFB91F]" />
                <span>Call: {phone}</span>
              </a>
            )}

            {whatsapp && (
              <a
                href={`https://wa.me/${cleanWa}?text=Hello%20Dining%20Delight`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/75 active:scale-95 border border-emerald-500/40 text-xs sm:text-sm font-medium text-emerald-300 transition-all shadow-md"
                title="WhatsApp Restaurant"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            )}

            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#090909]/80 hover:bg-[#1c1c1e] active:scale-95 border border-[#D9AD52]/30 hover:border-[#D9AD52]/65 text-xs sm:text-sm font-medium text-[#FFF1D0] transition-all shadow-md"
                title={address}
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Location</span>
              </a>
            )}
          </div>

          {/* Primary 3D Luxury CTA Button */}
          <button
            onClick={onExploreClick}
            className="btn-gold-3d mt-6 group inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 rounded-full text-[#090909] font-extrabold text-sm sm:text-base tracking-wide cursor-pointer"
          >
            <span>Explore Digital Menu</span>
            <ChevronDown className="w-4 h-4 text-[#090909] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Seamless Bottom Transition into Menu */}
      <div className="h-10 bg-gradient-to-b from-transparent to-[#090909] w-full pointer-events-none" />
    </section>
  );
}
