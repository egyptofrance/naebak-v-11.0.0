# Naebak Configuration Templates - قوالب الإعدادات الجاهزة

## 🎯 **نظرة عامة**

هذا الملف يحتوي على جميع قوالب الإعدادات الجاهزة للاستخدام في مشروع نائبك، مما يوفر الوقت ويضمن الاتساق عبر جميع الخدمات.

---

## 🐳 **1. قوالب Docker**

### **1.1 Dockerfile للخدمات Django**

```dockerfile
# Dockerfile.django
FROM python:3.11-slim

# تعيين متغيرات البيئة
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=config.settings

# تثبيت التبعيات النظام
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# إنشاء مستخدم غير جذر
RUN useradd --create-home --shell /bin/bash naebak
USER naebak
WORKDIR /home/naebak

# نسخ ملف المتطلبات
COPY --chown=naebak:naebak requirements.txt .

# تثبيت المتطلبات Python
RUN pip install --user --no-cache-dir -r requirements.txt

# إضافة مجلد pip المحلي إلى PATH
ENV PATH="/home/naebak/.local/bin:${PATH}"

# نسخ كود التطبيق
COPY --chown=naebak:naebak . .

# إنشاء مجلدات الملفات الثابتة والوسائط
RUN mkdir -p static media logs

# تجميع الملفات الثابتة
RUN python manage.py collectstatic --noinput

# فحص صحة التطبيق
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python manage.py check --deploy || exit 1

# تشغيل الخادم
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "config.wsgi:application"]
```

### **1.2 Dockerfile للخدمات Flask**

```dockerfile
# Dockerfile.flask
FROM python:3.11-slim

# تعيين متغيرات البيئة
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# تثبيت التبعيات النظام
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# إنشاء مستخدم غير جذر
RUN useradd --create-home --shell /bin/bash naebak
USER naebak
WORKDIR /home/naebak

# نسخ ملف المتطلبات
COPY --chown=naebak:naebak requirements.txt .

# تثبيت المتطلبات Python
RUN pip install --user --no-cache-dir -r requirements.txt

# إضافة مجلد pip المحلي إلى PATH
ENV PATH="/home/naebak/.local/bin:${PATH}"

# نسخ كود التطبيق
COPY --chown=naebak:naebak . .

# إنشاء مجلدات الملفات
RUN mkdir -p logs uploads

# فحص صحة التطبيق
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# تشغيل الخادم
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "app:app"]
```

### **1.3 Dockerfile للواجهة الأمامية Next.js**

```dockerfile
# Dockerfile.nextjs
FROM node:18-alpine AS base

# تثبيت التبعيات فقط عند الحاجة
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# تثبيت التبعيات
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# إعادة بناء الكود المصدري فقط عند الحاجة
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# تعطيل التتبع في Next.js
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# صورة الإنتاج، نسخ جميع الملفات وتشغيل next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# الاستفادة من إخراج التتبع لتقليل حجم الصورة
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### **1.4 Docker Compose للتطوير**

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  # قاعدة البيانات الرئيسية
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: naebak_main
      POSTGRES_USER: naebak_user
      POSTGRES_PASSWORD: naebak_pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U naebak_user -d naebak_main"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis للتخزين المؤقت
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # خدمة المصادقة
  auth-service:
    build:
      context: ./naebak-auth-service
      dockerfile: Dockerfile
    ports:
      - "8001:8000"
    environment:
      - DATABASE_URL=postgresql://naebak_user:naebak_pass@postgres:5432/naebak_auth
      - REDIS_URL=redis://redis:6379/0
      - DEBUG=True
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./naebak-auth-service:/home/naebak
    command: python manage.py runserver 0.0.0.0:8000

  # خدمة الشكاوى
  complaints-service:
    build:
      context: ./naebak-complaints-service
      dockerfile: Dockerfile
    ports:
      - "8002:8000"
    environment:
      - DATABASE_URL=postgresql://naebak_user:naebak_pass@postgres:5432/naebak_complaints
      - REDIS_URL=redis://redis:6379/1
      - DEBUG=True
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./naebak-complaints-service:/home/naebak
      - media_files:/home/naebak/media
    command: python manage.py runserver 0.0.0.0:8000

  # خدمة الإدارة
  admin-service:
    build:
      context: ./naebak-admin-service
      dockerfile: Dockerfile
    ports:
      - "8003:8000"
    environment:
      - DATABASE_URL=postgresql://naebak_user:naebak_pass@postgres:5432/naebak_admin
      - REDIS_URL=redis://redis:6379/2
      - DEBUG=True
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./naebak-admin-service:/home/naebak
    command: python manage.py runserver 0.0.0.0:8000

  # الواجهة الأمامية
  frontend:
    build:
      context: ./naebak-frontend-nextjs
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
      - NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8001
      - NEXT_PUBLIC_COMPLAINTS_SERVICE_URL=http://localhost:8002
    volumes:
      - ./naebak-frontend-nextjs:/app
      - /app/node_modules
    command: npm run dev

volumes:
  postgres_data:
  redis_data:
  media_files:
```

---

## ⚙️ **2. قوالب إعدادات Django**

### **2.1 إعدادات Django الأساسية**

```python
# config/settings/base.py
import os
from pathlib import Path
from decouple import config

# مسار المشروع الأساسي
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# الأمان
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

# التطبيقات المثبتة
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    'drf_spectacular',
]

LOCAL_APPS = [
    'apps.users',
    'apps.core',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'apps.core.middleware.RequestLoggingMiddleware',
]

ROOT_URLCONF = 'config.urls'

# القوالب
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# قاعدة البيانات
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
        'OPTIONS': {
            'connect_timeout': 60,
        },
    }
}

# Redis
REDIS_URL = config('REDIS_URL', default='redis://localhost:6379/0')

# التخزين المؤقت
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': REDIS_URL,
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

# التدويل
LANGUAGE_CODE = 'ar'
TIME_ZONE = 'Africa/Cairo'
USE_I18N = True
USE_TZ = True

# الملفات الثابتة
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

# ملفات الوسائط
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# نموذج المستخدم المخصص
AUTH_USER_MODEL = 'users.User'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# JWT
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

# CORS
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000,http://127.0.0.1:3000'
).split(',')

# التسجيل
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'maxBytes': 1024*1024*10,  # 10MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# إعدادات الأمان
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# إعدادات رفع الملفات
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
FILE_UPLOAD_PERMISSIONS = 0o644

# إعدادات البريد الإلكتروني
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@naebak.com')
```

### **2.2 إعدادات التطوير**

```python
# config/settings/development.py
from .base import *

# تفعيل وضع التطوير
DEBUG = True

# السماح لجميع المضيفين في التطوير
ALLOWED_HOSTS = ['*']

# قاعدة بيانات محلية للتطوير
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# تعطيل التخزين المؤقت في التطوير
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# إعدادات البريد الإلكتروني للتطوير
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Django Debug Toolbar
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
    INTERNAL_IPS = ['127.0.0.1', '::1']

# إعدادات CORS مفتوحة للتطوير
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# تسجيل مفصل في التطوير
LOGGING['handlers']['console']['level'] = 'DEBUG'
LOGGING['loggers']['django']['level'] = 'DEBUG'
```

### **2.3 إعدادات الإنتاج**

```python
# config/settings/production.py
from .base import *
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

# تعطيل وضع التطوير
DEBUG = False

# المضيفون المسموحون
ALLOWED_HOSTS = config('ALLOWED_HOSTS').split(',')

# إعدادات الأمان للإنتاج
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_HSTS_SECONDS = 31536000  # سنة واحدة
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# إعدادات قاعدة البيانات للإنتاج
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
        'OPTIONS': {
            'sslmode': 'require',
        },
        'CONN_MAX_AGE': 600,
    }
}

# Sentry للمراقبة
sentry_sdk.init(
    dsn=config('SENTRY_DSN', default=''),
    integrations=[DjangoIntegration()],
    traces_sample_rate=0.1,
    send_default_pii=True
)

# إعدادات التخزين السحابي
DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
STATICFILES_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
GS_BUCKET_NAME = config('GS_BUCKET_NAME')
GS_PROJECT_ID = config('GS_PROJECT_ID')
GS_CREDENTIALS = config('GOOGLE_APPLICATION_CREDENTIALS')

# تحسين الأداء
CONN_MAX_AGE = 600
DATABASES['default']['CONN_MAX_AGE'] = CONN_MAX_AGE

# تسجيل للإنتاج
LOGGING['handlers']['file']['filename'] = '/var/log/naebak/django.log'
LOGGING['handlers']['file']['level'] = 'WARNING'
```

---

## 🌐 **3. قوالب إعدادات Flask**

### **3.1 إعدادات Flask الأساسية**

```python
# config.py
import os
from decouple import config

class Config:
    """إعدادات Flask الأساسية"""
    
    # الأمان
    SECRET_KEY = config('SECRET_KEY')
    
    # قاعدة البيانات
    SQLALCHEMY_DATABASE_URI = config('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_timeout': 20,
        'pool_recycle': -1,
        'pool_pre_ping': True
    }
    
    # Redis
    REDIS_URL = config('REDIS_URL', default='redis://localhost:6379/0')
    
    # رفع الملفات
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
    
    # JWT
    JWT_SECRET_KEY = config('JWT_SECRET_KEY', default=SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # ساعة واحدة
    
    # البريد الإلكتروني
    MAIL_SERVER = config('MAIL_SERVER', default='smtp.gmail.com')
    MAIL_PORT = config('MAIL_PORT', default=587, cast=int)
    MAIL_USE_TLS = config('MAIL_USE_TLS', default=True, cast=bool)
    MAIL_USERNAME = config('MAIL_USERNAME', default='')
    MAIL_PASSWORD = config('MAIL_PASSWORD', default='')
    
    # التسجيل
    LOG_LEVEL = config('LOG_LEVEL', default='INFO')
    LOG_FILE = config('LOG_FILE', default='app.log')

class DevelopmentConfig(Config):
    """إعدادات التطوير"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = config(
        'DEV_DATABASE_URL',
        default='sqlite:///dev.db'
    )

class ProductionConfig(Config):
    """إعدادات الإنتاج"""
    DEBUG = False
    
    # إعدادات الأمان للإنتاج
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

class TestingConfig(Config):
    """إعدادات الاختبار"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False

# اختيار الإعدادات حسب البيئة
config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig
}
```

### **3.2 تطبيق Flask الأساسي**

```python
# app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS
import redis
import logging
from logging.handlers import RotatingFileHandler
import os

# إنشاء الإضافات
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()

def create_app(config_name='development'):
    """إنشاء تطبيق Flask"""
    app = Flask(__name__)
    
    # تحميل الإعدادات
    from config import config_by_name
    app.config.from_object(config_by_name[config_name])
    
    # تهيئة الإضافات
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    
    # إعداد CORS
    CORS(app, origins=['http://localhost:3000'])
    
    # إعداد Redis
    app.redis = redis.from_url(app.config['REDIS_URL'])
    
    # تسجيل المخططات
    from app.routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # إعداد التسجيل
    setup_logging(app)
    
    # إعداد معالجات الأخطاء
    setup_error_handlers(app)
    
    return app

def setup_logging(app):
    """إعداد نظام التسجيل"""
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        
        file_handler = RotatingFileHandler(
            'logs/naebak.log',
            maxBytes=10240000,
            backupCount=10
        )
        
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Naebak service startup')

def setup_error_handlers(app):
    """إعداد معالجات الأخطاء"""
    
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {'error': 'Internal server error'}, 500

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)
```

---

## ⚛️ **4. قوالب إعدادات Next.js**

### **4.1 إعدادات Next.js**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // إعدادات الإنتاج
  output: 'standalone',
  
  // إعدادات الصور
  images: {
    domains: ['localhost', 'storage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // إعدادات التدويل
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    localeDetection: false,
  },
  
  // متغيرات البيئة العامة
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // إعادة كتابة URLs
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_BASE_URL}/api/:path*`,
      },
    ];
  },
  
  // رؤوس الأمان
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // إعدادات Webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // إضافة إعدادات مخصصة
    return config;
  },
  
  // إعدادات ESLint
  eslint: {
    dirs: ['pages', 'components', 'lib', 'src'],
  },
  
  // إعدادات TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
```

### **4.2 إعدادات Tailwind CSS**

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ألوان نائبك
        primary: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8dd18d',
          400: '#5bb85b',
          500: '#2d7d32', // الأخضر الأساسي
          600: '#1b5e20',
          700: '#1a4f1a',
          800: '#194019',
          900: '#173517',
        },
        secondary: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800', // البرتقالي
          600: '#fb8c00',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
        },
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Amiri', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'slide-right': 'slideRight 20s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
      keyframes: {
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
  // دعم RTL
  corePlugins: {
    textAlign: true,
  },
  variants: {
    extend: {
      textAlign: ['responsive', 'rtl'],
    },
  },
};
```

### **4.3 إعدادات TypeScript**

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 🚀 **5. قوالب GitHub Actions**

### **5.1 CI/CD للخدمات Django**

```yaml
# .github/workflows/django-ci.yml
name: Django CI/CD

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'naebak-*-service/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'naebak-*-service/**'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    strategy:
      matrix:
        python-version: [3.11]
        service: [auth, complaints, admin]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v4
      with:
        python-version: ${{ matrix.python-version }}
    
    - name: Cache pip dependencies
      uses: actions/cache@v3
      with:
        path: ~/.cache/pip
        key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
        restore-keys: |
          ${{ runner.os }}-pip-
    
    - name: Install dependencies
      working-directory: ./naebak-${{ matrix.service }}-service
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Run migrations
      working-directory: ./naebak-${{ matrix.service }}-service
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379/0
      run: |
        python manage.py migrate
    
    - name: Run tests
      working-directory: ./naebak-${{ matrix.service }}-service
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379/0
      run: |
        python manage.py test
        coverage run --source='.' manage.py test
        coverage report
        coverage xml
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./naebak-${{ matrix.service }}-service/coverage.xml
        flags: ${{ matrix.service }}-service
        name: codecov-${{ matrix.service }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    strategy:
      matrix:
        service: [auth, complaints, admin]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        project_id: ${{ secrets.GCP_PROJECT_ID }}
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        export_default_credentials: true
    
    - name: Configure Docker
      run: gcloud auth configure-docker
    
    - name: Build and push Docker image
      working-directory: ./naebak-${{ matrix.service }}-service
      run: |
        docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/naebak-${{ matrix.service }}-service:${{ github.sha }} .
        docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/naebak-${{ matrix.service }}-service:${{ github.sha }}
    
    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy naebak-${{ matrix.service }}-service \
          --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/naebak-${{ matrix.service }}-service:${{ github.sha }} \
          --platform managed \
          --region us-central1 \
          --allow-unauthenticated \
          --set-env-vars="DATABASE_URL=${{ secrets.DATABASE_URL }},REDIS_URL=${{ secrets.REDIS_URL }}"
```

### **5.2 CI/CD للواجهة الأمامية**

```yaml
# .github/workflows/frontend-ci.yml
name: Frontend CI/CD

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'naebak-frontend-nextjs/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'naebak-frontend-nextjs/**'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: naebak-frontend-nextjs/package-lock.json
    
    - name: Install dependencies
      working-directory: ./naebak-frontend-nextjs
      run: npm ci
    
    - name: Run linting
      working-directory: ./naebak-frontend-nextjs
      run: npm run lint
    
    - name: Run type checking
      working-directory: ./naebak-frontend-nextjs
      run: npm run type-check
    
    - name: Run tests
      working-directory: ./naebak-frontend-nextjs
      run: npm run test:ci
    
    - name: Build application
      working-directory: ./naebak-frontend-nextjs
      env:
        NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: naebak-frontend-nextjs/.next

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        project_id: ${{ secrets.GCP_PROJECT_ID }}
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        export_default_credentials: true
    
    - name: Configure Docker
      run: gcloud auth configure-docker
    
    - name: Build and push Docker image
      working-directory: ./naebak-frontend-nextjs
      run: |
        docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/naebak-frontend:${{ github.sha }} .
        docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/naebak-frontend:${{ github.sha }}
    
    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy naebak-frontend \
          --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/naebak-frontend:${{ github.sha }} \
          --platform managed \
          --region us-central1 \
          --allow-unauthenticated \
          --set-env-vars="NEXT_PUBLIC_API_URL=${{ secrets.NEXT_PUBLIC_API_URL }}"
```

---

## 📊 **6. قوالب المراقبة**

### **6.1 إعدادات Prometheus**

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "naebak_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'naebak-auth-service'
    static_configs:
      - targets: ['auth-service:8000']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'naebak-complaints-service'
    static_configs:
      - targets: ['complaints-service:8000']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'naebak-admin-service'
    static_configs:
      - targets: ['admin-service:8000']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'naebak-frontend'
    static_configs:
      - targets: ['frontend:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 60s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

### **6.2 قواعد التنبيه**

```yaml
# naebak_rules.yml
groups:
  - name: naebak_alerts
    rules:
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "خدمة {{ $labels.job }} متوقفة"
          description: "الخدمة {{ $labels.job }} على {{ $labels.instance }} متوقفة لأكثر من دقيقة"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "معدل أخطاء عالي في {{ $labels.job }}"
          description: "معدل الأخطاء في {{ $labels.job }} أكثر من 10% لمدة 5 دقائق"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "وقت استجابة عالي في {{ $labels.job }}"
          description: "95% من الطلبات تستغرق أكثر من ثانيتين في {{ $labels.job }}"

      - alert: DatabaseConnectionsHigh
        expr: pg_stat_activity_count > 80
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "عدد اتصالات قاعدة البيانات عالي"
          description: "عدد الاتصالات النشطة بقاعدة البيانات {{ $value }}"

      - alert: RedisMemoryHigh
        expr: redis_memory_used_bytes / redis_memory_max_bytes > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "استهلاك ذاكرة Redis عالي"
          description: "استهلاك ذاكرة Redis {{ $value | humanizePercentage }}"
```

---

## 🔧 **7. سكريبتات الإعداد**

### **7.1 سكريبت إعداد البيئة**

```bash
#!/bin/bash
# setup.sh

set -e

echo "🚀 إعداد مشروع نائبك..."

# إنشاء مجلدات المشروع
echo "📁 إنشاء مجلدات المشروع..."
mkdir -p {logs,media,static,uploads,backups}

# إعداد متغيرات البيئة
echo "⚙️ إعداد متغيرات البيئة..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ تم إنشاء ملف .env من القالب"
    echo "⚠️  يرجى تحديث متغيرات البيئة في ملف .env"
fi

# إعداد قواعد البيانات
echo "🗄️ إعداد قواعد البيانات..."
docker-compose up -d postgres redis

# انتظار تشغيل قواعد البيانات
echo "⏳ انتظار تشغيل قواعد البيانات..."
sleep 10

# تشغيل الهجرات
echo "🔄 تشغيل هجرات قاعدة البيانات..."
for service in auth complaints admin; do
    echo "  - تشغيل هجرات خدمة $service..."
    cd naebak-$service-service
    python manage.py migrate
    cd ..
done

# إنشاء مستخدم إدارة
echo "👤 إنشاء مستخدم الإدارة..."
cd naebak-admin-service
python manage.py createsuperuser --noinput --username admin --email admin@naebak.com || true
cd ..

# تثبيت تبعيات الواجهة الأمامية
echo "📦 تثبيت تبعيات الواجهة الأمامية..."
cd naebak-frontend-nextjs
npm install
cd ..

# إعداد SSL للتطوير
echo "🔒 إعداد شهادات SSL للتطوير..."
if [ ! -f ssl/localhost.crt ]; then
    mkdir -p ssl
    openssl req -x509 -newkey rsa:4096 -keyout ssl/localhost.key -out ssl/localhost.crt -days 365 -nodes -subj "/CN=localhost"
    echo "✅ تم إنشاء شهادات SSL للتطوير"
fi

echo "✅ تم إعداد المشروع بنجاح!"
echo ""
echo "🚀 لتشغيل المشروع:"
echo "   docker-compose up"
echo ""
echo "🌐 الروابط:"
echo "   الواجهة الأمامية: http://localhost:3000"
echo "   خدمة المصادقة: http://localhost:8001"
echo "   خدمة الشكاوى: http://localhost:8002"
echo "   خدمة الإدارة: http://localhost:8003"
```

### **7.2 سكريبت النسخ الاحتياطي**

```bash
#!/bin/bash
# backup.sh

set -e

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 بدء النسخ الاحتياطي..."

# نسخ احتياطية لقواعد البيانات
echo "🗄️ نسخ احتياطي لقواعد البيانات..."
for db in naebak_auth naebak_complaints naebak_admin; do
    echo "  - نسخ احتياطي لقاعدة بيانات $db..."
    docker exec postgres pg_dump -U naebak_user $db > "$BACKUP_DIR/$db.sql"
done

# نسخ احتياطي لـ Redis
echo "📊 نسخ احتياطي لـ Redis..."
docker exec redis redis-cli BGSAVE
docker cp redis:/data/dump.rdb "$BACKUP_DIR/redis_dump.rdb"

# نسخ احتياطي للملفات المرفوعة
echo "📁 نسخ احتياطي للملفات..."
tar -czf "$BACKUP_DIR/media_files.tar.gz" media/
tar -czf "$BACKUP_DIR/static_files.tar.gz" static/

# نسخ احتياطي للسجلات
echo "📋 نسخ احتياطي للسجلات..."
tar -czf "$BACKUP_DIR/logs.tar.gz" logs/

# إنشاء ملف معلومات النسخة الاحتياطية
cat > "$BACKUP_DIR/backup_info.txt" << EOF
تاريخ النسخ الاحتياطي: $(date)
إصدار النظام: $(git rev-parse HEAD)
حجم النسخة الاحتياطية: $(du -sh "$BACKUP_DIR" | cut -f1)
EOF

echo "✅ تم إنشاء النسخة الاحتياطية في: $BACKUP_DIR"

# حذف النسخ الاحتياطية القديمة (أكثر من 30 يوم)
find backups/ -type d -mtime +30 -exec rm -rf {} + 2>/dev/null || true

echo "🧹 تم حذف النسخ الاحتياطية القديمة"
```

---

## 📋 **8. خلاصة قوالب الإعدادات**

### **الملفات المتوفرة:**
- ✅ **Docker**: قوالب Dockerfile و docker-compose
- ✅ **Django**: إعدادات كاملة للتطوير والإنتاج
- ✅ **Flask**: إعدادات مرنة لجميع البيئات
- ✅ **Next.js**: إعدادات متقدمة مع TypeScript
- ✅ **GitHub Actions**: CI/CD كامل
- ✅ **المراقبة**: Prometheus و Grafana
- ✅ **السكريبتات**: إعداد ونسخ احتياطي

### **كيفية الاستخدام:**
1. **نسخ القوالب** إلى مجلدات الخدمات
2. **تحديث متغيرات البيئة** حسب البيئة
3. **تشغيل سكريبت الإعداد** `./setup.sh`
4. **اختبار الخدمات** محلياً
5. **النشر** باستخدام GitHub Actions

### **المميزات:**
- 🚀 **إعداد سريع** - دقائق بدلاً من ساعات
- 🔒 **أمان عالي** - إعدادات أمان متقدمة
- 📊 **مراقبة شاملة** - تتبع الأداء والأخطاء
- 🔄 **CI/CD تلقائي** - نشر آمن ومتدرج
- 📦 **نسخ احتياطية** - حماية البيانات

هذه القوالب توفر أساساً قوياً ومرناً لتطوير ونشر مشروع نائبك بكفاءة عالية.
