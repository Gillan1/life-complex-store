/**
 * scripts/generate-seed.js
 * يحوّل المنتجات من src/store/product-store.ts إلى INSERT statements.
 *
 * الاستخدام:
 *   node scripts/generate-seed.js > supabase/seed.sql
 */
const fs = require('fs');
const path = require('path');

// قراءة product-store.ts واستخراج initialProducts
const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'store', 'product-store.ts'), 'utf8');

// استخراج initialProducts JSON من الكود
const match = src.match(/const initialProducts[^=]*=\s*(\[[\s\S]*?\])\s*\n\]/);
// بديل: استخدم eval بعد استخراج الـ array
const arrayStart = src.indexOf('const initialProducts: Product[] = [');
const arrayEnd = src.indexOf('\n]\n', arrayStart);
const arrayBody = src.slice(src.indexOf('[', arrayStart), arrayEnd + 2);

// تحويل TypeScript إلى JS valid: إزالة `as const` وغيرها
const jsBody = arrayBody
  .replace(/as\s+const/g, '')
  .replace(/:\s*[A-Z]\w+(\[\])?/g, ''); // إزالة type annotations بسيطة

// استخدام eval لاستخراج الـ array
let products;
try {
  products = eval(`(${jsBody})`);
} catch (e) {
  console.error('Failed to parse initialProducts:', e.message);
  console.error('First 500 chars of array body:', jsBody.slice(0, 500));
  process.exit(1);
}

function sqlStr(s) {
  if (s === null || s === undefined) return 'NULL';
  return "'" + String(s).replace(/'/g, "''") + "'";
}
function sqlNum(n) {
  if (n === null || n === undefined || isNaN(Number(n))) return 'NULL';
  return String(Number(n));
}
function sqlBool(b) {
  return b ? 'TRUE' : 'FALSE';
}

console.log('-- توليد تلقائي من scripts/generate-seed.js');
console.log('-- شغّل هذا الملف في Supabase SQL Editor بعد schema.sql');
console.log('');
console.log('BEGIN;');
console.log('');
console.log('DELETE FROM lc_products WHERE TRUE;');
console.log('');
console.log('INSERT INTO lc_products');
console.log('  (name_ar, name_en, description_ar, description_en, price, image_url, category, is_service, service_type, size, platform, sort_order, is_active)');
console.log('VALUES');

const rows = products.map((p, idx) => {
  const sortOrder = products.length - idx;
  return `  (${sqlStr(p.nameAr)}, ${sqlStr(p.nameEn)}, ${sqlStr(p.descriptionAr)}, ${sqlStr(p.descriptionEn)}, ${sqlNum(p.price)}, ${sqlStr(p.image)}, ${sqlStr(p.category)}, ${sqlBool(p.isService || false)}, ${sqlStr(p.serviceType)}, ${sqlStr(p.size)}, ${sqlStr(p.platform)}, ${sqlNum(sortOrder)}, TRUE)`;
});

console.log(rows.join(',\n') + ';');
console.log('');
console.log("SELECT setval('lc_products_id_seq', (SELECT COALESCE(MAX(id), 1) FROM lc_products), TRUE);");
console.log('');
console.log('COMMIT;');
console.log('');
console.log('-- تم استيراد ' + products.length + ' منتج.');
