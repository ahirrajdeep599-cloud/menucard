import React, { useState, useEffect } from 'react';
import { Folder, Copy, Check, RefreshCw, Upload, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';
import { compressImage } from '../utils/imageCompressor';

export default function MediaFolderHelper() {
  const [mediaData, setMediaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedPath, setCopiedPath] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);

  const [batchUploading, setBatchUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState(null);

  const fetchScan = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.scanMedia();
      setMediaData(res);
    } catch (err) {
      setError(err.message || 'Failed to scan media directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScan();
  }, []);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'path') {
      setCopiedPath(text);
      setTimeout(() => setCopiedPath(null), 2500);
    } else {
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

  const handleBatchUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setBatchUploading(true);
    setError(null);

    let completed = 0;
    const total = files.length;

    for (const file of files) {
      try {
        setUploadProgress(`Uploading ${completed + 1} of ${total}: ${file.name}`);
        const compressed = await compressImage(file, 1200, 0.82);
        await api.uploadImage(compressed, 'dishes');
        completed++;
      } catch (err) {
        console.error("Error uploading file:", file.name, err);
      }
    }

    setBatchUploading(false);
    setUploadProgress(null);
    fetchScan();
  };

  const dishesPath = mediaData?.folders?.dishesPath || 'C:\\Users\\ahirr\\.gemini\\antigravity\\scratch\\hotel-digital-menu\\uploads\\dishes';
  const brandingPath = mediaData?.folders?.brandingPath || 'C:\\Users\\ahirr\\.gemini\\antigravity\\scratch\\hotel-digital-menu\\uploads\\branding';

  return (
    <div className="space-y-6">
      {/* 1. Main Folder Path Card */}
      <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-amber-500/30 shadow-xl">
        <div className="flex items-center gap-2.5 mb-2 text-amber-300">
          <Folder className="w-5 h-5" />
          <h3 className="font-serif text-lg font-bold">
            Local Photo Upload Folders
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
          You can paste or drag-and-drop multiple photos directly into these folders on your computer using Windows File Explorer. Any photo placed here will immediately appear below and can be used on your digital menu!
        </p>

        {/* Path 1: Dishes Folder */}
        <div className="mt-4 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              1. Food & Dishes Photos Folder:
            </span>
            <code className="text-xs text-zinc-200 font-mono select-all break-all">
              {dishesPath}
            </code>
          </div>
          <button
            onClick={() => copyToClipboard(dishesPath, 'path')}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all cursor-pointer"
          >
            {copiedPath === dishesPath ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Path</span>
              </>
            )}
          </button>
        </div>

        {/* Path 2: Branding Folder */}
        <div className="mt-3 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              2. Hotel Logo & Hero Background Folder:
            </span>
            <code className="text-xs text-zinc-200 font-mono select-all break-all">
              {brandingPath}
            </code>
          </div>
          <button
            onClick={() => copyToClipboard(brandingPath, 'path')}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all cursor-pointer"
          >
            {copiedPath === brandingPath ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Path</span>
              </>
            )}
          </button>
        </div>

        {/* Tip on opening Windows folder */}
        <div className="mt-3 text-[11px] text-zinc-400 italic">
          💡 Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">Win + R</kbd>, paste either path above, and press Enter to instantly open the folder in Windows Explorer!
        </div>
      </div>

      {/* 2. Direct Browser Multi-File Batch Uploader */}
      <div className="p-5 rounded-2xl glass-panel border border-zinc-800 text-center">
        <h4 className="font-semibold text-sm text-zinc-200">
          Or Upload Multiple Photos from Browser / Mobile Phone
        </h4>
        <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
          Select 10, 20 or more dish images at once. They will be auto-compressed and saved into the folder.
        </p>

        <div className="mt-4 flex flex-col items-center justify-center">
          <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95">
            <Upload className="w-4 h-4" />
            <span>Select Multiple Photos to Upload</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleBatchUpload}
              disabled={batchUploading}
              className="hidden"
            />
          </label>

          {uploadProgress && (
            <p className="text-xs text-amber-300 font-medium mt-3 animate-pulse">
              {uploadProgress}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3. Scanned Photo Gallery */}
      <div className="p-5 rounded-2xl glass-panel border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <h4 className="font-semibold text-sm text-zinc-100">
              Photos Found in Upload Folders ({mediaData?.total || 0})
            </h4>
          </div>

          <button
            onClick={fetchScan}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Scan & Refresh</span>
          </button>
        </div>

        {mediaData?.total === 0 ? (
          <div className="py-10 text-center text-zinc-500 text-xs">
            No photos uploaded yet in the folder. Drop food images into the folder path above or use the batch upload button!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[...(mediaData?.dishesFiles || []), ...(mediaData?.brandingFiles || [])].map((file) => (
              <div
                key={file.url}
                className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-all flex flex-col"
              >
                <div className="relative aspect-video sm:aspect-square bg-zinc-950 overflow-hidden">
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] text-zinc-300 font-medium">
                    {file.folder}
                  </span>
                </div>

                <div className="p-2 flex items-center justify-between gap-1 text-[11px] bg-zinc-900">
                  <span className="text-zinc-400 truncate flex-1" title={file.filename}>
                    {file.filename}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(file.url, 'url')}
                    className="p-1 rounded text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 flex-shrink-0 cursor-pointer"
                    title="Copy Image URL"
                  >
                    {copiedUrl === file.url ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
