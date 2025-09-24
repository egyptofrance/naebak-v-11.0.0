# Naebak API Documentation - وثائق APIs التفاعلية

## 🎯 **نظرة عامة**

هذا الملف يحتوي على وثائق شاملة وتفاعلية لجميع APIs في منصة نائبك، مع أمثلة عملية وأكواد جاهزة للاستخدام.

---

## 📋 **فهرس الخدمات**

| الخدمة | المنفذ | الوصف | الحالة |
|--------|-------|-------|--------|
| [Auth Service](#auth-service) | 8001 | خدمة المصادقة وإدارة المستخدمين | ✅ نشط |
| [Complaints Service](#complaints-service) | 8002 | خدمة الشكاوى والمرفقات | ✅ نشط |
| [Admin Service](#admin-service) | 8003 | خدمة الإدارة والتحكم | ✅ نشط |
| [Gateway Service](#gateway-service) | 8000 | بوابة API الرئيسية | 🚧 قيد التطوير |
| [Messaging Service](#messaging-service) | 8004 | خدمة الرسائل والتواصل | 🚧 قيد التطوير |
| [Ratings Service](#ratings-service) | 8005 | خدمة التقييمات والمراجعات | 🚧 قيد التطوير |

---

## 🔐 **Auth Service - خدمة المصادقة**

### **Base URL:** `http://localhost:8001/api/v1`

### **المصادقة العامة**

جميع APIs تتطلب رأس المصادقة ما عدا التسجيل وتسجيل الدخول:
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
Accept: application/json
```

---

### **1. تسجيل مستخدم جديد**

#### **POST** `/auth/register`

**الوصف:** تسجيل مستخدم جديد في النظام

**Body Parameters:**
```json
{
  "name": "string (required, min: 2, max: 100)",
  "email": "string (required, email format)",
  "phone": "string (required, Egyptian format: 01XXXXXXXXX)",
  "whatsapp": "string (optional, Egyptian format)",
  "password": "string (required, min: 8)",
  "password_confirmation": "string (required, must match password)",
  "national_id": "string (required, 14 digits)",
  "birth_date": "date (required, YYYY-MM-DD)",
  "gender": "string (required, enum: ['ذكر', 'أنثى'])",
  "governorate": "string (required, from governorates list)",
  "address": "string (required, min: 10, max: 500)",
  "user_type": "string (required, enum: ['مواطن', 'مرشح', 'عضو حالي'])",
  "council_type": "string (optional, enum: ['مجلس النواب', 'مجلس الشيوخ'])",
  "membership_status": "string (optional, enum: ['مرشح', 'عضو حالي'])",
  "party": "string (optional, from parties list)",
  "constituency": "string (optional)",
  "electoral_number": "string (optional, for candidates)",
  "electoral_symbol": "string (optional, for candidates)"
}
```

**مثال الطلب:**
```bash
curl -X POST "http://localhost:8001/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد علي",
    "email": "ahmed.mohamed@example.com",
    "phone": "01012345678",
    "whatsapp": "01012345678",
    "password": "SecurePass123",
    "password_confirmation": "SecurePass123",
    "national_id": "29801011234567",
    "birth_date": "1998-01-01",
    "gender": "ذكر",
    "governorate": "القاهرة",
    "address": "شارع التحرير، وسط البلد",
    "user_type": "مواطن"
  }'
```

**الاستجابات:**

**201 Created - تم التسجيل بنجاح:**
```json
{
  "success": true,
  "message": "تم تسجيل المستخدم بنجاح",
  "data": {
    "user": {
      "id": 1,
      "name": "أحمد محمد علي",
      "email": "ahmed.mohamed@example.com",
      "phone": "01012345678",
      "user_type": "مواطن",
      "governorate": "القاهرة",
      "is_verified": false,
      "created_at": "2024-12-25T10:30:00Z"
    },
    "tokens": {
      "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      "token_type": "Bearer",
      "expires_in": 3600
    }
  }
}
```

**400 Bad Request - خطأ في البيانات:**
```json
{
  "success": false,
  "message": "خطأ في البيانات المرسلة",
  "errors": {
    "email": ["البريد الإلكتروني مستخدم من قبل"],
    "phone": ["رقم الهاتف غير صحيح"],
    "password": ["كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل"]
  }
}
```

**422 Unprocessable Entity - بيانات غير صالحة:**
```json
{
  "success": false,
  "message": "البيانات غير صالحة",
  "errors": {
    "national_id": ["الرقم القومي موجود مسبقاً"],
    "birth_date": ["تاريخ الميلاد غير صحيح"]
  }
}
```

---

### **2. تسجيل الدخول**

#### **POST** `/auth/login`

**الوصف:** تسجيل دخول المستخدم والحصول على رمز الوصول

**Body Parameters:**
```json
{
  "email": "string (required, email format)",
  "password": "string (required)",
  "remember_me": "boolean (optional, default: false)"
}
```

**مثال الطلب:**
```bash
curl -X POST "http://localhost:8001/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed.mohamed@example.com",
    "password": "SecurePass123",
    "remember_me": true
  }'
```

**الاستجابات:**

**200 OK - تم تسجيل الدخول بنجاح:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "user": {
      "id": 1,
      "name": "أحمد محمد علي",
      "email": "ahmed.mohamed@example.com",
      "user_type": "مواطن",
      "is_verified": true,
      "last_login": "2024-12-25T14:20:00Z"
    },
    "tokens": {
      "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      "token_type": "Bearer",
      "expires_in": 3600
    }
  }
}
```

**401 Unauthorized - بيانات دخول خاطئة:**
```json
{
  "success": false,
  "message": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  "error_code": "INVALID_CREDENTIALS"
}
```

**423 Locked - الحساب مقفل:**
```json
{
  "success": false,
  "message": "تم قفل الحساب بسبب محاولات دخول خاطئة متعددة",
  "error_code": "ACCOUNT_LOCKED",
  "unlock_at": "2024-12-25T15:30:00Z"
}
```

---

### **3. الحصول على بيانات المستخدم الحالي**

#### **GET** `/auth/user`

**الوصف:** الحصول على بيانات المستخدم المسجل حالياً

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**مثال الطلب:**
```bash
curl -X GET "http://localhost:8001/api/v1/auth/user" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**الاستجابات:**

**200 OK - بيانات المستخدم:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "أحمد محمد علي",
      "email": "ahmed.mohamed@example.com",
      "phone": "01012345678",
      "whatsapp": "01012345678",
      "governorate": "القاهرة",
      "address": "شارع التحرير، وسط البلد",
      "user_type": "مواطن",
      "is_verified": true,
      "created_at": "2024-01-15T10:30:00Z",
      "last_login": "2024-12-25T14:20:00Z",
      "profile_completion": 85,
      "statistics": {
        "complaints_count": 3,
        "messages_sent": 7,
        "ratings_given": 12
      }
    }
  }
}
```

---

### **4. تحديث بيانات المستخدم**

#### **PUT** `/auth/user`

**الوصف:** تحديث بيانات المستخدم الحالي

**Body Parameters:**
```json
{
  "name": "string (optional, min: 2, max: 100)",
  "phone": "string (optional, Egyptian format)",
  "whatsapp": "string (optional, Egyptian format)",
  "address": "string (optional, min: 10, max: 500)",
  "governorate": "string (optional, from governorates list)"
}
```

**مثال الطلب:**
```bash
curl -X PUT "http://localhost:8001/api/v1/auth/user" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد علي المحدث",
    "phone": "01012345679",
    "address": "شارع التحرير الجديد، وسط البلد"
  }'
```

---

### **5. تسجيل الخروج**

#### **POST** `/auth/logout`

**الوصف:** تسجيل خروج المستخدم وإلغاء الرمز المميز

**مثال الطلب:**
```bash
curl -X POST "http://localhost:8001/api/v1/auth/logout" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**200 OK - تم تسجيل الخروج:**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

## 📝 **Complaints Service - خدمة الشكاوى**

### **Base URL:** `http://localhost:8002/api/v1`

---

### **1. إنشاء شكوى جديدة**

#### **POST** `/complaints`

**الوصف:** إنشاء شكوى جديدة مع إمكانية رفع مرفقات

**Content-Type:** `multipart/form-data`

**Form Parameters:**
```
title: string (required, min: 10, max: 200)
description: string (required, min: 50, max: 2000)
complaint_type: string (required, from complaint types list)
target_member_id: integer (required, valid member ID)
location: string (optional, max: 500)
youtube_link: string (optional, valid YouTube URL)
attachments[]: file[] (optional, max 10 files, max 10MB each)
```

**مثال الطلب:**
```bash
curl -X POST "http://localhost:8002/api/v1/complaints" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -F "title=تدهور حالة الطرق في منطقة شبرا الخيمة" \
  -F "description=الطرق في منطقة شبرا الخيمة في حالة سيئة جداً مما يسبب صعوبة في المرور وأضرار للسيارات. نطالب بإصلاح الطرق وتطويرها." \
  -F "complaint_type=البنية التحتية والطرق" \
  -F "target_member_id=9" \
  -F "location=شبرا الخيمة - شارع الجمهورية" \
  -F "attachments[]=@road_damage_1.jpg" \
  -F "attachments[]=@road_damage_2.jpg"
```

**الاستجابات:**

**201 Created - تم إنشاء الشكوى:**
```json
{
  "success": true,
  "message": "تم إرسال الشكوى بنجاح",
  "data": {
    "complaint": {
      "id": 1,
      "title": "تدهور حالة الطرق في منطقة شبرا الخيمة",
      "description": "الطرق في منطقة شبرا الخيمة في حالة سيئة جداً...",
      "complaint_type": "البنية التحتية والطرق",
      "status": "جديدة",
      "priority": "عالية",
      "citizen_name": "نورا سامي إبراهيم",
      "target_member_name": "د. محمد عبد الله الطيب",
      "location": "شبرا الخيمة - شارع الجمهورية",
      "created_at": "2024-12-25T10:30:00Z",
      "attachments": [
        {
          "id": 1,
          "filename": "road_damage_1.jpg",
          "file_type": "image/jpeg",
          "file_size": 2048576,
          "url": "/media/complaints/1/road_damage_1.jpg"
        },
        {
          "id": 2,
          "filename": "road_damage_2.jpg",
          "file_type": "image/jpeg",
          "file_size": 1856432,
          "url": "/media/complaints/1/road_damage_2.jpg"
        }
      ]
    }
  }
}
```

---

### **2. الحصول على قائمة الشكاوى**

#### **GET** `/complaints`

**الوصف:** الحصول على قائمة الشكاوى مع إمكانية الفلترة والبحث

**Query Parameters:**
```
page: integer (optional, default: 1)
per_page: integer (optional, default: 20, max: 100)
status: string (optional, enum: ['جديدة', 'قيد المراجعة', 'تم الرد', 'مغلقة'])
complaint_type: string (optional, from complaint types list)
priority: string (optional, enum: ['منخفضة', 'متوسطة', 'عالية', 'عالية جداً'])
governorate: string (optional, from governorates list)
search: string (optional, search in title and description)
sort_by: string (optional, enum: ['created_at', 'updated_at', 'priority'])
sort_order: string (optional, enum: ['asc', 'desc'], default: 'desc')
```

**مثال الطلب:**
```bash
curl -X GET "http://localhost:8002/api/v1/complaints?page=1&per_page=10&status=جديدة&complaint_type=البنية التحتية والطرق&search=طرق" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**200 OK - قائمة الشكاوى:**
```json
{
  "success": true,
  "data": {
    "complaints": [
      {
        "id": 1,
        "title": "تدهور حالة الطرق في منطقة شبرا الخيمة",
        "complaint_type": "البنية التحتية والطرق",
        "status": "جديدة",
        "priority": "عالية",
        "citizen_name": "نورا سامي إبراهيم",
        "target_member_name": "د. محمد عبد الله الطيب",
        "governorate": "القليوبية",
        "created_at": "2024-12-25T10:30:00Z",
        "attachments_count": 2,
        "views_count": 45,
        "has_response": false
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 1,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    },
    "filters": {
      "available_statuses": ["جديدة", "قيد المراجعة", "تم الرد", "مغلقة"],
      "available_types": ["البنية التحتية والطرق", "الخدمات الصحية", "التعليم والجامعات"],
      "available_priorities": ["منخفضة", "متوسطة", "عالية", "عالية جداً"]
    }
  }
}
```

---

### **3. الحصول على تفاصيل شكوى**

#### **GET** `/complaints/{id}`

**الوصف:** الحصول على تفاصيل شكوى محددة

**Path Parameters:**
- `id`: integer (required) - معرف الشكوى

**مثال الطلب:**
```bash
curl -X GET "http://localhost:8002/api/v1/complaints/1" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**200 OK - تفاصيل الشكوى:**
```json
{
  "success": true,
  "data": {
    "complaint": {
      "id": 1,
      "title": "تدهور حالة الطرق في منطقة شبرا الخيمة",
      "description": "الطرق في منطقة شبرا الخيمة في حالة سيئة جداً مما يسبب صعوبة في المرور وأضرار للسيارات. نطالب بإصلاح الطرق وتطويرها.",
      "complaint_type": "البنية التحتية والطرق",
      "status": "قيد المراجعة",
      "priority": "عالية",
      "citizen": {
        "id": 4,
        "name": "نورا سامي إبراهيم",
        "governorate": "القليوبية"
      },
      "target_member": {
        "id": 9,
        "name": "د. محمد عبد الله الطيب",
        "council_type": "مجلس النواب",
        "constituency": "دائرة القاهرة الثالثة"
      },
      "location": "شبرا الخيمة - شارع الجمهورية",
      "youtube_link": "",
      "response": "",
      "response_date": null,
      "created_at": "2024-12-25T10:30:00Z",
      "updated_at": "2024-12-25T14:15:00Z",
      "views_count": 45,
      "likes_count": 12,
      "shares_count": 3,
      "attachments": [
        {
          "id": 1,
          "filename": "road_damage_1.jpg",
          "original_filename": "road_damage_1.jpg",
          "file_type": "image/jpeg",
          "file_size": 2048576,
          "description": "صورة توضح تدهور الطريق",
          "url": "/media/complaints/1/road_damage_1.jpg",
          "thumbnail_url": "/media/complaints/1/thumbnails/road_damage_1_thumb.jpg",
          "uploaded_at": "2024-12-25T10:30:00Z"
        }
      ]
    }
  }
}
```

---

### **4. الرد على شكوى (للأعضاء فقط)**

#### **POST** `/complaints/{id}/respond`

**الوصف:** إضافة رد على شكوى (متاح للأعضاء المستهدفين فقط)

**Path Parameters:**
- `id`: integer (required) - معرف الشكوى

**Body Parameters:**
```json
{
  "response": "string (required, min: 20, max: 1000)",
  "status": "string (optional, enum: ['قيد المراجعة', 'تم الرد', 'مغلقة'])"
}
```

**مثال الطلب:**
```bash
curl -X POST "http://localhost:8002/api/v1/complaints/1/respond" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "response": "تم التواصل مع وزارة النقل لدراسة الموضوع وسيتم إصلاح الطرق خلال الشهر القادم.",
    "status": "تم الرد"
  }'
```

**200 OK - تم إضافة الرد:**
```json
{
  "success": true,
  "message": "تم إضافة الرد بنجاح",
  "data": {
    "complaint": {
      "id": 1,
      "status": "تم الرد",
      "response": "تم التواصل مع وزارة النقل لدراسة الموضوع وسيتم إصلاح الطرق خلال الشهر القادم.",
      "response_date": "2024-12-25T16:30:00Z",
      "updated_at": "2024-12-25T16:30:00Z"
    }
  }
}
```

---

## 👥 **Admin Service - خدمة الإدارة**

### **Base URL:** `http://localhost:8003/api/v1`

---

### **1. إحصائيات لوحة التحكم**

#### **GET** `/admin/dashboard`

**الوصف:** الحصول على إحصائيات شاملة للوحة التحكم

**مثال الطلب:**
```bash
curl -X GET "http://localhost:8003/api/v1/admin/dashboard" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**200 OK - إحصائيات لوحة التحكم:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_users": 1247,
      "total_complaints": 189,
      "total_messages": 1023,
      "total_ratings": 456,
      "active_users_today": 234,
      "new_registrations_today": 12,
      "pending_complaints": 45,
      "resolved_complaints": 144
    },
    "user_statistics": {
      "citizens": 1089,
      "candidates": 89,
      "current_members": 69,
      "verified_users": 1156,
      "unverified_users": 91
    },
    "complaint_statistics": {
      "by_status": {
        "جديدة": 45,
        "قيد المراجعة": 67,
        "تم الرد": 144,
        "مغلقة": 23
      },
      "by_type": {
        "البنية التحتية والطرق": 67,
        "الخدمات الصحية": 45,
        "التعليم والجامعات": 34,
        "الأمن والشرطة": 23,
        "أخرى": 20
      },
      "by_priority": {
        "عالية جداً": 23,
        "عالية": 67,
        "متوسطة": 78,
        "منخفضة": 21
      }
    },
    "activity_trends": {
      "last_7_days": [
        {"date": "2024-12-19", "users": 156, "complaints": 8, "messages": 34},
        {"date": "2024-12-20", "users": 178, "complaints": 12, "messages": 45},
        {"date": "2024-12-21", "users": 189, "complaints": 15, "messages": 52},
        {"date": "2024-12-22", "users": 203, "complaints": 9, "messages": 38},
        {"date": "2024-12-23", "users": 234, "complaints": 18, "messages": 67},
        {"date": "2024-12-24", "users": 198, "complaints": 11, "messages": 43},
        {"date": "2024-12-25", "users": 245, "complaints": 14, "messages": 56}
      ]
    },
    "top_members": [
      {
        "id": 10,
        "name": "د. نادية حسن الشامي",
        "council_type": "مجلس الشيوخ",
        "messages_received": 203,
        "complaints_received": 34,
        "average_rating": 4.6,
        "response_rate": 0.89
      }
    ]
  }
}
```

---

### **2. إدارة الأحزاب**

#### **GET** `/admin/parties`

**الوصف:** الحصول على قائمة الأحزاب السياسية

**Query Parameters:**
```
page: integer (optional, default: 1)
per_page: integer (optional, default: 20)
search: string (optional)
is_active: boolean (optional)
```

**مثال الطلب:**
```bash
curl -X GET "http://localhost:8003/api/v1/admin/parties?page=1&per_page=10" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**200 OK - قائمة الأحزاب:**
```json
{
  "success": true,
  "data": {
    "parties": [
      {
        "id": 1,
        "name": "حزب الوفد",
        "abbreviation": "الوفد",
        "founded_date": "1919-11-13",
        "description": "حزب سياسي مصري تأسس عام 1919",
        "logo_url": "/media/parties/wafd_logo.png",
        "website": "https://alwafd.org",
        "is_active": true,
        "members_count": 145,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-12-20T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 16,
      "total_pages": 2
    }
  }
}
```

#### **POST** `/admin/parties`

**الوصف:** إضافة حزب سياسي جديد

**Body Parameters:**
```json
{
  "name": "string (required, min: 2, max: 100)",
  "abbreviation": "string (optional, max: 20)",
  "founded_date": "date (optional, YYYY-MM-DD)",
  "description": "string (optional, max: 1000)",
  "website": "string (optional, valid URL)",
  "is_active": "boolean (optional, default: true)"
}
```

**مثال الطلب:**
```bash
curl -X POST "http://localhost:8003/api/v1/admin/parties" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "حزب جديد",
    "abbreviation": "جديد",
    "founded_date": "2024-01-01",
    "description": "حزب سياسي جديد",
    "website": "https://newparty.com",
    "is_active": true
  }'
```

#### **DELETE** `/admin/parties/{id}`

**الوصف:** حذف حزب سياسي

**Path Parameters:**
- `id`: integer (required) - معرف الحزب

**مثال الطلب:**
```bash
curl -X DELETE "http://localhost:8003/api/v1/admin/parties/5" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**200 OK - تم الحذف:**
```json
{
  "success": true,
  "message": "تم حذف الحزب بنجاح",
  "data": {
    "affected_members": 3,
    "backup_created": true,
    "backup_file": "parties_backup_20241225_163000.json"
  }
}
```

---

### **3. إدارة أنواع الشكاوى**

#### **GET** `/admin/complaint-types`

**الوصف:** الحصول على قائمة أنواع الشكاوى

**مثال الطلب:**
```bash
curl -X GET "http://localhost:8003/api/v1/admin/complaint-types" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**200 OK - أنواع الشكاوى:**
```json
{
  "success": true,
  "data": {
    "complaint_types": [
      {
        "id": 1,
        "name": "البنية التحتية والطرق",
        "description": "شكاوى متعلقة بالطرق والجسور والبنية التحتية",
        "council_type": "مجلس النواب",
        "icon": "🛣️",
        "color": "#2196F3",
        "is_active": true,
        "complaints_count": 67,
        "average_response_time": 18.5,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### **POST** `/admin/complaint-types`

**الوصف:** إضافة نوع شكوى جديد

**Body Parameters:**
```json
{
  "name": "string (required, min: 5, max: 100)",
  "description": "string (optional, max: 500)",
  "council_type": "string (required, enum: ['مجلس النواب', 'مجلس الشيوخ'])",
  "icon": "string (optional, emoji)",
  "color": "string (optional, hex color)",
  "is_active": "boolean (optional, default: true)"
}
```

---

### **4. إدارة المستخدمين**

#### **GET** `/admin/users`

**الوصف:** الحصول على قائمة المستخدمين مع إمكانية الفلترة

**Query Parameters:**
```
page: integer (optional, default: 1)
per_page: integer (optional, default: 20)
user_type: string (optional, enum: ['مواطن', 'مرشح', 'عضو حالي'])
is_verified: boolean (optional)
governorate: string (optional)
search: string (optional, search in name and email)
```

**مثال الطلب:**
```bash
curl -X GET "http://localhost:8003/api/v1/admin/users?user_type=مرشح&is_verified=true&page=1" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

#### **PUT** `/admin/users/{id}/verify`

**الوصف:** التحقق من حساب مستخدم

**Path Parameters:**
- `id`: integer (required) - معرف المستخدم

**مثال الطلب:**
```bash
curl -X PUT "http://localhost:8003/api/v1/admin/users/123/verify" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

---

## 🔄 **Gateway Service - بوابة API الرئيسية**

### **Base URL:** `http://localhost:8000/api/v1`

**الوصف:** بوابة موحدة لجميع APIs مع إدارة الحمولة والتوجيه

### **التوجيه التلقائي:**
- `/api/v1/auth/*` → Auth Service (8001)
- `/api/v1/complaints/*` → Complaints Service (8002)
- `/api/v1/admin/*` → Admin Service (8003)
- `/api/v1/messages/*` → Messaging Service (8004)
- `/api/v1/ratings/*` → Ratings Service (8005)

### **مثال الاستخدام:**
```bash
# بدلاً من الاتصال المباشر بخدمة المصادقة
curl -X POST "http://localhost:8001/api/v1/auth/login"

# يمكن الاتصال عبر البوابة
curl -X POST "http://localhost:8000/api/v1/auth/login"
```

---

## 📊 **رموز الاستجابة الموحدة**

### **رموز النجاح:**
- `200 OK` - تم تنفيذ الطلب بنجاح
- `201 Created` - تم إنشاء المورد بنجاح
- `204 No Content` - تم تنفيذ الطلب بنجاح بدون محتوى

### **رموز أخطاء العميل:**
- `400 Bad Request` - طلب غير صحيح أو بيانات مفقودة
- `401 Unauthorized` - غير مصرح بالوصول أو رمز مميز غير صحيح
- `403 Forbidden` - ممنوع الوصول (صلاحيات غير كافية)
- `404 Not Found` - المورد غير موجود
- `422 Unprocessable Entity` - بيانات غير صالحة
- `429 Too Many Requests` - تم تجاوز حد الطلبات

### **رموز أخطاء الخادم:**
- `500 Internal Server Error` - خطأ داخلي في الخادم
- `502 Bad Gateway` - خطأ في البوابة
- `503 Service Unavailable` - الخدمة غير متاحة مؤقتاً

---

## 🔒 **أمان APIs**

### **المصادقة:**
جميع APIs المحمية تتطلب رأس المصادقة:
```http
Authorization: Bearer <JWT_TOKEN>
```

### **معدل الطلبات:**
- **المستخدمون العاديون:** 60 طلب/دقيقة، 1000 طلب/ساعة
- **الأعضاء والمرشحون:** 120 طلب/دقيقة، 2000 طلب/ساعة
- **الإدارة:** 300 طلب/دقيقة، 5000 طلب/ساعة

### **التشفير:**
- جميع الاتصالات عبر HTTPS
- تشفير البيانات الحساسة في قاعدة البيانات
- تشفير JWT tokens

---

## 🧪 **اختبار APIs**

### **بيئة الاختبار:**
```
Base URL: http://localhost:8000/api/v1
Test Database: naebak_test
Test User: test@naebak.com / TestPass123
```

### **مجموعة Postman:**
```json
{
  "info": {
    "name": "Naebak APIs",
    "description": "مجموعة شاملة لاختبار APIs منصة نائبك"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{access_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000/api/v1"
    },
    {
      "key": "access_token",
      "value": ""
    }
  ]
}
```

### **سكريبت اختبار سريع:**
```bash
#!/bin/bash
# test_apis.sh

BASE_URL="http://localhost:8000/api/v1"

echo "🧪 اختبار APIs منصة نائبك..."

# اختبار تسجيل الدخول
echo "1. اختبار تسجيل الدخول..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@naebak.com","password":"TestPass123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.tokens.access_token')

if [ "$TOKEN" != "null" ]; then
  echo "✅ تم تسجيل الدخول بنجاح"
else
  echo "❌ فشل تسجيل الدخول"
  exit 1
fi

# اختبار الحصول على بيانات المستخدم
echo "2. اختبار الحصول على بيانات المستخدم..."
USER_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/user" \
  -H "Authorization: Bearer $TOKEN")

if echo $USER_RESPONSE | jq -e '.success' > /dev/null; then
  echo "✅ تم الحصول على بيانات المستخدم"
else
  echo "❌ فشل الحصول على بيانات المستخدم"
fi

# اختبار الحصول على قائمة الشكاوى
echo "3. اختبار الحصول على قائمة الشكاوى..."
COMPLAINTS_RESPONSE=$(curl -s -X GET "$BASE_URL/complaints" \
  -H "Authorization: Bearer $TOKEN")

if echo $COMPLAINTS_RESPONSE | jq -e '.success' > /dev/null; then
  echo "✅ تم الحصول على قائمة الشكاوى"
else
  echo "❌ فشل الحصول على قائمة الشكاوى"
fi

echo "🎉 انتهى الاختبار"
```

---

## 📚 **مراجع إضافية**

### **OpenAPI Specification:**
```yaml
openapi: 3.0.3
info:
  title: Naebak API
  description: APIs منصة نائبك للتواصل مع النواب والمرشحين
  version: 1.0.0
  contact:
    name: فريق نائبك
    email: api@naebak.com
    url: https://naebak.com
servers:
  - url: http://localhost:8000/api/v1
    description: خادم التطوير
  - url: https://api.naebak.com/v1
    description: خادم الإنتاج
```

### **SDK للعملاء:**
```javascript
// JavaScript/Node.js SDK
const NaebakAPI = require('@naebak/api-client');

const client = new NaebakAPI({
  baseURL: 'http://localhost:8000/api/v1',
  apiKey: 'your-api-key'
});

// تسجيل الدخول
const loginResult = await client.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// إنشاء شكوى
const complaint = await client.complaints.create({
  title: 'عنوان الشكوى',
  description: 'وصف الشكوى',
  complaint_type: 'البنية التحتية والطرق',
  target_member_id: 9
});
```

### **مولد الكود:**
```bash
# توليد كود العميل بلغات مختلفة
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:8000/api/v1/openapi.json \
  -g python \
  -o ./python-client

npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:8000/api/v1/openapi.json \
  -g javascript \
  -o ./js-client
```

---

## 🎯 **خلاصة**

هذا الملف يوفر وثائق شاملة وتفاعلية لجميع APIs في منصة نائبك، مع أمثلة عملية وأكواد جاهزة للاستخدام. يمكن للمطورين استخدام هذه الوثائق للتكامل السريع والفعال مع جميع خدمات المنصة.

### **المميزات الرئيسية:**
- ✅ **أمثلة عملية** لكل API
- ✅ **أكواد cURL جاهزة** للاختبار
- ✅ **رموز استجابة واضحة** مع الأمثلة
- ✅ **مواصفات أمان شاملة**
- ✅ **أدوات اختبار متكاملة**
- ✅ **دعم OpenAPI/Swagger**

يمكن استخدام هذا الملف كمرجع أساسي لجميع المطورين العاملين على مشروع نائبك.
