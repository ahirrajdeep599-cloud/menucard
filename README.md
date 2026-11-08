# 🍽️ Dining Delight Multicuisine Restaurant - QR Digital Menu Card

A production-ready, mobile-first responsive **Digital Menu Card website** (100% Pure Vegetarian, view-only, touchless dining) featuring interactive Google reviews and an owner admin panel with live price editing and table QR code generation.

---

## 🌟 Live Access URLs

- **Customer Digital Menu (QR Scan Target)**: [http://localhost:5000](http://localhost:5000)
- **Owner Admin Panel**: [http://localhost:5000/#admin](http://localhost:5000/#admin) or [http://localhost:5000/admin](http://localhost:5000/admin)

### 🔐 Owner Admin Login Credentials
- **Email**: `admin@hotel.com`
- **Password**: `admin123456`
*(You can change this password anytime in Admin Panel → Settings → Change Password)*

---

## 📁 Where to Drop Your Food & Restaurant Photos

You can drop multiple photos directly into these folders on your PC:

1. **Food & Dish Photos**:
   ```
   C:\Users\ahirr\.gemini\antigravity\scratch\hotel-digital-menu\uploads\dishes
   ```
2. **Hotel Logo & Hero Background**:
   ```
   C:\Users\ahirr\.gemini\antigravity\scratch\hotel-digital-menu\uploads\branding
   ```

> 💡 **Quick Tip**: Press `Win + R`, paste the folder path above, and press Enter to instantly open the folder in Windows File Explorer! You can also use the **Photos Folder** tab inside the Admin Panel to upload multiple images at once directly from your browser or mobile phone.

---

## 📋 Restaurant Details Configured

- **Hotel Name**: Dining Delight Multicuisine Restaurant
- **Tagline**: 100% Pure Vegetarian Fine Dining & Exquisite Flavors
- **Address**: Bhavana Society, opp. Viral Vatika, near Shital Park Road, Puneet Nagar, Bajrang Wadi, Rajkot, Gujarat 360006
- **Phone / WhatsApp**: `09428925716` / `+919428925716`
- **Google Maps Link**: [https://maps.app.goo.gl/YKQURwjkkjW7NJur9](https://maps.app.goo.gl/YKQURwjkkjW7NJur9)
- **Timing**: 11:00 AM – 3:30 PM, 7:00 PM – 12:30 AM
- **Dietary**: 100% Pure Vegetarian (all items marked with green FSSAI vegetarian indicator)

---

## 🚀 Key Features

### 1. Customer Side (View-Only QR Menu)
- **Atmospheric Hero Section**: High-resolution dark gradient backdrop, pure veg badge, quick Call (`tel:09428925716`), WhatsApp, and Google Maps directions buttons.
- **Sticky Category Bar**: Swipable category chips with dish counters (*Soups & Starters*, *Tandoori & Paneer Starters*, *Paneer Main Course*, *Kaju & Veg Curries*, *Dal & Dum Biryani*, *Tandoori Roti & Naan*, *Chinese & Sizzlers*, *Desserts & Beverages*).
- **Search & Filters**: Instant fuzzy search plus Chef's Special (Bestseller) filter.
- **Dish Cards**: High-res appetizing food photography with lazy loading, Veg badge, price in ₹, descriptions, out-of-stock overlay, and full photo tap-to-enlarge modal.
- **Strictly View-Only**: No shopping cart, no checkout, no payment — optimized purely for dining table QR viewing.
- **Google Review Section (Below Menu)**:
  - 5 interactive rating stars with celebratory confetti animation.
  - One-tap "Write a Google Review" button linking to Google Maps.
  - "Show Review QR" button for table companions to scan.

### 2. Owner Admin Panel (`/admin`)
- **Secure Authentication**: Email & password with bcrypt hashing and JWT tokens.
- **Quick Price Table**: Spreadsheet-style live inline price editing. Type any price and press Enter — updates the customer menu in real time!
- **Dishes Management**: Add, edit, delete dishes, toggle in-stock / out-of-stock, and mark Chef's Specials.
- **Category Management**: Add, rename, and reorder categories with Up/Down buttons.
- **Photo Folder & Media Scanner**: Lists all images dropped in `uploads/dishes` and `uploads/branding`, with one-click URL copying.
- **Table Standee QR Generator**: Generate print-ready vector QR codes (PNG & SVG) with custom table numbers and a 4x6" table tent layout ready for Ctrl+P.
- **Mobile-First Admin**: Fully responsive with bottom tab bar for smartphones.

---

## 🛠️ Commands

To start the server:
```bash
cd C:\Users\ahirr\.gemini\antigravity\scratch\hotel-digital-menu
npm start
```
To run automated verification tests:
```bash
node test-verify.js
```
