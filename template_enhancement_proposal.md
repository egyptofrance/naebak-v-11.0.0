# اقتراح تطوير قوالب المايكروسيرفيس لتطبيق "نائبك"

## الهدف الأساسي
تحويل القوالب الموجودة من قوالب عامة إلى قوالب **مخصصة ومهيأة** لكل خدمة، بحيث يصبح التطوير النهائي مجرد إضافة منطق العمل (Business Logic) فقط.

---

## 1. التخصيصات الأساسية المطلوبة

### أ) إعدادات Google Cloud المخصصة

#### لكل خدمة:
```python
# settings/cloud_config.py
GOOGLE_CLOUD_PROJECT = "naebak-472518"
CLOUD_RUN_SERVICE_NAME = "naibak-auth-service"  # مخصص لكل خدمة
CLOUD_SQL_INSTANCE = "naibak-db"
REDIS_INSTANCE = "naibak-redis"

# Database URLs مخصصة
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'naibak_auth_db',  # مخصص لكل خدمة
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': '/cloudsql/naebak-472518:us-central1:naibak-db',
        'PORT': '5432',
    }
}
```

### ب) متغيرات البيئة المخصصة

#### ملف `.env.template` لكل خدمة:
```env
# خدمة المصادقة - naibak-auth-service
SERVICE_NAME=naibak-auth-service
DATABASE_NAME=naibak_auth_db
REDIS_DB_INDEX=0

# خدمة الرسائل - naibak-messaging-service  
SERVICE_NAME=naibak-messaging-service
DATABASE_NAME=naibak_messaging_db
REDIS_DB_INDEX=1

# وهكذا لكل خدمة...
```

---

## 2. التخصيصات التقنية المطلوبة

### أ) نماذج البيانات الجاهزة

#### خدمة المصادقة:
```python
# models/auth_models.py - جاهز ومكتوب
class User(AbstractUser):
    user_type = models.CharField(choices=[('citizen', 'مواطن'), ('candidate', 'مرشح')])
    national_id = models.CharField(max_length=14, unique=True)
    governorate = models.CharField(max_length=50)
    phone = models.CharField(max_length=15)
    is_verified = models.BooleanField(default=False)
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
```

#### خدمة الرسائل:
```python
# models/messaging_models.py - جاهز ومكتوب
class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient_type = models.CharField(choices=[('candidate', 'مرشح'), ('representative', 'نائب')])
    recipient_id = models.IntegerField()
    content = models.TextField(max_length=500)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

### ب) APIs الجاهزة

#### خدمة المصادقة - ViewSets جاهزة:
```python
# views/auth_views.py - مكتوب ومجهز
class AuthViewSet(viewsets.ModelViewSet):
    @action(detail=False, methods=['post'])
    def login(self, request):
        # كود تسجيل الدخول جاهز
        pass
    
    @action(detail=False, methods=['post'])  
    def register(self, request):
        # كود التسجيل جاهز
        pass
        
    @action(detail=False, methods=['post'])
    def logout(self, request):
        # كود تسجيل الخروج جاهز
        pass
```

### ج) Serializers المخصصة

```python
# serializers/auth_serializers.py - جاهز
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 
                 'national_id', 'governorate', 'phone', 'user_type']
```

---

## 3. ملفات التكوين الجاهزة

### أ) Docker مخصص لكل خدمة

```dockerfile
# Dockerfile - مخصص لخدمة المصادقة
FROM python:3.11-slim
WORKDIR /app

# متغيرات مخصصة للخدمة
ENV SERVICE_NAME=naibak-auth-service
ENV PORT=8000

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# تشغيل migrations مخصصة للخدمة
RUN python manage.py makemigrations auth_app
RUN python manage.py migrate

EXPOSE 8000
CMD ["gunicorn", "naibak_auth_service.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### ب) GitHub Actions مخصصة

```yaml
# .github/workflows/deploy-auth-service.yml
name: Deploy Auth Service
on:
  push:
    branches: [main]
    paths: ['naibak-auth-service/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy naibak-auth-service \
            --source=./naibak-auth-service \
            --region=us-central1 \
            --allow-unauthenticated
```

---

## 4. البيانات الأولية (Fixtures) الجاهزة

### أ) المحافظات المصرية
```json
// fixtures/governorates.json - جاهز
[
  {"model": "core.governorate", "pk": 1, "fields": {"name": "القاهرة", "code": "CAI"}},
  {"model": "core.governorate", "pk": 2, "fields": {"name": "الجيزة", "code": "GIZ"}},
  // ... باقي المحافظات
]
```

### ب) الأحزاب السياسية
```json
// fixtures/political_parties.json - جاهز
[
  {"model": "core.party", "pk": 1, "fields": {"name": "مستقل", "color": "#808080"}},
  {"model": "core.party", "pk": 2, "fields": {"name": "مستقبل وطن", "color": "#FF6B35"}},
  // ... باقي الأحزاب
]
```

---

## 5. اختبارات مخصصة لكل خدمة

### أ) اختبارات خدمة المصادقة
```python
# tests/test_auth_service.py - جاهز ومكتوب
class AuthServiceTestCase(TestCase):
    def test_user_registration(self):
        # اختبار تسجيل مستخدم جديد
        pass
        
    def test_user_login(self):
        # اختبار تسجيل الدخول
        pass
        
    def test_jwt_token_generation(self):
        # اختبار إنشاء JWT tokens
        pass
```

---

## 6. التوثيق التلقائي المخصص

### أ) Swagger/OpenAPI مخصص
```python
# docs/auth_service_schema.py - جاهز
AUTH_SERVICE_SCHEMA = {
    "info": {
        "title": "خدمة المصادقة - نائبك",
        "description": "APIs خاصة بتسجيل الدخول والمصادقة",
        "version": "1.0.0"
    },
    "paths": {
        "/api/auth/login/": {
            "post": {
                "summary": "تسجيل الدخول",
                "description": "تسجيل دخول المستخدم باستخدام البريد الإلكتروني وكلمة المرور"
            }
        }
    }
}
```

---

## 7. سكريبتات الإعداد التلقائي

### أ) سكريبت إعداد الخدمة
```bash
#!/bin/bash
# scripts/setup_service.sh - لكل خدمة

SERVICE_NAME=$1
echo "إعداد خدمة: $SERVICE_NAME"

# إنشاء قاعدة البيانات
gcloud sql databases create ${SERVICE_NAME}_db --instance=naibak-db

# إنشاء المتغيرات في Secret Manager
echo "database-url-${SERVICE_NAME}" | gcloud secrets create db-url-${SERVICE_NAME} --data-file=-

# تشغيل Migrations
python manage.py migrate

echo "تم إعداد $SERVICE_NAME بنجاح!"
```

---

## 8. مراقبة مخصصة لكل خدمة

### أ) Health Checks مخصصة
```python
# health/auth_health.py - لخدمة المصادقة
class AuthHealthCheck:
    def check_database_connection(self):
        # فحص اتصال قاعدة بيانات المصادقة
        pass
        
    def check_jwt_service(self):
        # فحص خدمة JWT
        pass
        
    def check_redis_connection(self):
        # فحص اتصال Redis للجلسات
        pass
```

---

## 9. الاقتراح النهائي للتنفيذ

### المرحلة الأولى: تخصيص القوالب (أسبوع واحد)
1. **تخصيص إعدادات Google Cloud** لكل خدمة
2. **إنشاء نماذج البيانات الجاهزة** لكل خدمة
3. **كتابة APIs الأساسية** لكل خدمة
4. **إعداد ملفات Docker وCI/CD** المخصصة

### المرحلة الثانية: البيانات والاختبارات (أسبوع واحد)
1. **إضافة البيانات الأولية** (المحافظات، الأحزاب، إلخ)
2. **كتابة الاختبارات المخصصة** لكل خدمة
3. **إعداد التوثيق التلقائي**
4. **إنشاء سكريبتات الإعداد**

### المرحلة الثالثة: التكامل والنشر (أسبوع واحد)
1. **اختبار التكامل بين الخدمات**
2. **نشر جميع الخدمات على Cloud Run**
3. **إعداد المراقبة والتنبيهات**
4. **اختبار النظام الكامل**

---

## النتيجة المتوقعة

بعد هذا التطوير، سيصبح إنشاء خدمة جديدة أو تطوير خدمة موجودة مجرد:

1. **استنساخ القالب المخصص**
2. **إضافة منطق العمل المطلوب**
3. **تشغيل سكريبت النشر**

**وقت التطوير سينخفض من أسابيع إلى أيام!** 🚀

---

## الخلاصة

هذا التطوير سيوفر:
- ⏰ **90% من وقت التطوير**
- 🔒 **أمان موحد ومضمون**
- 📊 **مراقبة شاملة لجميع الخدمات**
- 🚀 **نشر سريع وآمن**
- 📚 **توثيق تلقائي ومحدث**

هل تريد مني البدء في تنفيذ هذا الاقتراح؟
