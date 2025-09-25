# نماذج بيانات المستخدمين والشكاوى - User Data Models

> **ملاحظة:** تم نقل هذا الملف من `naebak_user_forms_models.md` وإعادة تسميته للتنظيم الأفضل

# نماذج بيانات المستخدمين والشكاوى - مشروع Naebak

---

## 👤 **نموذج بيانات المواطن (Citizen Profile)**

```python
class CitizenProfile:
    # ربط بالمستخدم الأساسي
    user: User (OneToOne)
    
    # البيانات الأساسية (مطلوبة)
    first_name: str (required, max 50)
    last_name: str (required, max 50)
    email: str (required, unique)
    phone_number: str (required, unique, format: +201xxxxxxxxx)
    whatsapp_number: str (optional, format: +201xxxxxxxxx)
    
    # الموقع (مطلوب)
    governorate: str (required)  # من قائمة 27 محافظة
    city: str (required, max 100)
    district: str (optional, max 100)  # الحي
    street_address: str (required, max 200)  # العنوان التفصيلي
    postal_code: str (optional, max 10)
    
    # البيانات الشخصية
    national_id: str (required, 14 digits, unique)
    gender: str (required)  # male, female
    birth_date: date (required)
    marital_status: str (optional)  # single, married, divorced, widowed
    
    # معلومات إضافية
    occupation: str (optional, max 100)
    education_level: str (optional)  # primary, secondary, university, postgraduate
    profile_picture: str (URL, optional)
    
    # إعدادات الخصوصية
    show_phone_public: bool (default=False)
    show_address_public: bool (default=False)
    allow_messages: bool (default=True)
    
    # الحالة
    is_verified: bool (default=False)
    verification_method: str  # phone, email, national_id
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
    last_active: datetime
    
    # إحصائيات
    messages_sent: int (default=0)
    complaints_submitted: int (default=0)
    ratings_given: int (default=0)
    
    def get_full_address(self):
        return f"{self.street_address}, {self.city}, {self.governorate}"
    
    def get_display_name(self):
        return f"{self.first_name} {self.last_name}"
```

---

## 🏛️ **نموذج بيانات المرشح (Candidate Profile)**

```python
class CandidateProfile:
    # ربط بالمستخدم الأساسي
    user: User (OneToOne)
    
    # البيانات الأساسية (مطلوبة) - نفس المواطن
    first_name: str (required, max 50)
    last_name: str (required, max 50)
    email: str (required, unique)
    phone_number: str (required, unique)
    whatsapp_number: str (optional)
    
    # الموقع (مطلوب)
    governorate: str (required)
    city: str (required)
    district: str (optional)
    street_address: str (required)
    
    # البيانات الشخصية
    national_id: str (required, 14 digits, unique)
    gender: str (required)
    birth_date: date (required)
    marital_status: str (optional)
    
    # البيانات السياسية (مطلوبة للمرشح)
    council_type: str (required)  # parliament, senate
    party: Party (ForeignKey, required)
    constituency: str (required, max 100)  # الدائرة الانتخابية
    electoral_number: str (required, max 20)  # الرقم الانتخابي
    electoral_symbol: str (required, max 50)  # الرمز الانتخابي
    
    # معلومات المرشح
    bio: str (max 1000)  # السيرة الذاتية
    electoral_program: str (max 2000)  # البرنامج الانتخابي
    education: str (max 200)  # المؤهل العلمي
    occupation: str (max 100)  # المهنة
    experience: str (max 1000)  # الخبرات السابقة
    
    # الصور والملفات
    profile_picture: str (URL, required)
    banner_image: str (URL, optional)
    cv_document: str (URL, optional)  # السيرة الذاتية PDF
    
    # إعدادات الحملة
    campaign_slogan: str (max 200, optional)  # شعار الحملة
    campaign_website: str (URL, optional)
    campaign_facebook: str (URL, optional)
    campaign_twitter: str (URL, optional)
    
    # الحالة
    is_approved: bool (default=False)  # موافقة الإدارة
    approval_date: datetime (optional)
    approved_by: User (ForeignKey, optional)  # الإدارة التي وافقت
    
    # إحصائيات
    rating_average: float (default=0.0)
    rating_count: int (default=0)
    messages_received: int (default=0)
    complaints_assigned: int (default=0)
    complaints_solved: int (default=0)
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
    
    def get_membership_description(self):
        council_name = "مجلس النواب" if self.council_type == "parliament" else "مجلس الشيوخ"
        return f"مرشح لعضوية {council_name}"
    
    def get_electoral_info(self):
        return f"رقم {self.electoral_number} - رمز {self.electoral_symbol}"
```

---

## 🏛️ **نموذج بيانات العضو الحالي (Current Member Profile)**

```python
class CurrentMemberProfile:
    # ربط بالمستخدم الأساسي
    user: User (OneToOne)
    
    # البيانات الأساسية (مطلوبة) - نفس المواطن والمرشح
    first_name: str (required, max 50)
    last_name: str (required, max 50)
    email: str (required, unique)
    phone_number: str (required, unique)
    whatsapp_number: str (optional)
    
    # الموقع (مطلوب)
    governorate: str (required)
    city: str (required)
    district: str (optional)
    street_address: str (required)
    
    # البيانات الشخصية
    national_id: str (required, 14 digits, unique)
    gender: str (required)
    birth_date: date (required)
    marital_status: str (optional)
    
    # البيانات السياسية (للعضو الحالي)
    council_type: str (required)  # parliament, senate
    party: Party (ForeignKey, required)
    constituency: str (required, max 100)  # الدائرة الانتخابية
    
    # معلومات العضوية (بدون رقم أو رمز انتخابي)
    membership_start_date: date (required)  # تاريخ بداية العضوية
    term_number: int (required)  # رقم الدورة
    seat_number: str (optional, max 10)  # رقم المقعد في المجلس
    
    # اللجان والمناصب
    committees: str (max 500, optional)  # اللجان المشارك فيها
    positions: str (max 300, optional)  # المناصب الحالية
    
    # معلومات العضو
    bio: str (max 1000)
    achievements: str (max 2000)  # الإنجازات
    education: str (max 200)
    occupation: str (max 100)
    experience: str (max 1000)
    
    # الصور والملفات
    profile_picture: str (URL, required)
    banner_image: str (URL, optional)
    official_cv: str (URL, optional)
    
    # إعدادات المكتب
    office_address: str (max 300, optional)  # عنوان المكتب
    office_phone: str (optional)
    office_hours: str (max 200, optional)  # ساعات العمل
    
    # الحالة
    is_active: bool (default=True)  # نشط في المجلس
    
    # إحصائيات
    rating_average: float (default=0.0)
    rating_count: int (default=0)
    messages_received: int (default=0)
    complaints_assigned: int (default=0)
    complaints_solved: int (default=0)
    laws_proposed: int (default=0)  # القوانين المقترحة
    sessions_attended: int (default=0)  # الجلسات المحضورة
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
    
    def get_membership_description(self):
        council_name = "مجلس النواب" if self.council_type == "parliament" else "مجلس الشيوخ"
        return f"عضو {council_name}"
    
    def get_term_info(self):
        return f"الدورة {self.term_number} - منذ {self.membership_start_date.year}"
```

---

## 📋 **نموذج أنواع الشكاوى (Complaint Types)**

```python
class ComplaintType:
    # البيانات الأساسية
    name: str (required, max 100)  # اسم نوع الشكوى
    name_en: str (max 100)  # الاسم بالإنجليزية
    description: str (max 300)  # وصف النوع
    
    # التصنيف
    category: str (required)  # infrastructure, health, education, security, etc.
    priority_level: str (default='medium')  # low, medium, high, urgent
    
    # المجلس المختص
    target_council: str (required)  # parliament, senate, both
    
    # معلومات إضافية
    icon: str (max 50)  # أيقونة النوع
    color: str (max 7)  # لون مميز (#hex)
    
    # إعدادات المعالجة
    requires_attachments: bool (default=False)  # يتطلب مرفقات
    max_attachments: int (default=5)  # الحد الأقصى للمرفقات
    estimated_resolution_days: int (default=30)  # الأيام المتوقعة للحل
    
    # الحالة
    is_active: bool (default=True)
    is_public: bool (default=True)  # ظاهر للمواطنين
    
    # إحصائيات
    total_complaints: int (default=0)
    resolved_complaints: int (default=0)
    average_resolution_time: float (default=0.0)  # بالأيام
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
    created_by: User (ForeignKey)  # الإدارة
    
    def get_resolution_rate(self):
        if self.total_complaints == 0:
            return 0
        return (self.resolved_complaints / self.total_complaints) * 100
```

---

## 📋 **نموذج الشكوى المحدث (Enhanced Complaint)**

```python
class Complaint:
    # البيانات الأساسية
    title: str (required, max 200)  # عنوان الشكوى
    description: str (required, max 1500)  # وصف الشكوى
    
    # التصنيف
    complaint_type: ComplaintType (ForeignKey, required)  # نوع الشكوى
    priority: str (default='medium')  # low, medium, high, urgent
    
    # المواقع
    complainant: User (ForeignKey)  # المشتكي
    assigned_to: User (ForeignKey, optional)  # النائب المعين
    
    # الموقع الجغرافي
    governorate: str (required)  # محافظة الشكوى
    city: str (required)  # المدينة
    district: str (optional)  # الحي
    detailed_location: str (max 300)  # الموقع التفصيلي
    
    # معلومات إضافية
    contact_phone: str (optional)  # رقم للتواصل
    preferred_contact_time: str (optional)  # الوقت المفضل للتواصل
    
    # المرفقات
    attachments: List[ComplaintAttachment]  # قائمة المرفقات
    youtube_link: str (URL, optional)  # رابط يوتيوب
    
    # الحالة والمتابعة
    status: str (default='pending')  # pending, under_review, assigned, resolved, rejected
    admin_notes: str (max 1000, optional)  # ملاحظات الإدارة
    resolution_notes: str (max 1000, optional)  # ملاحظات الحل
    
    # التقييم
    complainant_satisfaction: int (optional, 1-5)  # تقييم المشتكي للحل
    satisfaction_comment: str (max 500, optional)
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
    assigned_at: datetime (optional)
    resolved_at: datetime (optional)
    
    # إحصائيات
    views_count: int (default=0)
    updates_count: int (default=0)
    
    def get_age_in_days(self):
        return (timezone.now() - self.created_at).days
    
    def is_overdue(self):
        expected_days = self.complaint_type.estimated_resolution_days
        return self.get_age_in_days() > expected_days and self.status != 'resolved'
```

---

## 📎 **نموذج مرفقات الشكوى (Complaint Attachments)**

```python
class ComplaintAttachment:
    complaint: Complaint (ForeignKey)
    
    # معلومات الملف
    file_name: str (required, max 255)
    file_path: str (required)  # مسار الملف
    file_size: int (required)  # حجم الملف بالبايت
    file_type: str (required, max 50)  # نوع الملف
    mime_type: str (required, max 100)
    
    # وصف الملف
    description: str (max 200, optional)  # وصف المرفق
    
    # الحالة
    is_verified: bool (default=False)  # تم التحقق من الملف
    verified_by: User (ForeignKey, optional)
    
    # التواريخ
    uploaded_at: datetime
    verified_at: datetime (optional)
    
    def get_file_size_mb(self):
        return round(self.file_size / (1024 * 1024), 2)
```

---

## ⚙️ **نموذج إعدادات أنواع الشكاوى (Complaint Type Settings)**

```python
class ComplaintTypeSettings:
    # إعدادات عامة
    max_complaint_types: int (default=50)
    allow_custom_types: bool (default=False)  # السماح بأنواع مخصصة
    require_type_selection: bool (default=True)  # إجبارية اختيار النوع
    
    # إعدادات المرفقات
    max_file_size_mb: int (default=10)
    allowed_file_types: str (default='pdf,doc,docx,jpg,jpeg,png,gif')
    max_total_attachments_size_mb: int (default=50)
    
    # إعدادات التوجيه التلقائي
    auto_assign_enabled: bool (default=True)
    auto_assign_by_location: bool (default=True)
    auto_assign_by_type: bool (default=True)
    
    # التواريخ
    updated_at: datetime
    updated_by: User (ForeignKey)
```

---

## 📊 **البيانات الأولية لأنواع الشكاوى**

```json
{
  "parliament_complaint_types": [
    {
      "name": "البنية التحتية والطرق",
      "name_en": "Infrastructure and Roads",
      "category": "infrastructure",
      "target_council": "parliament",
      "icon": "🛣️",
      "color": "#FF6B35",
      "estimated_resolution_days": 45,
      "requires_attachments": true
    },
    {
      "name": "الخدمات الصحية",
      "name_en": "Health Services", 
      "category": "health",
      "target_council": "parliament",
      "icon": "🏥",
      "color": "#28A745",
      "estimated_resolution_days": 30
    },
    {
      "name": "التعليم والجامعات",
      "name_en": "Education and Universities",
      "category": "education", 
      "target_council": "parliament",
      "icon": "🎓",
      "color": "#007BFF",
      "estimated_resolution_days": 60
    },
    {
      "name": "الأمن والشرطة",
      "name_en": "Security and Police",
      "category": "security",
      "target_council": "parliament", 
      "icon": "🛡️",
      "color": "#DC3545",
      "estimated_resolution_days": 15,
      "priority_level": "high"
    },
    {
      "name": "الخدمات العامة",
      "name_en": "Public Services",
      "category": "public_services",
      "target_council": "parliament",
      "icon": "🏛️", 
      "color": "#6F42C1",
      "estimated_resolution_days": 30
    },
    {
      "name": "النقل والمواصلات",
      "name_en": "Transportation",
      "category": "transportation",
      "target_council": "parliament",
      "icon": "🚌",
      "color": "#FFC107",
      "estimated_resolution_days": 45
    },
    {
      "name": "البيئة والنظافة",
      "name_en": "Environment and Cleanliness", 
      "category": "environment",
      "target_council": "parliament",
      "icon": "🌱",
      "color": "#20C997",
      "estimated_resolution_days": 30
    },
    {
      "name": "الإسكان والعقارات",
      "name_en": "Housing and Real Estate",
      "category": "housing",
      "target_council": "parliament",
      "icon": "🏠",
      "color": "#E83E8C",
      "estimated_resolution_days": 60
    }
  ],
  "senate_complaint_types": [
    {
      "name": "القوانين والتشريعات",
      "name_en": "Laws and Legislation",
      "category": "legislation",
      "target_council": "senate",
      "icon": "⚖️",
      "color": "#6C757D",
      "estimated_resolution_days": 90
    },
    {
      "name": "الشؤون الدستورية",
      "name_en": "Constitutional Affairs", 
      "category": "constitutional",
      "target_council": "senate",
      "icon": "📜",
      "color": "#495057",
      "estimated_resolution_days": 120
    },
    {
      "name": "السياسة الخارجية",
      "name_en": "Foreign Policy",
      "category": "foreign_policy", 
      "target_council": "senate",
      "icon": "🌍",
      "color": "#17A2B8",
      "estimated_resolution_days": 60
    },
    {
      "name": "الشؤون الاقتصادية",
      "name_en": "Economic Affairs",
      "category": "economic",
      "target_council": "senate",
      "icon": "💰",
      "color": "#FD7E14",
      "estimated_resolution_days": 75
    }
  ],
  "both_councils_types": [
    {
      "name": "حقوق الإنسان",
      "name_en": "Human Rights",
      "category": "human_rights",
      "target_council": "both",
      "icon": "✊",
      "color": "#E74C3C",
      "estimated_resolution_days": 45,
      "priority_level": "high"
    },
    {
      "name": "شكوى عامة",
      "name_en": "General Complaint",
      "category": "general",
      "target_council": "both", 
      "icon": "📝",
      "color": "#ADB5BD",
      "estimated_resolution_days": 30
    }
  ]
}
```

---

## 🛡️ **نموذج صلاحيات الإدارة (Admin Permissions)**

```python
class AdminPermissions:
    admin_user: User (ForeignKey)
    
    # صلاحيات إدارة المستخدمين
    can_manage_citizens: bool (default=True)
    can_manage_candidates: bool (default=True) 
    can_manage_members: bool (default=True)
    can_approve_registrations: bool (default=True)
    
    # صلاحيات إدارة الأحزاب
    can_add_parties: bool (default=True)
    can_edit_parties: bool (default=True)
    can_delete_parties: bool (default=True)
    can_manage_party_members: bool (default=False)
    
    # صلاحيات إدارة الشكاوى
    can_manage_complaint_types: bool (default=True)
    can_assign_complaints: bool (default=True)
    can_resolve_complaints: bool (default=False)
    can_delete_complaints: bool (default=False)
    
    # صلاحيات النظام
    can_manage_settings: bool (default=False)
    can_view_statistics: bool (default=True)
    can_export_data: bool (default=False)
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
    granted_by: User (ForeignKey)  # من منح الصلاحيات
```
