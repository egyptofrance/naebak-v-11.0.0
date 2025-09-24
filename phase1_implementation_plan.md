# خطة تنفيذ المرحلة الأولى - تحديث القوالب الموجودة

## تحليل الوضع الحالي (بناءً على المراجعة)

### المستودعات الموجودة:
✅ **naibak-auth-service** - Django (PostgreSQL)  
✅ **naibak-admin-service** - Django (PostgreSQL)  
✅ **naibak-complaints-service** - Django (PostgreSQL)  
✅ **naibak-frontend** - محاولة سابقة  

### المستودعات المفقودة (يجب إنشاؤها):
❌ **naibak-gateway** - Django (PostgreSQL)  
❌ **naibak-messaging-service** - Django (PostgreSQL)  
❌ **naibak-ratings-service** - Django (PostgreSQL)  
❌ **naibak-content-service** - Django (PostgreSQL)  
❌ **naibak-visitor-counter-service** - Flask (SQLite/Redis)  
❌ **naibak-statistics-service** - Flask (PostgreSQL)  
❌ **naibak-news-service** - Flask (SQLite/PostgreSQL)  
❌ **naibak-banner-service** - Flask (File Storage + PostgreSQL)  
❌ **naibak-theme-service** - Flask (Redis + PostgreSQL)  
❌ **naibak-notifications-service** - Flask (Redis + WebSocket)  

---

## المرحلة الأولى: تحديث القوالب الموجودة (يوم واحد)

### 1. تحديث naibak-auth-service ⭐⭐⭐

#### أ) ملف .env المحدث:
```env
# خدمة المصادقة - naibak-auth-service
SERVICE_NAME=naibak-auth-service
DATABASE_NAME=naibak_auth_db
PORT=8001
GOOGLE_CLOUD_PROJECT=naebak-472518

# Database Configuration
DB_ENGINE=django.db.backends.postgresql
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password

# Redis Configuration (للجلسات والتخزين المؤقت)
REDIS_URL=redis://localhost:6379/0
REDIS_DB_INDEX=0

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key
JWT_EXPIRATION_HOURS=24

# Google OAuth (للمصادقة الاجتماعية)
GOOGLE_OAUTH_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-google-client-secret

# Email Configuration (لإعادة تعيين كلمة المرور)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Security
DEBUG=False
ALLOWED_HOSTS=naibak-auth-service.run.app,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://naibak.com,http://localhost:3000

# Cloud Run Configuration
CLOUD_RUN_SERVICE_URL=https://naibak-auth-service.run.app
```

#### ب) requirements.txt المحدث:
```txt
Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
psycopg2-binary==2.9.7
redis==4.6.0
gunicorn==21.2.0
python-decouple==3.8
django-cors-headers==4.3.1
google-auth==2.23.4
google-auth-oauthlib==1.1.0
google-auth-httplib2==0.1.1
Pillow==10.0.1
whitenoise==6.6.0
dj-database-url==2.1.0
```

#### ج) settings/base.py المحدث:
```python
from decouple import config
import dj_database_url

# Service Configuration
SERVICE_NAME = config('SERVICE_NAME', default='naibak-auth-service')
DEBUG = config('DEBUG', default=False, cast=bool)

# Database Configuration
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL', default=f'postgresql://postgres:password@localhost:5432/{config("DATABASE_NAME")}')
    )
}

# Redis Configuration
REDIS_URL = config('REDIS_URL', default='redis://localhost:6379/0')
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.backends.redis.RedisCache',
        'LOCATION': REDIS_URL,
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

# Internationalization
LANGUAGE_CODE = 'ar'
TIME_ZONE = 'Africa/Cairo'
USE_I18N = True
USE_TZ = True

# CORS Configuration
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000').split(',')
CORS_ALLOW_CREDENTIALS = True

# JWT Configuration
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=config('JWT_EXPIRATION_HOURS', default=24, cast=int)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}
```

---

### 2. تحديث naibak-complaints-service ⭐⭐

#### أ) ملف .env المحدث:
```env
# خدمة الشكاوى - naibak-complaints-service
SERVICE_NAME=naibak-complaints-service
DATABASE_NAME=naibak_complaints_db
PORT=8002
GOOGLE_CLOUD_PROJECT=naebak-472518

# Database Configuration
DB_ENGINE=django.db.backends.postgresql
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password

# File Storage Configuration
MEDIA_ROOT=/app/media
MEDIA_URL=/media/
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png,gif

# YouTube Integration
YOUTUBE_API_KEY=your-youtube-api-key

# Cloud Storage (للإنتاج)
GOOGLE_CLOUD_STORAGE_BUCKET=naibak-complaints-files
```

#### ب) requirements.txt المحدث:
```txt
Django==4.2.7
djangorestframework==3.14.0
psycopg2-binary==2.9.7
gunicorn==21.2.0
python-decouple==3.8
django-cors-headers==4.3.1
Pillow==10.0.1
google-cloud-storage==2.10.0
python-magic==0.4.27
youtube-dl==2021.12.17
```

---

### 3. تحديث naibak-admin-service ⭐⭐

#### أ) ملف .env المحدث:
```env
# خدمة الإدارة - naibak-admin-service
SERVICE_NAME=naibak-admin-service
DATABASE_NAME=naibak_admin_db
PORT=8003
GOOGLE_CLOUD_PROJECT=naebak-472518

# Database Configuration
DB_ENGINE=django.db.backends.postgresql
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password

# Redis Configuration (للتخزين المؤقت)
REDIS_URL=redis://localhost:6379/3
REDIS_DB_INDEX=3

# Social Media Links (الافتراضية)
FACEBOOK_URL=https://facebook.com/naibak
TWITTER_URL=https://twitter.com/naibak
INSTAGRAM_URL=https://instagram.com/naibak
YOUTUBE_URL=https://youtube.com/naibak
LINKEDIN_URL=https://linkedin.com/company/naibak

# Admin Security
ADMIN_SECRET_KEY=your-super-secret-admin-key
```

---

### 4. إنشاء قوالب الخدمات المفقودة (Flask Services)

#### أ) naibak-visitor-counter-service (Flask + SQLite/Redis):
```env
# خدمة عداد الزوار - naibak-visitor-counter-service
SERVICE_NAME=naibak-visitor-counter-service
DATABASE_NAME=naibak_visitor_counter.db
PORT=8004
GOOGLE_CLOUD_PROJECT=naebak-472518

# Database Configuration (SQLite للبساطة)
DB_TYPE=sqlite
DB_PATH=/app/data/naibak_visitor_counter.db

# Redis Configuration (للعدادات السريعة)
REDIS_URL=redis://localhost:6379/4
REDIS_DB_INDEX=4

# Counter Configuration
RANDOM_INCREMENT_MIN=1
RANDOM_INCREMENT_MAX=5
UPDATE_INTERVAL_SECONDS=30
```

#### ب) naibak-news-service (Flask + SQLite):
```env
# خدمة الأخبار - naibak-news-service
SERVICE_NAME=naibak-news-service
DATABASE_NAME=naibak_news.db
PORT=8005
GOOGLE_CLOUD_PROJECT=naebak-472518

# Database Configuration
DB_TYPE=sqlite
DB_PATH=/app/data/naibak_news.db

# News Ticker Configuration
TICKER_SPEED=50  # pixels per second
TICKER_DIRECTION=rtl  # right to left
DEFAULT_NEWS_COLOR=#FFFFFF
DEFAULT_BACKGROUND_COLOR=#333333
```

---

## الخطوات العملية للتنفيذ:

### الخطوة 1: تحديث الخدمات الموجودة (2 ساعات)
```bash
# تحديث naibak-auth-service
cd naibak-auth-service
cp .env.example .env  # إذا لم يكن موجود
# تحديث محتوى .env حسب المواصفات أعلاه
pip install -r requirements.txt

# تحديث naibak-complaints-service
cd ../naibak-complaints-service
cp .env.example .env
# تحديث محتوى .env حسب المواصفات أعلاه
pip install -r requirements.txt

# تحديث naibak-admin-service
cd ../naibak-admin-service
cp .env.example .env
# تحديث محتوى .env حسب المواصفات أعلاه
pip install -r requirements.txt
```

### الخطوة 2: إنشاء قوالب Flask البسيطة (3 ساعات)
```bash
# إنشاء قوالب Flask للخدمات المفقودة
mkdir naibak-visitor-counter-service
mkdir naibak-news-service
mkdir naibak-banner-service
mkdir naibak-theme-service
mkdir naibak-notifications-service
mkdir naibak-statistics-service

# كل مجلد سيحتوي على:
# - app.py (Flask app بسيط)
# - requirements.txt
# - .env
# - Dockerfile
```

### الخطوة 3: إنشاء قوالب Django للخدمات الكبيرة (3 ساعات)
```bash
# إنشاء قوالب Django للخدمات المفقودة
django-admin startproject naibak_gateway ./naibak-gateway
django-admin startproject naibak_messaging ./naibak-messaging-service
django-admin startproject naibak_ratings ./naibak-ratings-service
django-admin startproject naibak_content ./naibak-content-service
```

---

## التحقق من الجودة:

### ✅ معايير النجاح:
- [ ] كل خدمة لها ملف .env مخصص ومحدث
- [ ] كل خدمة لها requirements.txt محدث
- [ ] كل خدمة لها إعدادات قاعدة بيانات صحيحة
- [ ] كل خدمة لها PORT مخصص (8001-8014)
- [ ] جميع الخدمات تستخدم نفس GOOGLE_CLOUD_PROJECT

### ⚠️ نقاط الانتباه:
- **قواعد البيانات:** PostgreSQL للخدمات الكبيرة، SQLite للصغيرة
- **المنافذ:** كل خدمة لها منفذ مخصص لتجنب التضارب
- **Redis:** فهارس منفصلة لكل خدمة (0-13)
- **أسماء قواعد البيانات:** واضحة ومميزة لكل خدمة

---

## التقدير الزمني الواقعي:
- **تحديث الخدمات الموجودة:** 2 ساعات
- **إنشاء قوالب Flask:** 3 ساعات  
- **إنشاء قوالب Django:** 3 ساعات
- **الاختبار والمراجعة:** 1 ساعة

**المجموع: 9 ساعات (يوم عمل واحد)**

**هل تريد مني البدء بتنفيذ هذه الخطة الآن؟** 🚀

سأبدأ بتحديث الخدمات الموجودة أولاً، ثم إنشاء القوالب المفقودة.
