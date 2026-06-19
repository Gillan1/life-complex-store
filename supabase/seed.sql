-- توليد تلقائي من scripts/generate-seed.js
-- شغّل هذا الملف في Supabase SQL Editor بعد schema.sql

BEGIN;

DELETE FROM lc_products WHERE TRUE;

INSERT INTO lc_products
  (name_ar, name_en, description_ar, description_en, price, image_url, category, is_service, service_type, size, platform, sort_order, is_active)
VALUES
  ('هاتف سامسونج جالكسي A54', 'Samsung Galaxy A54', 'هاتف سامسونج جالكسي A54 بشاشة AMOLED وكاميرا 50 ميجابكسل', 'Samsung Galaxy A54 with AMOLED display and 50MP camera', 245000, '/images/products/phone.png', 'phones', FALSE, NULL, NULL, NULL, 29, TRUE),
  ('هاتف شاومي ريدمي نوت 13', 'Xiaomi Redmi Note 13', 'هاتف شاومي ريدمي نوت 13 بأداء قوي وبطارية تدوم طويلاً', 'Xiaomi Redmi Note 13 with powerful performance and long-lasting battery', 120000, '/images/products/phone2.png', 'phones', FALSE, NULL, NULL, NULL, 28, TRUE),
  ('شاحن سريع 33 واط مع كابل', 'Fast Charger 33W with Cable', 'شاحن سريع بقوة 33 واط مع كابل USB-C', '33W fast charger with USB-C cable', 15000, '/images/products/charger.png', 'chargers', FALSE, NULL, NULL, NULL, 27, TRUE),
  ('سماعات لاسلكية بلوتوث', 'Wireless Bluetooth Headphones', 'سماعات لاسلكية عالية الجودة مع خاصية إلغاء الضوضاء', 'High quality wireless headphones with noise cancellation', 45000, '/images/products/headphones.png', 'headphones', FALSE, NULL, NULL, NULL, 26, TRUE),
  ('سماعات أذن لاسلكية', 'Wireless Earbuds', 'سماعات أذن لاسلكية خفيفة مع علبة شحن', 'Lightweight wireless earbuds with charging case', 28000, '/images/products/earbuds.png', 'headphones', FALSE, NULL, NULL, NULL, 25, TRUE),
  ('طقم إكسسوارات هاتف', 'Phone Accessories Kit', 'طقم إكسسوارات شامل يشمل حامل وكابل ومقبض', 'Complete accessories kit including holder, cable, and grip', 8500, '/images/products/accessories.png', 'accessories', FALSE, NULL, NULL, NULL, 24, TRUE),
  ('ساعة ذكية برو', 'Smartwatch Pro', 'ساعة ذكية متطورة مع متتبع لياقة وشاشة AMOLED', 'Advanced smartwatch with fitness tracker and AMOLED display', 65000, '/images/products/smartwatch.png', 'smartwatches', FALSE, NULL, NULL, NULL, 23, TRUE),
  ('جهاز لوحي 10 بوصة', '10-inch Tablet', 'جهاز لوحي بشاشة 10 بوصات وذاكرة 128 جيجا', '10-inch tablet with 128GB storage', 180000, '/images/products/tablet.png', 'tablets', FALSE, NULL, NULL, NULL, 22, TRUE),
  ('جراب هاتف سيليكون فاخر', 'Premium Silicone Phone Case', 'جراب سيليكون فاخر مقاوم للصدمات بتصميم أنيق', 'Premium shockproof silicone case with elegant design', 5500, '/images/products/phone-case.png', 'phone_cases', FALSE, NULL, NULL, NULL, 21, TRUE),
  ('لابتوب لينوفو IdeaPad 3', 'Lenovo IdeaPad 3 Laptop', 'لابتوب لينوفو IdeaPad 3 بمعالج i5 وذاكرة 8 جيجا وتخزين 256 SSD', 'Lenovo IdeaPad 3 with i5 processor, 8GB RAM, 256GB SSD', 350000, '/images/products/laptop.png', 'laptops', FALSE, NULL, NULL, NULL, 20, TRUE),
  ('لابتوب HP Pavilion 15', 'HP Pavilion 15 Laptop', 'لابتوب HP Pavilion 15 بشاشة FHD ومعالج i7 وذاكرة 16 جيجا', 'HP Pavilion 15 with FHD display, i7 processor, 16GB RAM', 420000, '/images/products/laptop2.png', 'laptops', FALSE, NULL, NULL, NULL, 19, TRUE),
  ('كاميرا مراقبة واي فاي', 'WiFi Security Camera', 'كاميرا مراقبة ذكية باتصال واي فاي ورؤية ليلية بدقة 1080p', 'Smart WiFi security camera with night vision, 1080p resolution', 35000, '/images/products/camera.png', 'cameras', FALSE, NULL, NULL, NULL, 18, TRUE),
  ('فلاشة USB 64 جيجا', 'USB Flash Drive 64GB', 'فلاشة USB بسعة 64 جيجابايت بسرعة نقل عالية USB 3.0', '64GB USB flash drive with high-speed USB 3.0 transfer', 5000, '/images/products/usb.png', 'storage', FALSE, NULL, NULL, NULL, 17, TRUE),
  ('كرت ذاكرة SD 128 جيجا', 'SD Memory Card 128GB', 'كرت ذاكرة مايكرو SD بسعة 128 جيجابايت للهواتف والكاميرات', '128GB Micro SD card for phones and cameras', 12000, '/images/products/sd-card.png', 'storage', FALSE, NULL, NULL, NULL, 16, TRUE),
  ('سبيكر بلوتوث JBL', 'JBL Bluetooth Speaker', 'سبيكر بلوتوث مقاوم للماء بصوت عالي وجودة ممتازة', 'Waterproof Bluetooth speaker with loud, high-quality sound', 32000, '/images/products/speaker.png', 'speakers', FALSE, NULL, NULL, NULL, 15, TRUE),
  ('راوتر واي فاي TP-Link', 'TP-Link WiFi Router', 'راوتر واي فاي ثنائي النطاق بسرعة 1200 ميجابت مع 4 هوائيات', 'Dual-band WiFi router 1200Mbps with 4 antennas', 28000, '/images/products/router.png', 'networking', FALSE, NULL, NULL, NULL, 14, TRUE),
  ('طابعة HP ليزر', 'HP Laser Printer', 'طابعة HP ليزر للطباعة السريعة بالأبيض والأسود واتصال واي فاي', 'HP laser printer for fast B&W printing with WiFi connectivity', 95000, '/images/products/printer.png', 'printers', FALSE, NULL, NULL, NULL, 13, TRUE),
  ('يد تحكم PS4 لاكستريم', 'PS4 Controller Extreme', 'يد تحكم لأجهزة PS4 بتصميم مريح واهتزاز مزدوج', 'PS4 controller with ergonomic design and dual vibration', 25000, '/images/products/controller.png', 'gaming', FALSE, NULL, NULL, NULL, 12, TRUE),
  ('باور بانك 20000 mAh', 'Power Bank 20000 mAh', 'باور بانك بسعة 20000 ميلي أمبير مع شحن سريع ومنفذين USB', '20000mAh power bank with fast charging and dual USB ports', 18000, '/images/products/powerbank.png', 'power_banks', FALSE, NULL, NULL, NULL, 11, TRUE),
  ('طقم ماوس وكيبورد لوجيتك', 'Logitech Mouse & Keyboard Set', 'طقم ماوس وكيبورد لاسلكي من لوجيتك بتصميم أنيق ومريح', 'Wireless Logitech mouse & keyboard set with elegant, comfortable design', 22000, '/images/products/keyboard.png', 'mouse_keyboard', FALSE, NULL, NULL, NULL, 10, TRUE),
  ('حامي شاشة زجاجي', 'Tempered Glass Screen Protector', 'حامي شاشة زجاجي مقسّى مقاوم للخدش لجميع أنواع الهواتف', 'Scratch-resistant tempered glass screen protector for all phones', 3000, '/images/products/screen-protector.png', 'screen_protectors', FALSE, NULL, NULL, NULL, 9, TRUE),
  ('شاشة كمبيوتر 24 بوصة', '24-inch Monitor', 'شاشة كمبيوتر 24 بوصة بدقة FHD و60Hz مناسبة للعمل والألعاب', '24-inch FHD 60Hz monitor suitable for work and gaming', 150000, '/images/products/monitor.png', 'monitors', FALSE, NULL, NULL, NULL, 8, TRUE),
  ('مصباح ذكي واي فاي', 'Smart WiFi Bulb', 'مصباح ذكي RGB بتحكم عبر التطبيق واتصال واي فاي', 'RGB smart bulb with app control and WiFi connectivity', 8000, '/images/products/smart-bulb.png', 'smart_home', FALSE, NULL, NULL, NULL, 7, TRUE),
  ('كابل HDMI 2متر', 'HDMI Cable 2m', 'كابل HDMI عالي الدقة بطول 2 متر لدعم 4K', 'High-speed HDMI cable 2m supporting 4K resolution', 4500, '/images/products/hdmi.png', 'cables', FALSE, NULL, NULL, NULL, 6, TRUE),
  ('هاتف سامسونج جالكسي S24 Ultra', 'Samsung Galaxy S24 Ultra', 'هاتف سامسونج الرائد بشاشة Dynamic AMOLED وكاميرا 200 ميجابكسل وقلم S Pen', 'Samsung flagship phone with Dynamic AMOLED display, 200MP camera, and S Pen', 650000, '/images/products/phone3.png', 'phones', FALSE, NULL, NULL, NULL, 5, TRUE),
  ('سماعة أذن سلكية عالية الجودة', 'High Quality Wired Earphones', 'سماعة أذن سلكية بصوت نقي وميكروفون مدمج', 'Wired earphones with clear sound and built-in microphone', 8000, '/images/products/wired-earphones.png', 'headphones', FALSE, NULL, NULL, NULL, 4, TRUE),
  ('شاحن لاسلكي 15 واط', 'Wireless Charger 15W', 'شاحن لاسلكي سريع بقوة 15 واط متوافق مع جميع الأجهزة', '15W fast wireless charger compatible with all devices', 12000, '/images/products/wireless-charger.png', 'chargers', FALSE, NULL, NULL, NULL, 3, TRUE),
  ('ماوس لاسلكي مريح', 'Ergonomic Wireless Mouse', 'ماوس لاسلكي بتصميم مريح للاستخدام الطويل مع دقة 2400 DPI', 'Ergonomic wireless mouse for extended use with 2400 DPI', 9000, '/images/products/mouse.png', 'mouse_keyboard', FALSE, NULL, NULL, NULL, 2, TRUE),
  ('هارد خارجي 1 تيرابايت', 'External Hard Drive 1TB', 'هارد خارجي بسعة 1 تيرابايت باتصال USB 3.0 وخفيف الوزن', '1TB external hard drive with USB 3.0, lightweight and portable', 45000, '/images/products/hard-drive.png', 'storage', FALSE, NULL, NULL, NULL, 1, TRUE);

SELECT setval('lc_products_id_seq', (SELECT COALESCE(MAX(id), 1) FROM lc_products), TRUE);

COMMIT;

-- تم استيراد 29 منتج.
