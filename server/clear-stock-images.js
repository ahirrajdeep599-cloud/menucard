const { readDb, writeDb } = require('./db');

const db = readDb();
if (db.items && db.items.length) {
  db.items = db.items.map(item => ({
    ...item,
    imageUrl: ''
  }));
  writeDb(db);
  console.log(`Cleared stock images from ${db.items.length} dishes. All dish items are now ready for manual photo uploads.`);
} else {
  console.log('No items found in db.');
}
