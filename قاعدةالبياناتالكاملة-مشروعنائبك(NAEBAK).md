# قاعدة البيانات الكاملة - مشروع نائبك (NAEBAK)

**التاريخ:** 02 أكتوبر 2025  
**قاعدة البيانات:** Supabase (PostgreSQL)  
**عدد الجداول:** 15 جدول

---

## 📋 فهرس الجداول

1. [governorates](#1-governorates-المحافظات) - المحافظات
2. [parties](#2-parties-الأحزاب) - الأحزاب السياسية
3. [profiles](#3-profiles-الملفات-الشخصية) - الملفات الشخصية للمستخدمين
4. [political_info](#4-political_info-المعلومات-السياسية) - المعلومات السياسية للنواب والمرشحين
5. [programs](#5-programs-البرنامج-الانتخابي) - البرنامج الانتخابي
6. [achievements](#6-achievements-الإنجازات) - الإنجازات
7. [events](#7-events-المناسبات-والأحداث) - المناسبات والأحداث
8. [complaints](#8-complaints-الشكاوى) - الشكاوى
9. [complaint_attachments](#9-complaint_attachments-مرفقات-الشكاوى) - مرفقات الشكاوى
10. [messages](#10-messages-الرسائل) - الرسائل
11. [notifications](#11-notifications-الإشعارات) - الإشعارات
12. [ratings](#12-ratings-التقييمات) - التقييمات
13. [banners](#13-banners-البانرات) - البانرات
14. [news](#14-news-الأخبار) - الأخبار (الشريط الإخباري)
15. [visitor_counter_settings](#15-visitor_counter_settings-إعدادات-عداد-الزوار) - إعدادات عداد الزوار

---

## 1. governorates (المحافظات)

### الوصف:
جدول يحتوي على قائمة المحافظات المصرية الـ27.

### الأعمدة:

```sql
CREATE TABLE governorates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | المعرف الفريد |
| `name_ar` | TEXT | NOT NULL, UNIQUE | اسم المحافظة بالعربية |
| `name_en` | TEXT | NOT NULL, UNIQUE | اسم المحافظة بالإنجليزية |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ الإنشاء |

### Indexes:
```sql
CREATE INDEX idx_governorates_name_ar ON governorates(name_ar);
CREATE INDEX idx_governorates_name_en ON governorates(name_en);
```

### البيانات الأولية (Initial Data):
```sql
INSERT INTO governorates (name_ar, name_en) VALUES
  ('القاهرة', 'Cairo'),
  ('الجيزة', 'Giza'),
  ('الإسكندرية', 'Alexandria'),
  ('الدقهلية', 'Dakahlia'),
  ('البحيرة', 'Beheira'),
  ('الفيوم', 'Fayoum'),
  ('الغربية', 'Gharbia'),
  ('الإسماعيلية', 'Ismailia'),
  ('المنوفية', 'Monufia'),
  ('المنيا', 'Minya'),
  ('القليوبية', 'Qalyubia'),
  ('الوادي الجديد', 'New Valley'),
  ('الشرقية', 'Sharqia'),
  ('السويس', 'Suez'),
  ('أسوان', 'Aswan'),
  ('أسيوط', 'Asyut'),
  ('بني سويف', 'Beni Suef'),
  ('بورسعيد', 'Port Said'),
  ('دمياط', 'Damietta'),
  ('الأقصر', 'Luxor'),
  ('قنا', 'Qena'),
  ('سوهاج', 'Sohag'),
  ('جنوب سيناء', 'South Sinai'),
  ('شمال سيناء', 'North Sinai'),
  ('كفر الشيخ', 'Kafr El Sheikh'),
  ('مطروح', 'Matrouh'),
  ('البحر الأحمر', 'Red Sea');
```

### RLS Policies:
```sql
-- الجميع يمكنهم القراءة
CREATE POLICY "Everyone can read governorates"
ON governorates FOR SELECT
USING (true);

-- الأدمن فقط يمكنه الإضافة/التعديل/الحذف
CREATE POLICY "Only admins can modify governorates"
ON governorates FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 2. parties (الأحزاب)

### الوصف:
جدول يحتوي على الأحزاب السياسية المصرية.

### الأعمدة:

```sql
CREATE TABLE parties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | المعرف الفريد |
| `name_ar` | TEXT | NOT NULL, UNIQUE | اسم الحزب بالعربية |
| `name_en` | TEXT | NOT NULL, UNIQUE | اسم الحزب بالإنجليزية |
| `logo_url` | TEXT | NULL | رابط شعار الحزب |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ الإنشاء |

### Indexes:
```sql
CREATE INDEX idx_parties_name_ar ON parties(name_ar);
CREATE INDEX idx_parties_name_en ON parties(name_en);
```

### البيانات الأولية (أمثلة):
```sql
INSERT INTO parties (name_ar, name_en) VALUES
  ('مستقل', 'Independent'),
  ('حزب مستقبل وطن', 'Future of a Nation Party'),
  ('الحزب الوطني الديمقراطي', 'National Democratic Party'),
  ('حزب الوفد', 'Wafd Party'),
  ('الحزب المصري الديمقراطي الاجتماعي', 'Egyptian Social Democratic Party');
```

### RLS Policies:
```sql
-- الجميع يمكنهم القراءة
CREATE POLICY "Everyone can read parties"
ON parties FOR SELECT
USING (true);

-- الأدمن والمدير يمكنهم الإضافة/التعديل
CREATE POLICY "Admins and managers can modify parties"
ON parties FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);
```

---

## 3. profiles (الملفات الشخصية)

### الوصف:
جدول رئيسي يحتوي على معلومات جميع المستخدمين (مواطنين، نواب، مرشحين، مدراء، أدمن).

### الأعمدة:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, REFERENCES auth.users | المعرف الفريد (من Supabase Auth) |
| `role` | TEXT | NOT NULL, CHECK | الدور (citizen, candidate, member, manager, admin) |
| `first_name` | TEXT | NOT NULL | الاسم الأول |
| `last_name` | TEXT | NOT NULL | الاسم الأخير |
| `email` | TEXT | UNIQUE, NOT NULL | البريد الإلكتروني |
| `phone` | TEXT | NOT NULL | رقم الهاتف |
| `whatsapp` | TEXT | NULL | رقم الواتساب (اختياري) |
| `gender` | TEXT | CHECK | الجنس (male, female) |
| `birth_date` | DATE | NULL | تاريخ الميلاد |
| `governorate` | TEXT | NOT NULL | المحافظة |
| `city` | TEXT | NULL | المدينة |
| `district` | TEXT | NULL | الحي |
| `address` | TEXT | NULL | العنوان التفصيلي |
| `occupation` | TEXT | NULL | الوظيفة |
| `profile_picture` | TEXT | NULL | رابط الصورة الشخصية |
| `banner_image` | TEXT | NULL | رابط صورة البانر |
| `bio` | TEXT | NULL | السيرة الذاتية |
| `points` | INTEGER | DEFAULT 0 | عدد النقاط (للنواب/المرشحين) |
| `rating_average` | FLOAT | DEFAULT 0.0 | متوسط التقييم |
| `rating_count` | INTEGER | DEFAULT 0 | عدد المقيمين |
| `is_approved` | BOOLEAN | DEFAULT FALSE | هل تمت الموافقة على الحساب |
| `is_active` | BOOLEAN | DEFAULT TRUE | هل الحساب نشط |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ الإنشاء |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ آخر تحديث |

### Indexes:
```sql
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_governorate ON profiles(governorate);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);
CREATE INDEX idx_profiles_rating_average ON profiles(rating_average DESC);
CREATE INDEX idx_profiles_points ON profiles(points DESC);
CREATE INDEX idx_profiles_full_name ON profiles(first_name, last_name);
```

### Trigger لتحديث updated_at:
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### Trigger لإنشاء Profile تلقائياً عند التسجيل:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'citizen');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

### RLS Policies:
```sql
-- المستخدمون يمكنهم رؤية ملفاتهم الشخصية
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- الجميع يمكنهم رؤية ملفات النواب والمرشحين
CREATE POLICY "Everyone can view members and candidates"
ON profiles FOR SELECT
USING (role IN ('member', 'candidate'));

-- المستخدمون يمكنهم تحديث ملفاتهم الشخصية
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- الأدمن والمدير يمكنهم رؤية جميع الملفات
CREATE POLICY "Admins and managers can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- الأدمن يمكنه حذف الملفات
CREATE POLICY "Admins can delete profiles"
ON profiles FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 4. political_info (المعلومات السياسية)

### الوصف:
جدول يحتوي على المعلومات السياسية للنواب والمرشحين.

### الأعمدة:

```sql
CREATE TABLE political_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  council_type TEXT CHECK (council_type IN ('parliament', 'senate')),
  party_id UUID REFERENCES parties(id) ON DELETE SET NULL,
  constituency TEXT,
  electoral_number TEXT,
  electoral_symbol TEXT,
  committee TEXT,
  membership_start_date DATE,
  term_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id)
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | المعرف الفريد |
| `profile_id` | UUID | NOT NULL, REFERENCES profiles, UNIQUE | معرف الملف الشخصي |
| `council_type` | TEXT | CHECK | نوع المجلس (parliament, senate) |
| `party_id` | UUID | REFERENCES parties | معرف الحزب |
| `constituency` | TEXT | NULL | الدائرة الانتخابية |
| `electoral_number` | TEXT | NULL | الرقم الانتخابي (للمرشحين) |
| `electoral_symbol` | TEXT | NULL | الرمز الانتخابي (للمرشحين) |
| `committee` | TEXT | NULL | اللجنة البرلمانية (للنواب الحاليين) |
| `membership_start_date` | DATE | NULL | تاريخ بداية العضوية (للنواب) |
| `term_number` | INTEGER | NULL | رقم الدورة (للنواب) |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ الإنشاء |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ آخر تحديث |

### Indexes:
```sql
CREATE INDEX idx_political_info_profile_id ON political_info(profile_id);
CREATE INDEX idx_political_info_party_id ON political_info(party_id);
CREATE INDEX idx_political_info_council_type ON political_info(council_type);
```

### Trigger:
```sql
CREATE TRIGGER update_political_info_updated_at
BEFORE UPDATE ON political_info
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### RLS Policies:
```sql
-- الجميع يمكنهم القراءة
CREATE POLICY "Everyone can read political info"
ON political_info FOR SELECT
USING (true);

-- صاحب الملف يمكنه التحديث
CREATE POLICY "Profile owner can update political info"
ON political_info FOR UPDATE
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE id = auth.uid()
  )
);

-- الأدمن والمدير يمكنهم التعديل
CREATE POLICY "Admins and managers can modify political info"
ON political_info FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);
```

---

## 5. programs (البرنامج الانتخابي)

### الوصف:
جدول يحتوي على نقاط البرنامج الانتخابي للنواب والمرشحين.

### الأعمدة:

```sql
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | المعرف الفريد |
| `profile_id` | UUID | NOT NULL, REFERENCES profiles | معرف الملف الشخصي |
| `title` | TEXT | NOT NULL | عنوان النقطة |
| `description` | TEXT | NULL | وصف النقطة |
| `order_index` | INTEGER | DEFAULT 0 | ترتيب النقطة |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ الإنشاء |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ آخر تحديث |

### Indexes:
```sql
CREATE INDEX idx_programs_profile_id ON programs(profile_id);
CREATE INDEX idx_programs_order ON programs(profile_id, order_index);
```

### Trigger:
```sql
CREATE TRIGGER update_programs_updated_at
BEFORE UPDATE ON programs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### RLS Policies:
```sql
-- الجميع يمكنهم القراءة
CREATE POLICY "Everyone can read programs"
ON programs FOR SELECT
USING (true);

-- صاحب الملف يمكنه الإضافة/التعديل/الحذف
CREATE POLICY "Profile owner can manage programs"
ON programs FOR ALL
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE id = auth.uid()
  )
);

-- المدير يمكنه الإضافة/التعديل
CREATE POLICY "Managers can manage programs"
ON programs FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);
```

---

## 6. achievements (الإنجازات)

### الوصف:
جدول يحتوي على إنجازات النواب والمرشحين.

### الأعمدة:

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  achievement_date DATE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | المعرف الفريد |
| `profile_id` | UUID | NOT NULL, REFERENCES profiles | معرف الملف الشخصي |
| `title` | TEXT | NOT NULL | عنوان الإنجاز |
| `description` | TEXT | NULL | وصف الإنجاز |
| `achievement_date` | DATE | NULL | تاريخ الإنجاز |
| `is_approved` | BOOLEAN | DEFAULT FALSE | هل تمت الموافقة عليه |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ الإنشاء |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ آخر تحديث |

### Indexes:
```sql
CREATE INDEX idx_achievements_profile_id ON achievements(profile_id);
CREATE INDEX idx_achievements_is_approved ON achievements(is_approved);
CREATE INDEX idx_achievements_date ON achievements(achievement_date DESC);
```

### Trigger:
```sql
CREATE TRIGGER update_achievements_updated_at
BEFORE UPDATE ON achievements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### RLS Policies:
```sql
-- الجميع يمكنهم رؤية الإنجازات المعتمدة
CREATE POLICY "Everyone can read approved achievements"
ON achievements FOR SELECT
USING (is_approved = true);

-- صاحب الملف يمكنه رؤية جميع إنجازاته
CREATE POLICY "Profile owner can view their achievements"
ON achievements FOR SELECT
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE id = auth.uid()
  )
);

-- صاحب الملف يمكنه الإضافة/التعديل/الحذف
CREATE POLICY "Profile owner can manage achievements"
ON achievements FOR ALL
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE id = auth.uid()
  )
);

-- الأدمن يمكنه الموافقة والتعديل
CREATE POLICY "Admins can manage achievements"
ON achievements FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);
```

---

## 7. events (المناسبات والأحداث)

### الوصف:
جدول يحتوي على المناسبات والأحداث التي ينظمها النواب والمرشحون.

### الأعمدة:

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | المعرف الفريد |
| `profile_id` | UUID | NOT NULL, REFERENCES profiles | معرف الملف الشخصي |
| `title` | TEXT | NOT NULL | عنوان الحدث |
| `description` | TEXT | NULL | وصف الحدث |
| `event_date` | DATE | NULL | تاريخ الحدث |
| `is_approved` | BOOLEAN | DEFAULT FALSE | هل تمت الموافقة عليه |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ الإنشاء |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ آخر تحديث |

### Indexes:
```sql
CREATE INDEX idx_events_profile_id ON events(profile_id);
CREATE INDEX idx_events_is_approved ON events(is_approved);
CREATE INDEX idx_events_date ON events(event_date DESC);
```

### Trigger:
```sql
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### RLS Policies:
```sql
-- الجميع يمكنهم رؤية الأحداث المعتمدة
CREATE POLICY "Everyone can read approved events"
ON events FOR SELECT
USING (is_approved = true);

-- صاحب الملف يمكنه رؤية جميع أحداثه
CREATE POLICY "Profile owner can view their events"
ON events FOR SELECT
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE id = auth.uid()
  )
);

-- صاحب الملف يمكنه الإضافة/التعديل/الحذف
CREATE POLICY "Profile owner can manage events"
ON events FOR ALL
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE id = auth.uid()
  )
);

-- الأدمن يمكنه الموافقة والتعديل
CREATE POLICY "Admins can manage events"
ON events FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);
```

---

## 8. complaints (الشكاوى)

### الوصف:
جدول يحتوي على الشكاوى المقدمة من المواطنين.

### الأعمدة:

```sql
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  citizen_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_to_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | المعرف الفريد |
| `citizen_id` | UUID | NOT NULL, REFERENCES profiles | معرف المواطن |
| `assigned_to_id` | UUID | REFERENCES profiles | معرف النائب/المرشح المسند إليه |
| `title` | TEXT | NULL | عنوان الشكوى |
| `description` | TEXT | NOT NULL, CHECK <= 1500 | وصف الشكوى |
| `status` | TEXT | DEFAULT, CHECK | الحالة |
| `rejection_reason` | TEXT | NULL | سبب الرفض |
| `resolution_date` | DATE | NULL | تاريخ الحل المتوقع |
| `on_hold_until` | DATE | NULL | تاريخ انتهاء التعليق |
| `on_hold_days` | INTEGER | NULL | عدد أيام التعليق |
| `admin_notes` | TEXT | NULL | ملاحظات الأدمن |
| `admin_reply` | TEXT | NULL | رد الأدمن على المواطن |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ الإنشاء |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ آخر تحديث |

### Indexes:
```sql
CREATE INDEX idx_complaints_citizen_id ON complaints(citizen_id);
CREATE INDEX idx_complaints_assigned_to_id ON complaints(assigned_to_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_created_at ON complaints(created_at DESC);
```

### Trigger:
```sql
CREATE TRIGGER update_complaints_updated_at
BEFORE UPDATE ON complaints
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### RLS Policies:
```sql
-- المواطن يمكنه رؤية شكاواه فقط
CREATE POLICY "Citizens can view their own complaints"
ON complaints FOR SELECT
USING (auth.uid() = citizen_id);

-- المواطن يمكنه إضافة شكاوى
CREATE POLICY "Citizens can create complaints"
ON complaints FOR INSERT
WITH CHECK (auth.uid() = citizen_id);

-- النائب/المرشح يمكنه رؤية الشكاوى المسندة إليه
CREATE POLICY "Members can view assigned complaints"
ON complaints FOR SELECT
USING (auth.uid() = assigned_to_id);

-- النائب/المرشح يمكنه تحديث الشكاوى المسندة إليه
CREATE POLICY "Members can update assigned complaints"
ON complaints FOR UPDATE
USING (auth.uid() = assigned_to_id);

-- الأدمن يمكنه رؤية وإدارة جميع الشكاوى
CREATE POLICY "Admins can manage all complaints"
ON complaints FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 9. complaint_attachments (مرفقات الشكاوى)

### الوصف:
جدول يحتوي على المرفقات المرفقة مع الشكاوى (حتى 10 ملفات لكل شكوى).

### الأعمدة:

```sql
CREATE TABLE complaint_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | المعرف الفريد |
| `complaint_id` | UUID | NOT NULL, REFERENCES complaints | معرف الشكوى |
| `file_url` | TEXT | NOT NULL | رابط الملف في Supabase Storage |
| `file_name` | TEXT | NOT NULL | اسم الملف |
| `file_type` | TEXT | NULL | نوع الملف (image/jpeg, application/pdf, etc.) |
| `file_size` | INTEGER | NULL | حجم الملف بالبايت |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ الإنشاء |

### Indexes:
```sql
CREATE INDEX idx_complaint_attachments_complaint_id ON complaint_attachments(complaint_id);
```

### Constraint للحد الأقصى (10 ملفات):
```sql
CREATE OR REPLACE FUNCTION check_complaint_attachments_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM complaint_attachments WHERE complaint_id = NEW.complaint_id) >= 10 THEN
    RAISE EXCEPTION 'Cannot add more than 10 attachments to a complaint';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_attachments_limit
BEFORE INSERT ON complaint_attachments
FOR EACH ROW
EXECUTE FUNCTION check_complaint_attachments_limit();
```

### RLS Policies:
```sql
-- المواطن يمكنه رؤية مرفقات شكاواه
CREATE POLICY "Citizens can view their complaint attachments"
ON complaint_attachments FOR SELECT
USING (
  complaint_id IN (
    SELECT id FROM complaints WHERE citizen_id = auth.uid()
  )
);

-- النائب/المرشح يمكنه رؤية مرفقات الشكاوى المسندة إليه
CREATE POLICY "Members can view assigned complaint attachments"
ON complaint_attachments FOR SELECT
USING (
  complaint_id IN (
    SELECT id FROM complaints WHERE assigned_to_id = auth.uid()
  )
);

-- الأدمن يمكنه رؤية جميع المرفقات
CREATE POLICY "Admins can view all attachments"
ON complaint_attachments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- المواطن يمكنه إضافة مرفقات لشكاواه
CREATE POLICY "Citizens can add attachments to their complaints"
ON complaint_attachments FOR INSERT
WITH CHECK (
  complaint_id IN (
    SELECT id FROM complaints WHERE citizen_id = auth.uid()
  )
);
```

---

## 10. messages (الرسائل)

### الوصف:
جدول يحتوي على الرسائل المتبادلة بين المواطنين والنواب/المرشحين.

### الأعمدة:

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (LENGTH(content) <= 500),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | المعرف الفريد |
| `sender_id` | UUID | NOT NULL, REFERENCES profiles | معرف المرسل |
| `receiver_id` | UUID | NOT NULL, REFERENCES profiles | معرف المستقبل |
| `content` | TEXT | NOT NULL, CHECK <= 500 | محتوى الرسالة |
| `is_read` | BOOLEAN | DEFAULT FALSE | هل تمت قراءة الرسالة |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ الإرسال |

### Indexes:
```sql
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_is_read ON messages(receiver_id, is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

### RLS Policies:
```sql
-- المستخدم يمكنه رؤية الرسائل المرسلة منه أو إليه
CREATE POLICY "Users can view their messages"
ON messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- المستخدم يمكنه إرسال رسائل
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- المستقبل يمكنه تحديث حالة القراءة
CREATE POLICY "Receivers can update read status"
ON messages FOR UPDATE
USING (auth.uid() = receiver_id);

-- الأدمن يمكنه رؤية جميع الرسائل
CREATE POLICY "Admins can view all messages"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 11. notifications (الإشعارات)

### الوصف:
جدول يحتوي على الإشعارات المرسلة للمستخدمين.

### الأعمدة:

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'complaint',
    'message',
    'rating',
    'approval',
    'deadline',
    'general'
  )),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | المعرف الفريد |
| `user_id` | UUID | NOT NULL, REFERENCES profiles | معرف المستخدم |
| `type` | TEXT | NOT NULL, CHECK | نوع الإشعار |
| `title` | TEXT | NOT NULL | عنوان الإشعار |
| `content` | TEXT | NOT NULL | محتوى الإشعار |
| `related_id` | UUID | NULL | معرف العنصر المرتبط (شكوى، رسالة، إلخ) |
| `is_read` | BOOLEAN | DEFAULT FALSE | هل تمت قراءة الإشعار |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ الإنشاء |

### Indexes:
```sql
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

### RLS Policies:
```sql
-- المستخدم يمكنه رؤية إشعاراته فقط
CREATE POLICY "Users can view their notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- المستخدم يمكنه تحديث حالة القراءة
CREATE POLICY "Users can update their notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

-- النظام يمكنه إضافة إشعارات (من خلال Functions)
CREATE POLICY "System can create notifications"
ON notifications FOR INSERT
WITH CHECK (true);
```

---

## 12. ratings (التقييمات)

### الوصف:
جدول يحتوي على تقييمات المواطنين للنواب والمرشحين.

### الأعمدة:

```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  citizen_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rated_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(citizen_id, rated_profile_id)
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | المعرف الفريد |
| `citizen_id` | UUID | NOT NULL, REFERENCES profiles | معرف المواطن |
| `rated_profile_id` | UUID | NOT NULL, REFERENCES profiles | معرف النائب/المرشح المُقيَّم |
| `rating` | INTEGER | NOT NULL, CHECK 1-5 | التقييم (من 1 إلى 5 نجوم) |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ التقييم |

### Constraint:
- `UNIQUE(citizen_id, rated_profile_id)` - المواطن يمكنه تقييم نفس النائب مرة واحدة فقط

### Indexes:
```sql
CREATE INDEX idx_ratings_citizen_id ON ratings(citizen_id);
CREATE INDEX idx_ratings_rated_profile_id ON ratings(rated_profile_id);
CREATE INDEX idx_ratings_rating ON ratings(rating);
```

### Trigger لتحديث متوسط التقييم:
```sql
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    rating_average = (
      SELECT AVG(rating)::FLOAT 
      FROM ratings 
      WHERE rated_profile_id = NEW.rated_profile_id
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM ratings 
      WHERE rated_profile_id = NEW.rated_profile_id
    )
  WHERE id = NEW.rated_profile_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_after_insert
AFTER INSERT ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_profile_rating();

CREATE TRIGGER update_rating_after_update
AFTER UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_profile_rating();

CREATE TRIGGER update_rating_after_delete
AFTER DELETE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_profile_rating();
```

### RLS Policies:
```sql
-- الجميع يمكنهم رؤية التقييمات
CREATE POLICY "Everyone can view ratings"
ON ratings FOR SELECT
USING (true);

-- المواطن يمكنه إضافة تقييم
CREATE POLICY "Citizens can create ratings"
ON ratings FOR INSERT
WITH CHECK (
  auth.uid() = citizen_id AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'citizen'
  )
);

-- المواطن يمكنه تعديل تقييمه
CREATE POLICY "Citizens can update their ratings"
ON ratings FOR UPDATE
USING (auth.uid() = citizen_id);

-- الأدمن يمكنه حذف التقييمات
CREATE POLICY "Admins can delete ratings"
ON ratings FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 13. banners (البانرات)

### الوصف:
جدول يحتوي على البانرات (الرئيسي، بانرات المحافظات، بانرات النواب/المرشحين).

### الأعمدة:

```sql
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('main', 'governorate', 'profile')),
  governorate TEXT,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | المعرف الفريد |
| `type` | TEXT | NOT NULL, CHECK | نوع البانر (main, governorate, profile) |
| `governorate` | TEXT | NULL | المحافظة (للبانرات الخاصة بالمحافظات) |
| `profile_id` | UUID | REFERENCES profiles | معرف الملف الشخصي (للبانرات الشخصية) |
| `image_url` | TEXT | NOT NULL | رابط صورة البانر |
| `is_active` | BOOLEAN | DEFAULT TRUE | هل البانر نشط |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ الإنشاء |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ آخر تحديث |

### Indexes:
```sql
CREATE INDEX idx_banners_type ON banners(type);
CREATE INDEX idx_banners_governorate ON banners(governorate);
CREATE INDEX idx_banners_profile_id ON banners(profile_id);
CREATE INDEX idx_banners_is_active ON banners(is_active);
```

### Trigger:
```sql
CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON banners
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### RLS Policies:
```sql
-- الجميع يمكنهم رؤية البانرات النشطة
CREATE POLICY "Everyone can view active banners"
ON banners FOR SELECT
USING (is_active = true);

-- صاحب الملف يمكنه إدارة بانره الشخصي
CREATE POLICY "Profile owners can manage their banners"
ON banners FOR ALL
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE id = auth.uid()
  )
);

-- الأدمن يمكنه إدارة جميع البانرات
CREATE POLICY "Admins can manage all banners"
ON banners FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 14. news (الأخبار)

### الوصف:
جدول يحتوي على الأخبار التي تظهر في الشريط الإخباري.

### الأعمدة:

```sql
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | المعرف الفريد |
| `content` | TEXT | NOT NULL | محتوى الخبر |
| `is_active` | BOOLEAN | DEFAULT TRUE | هل الخبر نشط |
| `order_index` | INTEGER | DEFAULT 0 | ترتيب الخبر |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ الإنشاء |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | تاريخ آخر تحديث |

### Indexes:
```sql
CREATE INDEX idx_news_is_active ON news(is_active);
CREATE INDEX idx_news_order ON news(order_index);
```

### Trigger:
```sql
CREATE TRIGGER update_news_updated_at
BEFORE UPDATE ON news
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### RLS Policies:
```sql
-- الجميع يمكنهم رؤية الأخبار النشطة
CREATE POLICY "Everyone can view active news"
ON news FOR SELECT
USING (is_active = true);

-- الأدمن يمكنه إدارة الأخبار
CREATE POLICY "Admins can manage news"
ON news FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 15. visitor_counter_settings (إعدادات عداد الزوار)

### الوصف:
جدول يحتوي على إعدادات عداد الزوار (الحد الأدنى والأقصى للرقم العشوائي).

### الأعمدة:

```sql
CREATE TABLE visitor_counter_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  min_value INTEGER NOT NULL DEFAULT 10000,
  max_value INTEGER NOT NULL DEFAULT 50000,
  current_value INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

| اسم العمود | النوع | القيود | الوصف |
|-----------|------|-------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | المعرف الفريد |
| `min_value` | INTEGER | NOT NULL, DEFAULT 10000 | الحد الأدنى للرقم العشوائي |
| `max_value` | INTEGER | NOT NULL, DEFAULT 50000 | الحد الأقصى للرقم العشوائي |
| `current_value` | INTEGER | DEFAULT 0 | القيمة الحالية للعداد |
| `last_updated` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | آخر تحديث |

### البيانات الأولية:
```sql
INSERT INTO visitor_counter_settings (min_value, max_value, current_value)
VALUES (10000, 50000, 10000);
```

### RLS Policies:
```sql
-- الجميع يمكنهم رؤية الإعدادات
CREATE POLICY "Everyone can view visitor counter"
ON visitor_counter_settings FOR SELECT
USING (true);

-- الأدمن فقط يمكنه التعديل
CREATE POLICY "Only admins can modify visitor counter"
ON visitor_counter_settings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 🔧 Functions إضافية مطلوبة

### 1. Function لتحديث عداد الزوار كل 45 دقيقة:

```sql
CREATE OR REPLACE FUNCTION update_visitor_counter()
RETURNS void AS $$
DECLARE
  min_val INTEGER;
  max_val INTEGER;
  new_val INTEGER;
BEGIN
  SELECT min_value, max_value INTO min_val, max_val
  FROM visitor_counter_settings
  LIMIT 1;
  
  new_val := floor(random() * (max_val - min_val + 1) + min_val)::INTEGER;
  
  UPDATE visitor_counter_settings
  SET current_value = new_val,
      last_updated = NOW();
END;
$$ LANGUAGE plpgsql;
```

**ملاحظة:** يجب جدولة هذه Function لتعمل كل 45 دقيقة باستخدام Cron Job أو من خلال Next.js.

### 2. Function لإنشاء إشعار:

```sql
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_content TEXT,
  p_related_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, content, related_id)
  VALUES (p_user_id, p_type, p_title, p_content, p_related_id)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 📊 ملخص الجداول

| # | اسم الجدول | عدد الأعمدة | الوصف |
|---|-----------|-------------|-------|
| 1 | governorates | 4 | المحافظات الـ27 |
| 2 | parties | 5 | الأحزاب السياسية |
| 3 | profiles | 23 | الملفات الشخصية للمستخدمين |
| 4 | political_info | 12 | المعلومات السياسية |
| 5 | programs | 7 | البرنامج الانتخابي |
| 6 | achievements | 8 | الإنجازات |
| 7 | events | 8 | المناسبات والأحداث |
| 8 | complaints | 14 | الشكاوى |
| 9 | complaint_attachments | 7 | مرفقات الشكاوى |
| 10 | messages | 6 | الرسائل |
| 11 | notifications | 8 | الإشعارات |
| 12 | ratings | 5 | التقييمات |
| 13 | banners | 8 | البانرات |
| 14 | news | 6 | الأخبار |
| 15 | visitor_counter_settings | 5 | إعدادات عداد الزوار |

**إجمالي الأعمدة:** 126 عمود

---

## ✅ قائمة التحقق النهائية

### الجداول:
- [x] 1. governorates
- [x] 2. parties
- [x] 3. profiles
- [x] 4. political_info
- [x] 5. programs
- [x] 6. achievements
- [x] 7. events
- [x] 8. complaints
- [x] 9. complaint_attachments
- [x] 10. messages
- [x] 11. notifications
- [x] 12. ratings
- [x] 13. banners
- [x] 14. news
- [x] 15. visitor_counter_settings

### Features:
- [x] Foreign Keys
- [x] Unique Constraints
- [x] Check Constraints
- [x] Default Values
- [x] Indexes
- [x] Triggers
- [x] RLS Policies
- [x] Functions
- [x] Initial Data

---

## 🚀 خطوات التنفيذ في Supabase

1. **إنشاء الجداول بالترتيب:**
   - ابدأ بالجداول الأساسية (governorates, parties)
   - ثم profiles
   - ثم باقي الجداول

2. **إضافة Indexes**

3. **إضافة Triggers**

4. **تفعيل RLS وإضافة Policies**

5. **إضافة Functions**

6. **إدخال البيانات الأولية**

7. **اختبار الـ Policies**

---

**نهاية الوثيقة**
