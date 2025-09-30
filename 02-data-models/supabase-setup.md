# 🚀 إعداد Supabase لمشروع Naebak

هذا المستند يوضح الخطوات اللازمة لإعداد قاعدة بيانات Supabase والجداول المطلوبة لدعم صفحات المواطن، المرشح، والنائب الحالي، بالإضافة إلى الإنجازات والمؤتمرات والتقييمات.

## 1. إنشاء مشروع Supabase جديد

إذا لم يكن لديك مشروع Supabase بالفعل، اتبع الخطوات التالية:

1.  انتقل إلى [Supabase Dashboard](https://app.supabase.com/).
2.  انقر على `New project`.
3.  اختر اسمًا لمشروعك (مثال: `naebak-project`).
4.  اختر كلمة مرور قوية لقاعدة البيانات.
5.  اختر المنطقة الأقرب إليك.
6.  انقر على `Create new project`.

## 2. الحصول على مفاتيح API ومتغيرات البيئة

بعد إنشاء المشروع، ستحتاج إلى `Project URL` و `Anon Key`:

1.  من لوحة تحكم Supabase، انتقل إلى `Project Settings` -> `API`.
2.  انسخ `Project URL` و `anon public` (أو `public anon key`).
3.  أضف هذه القيم إلى ملف `.env.local` في مشروع Next.js الخاص بك:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

## 3. إعداد جداول قاعدة البيانات (SQL Schema)

سنقوم بإنشاء الجداول التالية لدعم بيانات المستخدمين والإنجازات والفعاليات والتقييمات. يمكنك تنفيذ هذه الأوامر في `SQL Editor` بلوحة تحكم Supabase.

### أ. جدول `profiles` (للمواطنين، المرشحين، النواب)

هذا الجدول سيحتوي على المعلومات الأساسية لجميع أنواع المستخدمين.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  occupation TEXT,
  governorate TEXT,
  profile_image TEXT,
  banner_image TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN (
    'citizen', 'candidate', 'current_member'
  )),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### ب. جدول `citizens` (معلومات إضافية للمواطنين)

```sql
CREATE TABLE citizens (
  profile_id UUID REFERENCES profiles ON DELETE CASCADE PRIMARY KEY,
  age INTEGER,
  address_village TEXT,
  address_district TEXT,
  address_center TEXT,
  address_city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Citizens are viewable by everyone." ON citizens
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own citizen data." ON citizens
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own citizen data." ON citizens
  FOR UPDATE USING (auth.uid() = profile_id);
```

### ج. جدول `candidates` (معلومات إضافية للمرشحين)

```sql
CREATE TABLE candidates (
  profile_id UUID REFERENCES profiles ON DELETE CASCADE PRIMARY KEY,
  legislative_body TEXT NOT NULL CHECK (legislative_body IN (
    'مجلس نواب', 'مجلس شيوخ'
  )),
  party TEXT,
  is_independent BOOLEAN DEFAULT FALSE,
  electoral_symbol TEXT,
  electoral_number TEXT,
  electoral_district TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates are viewable by everyone." ON candidates
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own candidate data." ON candidates
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own candidate data." ON candidates
  FOR UPDATE USING (auth.uid() = profile_id);
```

### د. جدول `current_members` (معلومات إضافية للنواب الحاليين)

```sql
CREATE TABLE current_members (
  profile_id UUID REFERENCES profiles ON DELETE CASCADE PRIMARY KEY,
  legislative_body TEXT NOT NULL CHECK (legislative_body IN (
    'مجلس نواب', 'مجلس شيوخ'
  )),
  party TEXT,
  is_independent BOOLEAN DEFAULT FALSE,
  parliamentary_committees TEXT[], -- Array of text for committees
  electoral_district TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE current_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Current members are viewable by everyone." ON current_members
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own member data." ON current_members
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own member data." ON current_members
  FOR UPDATE USING (auth.uid() = profile_id);
```

### هـ. جدول `achievements` (الإنجازات)

```sql
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements are viewable by everyone." ON achievements
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own achievements." ON achievements
  FOR ALL USING (auth.uid() = profile_id);
```

### و. جدول `events` (المؤتمرات والمناسبات)

```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  type TEXT NOT NULL CHECK (type IN ('conference', 'event')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone." ON events
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own events." ON events
  FOR ALL USING (auth.uid() = profile_id);
```

### ز. جدول `ratings` (التقييمات)

```sql
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  rater_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (profile_id, rater_id) -- Each user can rate a profile only once
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings are viewable by everyone." ON ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own ratings." ON ratings
  FOR INSERT WITH CHECK (auth.uid() = rater_id);

CREATE POLICY "Users can update their own ratings." ON ratings
  FOR UPDATE USING (auth.uid() = rater_id);

CREATE POLICY "Users can delete their own ratings." ON ratings
  FOR DELETE USING (auth.uid() = rater_id);
```

## 4. إعداد التخزين (Storage) للصور

لتحميل صور الملف الشخصي، البانر، صور الإنجازات والفعاليات، ستحتاج إلى إعداد Buckets في Supabase Storage.

1.  من لوحة تحكم Supabase، انتقل إلى `Storage`.
2.  انقر على `New bucket`.
3.  أنشئ Buckets بأسماء مثل `profile-images`, `banner-images`, `achievement-images`, `event-images`.
4.  تأكد من ضبط سياسات الوصول (Policies) لكل Bucket للسماح بالتحميل والقراءة المناسبين (مثال: يمكن للمستخدمين المصادق عليهم تحميل الصور، ويمكن للجميع قراءتها).

    **مثال لسياسة Bucket (للسماح بالقراءة العامة والتحميل للمستخدمين المصادق عليهم):**

    ```sql
    -- For 'profile-images' bucket
    CREATE POLICY "Allow authenticated users to upload profile images" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');
    CREATE POLICY "Allow public access to profile images" ON storage.objects
      FOR SELECT USING (bucket_id = 'profile-images');

    -- Repeat similar policies for other buckets: banner-images, achievement-images, event-images
    ```

## 5. دمج Supabase في مشروع Next.js

لقد قمت بالفعل بدمج `supabase-client.ts` في مشروعك، ولكن ستحتاج إلى استخدام هذا العميل للتفاعل مع الجداول الجديدة.

**مثال على جلب بيانات المواطن:**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// في صفحة المواطن (مثال: src/app/citizen/[id]/page.tsx)
async function getCitizenProfile(id: string) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*, citizens(*)')
    .eq('id', id)
    .single();

  if (profileError) {
    console.error('Error fetching citizen profile:', profileError);
    return null;
  }

  return {
    id: profile.id,
    fullName: profile.full_name,
    occupation: profile.occupation,
    governorate: profile.governorate,
    age: profile.citizens?.age,
    address: {
      village: profile.citizens?.address_village,
      district: profile.citizens?.address_district,
      center: profile.citizens?.address_center,
      city: profile.citizens?.address_city,
    },
    profileImage: profile.profile_image,
  };
}

// في صفحة المرشح (مثال: src/app/candidate/[id]/page.tsx)
async function getCandidateProfile(id: string) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*, candidates(*), achievements(*), events(*), ratings(rating)')
    .eq('id', id)
    .single();

  if (profileError) {
    console.error('Error fetching candidate profile:', profileError);
    return null;
  }

  const totalRating = profile.ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0);
  const averageRating = profile.ratings.length > 0 ? totalRating / profile.ratings.length : 0;

  return {
    id: profile.id,
    fullName: profile.full_name,
    occupation: profile.occupation,
    governorate: profile.governorate,
    legislativeBody: profile.candidates?.legislative_body,
    party: profile.candidates?.party,
    isIndependent: profile.candidates?.is_independent,
    electoralSymbol: profile.candidates?.electoral_symbol,
    electoralNumber: profile.candidates?.electoral_number,
    electoralDistrict: profile.candidates?.electoral_district,
    profileImage: profile.profile_image,
    bannerImage: profile.banner_image,
    rating: Math.round(averageRating),
    achievements: profile.achievements.map((a: any) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      date: a.date,
      image: a.image_url,
    })),
    events: profile.events.map((e: any) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.date,
      location: e.location,
      type: e.type,
      image: e.image_url,
    })),
  };
}

// في صفحة النائب الحالي (مثال: src/app/member/[id]/page.tsx)
async function getCurrentMemberProfile(id: string) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*, current_members(*), achievements(*), events(*), ratings(rating)')
    .eq('id', id)
    .single();

  if (profileError) {
    console.error('Error fetching current member profile:', profileError);
    return null;
  }

  const totalRating = profile.ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0);
  const averageRating = profile.ratings.length > 0 ? totalRating / profile.ratings.length : 0;

  return {
    id: profile.id,
    fullName: profile.full_name,
    occupation: profile.occupation,
    governorate: profile.governorate,
    legislativeBody: profile.current_members?.legislative_body,
    party: profile.current_members?.party,
    isIndependent: profile.current_members?.is_independent,
    parliamentaryCommittee: profile.current_members?.parliamentary_committees || [],
    electoralDistrict: profile.current_members?.electoral_district,
    profileImage: profile.profile_image,
    bannerImage: profile.banner_image,
    rating: Math.round(averageRating),
    achievements: profile.achievements.map((a: any) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      date: a.date,
      image: a.image_url,
    })),
    events: profile.events.map((e: any) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.date,
      location: e.location,
      type: e.type,
      image: e.image_url,
    })),
  };
}
```

## 6. ملاحظات هامة

*   **Row Level Security (RLS):** تم تمكين RLS لجميع الجداول. تأكد من مراجعة وتعديل السياسات (Policies) لتناسب متطلبات الأمان الخاصة بك.
*   **البيانات الوهمية:** بعد ربط المشروع بـ Supabase، ستحتاج إلى إزالة البيانات الوهمية (demo data) من المكونات والصفحات التجريبية واستبدالها ببيانات حقيقية من Supabase.
*   **التحقق من الأخطاء:** تأكد من إضافة معالجة الأخطاء المناسبة عند جلب البيانات من Supabase.
*   **التحميلات (Uploads):** استخدم Supabase Storage API لتحميل الصور إلى Buckets التي أنشأتها.

باتباع هذه الخطوات، ستكون قد أعددت البنية التحتية اللازمة في Supabase لدعم مشروع Next.js الخاص بك.
