# مواصفات نظام الشكاوى والرسائل وعداد الزوار

## 1. نظام الشكاوى (Complaints System)

### 1.1. الوصف العام
نظام يسمح للمواطنين بتقديم شكاوى مباشرة إلى الإدارة (الأدمن) بحد أقصى 1500 حرف، مع إمكانية إرفاق ما يصل إلى 10 مستندات. يقوم الأدمن بمراجعة الشكوى وإعادة توجيهها إلى نائب أو مرشح محدد. تظهر الشكوى في لوحة تحكم النائب/المرشح، حيث يمكنه قبولها، رفضها، أو تعليقها للدراسة.

### 1.2. تفاصيل الواجهة الأمامية (Frontend)

#### 1.2.1. زر "إرسال شكوى" في الهيدر
- **الموقع:** يظهر في الهيدر الرئيسي للموقع.
- **الوظيفة:** عند النقر عليه، يفتح نموذج (Modal/Popup) لتقديم الشكوى.

#### 1.2.2. نموذج تقديم الشكوى (Complaint Submission Form)
- **المحتويات:**
  - حقل نصي للشكوى (Textarea) بحد أقصى 1500 حرف.
  - حقل لرفع المرفقات (File Upload) يسمح برفع ما يصل إلى 10 ملفات (صور، مستندات PDF، إلخ).
  - زر "إرسال الشكوى".
- **التحقق من الصحة (Validation):**
  - يجب ألا يكون حقل الشكوى فارغًا.
  - يجب ألا يتجاوز عدد الأحرف 1500.
  - يجب ألا يتجاوز عدد المرفقات 10.

#### 1.2.3. لوحة تحكم الأدمن (Admin Dashboard)
- **عرض الشكاوى:** قائمة بجميع الشكاوى الواردة.
- **إعادة توجيه الشكوى:** زر يسمح للأدمن باختيار نائب/مرشح من قائمة لإعادة توجيه الشكوى إليه.

#### 1.2.4. لوحة تحكم النائب/المرشح (Candidate/Member Dashboard)
- **عرض الشكاوى:** قائمة بالشكاوى الموجهة إليه.
- **خيارات التعامل مع الشكوى:**
  - **قبول الشكوى:** يحدد موعدًا بتاريخ لحلها.
  - **رفض الشكوى:** يرفض الشكوى مع إمكانية إضافة سبب.
  - **تعليق للدراسة:** يحدد مدة للتعليق (مثلاً 3 أيام أو أسبوع).
- **حل الشكوى:** بعد حل الشكوى، يقوم النائب/المرشح بتأكيد الحل. يقوم الأدمن بمراجعة الحل، وفي حال الموافقة، تزداد نقاط النائب/المرشح بنقطة واحدة.

### 1.3. تفاصيل قاعدة البيانات (Supabase)

#### 1.3.1. جدول `complaints`
- `id`: UUID (Primary Key)
- `citizen_id`: UUID (Foreign Key to `profiles` table)
- `admin_id`: UUID (Foreign Key to `profiles` table, الأدمن الذي استلم الشكوى)
- `assigned_to_id`: UUID (Foreign Key to `profiles` table, النائب/المرشح الموجهة إليه الشكوى)
- `subject`: TEXT (موضوع الشكوى، اختياري)
- `message`: TEXT (محتوى الشكوى، بحد أقصى 1500 حرف)
- `status`: ENUM (
  `pending_admin_review`,
  `pending_assignment`,
  `assigned`,
  `accepted`,
  `rejected`,
  `on_hold`,
  `resolved_pending_admin_approval`,
  `resolved`
) (الحالة الافتراضية: `pending_admin_review`)
- `attachments`: JSONB (مصفوفة من روابط الملفات المرفقة، بحد أقصى 10 روابط)
- `admin_notes`: TEXT (ملاحظات الأدمن)
- `resolution_date`: DATE (تاريخ الحل المحدد من النائب/المرشح)
- `on_hold_until`: TIMESTAMP (تاريخ انتهاء فترة التعليق)
- `created_at`: TIMESTAMP (Default: `now()`)
- `updated_at`: TIMESTAMP (Default: `now()`, `on update now()`)

#### 1.3.2. جدول `complaint_attachments`
- `id`: UUID (Primary Key)
- `complaint_id`: UUID (Foreign Key to `complaints` table)
- `file_url`: TEXT (رابط الملف في Supabase Storage)
- `file_name`: TEXT
- `file_type`: TEXT
- `created_at`: TIMESTAMP (Default: `now()`)

#### 1.3.3. تحديث جدول `profiles`
- `points`: INTEGER (Default: 0) - لإضافة نقاط للنائب/المرشح عند حل الشكاوى.

### 1.4. Supabase Storage
- **Bucket:** `complaint-attachments`
- **Policies:** يجب إعداد سياسات RLS للسماح للمواطن برفع الملفات، وللأدمن والنائب/المرشح بعرضها.

## 2. نظام الرسائل المباشرة (Direct Messaging System)

### 2.1. الوصف العام
نظام يسمح للمواطنين بإرسال رسائل مباشرة إلى المرشحين/النواب بحد أقصى 500 حرف، بدون مرفقات. تظهر هذه الرسائل مباشرة في لوحة تحكم المرشح/النائب.

### 2.2. تفاصيل الواجهة الأمامية (Frontend)

#### 2.2.1. زر "إرسال رسالة" في صفحة المرشح/النائب
- **الموقع:** يظهر في صفحة الملف الشخصي للمرشح/النائب.
- **الوظيفة:** عند النقر عليه، يفتح نموذج (Modal/Popup) لإرسال رسالة مباشرة.

#### 2.2.2. نموذج إرسال الرسالة (Message Submission Form)
- **المحتويات:**
  - حقل نصي للرسالة (Textarea) بحد أقصى 500 حرف.
  - زر "إرسال الرسالة".
- **التحقق من الصحة (Validation):**
  - يجب ألا يكون حقل الرسالة فارغًا.
  - يجب ألا يتجاوز عدد الأحرف 500.

#### 2.2.3. لوحة تحكم النائب/المرشح (Candidate/Member Dashboard)
- **عرض الرسائل:** قائمة بالرسائل الواردة من المواطنين.
- **الرد على الرسائل:** إمكانية الرد على الرسائل مباشرة.

### 2.3. تفاصيل قاعدة البيانات (Supabase)

#### 2.3.1. جدول `messages`
- `id`: UUID (Primary Key)
- `sender_id`: UUID (Foreign Key to `profiles` table, المواطن المرسل)
- `receiver_id`: UUID (Foreign Key to `profiles` table, النائب/المرشح المستلم)
- `message_content`: TEXT (محتوى الرسالة، بحد أقصى 500 حرف)
- `is_read`: BOOLEAN (Default: `false`)
- `created_at`: TIMESTAMP (Default: `now()`)

## 3. عداد الزوار (Visitor Counter)

### 3.1. الوصف العام
عداد بسيط لتتبع عدد الزوار للصفحات العامة أو صفحات الملفات الشخصية.

### 3.2. تفاصيل الواجهة الأمامية (Frontend)
- **الموقع:** يمكن عرضه في الفوتر أو في لوحة تحكم الأدمن.
- **الوظيفة:** يعرض العدد الإجمالي للزوار أو عدد الزوار لصفحة معينة.

### 3.3. تفاصيل قاعدة البيانات (Supabase)

#### 3.3.1. جدول `page_views`
- `id`: UUID (Primary Key)
- `page_path`: TEXT (مسار الصفحة التي تمت زيارتها، مثال: `/`, `/candidate/123`)
- `visitor_ip`: INET (عنوان IP للزائر، لتمييز الزيارات الفريدة)
- `visited_at`: TIMESTAMP (Default: `now()`)

#### 3.3.2. جدول `visitor_counts` (اختياري، لتجميع البيانات)
- `page_path`: TEXT (Primary Key)
- `total_views`: INTEGER (Default: 0)
- `unique_visitors`: INTEGER (Default: 0)
- `last_updated`: TIMESTAMP (Default: `now()`, `on update now()`)

## 4. تحديثات `supabase-tables.sql`

سيتم إضافة أوامر SQL لإنشاء الجداول المذكورة أعلاه (`complaints`, `complaint_attachments`, `messages`, `page_views`, `visitor_counts`) وتحديث جدول `profiles` لإضافة عمود `points`.
