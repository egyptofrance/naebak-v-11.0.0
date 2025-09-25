# إعدادات قواعد البيانات - مشروع Naebak

---

## 🗄️ **إعدادات Google Cloud SQL**

### **المشروع:** naebak-472518
### **المنطقة:** us-central1
### **الشبكة:** default

---

## 📊 **قواعد البيانات للخدمات الكبيرة (PostgreSQL)**

### 1. **خدمة المصادقة (Auth Service) - Port 8001**
```yaml
Database Configuration:
  name: naebak_auth_db
  type: PostgreSQL 14
  instance_name: naebak-auth-instance
  tier: db-f1-micro
  storage: 20GB SSD
  backup: enabled (daily at 3:00 AM)
  
Connection Settings:
  host: 10.128.0.10
  port: 5432
  database: naebak_auth
  username: auth_user
  password: [stored in Secret Manager]
  ssl_mode: require
  
Environment Variables:
  DATABASE_URL: postgresql://auth_user:${PASSWORD}@10.128.0.10:5432/naebak_auth
  DB_HOST: 10.128.0.10
  DB_PORT: 5432
  DB_NAME: naebak_auth
  DB_USER: auth_user
  DB_PASSWORD: ${SECRET_AUTH_DB_PASSWORD}
  DB_SSL_MODE: require
  
Tables:
  - users (المستخدمون الأساسيون)
  - citizen_profiles (بيانات المواطنين)
  - candidate_profiles (بيانات المرشحين)
  - current_member_profiles (بيانات الأعضاء الحاليين)
  - user_sessions (جلسات المستخدمين)
  - verification_tokens (رموز التحقق)
```

### 2. **خدمة الإدارة (Admin Service) - Port 8002**
```yaml
Database Configuration:
  name: naebak_admin_db
  type: PostgreSQL 14
  instance_name: naebak-admin-instance
  tier: db-f1-micro
  storage: 15GB SSD
  backup: enabled (daily at 3:30 AM)
  
Connection Settings:
  host: 10.128.0.11
  port: 5432
  database: naebak_admin
  username: admin_user
  password: [stored in Secret Manager]
  
Environment Variables:
  DATABASE_URL: postgresql://admin_user:${PASSWORD}@10.128.0.11:5432/naebak_admin
  DB_HOST: 10.128.0.11
  DB_PORT: 5432
  DB_NAME: naebak_admin
  DB_USER: admin_user
  DB_PASSWORD: ${SECRET_ADMIN_DB_PASSWORD}
  
Tables:
  - parties (الأحزاب)
  - complaint_types (أنواع الشكاوى)
  - admin_permissions (صلاحيات الإدارة)
  - system_settings (إعدادات النظام)
  - social_media_links (روابط السوشيال ميديا)
  - site_colors (ألوان الموقع)
  - admin_logs (سجل أعمال الإدارة)
```

### 3. **خدمة الشكاوى (Complaints Service) - Port 8003**
```yaml
Database Configuration:
  name: naebak_complaints_db
  type: PostgreSQL 14
  instance_name: naebak-complaints-instance
  tier: db-g1-small
  storage: 50GB SSD
  backup: enabled (daily at 4:00 AM)
  
Connection Settings:
  host: 10.128.0.12
  port: 5432
  database: naebak_complaints
  username: complaints_user
  password: [stored in Secret Manager]
  
Environment Variables:
  DATABASE_URL: postgresql://complaints_user:${PASSWORD}@10.128.0.12:5432/naebak_complaints
  DB_HOST: 10.128.0.12
  DB_PORT: 5432
  DB_NAME: naebak_complaints
  DB_USER: complaints_user
  DB_PASSWORD: ${SECRET_COMPLAINTS_DB_PASSWORD}
  
Tables:
  - complaints (الشكاوى)
  - complaint_attachments (مرفقات الشكاوى)
  - complaint_updates (تحديثات الشكاوى)
  - complaint_assignments (تعيينات الشكاوى)
  - complaint_resolutions (حلول الشكاوى)
```

### 4. **خدمة الرسائل (Messages Service) - Port 8004**
```yaml
Database Configuration:
  name: naebak_messages_db
  type: PostgreSQL 14
  instance_name: naebak-messages-instance
  tier: db-g1-small
  storage: 30GB SSD
  backup: enabled (daily at 4:30 AM)
  
Connection Settings:
  host: 10.128.0.13
  port: 5432
  database: naebak_messages
  username: messages_user
  password: [stored in Secret Manager]
  
Environment Variables:
  DATABASE_URL: postgresql://messages_user:${PASSWORD}@10.128.0.13:5432/naebak_messages
  DB_HOST: 10.128.0.13
  DB_PORT: 5432
  DB_NAME: naebak_messages
  DB_USER: messages_user
  DB_PASSWORD: ${SECRET_MESSAGES_DB_PASSWORD}
  
Tables:
  - messages (الرسائل)
  - message_threads (سلاسل الرسائل)
  - message_attachments (مرفقات الرسائل)
  - message_status (حالة الرسائل)
```

### 5. **خدمة التقييمات (Ratings Service) - Port 8005**
```yaml
Database Configuration:
  name: naebak_ratings_db
  type: PostgreSQL 14
  instance_name: naebak-ratings-instance
  tier: db-f1-micro
  storage: 20GB SSD
  backup: enabled (daily at 5:00 AM)
  
Connection Settings:
  host: 10.128.0.14
  port: 5432
  database: naebak_ratings
  username: ratings_user
  password: [stored in Secret Manager]
  
Environment Variables:
  DATABASE_URL: postgresql://ratings_user:${PASSWORD}@10.128.0.14:5432/naebak_ratings
  DB_HOST: 10.128.0.14
  DB_PORT: 5432
  DB_NAME: naebak_ratings
  DB_USER: ratings_user
  DB_PASSWORD: ${SECRET_RATINGS_DB_PASSWORD}
  
Tables:
  - ratings (التقييمات)
  - rating_comments (تعليقات التقييم)
  - featured_representatives (المرشحون المميزون)
  - rating_statistics (إحصائيات التقييم)
```

---

## 🗃️ **قواعد البيانات للخدمات الصغيرة (SQLite)**

### 6. **خدمة عداد الزوار (Visitor Counter) - Port 8006**
```yaml
Database Configuration:
  name: naebak_visitors.db
  type: SQLite
  location: /app/data/naebak_visitors.db
  backup: Cloud Storage (hourly)
  
Environment Variables:
  DATABASE_URL: sqlite:///app/data/naebak_visitors.db
  DB_PATH: /app/data/naebak_visitors.db
  BACKUP_BUCKET: naebak-visitors-backup
  
Tables:
  - visitor_counts (عدد الزوار)
  - daily_stats (إحصائيات يومية)
  - visitor_ips (عناوين IP للزوار)
```

### 7. **خدمة الأخبار (News Service) - Port 8007**
```yaml
Database Configuration:
  name: naebak_news.db
  type: SQLite
  location: /app/data/naebak_news.db
  backup: Cloud Storage (daily)
  
Environment Variables:
  DATABASE_URL: sqlite:///app/data/naebak_news.db
  DB_PATH: /app/data/naebak_news.db
  BACKUP_BUCKET: naebak-news-backup
  
Tables:
  - news_items (عناصر الأخبار)
  - news_schedule (جدولة الأخبار)
  - news_settings (إعدادات الشريط الإخباري)
```

### 8. **خدمة الإشعارات (Notifications) - Port 8008**
```yaml
Database Configuration:
  name: naebak_notifications.db
  type: SQLite
  location: /app/data/naebak_notifications.db
  backup: Cloud Storage (daily)
  
Environment Variables:
  DATABASE_URL: sqlite:///app/data/naebak_notifications.db
  DB_PATH: /app/data/naebak_notifications.db
  BACKUP_BUCKET: naebak-notifications-backup
  
Tables:
  - notifications (الإشعارات)
  - notification_settings (إعدادات الإشعارات)
  - user_notification_preferences (تفضيلات المستخدمين)
```

### 9. **خدمة البنرات (Banners Service) - Port 8009**
```yaml
Database Configuration:
  name: naebak_banners.db
  type: SQLite
  location: /app/data/naebak_banners.db
  backup: Cloud Storage (daily)
  
Environment Variables:
  DATABASE_URL: sqlite:///app/data/naebak_banners.db
  DB_PATH: /app/data/naebak_banners.db
  BACKUP_BUCKET: naebak-banners-backup
  IMAGES_BUCKET: naebak-banner-images
  
Tables:
  - banners (البنرات)
  - banner_schedule (جدولة البنرات)
  - banner_analytics (تحليلات البنرات)
```

### 10. **خدمة المحتوى (Content Service) - Port 8010**
```yaml
Database Configuration:
  name: naebak_content.db
  type: SQLite
  location: /app/data/naebak_content.db
  backup: Cloud Storage (daily)
  
Environment Variables:
  DATABASE_URL: sqlite:///app/data/naebak_content.db
  DB_PATH: /app/data/naebak_content.db
  BACKUP_BUCKET: naebak-content-backup
  
Tables:
  - achievements (الإنجازات)
  - events (الفعاليات)
  - content_approvals (موافقات المحتوى)
```

---

## 🔄 **قواعد البيانات المؤقتة (Redis)**

### 11. **خدمة التخزين المؤقت (Cache Service) - Port 8011**
```yaml
Database Configuration:
  name: naebak-redis-cache
  type: Redis 6.2
  instance_name: naebak-redis-instance
  tier: basic
  memory: 1GB
  
Connection Settings:
  host: 10.128.0.20
  port: 6379
  password: [stored in Secret Manager]
  
Environment Variables:
  REDIS_URL: redis://:${PASSWORD}@10.128.0.20:6379/0
  REDIS_HOST: 10.128.0.20
  REDIS_PORT: 6379
  REDIS_PASSWORD: ${SECRET_REDIS_PASSWORD}
  REDIS_DB: 0
  
Usage:
  - Session storage (جلسات المستخدمين)
  - API rate limiting (تحديد معدل الطلبات)
  - Temporary data (البيانات المؤقتة)
  - Search cache (تخزين نتائج البحث)
```

### 12. **خدمة الإحصائيات (Statistics Service) - Port 8012**
```yaml
Database Configuration:
  name: naebak-redis-stats
  type: Redis 6.2
  instance_name: naebak-redis-stats-instance
  tier: basic
  memory: 512MB
  
Connection Settings:
  host: 10.128.0.21
  port: 6379
  password: [stored in Secret Manager]
  
Environment Variables:
  REDIS_STATS_URL: redis://:${PASSWORD}@10.128.0.21:6379/0
  REDIS_STATS_HOST: 10.128.0.21
  REDIS_STATS_PORT: 6379
  REDIS_STATS_PASSWORD: ${SECRET_REDIS_STATS_PASSWORD}
  
Usage:
  - Real-time counters (العدادات الفورية)
  - Analytics data (بيانات التحليلات)
  - Performance metrics (مقاييس الأداء)
```

---

## 🌐 **خدمة البوابة (Gateway Service) - Port 8013**
```yaml
Database Configuration:
  name: naebak_gateway.db
  type: SQLite
  location: /app/data/naebak_gateway.db
  backup: Cloud Storage (hourly)
  
Environment Variables:
  DATABASE_URL: sqlite:///app/data/naebak_gateway.db
  DB_PATH: /app/data/naebak_gateway.db
  
Tables:
  - api_logs (سجل API)
  - rate_limits (حدود المعدل)
  - service_health (صحة الخدمات)
```

---

## 🎨 **خدمة الثيمات (Themes Service) - Port 8014**
```yaml
Database Configuration:
  name: naebak_themes.db
  type: SQLite
  location: /app/data/naebak_themes.db
  backup: Cloud Storage (daily)
  
Environment Variables:
  DATABASE_URL: sqlite:///app/data/naebak_themes.db
  DB_PATH: /app/data/naebak_themes.db
  
Tables:
  - color_schemes (مخططات الألوان)
  - theme_settings (إعدادات الثيمات)
  - custom_css (CSS مخصص)
```

---

## 🔐 **إعدادات الأمان المشتركة**

### **Secret Manager Keys:**
```yaml
Secrets:
  - SECRET_AUTH_DB_PASSWORD
  - SECRET_ADMIN_DB_PASSWORD
  - SECRET_COMPLAINTS_DB_PASSWORD
  - SECRET_MESSAGES_DB_PASSWORD
  - SECRET_RATINGS_DB_PASSWORD
  - SECRET_REDIS_PASSWORD
  - SECRET_REDIS_STATS_PASSWORD
  - JWT_SECRET_KEY
  - ENCRYPTION_KEY
```

### **Network Security:**
```yaml
VPC Settings:
  network: naebak-vpc
  subnet: naebak-subnet
  firewall_rules:
    - allow-internal-db (ports 5432, 6379)
    - allow-https (port 443)
    - allow-http (port 80)
    
IP Ranges:
  database_subnet: 10.128.0.0/24
  application_subnet: 10.129.0.0/24
```

---

## 📋 **سكريبت إعداد قواعد البيانات**

```bash
#!/bin/bash
# setup_databases.sh

# إعداد PostgreSQL instances
gcloud sql instances create naebak-auth-instance \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-size=20GB \
  --storage-type=SSD \
  --backup-start-time=03:00

gcloud sql instances create naebak-admin-instance \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-size=15GB \
  --storage-type=SSD \
  --backup-start-time=03:30

# إعداد Redis instances
gcloud redis instances create naebak-redis-cache \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_6_x

# إنشاء قواعد البيانات
gcloud sql databases create naebak_auth --instance=naebak-auth-instance
gcloud sql databases create naebak_admin --instance=naebak-admin-instance
gcloud sql databases create naebak_complaints --instance=naebak-complaints-instance

# إنشاء المستخدمين
gcloud sql users create auth_user --instance=naebak-auth-instance --password=RANDOM_PASSWORD
gcloud sql users create admin_user --instance=naebak-admin-instance --password=RANDOM_PASSWORD

echo "Database setup completed!"
```

---

## 📊 **مراقبة قواعد البيانات**

### **Cloud Monitoring Metrics:**
```yaml
PostgreSQL Metrics:
  - database/cpu/utilization
  - database/memory/utilization
  - database/disk/utilization
  - database/network/connections
  - database/postgresql/num_backends

Redis Metrics:
  - redis/stats/memory_usage_ratio
  - redis/stats/connections/total
  - redis/stats/keyspace_hits
  - redis/stats/keyspace_misses

Alerts:
  - CPU usage > 80%
  - Memory usage > 85%
  - Disk usage > 90%
  - Connection count > 80% of max
```

### **Backup Strategy:**
```yaml
PostgreSQL:
  - Automated daily backups
  - Point-in-time recovery enabled
  - Backup retention: 30 days
  - Cross-region backup replication

SQLite:
  - Hourly Cloud Storage sync
  - Daily compressed backups
  - Backup retention: 90 days
  - Multiple region storage

Redis:
  - RDB snapshots every 6 hours
  - AOF persistence enabled
  - Backup retention: 7 days
```
