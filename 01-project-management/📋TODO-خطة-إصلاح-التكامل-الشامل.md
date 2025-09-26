# 📋 TODO - خطة إصلاح التكامل الشامل لمشروع نائبك

## 📅 تاريخ الإنشاء: 26 سبتمبر 2025
## 🎯 الهدف: تحويل المشروع إلى منصة متكاملة جاهزة للإنتاج

---

## 🚀 **نظرة عامة على الخطة**

بناءً على نتائج اختبار التكامل الشامل، تم تحديد **4 مراحل رئيسية** لإكمال المشروع وتحقيق التكامل الكامل بين جميع الخدمات.

**الحالة الحالية:** 
- ✅ كود احترافي ممتاز (97% مكتمل)
- ⚠️ تكامل متوسط (يحتاج إصلاح)
- 🎯 **الهدف:** تكامل ممتاز (95%+)

---

## 📊 **ملخص المراحل والجدول الزمني**

| المرحلة | المدة | الأولوية | الحالة |
|---------|------|---------|--------|
| **المرحلة الأولى:** إصلاح التبعيات | 1-2 يوم | 🔴 عالية جداً | ⏳ قيد التنفيذ |
| **المرحلة الثانية:** البنية التحتية | 2-3 أيام | 🔴 عالية جداً | ⏸️ في الانتظار |
| **المرحلة الثالثة:** اختبار التكامل | 3-5 أيام | 🟡 متوسطة | ⏸️ في الانتظار |
| **المرحلة الرابعة:** التحسين والنشر | 2-3 أيام | 🟢 منخفضة | ⏸️ في الانتظار |

**إجمالي الوقت المتوقع:** 8-13 يوم عمل

---

## 🔧 **المرحلة الأولى: إصلاح التبعيات والتكوين**
### ⏰ **المدة:** 1-2 يوم | 🔴 **الأولوية:** عالية جداً

### **الهدف:**
تثبيت جميع التبعيات المفقودة وإصلاح مشاكل التكوين الأساسية.

### **المهام المطلوبة:**

#### **1.1 تثبيت تبعيات Python (4-6 ساعات)**

##### **🔐 naebak-auth-service:**
```bash
cd naebak-auth-service
pip install -r requirements.txt
pip install django djangorestframework django-cors-headers
pip install psycopg2-binary redis celery
pip install python-decouple django-environ
```

##### **🌐 naebak-gateway:**
```bash
cd naebak-gateway
pip install -r requirements.txt
pip install flask flask-cors requests
pip install redis python-dotenv
pip install gunicorn
```

##### **💬 naebak-messaging-service:**
```bash
cd naebak-messaging-service
pip install -r requirements.txt
# التبعيات مُثبتة مسبقاً ✅
```

##### **🔔 naebak-notifications-service:**
```bash
cd naebak-notifications-service
pip install -r requirements.txt
# التبعيات مُثبتة مسبقاً ✅
```

#### **1.2 تثبيت تبعيات Node.js (2-3 ساعات)**

##### **🖥️ naebak-admin-frontend:**
```bash
cd naebak-admin-frontend
npm install --legacy-peer-deps
npm audit fix
npm run build  # اختبار البناء
```

#### **1.3 إنشاء ملفات التكوين (2-3 ساعات)**

##### **إنشاء ملفات .env لكل خدمة:**

**naebak-auth-service/.env:**
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/naebak_auth
REDIS_URL=redis://localhost:6379/0
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3001,http://localhost:8000
```

**naebak-gateway/.env:**
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
AUTH_SERVICE_URL=http://localhost:8001
MESSAGING_SERVICE_URL=http://localhost:8002
NOTIFICATIONS_SERVICE_URL=http://localhost:8003
REDIS_URL=redis://localhost:6379/1
```

**naebak-messaging-service/.env:**
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/naebak_messaging
REDIS_URL=redis://localhost:6379/2
SOCKETIO_ASYNC_MODE=threading
```

**naebak-notifications-service/.env:**
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/naebak_notifications
REDIS_URL=redis://localhost:6379/3
SENDGRID_API_KEY=your-sendgrid-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
```

**naebak-admin-frontend/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8002
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3001
```

#### **1.4 إصلاح مشاكل التكوين (1-2 ساعة)**

##### **إنشاء مجلدات مفقودة:**
```bash
# Auth Service
mkdir -p naebak-auth-service/static
mkdir -p naebak-auth-service/media
mkdir -p naebak-auth-service/logs

# جميع الخدمات
for service in naebak-*-service; do
  mkdir -p $service/logs
  mkdir -p $service/tmp
done
```

##### **إصلاح أذونات الملفات:**
```bash
chmod +x naebak-gateway/app.py
chmod +x naebak-messaging-service/app.py
chmod +x naebak-notifications-service/app.py
```

### **معايير الإنجاز للمرحلة الأولى:**
- [ ] جميع التبعيات مُثبتة بنجاح
- [ ] ملفات .env مُنشأة لجميع الخدمات
- [ ] لا توجد أخطاء import عند تشغيل `python -c "import app"`
- [ ] Admin Frontend يبنى بنجاح مع `npm run build`
- [ ] جميع الخدمات تمر اختبار `python manage.py check` (Django) أو syntax check

---

## 🏗️ **المرحلة الثانية: إعداد البنية التحتية**
### ⏰ **المدة:** 2-3 أيام | 🔴 **الأولوية:** عالية جداً

### **الهدف:**
إعداد قواعد البيانات والخدمات المساعدة المطلوبة للتشغيل.

### **المهام المطلوبة:**

#### **2.1 إعداد قواعد البيانات (1 يوم)**

##### **تثبيت PostgreSQL:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# إنشاء قواعد البيانات
sudo -u postgres createdb naebak_auth
sudo -u postgres createdb naebak_messaging
sudo -u postgres createdb naebak_notifications
sudo -u postgres createdb naebak_complaints
sudo -u postgres createdb naebak_content

# إنشاء مستخدم قاعدة البيانات
sudo -u postgres createuser --interactive naebak_user
sudo -u postgres psql -c "ALTER USER naebak_user PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE naebak_auth TO naebak_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE naebak_messaging TO naebak_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE naebak_notifications TO naebak_user;"
```

##### **تثبيت Redis:**
```bash
# Ubuntu/Debian
sudo apt install redis-server

# تكوين Redis
sudo systemctl enable redis-server
sudo systemctl start redis-server

# اختبار Redis
redis-cli ping  # يجب أن يرجع PONG
```

#### **2.2 إعداد Message Queue (4-6 ساعات)**

##### **تثبيت RabbitMQ (اختياري - يمكن استخدام Redis):**
```bash
sudo apt install rabbitmq-server
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server

# إنشاء مستخدم RabbitMQ
sudo rabbitmqctl add_user naebak_user secure_password
sudo rabbitmqctl set_user_tags naebak_user administrator
sudo rabbitmqctl set_permissions -p / naebak_user ".*" ".*" ".*"
```

#### **2.3 تشغيل Migration وإعداد البيانات (4-6 ساعات)**

##### **Django Services Migration:**
```bash
# Auth Service
cd naebak-auth-service
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser

# إنشاء بيانات تجريبية
python manage.py loaddata fixtures/sample_data.json  # إذا كان متوفر
```

##### **Flask Services Database Setup:**
```bash
# Messaging Service
cd naebak-messaging-service
python -c "
from app import app, db
with app.app_context():
    db.create_all()
    print('Messaging database created successfully')
"

# Notifications Service
cd naebak-notifications-service
python -c "
from app import app, db
with app.app_context():
    db.create_all()
    print('Notifications database created successfully')
"
```

#### **2.4 إعداد خدمات خارجية (2-4 ساعات)**

##### **إعداد SendGrid للإيميل:**
1. إنشاء حساب SendGrid
2. الحصول على API Key
3. تحديث متغير `SENDGRID_API_KEY` في .env

##### **إعداد Twilio للـ SMS:**
1. إنشاء حساب Twilio
2. الحصول على Account SID و Auth Token
3. تحديث متغيرات Twilio في .env

##### **إعداد Firebase للـ Push Notifications:**
1. إنشاء مشروع Firebase
2. تحميل ملف credentials JSON
3. وضع الملف في مجلد الخدمة وتحديث المسار

### **معايير الإنجاز للمرحلة الثانية:**
- [ ] PostgreSQL يعمل وقواعد البيانات مُنشأة
- [ ] Redis يعمل ويستجيب للاتصالات
- [ ] جميع migrations تمت بنجاح
- [ ] خدمات خارجية مُكونة (SendGrid, Twilio, Firebase)
- [ ] بيانات تجريبية مُحملة للاختبار

---

## 🧪 **المرحلة الثالثة: اختبار التكامل المتقدم**
### ⏰ **المدة:** 3-5 أيام | 🟡 **الأولوية:** متوسطة

### **الهدف:**
اختبار التكامل الحقيقي بين جميع الخدمات وضمان عملها معاً.

### **المهام المطلوبة:**

#### **3.1 اختبار بدء التشغيل المتزامن (1 يوم)**

##### **إنشاء سكريبت تشغيل شامل:**
```bash
# إنشاء ملف start_all_services.sh
#!/bin/bash

echo "🚀 Starting Naebak Platform Services..."

# Start Redis
sudo systemctl start redis-server
echo "✅ Redis started"

# Start PostgreSQL
sudo systemctl start postgresql
echo "✅ PostgreSQL started"

# Start Auth Service
cd naebak-auth-service
python manage.py runserver 0.0.0.0:8001 &
AUTH_PID=$!
echo "✅ Auth Service started (PID: $AUTH_PID)"

# Start Gateway
cd ../naebak-gateway
python app.py &
GATEWAY_PID=$!
echo "✅ Gateway started (PID: $GATEWAY_PID)"

# Start Messaging Service
cd ../naebak-messaging-service
python app.py &
MESSAGING_PID=$!
echo "✅ Messaging Service started (PID: $MESSAGING_PID)"

# Start Notifications Service
cd ../naebak-notifications-service
python app.py &
NOTIFICATIONS_PID=$!
echo "✅ Notifications Service started (PID: $NOTIFICATIONS_PID)"

# Start Admin Frontend
cd ../naebak-admin-frontend
npm run dev &
FRONTEND_PID=$!
echo "✅ Admin Frontend started (PID: $FRONTEND_PID)"

echo "🎉 All services started successfully!"
echo "PIDs: Auth=$AUTH_PID, Gateway=$GATEWAY_PID, Messaging=$MESSAGING_PID, Notifications=$NOTIFICATIONS_PID, Frontend=$FRONTEND_PID"

# Wait for services to be ready
sleep 10

# Health check
echo "🔍 Performing health checks..."
curl -f http://localhost:8001/health && echo "✅ Auth Service healthy"
curl -f http://localhost:8000/health && echo "✅ Gateway healthy"
curl -f http://localhost:8002/health && echo "✅ Messaging Service healthy"
curl -f http://localhost:8003/health && echo "✅ Notifications Service healthy"
curl -f http://localhost:3001 && echo "✅ Admin Frontend healthy"
```

#### **3.2 اختبار APIs والتواصل (1-2 يوم)**

##### **اختبار تسجيل المستخدمين:**
```bash
# اختبار تسجيل مستخدم جديد
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPassword123!",
    "first_name": "Test",
    "last_name": "User"
  }'

# اختبار تسجيل الدخول
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPassword123!"
  }'
```

##### **اختبار الرسائل والإشعارات:**
```bash
# اختبار إرسال رسالة
curl -X POST http://localhost:8000/api/v1/messaging/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "recipient_id": "user123",
    "message": "Hello from integration test!",
    "type": "direct"
  }'

# اختبار إرسال إشعار
curl -X POST http://localhost:8000/api/v1/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "recipient_id": "user123",
    "title": "Test Notification",
    "message": "This is a test notification",
    "type": "info",
    "channels": ["email", "push"]
  }'
```

#### **3.3 اختبار سير العمل الكامل (1-2 يوم)**

##### **سيناريو 1: تقديم شكوى مواطن**
1. تسجيل مواطن جديد
2. تسجيل دخول المواطن
3. تقديم شكوى جديدة
4. إرسال إشعار للنائب المختص
5. رد النائب على الشكوى
6. إرسال إشعار للمواطن بالرد

##### **سيناريو 2: محادثة فورية**
1. بدء محادثة بين مواطن ونائب
2. تبادل رسائل فورية
3. إرسال إشعارات للأطراف
4. حفظ سجل المحادثة

##### **سيناريو 3: إدارة النظام**
1. دخول المدير للوحة التحكم
2. مراجعة الإحصائيات
3. إدارة المستخدمين
4. مراقبة النشاط

### **معايير الإنجاز للمرحلة الثالثة:**
- [ ] جميع الخدمات تبدأ بنجاح وتستجيب للـ health checks
- [ ] APIs تعمل بشكل صحيح مع استجابات متوقعة
- [ ] التواصل بين الخدمات يعمل بدون أخطاء
- [ ] سير العمل الكامل يعمل من البداية للنهاية
- [ ] لا توجد أخطاء في logs الخدمات

---

## 🚀 **المرحلة الرابعة: التحسين والنشر**
### ⏰ **المدة:** 2-3 أيام | 🟢 **الأولوية:** منخفضة

### **الهدف:**
تحسين الأداء وإعداد المشروع للنشر في بيئة الإنتاج.

### **المهام المطلوبة:**

#### **4.1 تحسين الأداء (1 يوم)**

##### **تحسين قواعد البيانات:**
```sql
-- إضافة indexes مهمة
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_messages_timestamp ON messages(created_at);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
```

##### **تحسين Redis Caching:**
```python
# إضافة caching للبيانات المتكررة
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

#### **4.2 إعداد المراقبة والـ Logging (4-6 ساعات)**

##### **إعداد Logging شامل:**
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/naebak.log',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'INFO',
    },
}
```

##### **إعداد Health Monitoring:**
```python
# إضافة endpoint للمراقبة المتقدمة
@app.route('/health/detailed')
def detailed_health():
    return {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'database': check_database_connection(),
        'redis': check_redis_connection(),
        'memory_usage': get_memory_usage(),
        'cpu_usage': get_cpu_usage()
    }
```

#### **4.3 إعداد Docker والنشر (1 يوم)**

##### **إنشاء Dockerfile لكل خدمة:**
```dockerfile
# naebak-auth-service/Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8001

CMD ["gunicorn", "--bind", "0.0.0.0:8001", "config.wsgi:application"]
```

##### **إنشاء docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: naebak
      POSTGRES_USER: naebak_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  auth-service:
    build: ./naebak-auth-service
    ports:
      - "8001:8001"
    depends_on:
      - postgres
      - redis
    environment:
      - DATABASE_URL=postgresql://naebak_user:secure_password@postgres:5432/naebak
      - REDIS_URL=redis://redis:6379/0

  gateway:
    build: ./naebak-gateway
    ports:
      - "8000:8000"
    depends_on:
      - auth-service
      - messaging-service
      - notifications-service

  messaging-service:
    build: ./naebak-messaging-service
    ports:
      - "8002:8002"
    depends_on:
      - postgres
      - redis

  notifications-service:
    build: ./naebak-notifications-service
    ports:
      - "8003:8003"
    depends_on:
      - postgres
      - redis

  admin-frontend:
    build: ./naebak-admin-frontend
    ports:
      - "3001:3001"
    depends_on:
      - gateway

volumes:
  postgres_data:
```

#### **4.4 اختبار الأداء والحمولة (4-6 ساعات)**

##### **اختبار الحمولة باستخدام Apache Bench:**
```bash
# اختبار تسجيل الدخول
ab -n 1000 -c 10 -p login_data.json -T application/json http://localhost:8000/api/v1/auth/login

# اختبار إرسال الرسائل
ab -n 500 -c 5 -H "Authorization: Bearer TOKEN" http://localhost:8000/api/v1/messaging/conversations

# اختبار الإشعارات
ab -n 200 -c 5 -p notification_data.json -T application/json -H "Authorization: Bearer TOKEN" http://localhost:8000/api/v1/notifications/send
```

### **معايير الإنجاز للمرحلة الرابعة:**
- [ ] جميع الخدمات محسنة للأداء
- [ ] Logging شامل ومراقبة متقدمة
- [ ] Docker containers تعمل بنجاح
- [ ] اختبار الحمولة يظهر أداء مقبول
- [ ] المشروع جاهز للنشر في الإنتاج

---

## 📊 **مؤشرات النجاح والمتابعة**

### **مؤشرات الأداء الرئيسية (KPIs):**

| المؤشر | الهدف | الحالة الحالية | الحالة المستهدفة |
|--------|------|----------------|------------------|
| **معدل نجاح بدء التشغيل** | 95%+ | 20% | 95%+ |
| **معدل نجاح التواصل بين الخدمات** | 90%+ | 40% | 90%+ |
| **معدل نجاح المصادقة** | 95%+ | 20% | 95%+ |
| **زمن الاستجابة للـ APIs** | <200ms | غير محدد | <200ms |
| **معدل نجاح الإشعارات** | 98%+ | غير محدد | 98%+ |
| **Uptime للخدمات** | 99.9%+ | غير محدد | 99.9%+ |

### **تقارير التقدم:**

#### **تقرير يومي:**
- [ ] عدد المهام المكتملة
- [ ] المشاكل المواجهة والحلول
- [ ] الخطوات التالية لليوم التالي

#### **تقرير أسبوعي:**
- [ ] تقدم كل مرحلة
- [ ] مقارنة الجدول الزمني المخطط مع الفعلي
- [ ] تحديث التوقعات والمخاطر

### **إدارة المخاطر:**

| المخاطرة | الاحتمالية | التأثير | خطة التخفيف |
|----------|------------|---------|-------------|
| **مشاكل في التبعيات** | متوسط | عالي | استخدام Docker containers |
| **مشاكل قواعد البيانات** | منخفض | عالي | إعداد backup واستعادة |
| **مشاكل الأداء** | متوسط | متوسط | اختبار مبكر وتحسين تدريجي |
| **تأخير في الجدول الزمني** | متوسط | متوسط | إعادة ترتيب الأولويات |

---

## 🎯 **الخطوات التالية الفورية**

### **اليوم الأول (الآن):**
1. **مراجعة هذا الملف** والموافقة على الخطة
2. **تحضير البيئة** - تثبيت PostgreSQL و Redis
3. **البدء في المرحلة الأولى** - تثبيت التبعيات

### **الأسبوع الأول:**
- إكمال المرحلة الأولى والثانية
- بدء المرحلة الثالثة
- إعداد تقارير التقدم اليومية

### **الأسبوع الثاني:**
- إكمال المرحلة الثالثة
- بدء المرحلة الرابعة
- إعداد النشر التجريبي

---

## 📞 **جهات الاتصال والدعم**

### **فريق التطوير:**
- **مطور Backend:** مسؤول عن الخدمات والـ APIs
- **مطور Frontend:** مسؤول عن واجهة الإدارة
- **مهندس DevOps:** مسؤول عن البنية التحتية والنشر
- **مهندس QA:** مسؤول عن الاختبار والجودة

### **الموارد والأدوات:**
- **GitHub:** إدارة الكود والإصدارات
- **Docker:** containerization والنشر
- **PostgreSQL:** قاعدة البيانات الرئيسية
- **Redis:** التخزين المؤقت والـ message queue
- **Monitoring:** أدوات مراقبة الأداء

---

## 🏆 **الرؤية النهائية**

بعد إكمال هذه الخطة، ستصبح **منصة نائبك**:

### **منصة متكاملة عالمية المستوى:**
- ✅ **أداء عالي:** استجابة سريعة وموثوقية عالية
- ✅ **أمان متقدم:** حماية شاملة للبيانات والمستخدمين
- ✅ **قابلية التوسع:** قادرة على خدمة ملايين المستخدمين
- ✅ **سهولة الصيانة:** كود منظم وموثق بشكل ممتاز

### **خدمة المواطنين المصريين:**
- 🇪🇬 **تواصل فعال** بين المواطنين والنواب
- 🇪🇬 **شفافية كاملة** في معالجة الشكاوى
- 🇪🇬 **خدمة 24/7** مع إشعارات فورية
- 🇪🇬 **واجهة عربية** سهلة الاستخدام

**🚀 المشروع جاهز لخدمة الوطن والمواطنين!**

---

## 📋 **قائمة المراجعة النهائية**

### **قبل البدء:**
- [ ] قراءة وفهم الخطة كاملة
- [ ] تحضير البيئة التطويرية
- [ ] تحديد فريق العمل والمسؤوليات
- [ ] إعداد أدوات المتابعة والتقارير

### **أثناء التنفيذ:**
- [ ] متابعة التقدم اليومي
- [ ] حل المشاكل فور ظهورها
- [ ] تحديث الخطة عند الحاجة
- [ ] التواصل المستمر مع الفريق

### **بعد الإكمال:**
- [ ] اختبار شامل للمنصة
- [ ] تدريب المستخدمين
- [ ] إطلاق تجريبي محدود
- [ ] الإطلاق الرسمي

**تاريخ آخر تحديث:** 26 سبتمبر 2025  
**الإصدار:** 1.0  
**الحالة:** جاهز للتنفيذ ✅
