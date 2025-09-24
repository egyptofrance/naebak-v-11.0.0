# مواصفات APIs المحدثة - مشروع Naebak

---

## 🔐 **خدمة المصادقة (Auth Service) - محدثة**

### المنفذ: 8001
### قاعدة البيانات: PostgreSQL

#### **POST /api/auth/register**
تسجيل مستخدم جديد مع التحديثات

```json
// الطلب
{
  "email": "ahmed@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "first_name": "أحمد",
  "last_name": "محمد",
  "phone_number": "+201234567890",  // مطلوب
  "national_id": "12345678901234",
  "user_type": "candidate",  // citizen, candidate, current_member
  "governorate": "القاهرة",  // مطلوب
  "city": "مدينة نصر",
  "gender": "male",
  "birth_date": "1980-01-01",
  
  // للمرشح/النائب فقط
  "council_type": "parliament",  // parliament, senate
  "membership_type": "candidate",  // candidate, current_member
  "party_id": 1,  // ID الحزب
  "constituency": "القاهرة الأولى",
  "electoral_number": "123",
  "electoral_symbol": "الميزان",
  
  "agree_terms": true,
  "agree_privacy": true
}

// الاستجابة
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "user": {
    "id": 1,
    "email": "ahmed@example.com",
    "full_name": "أحمد محمد",
    "user_type": "candidate",
    "phone_number": "+201234567890",
    "governorate": "القاهرة",
    "membership_description": "مرشح لعضوية مجلس النواب"
  },
  "verification_required": true
}
```

#### **GET /api/auth/user-types**
الحصول على أنواع المستخدمين

```json
// الاستجابة
{
  "user_types": [
    {
      "type": "citizen",
      "name": "مواطن",
      "name_en": "Citizen",
      "description": "مواطن له صوت انتخابي",
      "required_fields": ["phone_number", "governorate"]
    },
    {
      "type": "candidate",
      "name": "مرشح",
      "name_en": "Candidate", 
      "description": "مرشح لعضوية مجلس الشيوخ أو النواب",
      "required_fields": ["phone_number", "governorate", "council_type", "party"]
    }
  ]
}
```

---

## 🏛️ **خدمة الأحزاب (Parties Service) - جديدة**

### المنفذ: 8015
### قاعدة البيانات: PostgreSQL

#### **GET /api/parties**
الحصول على قائمة الأحزاب

```json
// الاستجابة
{
  "parties": [
    {
      "id": 1,
      "name": "حزب الوفد",
      "name_en": "Al-Wafd Party",
      "abbreviation": "الوفد",
      "description": "حزب سياسي مصري",
      "website": "https://alwafd.org",
      "logo": "https://example.com/logos/wafd.png",
      "is_active": true,
      "members_count": 45,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 16,
  "page": 1,
  "per_page": 20
}
```

#### **POST /api/parties** (Admin only)
إضافة حزب جديد

```json
// الطلب
{
  "name": "حزب جديد",
  "name_en": "New Party",
  "abbreviation": "جديد",
  "description": "وصف الحزب",
  "website": "https://newparty.com",
  "logo": "base64_image_data"
}

// الاستجابة
{
  "success": true,
  "message": "تم إضافة الحزب بنجاح",
  "party": {
    "id": 17,
    "name": "حزب جديد",
    "name_en": "New Party",
    "abbreviation": "جديد",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### **DELETE /api/parties/{id}** (Admin only)
حذف حزب

```json
// الاستجابة
{
  "success": true,
  "message": "تم حذف الحزب بنجاح",
  "affected_members": 12  // عدد الأعضاء المتأثرين
}
```

#### **GET /api/parties/{id}/statistics**
إحصائيات الحزب

```json
// الاستجابة
{
  "party": {
    "id": 1,
    "name": "حزب الوفد"
  },
  "statistics": {
    "total_members": 45,
    "candidates_count": 30,
    "current_members_count": 15,
    "average_rating": 4.2,
    "total_ratings": 1250,
    "total_solved_complaints": 89,
    "total_received_complaints": 120,
    "governorates_coverage": 18,
    "calculated_at": "2024-01-15T12:00:00Z"
  }
}
```

---

## 🔍 **خدمة البحث والفلترة (Search Service) - محدثة**

### المنفذ: 8016
### قاعدة البيانات: Redis + PostgreSQL

#### **GET /api/search/representatives**
البحث في المرشحين مع الفلاتر الجديدة

```json
// المعاملات
{
  "search_name": "أحمد",  // البحث بالاسم
  "gender": "male",  // male, female
  "party_id": 1,  // ID الحزب
  "council_type": "parliament",  // parliament, senate
  "membership_type": "candidate",  // candidate, current_member
  "governorate": "القاهرة",
  "min_rating": 4.0,
  "is_featured": true,
  "order_by": "rating_average",  // rating_average, name, created_at
  "order_direction": "desc",  // asc, desc
  "page": 1,
  "per_page": 12
}

// الاستجابة
{
  "representatives": [
    {
      "id": 1,
      "user": {
        "first_name": "أحمد",
        "last_name": "محمد",
        "profile_picture": "https://example.com/profiles/1.jpg",
        "gender": "male",
        "governorate": "القاهرة"
      },
      "party": {
        "id": 1,
        "name": "حزب الوفد",
        "abbreviation": "الوفد"
      },
      "council_type": "parliament",
      "membership_type": "candidate",
      "membership_description": "مرشح لعضوية مجلس النواب",
      "constituency": "القاهرة الأولى",
      "electoral_number": "123",
      "electoral_symbol": "الميزان",
      "rating_average": 4.5,
      "rating_count": 5550,
      "solved_complaints": 45,
      "received_complaints": 60,
      "is_featured": true,
      "slug": "أحمد-محمد-علي"
    }
  ],
  "filters_applied": {
    "search_name": "أحمد",
    "council_type": "parliament",
    "membership_type": "candidate"
  },
  "total": 156,
  "page": 1,
  "per_page": 12,
  "total_pages": 13
}
```

#### **GET /api/search/filters/options**
الحصول على خيارات الفلاتر

```json
// الاستجابة
{
  "parties": [
    {"id": 1, "name": "حزب الوفد", "members_count": 45},
    {"id": 2, "name": "حزب الغد", "members_count": 32}
  ],
  "councils": [
    {"type": "parliament", "name": "مجلس النواب", "members_count": 350},
    {"type": "senate", "name": "مجلس الشيوخ", "members_count": 180}
  ],
  "membership_types": [
    {"type": "candidate", "name": "مرشح", "count": 400},
    {"type": "current_member", "name": "عضو حالي", "count": 130}
  ],
  "governorates": [
    {"name": "القاهرة", "members_count": 85},
    {"name": "الجيزة", "members_count": 67}
  ],
  "genders": [
    {"type": "male", "name": "ذكر", "count": 420},
    {"type": "female", "name": "أنثى", "count": 110}
  ]
}
```

---

## 📱 **خدمة الإعدادات المتجاوبة (Responsive Service) - جديدة**

### المنفذ: 8017
### قاعدة البيانات: Redis

#### **GET /api/responsive/mobile-settings**
إعدادات العرض للموبايل

```json
// الاستجابة
{
  "filters": {
    "default_collapsed": true,
    "max_visible": 3,
    "show_search_first": true
  },
  "cards": {
    "per_row_mobile": 1,
    "per_row_tablet": 2,
    "per_row_desktop": 3,
    "card_height": "auto"
  },
  "interactions": {
    "enable_swipe": true,
    "enable_pull_refresh": true,
    "enable_infinite_scroll": false
  },
  "breakpoints": {
    "mobile": 768,
    "tablet": 1024,
    "desktop": 1200
  }
}
```

#### **POST /api/responsive/user-preferences**
حفظ تفضيلات المستخدم

```json
// الطلب
{
  "user_id": 1,
  "preferred_view": "grid",  // grid, list
  "filters_collapsed": false,
  "cards_per_page": 12,
  "default_order": "rating_average"
}

// الاستجابة
{
  "success": true,
  "message": "تم حفظ التفضيلات",
  "preferences": {
    "user_id": 1,
    "preferred_view": "grid",
    "filters_collapsed": false,
    "updated_at": "2024-01-15T14:30:00Z"
  }
}
```

---

## 📊 **خدمة الإحصائيات المتقدمة (Advanced Statistics) - محدثة**

### المنفذ: 8018
### قاعدة البيانات: PostgreSQL + Redis

#### **GET /api/statistics/parties-overview**
نظرة عامة على الأحزاب

```json
// الاستجابة
{
  "overview": {
    "total_parties": 16,
    "active_parties": 15,
    "total_members": 530,
    "average_members_per_party": 33.1
  },
  "top_parties": [
    {
      "party": {
        "id": 1,
        "name": "حزب الوفد",
        "logo": "https://example.com/logos/wafd.png"
      },
      "members_count": 45,
      "average_rating": 4.3,
      "coverage_percentage": 67.0
    }
  ],
  "distribution": {
    "by_council": {
      "parliament": 350,
      "senate": 180
    },
    "by_membership": {
      "candidates": 400,
      "current_members": 130
    },
    "by_gender": {
      "male": 420,
      "female": 110
    }
  }
}
```

#### **GET /api/statistics/councils-comparison**
مقارنة المجالس

```json
// الاستجابة
{
  "parliament": {
    "total_members": 350,
    "candidates": 250,
    "current_members": 100,
    "average_rating": 4.2,
    "total_complaints_solved": 1250,
    "coverage": {
      "governorates": 27,
      "percentage": 100
    }
  },
  "senate": {
    "total_members": 180,
    "candidates": 150,
    "current_members": 30,
    "average_rating": 4.1,
    "total_complaints_solved": 680,
    "coverage": {
      "governorates": 25,
      "percentage": 92.6
    }
  },
  "comparison": {
    "parliament_advantage": ["أكثر تمثيلاً", "تغطية أوسع"],
    "senate_advantage": ["تخصص أعلى", "خبرة أكثر"]
  }
}
```

---

## 🔔 **خدمة الإشعارات المحدثة (Notifications Service)**

### المنفذ: 8008

#### **POST /api/notifications/party-updates**
إشعارات تحديثات الأحزاب

```json
// الطلب
{
  "type": "party_added",  // party_added, party_removed, party_updated
  "party_id": 17,
  "message": "تم إضافة حزب جديد: حزب المستقبل",
  "target_users": ["admin", "all_representatives"]
}

// الاستجابة
{
  "success": true,
  "notification_id": "notif_123456",
  "sent_to": 45,
  "message": "تم إرسال الإشعار بنجاح"
}
```

#### **GET /api/notifications/filter-updates**
إشعارات تحديثات الفلاتر

```json
// الاستجابة
{
  "notifications": [
    {
      "id": "notif_789",
      "type": "filter_suggestion",
      "title": "فلتر مقترح",
      "message": "يمكنك تصفية المرشحين حسب المجلس الآن",
      "action_url": "/representatives?council_type=parliament",
      "created_at": "2024-01-15T16:00:00Z",
      "is_read": false
    }
  ]
}
```

---

## 🛡️ **خدمة التحقق والأمان المحدثة (Validation Service)**

### المنفذ: 8019
### قاعدة البيانات: Redis

#### **POST /api/validation/phone-number**
التحقق من رقم الهاتف

```json
// الطلب
{
  "phone_number": "+201234567890",
  "country_code": "EG"
}

// الاستجابة
{
  "is_valid": true,
  "formatted": "+201234567890",
  "carrier": "Vodafone Egypt",
  "is_mobile": true,
  "is_available": true  // غير مستخدم من قبل
}
```

#### **POST /api/validation/registration-data**
التحقق من بيانات التسجيل

```json
// الطلب
{
  "user_type": "candidate",
  "council_type": "parliament",
  "party_id": 1,
  "governorate": "القاهرة",
  "constituency": "القاهرة الأولى"
}

// الاستجابة
{
  "is_valid": true,
  "warnings": [
    "يوجد 5 مرشحين آخرين في نفس الدائرة"
  ],
  "suggestions": [
    "يمكنك اختيار دائرة أخرى في نفس المحافظة"
  ],
  "party_status": {
    "is_active": true,
    "accepts_new_members": true,
    "current_members_count": 45
  }
}
```

---

## 📈 **خدمة التحليلات المتقدمة (Analytics Service) - جديدة**

### المنفذ: 8020
### قاعدة البيانات: PostgreSQL + ClickHouse

#### **GET /api/analytics/user-registration-trends**
اتجاهات التسجيل

```json
// الاستجابة
{
  "period": "last_30_days",
  "trends": [
    {
      "date": "2024-01-01",
      "citizens": 25,
      "candidates": 8,
      "current_members": 2,
      "total": 35
    }
  ],
  "summary": {
    "total_registrations": 1050,
    "growth_rate": 15.2,
    "most_active_governorate": "القاهرة",
    "most_popular_council": "parliament"
  }
}
```

#### **GET /api/analytics/filter-usage**
استخدام الفلاتر

```json
// الاستجابة
{
  "most_used_filters": [
    {"filter": "governorate", "usage_count": 15420, "percentage": 78.5},
    {"filter": "council_type", "usage_count": 12350, "percentage": 62.8},
    {"filter": "party", "usage_count": 9870, "percentage": 50.2}
  ],
  "filter_combinations": [
    {
      "combination": ["governorate", "council_type"],
      "usage_count": 8500,
      "effectiveness": 85.2
    }
  ],
  "recommendations": [
    "إضافة فلتر سريع للمرشحين المميزين",
    "تحسين فلتر البحث بالاسم"
  ]
}
```
