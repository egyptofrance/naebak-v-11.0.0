# توثيق عملية نشر موقع نائبك.كوم

تاريخ التوثيق: 1 أكتوبر 2025

## 📋 ملخص

هذا المستند يوثق عملية نشر موقع نائبك.كوم على منصة Vercel، بما في ذلك الإعدادات الناجحة، والمشاكل التي واجهتنا، وكيفية حلها. يهدف هذا التوثيق إلى تسهيل عمليات النشر المستقبلية وتجنب المشاكل المتكررة.

## 🚀 النسخة المنشورة حالياً

- **المستودع:** `egyptofrance/naebak-frontend-deploy`
- **الفرع:** `main`
- **آخر commit ناجح:** `20b7f20` - "Remove vercel.json - let Vercel auto-detect Next.js configuration"
- **تاريخ النشر:** 1 أكتوبر 2025
- **الدومين الرئيسي:** `https://naebak.com`
- **الدومين البديل:** `https://www.naebak.com`
- **رابط Vercel:** `https://naebak-frontend-deploy-git-main-naebaks-projects.vercel.app`

> **ملاحظة هامة:** تم حفظ نسخة احتياطية من هذا الإصدار في مستودع المخزن تحت مجلد `07-infrastructure/backups/naebak-frontend-deploy-20b7f20.zip`

## ⚙️ الإعدادات الناجحة للنشر

### 1. إعدادات Vercel

#### المتغيرات البيئية:
```
NEXTAUTH_URL=https://naebak.com
NEXTAUTH_SECRET=[قيمة سرية]
NEXT_PUBLIC_SUPABASE_URL=https://njgfhfhvrvkklvmnogs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[قيمة سرية]
```

#### إعدادات البناء:
- **Framework Preset:** Next.js (اكتشاف تلقائي)
- **Build Command:** `next build` (افتراضي)
- **Output Directory:** `.next` (افتراضي)
- **Install Command:** `npm install` (افتراضي)
- **Node.js Version:** 18.x (افتراضي)

#### إعدادات الدومين:
- **الدومين الرئيسي:** `naebak.com`
- **إعدادات DNS في GoDaddy:**
  - A Record: `@` → `76.76.19.61`
  - CNAME Record: `www` → `cname.vercel-dns.com`

### 2. ملفات التكوين

#### ملف `vercel.json`:
**الحالة الناجحة:** تم حذف ملف `vercel.json` تماماً والاعتماد على الاكتشاف التلقائي لـ Next.js من قبل Vercel.

> **سبب النجاح:** تجنب التضاربات بين إعدادات `builds` و `functions` وإعدادات البيئة.

#### ملف `.env.production`:
```
NEXTAUTH_URL=https://naebak.com
NEXTAUTH_SECRET=[قيمة سرية]
NEXT_PUBLIC_SUPABASE_URL=https://njgfhfhvrvkklvmnogs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[قيمة سرية]
```

## 🔍 المشاكل التي واجهتنا وحلولها

### المشكلة الأولى: تكرار Header و Footer

#### الوصف:
كان هناك تكرار للـ Header و Footer في بعض الصفحات مثل صفحة "اتصل بنا" و "من نحن" وغيرها، حيث كان يتم استيراد هذه المكونات مرتين:
1. مرة من خلال `src/app/layout.tsx` (الذي يطبق على جميع الصفحات)
2. ومرة أخرى داخل كود الصفحات نفسها

#### الحل:
1. تم تحديد الصفحات التي تحتوي على استيراد مكرر للـ Header و Footer
2. تم إزالة استيراد واستخدام Header و Footer من هذه الصفحات
3. تم الاعتماد فقط على `src/app/layout.tsx` لعرض Header و Footer في جميع الصفحات

#### الملفات المتأثرة:
- `src/app/candidate/page.tsx`
- `src/app/member/page.tsx`

### المشكلة الثانية: خطأ في استيراد Supabase

#### الوصف:
بعد تحديث صفحة الهبوط، ظهر خطأ في النشر:
```
Module not found: Can't resolve '@/lib/supabase'
```

#### الحل:
تم تصحيح مسار استيراد Supabase من `@/lib/supabase` إلى `@/_lib/supabase-client`

#### الملفات المتأثرة:
- `src/app/page.tsx`

### المشكلة الثالثة: خطأ TypeScript في صفحة الهبوط

#### الوصف:
بعد إصلاح مسار استيراد Supabase، ظهر خطأ TypeScript:
```
Type error: Argument of type '{ news_ticker_text: any; }' is not assignable to parameter of type 'SetStateAction<null>'.
```

#### الحل:
1. تم إضافة واجهة TypeScript لتعريف نوع البيانات:
```typescript
interface SiteConfig {
  news_ticker_text?: string;
}
```

2. تم تحديث تعريف useState:
```typescript
const [config, setConfig] = useState<SiteConfig | null>(null);
```

3. تم تحويل البيانات إلى النوع الصحيح:
```typescript
setConfig(data as SiteConfig);
```

#### الملفات المتأثرة:
- `src/app/page.tsx`

## 📝 الدروس المستفادة

1. **تجنب ملفات التكوين المعقدة:** الاعتماد على الإعدادات الافتراضية لـ Vercel قدر الإمكان
2. **استخدام TypeScript بشكل صحيح:** تعريف الأنواع بوضوح لتجنب أخطاء النشر
3. **تنظيم هيكل المشروع:** تجنب تكرار المكونات والكود
4. **اختبار محلي قبل النشر:** بناء المشروع محلياً للتأكد من عدم وجود أخطاء
5. **توثيق الإعدادات الناجحة:** للرجوع إليها في المستقبل

## 🔄 خطوات النشر المستقبلية

1. التأكد من عدم وجود ملف `vercel.json` أو أنه يحتوي على إعدادات بسيطة فقط
2. التأكد من تحديث المتغيرات البيئية في Vercel UI
3. التأكد من صحة مسارات الاستيراد وتوافق الأنواع في TypeScript
4. بناء المشروع محلياً قبل دفع التغييرات
5. استخدام Deploy Hook في حالة عدم تحفيز النشر التلقائي

## 🔗 روابط مفيدة

- [لوحة تحكم Vercel](https://vercel.com/naebaks-projects/naebak-frontend-deploy)
- [مستودع GitHub](https://github.com/egyptofrance/naebak-frontend-deploy)
- [توثيق Next.js](https://nextjs.org/docs)
- [توثيق Vercel](https://vercel.com/docs)
