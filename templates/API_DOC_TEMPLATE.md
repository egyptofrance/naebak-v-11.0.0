# 📡 توثيق API - [اسم الخدمة]

**الإصدار:** 1.0.0  
**تاريخ آخر تحديث:** [التاريخ]  
**Base URL:** `https://api.naebak.com/[service-name]/v1`

---

## 🎯 نظرة عامة

[وصف مختصر لـ API الخدمة ووظائفها الأساسية]

**مثال:**
> API خدمة المصادقة يوفر endpoints لإدارة المستخدمين، تسجيل الدخول، والتحقق من الصلاحيات. يدعم مختلف أنواع المستخدمين ويوفر نظام مصادقة آمن باستخدام JWT tokens.

---

## 🔐 المصادقة والتخويل

### **أنواع المصادقة المدعومة**

| النوع | الوصف | الاستخدام |
|-------|--------|----------|
| **JWT Bearer Token** | للمستخدمين المسجلين | `Authorization: Bearer <token>` |
| **API Key** | للخدمات الداخلية | `X-API-Key: <api-key>` |
| **Session** | للواجهة الأمامية | Cookie-based |

### **الحصول على Token**

```bash
curl -X POST https://api.naebak.com/auth/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**الاستجابة:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": 123,
    "email": "user@example.com",
    "user_type": "citizen"
  }
}
```

### **تجديد Token**

```bash
curl -X POST https://api.naebak.com/auth/v1/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }'
```

---

## 📊 أكواد الاستجابة

| الكود | المعنى | الوصف |
|-------|--------|--------|
| **200** | OK | نجح الطلب |
| **201** | Created | تم إنشاء المورد بنجاح |
| **204** | No Content | نجح الطلب بدون محتوى |
| **400** | Bad Request | خطأ في بيانات الطلب |
| **401** | Unauthorized | غير مخول للوصول |
| **403** | Forbidden | ممنوع الوصول |
| **404** | Not Found | المورد غير موجود |
| **409** | Conflict | تضارب في البيانات |
| **422** | Unprocessable Entity | خطأ في التحقق من البيانات |
| **429** | Too Many Requests | تجاوز حد الطلبات |
| **500** | Internal Server Error | خطأ في الخادم |

---

## 🔗 Endpoints الرئيسية

### **[مجموعة 1]: [اسم المجموعة]**

#### **[GET] /[endpoint-path]**
[وصف مختصر للـ endpoint]

**المعاملات:**

| المعامل | النوع | مطلوب | الوصف |
|---------|------|--------|--------|
| `param1` | string | ✅ | وصف المعامل الأول |
| `param2` | integer | ❌ | وصف المعامل الثاني |
| `param3` | boolean | ❌ | وصف المعامل الثالث |

**مثال الطلب:**
```bash
curl -X GET "https://api.naebak.com/[service]/v1/[endpoint]?param1=value1&param2=123" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

**مثال الاستجابة:**
```json
{
  "status": "success",
  "data": {
    "id": 123,
    "field1": "value1",
    "field2": "value2",
    "created_at": "2025-09-26T10:00:00Z",
    "updated_at": "2025-09-26T10:00:00Z"
  },
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 10
  }
}
```

#### **[POST] /[endpoint-path]**
[وصف مختصر للـ endpoint]

**بيانات الطلب:**
```json
{
  "field1": "string",
  "field2": "integer",
  "field3": {
    "nested_field": "value"
  }
}
```

**مثال الطلب:**
```bash
curl -X POST https://api.naebak.com/[service]/v1/[endpoint] \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "field1": "example value",
    "field2": 123,
    "field3": {
      "nested_field": "nested value"
    }
  }'
```

**مثال الاستجابة:**
```json
{
  "status": "success",
  "message": "تم إنشاء المورد بنجاح",
  "data": {
    "id": 456,
    "field1": "example value",
    "field2": 123,
    "created_at": "2025-09-26T10:00:00Z"
  }
}
```

#### **[PUT] /[endpoint-path]/{id}**
[وصف مختصر للـ endpoint]

**معاملات المسار:**

| المعامل | النوع | الوصف |
|---------|------|--------|
| `id` | integer | معرف المورد |

**بيانات الطلب:**
```json
{
  "field1": "string",
  "field2": "integer"
}
```

#### **[DELETE] /[endpoint-path]/{id}**
[وصف مختصر للـ endpoint]

**مثال الطلب:**
```bash
curl -X DELETE https://api.naebak.com/[service]/v1/[endpoint]/123 \
  -H "Authorization: Bearer <token>"
```

**مثال الاستجابة:**
```json
{
  "status": "success",
  "message": "تم حذف المورد بنجاح"
}
```

---

## 📝 نماذج البيانات (Data Models)

### **[Model Name]**

```json
{
  "id": "integer - معرف فريد للمورد",
  "field1": "string - وصف الحقل الأول",
  "field2": "integer - وصف الحقل الثاني",
  "field3": "boolean - وصف الحقل الثالث",
  "nested_object": {
    "sub_field1": "string - وصف الحقل الفرعي",
    "sub_field2": "array - مصفوفة من القيم"
  },
  "created_at": "datetime - تاريخ الإنشاء (ISO 8601)",
  "updated_at": "datetime - تاريخ آخر تحديث (ISO 8601)"
}
```

**قيود البيانات:**

| الحقل | النوع | الحد الأدنى | الحد الأقصى | مطلوب | ملاحظات |
|-------|------|----------|------------|--------|----------|
| `field1` | string | 3 | 100 | ✅ | يجب أن يكون فريد |
| `field2` | integer | 1 | 999999 | ✅ | رقم موجب |
| `field3` | boolean | - | - | ❌ | القيمة الافتراضية: false |

---

## 🔍 الفلترة والبحث

### **معاملات الفلترة المدعومة**

| المعامل | النوع | الوصف | مثال |
|---------|------|--------|-------|
| `search` | string | البحث في النصوص | `?search=keyword` |
| `filter[field]` | mixed | فلترة حسب حقل محدد | `?filter[status]=active` |
| `sort` | string | ترتيب النتائج | `?sort=created_at` |
| `order` | string | اتجاه الترتيب | `?order=desc` |
| `page` | integer | رقم الصفحة | `?page=2` |
| `per_page` | integer | عدد العناصر في الصفحة | `?per_page=20` |

### **أمثلة الفلترة**

```bash
# البحث عن كلمة معينة
GET /api/items?search=example

# فلترة حسب الحالة
GET /api/items?filter[status]=active

# ترتيب حسب تاريخ الإنشاء
GET /api/items?sort=created_at&order=desc

# دمج عدة فلاتر
GET /api/items?search=example&filter[status]=active&sort=created_at&page=2
```

---

## 📄 التنقل بين الصفحات (Pagination)

### **هيكل الاستجابة**

```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 100,
    "last_page": 10,
    "from": 1,
    "to": 10
  },
  "links": {
    "first": "https://api.naebak.com/items?page=1",
    "last": "https://api.naebak.com/items?page=10",
    "prev": null,
    "next": "https://api.naebak.com/items?page=2"
  }
}
```

### **معاملات التنقل**

- **الحد الأدنى لـ per_page**: 1
- **الحد الأقصى لـ per_page**: 100
- **القيمة الافتراضية لـ per_page**: 10

---

## ⚠️ معالجة الأخطاء

### **هيكل رسالة الخطأ**

```json
{
  "status": "error",
  "message": "رسالة الخطأ الرئيسية",
  "errors": {
    "field1": ["رسالة خطأ للحقل الأول"],
    "field2": ["رسالة خطأ للحقل الثاني"]
  },
  "error_code": "VALIDATION_ERROR",
  "timestamp": "2025-09-26T10:00:00Z",
  "request_id": "req_123456789"
}
```

### **أكواد الأخطاء الشائعة**

| الكود | المعنى | الحل المقترح |
|-------|--------|---------------|
| `VALIDATION_ERROR` | خطأ في التحقق من البيانات | راجع الحقول المطلوبة |
| `AUTHENTICATION_FAILED` | فشل المصادقة | تحقق من صحة Token |
| `PERMISSION_DENIED` | عدم وجود صلاحية | تحقق من صلاحيات المستخدم |
| `RESOURCE_NOT_FOUND` | المورد غير موجود | تحقق من صحة المعرف |
| `RATE_LIMIT_EXCEEDED` | تجاوز حد الطلبات | انتظر قبل إرسال طلبات جديدة |

---

## 🚦 حدود الاستخدام (Rate Limiting)

### **الحدود الافتراضية**

| نوع المستخدم | الحد | النافذة الزمنية |
|--------------|------|----------------|
| **مستخدم عادي** | 1000 طلب | ساعة واحدة |
| **مستخدم مميز** | 5000 طلب | ساعة واحدة |
| **API Key** | 10000 طلب | ساعة واحدة |

### **Headers الاستجابة**

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1632150000
```

### **عند تجاوز الحد**

```json
{
  "status": "error",
  "message": "تم تجاوز حد الطلبات المسموح",
  "error_code": "RATE_LIMIT_EXCEEDED",
  "retry_after": 3600
}
```

---

## 🧪 أمثلة شاملة

### **مثال 1: إنشاء مستخدم جديد**

```bash
# الطلب
curl -X POST https://api.naebak.com/auth/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePassword123!",
    "user_type": "citizen",
    "profile": {
      "first_name": "أحمد",
      "last_name": "محمد",
      "phone": "+201234567890"
    }
  }'

# الاستجابة
{
  "status": "success",
  "message": "تم إنشاء المستخدم بنجاح",
  "data": {
    "id": 789,
    "email": "newuser@example.com",
    "user_type": "citizen",
    "profile": {
      "first_name": "أحمد",
      "last_name": "محمد",
      "phone": "+201234567890"
    },
    "is_active": true,
    "created_at": "2025-09-26T10:00:00Z"
  }
}
```

### **مثال 2: جلب قائمة مفلترة**

```bash
# الطلب
curl -X GET "https://api.naebak.com/complaints/v1/complaints?filter[status]=pending&sort=created_at&order=desc&page=1&per_page=5" \
  -H "Authorization: Bearer <token>"

# الاستجابة
{
  "status": "success",
  "data": [
    {
      "id": 101,
      "title": "مشكلة في الطريق",
      "description": "يوجد حفرة كبيرة في الطريق",
      "status": "pending",
      "priority": "high",
      "created_at": "2025-09-26T09:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 5,
    "total": 25,
    "last_page": 5
  }
}
```

---

## 🔧 SDK وأدوات التطوير

### **JavaScript/TypeScript SDK**

```bash
npm install @naebak/api-client
```

```javascript
import { NaebakClient } from '@naebak/api-client';

const client = new NaebakClient({
  baseURL: 'https://api.naebak.com',
  apiKey: 'your-api-key'
});

// استخدام الـ SDK
const users = await client.users.list({
  filter: { status: 'active' },
  page: 1,
  perPage: 10
});
```

### **Python SDK**

```bash
pip install naebak-api-client
```

```python
from naebak_client import NaebakClient

client = NaebakClient(
    base_url='https://api.naebak.com',
    api_key='your-api-key'
)

# استخدام الـ SDK
users = client.users.list(
    filter={'status': 'active'},
    page=1,
    per_page=10
)
```

---

## 📚 موارد إضافية

### **روابط مفيدة**

- [Swagger UI](https://api.naebak.com/[service]/docs/)
- [Redoc](https://api.naebak.com/[service]/redoc/)
- [OpenAPI Schema](https://api.naebak.com/[service]/schema.json)
- [Postman Collection](https://documenter.getpostman.com/view/[collection-id])

### **أمثلة الكود**

- [JavaScript Examples](examples/javascript/)
- [Python Examples](examples/python/)
- [cURL Examples](examples/curl/)

### **أدوات الاختبار**

- [API Testing Guide](docs/API_TESTING.md)
- [Performance Testing](docs/PERFORMANCE_TESTING.md)
- [Security Testing](docs/SECURITY_TESTING.md)

---

## 🆕 سجل التغييرات

### **الإصدار 1.0.0** - 2025-09-26
- إطلاق أول إصدار من الـ API
- دعم المصادقة باستخدام JWT
- إضافة endpoints الأساسية

### **الإصدار 0.9.0** - 2025-09-20
- إصدار تجريبي للاختبار
- تنفيذ معظم الوظائف الأساسية

---

## 📞 الدعم والتواصل

### **للحصول على المساعدة**

- **GitHub Issues**: [رابط المستودع](https://github.com/egyptofrance/[repository-name]/issues)
- **Email**: api-support@naebak.com
- **Slack**: قناة #api-support

### **الإبلاغ عن الأخطاء**

يرجى تضمين المعلومات التالية:
- رقم الطلب (Request ID)
- الـ endpoint المستخدم
- البيانات المرسلة
- رسالة الخطأ الكاملة

---

**آخر تحديث:** [التاريخ]  
**الإصدار:** 1.0.0  
**الحالة:** نشط
