# APIs إدارة البيانات - مشروع Naebak

---

## 🛡️ **خدمة إدارة المستخدمين (User Management Service)**

### المنفذ: 8021
### قاعدة البيانات: PostgreSQL

#### **GET /api/admin/users**
عرض جميع المستخدمين مع الفلترة

```json
// المعاملات
{
  "user_type": "citizen",  // citizen, candidate, current_member, admin
  "governorate": "القاهرة",
  "is_verified": true,
  "is_active": true,
  "search": "أحمد",
  "page": 1,
  "per_page": 20
}

// الاستجابة
{
  "users": [
    {
      "id": 1,
      "full_name": "أحمد محمد علي",
      "email": "ahmed@example.com",
      "phone_number": "+201234567890",
      "user_type": "citizen",
      "governorate": "القاهرة",
      "city": "مدينة نصر",
      "is_verified": true,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-01-15T10:30:00Z",
      "profile_completion": 85
    }
  ],
  "total": 1250,
  "page": 1,
  "per_page": 20,
  "total_pages": 63
}
```

#### **GET /api/admin/users/{id}**
عرض تفاصيل مستخدم محدد

```json
// الاستجابة
{
  "user": {
    "id": 1,
    "basic_info": {
      "first_name": "أحمد",
      "last_name": "محمد",
      "email": "ahmed@example.com",
      "phone_number": "+201234567890",
      "whatsapp_number": "+201234567890",
      "national_id": "12345678901234"
    },
    "location": {
      "governorate": "القاهرة",
      "city": "مدينة نصر",
      "district": "الحي السابع",
      "street_address": "شارع مصطفى النحاس",
      "postal_code": "11471"
    },
    "personal_info": {
      "gender": "male",
      "birth_date": "1985-05-15",
      "marital_status": "married",
      "occupation": "مهندس",
      "education_level": "university"
    },
    "political_info": {  // للمرشح/العضو فقط
      "council_type": "parliament",
      "membership_type": "candidate",
      "party": {
        "id": 1,
        "name": "حزب الوفد"
      },
      "constituency": "القاهرة الأولى",
      "electoral_number": "123",
      "electoral_symbol": "الميزان"
    },
    "statistics": {
      "messages_sent": 12,
      "complaints_submitted": 3,
      "ratings_given": 8,
      "profile_completion": 85
    },
    "account_status": {
      "is_verified": true,
      "is_active": true,
      "verification_method": "phone",
      "created_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### **PUT /api/admin/users/{id}**
تعديل بيانات مستخدم

```json
// الطلب
{
  "basic_info": {
    "first_name": "أحمد",
    "last_name": "محمد علي",
    "phone_number": "+201234567891"
  },
  "location": {
    "governorate": "الجيزة",
    "city": "الدقي"
  },
  "account_status": {
    "is_verified": true,
    "is_active": true
  }
}

// الاستجابة
{
  "success": true,
  "message": "تم تحديث بيانات المستخدم بنجاح",
  "updated_fields": ["phone_number", "governorate", "city"],
  "user": {
    "id": 1,
    "full_name": "أحمد محمد علي",
    "updated_at": "2024-01-15T14:30:00Z"
  }
}
```

#### **DELETE /api/admin/users/{id}**
حذف مستخدم

```json
// الاستجابة
{
  "success": true,
  "message": "تم حذف المستخدم بنجاح",
  "affected_data": {
    "messages": 12,
    "complaints": 3,
    "ratings": 8
  },
  "backup_created": true,
  "backup_id": "backup_user_1_20240115"
}
```

---

## 🎉 **خدمة إدارة الأحزاب (Party Management Service)**

### المنفذ: 8022
### قاعدة البيانات: PostgreSQL

#### **GET /api/admin/parties**
عرض جميع الأحزاب

```json
// الاستجابة
{
  "parties": [
    {
      "id": 1,
      "name": "حزب الوفد",
      "name_en": "Al-Wafd Party",
      "abbreviation": "الوفد",
      "description": "حزب سياسي مصري تأسس عام 1919",
      "website": "https://alwafd.org",
      "logo": "https://example.com/logos/wafd.png",
      "is_active": true,
      "members_count": 45,
      "candidates_count": 30,
      "current_members_count": 15,
      "average_rating": 4.2,
      "created_at": "2024-01-01T00:00:00Z",
      "created_by": {
        "id": 100,
        "name": "الإدارة العامة"
      }
    }
  ],
  "statistics": {
    "total_parties": 16,
    "active_parties": 15,
    "total_members": 530,
    "parties_added_this_month": 2
  }
}
```

#### **POST /api/admin/parties**
إضافة حزب جديد

```json
// الطلب
{
  "name": "حزب المستقبل",
  "name_en": "Future Party",
  "abbreviation": "المستقبل",
  "description": "حزب سياسي يهدف لبناء مستقبل أفضل",
  "website": "https://future-party.com",
  "logo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}

// الاستجابة
{
  "success": true,
  "message": "تم إضافة الحزب بنجاح",
  "party": {
    "id": 17,
    "name": "حزب المستقبل",
    "name_en": "Future Party",
    "abbreviation": "المستقبل",
    "is_active": true,
    "members_count": 0,
    "logo_url": "https://example.com/logos/future.png",
    "created_at": "2024-01-15T15:00:00Z"
  },
  "next_steps": [
    "يمكن الآن للمرشحين الانضمام للحزب",
    "تحديث قوائم الفلاتر تلقائياً"
  ]
}
```

#### **PUT /api/admin/parties/{id}**
تعديل بيانات حزب

```json
// الطلب
{
  "name": "حزب الوفد الجديد",
  "description": "وصف محدث للحزب",
  "website": "https://new-wafd.org",
  "is_active": true
}

// الاستجابة
{
  "success": true,
  "message": "تم تحديث بيانات الحزب بنجاح",
  "party": {
    "id": 1,
    "name": "حزب الوفد الجديد",
    "updated_at": "2024-01-15T15:30:00Z"
  },
  "affected_members": 45
}
```

#### **DELETE /api/admin/parties/{id}**
حذف حزب

```json
// الطلب (تأكيد)
{
  "confirm_deletion": true,
  "transfer_members_to_party_id": 16,  // نقل الأعضاء لحزب آخر (اختياري)
  "reason": "دمج مع حزب آخر"
}

// الاستجابة
{
  "success": true,
  "message": "تم حذف الحزب بنجاح",
  "deleted_party": {
    "id": 5,
    "name": "الحزب المحذوف"
  },
  "affected_members": 12,
  "members_transferred": 12,
  "transferred_to": {
    "id": 16,
    "name": "مستقل"
  },
  "backup_created": true
}
```

#### **GET /api/admin/parties/{id}/members**
عرض أعضاء حزب محدد

```json
// الاستجابة
{
  "party": {
    "id": 1,
    "name": "حزب الوفد"
  },
  "members": [
    {
      "id": 10,
      "full_name": "أحمد محمد علي",
      "membership_type": "candidate",
      "council_type": "parliament",
      "constituency": "القاهرة الأولى",
      "governorate": "القاهرة",
      "rating_average": 4.5,
      "joined_party_at": "2024-01-01T00:00:00Z"
    }
  ],
  "statistics": {
    "total_members": 45,
    "candidates": 30,
    "current_members": 15,
    "by_council": {
      "parliament": 35,
      "senate": 10
    },
    "by_governorate": {
      "القاهرة": 15,
      "الجيزة": 10,
      "الإسكندرية": 8
    }
  }
}
```

---

## 📋 **خدمة إدارة أنواع الشكاوى (Complaint Types Management)**

### المنفذ: 8023
### قاعدة البيانات: PostgreSQL

#### **GET /api/admin/complaint-types**
عرض جميع أنواع الشكاوى

```json
// الاستجابة
{
  "complaint_types": [
    {
      "id": 1,
      "name": "البنية التحتية والطرق",
      "name_en": "Infrastructure and Roads",
      "category": "infrastructure",
      "target_council": "parliament",
      "icon": "🛣️",
      "color": "#FF6B35",
      "priority_level": "medium",
      "estimated_resolution_days": 45,
      "requires_attachments": true,
      "max_attachments": 5,
      "is_active": true,
      "is_public": true,
      "statistics": {
        "total_complaints": 156,
        "resolved_complaints": 89,
        "resolution_rate": 57.1,
        "average_resolution_time": 38.5
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "summary": {
    "total_types": 14,
    "active_types": 12,
    "parliament_types": 8,
    "senate_types": 4,
    "both_councils_types": 2
  }
}
```

#### **POST /api/admin/complaint-types**
إضافة نوع شكوى جديد

```json
// الطلب
{
  "name": "الطاقة والكهرباء",
  "name_en": "Energy and Electricity",
  "description": "شكاوى متعلقة بانقطاع الكهرباء وفواتير الطاقة",
  "category": "utilities",
  "target_council": "parliament",
  "icon": "⚡",
  "color": "#FFC107",
  "priority_level": "high",
  "estimated_resolution_days": 15,
  "requires_attachments": true,
  "max_attachments": 3
}

// الاستجابة
{
  "success": true,
  "message": "تم إضافة نوع الشكوى بنجاح",
  "complaint_type": {
    "id": 15,
    "name": "الطاقة والكهرباء",
    "name_en": "Energy and Electricity",
    "category": "utilities",
    "target_council": "parliament",
    "is_active": true,
    "created_at": "2024-01-15T16:00:00Z"
  },
  "next_steps": [
    "النوع متاح الآن للمواطنين",
    "تحديث قوائم الفلاتر تلقائياً"
  ]
}
```

#### **PUT /api/admin/complaint-types/{id}**
تعديل نوع شكوى

```json
// الطلب
{
  "name": "البنية التحتية والطرق المحدث",
  "estimated_resolution_days": 30,
  "priority_level": "high",
  "requires_attachments": false
}

// الاستجابة
{
  "success": true,
  "message": "تم تحديث نوع الشكوى بنجاح",
  "complaint_type": {
    "id": 1,
    "name": "البنية التحتية والطرق المحدث",
    "estimated_resolution_days": 30,
    "updated_at": "2024-01-15T16:30:00Z"
  },
  "affected_complaints": 156
}
```

#### **DELETE /api/admin/complaint-types/{id}**
حذف نوع شكوى

```json
// الطلب
{
  "confirm_deletion": true,
  "transfer_complaints_to_type_id": 2,  // نقل الشكاوى لنوع آخر
  "reason": "دمج مع نوع آخر"
}

// الاستجابة
{
  "success": true,
  "message": "تم حذف نوع الشكوى بنجاح",
  "deleted_type": {
    "id": 10,
    "name": "النوع المحذوف"
  },
  "affected_complaints": 25,
  "complaints_transferred": 25,
  "transferred_to": {
    "id": 2,
    "name": "الخدمات الصحية"
  }
}
```

#### **GET /api/admin/complaint-types/{id}/statistics**
إحصائيات نوع شكوى محدد

```json
// الاستجابة
{
  "complaint_type": {
    "id": 1,
    "name": "البنية التحتية والطرق"
  },
  "statistics": {
    "total_complaints": 156,
    "resolved_complaints": 89,
    "pending_complaints": 45,
    "under_review_complaints": 22,
    "resolution_rate": 57.1,
    "average_resolution_time": 38.5,
    "satisfaction_average": 4.2,
    "most_common_governorate": "القاهرة",
    "peak_submission_time": "10:00-12:00"
  },
  "trends": {
    "last_30_days": [
      {"date": "2024-01-01", "submitted": 5, "resolved": 3},
      {"date": "2024-01-02", "submitted": 8, "resolved": 4}
    ],
    "monthly_growth": 15.2,
    "resolution_time_trend": "improving"
  }
}
```

---

## ⚙️ **خدمة إعدادات النظام (System Settings Service)**

### المنفذ: 8024
### قاعدة البيانات: PostgreSQL + Redis

#### **GET /api/admin/settings**
عرض جميع إعدادات النظام

```json
// الاستجابة
{
  "user_settings": {
    "max_complaint_types": 50,
    "allow_custom_types": false,
    "require_type_selection": true,
    "max_file_size_mb": 10,
    "allowed_file_types": "pdf,doc,docx,jpg,jpeg,png,gif",
    "max_total_attachments_size_mb": 50
  },
  "party_settings": {
    "allow_independent": true,
    "require_party_approval": false,
    "max_parties": 50,
    "min_party_name_length": 3,
    "max_party_name_length": 100
  },
  "complaint_settings": {
    "auto_assign_enabled": true,
    "auto_assign_by_location": true,
    "auto_assign_by_type": true,
    "max_complaints_per_user_per_day": 5,
    "require_phone_verification": true
  },
  "notification_settings": {
    "send_email_notifications": true,
    "send_sms_notifications": false,
    "notification_frequency": "immediate"
  }
}
```

#### **PUT /api/admin/settings**
تحديث إعدادات النظام

```json
// الطلب
{
  "user_settings": {
    "max_file_size_mb": 15,
    "max_total_attachments_size_mb": 75
  },
  "party_settings": {
    "max_parties": 60
  },
  "complaint_settings": {
    "max_complaints_per_user_per_day": 3
  }
}

// الاستجابة
{
  "success": true,
  "message": "تم تحديث الإعدادات بنجاح",
  "updated_settings": [
    "max_file_size_mb",
    "max_total_attachments_size_mb", 
    "max_parties",
    "max_complaints_per_user_per_day"
  ],
  "restart_required": false,
  "updated_at": "2024-01-15T17:00:00Z"
}
```

---

## 📊 **خدمة التقارير والإحصائيات (Reports & Analytics Service)**

### المنفذ: 8025
### قاعدة البيانات: PostgreSQL + ClickHouse

#### **GET /api/admin/reports/overview**
تقرير عام شامل

```json
// الاستجابة
{
  "period": "last_30_days",
  "users": {
    "total_users": 1250,
    "new_registrations": 85,
    "active_users": 890,
    "by_type": {
      "citizens": 1050,
      "candidates": 150,
      "current_members": 45,
      "admins": 5
    }
  },
  "parties": {
    "total_parties": 16,
    "active_parties": 15,
    "parties_added": 2,
    "most_popular": {
      "id": 1,
      "name": "حزب الوفد",
      "members": 45
    }
  },
  "complaints": {
    "total_complaints": 456,
    "new_complaints": 67,
    "resolved_complaints": 234,
    "resolution_rate": 51.3,
    "average_resolution_time": 28.5,
    "most_common_type": "البنية التحتية والطرق"
  },
  "engagement": {
    "total_messages": 1250,
    "total_ratings": 890,
    "average_rating": 4.2,
    "most_active_governorate": "القاهرة"
  }
}
```

#### **GET /api/admin/reports/export**
تصدير التقارير

```json
// المعاملات
{
  "report_type": "users",  // users, parties, complaints, full
  "format": "excel",  // excel, csv, pdf
  "date_from": "2024-01-01",
  "date_to": "2024-01-31",
  "filters": {
    "governorate": "القاهرة",
    "user_type": "candidate"
  }
}

// الاستجابة
{
  "success": true,
  "message": "تم إنشاء التقرير بنجاح",
  "report": {
    "id": "report_20240115_170000",
    "type": "users",
    "format": "excel",
    "file_size": "2.5 MB",
    "records_count": 156,
    "download_url": "https://example.com/reports/report_20240115_170000.xlsx",
    "expires_at": "2024-01-22T17:00:00Z"
  },
  "generation_time": "3.2 seconds"
}
```
