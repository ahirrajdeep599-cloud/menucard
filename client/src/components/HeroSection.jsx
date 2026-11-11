import React from 'react';
import { Phone, MessageCircle, MapPin, ChevronDown, Clock, Lock, Sparkles } from 'lucide-react';

export default function HeroSection({ settings, onExploreClick, onAdminClick }) {
  const {
    hotelName = "Dining Delight Multicuisine Restaurant",
    tagline = "100% Pure Vegetarian Fine Dining & Exquisite Flavors",
    phone = "09428925716",
    whatsapp = "+919428925716",
    address = "Bhavana Society, opp. Viral Vatika, near Shital Park Road, Puneet Nagar, Bajrang Wadi, Rajkot, Gujarat 360006",
    googleMapsUrl = "https://maps.app.goo.gl/YKQURwjkkjW7NJur9",
    logoUrl = "/uploads/branding/dining-delight-logo.jpg",
    heroBgUrl = "/uploads/branding/dining-delight-ambiance.jpg",
    openingHours = "11:00 AM – 3:30 PM, 7:00 PM – 12:30 AM",
  } = settings || {};

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWa = whatsapp.replace(/[^0-9]/g, '');
  const bgImageSrc = heroBgUrl || '/uploads/branding/dining-delight-ambiance.jpg';

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
          {/* 100% PURE VEG HIGHLIGHT */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/75 backdrop-blur-md border border-emerald-400/40 text-[11px] sm:text-xs font-bold text-emerald-300 shadow-lg">
            <span className="veg-indicator scale-90" />
            <span>100% Pure Veg</span>
          </div>

          {/* Accessible Admin Portal Button */}
          {onAdminClick && (
            <button
              onClick={onAdminClick}
              title="Admin Panel Login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#151515]/85 hover:bg-[#D9AD52]/20 text-[#D9AD52] hover:text-[#FFF1D0] border border-[#D9AD52]/40 text-[11px] sm:text-xs font-semibold shadow-lg active:scale-95 transition-all cursor-pointer backdrop-blur-md"
            >
              <Lock className="w-3 h-3 text-[#FFB91F]" />
              <span>Admin</span>
            </button>
          )}
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
                    src={logoUrl}
                    alt={hotelName}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-full bg-[#fffdf7] p-1 shadow-inner"
                    onError={(e) => {
                      e.target.style.display = 'none';
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

          {/* Location & Fine Dining Badges */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090909]/70 border border-[#D9AD52]/25 text-[#FFF1D0]/90">
              <MapPin className="w-3.5 h-3.5 text-[#FFB91F] flex-shrink-0" />
              <span>Rajkot, Gujarat</span>
            </span>
          </div>

          {/* Quick 3D Action Pills: Call / WhatsApp / Location */}
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
