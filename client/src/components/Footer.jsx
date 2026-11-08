import React from 'react';
import { Phone, MessageCircle, MapPin, Lock, ShieldCheck } from 'lucide-react';

export default function Footer({ settings, onAdminClick }) {
  const {
    hotelName = "Dining Delight Multicuisine Restaurant",
    phone = "09428925716",
    whatsapp = "+919428925716",
    address = "Bhavana Society, opp. Viral Vatika, near Shital Park Road, Puneet Nagar, Bajrang Wadi, Rajkot, Gujarat 360006",
    googleMapsUrl = "https://maps.app.goo.gl/YKQURwjkkjW7NJur9",
    diningNotice = "100% Pure Veg • Scan QR for Digital Card • Rajkot, Gujarat"
  } = settings || {};

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWa = whatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className="w-full bg-[#07080b] border-t border-zinc-900 pt-10 pb-12 px-4 sm:px-6 mt-12 text-zinc-400 text-xs">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Brand Name */}
        <h4 className="font-serif text-lg font-bold text-amber-200">
          {hotelName}
        </h4>

        {/* Address */}
        <p className="mt-2 text-zinc-300 max-w-md leading-relaxed">
          {address}
        </p>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Get Directions</span>
            </a>
          )}

          {phone && (
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors"
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>

        {/* Privacy & Dining Notice */}
        <div className="mt-6 pt-5 border-t border-zinc-900 w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-400">
          <p>{diningNotice}</p>

          {/* Discreet Admin Portal Link */}
          <button
            onClick={onAdminClick}
            className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Lock className="w-3 h-3 text-zinc-500" />
            <span>Owner Admin Panel</span>
          </button>
        </div>

        {/* Privacy Notice Banner */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Privacy & Security: This digital menu card operates touchless and does not collect or track customer personal data.</span>
        </div>

        <p className="mt-2 text-[10px] text-zinc-400">
          © {new Date().getFullYear()} {hotelName} • Digital QR Menu
        </p>
      </div>
    </footer>
  );
}
