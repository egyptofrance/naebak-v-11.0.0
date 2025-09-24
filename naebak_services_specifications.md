# مواصفات الخدمات التقنية - مشروع Naebak

---

## 🏗️ **البنية العامة للمايكروسيرفيس**

### **المعايير الموحدة:**
```yaml
Framework Standards:
  - Django 4.2+ (للخدمات الكبيرة)
  - Flask 2.3+ (للخدمات الصغيرة)
  - Python 3.11+
  - Docker containerization
  - Google Cloud Run deployment

Security Standards:
  - JWT authentication
  - HTTPS only
  - Rate limiting
  - Input validation
  - SQL injection protection
  - XSS protection

Monitoring Standards:
  - Health check endpoints
  - Structured logging
  - Error tracking
  - Performance metrics
  - Uptime monitoring
```

---

## 🔐 **1. خدمة المصادقة (Auth Service)**

### **المواصفات التقنية:**
```yaml
Service Name: naebak-auth-service
Port: 8001
Framework: Django 4.2
Database: PostgreSQL 14
Cache: Redis 6.2
Container: Python 3.11-slim

Dependencies:
  - djangorestframework==3.14.0
  - django-cors-headers==4.3.1
  - PyJWT==2.8.0
  - bcrypt==4.0.1
  - redis==5.0.1
  - psycopg2-binary==2.9.7
  - celery==5.3.4
  - django-ratelimit==4.1.0
  - phonenumbers==8.13.25
  - Pillow==10.1.0

Environment Variables:
  - DATABASE_URL
  - REDIS_URL
  - JWT_SECRET_KEY
  - JWT_EXPIRY_HOURS=24
  - RATE_LIMIT_PER_MINUTE=60
  - PHONE_VERIFICATION_ENABLED=true
  - EMAIL_VERIFICATION_ENABLED=true
  - MAX_LOGIN_ATTEMPTS=5
  - LOCKOUT_DURATION_MINUTES=30

Health Check:
  endpoint: /health
  timeout: 5s
  interval: 30s

Resource Limits:
  cpu: 0.5
  memory: 512Mi
  max_instances: 10
  min_instances: 1
```

### **بنية المجلدات:**
```
naebak-auth-service/
├── app/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── users/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── utils.py
├── authentication/
│   ├── jwt_auth.py
│   ├── permissions.py
│   └── middleware.py
├── verification/
│   ├── phone_verification.py
│   ├── email_verification.py
│   └── tasks.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

### **نماذج البيانات الأساسية:**
```python
# users/models.py
class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    national_id = models.CharField(max_length=14, unique=True)
    governorate = models.CharField(max_length=50)
    # ... باقي الحقول حسب النوع
```

---

## 🏛️ **2. خدمة الإدارة (Admin Service)**

### **المواصفات التقنية:**
```yaml
Service Name: naebak-admin-service
Port: 8002
Framework: Django 4.2
Database: PostgreSQL 14
Cache: Redis 6.2

Dependencies:
  - djangorestframework==3.14.0
  - django-admin-interface==0.26.0
  - django-import-export==3.3.1
  - openpyxl==3.1.2
  - reportlab==4.0.7
  - django-extensions==3.2.3
  - django-debug-toolbar==4.2.0

Environment Variables:
  - DATABASE_URL
  - REDIS_URL
  - ADMIN_SECRET_KEY
  - EXPORT_MAX_RECORDS=10000
  - BACKUP_RETENTION_DAYS=30
  - LOG_LEVEL=INFO

Features:
  - Party management
  - Complaint types management
  - User management
  - System settings
  - Data export/import
  - Audit logging
  - Backup management

Resource Limits:
  cpu: 0.3
  memory: 256Mi
  max_instances: 5
  min_instances: 1
```

### **بنية المجلدات:**
```
naebak-admin-service/
├── app/
├── parties/
│   ├── models.py
│   ├── admin.py
│   ├── serializers.py
│   └── views.py
├── complaint_types/
├── system_settings/
├── audit/
├── exports/
├── static/
├── templates/
├── requirements.txt
└── Dockerfile
```

---

## 📋 **3. خدمة الشكاوى (Complaints Service)**

### **المواصفات التقنية:**
```yaml
Service Name: naebak-complaints-service
Port: 8003
Framework: Django 4.2
Database: PostgreSQL 14
Storage: Google Cloud Storage
Queue: Celery + Redis

Dependencies:
  - djangorestframework==3.14.0
  - google-cloud-storage==2.10.0
  - celery==5.3.4
  - django-storages==1.14.2
  - Pillow==10.1.0
  - python-magic==0.4.27
  - django-filter==23.3

Environment Variables:
  - DATABASE_URL
  - REDIS_URL
  - GCS_BUCKET_NAME
  - MAX_FILE_SIZE_MB=10
  - MAX_FILES_PER_COMPLAINT=5
  - ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png,gif
  - AUTO_ASSIGN_ENABLED=true
  - NOTIFICATION_WEBHOOK_URL

Features:
  - File upload handling
  - Automatic assignment
  - Status tracking
  - Email notifications
  - Search and filtering
  - Bulk operations

Resource Limits:
  cpu: 0.8
  memory: 1Gi
  max_instances: 15
  min_instances: 2
```

### **بنية المجلدات:**
```
naebak-complaints-service/
├── app/
├── complaints/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── filters.py
│   └── tasks.py
├── attachments/
├── assignments/
├── notifications/
├── storage/
├── requirements.txt
└── Dockerfile
```

---

## 💬 **4. خدمة الرسائل (Messages Service)**

### **المواصفات التقنية:**
```yaml
Service Name: naebak-messages-service
Port: 8004
Framework: Django 4.2
Database: PostgreSQL 14
WebSocket: Django Channels
Cache: Redis 6.2

Dependencies:
  - djangorestframework==3.14.0
  - channels==4.0.0
  - channels-redis==4.1.0
  - django-private-chat==0.3.0
  - bleach==6.1.0

Environment Variables:
  - DATABASE_URL
  - REDIS_URL
  - WEBSOCKET_ENABLED=true
  - MESSAGE_RETENTION_DAYS=365
  - MAX_MESSAGE_LENGTH=1000
  - PROFANITY_FILTER_ENABLED=true

Features:
  - Real-time messaging
  - Message threads
  - File attachments
  - Message status tracking
  - Profanity filtering
  - Message encryption

Resource Limits:
  cpu: 0.6
  memory: 512Mi
  max_instances: 10
  min_instances: 2
```

---

## ⭐ **5. خدمة التقييمات (Ratings Service)**

### **المواصفات التقنية:**
```yaml
Service Name: naebak-ratings-service
Port: 8005
Framework: Django 4.2
Database: PostgreSQL 14
Cache: Redis 6.2

Dependencies:
  - djangorestframework==3.14.0
  - django-ratelimit==4.1.0
  - numpy==1.25.2
  - scipy==1.11.4

Environment Variables:
  - DATABASE_URL
  - REDIS_URL
  - MIN_RATINGS_FOR_FEATURED=100
  - FEATURED_THRESHOLD=4.5
  - RATING_COOLDOWN_HOURS=24
  - SPAM_DETECTION_ENABLED=true

Features:
  - Rating validation
  - Spam detection
  - Featured calculation
  - Statistics generation
  - Trend analysis
  - Caching optimization

Resource Limits:
  cpu: 0.4
  memory: 256Mi
  max_instances: 8
  min_instances: 1
```

---

## 👁️ **6. خدمة عداد الزوار (Visitor Counter Service)**

### **المواصفات التقنية:**
```yaml
Service Name: naebak-visitor-counter-service
Port: 8006
Framework: Flask 2.3
Database: SQLite + Redis
Lightweight: true

Dependencies:
  - Flask==2.3.3
  - Flask-RESTful==0.3.10
  - redis==5.0.1
  - APScheduler==3.10.4

Environment Variables:
  - REDIS_URL
  - COUNT_UNIQUE_IPS=true
  - RESET_DAILY=true
  - BACKUP_INTERVAL_HOURS=1

Features:
  - IP-based counting
  - Daily reset
  - Real-time updates
  - Backup to cloud
  - Simple analytics

Resource Limits:
  cpu: 0.1
  memory: 64Mi
  max_instances: 3
  min_instances: 1
```

### **بنية المجلدات:**
```
naebak-visitor-counter-service/
├── app.py
├── models.py
├── utils.py
├── config.py
├── requirements.txt
├── Dockerfile
└── README.md
```

---

## 📰 **7. خدمة الأخبار (News Service)**

### **المواصفات التقنية:**
```yaml
Service Name: naebak-news-service
Port: 8007
Framework: Flask 2.3
Database: SQLite
Cache: Redis 6.2

Dependencies:
  - Flask==2.3.3
  - Flask-SQLAlchemy==3.1.1
  - redis==5.0.1
  - bleach==6.1.0

Environment Variables:
  - REDIS_URL
  - NEWS_CACHE_TTL=300
  - MAX_NEWS_LENGTH=200
  - SCROLL_SPEED=50
  - AUTO_REFRESH_SECONDS=30

Features:
  - News management
  - Scrolling animation
  - Cache optimization
  - HTML sanitization
  - Scheduling support

Resource Limits:
  cpu: 0.1
  memory: 64Mi
  max_instances: 3
  min_instances: 1
```

---

## 🔔 **8. خدمة الإشعارات (Notifications Service)**

### **المواصفات التقنية:**
```yaml
Service Name: naebak-notifications-service
Port: 8008
Framework: Flask 2.3
Database: SQLite
Queue: Celery + Redis

Dependencies:
  - Flask==2.3.3
  - celery==5.3.4
  - redis==5.0.1
  - requests==2.31.0

Environment Variables:
  - REDIS_URL
  - NOTIFICATION_RETENTION_DAYS=30
  - MAX_NOTIFICATIONS_PER_USER=100
  - REAL_TIME_ENABLED=true

Features:
  - Real-time notifications
  - User preferences
  - Delivery tracking
  - Template system
  - Batch processing

Resource Limits:
  cpu: 0.2
  memory: 128Mi
  max_instances: 5
  min_instances: 1
```

---

## 🖼️ **9. خدمة البنرات (Banners Service)**

### **المواصفات التقنية:**
```yaml
Service Name: naebak-banners-service
Port: 8009
Framework: Flask 2.3
Database: SQLite
Storage: Google Cloud Storage

Dependencies:
  - Flask==2.3.3
  - google-cloud-storage==2.10.0
  - Pillow==10.1.0
  - python-magic==0.4.27

Environment Variables:
  - GCS_BUCKET_NAME
  - MAX_BANNER_SIZE_MB=5
  - ALLOWED_FORMATS=jpg,jpeg,png,gif,webp
  - IMAGE_OPTIMIZATION=true
  - CDN_ENABLED=true

Features:
  - Image upload/resize
  - Format optimization
  - CDN integration
  - Scheduling system
  - Analytics tracking

Resource Limits:
  cpu: 0.3
  memory: 256Mi
  max_instances: 5
  min_instances: 1
```

---

## 📄 **10. خدمة المحتوى (Content Service)**

### **المواصفات التقنية:**
```yaml
Service Name: naebak-content-service
Port: 8010
Framework: Flask 2.3
Database: SQLite
Cache: Redis 6.2

Dependencies:
  - Flask==2.3.3
  - Flask-SQLAlchemy==3.1.1
  - redis==5.0.1
  - bleach==6.1.0
  - markdown==3.5.1

Environment Variables:
  - REDIS_URL
  - CONTENT_CACHE_TTL=600
  - MARKDOWN_ENABLED=true
  - HTML_SANITIZATION=true
  - APPROVAL_REQUIRED=true

Features:
  - Content management
  - Markdown support
  - HTML sanitization
  - Approval workflow
  - Version control

Resource Limits:
  cpu: 0.2
  memory: 128Mi
  max_instances: 5
  min_instances: 1
```

---

## 🗄️ **11. خدمة التخزين المؤقت (Cache Service)**

### **المواصفات التقنية:**
```yaml
Service Name: naebak-cache-service
Port: 8011
Framework: Flask 2.3
Database: Redis 6.2
Type: Utility Service

Dependencies:
  - Flask==2.3.3
  - redis==5.0.1
  - hiredis==2.2.3

Environment Variables:
  - REDIS_URL
  - DEFAULT_TTL=3600
  - MAX_MEMORY_POLICY=allkeys-lru
  - COMPRESSION_ENABLED=true

Features:
  - Key-value storage
  - TTL management
  - Compression
  - Batch operations
  - Memory optimization

Resource Limits:
  cpu: 0.2
  memory: 128Mi
  max_instances: 3
  min_instances: 1
```

---

## 📊 **12. خدمة الإحصائيات (Statistics Service)**

### **المواصفات التقنية:**
```yaml
Service Name: naebak-statistics-service
Port: 8012
Framework: Flask 2.3
Database: Redis 6.2
Analytics: Custom

Dependencies:
  - Flask==2.3.3
  - redis==5.0.1
  - numpy==1.25.2
  - pandas==2.1.3

Environment Variables:
  - REDIS_URL
  - STATS_RETENTION_DAYS=90
  - REAL_TIME_ENABLED=true
  - AGGREGATION_INTERVAL=300

Features:
  - Real-time counters
  - Data aggregation
  - Trend analysis
  - Custom metrics
  - Dashboard data

Resource Limits:
  cpu: 0.3
  memory: 256Mi
  max_instances: 5
  min_instances: 1
```

---

## 🌐 **13. خدمة البوابة (Gateway Service)**

### **المواصفات التقنية:**
```yaml
Service Name: naebak-gateway-service
Port: 8013
Framework: Flask 2.3
Database: SQLite
Type: API Gateway

Dependencies:
  - Flask==2.3.3
  - requests==2.31.0
  - flask-limiter==3.5.0
  - PyJWT==2.8.0

Environment Variables:
  - JWT_SECRET_KEY
  - RATE_LIMIT_DEFAULT=100/hour
  - TIMEOUT_SECONDS=30
  - RETRY_ATTEMPTS=3
  - CIRCUIT_BREAKER_ENABLED=true

Features:
  - Request routing
  - Rate limiting
  - Authentication
  - Load balancing
  - Circuit breaker
  - Request logging

Resource Limits:
  cpu: 0.5
  memory: 256Mi
  max_instances: 10
  min_instances: 2
```

---

## 🎨 **14. خدمة الثيمات (Themes Service)**

### **المواصفات التقنية:**
```yaml
Service Name: naebak-themes-service
Port: 8014
Framework: Flask 2.3
Database: SQLite
Cache: Redis 6.2

Dependencies:
  - Flask==2.3.3
  - redis==5.0.1
  - cssutils==2.8.0

Environment Variables:
  - REDIS_URL
  - THEME_CACHE_TTL=3600
  - CSS_MINIFICATION=true
  - CUSTOM_CSS_ENABLED=true

Features:
  - Color scheme management
  - CSS generation
  - Theme caching
  - Custom CSS support
  - Real-time updates

Resource Limits:
  cpu: 0.1
  memory: 64Mi
  max_instances: 3
  min_instances: 1
```

---

## 🚀 **إعدادات النشر الموحدة**

### **Dockerfile Template:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash naebak
RUN chown -R naebak:naebak /app
USER naebak

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Run application
CMD ["gunicorn", "--bind", "0.0.0.0:$PORT", "--workers", "2", "app:app"]
```

### **Cloud Run Configuration:**
```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: ${SERVICE_NAME}
  annotations:
    run.googleapis.com/ingress: all
    run.googleapis.com/execution-environment: gen2
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "${MIN_INSTANCES}"
        autoscaling.knative.dev/maxScale: "${MAX_INSTANCES}"
        run.googleapis.com/cpu-throttling: "false"
    spec:
      containerConcurrency: 100
      timeoutSeconds: 300
      containers:
      - image: gcr.io/naebak-472518/${SERVICE_NAME}:latest
        ports:
        - containerPort: 8080
        env:
        - name: PORT
          value: "8080"
        resources:
          limits:
            cpu: "${CPU_LIMIT}"
            memory: "${MEMORY_LIMIT}"
```

### **GitHub Actions Workflow:**
```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        project_id: naebak-472518
        service_account_key: ${{ secrets.GCP_SA_KEY }}
    
    - name: Build and Push
      run: |
        gcloud builds submit --tag gcr.io/naebak-472518/${SERVICE_NAME}:latest
    
    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy ${SERVICE_NAME} \
          --image gcr.io/naebak-472518/${SERVICE_NAME}:latest \
          --platform managed \
          --region us-central1 \
          --allow-unauthenticated
```

---

## 📋 **سكريبت إعداد جميع الخدمات**

```bash
#!/bin/bash
# setup_all_services.sh

SERVICES=(
  "naebak-auth-service:8001"
  "naebak-admin-service:8002"
  "naebak-complaints-service:8003"
  "naebak-messages-service:8004"
  "naebak-ratings-service:8005"
  "naebak-visitor-counter-service:8006"
  "naebak-news-service:8007"
  "naebak-notifications-service:8008"
  "naebak-banners-service:8009"
  "naebak-content-service:8010"
  "naebak-cache-service:8011"
  "naebak-statistics-service:8012"
  "naebak-gateway-service:8013"
  "naebak-themes-service:8014"
)

echo "🚀 Setting up Naebak microservices..."

for service in "${SERVICES[@]}"; do
  IFS=':' read -r name port <<< "$service"
  echo "📦 Setting up $name on port $port..."
  
  # Build and deploy
  gcloud builds submit --tag gcr.io/naebak-472518/$name:latest ./$name/
  
  gcloud run deploy $name \
    --image gcr.io/naebak-472518/$name:latest \
    --platform managed \
    --region us-central1 \
    --port $port \
    --allow-unauthenticated \
    --max-instances 10 \
    --memory 512Mi \
    --cpu 1
    
  echo "✅ $name deployed successfully!"
done

echo "🎉 All services deployed successfully!"
```
