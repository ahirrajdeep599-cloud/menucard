import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { compressImage } from '../utils/imageCompressor';
import { Save, Check, AlertCircle, Upload, KeyRound, ShieldAlert, Sparkles, RefreshCcw } from 'lucide-react';

export default function SettingsManager({ settings, onSettingsUpdated }) {
  const [formData, setFormData] = useState({
    hotelName: '',
    tagline: '',
    phone: '',
    whatsapp: '',
    address: '',
    googleMapsUrl: '',
    googleReviewUrl: '',
    logoUrl: '',
    heroBgUrl: '',
    accentColor: '#f59e0b',
    currencySymbol: '₹',
    openingHours: '',
    diningNotice: ''
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        hotelName: settings.hotelName || '',
        tagline: settings.tagline || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        address: settings.address || '',
        googleMapsUrl: settings.googleMapsUrl || '',
        googleReviewUrl: settings.googleReviewUrl || '',
        logoUrl: settings.logoUrl || '',
        heroBgUrl: settings.heroBgUrl || '',
        accentColor: settings.accentColor || '#f59e0b',
        currencySymbol: settings.currencySymbol || '₹',
        openingHours: settings.openingHours || '',
        diningNotice: settings.diningNotice || ''
      });
    }
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file, field) => {
    try {
      const compressed = await compressImage(file, 1600, 0.85);
      const res = await api.uploadImage(compressed, 'branding');
      handleChange(field, res.url);
    } catch (err) {
      setError(`Failed to upload ${field}: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await api.updateSettings(formData);
      onSettingsUpdated(res.settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(false);

    if (newPassword.length < 10) {
      setPassError('New password must be at least 10 characters long');
      return;
    }
    const hasLower = /[a-z]/.test(newPassword);
    const hasUpperOrNum = /[A-Z0-9]/.test(newPassword);
    const hasSpecial = /[^a-zA-Z0-9]/.test(newPassword);
    if (!hasLower || !hasUpperOrNum || !hasSpecial) {
      setPassError('Password must contain lowercase letters, numbers or uppercase, and at least one special character (!@#$%^&*).');
      return;
    }

    try {
      await api.changePassword(currentPassword, newPassword);
      setPassSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPassSuccess(false), 3000);
    } catch (err) {
      setPassError(err.message || 'Failed to update password');
    }
  };

  const handleResetDemo = async () => {
    if (window.confirm("Are you sure you want to restore the initial demo menu data? Any custom items will be reset to default.")) {
      try {
        await api.resetDemo();
        window.location.reload();
      } catch (err) {
        setError("Failed to reset demo data");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Main Branding & Contact Settings Form */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 rounded-2xl glass-panel border border-zinc-800 space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-amber-200">
            Hotel Branding & Information
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Update your restaurant identity, contact links, and aesthetic styling.
          </p>
        </div>

        {success && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Settings saved successfully and updated live on the digital menu!</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Hotel Name & Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Hotel / Restaurant Name *
            </label>
            <input
              type="text"
              required
              value={formData.hotelName}
              onChange={(e) => handleChange('hotelName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Tagline / Subheading
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Phone & WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Phone Number (For Call Button)
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              WhatsApp Number (with country code)
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Address & Google Maps Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Full Physical Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. Connaught Place, New Delhi"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Google Maps URL (Directions Link)
            </label>
            <input
              type="text"
              value={formData.googleMapsUrl}
              onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Google Review URL */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Google Review URL *
          </label>
          <input
            type="text"
            required
            value={formData.googleReviewUrl}
            onChange={(e) => handleChange('googleReviewUrl', e.target.value)}
            placeholder="https://g.page/r/... or https://search.google.com/local/writereview?placeid=..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
          />
          <p className="text-[11px] text-zinc-400 mt-1">
            The customer-side "Rate Us on Google" button links directly to this URL.
          </p>
        </div>

        {/* Logo & Hero Background Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
          {/* Logo */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Hotel Logo Image
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                placeholder="Image URL or upload..."
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100"
              />
              <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logoUrl')}
                  className="hidden"
                />
              </label>
            </div>
            {formData.logoUrl && (
              <img
                src={formData.logoUrl}
                alt="Logo preview"
                className="w-12 h-12 rounded-full object-cover mt-2 border border-amber-500/40"
              />
            )}
          </div>

          {/* Hero Background */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Hero Section Background Photo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.heroBgUrl}
                onChange={(e) => handleChange('heroBgUrl', e.target.value)}
                placeholder="Image URL or upload..."
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100"
              />
              <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'heroBgUrl')}
                  className="hidden"
                />
              </label>
            </div>
            {formData.heroBgUrl && (
              <img
                src={formData.heroBgUrl}
                alt="Hero preview"
                className="w-24 h-12 rounded-lg object-cover mt-2 border border-zinc-800"
              />
            )}
          </div>
        </div>

        {/* Opening Hours & Dining Notice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Opening Hours Display
            </label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => handleChange('openingHours', e.target.value)}
              placeholder="e.g. Open Daily: 11:30 AM - 11:30 PM"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Footer Dining Notice
            </label>
            <input
              type="text"
              value={formData.diningNotice}
              onChange={(e) => handleChange('diningNotice', e.target.value)}
              placeholder="e.g. Dine-in Menu • Taxes as applicable"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-glow-gold active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* 2. Security: Change Admin Password */}
      <form onSubmit={handlePasswordChange} className="p-5 sm:p-6 rounded-2xl glass-panel border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-zinc-200">
          <KeyRound className="w-4 h-4 text-amber-400" />
          <h3 className="font-serif text-base font-bold">
            Change Owner Password
          </h3>
        </div>

        {passSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {passError && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{passError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              New Password (min 10 characters, mixed types)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="e.g. Secret123!@#"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
            <p className="text-[10px] text-zinc-400 mt-1">
              Must include lowercase, numbers/uppercase, and a special character (!@#$%^&*)
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer"
          >
            Update Password
          </button>
        </div>
      </form>

      {/* 3. Reset Demo Data */}
      <div className="p-5 rounded-2xl glass-panel border border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-zinc-300 block">Reset Demo Content</span>
          <span className="text-zinc-500">Restore default restaurant menu and dishes for testing.</span>
        </div>
        <button
          type="button"
          onClick={handleResetDemo}
          className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 text-rose-400 border border-rose-900/60 font-semibold cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Reset to Demo Data</span>
        </button>
      </div>
    </div>
  );
}
