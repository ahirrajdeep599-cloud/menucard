import React from 'react';
import { Phone, MessageCircle, MapPin, ShieldCheck } from 'lucide-react';

export default function Footer({ settings }) {
  const {
    hotelName = "Dining Delight Multicuisine Restaurant",
    phone = "09428925716",
    whatsapp = "+919428925716",
    address = "Bhavana Society, opp. Viral Vatika, near Shital Park Road, Puneet Nagar, Bajrang Wadi, Rajkot, Gujarat 360006",
    googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Dining+Delight+Multicuisine+Restaurant+Rajkot",
    diningNotice = "100% Pure Veg • Scan QR for Digital Card • Rajkot, Gujarat"
  } = settings || {};

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWa = whatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className="w-full bg-[#090909] border-t border-[#D9AD52]/20 pt-10 pb-12 px-4 sm:px-6 mt-12 text-[#FFF1D0]/70 text-xs">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Luxury Brand Title */}
        <h4 className="font-cinzel text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1D0] via-[#FFB91F] to-[#D9AD52]">
          {hotelName}
        </h4>

        {/* Address */}
        <p className="mt-2.5 text-[#FFF1D0]/75 max-w-md leading-relaxed">
          {address}
        </p>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#151515] hover:bg-[#1e1e22] text-[#FFF1D0] border border-[#D9AD52]/25 hover:border-[#D9AD52]/55 transition-all active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Get Directions</span>
            </a>
          )}

          {phone && (
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#151515] hover:bg-[#1e1e22] text-[#FFF1D0] border border-[#D9AD52]/25 hover:border-[#D9AD52]/55 transition-all active:scale-95"
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
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/65 text-emerald-300 border border-emerald-500/35 transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>

        {/* Dining Notice */}
        <div className="mt-8 pt-5 border-t border-[#D9AD52]/15 w-full text-center text-[#FFF1D0]/60 text-xs sm:text-sm">
          <p>{diningNotice}</p>
        </div>

        {/* Privacy Notice Banner */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-[#FFF1D0]/50">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>Privacy & Security: This digital menu card operates touchless and does not collect or track customer personal data.</span>
        </div>

        <p className="mt-2.5 text-[10px] text-[#D9AD52]/65 tracking-wider uppercase">
          © {new Date().getFullYear()} {hotelName} • Digital QR Menu
        </p>
      </div>
    </footer>
  );
}
