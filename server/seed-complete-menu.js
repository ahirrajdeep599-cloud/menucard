const fs = require('fs');
const path = require('path');
const { readDb, writeDb } = require('./db');

const categories = [
  { id: "cat-chef-special", name: "⭐ Chef's Special (Mehfil-e-Punjab & Sizzlers)", order: 1 },
  { id: "cat-navratri-desi", name: "🕉️ Navratri Special & Desi Nasta", order: 2 },
  { id: "cat-soups", name: "🍲 Soups (Hot & Fresh)", order: 3 },
  { id: "cat-starters", name: "🥟 Starters & Tandoori Grills", order: 4 },
  { id: "cat-chinese-asian", name: "🥢 Chinese & Asian (Noodles & Rice)", order: 5 },
  { id: "cat-continental-mexican", name: "🇮🇹 Continental, Italian & Mexican", order: 6 },
  { id: "cat-dal-rice", name: "🍚 Dal, Rice & Dum Biryani", order: 7 },
  { id: "cat-roti-naan", name: "🫓 Roti, Naan & Kulcha", order: 8 },
  { id: "cat-pizza", name: "🍕 Artisanal Pizza & Garlic Bread", order: 9 },
  { id: "cat-sandwiches", name: "🥪 Gourmet Grilled Sandwiches", order: 10 },
  { id: "cat-fries-papad", name: "🍟 Fries & Papad", order: 11 },
  { id: "cat-icecream-shakes", name: "🍨 Ice Cream & Thick Shakes", order: 12 },
  { id: "cat-beverages", name: "🥤 Beverages, Chaas & Lassi", order: 13 }
];

// Curated realistic appetizing Unsplash food photography
const IMAGES = {
  curry_red: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
  curry_yellow: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
  paneer_tikka: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
  paneer_gravy: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
  sizzler: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  noodles: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
  fried_rice: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
  manchurian: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
  soup_tomato: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
  soup_corn: "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=800&q=80",
  pasta: "https://images.unsplash.com/photo-1621996346565-e3d5d6281729?auto=format&fit=crop&w=800&q=80",
  lasagna: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80",
  bruschetta: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80",
  mexican: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80",
  naan: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80",
  roti: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
  paratha: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80",
  thepla_gathiya: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
  biryani: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
  dal: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  pizza_margherita: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
  garlic_bread: "https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=800&q=80",
  sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
  fries: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",
  ice_cream: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
  shake: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
  coffee: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
  tea: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
  lassi: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
  chaas: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
  papad: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80"
};

const rawDishes = [
  // 1. CHEF'S SPECIAL (MEHFIL-E-PUNJAB)
  { cat: "cat-chef-special", name: "Veg Diwani Handi", price: 329, special: true, img: IMAGES.curry_yellow, desc: "Assorted garden vegetables slow-cooked in a traditional clay handi with cashew-onion rich gravy." },
  { cat: "cat-chef-special", name: "Veg Lazeez Keema", price: 379, special: true, img: IMAGES.curry_red, desc: "Minced soya and vegetable chunks infused with aromatic Punjabi whole spices and butter." },
  { cat: "cat-chef-special", name: "Veg Khyber", price: 399, special: true, img: IMAGES.curry_red, desc: "Chef's signature spicy vegetable specialty cooked in a rich Frontier-style tomato-onion masala." },
  { cat: "cat-chef-special", name: "Veg Sizzling Curry", price: 399, special: true, img: IMAGES.sizzler, desc: "Exotic vegetable dumplings served on a sizzling hot platter bathed in bubbling rich gravy." },
  { cat: "cat-chef-special", name: "Shahi Cheese Angoori", price: 449, special: true, img: IMAGES.paneer_gravy, desc: "Small round cheese dumplings simmered in a royal saffron-cashew white gravy topped with dry fruits." },
  { cat: "cat-chef-special", name: "Paneer Pahadi", price: 399, special: true, img: IMAGES.paneer_tikka, desc: "Fresh cottage cheese marinated in crushed mint, coriander, green chilies, and grilled in tandoor." },
  { cat: "cat-chef-special", name: "Sizzling Paneer", price: 429, special: true, img: IMAGES.sizzler, desc: "Cottage cheese steaks tossed with bell peppers and roasted spices served piping hot on a sizzler plate." },
  { cat: "cat-chef-special", name: "Dining Delight Special Curry", price: 449, special: true, img: IMAGES.paneer_gravy, desc: "Our house masterpiece: triple-layered gravy with roasted paneer cubes and crunchy cashews." },
  { cat: "cat-chef-special", name: "Dining Delight Special Sizzler", price: 599, special: true, img: IMAGES.sizzler, desc: "Grand sizzling platter featuring vegetable patties, paneer tikka, seasoned fries, and aromatic fried rice." },

  // CHEF'S SPECIAL (ASIAN & CONTINENTAL & MEXICAN)
  { cat: "cat-chef-special", name: "Paneer Kung Pao", price: 299, special: true, img: IMAGES.paneer_tikka, desc: "Crispy paneer cubes tossed with roasted peanuts, dry red chilies, and tangy Kung Pao sauce." },
  { cat: "cat-chef-special", name: "Spinach Noodles", price: 249, special: true, img: IMAGES.noodles, desc: "Fresh spinach-infused noodles wok-tossed with seasonal greens and garlic." },
  { cat: "cat-chef-special", name: "Creamy Spinach Rice", price: 299, special: true, img: IMAGES.fried_rice, desc: "Fragrant basmati rice tossed with velvety spinach puree, butter, and herb seasoning." },
  { cat: "cat-chef-special", name: "Pasta Pesto Paneer", price: 349, special: true, img: IMAGES.pasta, desc: "Penne pasta and tender paneer tossed in aromatic Italian basil-walnut pesto cream." },
  { cat: "cat-chef-special", name: "Baked Veg Lasagna", price: 349, special: true, img: IMAGES.lasagna, desc: "Layered pasta sheets stuffed with minced vegetables, pomodoro sauce, and melted mozzarella." },
  { cat: "cat-chef-special", name: "Bruschetta", price: 249, special: true, img: IMAGES.bruschetta, desc: "Crispy toasted French bread topped with marinated tomatoes, fresh basil, and extra virgin olive oil." },
  { cat: "cat-chef-special", name: "Enchiladas", price: 329, special: true, img: IMAGES.mexican, desc: "Rolled corn tortillas stuffed with spiced beans and cheese, baked in spicy Mexican salsa." },
  { cat: "cat-chef-special", name: "Quesadilla", price: 299, special: true, img: IMAGES.mexican, desc: "Warm folded flour tortillas stuffed with melted cheese, bell peppers, corn, and jalapeños." },

  // CHEF'S SPECIAL (STARTERS & ROTI)
  { cat: "cat-chef-special", name: "Chinese Khazana", price: 399, special: true, img: IMAGES.manchurian, desc: "Assorted platter of spring rolls, paneer chili, and crispy wontons." },
  { cat: "cat-chef-special", name: "Paneer Satay", price: 299, special: true, img: IMAGES.paneer_tikka, desc: "Grilled paneer skewers served with Indonesian spiced peanut dipping sauce." },
  { cat: "cat-chef-special", name: "Pesto Paneer Starter", price: 329, special: true, img: IMAGES.paneer_tikka, desc: "Charcoal grilled paneer infused with Italian basil pesto and crushed pepper." },
  { cat: "cat-chef-special", name: "Cheese Corn Balls", price: 299, special: true, img: IMAGES.thepla_gathiya, desc: "Golden fried crispy croquettes stuffed with sweet corn kernels and gooey melted cheese." },
  { cat: "cat-chef-special", name: "Spinach Cheese Balls", price: 299, special: true, img: IMAGES.thepla_gathiya, desc: "Crispy outer crust with melted mozzarella and fresh farm spinach center." },
  { cat: "cat-chef-special", name: "Special Dhaba Roti", price: 79, special: true, img: IMAGES.roti, desc: "Crispy rustic whole wheat bread baked in tandoor with roasted spices and ghee." },
  { cat: "cat-chef-special", name: "Missi Roti", price: 79, special: true, img: IMAGES.roti, desc: "Gram flour and whole wheat flatbread flavored with ajwain, kasuri methi, and butter." },
  { cat: "cat-chef-special", name: "Hariyali Naan (Special)", price: 109, special: true, img: IMAGES.naan, desc: "Leavened clay oven bread brushed with fresh mint-cilantro puree and butter." },

  // 2. NAVRATRI SPECIAL & DESI NASTA
  { cat: "cat-navratri-desi", name: "Suki Bhaji (100 gram)", price: 60, special: false, img: IMAGES.thepla_gathiya, desc: "Traditional Gujarati dry spiced potato stir-fry with sesame seeds, curry leaves, and green chillies." },
  { cat: "cat-navratri-desi", name: "Thepla (3 pcs)", price: 60, special: true, img: IMAGES.thepla_gathiya, desc: "Soft spiced fenugreek (methi) flatbreads prepared the authentic Gujarati way." },
  { cat: "cat-navratri-desi", name: "Aloo Paratha with Curd", price: 120, special: true, img: IMAGES.paratha, desc: "Stuffed spiced mashed potato paratha roasted in desi ghee, served with fresh yogurt." },
  { cat: "cat-navratri-desi", name: "Gathiya Vanela (100 gram)", price: 70, special: false, img: IMAGES.thepla_gathiya, desc: "Freshly fried soft twisted gram flour savory snacks - Rajkot's iconic morning delight." },
  { cat: "cat-navratri-desi", name: "Gathiya Fafda (100 gram)", price: 70, special: false, img: IMAGES.thepla_gathiya, desc: "Crispy melt-in-mouth gram flour strips served traditionally." },

  // 3. SOUPS
  { cat: "cat-soups", name: "Sweet Corn Soup", price: 120, special: false, img: IMAGES.soup_corn, desc: "Silky, comforting broth with crushed golden corn kernels and tender vegetables." },
  { cat: "cat-soups", name: "Cream of Tomato Soup", price: 120, special: false, img: IMAGES.soup_tomato, desc: "Classic rich soup made with ripe plum tomatoes, fresh cream, and crunchy croutons." },
  { cat: "cat-soups", name: "Veg Manchow Soup", price: 120, special: true, img: IMAGES.soup_tomato, desc: "Spicy and tangy Indo-Chinese soup loaded with vegetables, topped with crispy fried noodles." },
  { cat: "cat-soups", name: "Veg Manchurian Soup", price: 120, special: false, img: IMAGES.soup_tomato, desc: "Savory garlic broth featuring steamed vegetable dumplings and scallions." },
  { cat: "cat-soups", name: "Hot & Sour Soup", price: 120, special: false, img: IMAGES.soup_tomato, desc: "Traditional dark broth balanced with red chilies, white vinegar, mushrooms, and bamboo shoots." },

  // 4. STARTERS & TANDOORI
  { cat: "cat-starters", name: "Paneer Tikka (Tandoori)", price: 329, special: true, img: IMAGES.paneer_tikka, desc: "Cubes of fresh cottage cheese marinated in spiced yogurt and slow-grilled in charcoal tandoor." },
  { cat: "cat-starters", name: "Dry Manchurian", price: 160, special: false, img: IMAGES.manchurian, desc: "Crispy golden fried vegetable balls tossed with onion, capsicum, and dark soya garlic glaze." },
  { cat: "cat-starters", name: "Chinese Bhel", price: 180, special: false, img: IMAGES.manchurian, desc: "Crispy noodles tossed with shredded vegetables and sweet-spicy chili-garlic sauces." },
  { cat: "cat-starters", name: "Paneer Chilli Dry", price: 240, special: true, img: IMAGES.paneer_tikka, desc: "Cubes of paneer pan-tossed with bell peppers, green chilies, and tangy soy sauce." },
  { cat: "cat-starters", name: "Dragon Potato", price: 160, special: false, img: IMAGES.fries, desc: "Crisp potato fingers tossed in fiery Sichuan sauce with sesame seeds." },

  // 5. CHINESE & ASIAN (NOODLES & RICE)
  { cat: "cat-chinese-asian", name: "Vegetable Hakka Noodles", price: 170, special: false, img: IMAGES.noodles, desc: "Classic wok-tossed noodles with crunchy carrots, cabbage, capsicum, and white pepper." },
  { cat: "cat-chinese-asian", name: "Vegetable Manchurian Noodles", price: 180, special: false, img: IMAGES.noodles, desc: "Hakka noodles served with spicy vegetable manchurian gravy and scallions." },
  { cat: "cat-chinese-asian", name: "Schezwan Noodles", price: 180, special: true, img: IMAGES.noodles, desc: "Noodles tossed in fiery homemade Schezwan pepper paste and spring onions." },
  { cat: "cat-chinese-asian", name: "Chilli Garlic Noodles", price: 200, special: false, img: IMAGES.noodles, desc: "Spicy noodles infused with burnt garlic flakes and crushed red chilies." },
  { cat: "cat-chinese-asian", name: "Vegetable Fried Rice", price: 170, special: false, img: IMAGES.fried_rice, desc: "Aromatic basmati rice stir-fried with diced vegetables, soy sauce, and sesame oil." },
  { cat: "cat-chinese-asian", name: "Vegetable Manchurian Rice", price: 180, special: false, img: IMAGES.fried_rice, desc: "Fried rice paired with savory vegetable manchurian balls." },
  { cat: "cat-chinese-asian", name: "Schezwan Rice", price: 180, special: true, img: IMAGES.fried_rice, desc: "Fiery wok-tossed rice flavored with hot Schezwan red pepper reduction." },
  { cat: "cat-chinese-asian", name: "Chilli Garlic Rice", price: 199, special: false, img: IMAGES.fried_rice, desc: "Stir-fried rice loaded with roasted garlic bits and fresh green chillies." },

  // 6. PIZZA & GARLIC BREAD
  { cat: "cat-pizza", name: "Margherita Pizza", price: 179, special: false, img: IMAGES.pizza_margherita, desc: "Classic Italian pizza with herb-infused tomato sauce and melted mozzarella cheese." },
  { cat: "cat-pizza", name: "Cheese Garlic Bread", price: 149, special: true, img: IMAGES.garlic_bread, desc: "Crispy oven-baked French loaf topped with roasted garlic butter and bubbly cheese." },
  { cat: "cat-pizza", name: "Cheese & Tomato Pizza", price: 199, special: false, img: IMAGES.pizza_margherita, desc: "Fresh sliced plum tomatoes, oregano, and double mozzarella." },
  { cat: "cat-pizza", name: "Farm House Pizza", price: 220, special: true, img: IMAGES.pizza, desc: "Loaded with crunchy capsicum, sweet corn, mushrooms, black olives, and tomatoes." },
  { cat: "cat-pizza", name: "Italian Pizza", price: 219, special: false, img: IMAGES.pizza, desc: "Authentic thin crust pizza with bell peppers, olives, jalapeños, and fresh basil." },
  { cat: "cat-pizza", name: "Corn Cheese Pizza", price: 219, special: false, img: IMAGES.pizza, desc: "Golden American sweet corn paired with rich mozzarella and cheddar." },
  { cat: "cat-pizza", name: "Paneer Tikka Pizza", price: 219, special: true, img: IMAGES.pizza, desc: "Spiced tandoori paneer cubes, red onions, capsicum, and coriander drizzle." },
  { cat: "cat-pizza", name: "Tandoori Paneer Pizza (Special)", price: 260, special: true, img: IMAGES.pizza, desc: "Generous chunks of smoky clay-oven paneer with tikka gravy base and melted cheese." },

  // 7. GOURMET SANDWICHES
  { cat: "cat-sandwiches", name: "Bread Butter", price: 60, special: false, img: IMAGES.sandwich, desc: "Fresh bread slices generously buttered." },
  { cat: "cat-sandwiches", name: "Grilled Bread Butter", price: 90, special: false, img: IMAGES.sandwich, desc: "Golden toasted crispy bread with rich butter." },
  { cat: "cat-sandwiches", name: "Cheese Sandwich", price: 150, special: false, img: IMAGES.sandwich, desc: "Triple layered sandwich filled with processed cheese slices and seasoning." },
  { cat: "cat-sandwiches", name: "Veg Cheese Sandwich", price: 120, special: false, img: IMAGES.sandwich, desc: "Fresh cucumbers, tomatoes, and beetroot layered with cheese." },
  { cat: "cat-sandwiches", name: "Veg Cheese Grilled Sandwich", price: 150, special: true, img: IMAGES.sandwich, desc: "Toasted golden brown with spiced vegetable filling and melted cheese." },
  { cat: "cat-sandwiches", name: "Cheese Chilli Sandwich", price: 170, special: false, img: IMAGES.sandwich, desc: "Finely chopped green chilies, capsicum, and cheddar cheese grilled to perfection." },
  { cat: "cat-sandwiches", name: "Club Sandwich", price: 179, special: true, img: IMAGES.sandwich, desc: "Three-tier jumbo sandwich stuffed with coleslaw, cheese, potatoes, and tomatoes." },
  { cat: "cat-sandwiches", name: "Cheese Corn Sandwich", price: 179, special: false, img: IMAGES.sandwich, desc: "Juicy sweet corn kernels and mozzarella cheese with Italian herbs." },
  { cat: "cat-sandwiches", name: "Paneer Tikka Sandwich", price: 179, special: true, img: IMAGES.sandwich, desc: "Marinated tandoori paneer slices with mint chutney and melted cheese." },
  { cat: "cat-sandwiches", name: "Paneer Tandoori Sandwich", price: 180, special: true, img: IMAGES.sandwich, desc: "Smoky tandoori paneer chunks with spiced mayo and onions." },
  { cat: "cat-sandwiches", name: "Russian Salad Sandwich (Sweet & Cold)", price: 189, special: false, img: IMAGES.sandwich, desc: "Chilled sandwich with diced pineapples, peas, carrots, and sweet creamy mayo dressing." },

  // 8. DAL, RICE & DUM BIRYANI
  { cat: "cat-dal-rice", name: "Dal Fry", price: 119, special: false, img: IMAGES.dal, desc: "Yellow toor lentils cooked with onions, tomatoes, and ground spices." },
  { cat: "cat-dal-rice", name: "Dal Tadka", price: 129, special: true, img: IMAGES.dal, desc: "Homestyle lentils tempered with sizzling desi ghee, garlic, and cumin seeds." },
  { cat: "cat-dal-rice", name: "Dal Palak", price: 139, special: false, img: IMAGES.dal, desc: "Nutritious toor dal simmered with fresh spinach puree and mild herbs." },
  { cat: "cat-dal-rice", name: "Dal Makhani", price: 169, special: true, img: IMAGES.dal, desc: "Black lentils slow-cooked overnight with cream, farm butter, and Kashmiri chili." },
  { cat: "cat-dal-rice", name: "Plain Rice", price: 149, special: false, img: IMAGES.biryani, desc: "Fluffy steamed long-grain basmati rice." },
  { cat: "cat-dal-rice", name: "Jeera Rice", price: 179, special: true, img: IMAGES.biryani, desc: "Aged basmati rice tempered with roasted cumin seeds and fresh cilantro." },
  { cat: "cat-dal-rice", name: "Veg Pulao", price: 199, special: false, img: IMAGES.biryani, desc: "Fragrant rice tossed with green peas, carrots, beans, and whole spices." },
  { cat: "cat-dal-rice", name: "Veg Biryani", price: 189, special: false, img: IMAGES.biryani, desc: "Spiced vegetables and basmati rice slow-cooked with saffron and mint." },
  { cat: "cat-dal-rice", name: "Hyderabadi Biryani", price: 219, special: true, img: IMAGES.biryani, desc: "Fiery layered dum biryani infused with fried onions, kewra water, and spices." },
  { cat: "cat-dal-rice", name: "Paneer Pulao", price: 229, special: true, img: IMAGES.biryani, desc: "Golden pan-seared paneer cubes cooked with aromatic basmati rice." },
  { cat: "cat-dal-rice", name: "Dal Khichdi", price: 199, special: true, img: IMAGES.dal, desc: "Wholesome and comforting mix of rice and yellow lentils with desi ghee tadka." },

  // 9. ROTI, NAAN & KULCHA
  { cat: "cat-roti-naan", name: "Tawa Roti", price: 15, special: false, img: IMAGES.roti, desc: "Soft whole wheat phulka roasted on traditional iron tawa." },
  { cat: "cat-roti-naan", name: "Plain Tandoori Roti", price: 29, special: false, img: IMAGES.roti, desc: "Freshly baked whole wheat bread from the clay oven." },
  { cat: "cat-roti-naan", name: "Butter Tandoori Roti", price: 39, special: false, img: IMAGES.roti, desc: "Clay oven roasted roti brushed with golden butter." },
  { cat: "cat-roti-naan", name: "Plain Naan", price: 59, special: false, img: IMAGES.naan, desc: "Classic soft leavened white flour bread baked in tandoor." },
  { cat: "cat-roti-naan", name: "Butter Naan", price: 69, special: true, img: IMAGES.naan, desc: "Soft tandoori naan glazed with melted butter." },
  { cat: "cat-roti-naan", name: "Garlic Naan", price: 79, special: true, img: IMAGES.naan, desc: "Topped with roasted minced garlic flakes, coriander, and butter." },
  { cat: "cat-roti-naan", name: "Cheese Naan", price: 99, special: false, img: IMAGES.naan, desc: "Stuffed with melted mozzarella and cheddar cheese." },
  { cat: "cat-roti-naan", name: "Cheese Garlic Naan", price: 119, special: true, img: IMAGES.naan, desc: "Chef's favorite: filled with melted cheese and coated with garlic butter." },
  { cat: "cat-roti-naan", name: "Butter Kulcha", price: 40, special: false, img: IMAGES.roti, desc: "Soft, layered leavened bread brushed with butter." },
  { cat: "cat-roti-naan", name: "Garlic Kulcha", price: 59, special: false, img: IMAGES.roti, desc: "Fluffy kulcha topped with roasted garlic flakes." },
  { cat: "cat-roti-naan", name: "Amritsari Kulcha", price: 119, special: true, img: IMAGES.paratha, desc: "Crispy layered Punjab-style kulcha stuffed with spiced potatoes and onions." },
  { cat: "cat-roti-naan", name: "Stuffed Kulcha", price: 119, special: false, img: IMAGES.paratha, desc: "Stuffed with seasoned vegetables and paneer crumbles." },
  { cat: "cat-roti-naan", name: "Butter Paratha", price: 49, special: false, img: IMAGES.paratha, desc: "Multi-layered whole wheat paratha glazed with pure butter." },

  // 10. FRIES & PAPAD
  { cat: "cat-fries-papad", name: "Salted French Fries", price: 100, special: false, img: IMAGES.fries, desc: "Crispy golden potato batons seasoned with sea salt." },
  { cat: "cat-fries-papad", name: "Peri-Peri French Fries", price: 120, special: true, img: IMAGES.fries, desc: "Crispy fries dusted with spicy and tangy African peri-peri seasoning." },
  { cat: "cat-fries-papad", name: "Loaded Cheese Fries", price: 170, special: true, img: IMAGES.fries, desc: "Hot french fries drenched in rich liquid cheddar cheese sauce and jalapeños." },
  { cat: "cat-fries-papad", name: "Tandoori Fries", price: 170, special: false, img: IMAGES.fries, desc: "Crispy fries tossed in aromatic tandoori masala." },
  { cat: "cat-fries-papad", name: "Roasted Papad", price: 19, special: false, img: IMAGES.papad, desc: "Crispy lentil cracker roasted over open flame." },
  { cat: "cat-fries-papad", name: "Fried Papad", price: 29, special: false, img: IMAGES.papad, desc: "Deep-fried crispy urad dal papad." },
  { cat: "cat-fries-papad", name: "Masala Papad", price: 49, special: true, img: IMAGES.papad, desc: "Topped with crunchy diced onions, juicy tomatoes, green chilies, and chaat masala." },

  // 11. ICE CREAM & MILKSHAKES
  { cat: "cat-icecream-shakes", name: "Vanilla Ice Cream", price: 69, special: false, img: IMAGES.ice_cream, desc: "Classic smooth and creamy Madagascar vanilla scoop." },
  { cat: "cat-icecream-shakes", name: "Chocolate Ice Cream", price: 79, special: false, img: IMAGES.ice_cream, desc: "Rich and decadent Belgian cocoa chocolate ice cream." },
  { cat: "cat-icecream-shakes", name: "Strawberry Ice Cream", price: 69, special: false, img: IMAGES.ice_cream, desc: "Sweet strawberry ice cream churned with fruit pieces." },
  { cat: "cat-icecream-shakes", name: "Oreo Ice Cream", price: 89, special: true, img: IMAGES.ice_cream, desc: "Vanilla cream swirled with crushed Oreo chocolate biscuits." },
  { cat: "cat-icecream-shakes", name: "Kesar Pista Ice Cream", price: 89, special: true, img: IMAGES.ice_cream, desc: "Royal saffron ice cream garnished with roasted Iranian pistachios." },
  { cat: "cat-icecream-shakes", name: "Vanilla Milkshake", price: 160, special: false, img: IMAGES.shake, desc: "Thick chilled shake prepared with vanilla bean ice cream and fresh milk." },
  { cat: "cat-icecream-shakes", name: "Chocolate Milkshake", price: 160, special: false, img: IMAGES.shake, desc: "Indulgent thick chocolate shake topped with dark chocolate drizzle." },
  { cat: "cat-icecream-shakes", name: "Strawberry Milkshake", price: 160, special: false, img: IMAGES.shake, desc: "Creamy pink shake bursting with fresh strawberry flavor." },
  { cat: "cat-icecream-shakes", name: "Oreo Milkshake", price: 170, special: true, img: IMAGES.shake, desc: "Thick cookies-and-cream shake topped with crunchy Oreo chunks." },
  { cat: "cat-icecream-shakes", name: "Brownie Shake", price: 190, special: true, img: IMAGES.shake, desc: "Blended with fudge walnut brownie and dark chocolate syrup." },
  { cat: "cat-icecream-shakes", name: "Kesar Pista Milkshake", price: 190, special: true, img: IMAGES.shake, desc: "Rich royal shake infused with saffron strands and crushed almonds & pistachios." },

  // 12. BEVERAGES, CHAAS & LASSI
  { cat: "cat-beverages", name: "Hot Tea", price: 40, special: false, img: IMAGES.tea, desc: "Authentic Indian masala chai brewed with cardamom, ginger, and full-cream milk." },
  { cat: "cat-beverages", name: "Hot Coffee", price: 60, special: false, img: IMAGES.coffee, desc: "Rich frothed hot filter coffee." },
  { cat: "cat-beverages", name: "Cold Coffee", price: 160, special: true, img: IMAGES.coffee, desc: "Creamy chilled coffee blended with vanilla ice cream and chocolate swirl." },
  { cat: "cat-beverages", name: "Hot Bournvita", price: 90, special: false, img: IMAGES.coffee, desc: "Comforting hot malted chocolate beverage." },
  { cat: "cat-beverages", name: "Cold Bournvita", price: 160, special: false, img: IMAGES.shake, desc: "Chilled thick chocolate malt shake." },
  { cat: "cat-beverages", name: "Hot Milk", price: 70, special: false, img: IMAGES.tea, desc: "Warm boiled fresh dairy milk." },
  { cat: "cat-beverages", name: "Plain Buttermilk (Chaas)", price: 29, special: false, img: IMAGES.chaas, desc: "Refreshing traditional Indian churned yogurt drink." },
  { cat: "cat-beverages", name: "Masala Buttermilk (Chaas)", price: 39, special: true, img: IMAGES.chaas, desc: "Spiced Gujarati chaas with roasted cumin, rock salt, ginger, and fresh mint." },
  { cat: "cat-beverages", name: "Sweet Lassi", price: 79, special: true, img: IMAGES.lassi, desc: "Thick Punjabi sweet curd drink topped with fresh cream." },
  { cat: "cat-beverages", name: "Salted Lassi", price: 79, special: false, img: IMAGES.lassi, desc: "Savory churned yogurt drink with black salt and roasted jeera." },
  { cat: "cat-beverages", name: "Packaged Mineral Water", price: 20, special: false, img: IMAGES.chaas, desc: "Sealed 1 Litre packaged drinking water." },
  { cat: "cat-beverages", name: "Chilled Cold Drink", price: 20, special: false, img: IMAGES.chaas, desc: "Selection of chilled aerated soft drinks." }
];

function seedMenu() {
  const db = readDb();
  
  // Update settings with user's official uploaded logo and real ambiance background
  db.settings = {
    ...db.settings,
    hotelName: "Dining Delight Multicuisine Restaurant",
    tagline: "Good Food Good Mood • Three Cuisines One Delight (Gujarati, Punjabi, Chinese)",
    phone: "09428925716",
    whatsapp: "+919428925716",
    address: "Bhavana Society, opp. Viral Vatika, near Shital Park Road, Puneet Nagar, Bajrang Wadi, Rajkot, Gujarat 360006",
    googleMapsUrl: "https://maps.app.goo.gl/YKQURwjkkjW7NJur9",
    googleReviewUrl: "https://maps.app.goo.gl/YKQURwjkkjW7NJur9",
    logoUrl: "/uploads/branding/dining-delight-logo.jpg",
    heroBgUrl: "/uploads/branding/dining-delight-ambiance.jpg",
    accentColor: "#f59e0b",
    currencySymbol: "₹",
    openingHours: "11:00 AM – 3:30 PM, 7:00 PM – 12:30 AM",
    diningNotice: "100% Pure Veg • Gujarati, Punjabi & Chinese • Rajkot, Gujarat",
    isPureVegOnly: true
  };

  // Update categories
  db.categories = categories;

  // Format dishes
  const items = rawDishes.map((d, index) => ({
    id: `item-${index + 1}`,
    categoryId: d.cat,
    name: d.name,
    description: d.desc,
    price: d.price,
    isVeg: true,
    isBestseller: d.special,
    isAvailable: true,
    imageUrl: d.img
  }));

  db.items = items;
  writeDb(db);

  console.log(`Successfully seeded ${categories.length} categories and ${items.length} dishes with official logo and background!`);
}

seedMenu();
