# نماذج البيانات المطلوبة لمشروع Naebak

---

## 👤 **نموذج المستخدم (User)**

```python
class User:
    # البيانات الأساسية
    email: str (unique)
    password: str (hashed)
    first_name: str
    last_name: str
    phone_number: str (required, unique)  # وسيلة الاتصال الأساسية
    national_id: str (14 digits, unique)
    
    # نوع المستخدم
    user_type: str  # citizen, candidate, current_member, admin
    
    # الموقع (مطلوب)
    governorate: str (required)  # من قائمة 27 محافظة
    city: str
    address: str
    
    # المعلومات الإضافية
    gender: str  # male, female
    birth_date: date
    profile_picture: str (URL)
    
    # حالة الحساب
    is_verified: bool
    is_active: bool
    verification_token: str
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
    last_login: datetime
    
    # Google OAuth
    google_id: str (optional)
```

---

## 🏛️ **نموذج المرشح/النائب (Representative)**

```python
class Representative:
    # ربط بالمستخدم
    user: User (OneToOne)
    
    # البيانات السياسية
    party: Party (ForeignKey)  # من قائمة الأحزاب القابلة للتحديث
    constituency: str  # الدائرة الانتخابية
    electoral_number: str  # الرقم الانتخابي (اختياري)
    electoral_symbol: str  # الرمز الانتخابي (اختياري)
    
    # نوع العضوية والمجلس (مطلوب)
    membership_type: str (required)  # candidate, current_member
    council_type: str (required)  # parliament, senate
    
    # البيانات الشخصية
    bio: str (max 1000)
    electoral_program: str (max 2000)
    banner_image: str (URL)
    
    # الإحصائيات
    rating_average: float (1-5)
    rating_count: int
    solved_complaints: int
    received_complaints: int
    total_score: int
    
    # الحالة
    is_featured: bool  # مرشح مميز
    is_approved: bool  # موافقة الإدارة
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
    
    # وصف العضوية (محسوب)
    @property
    def membership_description(self):
        if self.membership_type == 'candidate':
            return f"مرشح لعضوية {self.get_council_display()}"
        else:
            return f"عضو {self.get_council_display()}"
    
    def get_council_display(self):
        return "مجلس النواب" if self.council_type == "parliament" else "مجلس الشيوخ"
```

---

## ⭐ **نموذج التقييم (Rating)**

```python
class Rating:
    # المقيم والمقيم
    citizen: User (ForeignKey)
    representative: Representative (ForeignKey)
    
    # التقييم
    stars: int (1-5)
    comment: str (max 200, optional)
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
    
    # فهرس فريد
    unique_together: (citizen, representative)
```

---

## 📨 **نموذج الرسالة (Message)**

```python
class Message:
    # المرسل والمستقبل
    sender: User (ForeignKey)
    recipient: User (ForeignKey)
    
    # محتوى الرسالة
    subject: str (max 100)
    content: str (max 500)
    
    # الحالة
    is_read: bool
    is_archived: bool
    
    # التواريخ
    sent_at: datetime
    read_at: datetime
    
    # الرد على رسالة
    parent_message: Message (ForeignKey, optional)
```

---

## 📋 **نموذج الشكوى (Complaint)**

```python
class Complaint:
    # صاحب الشكوى
    citizen: User (ForeignKey)
    
    # محتوى الشكوى
    title: str (max 200)
    content: str (max 1500)
    category: str  # من قائمة فئات الشكاوى
    
    # الموقع
    governorate: str
    city: str
    detailed_address: str (max 300)
    
    # الحالة
    status: str  # pending, under_review, assigned, resolved, rejected
    priority: str  # low, medium, high, urgent
    
    # التعيين
    assigned_to: Representative (ForeignKey, optional)
    assigned_at: datetime (optional)
    assigned_by: User (ForeignKey, optional)  # الإدارة
    
    # الحل
    resolution: str (max 1000, optional)
    resolved_at: datetime (optional)
    admin_notes: str (max 500, optional)
    
    # روابط إضافية
    youtube_link: str (optional)
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
```

---

## 📎 **نموذج مرفقات الشكوى (ComplaintFile)**

```python
class ComplaintFile:
    # الشكوى المرتبطة
    complaint: Complaint (ForeignKey)
    
    # الملف
    file: str (file path)
    original_name: str
    file_size: int (bytes)
    file_type: str  # pdf, doc, docx, jpg, jpeg, png, gif
    
    # التواريخ
    uploaded_at: datetime
```

---

## 🔔 **نموذج الإشعار (Notification)**

```python
class Notification:
    # المستقبل
    user: User (ForeignKey)
    
    # محتوى الإشعار
    title: str (max 100)
    message: str (max 300)
    type: str  # message, complaint, rating, system
    
    # الرابط المرتبط
    related_url: str (optional)
    related_id: int (optional)
    
    # الحالة
    is_read: bool
    is_sent: bool
    
    # التواريخ
    created_at: datetime
    read_at: datetime
```

---

## 🏛️ **نموذج المحافظة (Governorate)**

```python
class Governorate:
    name: str (unique)  # الاسم بالعربية
    name_en: str (unique)  # الاسم بالإنجليزية
    code: str (3 chars, unique)  # الكود المختصر
    
    # الإحصائيات
    population: int (optional)
    area: float (optional)
    
    # الحالة
    is_active: bool
```

---

## 🎉 **نموذج الحزب (Party)**

```python
class Party:
    name: str (unique)
    name_en: str (unique)
    abbreviation: str (max 10)
    
    # معلومات إضافية
    description: str (max 500, optional)
    website: str (optional)
    logo: str (URL, optional)
    
    # الحالة
    is_active: bool
    
    # التواريخ
    created_at: datetime
```

---

## 🏗️ **نموذج الإنجاز (Achievement)**

```python
class Achievement:
    # النائب المرتبط
    representative: Representative (ForeignKey)
    
    # الإنجاز
    title: str (max 200)
    description: str (max 1000)
    achievement_date: date
    
    # الموافقة
    is_approved: bool
    approved_by: User (ForeignKey, optional)  # الإدارة
    approved_at: datetime (optional)
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
```

---

## 🎪 **نموذج الفعالية (Event)**

```python
class Event:
    # النائب المرتبط
    representative: Representative (ForeignKey)
    
    # الفعالية
    title: str (max 200)
    description: str (max 1000)
    event_type: str  # conference, meeting, celebration, other
    event_date: date
    location: str (max 200)
    
    # الموافقة
    is_approved: bool
    approved_by: User (ForeignKey, optional)
    approved_at: datetime (optional)
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
```

---

## 📰 **نموذج الخبر (News)**

```python
class News:
    # محتوى الخبر
    content: str (max 300)
    
    # الحالة
    is_active: bool
    is_archived: bool
    
    # الترتيب
    order: int (للتحكم في ترتيب الظهور)
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
    published_at: datetime (optional)
```

---

## 🖼️ **نموذج البنر (Banner)**

```python
class Banner:
    # نوع البنر
    banner_type: str  # landing_page, representative_page
    
    # المالك (للبنرات الشخصية)
    owner: User (ForeignKey, optional)
    
    # الصورة
    image: str (file path)
    alt_text: str (max 100)
    
    # الحالة
    is_active: bool
    is_default: bool
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
```

---

## 🎨 **نموذج إعدادات الألوان (ColorSettings)**

```python
class ColorSettings:
    # اسم اللون
    color_name: str (unique)  # green, orange
    
    # قيمة اللون
    hex_value: str (7 chars)  # #28A745
    
    # الوصف
    description: str (max 100)
    
    # التواريخ
    updated_at: datetime
    updated_by: User (ForeignKey)  # الإدارة
```

---

## 📊 **نموذج عداد الزوار (VisitorCounter)**

```python
class VisitorCounter:
    # الإعدادات
    min_random: int  # الحد الأدنى للرقم العشوائي
    max_random: int  # الحد الأقصى للرقم العشوائي
    current_random: int  # الرقم العشوائي الحالي
    
    # العدادات
    real_visitors: int  # عدد الزوار الحقيقي
    displayed_count: int  # العدد المعروض
    
    # التواريخ
    last_updated: datetime
    next_update: datetime
```

---

## 🔗 **نموذج روابط التواصل (SocialLink)**

```python
class SocialLink:
    # المنصة
    platform: str  # facebook, twitter, instagram, youtube, linkedin
    
    # الرابط
    url: str (max 500)
    icon_class: str (max 50)  # CSS class للأيقونة
    
    # الحالة
    is_active: bool
    
    # الترتيب
    order: int
    
    # التواريخ
    updated_at: datetime
    updated_by: User (ForeignKey)  # الإدارة
```

---

## ⚙️ **نموذج إعدادات النظام (SystemSettings)**

```python
class SystemSettings:
    # المفتاح والقيمة
    key: str (unique)
    value: str
    setting_type: str  # string, integer, boolean, json
    
    # الوصف
    description: str (max 200)
    category: str (max 50)  # general, colors, counters, etc
    
    # الحالة
    is_public: bool  # هل يمكن عرضها للمستخدمين
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
    updated_by: User (ForeignKey)  # الإدارة
```

---

## 📈 **نموذج الإحصائيات (Statistics)**

```python
class Statistics:
    # نوع الإحصائية
    stat_type: str  # daily_visitors, total_users, total_complaints, etc
    
    # القيمة
    value: int
    date: date
    
    # معلومات إضافية
    metadata: str (JSON, optional)
    
    # التواريخ
    created_at: datetime
```
