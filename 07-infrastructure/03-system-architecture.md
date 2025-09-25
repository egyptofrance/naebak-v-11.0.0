# مخطط معمارية النظام - مشروع Naebak

---

## 🏗️ **نظرة عامة على المعمارية**

```mermaid
graph TB
    subgraph "Frontend Layer"
        FE[Next.js Frontend<br/>Port: 3000]
        FE --> |HTTPS| LB
    end
    
    subgraph "Load Balancer & Gateway"
        LB[Cloud Load Balancer]
        GW[Gateway Service<br/>Port: 8013]
        LB --> GW
    end
    
    subgraph "Core Services (Django)"
        AUTH[Auth Service<br/>Port: 8001]
        ADMIN[Admin Service<br/>Port: 8002]
        COMP[Complaints Service<br/>Port: 8003]
        MSG[Messages Service<br/>Port: 8004]
        RATE[Ratings Service<br/>Port: 8005]
    end
    
    subgraph "Utility Services (Flask)"
        VIS[Visitor Counter<br/>Port: 8006]
        NEWS[News Service<br/>Port: 8007]
        NOTIF[Notifications<br/>Port: 8008]
        BAN[Banners Service<br/>Port: 8009]
        CONT[Content Service<br/>Port: 8010]
        CACHE[Cache Service<br/>Port: 8011]
        STATS[Statistics<br/>Port: 8012]
        THEME[Themes Service<br/>Port: 8014]
    end
    
    subgraph "Database Layer"
        PG1[(PostgreSQL<br/>Auth DB)]
        PG2[(PostgreSQL<br/>Admin DB)]
        PG3[(PostgreSQL<br/>Complaints DB)]
        PG4[(PostgreSQL<br/>Messages DB)]
        PG5[(PostgreSQL<br/>Ratings DB)]
        
        SQLITE1[(SQLite<br/>Visitor DB)]
        SQLITE2[(SQLite<br/>News DB)]
        SQLITE3[(SQLite<br/>Banners DB)]
        SQLITE4[(SQLite<br/>Content DB)]
        
        REDIS1[(Redis<br/>Cache)]
        REDIS2[(Redis<br/>Stats)]
    end
    
    subgraph "External Services"
        GCS[Google Cloud Storage<br/>Files & Images]
        SM[Secret Manager<br/>Credentials]
        MON[Cloud Monitoring<br/>Logs & Metrics]
    end
    
    %% Connections
    GW --> AUTH
    GW --> ADMIN
    GW --> COMP
    GW --> MSG
    GW --> RATE
    GW --> VIS
    GW --> NEWS
    GW --> NOTIF
    GW --> BAN
    GW --> CONT
    GW --> CACHE
    GW --> STATS
    GW --> THEME
    
    AUTH --> PG1
    ADMIN --> PG2
    COMP --> PG3
    MSG --> PG4
    RATE --> PG5
    
    VIS --> SQLITE1
    NEWS --> SQLITE2
    BAN --> SQLITE3
    CONT --> SQLITE4
    
    CACHE --> REDIS1
    STATS --> REDIS2
    
    COMP --> GCS
    BAN --> GCS
    
    AUTH --> SM
    ADMIN --> SM
    
    ALL --> MON
    
    %% Styling
    classDef frontend fill:#e1f5fe
    classDef gateway fill:#f3e5f5
    classDef core fill:#e8f5e8
    classDef utility fill:#fff3e0
    classDef database fill:#fce4ec
    classDef external fill:#f1f8e9
    
    class FE frontend
    class LB,GW gateway
    class AUTH,ADMIN,COMP,MSG,RATE core
    class VIS,NEWS,NOTIF,BAN,CONT,CACHE,STATS,THEME utility
    class PG1,PG2,PG3,PG4,PG5,SQLITE1,SQLITE2,SQLITE3,SQLITE4,REDIS1,REDIS2 database
    class GCS,SM,MON external
```

---

## 🔄 **تدفق البيانات الرئيسي**

### **1. تدفق المصادقة:**
```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant GW as Gateway
    participant AUTH as Auth Service
    participant DB as Auth Database
    participant REDIS as Redis Cache
    
    U->>FE: تسجيل دخول
    FE->>GW: POST /api/auth/login
    GW->>AUTH: توجيه الطلب
    AUTH->>DB: التحقق من البيانات
    DB-->>AUTH: بيانات المستخدم
    AUTH->>REDIS: حفظ الجلسة
    AUTH-->>GW: JWT Token
    GW-->>FE: استجابة مع Token
    FE-->>U: تسجيل دخول ناجح
```

### **2. تدفق الشكاوى:**
```mermaid
sequenceDiagram
    participant U as مواطن
    participant FE as Frontend
    participant GW as Gateway
    participant COMP as Complaints Service
    participant DB as Complaints DB
    participant GCS as Cloud Storage
    participant NOTIF as Notifications
    participant ASSIGN as Auto Assignment
    
    U->>FE: إرسال شكوى + مرفقات
    FE->>GW: POST /api/complaints
    GW->>COMP: إنشاء شكوى
    COMP->>GCS: رفع المرفقات
    GCS-->>COMP: روابط الملفات
    COMP->>DB: حفظ الشكوى
    COMP->>ASSIGN: تعيين تلقائي
    ASSIGN->>NOTIF: إشعار النائب
    COMP-->>GW: تأكيد الإنشاء
    GW-->>FE: رقم الشكوى
    FE-->>U: تم إرسال الشكوى
```

### **3. تدفق التقييم:**
```mermaid
sequenceDiagram
    participant U as مواطن
    participant FE as Frontend
    participant GW as Gateway
    participant RATE as Ratings Service
    participant DB as Ratings DB
    participant STATS as Statistics
    participant CACHE as Cache
    
    U->>FE: تقييم مرشح
    FE->>GW: POST /api/ratings
    GW->>RATE: إضافة تقييم
    RATE->>DB: حفظ التقييم
    RATE->>STATS: تحديث الإحصائيات
    STATS->>CACHE: تحديث الكاش
    RATE-->>GW: تأكيد التقييم
    GW-->>FE: نجح التقييم
    FE-->>U: شكراً لتقييمك
```

---

## 🛡️ **طبقات الأمان**

### **Security Layers:**
```mermaid
graph TD
    subgraph "Security Layers"
        L1[Layer 1: Cloud Load Balancer<br/>- DDoS Protection<br/>- SSL Termination<br/>- Rate Limiting]
        L2[Layer 2: Gateway Service<br/>- JWT Validation<br/>- API Rate Limiting<br/>- Request Logging]
        L3[Layer 3: Service Level<br/>- Input Validation<br/>- SQL Injection Protection<br/>- XSS Protection]
        L4[Layer 4: Database Level<br/>- Connection Encryption<br/>- Access Control<br/>- Audit Logging]
        L5[Layer 5: Data Level<br/>- Field Encryption<br/>- PII Protection<br/>- Backup Encryption]
    end
    
    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> L5
    
    classDef security fill:#ffebee
    class L1,L2,L3,L4,L5 security
```

---

## 📊 **توزيع الأحمال والتوسع**

### **Scaling Strategy:**
```mermaid
graph LR
    subgraph "Auto Scaling Groups"
        subgraph "High Traffic Services"
            AUTH_SCALE[Auth Service<br/>Min: 2, Max: 10<br/>CPU: 70%]
            COMP_SCALE[Complaints Service<br/>Min: 2, Max: 15<br/>CPU: 80%]
            MSG_SCALE[Messages Service<br/>Min: 2, Max: 10<br/>CPU: 75%]
        end
        
        subgraph "Medium Traffic Services"
            RATE_SCALE[Ratings Service<br/>Min: 1, Max: 8<br/>CPU: 80%]
            ADMIN_SCALE[Admin Service<br/>Min: 1, Max: 5<br/>CPU: 70%]
        end
        
        subgraph "Low Traffic Services"
            UTIL_SCALE[Utility Services<br/>Min: 1, Max: 3<br/>CPU: 85%]
        end
    end
    
    subgraph "Database Scaling"
        PG_READ[PostgreSQL<br/>Read Replicas]
        REDIS_CLUSTER[Redis Cluster<br/>Sharding]
    end
    
    AUTH_SCALE --> PG_READ
    COMP_SCALE --> PG_READ
    MSG_SCALE --> PG_READ
    RATE_SCALE --> REDIS_CLUSTER
    
    classDef high fill:#ffcdd2
    classDef medium fill:#fff9c4
    classDef low fill:#c8e6c9
    
    class AUTH_SCALE,COMP_SCALE,MSG_SCALE high
    class RATE_SCALE,ADMIN_SCALE medium
    class UTIL_SCALE low
```

---

## 🔄 **استراتيجية النسخ الاحتياطي**

### **Backup Architecture:**
```mermaid
graph TB
    subgraph "Production Data"
        PROD_PG[(Production PostgreSQL)]
        PROD_REDIS[(Production Redis)]
        PROD_FILES[Production Files<br/>Cloud Storage]
    end
    
    subgraph "Backup Systems"
        BACKUP_PG[(Backup PostgreSQL<br/>Daily + PITR)]
        BACKUP_REDIS[(Backup Redis<br/>RDB + AOF)]
        BACKUP_FILES[Backup Files<br/>Multi-Region)]
    end
    
    subgraph "Disaster Recovery"
        DR_PG[(DR PostgreSQL<br/>Cross-Region)]
        DR_REDIS[(DR Redis<br/>Cross-Region)]
        DR_FILES[DR Files<br/>Cross-Region]
    end
    
    PROD_PG -->|Daily Backup| BACKUP_PG
    PROD_REDIS -->|6h Snapshot| BACKUP_REDIS
    PROD_FILES -->|Real-time Sync| BACKUP_FILES
    
    BACKUP_PG -->|Weekly Sync| DR_PG
    BACKUP_REDIS -->|Daily Sync| DR_REDIS
    BACKUP_FILES -->|Real-time Sync| DR_FILES
    
    classDef prod fill:#e8f5e8
    classDef backup fill:#fff3e0
    classDef dr fill:#ffebee
    
    class PROD_PG,PROD_REDIS,PROD_FILES prod
    class BACKUP_PG,BACKUP_REDIS,BACKUP_FILES backup
    class DR_PG,DR_REDIS,DR_FILES dr
```

---

## 📈 **مراقبة النظام**

### **Monitoring Architecture:**
```mermaid
graph TD
    subgraph "Application Metrics"
        APP_METRICS[Application Metrics<br/>- Response Time<br/>- Error Rate<br/>- Throughput]
    end
    
    subgraph "Infrastructure Metrics"
        INFRA_METRICS[Infrastructure Metrics<br/>- CPU Usage<br/>- Memory Usage<br/>- Disk I/O<br/>- Network I/O]
    end
    
    subgraph "Business Metrics"
        BIZ_METRICS[Business Metrics<br/>- User Registrations<br/>- Complaints Submitted<br/>- Messages Sent<br/>- Ratings Given]
    end
    
    subgraph "Monitoring Stack"
        COLLECTOR[Metrics Collector<br/>Cloud Monitoring]
        ALERTING[Alerting System<br/>Cloud Alerting]
        DASHBOARD[Monitoring Dashboard<br/>Cloud Console]
        LOGS[Centralized Logging<br/>Cloud Logging]
    end
    
    APP_METRICS --> COLLECTOR
    INFRA_METRICS --> COLLECTOR
    BIZ_METRICS --> COLLECTOR
    
    COLLECTOR --> ALERTING
    COLLECTOR --> DASHBOARD
    COLLECTOR --> LOGS
    
    classDef metrics fill:#e3f2fd
    classDef monitoring fill:#f3e5f5
    
    class APP_METRICS,INFRA_METRICS,BIZ_METRICS metrics
    class COLLECTOR,ALERTING,DASHBOARD,LOGS monitoring
```

---

## 🚀 **استراتيجية النشر**

### **Deployment Pipeline:**
```mermaid
graph LR
    subgraph "Development"
        DEV[Development<br/>Local Environment]
        TEST[Testing<br/>Unit + Integration]
    end
    
    subgraph "CI/CD Pipeline"
        BUILD[Build<br/>Docker Images]
        SCAN[Security Scan<br/>Vulnerability Check]
        DEPLOY_STAGE[Deploy to Staging<br/>Cloud Run]
        E2E[End-to-End Tests<br/>Automated Testing]
    end
    
    subgraph "Production"
        DEPLOY_PROD[Deploy to Production<br/>Blue-Green Deployment]
        MONITOR[Monitor<br/>Health Checks]
        ROLLBACK[Rollback<br/>If Issues Detected]
    end
    
    DEV --> TEST
    TEST --> BUILD
    BUILD --> SCAN
    SCAN --> DEPLOY_STAGE
    DEPLOY_STAGE --> E2E
    E2E --> DEPLOY_PROD
    DEPLOY_PROD --> MONITOR
    MONITOR --> ROLLBACK
    
    classDef dev fill:#e8f5e8
    classDef cicd fill:#fff3e0
    classDef prod fill:#ffebee
    
    class DEV,TEST dev
    class BUILD,SCAN,DEPLOY_STAGE,E2E cicd
    class DEPLOY_PROD,MONITOR,ROLLBACK prod
```

---

## 🔧 **تكوين البيئات**

### **Environment Configuration:**

#### **Development Environment:**
```yaml
Environment: Development
Services: All services running locally
Database: Local PostgreSQL + SQLite
Cache: Local Redis
Storage: Local filesystem
Monitoring: Basic logging
Security: Minimal (development only)
```

#### **Staging Environment:**
```yaml
Environment: Staging
Services: Cloud Run (minimal instances)
Database: Cloud SQL (small instances)
Cache: Cloud Redis (basic tier)
Storage: Cloud Storage (single region)
Monitoring: Full monitoring enabled
Security: Production-like security
```

#### **Production Environment:**
```yaml
Environment: Production
Services: Cloud Run (auto-scaling)
Database: Cloud SQL (high availability)
Cache: Cloud Redis (standard tier)
Storage: Cloud Storage (multi-region)
Monitoring: Full monitoring + alerting
Security: Maximum security enabled
```

---

## 📋 **مواصفات الأداء**

### **Performance Targets:**

| Service | Response Time | Throughput | Availability |
|---------|---------------|------------|--------------|
| Auth Service | < 200ms | 1000 req/min | 99.9% |
| Complaints Service | < 500ms | 500 req/min | 99.5% |
| Messages Service | < 300ms | 800 req/min | 99.7% |
| Ratings Service | < 150ms | 1200 req/min | 99.8% |
| Utility Services | < 100ms | 2000 req/min | 99.0% |

### **Resource Allocation:**

| Service Type | CPU | Memory | Storage | Network |
|--------------|-----|--------|---------|---------|
| Core Services | 0.5-1.0 vCPU | 512Mi-1Gi | 20-50GB | 1Gbps |
| Utility Services | 0.1-0.3 vCPU | 64-256Mi | 5-15GB | 100Mbps |
| Database | 1-2 vCPU | 2-4Gi | 100-500GB | 1Gbps |
| Cache | 0.5 vCPU | 1-2Gi | 10GB | 1Gbps |

---

## 🔍 **نقاط المراقبة الحرجة**

### **Critical Monitoring Points:**

1. **Authentication Failures** - معدل فشل تسجيل الدخول
2. **Database Connection Pool** - استخدام pool الاتصالات
3. **File Upload Errors** - أخطاء رفع الملفات
4. **API Response Times** - أوقات استجابة APIs
5. **Memory Usage** - استخدام الذاكرة
6. **Disk Space** - المساحة المتاحة
7. **Network Latency** - زمن الاستجابة الشبكي
8. **Error Rates** - معدلات الأخطاء

### **Alert Thresholds:**

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| CPU Usage | > 70% | > 85% | Auto-scale |
| Memory Usage | > 80% | > 90% | Restart service |
| Error Rate | > 5% | > 10% | Investigate |
| Response Time | > 1s | > 2s | Check performance |
| Disk Usage | > 80% | > 90% | Clean up / expand |

---

## 🎯 **خلاصة المعمارية**

### **المبادئ الأساسية:**
1. **Microservices Architecture** - خدمات مصغرة منفصلة
2. **Horizontal Scaling** - توسع أفقي حسب الحاجة
3. **High Availability** - توفر عالي مع redundancy
4. **Security by Design** - الأمان مدمج في التصميم
5. **Monitoring First** - المراقبة أولوية قصوى
6. **Cloud Native** - مصمم للسحابة
7. **Cost Optimization** - تحسين التكاليف
8. **Developer Friendly** - سهل التطوير والصيانة

### **الفوائد المحققة:**
✅ **قابلية التوسع** - يتحمل ملايين المستخدمين  
✅ **الموثوقية** - نسبة توفر عالية  
✅ **الأمان** - حماية متعددة الطبقات  
✅ **الأداء** - استجابة سريعة  
✅ **المرونة** - سهولة التطوير والتحديث  
✅ **التكلفة** - دفع حسب الاستخدام  

هذه المعمارية تضمن نظاماً قوياً وقابلاً للتوسع يلبي جميع متطلبات مشروع Naebak! 🚀
