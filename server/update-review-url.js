const { readDb, writeDb } = require('./db');

const db = readDb();
db.settings = {
  hotelName: "Dining Delight Multicuisine Restaurant",
  tagline: "Good Food Good Mood • Three Cuisines One Delight (Gujarati, Punjabi, Chinese)",
  phone: "09428925716",
  whatsapp: "+919428925716",
  address: "Bhavana Society, opp. Viral Vatika, near Shital Park Road, Puneet Nagar, Bajrang Wadi, Rajkot, Gujarat 360006",
  googleMapsUrl: "https://maps.app.goo.gl/YKQURwjkkjW7NJur9",
  googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJXRcodi7JWTkRUoTbfu-3QWA",
  logoUrl: "/uploads/branding/dining-delight-logo.jpg",
  heroBgUrl: "/uploads/branding/dining-delight-ambiance.jpg",
  accentColor: "#f59e0b",
  currencySymbol: "₹",
  openingHours: "11:00 AM – 3:30 PM, 7:00 PM – 12:30 AM",
  diningNotice: "100% Pure Veg • Gujarati, Punjabi & Chinese • Rajkot, Gujarat",
  isPureVegOnly: true
};

writeDb(db);
console.log('Restored full Dining Delight settings with Google review URL:', db.settings.googleReviewUrl);
