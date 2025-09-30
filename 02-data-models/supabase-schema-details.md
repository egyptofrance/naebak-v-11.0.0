# تفاصيل مخطط قاعدة بيانات Supabase لمشروع Naebak

---

## 📋 نظرة عامة

تم تصميم مخطط قاعدة البيانات هذا لدعم مشروع Naebak بعد الانتقال إلى Next.js و Supabase. يوضح هذا المستند تفاصيل الجداول، الأعمدة، العلاقات، سياسات الأمان على مستوى الصفوف (RLS)، والدوال المخصصة التي تم إنشاؤها.

---

## 📊 جداول قاعدة البيانات

### 1. `profiles` (تحديث الجدول الموجود)
*   **الوصف:** يمثل الملف الشخصي الأساسي للمستخدمين، ويتم تحديثه لإضافة حقول جديدة.
*   **الأعمدة المضافة:**
    *   `occupation` (TEXT): وظيفة المستخدم.
    *   `governorate` (TEXT): المحافظة التي ينتمي إليها المستخدم.
    *   `profile_image` (TEXT): رابط صورة الملف الشخصي.
    *   `banner_image` (TEXT): رابط صورة البانر.
    *   `is_admin` (BOOLEAN, DEFAULT FALSE): لتحديد ما إذا كان المستخدم مسؤولاً.
    *   `points` (INTEGER, DEFAULT 0): نقاط المستخدم (تزداد عند حل الشكاوى).

### 2. `citizens`
*   **الوصف:** يخزن البيانات الإضافية الخاصة بالمواطنين.
*   **الأعمدة:**
    *   `profile_id` (UUID, PRIMARY KEY, REFERENCES `profiles(id)` ON DELETE CASCADE): معرف الملف الشخصي للمواطن.
    *   `age` (INTEGER): عمر المواطن.
    *   `address_village` (TEXT): القرية.
    *   `address_district` (TEXT): الحي.
    *   `address_center` (TEXT): المركز.
    *   `address_city` (TEXT): المدينة.
    *   `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): تاريخ الإنشاء.

### 3. `candidates`
*   **الوصف:** يخزن البيانات الإضافية الخاصة بالمرشحين.
*   **الأعمدة:**
    *   `profile_id` (UUID, PRIMARY KEY, REFERENCES `profiles(id)` ON DELETE CASCADE): معرف الملف الشخصي للمرشح.
    *   `legislative_body` (TEXT, NOT NULL): نوع المجلس التشريعي (مجلس نواب / مجلس شيوخ).
    *   `party` (TEXT): الحزب الذي ينتمي إليه.
    *   `is_independent` (BOOLEAN, DEFAULT FALSE): هل المرشح مستقل.
    *   `electoral_symbol` (TEXT): الرمز الانتخابي.
    *   `electoral_number` (TEXT): الرقم الانتخابي.
    *   `electoral_district` (TEXT): الدائرة الانتخابية.
    *   `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): تاريخ الإنشاء.

### 4. `current_members`
*   **الوصف:** يخزن البيانات الإضافية الخاصة بالنواب الحاليين.
*   **الأعمدة:**
    *   `profile_id` (UUID, PRIMARY KEY, REFERENCES `profiles(id)` ON DELETE CASCADE): معرف الملف الشخصي للنائب.
    *   `legislative_body` (TEXT, NOT NULL): نوع المجلس التشريعي (مجلس نواب / مجلس شيوخ).
    *   `party` (TEXT): الحزب الذي ينتمي إليه.
    *   `is_independent` (BOOLEAN, DEFAULT FALSE): هل النائب مستقل.
    *   `parliamentary_committees` (TEXT[]): مصفوفة من اللجان البرلمانية.
    *   `electoral_district` (TEXT): الدائرة الانتخابية.
    *   `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): تاريخ الإنشاء.

### 5. `achievements`
*   **الوصف:** يخزن إنجازات المرشحين والنواب.
*   **الأعمدة:**
    *   `id` (UUID, PRIMARY KEY, DEFAULT `gen_random_uuid()`): معرف الإنجاز.
    *   `profile_id` (UUID, NOT NULL, REFERENCES `profiles(id)` ON DELETE CASCADE): معرف الملف الشخصي للمالك.
    *   `title` (TEXT, NOT NULL): عنوان الإنجاز.
    *   `description` (TEXT): وصف الإنجاز.
    *   `achievement_date` (DATE): تاريخ الإنجاز.
    *   `image_url` (TEXT): رابط صورة الإنجاز.
    *   `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): تاريخ الإنشاء.

### 6. `events`
*   **الوصف:** يخزن المؤتمرات والمناسبات للمرشحين والنواب.
*   **الأعمدة:**
    *   `id` (UUID, PRIMARY KEY, DEFAULT `gen_random_uuid()`): معرف الحدث.
    *   `profile_id` (UUID, NOT NULL, REFERENCES `profiles(id)` ON DELETE CASCADE): معرف الملف الشخصي للمالك.
    *   `title` (TEXT, NOT NULL): عنوان الحدث.
    *   `description` (TEXT): وصف الحدث.
    *   `event_date` (TIMESTAMP WITH TIME ZONE): تاريخ ووقت الحدث.
    *   `location` (TEXT): مكان الحدث.
    *   `event_type` (TEXT, NOT NULL): نوع الحدث (conference / event).
    *   `image_url` (TEXT): رابط صورة الحدث.
    *   `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): تاريخ الإنشاء.

### 7. `ratings`
*   **الوصف:** يخزن تقييمات المستخدمين للملفات الشخصية.
*   **الأعمدة:**
    *   `id` (UUID, PRIMARY KEY, DEFAULT `gen_random_uuid()`): معرف التقييم.
    *   `profile_id` (UUID, NOT NULL, REFERENCES `profiles(id)` ON DELETE CASCADE): معرف الملف الشخصي الذي تم تقييمه.
    *   `rater_id` (UUID, NOT NULL, REFERENCES `auth.users(id)` ON DELETE CASCADE): معرف المستخدم الذي قام بالتقييم.
    *   `rating` (INTEGER, NOT NULL): التقييم (من 1 إلى 5).
    *   `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): تاريخ الإنشاء.
    *   `UNIQUE (profile_id, rater_id)`: يضمن تقييم واحد لكل مستخدم لكل ملف شخصي.

### 8. `messages`
*   **الوصف:** يخزن الرسائل المباشرة بين المستخدمين والمرشحين/النواب.
*   **الأعمدة:**
    *   `id` (UUID, PRIMARY KEY, DEFAULT `gen_random_uuid()`): معرف الرسالة.
    *   `sender_id` (UUID, NOT NULL, REFERENCES `auth.users(id)` ON DELETE CASCADE): معرف المرسل.
    *   `recipient_id` (UUID, NOT NULL, REFERENCES `profiles(id)` ON DELETE CASCADE): معرف المستلم.
    *   `subject` (TEXT, NOT NULL): موضوع الرسالة.
    *   `message` (TEXT, NOT NULL): نص الرسالة (بحد أقصى 500 حرف).
    *   `is_read` (BOOLEAN, DEFAULT FALSE): حالة قراءة الرسالة.
    *   `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): تاريخ الإنشاء.

### 9. `complaints`
*   **الوصف:** يخزن الشكاوى المقدمة من المواطنين.
*   **الأعمدة:**
    *   `id` (UUID, PRIMARY KEY, DEFAULT `gen_random_uuid()`): معرف الشكوى.
    *   `citizen_id` (UUID, NOT NULL, REFERENCES `profiles(id)` ON DELETE CASCADE): معرف المواطن مقدم الشكوى.
    *   `admin_id` (UUID, REFERENCES `profiles(id)` ON DELETE SET NULL): معرف الأدمن الذي يدير الشكوى.
    *   `assigned_to_id` (UUID, REFERENCES `profiles(id)` ON DELETE SET NULL): معرف النائب/المرشح الذي تم تعيين الشكوى له.
    *   `subject` (TEXT): موضوع الشكوى.
    *   `message` (TEXT, NOT NULL): نص الشكوى (بحد أقصى 1500 حرف).
    *   `status` (TEXT, NOT NULL, DEFAULT `'pending_admin_review'`): حالة الشكوى (pending_admin_review, pending_assignment, assigned, accepted, rejected, on_hold, resolved_pending_admin_approval, resolved).
    *   `admin_notes` (TEXT): ملاحظات الأدمن.
    *   `resolution_date` (DATE): تاريخ حل الشكوى.
    *   `on_hold_until` (TIMESTAMP WITH TIME ZONE): تاريخ انتهاء التعليق.
    *   `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): تاريخ الإنشاء.
    *   `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): تاريخ آخر تحديث.

### 10. `complaint_attachments`
*   **الوصف:** يخزن مرفقات الشكاوى.
*   **الأعمدة:**
    *   `id` (UUID, PRIMARY KEY, DEFAULT `gen_random_uuid()`): معرف المرفق.
    *   `complaint_id` (UUID, NOT NULL, REFERENCES `complaints(id)` ON DELETE CASCADE): معرف الشكوى المرتبطة.
    *   `file_url` (TEXT, NOT NULL): رابط الملف في Supabase Storage.
    *   `file_name` (TEXT, NOT NULL): اسم الملف الأصلي.
    *   `file_type` (TEXT, NOT NULL): نوع الملف.
    *   `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): تاريخ الإنشاء.

### 11. `page_views`
*   **الوصف:** يسجل كل زيارة لصفحة معينة.
*   **الأعمدة:**
    *   `id` (UUID, PRIMARY KEY, DEFAULT `gen_random_uuid()`): معرف الزيارة.
    *   `page_path` (TEXT, NOT NULL): مسار الصفحة التي تمت زيارتها.
    *   `visitor_ip` (INET): عنوان IP للزائر.
    *   `visited_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): تاريخ ووقت الزيارة.

### 12. `visitor_counts`
*   **الوصف:** يخزن إحصائيات مجمعة لعدد الزوار لكل صفحة.
*   **الأعمدة:**
    *   `page_path` (TEXT, PRIMARY KEY): مسار الصفحة.
    *   `total_views` (INTEGER, DEFAULT 0): إجمالي عدد المشاهدات.
    *   `unique_visitors` (INTEGER, DEFAULT 0): عدد الزوار الفريدين.
    *   `last_updated` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): تاريخ آخر تحديث للإحصائيات.

---

## 🔒 سياسات الأمان على مستوى الصفوف (RLS)

تم تمكين RLS لجميع الجداول الجديدة لضمان أمان البيانات والتحكم في الوصول بناءً على دور المستخدم.

### `citizens`
*   `Citizens are viewable by everyone`: تسمح للجميع بعرض بيانات المواطنين.
*   `Users can insert their own citizen data`: تسمح للمستخدمين بإدخال بيانات المواطن الخاصة بهم فقط.
*   `Users can update their own citizen data`: تسمح للمستخدمين بتحديث بيانات المواطن الخاصة بهم فقط.

### `candidates`
*   `Candidates are viewable by everyone`: تسمح للجميع بعرض بيانات المرشحين.
*   `Users can insert their own candidate data`: تسمح للمستخدمين بإدخال بيانات المرشح الخاصة بهم فقط.
*   `Users can update their own candidate data`: تسمح للمستخدمين بتحديث بيانات المرشح الخاصة بهم فقط.

### `current_members`
*   `Current members are viewable by everyone`: تسمح للجميع بعرض بيانات النواب الحاليين.
*   `Users can insert their own member data`: تسمح للمستخدمين بإدخال بيانات النائب الخاصة بهم فقط.
*   `Users can update their own member data`: تسمح للمستخدمين بتحديث بيانات النائب الخاصة بهم فقط.

### `achievements`
*   `Achievements are viewable by everyone`: تسمح للجميع بعرض الإنجازات.
*   `Users can manage their own achievements`: تسمح للمستخدمين بإدارة (إدخال، تحديث، حذف) إنجازاتهم الخاصة فقط.

### `events`
*   `Events are viewable by everyone`: تسمح للجميع بعرض الأحداث.
*   `Users can manage their own events`: تسمح للمستخدمين بإدارة (إدخال، تحديث، حذف) أحداثهم الخاصة فقط.

### `ratings`
*   `Ratings are viewable by everyone`: تسمح للجميع بعرض التقييمات.
*   `Users can insert their own ratings`: تسمح للمستخدمين بإدخال تقييماتهم الخاصة فقط.
*   `Users can update their own ratings`: تسمح للمستخدمين بتحديث تقييماتهم الخاصة فقط.
*   `Users can delete their own ratings`: تسمح للمستخدمين بحذف تقييماتهم الخاصة فقط.

### `messages`
*   `Users can view messages sent to them or by them`: تسمح للمستخدمين بعرض الرسائل المرسلة إليهم أو منهم فقط.
*   `Users can send messages`: تسمح للمستخدمين بإرسال الرسائل الخاصة بهم فقط، مع التحقق من طول الرسالة (<= 500 حرف).
*   `Recipients can update message read status`: تسمح للمستلمين بتحديث حالة قراءة الرسالة فقط.

### `complaints`
*   `Citizens can insert their own complaints`: تسمح للمواطنين بإدخال شكاواهم الخاصة فقط.
*   `Admins can view all complaints`: تسمح للمسؤولين بعرض جميع الشكاوى.
*   `Assigned users can view and update their complaints`: تسمح للمستخدمين المعينين للشكوى بعرضها وتحديثها.
*   `Admins can update all complaints`: تسمح للمسؤولين بتحديث جميع الشكاوى.

### `complaint_attachments`
*   `Users can insert their own complaint attachments`: تسمح للمستخدمين بإدخال مرفقات الشكاوى الخاصة بهم فقط، بشرط أن تكون الشكوى تابعة لهم.
*   `All users can view complaint attachments`: تسمح لجميع المستخدمين بعرض مرفقات الشكاوى.

### `page_views`
*   `Anyone can insert page views`: تسمح لأي شخص بإدخال سجلات مشاهدات الصفحات.
*   `Admins can view all page views`: تسمح للمسؤولين بعرض جميع سجلات مشاهدات الصفحات.

### `visitor_counts`
*   `Anyone can view visitor counts`: تسمح لأي شخص بعرض إحصائيات الزوار.
*   `Admins can update visitor counts`: تسمح للمسؤولين بتحديث إحصائيات الزوار.

---

## 🧮 الدوال المخصصة (Functions)

### `increment_profile_points(profile_id_input UUID, points_to_add INTEGER)`
*   **الوصف:** دالة لزيادة عدد النقاط لملف شخصي معين.
*   **الاستخدام:** يتم استدعاؤها لزيادة نقاط النائب/المرشح عند حل الشكاوى بنجاح.
*   **المنطق:** تقوم بتحديث عمود `points` في جدول `profiles` بإضافة `points_to_add` إلى القيمة الحالية لـ `profile_id_input`.

---

**ملاحظة:** هذا المستند يوضح الهيكل النهائي لقاعدة البيانات بعد تطبيق جميع التعديلات والإصلاحات. يجب أن يكون هذا المخطط متوافقًا تمامًا مع ملف `supabase-tables.sql` الذي تم تنفيذه بنجاح.
