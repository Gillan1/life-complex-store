# مجمع الحياة - Life Complex Store

متجر إلكتروني شامل للإلكترونيات والأجهزة الذكية في السودان.

## ✨ المميزات

- 🛒 **متجر إلكتروني**: 20 فئة منتج، أكثر من 29 منتج جاهز
- 📊 **إدارة المبيعات**: تسجيل المبيعات مع عناصر متعددة وخدمة تصوير وإيصالات بنكية
- 📈 **إحصائيات حية**: أعلى المنتجات مبيعاً، مبيعات آخر 7 أيام، إحصاءات خدمة التصوير
- 🌐 **ثنائي اللغة**: عربي / إنجليزي مع RTL/LTR كامل
- 🎨 **سمات متعددة**: داكن، فاتح
- 🔐 **مصادقة آمنة**: عبر Supabase Auth
- ☁️ **تخزين سحابي**: Supabase PostgreSQL + Storage
- 📱 **متجاوب**: يعمل على الجوال والتابلت والكمبيوتر

## 🏗️ التقنيات

| التقنية | الاستخدام |
|---|---|
| Next.js 16 + React 19 | الإطار |
| TypeScript | الأمان النوعي |
| Tailwind CSS 4 | التنسيق |
| shadcn/ui | مكونات UI |
| Zustand | إدارة الحالة (cache + Supabase) |
| [Supabase](https://supabase.com) | قاعدة بيانات + مصادقة + تخزين صور |
| Framer Motion | الأنيميشن |

## 🚀 الإعداد

### 1) الإعدادات الحالية

تم تجهيز المشروع ليستخدم مشروع Supabase النشط:
- **URL**: `https://khgvmatuqqgpctimzcoi.supabase.co`
- الإعدادات في `src/lib/supabase-config.ts`

### 2) قاعدة البيانات

شغّل ملفات SQL في **Supabase Dashboard → SQL Editor**:
1. `supabase/schema.sql` - إنشاء الجداول والسياسات (أول مرة فقط)
2. `supabase/seed.sql` - استيراد 29 منتج أولي

### 3) حساب المسؤول

استخدم حساب Supabase Auth الإداري المُعَدّ في Dashboard:
- من Supabase Dashboard → Authentication → Users
- غيّر كلمة المرور بعد أول تسجيل دخول

### 4) التطوير محلياً

```bash
# تثبيت الاعتماديات
bun install   # أو npm install

# تشغيل بيئة التطوير
bun run dev

# بناء للإنتاج (static export إلى ./out)
bun run build

# خدمة ملفات static بعد البناء
bunx serve out
```

### 5) النشر على GitHub Pages

```bash
git init
git add .
git commit -m "v2.0 - Supabase migration"
git remote add origin https://github.com/Gillan1/life-complex-store.git
git push -u origin main
```

ثم في GitHub: **Settings → Pages → Source: GitHub Actions**

## 🔐 الأمان

| الميزة | الحالة |
|---|---|
| مصادقة عبر Supabase Auth (لا كلمات مرور في الكود) | ✅ |
| Row Level Security على كل الجداول | ✅ |
| Token في localStorage مع RLS policies (حماية إضافية) | ✅ |
| صور المنتجات في Storage (لا base64 في state) | ✅ |
| إيصالات البنك في bucket خاص (signed URLs) | ✅ |
| لا مفتاح Service Role في الكود | ✅ |
| مسؤول واحد (يُمكن إضافة جدول user_roles لاحقاً) | ✅ |

## 📁 بنية المشروع

```
life-complex-store/
├── src/
│   ├── app/                    # صفحات Next.js
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── store/              # مكونات المتجر (15 ملف)
│   │   ├── ui/                 # مكونات shadcn/ui
│   │   └── providers.tsx
│   ├── hooks/
│   │   ├── use-language.tsx
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── supabase.ts         # ✅ Supabase client + queries
│   │   ├── supabase-config.ts  # ⚙️ عدّل هذا للتبديل بين المشاريع
│   │   ├── i18n.ts
│   │   └── utils.ts
│   └── store/
│       ├── auth-store.ts       # ✅ Supabase Auth عبر Zustand
│       ├── product-store.ts    # ✅ Supabase queries + cache
│       └── sales-store.ts      # ✅ Supabase queries + cache
├── supabase/
│   ├── schema.sql              # SQL: جداول + RLS + buckets
│   └── seed.sql                # SQL: 29 منتج أولي
├── scripts/
│   └── generate-seed.js        # أداة: تحويل المنتجات إلى SQL
├── public/                     # ملفات static (شعار، صور افتراضية)
├── Caddyfile                   # ✅ إعداد آمن بدون SSRF
├── package.json
├── next.config.ts              # ✅ static export + basePath
├── tailwind.config.ts          # ✅ content paths تشمل src/
├── tsconfig.json
├── eslint.config.mjs           # ✅ قواعد محسّنة
└── README.md
```

## 🔄 التغيير عن الإصدار السابق

| قبل | بعد |
|---|---|
| `const ydrated, setHydrated]` (syntax error) | `const [hydrated, setHydrated]` ✅ |
| `package.json` يشير لـ `.next/standalone` (غير موجود) | `next build` فقط ✅ |
| `tailwind.config.ts` content paths خاطئة | تشمل `src/**` ✅ |
| `next.config.ts` `ignoreBuildErrors: true` | تمت الإزالة ✅ |
| `reactStrictMode: false` | `reactStrictMode: true` ✅ |
| `tsconfig.json` `noImplicitAny: false` | `noImplicitAny: true` ✅ |
| `eslint.config.mjs` 22 قاعدة معطّلة | معظمها "warn" بدلاً من "off" ✅ |
| `auth-store` يقبل أي username كـ admin | Supabase Auth حقيقي ✅ |
| `product-store` + `sales-store` في localStorage | Supabase + Zustand cache ✅ |
| `record-sale-dialog` base64 في localStorage | Supabase Storage ✅ |
| `add-product-form` base64 في state | `URL.createObjectURL` + Storage ✅ |
| `settings-view` `window.__importData` | useRef + useMemo ✅ |
| `sales-view` حسابات بدون useMemo | useMemo للكل ✅ |
| `sales-view` `ar-SA` (تقويم هجري) | `ar-SD` ✅ |
| `product-grid` فئات معطّلة قابلة للنقر | `disabled` + guard ✅ |
| `lowStockCategories` `count === 1` متناقض | `count <= 1` ✅ |
| `record-sale-dialog` يمكن تسجيل بيعة بقيمة 0 | تحقق `totalAmount > 0` ✅ |
| `record-sale-dialog` `copyPricePerPage = 0` افتراضي | 5/2 تلقائياً حسب النوع ✅ |
| Caddyfile ثغرة SSRF + HTTP | HTTPS + security headers ✅ |
| `prisma/` + `lib/db.ts` dead code | محذوف ✅ |
| `skills/` (~30 skill غير مرتبط) | محذوف ✅ |
| `examples/` غير مستخدم | محذوف ✅ |
| `mini-services/` فارغ | محذوف ✅ |
| README يصف ميزات غير موجودة | محدّث ✅ |

## 📞 الدعم

- **المالك**: غيلان بن عقبة
- **الموقع**: https://gillan1.github.io/life-complex-store/

## 📄 الترخيص

© 2024 مجمع الحياة. جميع الحقوق محفوظة.
