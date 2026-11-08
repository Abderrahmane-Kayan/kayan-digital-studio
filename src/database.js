const Database = require('better-sqlite3');
const path = require('path');

// 1. كنحددو المسار فين غاتكون قاعدة البيانات (فالدوسي data لي صايبتي)
const dbPath = path.join(__dirname, '../data/kayan.db');

// 2. كنحلو قاعدة البيانات (يلا ماكانتش كاينة، كيصايبها راسو)
const db = new Database(dbPath);

// 3. كنصايبو الجدول (Table) لي غيخزن الميساجات ديال الكليان يلا ماكانش كاين
db.exec(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('✅ Database is ready and table is created!');

// 4. كنصدرو هاد قاعدة البيانات باش نستعملوها فالسيرفر ديالنا
module.exports = db;