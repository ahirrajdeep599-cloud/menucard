const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'data', 'db.json');
const BACKUPS_DIR = path.join(__dirname, 'backups');

const DEFAULT_DATA = {
  settings: {
    hotelName: "Dining Delight Multicuisine Restaurant",
    tagline: "100% Pure Vegetarian Fine Dining & Exquisite Flavors",
    phone: "09428925716",
    whatsapp: "+919428925716",
    address: "Bhavana Society, opp. Viral Vatika, near Shital Park Road, Puneet Nagar, Bajrang Wadi, Rajkot, Gujarat 360006",
    googleMapsUrl: "https://maps.app.goo.gl/YKQURwjkkjW7NJur9",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJXRcodi7JWTkRUoTbfu-3QWA",
    logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80",
    heroBgUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80",
    accentColor: "#f59e0b",
    currencySymbol: "₹",
    openingHours: "11:00 AM – 3:30 PM, 7:00 PM – 12:30 AM",
    diningNotice: "100% Pure Veg • Scan QR for Digital Card • Rajkot, Gujarat",
    isPureVegOnly: true
  },
  admin: {
    username: process.env.ADMIN_USERNAME || "admin547",
    email: process.env.ADMIN_EMAIL || "admin547@diningdelight.com",
    // Salted bcrypt hash with 12 rounds
    passwordHash: bcrypt.hashSync(process.env.ADMIN_INITIAL_PASSWORD || "owner92744!@", 12),
    sessionVersion: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: null
  },
  categories: [
    { id: "cat-1", name: "Soups & Starters", order: 1 },
    { id: "cat-2", name: "Tandoori & Paneer Starters", order: 2 },
    { id: "cat-3", name: "Paneer Main Course Specials", order: 3 },
    { id: "cat-4", name: "Kaju & Veg Curries", order: 4 },
    { id: "cat-5", name: "Dal & Dum Biryani", order: 5 },
    { id: "cat-6", name: "Tandoori Roti & Naan", order: 6 },
    { id: "cat-7", name: "Chinese & Sizzlers", order: 7 },
    { id: "cat-8", name: "Desserts & Cold Beverages", order: 8 }
  ],
  items: [
    {
      id: "item-1",
      categoryId: "cat-1",
      name: "Crispy Corn Salt & Pepper",
      description: "Golden fried sweet corn kernels tossed with crunchy bell peppers, spring onion, and crushed black pepper.",
      price: 210,
      isVeg: true,
      isBestseller: true,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-2",
      categoryId: "cat-1",
      name: "Veg Manchow Soup with Fried Noodles",
      description: "Classic spicy and tangy Indo-Chinese soup loaded with finely chopped garden vegetables and garlic.",
      price: 160,
      isVeg: true,
      isBestseller: false,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-3",
      categoryId: "cat-1",
      name: "Hara Bhara Kebab (6 Pcs)",
      description: "Pan-fried patties of spinach, green peas, and fresh cottage cheese flavored with aromatic roasted spices.",
      price: 240,
      isVeg: true,
      isBestseller: true,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-4",
      categoryId: "cat-2",
      name: "Paneer Angara Tikka",
      description: "Smoky charcoal-grilled cottage cheese cubes infused with Kashmiri deghi mirch, mustard oil, and thick yogurt marinade.",
      price: 290,
      isVeg: true,
      isBestseller: true,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-5",
      categoryId: "cat-2",
      name: "Paneer Malai Kebab",
      description: "Mouth-melting paneer cubes marinated in rich cashew paste, fresh cream, cardamom, and white pepper.",
      price: 310,
      isVeg: true,
      isBestseller: true,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-6",
      categoryId: "cat-2",
      name: "Tandoori Stuffed Mushroom Tikka",
      description: "Button mushrooms stuffed with spiced cheese and herb filling, glazed in clay oven.",
      price: 280,
      isVeg: true,
      isBestseller: false,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-7",
      categoryId: "cat-3",
      name: "Dining Delight Special Paneer Toofani",
      description: "Chef's signature dish: fresh paneer cubes cooked in a rich, spicy roasted tomato and onion gravy topped with melted butter.",
      price: 330,
      isVeg: true,
      isBestseller: true,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-8",
      categoryId: "cat-3",
      name: "Paneer Butter Masala",
      description: "All-time favorite paneer simmered in velvety smooth makhani tomato-cashew gravy with kasuri methi.",
      price: 295,
      isVeg: true,
      isBestseller: true,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-9",
      categoryId: "cat-3",
      name: "Paneer Lababdar",
      description: "Grated and cubed cottage cheese tossed in spiced onion tomato gravy enriched with fresh cream and butter.",
      price: 310,
      isVeg: true,
      isBestseller: false,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-10",
      categoryId: "cat-4",
      name: "Kaju Curry (Kathiyawadi / Punjabi Gravy)",
      description: "Crispy roasted whole cashews simmered in a luscious brown onion-cashew rich gravy. Rajkot's favorite delicacy!",
      price: 350,
      isVeg: true,
      isBestseller: true,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-11",
      categoryId: "cat-4",
      name: "Veg Kolhapuri Spicy Handi",
      description: "Assorted seasonal vegetables tossed in fiery Kolhapuri red masala and whole spices.",
      price: 260,
      isVeg: true,
      isBestseller: false,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-12",
      categoryId: "cat-5",
      name: "Dal Fry with Double Tadka",
      description: "Yellow toor dal tempered with desi ghee, cumin, garlic flakes, and whole red chillies.",
      price: 200,
      isVeg: true,
      isBestseller: true,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-13",
      categoryId: "cat-5",
      name: "Royal Veg Dum Biryani with Raita",
      description: "Fragrant long-grain basmati rice and garden veggies dum-cooked in a clay handi with saffron, mint, and fried onions.",
      price: 280,
      isVeg: true,
      isBestseller: true,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-14",
      categoryId: "cat-6",
      name: "Garlic Butter Naan",
      description: "Freshly baked clay oven flatbread stuffed with roasted garlic cloves and glazed with butter.",
      price: 75,
      isVeg: true,
      isBestseller: true,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-15",
      categoryId: "cat-6",
      name: "Cheese Garlic Naan",
      description: "Crispy tandoor naan loaded with melted mozzarella cheese, garlic flakes, and fresh cilantro.",
      price: 110,
      isVeg: true,
      isBestseller: true,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-16",
      categoryId: "cat-7",
      name: "Veg Hakka Noodles & Manchurian Dry",
      description: "Wok-tossed noodles with shredded cabbage, capsicum, carrots, paired with crispy vegetable manchurian balls.",
      price: 250,
      isVeg: true,
      isBestseller: false,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-17",
      categoryId: "cat-8",
      name: "Sizzling Brownie with Vanilla Ice Cream",
      description: "Rich dark chocolate walnut brownie served on a smoking hot iron plate drenched in bubbling hot chocolate fudge.",
      price: 190,
      isVeg: true,
      isBestseller: true,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "item-18",
      categoryId: "cat-8",
      name: "Gulab Jamun with Rabdi",
      description: "Warm golden mawa dumplings served in sweetened condensed saffron milk (Rabdi) topped with pistachios.",
      price: 160,
      isVeg: true,
      isBestseller: true,
      isAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1589119908995-c6837fa14d48?auto=format&fit=crop&w=800&q=80"
    }
  ]
};

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readDb() {
  ensureDir(DB_PATH);
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8');
    return DEFAULT_DATA;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Ensure admin object has proper username, sessionVersion, and lockout fields
    if (!parsed.admin || !parsed.admin.sessionVersion) {
      parsed.admin = {
        ...DEFAULT_DATA.admin,
        ...(parsed.admin || {}),
        sessionVersion: parsed.admin?.sessionVersion || 1
      };
      writeDb(parsed);
    }
    return parsed;
  } catch (err) {
    console.error("Error reading database:", err.message);
    return DEFAULT_DATA;
  }
}

function writeDb(data) {
  ensureDir(DB_PATH);
  const tempPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_PATH);
}

// Automatic backup creation
function createDailyBackup() {
  try {
    ensureDir(path.join(BACKUPS_DIR, 'dummy'));
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUPS_DIR, `backup-${timestamp}.json`);
    const dbData = readDb();
    
    // Sanitize admin passwordHash before saving to public exports, keep in private backup
    fs.writeFileSync(backupFile, JSON.stringify(dbData, null, 2), 'utf-8');

    // Keep only last 10 backups
    const files = fs.readdirSync(BACKUPS_DIR)
      .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
      .sort()
      .reverse();

    if (files.length > 10) {
      files.slice(10).forEach(f => {
        try { fs.unlinkSync(path.join(BACKUPS_DIR, f)); } catch (e) {}
      });
    }

    return backupFile;
  } catch (err) {
    console.error('Failed to create automatic backup:', err.message);
    return null;
  }
}

module.exports = {
  readDb,
  writeDb,
  createDailyBackup,
  DEFAULT_DATA
};
