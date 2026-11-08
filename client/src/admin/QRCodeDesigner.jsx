import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, QrCode, Sparkles, Check, Copy } from 'lucide-react';

export default function QRCodeDesigner({ hotelName = "Dining Delight Multicuisine Restaurant", logoUrl }) {
  // Menu URL defaults to current origin or custom host
  const defaultUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000';
  const [targetUrl, setTargetUrl] = useState(defaultUrl);
  const [tableNumber, setTableNumber] = useState('');
  const [taglineText, setTaglineText] = useState('Scan for Touchless Digital Menu');
  const [copied, setCopied] = useState(false);

  const qrRef = useRef(null);

  const downloadSVG = () => {
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${hotelName.replace(/[^a-zA-Z0-9]/g, '_')}_QR_Menu.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const downloadPNG = () => {
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // High resolution for crisp printing (1200x1200px)
    canvas.width = 1200;
    canvas.height = 1200;

    img.onload = () => {
      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw QR image
      ctx.drawImage(img, 100, 100, 1000, 1000);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${hotelName.replace(/[^a-zA-Z0-9]/g, '_')}_QR_Menu_Print.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-zinc-800">
        <div className="flex items-center gap-2 text-amber-300 mb-1">
          <QrCode className="w-5 h-5" />
          <h3 className="font-serif text-lg font-bold">
            Table Standee & QR Code Generator
          </h3>
        </div>
        <p className="text-xs text-zinc-400">
          Generate, customize, and print QR codes to place on dining tables. Customers simply open their phone camera to scan and view the menu.
        </p>

        {/* Settings grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Menu URL Encoded in QR *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://yourrestaurant.com"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              For local testing on mobile via Wi-Fi, you can enter your PC's local IP (e.g. http://192.168.1.X:5000)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Table Number (Optional)
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. Table 04"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Standee Subtitle / Call to Action
          </label>
          <input
            type="text"
            value={taglineText}
            onChange={(e) => setTaglineText(e.target.value)}
            placeholder="Scan for Touchless Digital Menu"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Standee Preview & Actions */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 p-6 rounded-2xl glass-panel border border-zinc-800">
        {/* Printable Standee Card (What customer sees on the table) */}
        <div
          id="printable-table-standee"
          className="w-72 sm:w-80 rounded-3xl bg-white text-zinc-900 p-7 shadow-2xl flex flex-col items-center text-center border-4 border-amber-500/80"
        >
          {/* Pure Veg Green Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold tracking-wide uppercase mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>100% Pure Vegetarian</span>
          </div>

          {/* Restaurant Name */}
          <h2 className="font-serif text-xl sm:text-2xl font-black text-zinc-900 leading-tight">
            {hotelName}
          </h2>

          {tableNumber && (
            <div className="mt-1 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black tracking-wider uppercase">
              {tableNumber}
            </div>
          )}

          <p className="mt-1.5 text-xs text-zinc-600 font-medium">
            {taglineText}
          </p>

          {/* QR Code Container */}
          <div ref={qrRef} className="my-5 p-3 rounded-2xl bg-zinc-50 border-2 border-zinc-200 shadow-inner">
            <QRCodeSVG
              value={targetUrl}
              size={200}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#111827"
            />
          </div>

          {/* Scan Instructions */}
          <div className="space-y-1 text-center">
            <p className="text-xs font-bold text-zinc-800 flex items-center justify-center gap-1">
              <span>📷 Point your phone camera to view</span>
            </p>
            <p className="text-[10px] text-zinc-500">
              No App Required • Touchless & Hygienic
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          <button
            onClick={downloadPNG}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-bold text-xs sm:text-sm shadow-glow-gold active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Print-Ready PNG (High Res)</span>
          </button>

          <button
            onClick={downloadSVG}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-xs sm:text-sm border border-zinc-700 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download Vector SVG</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs sm:text-sm border border-zinc-700 active:scale-95 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Table Standee (Ctrl + P)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
