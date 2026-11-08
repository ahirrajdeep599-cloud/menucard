import React from 'react';
import { Phone, MessageCircle, MapPin, ChevronDown, Clock, Leaf } from 'lucide-react';

export default function HeroSection({ settings, onExploreClick }) {
  const {
    hotelName = "Dining Delight Multicuisine Restaurant",
    tagline = "100% Pure Vegetarian Fine Dining & Exquisite Flavors",
    phone = "09428925716",
    whatsapp = "+919428925716",
    address = "Bhavana Society, opp. Viral Vatika, near Shital Park Road, Puneet Nagar, Bajrang Wadi, Rajkot, Gujarat 360006",
    googleMapsUrl = "https://maps.app.goo.gl/YKQURwjkkjW7NJur9",
    logoUrl,
    heroBgUrl,
    openingHours = "11:00 AM – 3:30 PM, 7:00 PM – 12:30 AM",
  } = settings || {};

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWa = whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="relative w-full overflow-hidden min-h-[72vh] md:min-h-[80vh] flex flex-col justify-between">
      {/* Background Hero Image with Deep Luxury Gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `url(${heroBgUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80'})`
        }}
      >
        {/* Multilayer Dark Gradients for Maximum Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-[#08090d]" />
      </div>

      {/* Top Bar with Hours / Pure Veg Badges */}
      <header className="relative z-10 pt-4 px-4 sm:px-6 flex items-center justify-between flex-wrap gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-medium text-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{openingHours}</span>
        </div>

        {/* 100% PURE VEG HIGHLIGHT */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/50 text-xs font-bold text-emerald-300 shadow-md">
          <span className="veg-indicator scale-90" />
          <span>100% Pure Vegetarian</span>
        </div>
      </header>

      {/* Center Branding Content */}
      <div className="relative z-10 px-4 sm:px-6 py-8 flex flex-col items-center text-center max-w-xl mx-auto my-auto">
        {/* Logo with Glow Ring */}
        {logoUrl ? (
          <div className="relative mb-4 group">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 opacity-70 blur-lg group-hover:opacity-100 transition-opacity" />
            <img 
              src={logoUrl} 
              alt={hotelName} 
              className="relative w-28 h-28 sm:w-36 sm:h-36 object-contain rounded-full border-3 border-amber-400/90 shadow-2xl p-1 bg-[#fffdf7]"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full border-2 border-amber-400/80 bg-black/60 backdrop-blur-md flex items-center justify-center text-3xl mb-4 shadow-glow-gold">
            🥗
          </div>
        )}

        {/* Hotel Name */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400 tracking-tight leading-tight drop-shadow-md">
          {hotelName}
        </h1>

        {/* Tagline */}
        <p className="mt-2 text-sm sm:text-base text-zinc-300 font-light max-w-md italic tracking-wide">
          "{tagline}"
        </p>

        {/* Location pill */}
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-zinc-400 max-w-md">
          <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
          <span className="truncate">Rajkot, Gujarat</span>
        </div>

        {/* Quick Action Pills: Call / WhatsApp / Map */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {phone && (
            <a 
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-white transition-all shadow-sm"
              title="Call Restaurant"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call: {phone}</span>
            </a>
          )}

          {whatsapp && (
            <a 
              href={`https://wa.me/${cleanWa}?text=Hello%20Dining%20Delight`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 backdrop-blur-md border border-emerald-500/40 text-xs sm:text-sm font-medium text-emerald-300 transition-all shadow-sm"
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
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-white transition-all shadow-sm"
              title="View on Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Location</span>
            </a>
          )}
        </div>

        {/* Primary View Menu CTA Button */}
        <button
          onClick={onExploreClick}
          className="mt-6 group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-semibold text-sm sm:text-base tracking-wide shadow-glow-gold hover:shadow-amber-500/50 hover:brightness-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span>Explore Digital Menu</span>
          <ChevronDown className="w-4 h-4 text-black group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Bottom Fade Gradient into Content */}
      <div className="h-10 bg-gradient-to-b from-transparent to-[#08090d] w-full" />
    </div>
  );
}
