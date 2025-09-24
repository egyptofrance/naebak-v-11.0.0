# مواصفات APIs مشروع نائبك

---

## 🔐 **خدمة المصادقة (naibak-auth-service)**

### Base URL: `https://naibak-auth-service.run.app/api/v1/`

#### **المصادقة والتسجيل:**
```http
POST /auth/register/
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "أحمد",
  "last_name": "محمد",
  "phone_number": "+201234567890",
  "national_id": "12345678901234",
  "user_type": "citizen",
  "governorate": "القاهرة",
  "city": "مدينة نصر",
  "gender": "male",
  "birth_date": "1990-01-01"
}
```

```http
POST /auth/login/
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}
Response: {
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here",
  "user": { user_data }
}
```

```http
POST /auth/google/
Content-Type: application/json
{
  "google_token": "google_oauth_token"
}
```

```http
POST /auth/forgot-password/
Content-Type: application/json
{
  "email": "user@example.com"
}
```

```http
POST /auth/reset-password/
Content-Type: application/json
{
  "token": "reset_token",
  "new_password": "new_password123"
}
```

#### **إدارة المستخدمين:**
```http
GET /users/profile/
Authorization: Bearer jwt_token

PUT /users/profile/
Authorization: Bearer jwt_token
Content-Type: application/json
{
  "first_name": "أحمد المحدث",
  "bio": "نبذة شخصية",
  "profile_picture": "image_url"
}

GET /users/check-email/
?email=test@example.com

GET /users/check-username/
?username=testuser
```

---

## 📨 **خدمة المراسلة (naibak-messaging-service)**

### Base URL: `https://naibak-messaging-service.run.app/api/v1/`

#### **إدارة الرسائل:**
```http
POST /messages/
Authorization: Bearer jwt_token
Content-Type: application/json
{
  "recipient_id": 123,
  "subject": "موضوع الرسالة",
  "content": "محتوى الرسالة (حد أقصى 500 حرف)"
}

GET /messages/inbox/
Authorization: Bearer jwt_token
?page=1&limit=20&is_read=false

GET /messages/sent/
Authorization: Bearer jwt_token
?page=1&limit=20

GET /messages/{message_id}/
Authorization: Bearer jwt_token

PUT /messages/{message_id}/read/
Authorization: Bearer jwt_token

DELETE /messages/{message_id}/
Authorization: Bearer jwt_token

POST /messages/{message_id}/reply/
Authorization: Bearer jwt_token
Content-Type: application/json
{
  "content": "رد على الرسالة"
}
```

#### **إحصائيات الرسائل:**
```http
GET /messages/stats/
Authorization: Bearer jwt_token
Response: {
  "total_received": 45,
  "unread_count": 12,
  "total_sent": 23
}
```

---

## 📋 **خدمة الشكاوى (naibak-complaints-service)**

### Base URL: `https://naibak-complaints-service.run.app/api/v1/`

#### **إدارة الشكاوى:**
```http
POST /complaints/
Authorization: Bearer jwt_token
Content-Type: multipart/form-data
{
  "title": "عنوان الشكوى",
  "content": "محتوى الشكوى (حد أقصى 1500 حرف)",
  "category": "البنية التحتية",
  "governorate": "القاهرة",
  "city": "مدينة نصر",
  "detailed_address": "العنوان التفصيلي",
  "youtube_link": "https://youtube.com/watch?v=...",
  "files": [file1, file2, ...]  // حد أقصى 10 ملفات
}

GET /complaints/
Authorization: Bearer jwt_token
?page=1&limit=20&status=pending&category=الصحة

GET /complaints/{complaint_id}/
Authorization: Bearer jwt_token

PUT /complaints/{complaint_id}/status/
Authorization: Bearer jwt_token (Admin only)
Content-Type: application/json
{
  "status": "under_review",
  "admin_notes": "ملاحظات الإدارة"
}

POST /complaints/{complaint_id}/assign/
Authorization: Bearer jwt_token (Admin only)
Content-Type: application/json
{
  "representative_id": 456
}

POST /complaints/{complaint_id}/resolve/
Authorization: Bearer jwt_token (Representative only)
Content-Type: application/json
{
  "resolution": "تم حل المشكلة بالطريقة التالية..."
}
```

#### **تحميل الشكاوى:**
```http
GET /complaints/export/
Authorization: Bearer jwt_token (Admin only)
?format=zip&date_from=2024-01-01&date_to=2024-12-31
Response: ZIP file download
```

---

## ⭐ **خدمة التقييمات (naibak-ratings-service)**

### Base URL: `https://naibak-ratings-service.run.app/api/v1/`

#### **التقييمات:**
```http
POST /ratings/
Authorization: Bearer jwt_token
Content-Type: application/json
{
  "representative_id": 123,
  "stars": 5,
  "comment": "تقييم ممتاز"
}

GET /ratings/representative/{representative_id}/
?page=1&limit=20
Response: {
  "average_rating": 4.5,
  "total_ratings": 1250,
  "ratings": [...]
}

GET /ratings/my-ratings/
Authorization: Bearer jwt_token

PUT /ratings/{rating_id}/
Authorization: Bearer jwt_token
Content-Type: application/json
{
  "stars": 4,
  "comment": "تقييم محدث"
}

DELETE /ratings/{rating_id}/
Authorization: Bearer jwt_token
```

#### **إدارة التقييمات (Admin):**
```http
PUT /ratings/representative/{representative_id}/initial/
Authorization: Bearer jwt_token (Admin only)
Content-Type: application/json
{
  "initial_rating": 4.8,
  "initial_count": 5000
}

PUT /ratings/representative/{representative_id}/visibility/
Authorization: Bearer jwt_token (Admin only)
Content-Type: application/json
{
  "show_real_ratings": true
}
```

---

## 📊 **خدمة المحتوى (naibak-content-service)**

### Base URL: `https://naibak-content-service.run.app/api/v1/`

#### **المرشحين والنواب:**
```http
GET /representatives/
?page=1&limit=20&governorate=القاهرة&party=الوفد&gender=male&search=أحمد
Response: {
  "results": [
    {
      "id": 123,
      "user": { user_data },
      "party": "حزب الوفد",
      "constituency": "القاهرة الأولى",
      "rating_average": 4.5,
      "rating_count": 1250,
      "solved_complaints": 45,
      "is_featured": true
    }
  ]
}

GET /representatives/{representative_id}/
Response: {
  "id": 123,
  "user": { user_data },
  "bio": "نبذة شخصية",
  "electoral_program": "البرنامج الانتخابي",
  "achievements": [...],
  "events": [...],
  "rating_stats": {...}
}

PUT /representatives/profile/
Authorization: Bearer jwt_token (Representative only)
Content-Type: application/json
{
  "bio": "نبذة محدثة",
  "electoral_program": "برنامج محدث",
  "banner_image": "image_url"
}
```

#### **الإنجازات والفعاليات:**
```http
POST /achievements/
Authorization: Bearer jwt_token (Representative only)
Content-Type: application/json
{
  "title": "إنجاز جديد",
  "description": "وصف الإنجاز",
  "achievement_date": "2024-01-15"
}

GET /achievements/representative/{representative_id}/
?is_approved=true

POST /events/
Authorization: Bearer jwt_token (Representative only)
Content-Type: application/json
{
  "title": "مؤتمر صحفي",
  "description": "وصف الفعالية",
  "event_type": "conference",
  "event_date": "2024-02-01",
  "location": "القاهرة"
}

PUT /achievements/{achievement_id}/approve/
Authorization: Bearer jwt_token (Admin only)
Content-Type: application/json
{
  "is_approved": true,
  "admin_message": "رسالة شكر من الإدارة"
}
```

---

## 🔔 **خدمة الإشعارات (naibak-notifications-service)**

### Base URL: `https://naibak-notifications-service.run.app/api/v1/`

#### **الإشعارات:**
```http
GET /notifications/
Authorization: Bearer jwt_token
?page=1&limit=20&is_read=false

PUT /notifications/{notification_id}/read/
Authorization: Bearer jwt_token

PUT /notifications/mark-all-read/
Authorization: Bearer jwt_token

GET /notifications/unread-count/
Authorization: Bearer jwt_token
Response: { "count": 5 }

POST /notifications/send/
Authorization: Bearer jwt_token (Admin only)
Content-Type: application/json
{
  "user_id": 123,
  "title": "إشعار جديد",
  "message": "محتوى الإشعار",
  "type": "system"
}
```

#### **WebSocket للإشعارات الفورية:**
```javascript
// WebSocket connection
ws://naibak-notifications-service.run.app/ws/notifications/{user_id}/
```

---

## 📰 **خدمة الأخبار (naibak-news-service)**

### Base URL: `https://naibak-news-service.run.app/api/v1/`

#### **الشريط الإخباري:**
```http
GET /news/ticker/
Response: {
  "content": "النص الإخباري المتحرك",
  "is_active": true
}

POST /news/
Authorization: Bearer jwt_token (Admin only)
Content-Type: application/json
{
  "content": "خبر جديد (حد أقصى 300 حرف)",
  "order": 1
}

GET /news/
Authorization: Bearer jwt_token (Admin only)
?page=1&limit=20&is_active=true

PUT /news/{news_id}/
Authorization: Bearer jwt_token (Admin only)
Content-Type: application/json
{
  "content": "خبر محدث",
  "is_active": false
}

DELETE /news/{news_id}/
Authorization: Bearer jwt_token (Admin only)
```

---

## 🖼️ **خدمة البنرات (naibak-banner-service)**

### Base URL: `https://naibak-banner-service.run.app/api/v1/`

#### **إدارة البنرات:**
```http
GET /banners/landing-page/
Response: {
  "image": "banner_url",
  "alt_text": "وصف البنر"
}

POST /banners/upload/
Authorization: Bearer jwt_token
Content-Type: multipart/form-data
{
  "banner_type": "landing_page",
  "image": file,
  "alt_text": "وصف البنر"
}

GET /banners/representative/{representative_id}/
Response: {
  "image": "banner_url",
  "alt_text": "وصف البنر"
}

PUT /banners/representative/
Authorization: Bearer jwt_token (Representative only)
Content-Type: multipart/form-data
{
  "image": file,
  "alt_text": "بنر شخصي"
}
```

---

## 📊 **خدمة عداد الزوار (naibak-visitor-counter-service)**

### Base URL: `https://naibak-visitor-counter-service.run.app/api/v1/`

#### **العداد:**
```http
GET /counter/
Response: {
  "count": 15847,
  "last_updated": "2024-01-15T10:30:00Z"
}

POST /counter/visit/
Content-Type: application/json
{
  "user_agent": "browser_info",
  "ip_address": "192.168.1.1"
}

PUT /counter/settings/
Authorization: Bearer jwt_token (Admin only)
Content-Type: application/json
{
  "min_random": 1000,
  "max_random": 1500
}

GET /counter/settings/
Authorization: Bearer jwt_token (Admin only)
```

---

## 🎨 **خدمة الألوان والثيم (naibak-theme-service)**

### Base URL: `https://naibak-theme-service.run.app/api/v1/`

#### **إدارة الألوان:**
```http
GET /colors/
Response: {
  "green": "#28A745",
  "orange": "#FF6B35"
}

PUT /colors/
Authorization: Bearer jwt_token (Admin only)
Content-Type: application/json
{
  "green": "#2ECC71",
  "orange": "#E67E22"
}

GET /colors/history/
Authorization: Bearer jwt_token (Admin only)
?page=1&limit=20
```

---

## 🔗 **خدمة روابط التواصل (Social Links)**

### Base URL: `https://naibak-admin-service.run.app/api/v1/`

#### **روابط السوشيال ميديا:**
```http
GET /social-links/
Response: [
  {
    "platform": "facebook",
    "url": "https://facebook.com/naibak",
    "icon_class": "fab fa-facebook",
    "is_active": true
  }
]

PUT /social-links/
Authorization: Bearer jwt_token (Admin only)
Content-Type: application/json
{
  "links": [
    {
      "platform": "facebook",
      "url": "https://facebook.com/naibak-updated"
    }
  ]
}
```

---

## 📈 **خدمة الإحصائيات (naibak-statistics-service)**

### Base URL: `https://naibak-statistics-service.run.app/api/v1/`

#### **الإحصائيات العامة:**
```http
GET /stats/dashboard/
Authorization: Bearer jwt_token (Admin only)
Response: {
  "total_users": 15000,
  "total_representatives": 450,
  "total_complaints": 2300,
  "total_messages": 8900,
  "daily_visitors": 1250
}

GET /stats/representatives/top-rated/
?limit=10
Response: [
  {
    "representative": {...},
    "rating_average": 4.8,
    "rating_count": 2500
  }
]

GET /stats/complaints/by-category/
Authorization: Bearer jwt_token (Admin only)
Response: {
  "البنية التحتية": 450,
  "الصحة": 320,
  "التعليم": 280
}
```

---

## 🌐 **خدمة البوابة (naibak-gateway)**

### Base URL: `https://naibak-gateway.run.app/api/v1/`

#### **توجيه الطلبات:**
```http
# جميع الطلبات تمر عبر البوابة
GET /api/v1/auth/* → naibak-auth-service
GET /api/v1/messages/* → naibak-messaging-service
GET /api/v1/complaints/* → naibak-complaints-service
GET /api/v1/ratings/* → naibak-ratings-service
# ... إلخ
```

#### **مراقبة الصحة:**
```http
GET /health/
Response: {
  "status": "healthy",
  "services": {
    "auth-service": "healthy",
    "messaging-service": "healthy",
    "complaints-service": "degraded"
  }
}
```

---

## 🔐 **رؤوس HTTP المطلوبة:**

```http
# للطلبات المصادق عليها
Authorization: Bearer {jwt_token}

# لرفع الملفات
Content-Type: multipart/form-data

# للبيانات JSON
Content-Type: application/json

# للتحكم في CORS
Access-Control-Allow-Origin: https://naibak.com
```

---

## 📊 **رموز الاستجابة:**

```http
200 OK - نجح الطلب
201 Created - تم إنشاء المورد
400 Bad Request - خطأ في البيانات المرسلة
401 Unauthorized - غير مصرح
403 Forbidden - ممنوع
404 Not Found - غير موجود
422 Unprocessable Entity - بيانات غير صالحة
500 Internal Server Error - خطأ في الخادم
```

---

## 🔄 **معدل الطلبات (Rate Limiting):**

```http
# للمستخدمين العاديين
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200

# للإدارة
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1640995200
```
