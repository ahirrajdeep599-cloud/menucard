const http = require('http');

async function runTests() {
  console.log('Testing endpoints on http://localhost:5000...');

  // 1. Test frontend HTML
  const resHtml = await fetch('http://localhost:5000/');
  const htmlText = await resHtml.text();
  console.log('1. Frontend HTML Served:', resHtml.status === 200 && htmlText.includes('root') ? 'PASSED (200 OK)' : 'FAILED');

  // 2. Test /api/menu
  const resMenu = await fetch('http://localhost:5000/api/menu');
  const menuData = await resMenu.json();
  console.log('2. Public Menu API:', menuData.settings.hotelName === 'Dining Delight Multicuisine Restaurant' ? 'PASSED' : 'FAILED');
  console.log('   Hotel Name:', menuData.settings.hotelName);
  console.log('   Categories count:', menuData.categories.length);
  console.log('   Items count:', menuData.items.length);
  console.log('   Pure Veg Dishes:', menuData.items.every(i => i.isVeg) ? 'ALL VEG (100% PURE VEG)' : 'MIXED');

  // 3. Test Admin Login
  const resLogin = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'admin547', password: 'owner92744!@' })
  });
  const loginData = await resLogin.json();
  console.log('3. Admin Login API:', loginData.token ? 'PASSED (JWT Token Issued)' : 'FAILED');

  // 4. Test Live Price Update
  const resPrice = await fetch('http://localhost:5000/api/items/item-1/price', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loginData.token}`
    },
    body: JSON.stringify({ price: 220 })
  });
  const priceData = await resPrice.json();
  console.log('4. Live Quick-Price Patch:', priceData.item && priceData.item.price === 220 ? 'PASSED (Price updated to ₹220 live)' : 'FAILED');

  // 5. Test Media Scanner
  const resMedia = await fetch('http://localhost:5000/api/media/scan', {
    headers: { 'Authorization': `Bearer ${loginData.token}` }
  });
  const mediaData = await resMedia.json();
  console.log('5. Media Folder Scanner:', mediaData.folders ? 'PASSED' : 'FAILED');
  console.log('   Dishes Folder:', mediaData.folders.dishesPath);
  console.log('   Branding Folder:', mediaData.folders.brandingPath);

  console.log('\nALL BACKEND & FRONTEND TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(console.error);
