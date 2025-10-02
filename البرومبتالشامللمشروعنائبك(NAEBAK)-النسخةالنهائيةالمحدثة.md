# البرومبت الشامل لمشروع نائبك (NAEBAK) - النسخة النهائية المحدثة

---

## 🎯 نظرة عامة على المشروع

أنت مطور محترف متخصص في بناء تطبيقات ويب متقدمة. مطلوب منك بناء منصة "نائبك" من الصفر - وهي منصة رقمية متكاملة تربط بين المواطنين المصريين وممثليهم في البرلمان (مجلسي النواب والشيوخ) والمرشحين للانتخابات.

---

## 🛠️ حزمة التكنولوجيا (Technology Stack)

**يجب استخدام التقنيات التالية حصرياً:**

### Frontend:
- **Next.js 15** (React Framework) مع TypeScript
- **Bootstrap 5** للتصميم
- **Custom CSS** للألوان المخصصة:
  - اللون الأخضر: `#004705`
  - اللون البرتقالي: `#fba505ff`

### Backend & Database:
- **Supabase** (Backend-as-a-Service):
  - PostgreSQL Database
  - Supabase Auth للمصادقة
  - Supabase Storage للملفات والصور
  - Row Level Security (RLS) لحماية البيانات

### Deployment:
- **GitHub** لإدارة الكود المصدري
- **Vercel** للنشر التلقائي مع CI/CD

### Additional Tools:
- **TypeScript** للـ Type Safety
- **ESLint** للـ Code Quality
- **React Hook Form** للنماذج
- **React Query** أو **SWR** لإدارة البيانات

### الخطوط والصور:
- **خط Tajawal** (يتم تحميله محلياً من ملفات المشروع)
- **البانر الافتراضي:** `sisi-banner.jpg`
- **اللوجو الأخضر** و **اللوجو الأبيض**
- ⚠️ **إذا لم تجد هذه الملفات مرفقة، يجب السؤال عنها**

---

## 👥 نظام الأدوار والصلاحيات

المشروع يعتمد على **5 أدوار** رئيسية:

### 1. المواطن (Citizen)
**الصلاحيات:**
- استعراض بيانات النواب والمرشحين
- تقييم النواب/المرشحين بالنجوم (مرة واحدة فقط)
- إرسال رسائل مباشرة للنواب/المرشحين (500 حرف، بدون مرفقات)
- تقديم شكاوى للأدمن (1500 حرف، حتى 10 مرفقات)
- متابعة حالة الشكاوى والرسائل
- استقبال الإشعارات

### 2. المرشح (Candidate)
**الصلاحيات:**
- جميع صلاحيات المواطن
- إدارة صفحته الشخصية
- إضافة/تعديل البرنامج الانتخابي (بدون موافقة)
- إضافة إنجازات (قد تحتاج موافقة)
- إضافة مناسبات وأحداث (تحتاج موافقة الأدمن)
- استقبال الشكاوى المسندة من الأدمن والتعامل معها (قبول/رفض/تعليق)
- استقبال الرسائل والرد عليها
- تغيير البانر الخاص بصفحته
- استقبال الإشعارات

### 3. النائب الحالي (Current Member)
**الصلاحيات:**
- نفس صلاحيات المرشح تماماً
- الفرق فقط في البيانات المعروضة (لجنة برلمانية بدلاً من رمز ورقم انتخابي)

### 4. المدير (Manager)
**الصلاحيات:**
- إضافة بيانات نائب/مرشح جديد
- تعديل بيانات النواب/المرشحين
- إدارة محتوى صفحاتهم (برنامج، إنجازات، أحداث)
- عرض بيانات الاتصال الخاصة (هاتف، واتساب)
- **لا يمكنه الحذف نهائياً**

### 5. الأدمن (Admin)
**الصلاحيات:**
- جميع صلاحيات المدير + الحذف
- إدارة جميع المستخدمين
- الموافقة على المحتوى المضاف من النواب
- إسناد الشكاوى للنواب/المرشحين
- الموافقة على حل الشكاوى (وزيادة نقاط النائب)
- إدارة البانرات (الرئيسي وبانرات المحافظات)
- إدارة الشريط الإخباري
- إدارة عداد الزوار (رقم عشوائي يتغير كل 45 دقيقة)
- تعديل التقييمات (متوسط التقييم وعدد المقيمين)
- النسخ الاحتياطي والاستعادة (Backup/Restore)
- الرد على المواطنين في الشكاوى

**بيانات الدخول الافتراضية:**
- الأدمن: `admin@naebak.com` / `Admin@123456`
- المدير: `manager@naebak.com` / `Manager@123456`

---

## 🏗️ هيكل المشروع والعناصر الثابتة

### العناصر الثابتة المحمية (في جميع الصفحات):

**⚠️ مهم جداً: كل صفحة يجب أن تحتوي على هذه العناصر الأربعة بالترتيب:**

### 1. الهيدر (Header)

**التصميم:**
- خلفية بيضاء (`#FFFFFF`)
- اللوجو الأخضر على اليسار

**العناصر (من اليسار إلى اليمين):**
- شعار الموقع (اللوجو الأخضر)
- روابط التنقل: الرئيسية، النواب، المرشحون، من نحن، اتصل بنا
- عداد الزوار (صغير في الزاوية)
- جرس الإشعارات (تصميم مشابه للفيسبوك - يظهر عدد الإشعارات غير المقروءة)
- زر "تسجيل شكوى" (بارز باللون البرتقالي `#fba505ff`)
- أيقونة المستخدم (تسجيل دخول/خروج)

### 2. البانر (Banner)

**المواصفات:**
- صورة كبيرة بعرض الصفحة الكامل
- **⚠️ يُحظر وضع نصوص أو أزرار على البانر**
- **⚠️ لا يتم تقييد ارتفاع البانر** - يأخذ الارتفاع الطبيعي للصورة
- البانر الافتراضي: `sisi-banner.jpg`

**البانرات الديناميكية:**
- **صفحة الهبوط:** يتحكم فيه الأدمن من `/admin/banners`
- **صفحة المواطن:** حسب محافظة المواطن (يتحكم فيه الأدمن)
- **صفحة المرشحين:** يتغير حسب فلتر المحافظة المختار (يتحكم فيه الأدمن)
- **صفحة النائب/المرشح:** البانر الخاص (يتحكم فيه النائب/المرشح نفسه)

### 3. الشريط الإخباري (News Ticker)

**التصميم:**
- شريط متحرك أفقي (الحركة من اليسار إلى اليمين)
- خلفية رمادية غامقة
- نص أبيض
- **شريط علوي برتقالي (2 بيكسل)**
- **شريط سفلي برتقالي (4 بيكسل)**
- **شريط سفلي رمادي غامق (2 بيكسل)**

**الوظيفة:**
- يعرض آخر الأخبار من قاعدة البيانات (جدول `news`)
- **نص افتراضي يظهر أثناء التحميل:** "مرحباً بكم في منصة نائبك - جاري تحميل آخر الأخبار..."
- يتم تحديثه من لوحة الأدمن (`/admin/news`)

### 4. الفوتر (Footer)

**التصميم:**
- خلفية خضراء (`#004705`)
- اللوجو الأبيض على اليمين

**العناصر:**
- روابط: من نحن، اتصل بنا، سياسة الخصوصية، شروط الاستخدام، أسئلة شائعة
- أيقونات وسائل التواصل الاجتماعي
- حقوق النشر: "© 2025 منصة نائبك - جميع الحقوق محفوظة"

---

## 📊 قاعدة البيانات (Supabase Schema)

### الجداول الرئيسية:

#### 1. profiles (الملفات الشخصية)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  role TEXT NOT NULL CHECK (role IN ('citizen', 'candidate', 'member', 'manager', 'admin')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  birth_date DATE,
  governorate TEXT NOT NULL,
  city TEXT,
  district TEXT,
  address TEXT,
  occupation TEXT,
  profile_picture TEXT,
  banner_image TEXT,
  bio TEXT,
  points INTEGER DEFAULT 0,
  rating_average FLOAT DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**⚠️ ملاحظة مهمة:** تم إزالة حقل `national_id` (الرقم القومي) من الجدول.

#### 2. political_info (المعلومات السياسية)
```sql
CREATE TABLE political_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  council_type TEXT CHECK (council_type IN ('parliament', 'senate')),
  party_id UUID REFERENCES parties(id),
  constituency TEXT,
  electoral_number TEXT,
  electoral_symbol TEXT,
  committee TEXT,
  membership_start_date DATE,
  term_number INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. complaints (الشكاوى)
```sql
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  citizen_id UUID REFERENCES profiles(id),
  assigned_to_id UUID REFERENCES profiles(id),
  title TEXT,
  description TEXT NOT NULL CHECK (LENGTH(description) <= 1500),
  status TEXT DEFAULT 'pending_admin_review' CHECK (status IN (
    'pending_admin_review',
    'assigned',
    'accepted',
    'rejected',
    'on_hold',
    'resolved'
  )),
  rejection_reason TEXT,
  resolution_date DATE,
  on_hold_until DATE,
  on_hold_days INTEGER,
  admin_notes TEXT,
  admin_reply TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. complaint_attachments (مرفقات الشكاوى)
```sql
CREATE TABLE complaint_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. messages (الرسائل)
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL CHECK (LENGTH(content) <= 500),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. notifications (الإشعارات)
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL CHECK (type IN ('complaint', 'message', 'rating', 'approval', 'deadline')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 7. ratings (التقييمات)
```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  citizen_id UUID REFERENCES profiles(id),
  rated_profile_id UUID REFERENCES profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(citizen_id, rated_profile_id)
);
```

#### 8. programs (البرنامج الانتخابي)
```sql
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 9. achievements (الإنجازات)
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  achievement_date DATE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 10. events (المناسبات والأحداث)
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 11. banners (البانرات)
```sql
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('main', 'governorate', 'profile')),
  governorate TEXT,
  profile_id UUID REFERENCES profiles(id),
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 12. news (الأخبار)
```sql
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 13. visitor_counter_settings (إعدادات عداد الزوار)
```sql
CREATE TABLE visitor_counter_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  min_value INTEGER NOT NULL,
  max_value INTEGER NOT NULL,
  current_value INTEGER,
  last_updated TIMESTAMP DEFAULT NOW()
);
```

#### 14. governorates (المحافظات)
```sql
CREATE TABLE governorates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE
);
```

#### 15. parties (الأحزاب)
```sql
CREATE TABLE parties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE,
  logo_url TEXT
);
```

### البيانات الأولية (Initial Data):

**المحافظات الـ27:**
القاهرة، الجيزة، الإسكندرية، الدقهلية، البحيرة، الفيوم، الغربية، الإسماعيلية، المنوفية، المنيا، القليوبية، الوادي الجديد، الشرقية، السويس، أسوان، أسيوط، بني سويف، بورسعيد، دمياط، الأقصر، قنا، سوهاج، جنوب سيناء، شمال سيناء، كفر الشيخ، مطروح، البحر الأحمر.

---

## 🔐 نظام المصادقة (Authentication)

### استخدام Supabase Auth:

1. **التسجيل:**
   - استخدام `supabase.auth.signUp()`
   - إنشاء سجل في جدول `profiles` تلقائياً (باستخدام Database Trigger)

2. **تسجيل الدخول:**
   - استخدام `supabase.auth.signInWithPassword()`

3. **حماية الصفحات:**
   - استخدام Middleware في Next.js للتحقق من الدور
   - إعادة توجيه المستخدمين غير المصرح لهم

4. **Row Level Security (RLS):**
   - تفعيل RLS على جميع الجداول
   - كتابة Policies لكل دور

**مثال Policy للشكاوى:**
```sql
-- المواطن يمكنه رؤية شكاواه فقط
CREATE POLICY "Citizens can view their own complaints"
ON complaints FOR SELECT
USING (auth.uid() = citizen_id);

-- الأدمن يمكنه رؤية جميع الشكاوى
CREATE POLICY "Admins can view all complaints"
ON complaints FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 📄 قائمة الصفحات المطلوبة (38 صفحة)

### الصفحات العامة (10 صفحات):
1. `/` - صفحة الهبوط
2. `/members` - استعراض النواب (البيانات من قاعدة البيانات تلقائياً)
3. `/candidates` - استعراض المرشحين (البيانات من قاعدة البيانات تلقائياً)
4. `/login` - تسجيل الدخول
5. `/register` - إنشاء حساب
6. `/about` - من نحن
7. `/contact` - اتصل بنا
8. `/privacy` - سياسة الخصوصية
9. `/terms` - شروط الاستخدام
10. `/faq` - أسئلة شائعة

### صفحات المواطن (5 صفحات):
11. `/citizen/profile` - الصفحة الشخصية
12. `/citizen/dashboard` - لوحة التحكم
13. `/citizen/complaints` - إدارة الشكاوى
14. `/citizen/messages` - إدارة الرسائل
15. `/citizen/edit-profile` - تعديل الملف

### صفحات النائب/المرشح (9 صفحات):
16. `/اسم-النائب-بالعربي` - الصفحة الشخصية للنائب (Dynamic Route)
17. `/اسم-المرشح-بالعربي` - الصفحة الشخصية للمرشح (Dynamic Route)
18. `/member/dashboard` - لوحة التحكم
19. `/member/complaints` - إدارة الشكاوى
20. `/member/messages` - إدارة الرسائل
21. `/member/program` - إدارة البرنامج الانتخابي
22. `/member/achievements` - إدارة الإنجازات
23. `/member/events` - إدارة الأحداث
24. `/member/edit-profile` - تعديل الملف

### صفحات المدير (4 صفحات):
25. `/manager/dashboard` - لوحة التحكم
26. `/manager/members` - إدارة النواب/المرشحين
27. `/manager/add-member` - إضافة نائب/مرشح
28. `/manager/edit-member/[id]` - تعديل بيانات

### صفحات الأدمن (10 صفحات):
29. `/admin/dashboard` - لوحة التحكم
30. `/admin/users` - إدارة المستخدمين
31. `/admin/complaints` - إدارة الشكاوى
32. `/admin/ratings` - إدارة التقييمات
33. `/admin/banners` - إدارة البانرات
34. `/admin/news` - إدارة الأخبار
35. `/admin/visitor-counter` - إدارة عداد الزوار
36. `/admin/approvals` - الموافقة على المحتوى
37. `/admin/backup` - النسخ الاحتياطي
38. `/admin/statistics` - الإحصائيات

---

## 🎨 متطلبات التصميم

### الألوان الموحدة:
- **اللون الأساسي (الأخضر):** `#004705`
- **اللون الثانوي (البرتقالي):** `#fba505ff`
- **الخلفية:** `#FFFFFF` (أبيض)
- **النصوص:** `#333333` (رمادي داكن)

### الخطوط:
- **الخط الأساسي:** Tajawal (يتم تحميله محلياً من ملفات المشروع)
- **حجم الخط الأساسي:** 16px

### التصميم المتجاوب:
- يجب أن يعمل الموقع بشكل مثالي على:
  - الهواتف المحمولة (320px - 767px)
  - الأجهزة اللوحية (768px - 1023px)
  - أجهزة الكمبيوتر (1024px فما فوق)

### الصفحات الشخصية:
- تصميم مشابه لـ Facebook:
  - بانر كبير في الأعلى (بدون نصوص أو أزرار)
  - صورة شخصية دائرية تتوسط البانر
  - معلومات أساسية تحت الصورة
  - نظام تبويبات (Tabs) للمحتوى

---

## 🔄 الوظائف الأساسية المطلوبة

### 1. نظام التقييم بالنجوم:
- المواطن يمكنه تقييم أي نائب/مرشح **مرة واحدة فقط**
- التقييم متاح في:
  - كارت النائب/المرشح (في صفحة الاستعراض)
  - داخل الصفحة الشخصية
- عند النقر على النجوم:
  - إرسال التقييم إلى قاعدة البيانات (جدول `ratings`)
  - تحديث متوسط التقييم تلقائياً في جدول `profiles`
  - منع التقييم المتكرر (UNIQUE constraint)
  - إرسال إشعار للنائب/المرشح
- الأدمن يمكنه تعديل يدوياً:
  - متوسط التقييم (`rating_average`)
  - عدد المقيمين (`rating_count`)

### 2. نظام الرسائل:
- زر "إرسال رسالة" (برتقالي) في:
  - كارت النائب/المرشح
  - الصفحة الشخصية
- عند النقر:
  - فتح نموذج منبثق (Modal)
  - حقل نصي (500 حرف كحد أقصى)
  - زر "إرسال" (أخضر)
- النائب/المرشح يستقبل الرسالة في `/member/messages`
- يمكنه الرد (500 حرف)
- **لا توجد مرفقات في الرسائل**
- إرسال إشعار عند استلام رسالة جديدة

### 3. نظام الشكاوى (مفصل):

#### أ) تقديم الشكوى (المواطن):
- زر "تسجيل شكوى" (برتقالي) في الهيدر
- نموذج منبثق يحتوي على:
  - حقل العنوان (اختياري)
  - حقل الوصف (1500 حرف كحد أقصى)
  - رفع مرفقات (حتى 10 ملفات - صور، PDF، إلخ)
  - زر "إرسال" (أخضر)
- الشكوى تُرسل للأدمن مباشرة
- الحالة الأولية: `pending_admin_review`

#### ب) إدارة الشكوى (الأدمن):
- عرض جميع الشكاوى في `/admin/complaints`
- لكل شكوى:
  - عرض التفاصيل الكاملة
  - عرض وتحميل المرفقات
  - **زر "إسناد الشكوى" (برتقالي):**
    - يفتح قائمة منسدلة بجميع النواب/المرشحين
    - اختيار النائب المناسب
    - الشكوى تنتقل للنائب
    - تغيير الحالة إلى `assigned`
    - **إرسال إشعار للنائب**
  - **حقل "الرد على المواطن":**
    - يمكن للأدمن كتابة رد مباشر للمواطن
    - يُحفظ في `admin_reply`
    - **إرسال إشعار للمواطن**
  - **زر "الموافقة على الحل":**
    - عندما يحل النائب الشكوى
    - **زيادة نقاط النائب بنقطة واحدة**
    - تغيير الحالة إلى `resolved`
    - **إرسال إشعار للمواطن**
  - **زر "حفظ في الأرشيف"**
  - **زر "حذف نهائياً" (أحمر)**

#### ج) التعامل مع الشكوى (النائب/المرشح):
- عرض الشكاوى المسندة في `/member/complaints`
- لكل شكوى، ثلاثة خيارات:
  
  **1. قبول الشكوى:**
  - نافذة منبثقة لتحديد عدد أيام الحل
  - حفظ الموعد المتوقع (`resolution_date`)
  - تغيير الحالة إلى `accepted`
  - **إرسال إشعار للمواطن والأدمن**
  - **إنشاء إشعار تلقائي عند اقتراب الموعد (قبل يومين)**
  
  **2. رفض الشكوى:**
  - نافذة منبثقة لكتابة سبب الرفض
  - حفظ السبب في `rejection_reason`
  - تغيير الحالة إلى `rejected`
  - **إرسال إشعار للمواطن والأدمن**
  
  **3. تعليق للدراسة:**
  - نافذة منبثقة لتحديد عدد أيام التعليق
  - حفظ تاريخ انتهاء التعليق (`on_hold_until`)
  - تغيير الحالة إلى `on_hold`
  - **إرسال إشعار للمواطن والأدمن**
  - **إنشاء إشعار تلقائي عند انتهاء مدة التعليق**

#### د) حل الشكوى:
- عند إتمام الحل، النائب يغير الحالة إلى `resolved`
- **إرسال إشعار للأدمن للمراجعة**
- الأدمن يراجع الحل في `/admin/complaints`
- عند موافقة الأدمن:
  - **زيادة نقاط النائب بنقطة واحدة** (`points = points + 1`)
  - **إرسال إشعار للمواطن بأن الشكوى تم حلها**

#### هـ) متابعة الشكوى (المواطن):
- في `/citizen/complaints`، يرى جميع شكاواه
- لكل شكوى:
  - الحالة الحالية
  - إذا تم الإسناد: اسم النائب + رابط لصفحته
  - إذا تم الرفض: سبب الرفض
  - إذا معلقة: عدد الأيام المتبقية
  - إذا مقبولة: الموعد المتوقع للحل
  - رد الأدمن (إن وجد)
  - **الإشعارات عند أي تحديث**

### 4. نظام البانرات:

#### أ) البانر الرئيسي (صفحة الهبوط):
- الافتراضي: `sisi-banner.jpg`
- الأدمن يمكنه تغييره من `/admin/banners`
- يُحفظ في جدول `banners` مع `type = 'main'`

#### ب) بانرات المحافظات:
- الأدمن يحدد بانر لكل محافظة من الـ27
- يُحفظ في جدول `banners` مع `type = 'governorate'`
- المواطنون في نفس المحافظة يرون نفس البانر

#### ج) بانرات النواب/المرشحين:
- كل نائب/مرشح يمكنه رفع بانر خاص من `/member/edit-profile`
- يُحفظ في `profiles.banner_image`
- يظهر في صفحته الشخصية

#### د) بانر صفحة المرشحين:
- يتغير ديناميكياً حسب فلتر المحافظة المختار
- إذا لم يحدد الأدمن بانر للمحافظة، يظهر البانر الرئيسي

### 5. عداد الزوار المتقدم:
- الأدمن يحدد نطاق رقمي (`min_value`, `max_value`) في `/admin/visitor-counter`
- كل 45 دقيقة، النظام يختار رقم عشوائي ضمن النطاق
- يُحفظ في `visitor_counter_settings.current_value`
- العداد يبدأ العد التصاعدي من هذا الرقم
- يظهر في الهيدر (زاوية صغيرة)

### 6. نظام الإشعارات:
- جرس الإشعارات في الهيدر (مثل Facebook)
- عدد الإشعارات غير المقروءة يظهر كـ Badge
- عند النقر، تظهر قائمة منسدلة بآخر الإشعارات
- أنواع الإشعارات:
  - شكوى جديدة (للأدمن)
  - تم إسناد شكوى (للنائب)
  - تم قبول/رفض/تعليق شكوى (للمواطن)
  - رسالة جديدة
  - تقييم جديد (للنائب)
  - اقتراب موعد حل شكوى
  - انتهاء مدة تعليق شكوى
  - موافقة/رفض محتوى (للنائب)

### 7. نظام الموافقات:
- الأحداث (`events`) التي يضيفها النائب/المرشح لا تظهر إلا بعد موافقة الأدمن
- الأدمن يرى قائمة بالأحداث المعلقة في `/admin/approvals`
- يمكنه الموافقة (`is_approved = true`) أو الرفض (حذف)
- **إرسال إشعار للنائب عند الموافقة أو الرفض**

### 8. النسخ الاحتياطي والاستعادة:
- الأدمن يمكنه تصدير البيانات من `/admin/backup`:
  - بيانات المواطنين
  - بيانات النواب
  - بيانات المرشحين
  - جميع البيانات
- التصدير بصيغة JSON أو CSV
- يمكنه استيراد البيانات من ملف
- ⚠️ تحذير: "ستستبدل البيانات الحالية"

---

## 📋 نماذج التسجيل (بدون الرقم القومي)

### نموذج تسجيل المواطن:
```typescript
interface CitizenRegistration {
  first_name: string;          // مطلوب
  last_name: string;           // مطلوب
  email: string;               // مطلوب - فريد
  phone: string;               // مطلوب
  whatsapp?: string;           // اختياري
  gender: 'male' | 'female';   // مطلوب
  birth_date: Date;            // مطلوب
  governorate: string;         // مطلوب - قائمة منسدلة
  city: string;                // مطلوب
  district?: string;           // اختياري
  address: string;             // مطلوب
  occupation?: string;         // اختياري
  password: string;            // مطلوب
  confirm_password: string;    // مطلوب
  agree_terms: boolean;        // مطلوب
}
```

### نموذج تسجيل المرشح/النائب:
```typescript
interface CandidateRegistration extends CitizenRegistration {
  council_type: 'parliament' | 'senate';  // مطلوب
  party_id: string;                       // مطلوب - قائمة منسدلة
  constituency: string;                   // مطلوب
  electoral_number?: string;              // للمرشح فقط
  electoral_symbol?: string;              // للمرشح فقط
  committee?: string;                     // للنائب الحالي فقط
  membership_start_date?: Date;           // للنائب الحالي فقط
  term_number?: number;                   // للنائب الحالي فقط
  bio: string;                            // مطلوب
  profile_picture?: File;                 // اختياري
  banner_image?: File;                    // اختياري
}
```

---

## 📋 متطلبات إضافية

### الفلاتر في صفحة النواب/المرشحين:
- فلتر المحافظة (قائمة منسدلة - 27 محافظة)
- فلتر الحزب (قائمة منسدلة - من جدول `parties`)
- فلتر المجلس (نواب/شيوخ)
- فلتر الجنس (ذكر/أنثى)
- **فلتر بالاسم** (حقل بحث نصي - يبحث في `first_name` و `last_name`)

### القوائم المنسدلة:
- استخدام قوائم منسدلة في:
  - نماذج التسجيل
  - الفلاتر
  - نماذج التعديل
- المحافظات: يتم جلبها من جدول `governorates`
- الأحزاب: يتم جلبها من جدول `parties`

### بيانات الاتصال الخاصة:
- رقم الهاتف (`phone`) والواتساب (`whatsapp`) **لا يظهران إلا للأدمن والمدير**
- في صفحة النائب/المرشح، هذه البيانات مخفية عن المواطنين
- تظهر فقط في:
  - `/admin/users`
  - `/manager/members`

### نظام Pagination:
- في صفحة النواب/المرشحين: **12 كارت في الصفحة**
- في قسم الإنجازات: **5 إنجازات في الصفحة**
- في قسم الأحداث: **5 أحداث في الصفحة**

---

## 🚀 خطوات التنفيذ المقترحة

### المرحلة 1: الإعداد الأولي (Setup)
1. إنشاء مشروع Next.js 15 جديد مع TypeScript
2. إعداد Supabase:
   - إنشاء المشروع
   - إنشاء الجداول (15 جدول)
   - إضافة البيانات الأولية (المحافظات)
   - تفعيل RLS وكتابة Policies
3. إعداد GitHub Repository
4. ربط Vercel للنشر التلقائي
5. إعداد Bootstrap 5 وملفات CSS المخصصة
6. إضافة خط Tajawal محلياً

### المرحلة 2: المصادقة والأدوار
1. إعداد Supabase Auth
2. إنشاء صفحات `/login` و `/register`
3. إنشاء Middleware لحماية الصفحات
4. إنشاء Database Trigger لإنشاء `profiles` تلقائياً

### المرحلة 3: العناصر الثابتة
1. بناء الهيدر (Header) - أبيض مع لوجو أخضر
2. بناء البانر (Banner) الديناميكي
3. بناء الشريط الإخباري (News Ticker)
4. بناء الفوتر (Footer) - أخضر مع لوجو أبيض
5. إنشاء Layout Component يجمعهم

### المرحلة 4: الصفحات العامة
1. صفحة الهبوط `/`
2. صفحة استعراض النواب `/members` (مع الفلاتر)
3. صفحة استعراض المرشحين `/candidates` (مع الفلاتر)
4. الصفحات القانونية (من نحن، اتصل بنا، إلخ)

### المرحلة 5: صفحات المواطن
1. الصفحة الشخصية `/citizen/profile`
2. لوحة التحكم `/citizen/dashboard`
3. صفحة الشكاوى `/citizen/complaints`
4. صفحة الرسائل `/citizen/messages`
5. صفحة التعديل `/citizen/edit-profile`

### المرحلة 6: صفحات النائب/المرشح
1. الصفحة الشخصية `/اسم-النائب-بالعربي` (Dynamic Route)
2. لوحة التحكم `/member/dashboard`
3. صفحة إدارة الشكاوى `/member/complaints`
4. صفحة إدارة الرسائل `/member/messages`
5. صفحات إدارة المحتوى (برنامج، إنجازات، أحداث)

### المرحلة 7: صفحات المدير
1. لوحة التحكم `/manager/dashboard`
2. صفحة إدارة النواب/المرشحين `/manager/members`
3. صفحات الإضافة والتعديل

### المرحلة 8: صفحات الأدمن
1. لوحة التحكم `/admin/dashboard`
2. صفحة إدارة المستخدمين `/admin/users`
3. صفحة إدارة الشكاوى `/admin/complaints`
4. صفحة إدارة التقييمات `/admin/ratings`
5. صفحة إدارة البانرات `/admin/banners`
6. صفحة إدارة الأخبار `/admin/news`
7. صفحة عداد الزوار `/admin/visitor-counter`
8. صفحة الموافقات `/admin/approvals`
9. صفحة النسخ الاحتياطي `/admin/backup`
10. صفحة الإحصائيات `/admin/statistics`

### المرحلة 9: الأنظمة التفاعلية
1. نظام التقييم بالنجوم
2. نظام الرسائل
3. نظام الشكاوى (كامل مع الإشعارات)
4. نظام البانرات الديناميكي
5. عداد الزوار المتقدم
6. نظام الإشعارات (جرس + قائمة منسدلة)

### المرحلة 10: الاختبار والتحسين
1. اختبار جميع الوظائف
2. اختبار على أجهزة مختلفة (Responsive)
3. تحسين الأداء (Image Optimization, Code Splitting)
4. تحسين SEO
5. إضافة Loading States
6. معالجة الأخطاء (Error Handling)

---

## ✅ معايير الجودة

### الكود:
- استخدام TypeScript بشكل صحيح مع Types واضحة
- تقسيم الكود إلى Components قابلة لإعادة الاستخدام
- استخدام React Hooks بشكل فعال
- كتابة كود نظيف ومنظم (Clean Code)

### الأمان:
- تفعيل RLS على جميع الجداول
- التحقق من الصلاحيات في كل عملية
- تعقيم المدخلات (Input Validation)
- حماية من SQL Injection و XSS

### الأداء:
- استخدام Image Optimization من Next.js
- Lazy Loading للصور
- Code Splitting
- Caching فعال

### تجربة المستخدم:
- تصميم بديهي وسهل الاستخدام
- رسائل خطأ واضحة
- Loading Indicators
- Responsive Design
- إشعارات فورية

---

## 📝 ملاحظات نهائية

1. **الأولوية:** ابدأ بالوظائف الأساسية ثم انتقل للميزات المتقدمة
2. **الاختبار:** اختبر كل ميزة قبل الانتقال للتالية
3. **التوثيق:** وثق الكود بشكل جيد
4. **Git Commits:** اعمل commits منتظمة ومنظمة
5. **البيانات التجريبية:** أضف بيانات تجريبية للاختبار
6. **الصور المطلوبة:** تأكد من وجود `sisi-banner.jpg`، اللوجو الأخضر، اللوجو الأبيض
7. **الخط:** تأكد من تحميل خط Tajawal محلياً

---

## 🎯 الهدف النهائي

بناء منصة احترافية، آمنة، سريعة، وسهلة الاستخدام تربط بين المواطنين ونوابهم بشكل فعال، مع تجربة مستخدم ممتازة على جميع الأجهزة، ونظام إشعارات فوري، وإدارة شاملة للشكاوى والرسائل.

---

**نهاية البرومبت**

**ملاحظة:** هذا البرومبت شامل ومفصل ومحدث. يمكنك استخدامه مباشرة لبناء المشروع من الصفر.
