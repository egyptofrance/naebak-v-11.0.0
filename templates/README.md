# قوالب خدمات نائبك - Naebak Service Templates

مجموعة شاملة من القوالب الجاهزة لتطوير منصة نائبك بنظام المايكروسيرفيس.

## 🏗️ البنية العامة

### الخدمات الكبيرة (Django)
- **naebak-auth-service** (8001) - خدمة المصادقة وإدارة المستخدمين
- **naebak-admin-service** (8002) - خدمة الإدارة ولوحة التحكم
- **naebak-complaints-service** (8003) - خدمة الشكاوى والمرفقات
- **naebak-messaging-service** (8004) - خدمة الرسائل والتواصل
- **naebak-content-service** (8005) - خدمة إدارة المحتوى
- **naebak-ratings-service** (8006) - خدمة التقييمات والتصويت

### الخدمات الصغيرة (Flask)
- **naebak-gateway** (8007) - بوابة API الموحدة
- **naebak-visitor-counter-service** (8008) - خدمة عداد الزوار
- **naebak-statistics-service** (8009) - خدمة الإحصائيات
- **naebak-news-service** (8010) - خدمة الأخبار والشريط الإخباري
- **naebak-banner-service** (8011) - خدمة البنرات والإعلانات
- **naebak-theme-service** (8012) - خدمة الثيمات والتخصيص
- **naebak-notifications-service** (8013) - خدمة الإشعارات

### الواجهات الأمامية
- **naebak-frontend** (3000) - واجهة المستخدم بتقنية Next.js
- **naebak-admin-frontend** (3001) - لوحة إدارة المنصة بتقنية Next.js

## 🚀 البدء السريع

### 1. التطوير المحلي

```bash
# استنساخ القوالب
git clone <repository-url>
cd naebak-service-templates

# تشغيل جميع الخدمات
docker-compose up -d

# مراقبة السجلات
docker-compose logs -f
```

### 2. تشغيل خدمة واحدة

```bash
# مثال: تشغيل خدمة المصادقة
cd naebak-auth-service

# إنشاء البيئة الافتراضية
python -m venv venv
source venv/bin/activate  # Linux/Mac
# أو
venv\Scripts\activate     # Windows

# تثبيت المتطلبات
pip install -r requirements.txt

# تشغيل الخدمة
python manage.py runserver 8001
```

### 3. تشغيل الواجهات الأمامية

```bash
# واجهة المستخدم
cd naebak-frontend
npm install
npm run dev  # يعمل على المنفذ 3000

# لوحة الإدارة
cd naebak-admin-frontend
npm install
npm run dev  # يعمل على المنفذ 3001
```

## 🔧 الإعداد والتخصيص

### متغيرات البيئة

كل خدمة تحتوي على ملف `.env` مع الإعدادات الأساسية:

```env
# مثال من خدمة المصادقة
DEBUG=True
SECRET_KEY=your-secret-key
DB_NAME=naebak_auth
DB_USER=naebak_user
DB_PASSWORD=naebak_secure_password_2024
REDIS_URL=redis://localhost:6379/1
```

### قواعد البيانات

- **PostgreSQL** للخدمات الكبيرة (Django)
- **Redis** للتخزين المؤقت والجلسات
- **SQLite** للخدمات الصغيرة (اختياري)

### المنافذ المخصصة

| الخدمة | المنفذ | النوع |
|--------|-------|-------|
| naebak-auth-service | 8001 | Django |
| naebak-admin-service | 8002 | Django |
| naebak-complaints-service | 8003 | Django |
| naebak-messaging-service | 8004 | Django |
| naebak-content-service | 8005 | Django |
| naebak-ratings-service | 8006 | Django |
| naebak-gateway | 8007 | Flask |
| naebak-visitor-counter-service | 8008 | Flask |
| naebak-statistics-service | 8009 | Flask |
| naebak-news-service | 8010 | Flask |
| naebak-banner-service | 8011 | Flask |
| naebak-theme-service | 8012 | Flask |
| naebak-notifications-service | 8013 | Flask |
| naebak-frontend | 3000 | Next.js |
| naebak-admin-frontend | 3001 | Next.js |

## 📦 النشر

### Google Cloud Run

```bash
# تسجيل الدخول إلى Google Cloud
gcloud auth login
gcloud config set project naebak-472518

# نشر خدمة واحدة
cd naebak-auth-service
gcloud run deploy naebak-auth-service \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### GitHub Actions

تم إعداد workflow تلقائي للنشر في `.github/workflows/deploy.yml`:

- **اختبار تلقائي** لجميع الخدمات
- **نشر تلقائي** عند push إلى main
- **إشعارات** عن حالة النشر

## 🧪 الاختبار

### اختبار خدمة Django

```bash
cd naebak-auth-service
python -m pytest tests/ -v --cov=.
```

### اختبار خدمة Flask

```bash
cd naebak-visitor-counter-service
python -m pytest tests/ -v
```

### اختبار الواجهات الأمامية

```bash
# واجهة المستخدم
cd naebak-frontend
npm run lint
npm run type-check
npm run build

# لوحة الإدارة
cd naebak-admin-frontend
npm run lint
npm run type-check
npm run build
```

## 📊 المراقبة والصحة

### فحص صحة الخدمات

```bash
# Django services
curl http://localhost:8001/health/

# Flask services
curl http://localhost:8008/health

# Frontend
curl http://localhost:3000/api/health

# Admin Frontend
curl http://localhost:3001/api/health
```

### مراقبة الأداء

- **Sentry** للأخطاء والاستثناءات
- **Redis** للإحصائيات والتخزين المؤقت
- **PostgreSQL** لقواعد البيانات الرئيسية

## 🔒 الأمان

### المميزات الأمنية

- **JWT Authentication** للمصادقة
- **CORS** محدد للمصادر المسموحة
- **Rate Limiting** لمنع الإساءة
- **Input Validation** للبيانات المدخلة
- **SQL Injection Protection** في Django ORM
- **XSS Protection** في الواجهة الأمامية

### أفضل الممارسات

- تغيير `SECRET_KEY` في الإنتاج
- استخدام HTTPS في الإنتاج
- تحديث المكتبات بانتظام
- مراجعة السجلات دورياً

## 📚 الوثائق

### API Documentation

كل خدمة Django تحتوي على وثائق Swagger:
- http://localhost:8001/api/docs/ (Auth Service)
- http://localhost:8002/api/docs/ (Admin Service)
- إلخ...

### البيانات الأولية

تحتوي القوالب على:
- **27 محافظة مصرية**
- **16 حزب سياسي**
- **أنواع الشكاوى** المختلفة
- **بيانات تجريبية** للاختبار

## 🤝 المساهمة

### إضافة خدمة جديدة

1. إنشاء مجلد جديد للخدمة
2. نسخ القالب المناسب (Django/Flask)
3. تخصيص الإعدادات والمنفذ
4. إضافة الخدمة إلى `docker-compose.yml`
5. تحديث GitHub Actions workflow

### معايير الكود

- **Python**: PEP 8
- **JavaScript**: ESLint + Prettier
- **Git**: Conventional Commits
- **Testing**: Coverage > 80%

## 📞 الدعم

للحصول على المساعدة:
- إنشاء Issue في GitHub
- مراجعة الوثائق في `/docs`
- فحص السجلات في `/logs`

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

**تم إنشاء هذه القوالب لتسريع تطوير منصة نائبك وضمان جودة عالية ومعايير موحدة.**
