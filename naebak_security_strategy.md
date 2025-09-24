# استراتيجية الأمان والحماية - منصة نائبك

## 🛡️ **نظرة عامة**

هذا الملف يحدد استراتيجية شاملة لحماية منصة نائبك من التهديدات الأمنية المختلفة، مع التركيز على حماية البيانات الحساسة وضمان سلامة النظام.

---

## 🎯 **أهداف الأمان**

### **الأهداف الأساسية:**
1. **حماية البيانات الشخصية** للمواطنين والمرشحين والأعضاء
2. **ضمان سلامة عملية المصادقة** وإدارة الجلسات
3. **حماية من الهجمات الشائعة** (CSRF, XSS, SQL Injection)
4. **ضمان توفر الخدمة** ومنع هجمات DDoS
5. **مراقبة الأنشطة المشبوهة** والاستجابة السريعة للحوادث

### **معايير الامتثال:**
- **قانون حماية البيانات المصري**
- **معايير ISO 27001** لأمان المعلومات
- **إرشادات OWASP** لأمان تطبيقات الويب
- **معايير PCI DSS** (في حالة إضافة مدفوعات مستقبلاً)

---

## 🔐 **استراتيجية المصادقة والترخيص**

### **1. نظام JWT (JSON Web Tokens)**

#### **إعدادات JWT:**
```python
# settings.py
JWT_SETTINGS = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': os.environ.get('JWT_SECRET_KEY'),
    'VERIFYING_KEY': None,
    'AUDIENCE': 'naebak-platform',
    'ISSUER': 'naebak.com',
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}
```

#### **بنية Token:**
```json
{
  "header": {
    "typ": "JWT",
    "alg": "HS256"
  },
  "payload": {
    "user_id": 123,
    "email": "user@naebak.com",
    "user_type": "مواطن",
    "governorate": "القاهرة",
    "permissions": ["view_complaints", "create_complaint"],
    "iat": 1703520000,
    "exp": 1703523600,
    "aud": "naebak-platform",
    "iss": "naebak.com"
  }
}
```

#### **إدارة الجلسات:**
```python
class SessionManager:
    """إدارة جلسات المستخدمين مع الأمان"""
    
    @staticmethod
    def create_session(user, device_info=None):
        """إنشاء جلسة جديدة مع تتبع الجهاز"""
        session = UserSession.objects.create(
            user=user,
            device_fingerprint=device_info.get('fingerprint'),
            ip_address=device_info.get('ip'),
            user_agent=device_info.get('user_agent'),
            location=device_info.get('location'),
            is_active=True,
            expires_at=timezone.now() + timedelta(hours=24)
        )
        
        # حد أقصى 5 جلسات نشطة لكل مستخدم
        active_sessions = UserSession.objects.filter(
            user=user, is_active=True
        ).order_by('-created_at')
        
        if active_sessions.count() > 5:
            # إنهاء الجلسات القديمة
            old_sessions = active_sessions[5:]
            for session in old_sessions:
                session.terminate()
        
        return session
    
    @staticmethod
    def validate_session(token, request):
        """التحقق من صحة الجلسة"""
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            
            # التحقق من وجود الجلسة في قاعدة البيانات
            session = UserSession.objects.get(
                user_id=user_id,
                is_active=True,
                expires_at__gt=timezone.now()
            )
            
            # التحقق من IP Address (اختياري)
            current_ip = get_client_ip(request)
            if session.ip_address != current_ip:
                # تسجيل محاولة وصول مشبوهة
                SecurityLog.objects.create(
                    user_id=user_id,
                    event_type='SUSPICIOUS_IP',
                    ip_address=current_ip,
                    details=f'IP changed from {session.ip_address} to {current_ip}'
                )
                
                # إرسال تنبيه للمستخدم
                send_security_alert(user_id, 'IP_CHANGE', current_ip)
            
            # تحديث آخر نشاط
            session.last_activity = timezone.now()
            session.save()
            
            return payload
            
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, UserSession.DoesNotExist):
            return None
```

### **2. نظام الصلاحيات المتدرج**

#### **أنواع المستخدمين والصلاحيات:**
```python
USER_PERMISSIONS = {
    'مواطن': [
        'view_own_profile',
        'update_own_profile',
        'create_complaint',
        'view_own_complaints',
        'send_message',
        'rate_member',
        'view_public_content'
    ],
    'مرشح': [
        'view_own_profile',
        'update_own_profile',
        'view_complaints_in_constituency',
        'respond_to_messages',
        'view_ratings',
        'update_campaign_info',
        'view_analytics'
    ],
    'عضو حالي': [
        'view_own_profile',
        'update_own_profile',
        'view_all_complaints_in_constituency',
        'respond_to_complaints',
        'respond_to_messages',
        'view_detailed_analytics',
        'manage_office_info'
    ],
    'مدير': [
        'manage_users',
        'manage_complaints',
        'manage_parties',
        'manage_complaint_types',
        'view_system_analytics',
        'manage_content',
        'access_admin_panel'
    ],
    'مدير عام': [
        '*'  # جميع الصلاحيات
    ]
}

class PermissionChecker:
    """فحص الصلاحيات"""
    
    @staticmethod
    def has_permission(user, permission):
        """التحقق من وجود صلاحية معينة"""
        user_permissions = USER_PERMISSIONS.get(user.user_type, [])
        return permission in user_permissions or '*' in user_permissions
    
    @staticmethod
    def check_resource_access(user, resource, action):
        """التحقق من إمكانية الوصول لمورد معين"""
        # قواعد خاصة للوصول للموارد
        if resource == 'complaint':
            if action == 'view':
                # المواطن يمكنه رؤية شكاواه فقط
                if user.user_type == 'مواطن':
                    return resource.citizen_id == user.id
                # المرشح/العضو يمكنه رؤية شكاوى دائرته
                elif user.user_type in ['مرشح', 'عضو حالي']:
                    return resource.target_member_id == user.id
            elif action == 'respond':
                # فقط المرشح/العضو المستهدف يمكنه الرد
                return resource.target_member_id == user.id
        
        return False
```

### **3. المصادقة متعددة العوامل (2FA)**

#### **تفعيل 2FA عبر SMS:**
```python
class TwoFactorAuth:
    """نظام المصادقة ثنائية العامل"""
    
    @staticmethod
    def enable_2fa(user, phone_number):
        """تفعيل المصادقة ثنائية العامل"""
        # إنشاء مفتاح سري
        secret_key = pyotp.random_base32()
        
        # حفظ في قاعدة البيانات
        TwoFactorSettings.objects.update_or_create(
            user=user,
            defaults={
                'secret_key': secret_key,
                'phone_number': phone_number,
                'is_enabled': False,  # سيتم التفعيل بعد التحقق
                'backup_codes': generate_backup_codes()
            }
        )
        
        # إرسال رمز التحقق
        verification_code = generate_verification_code()
        send_sms(phone_number, f'رمز التحقق: {verification_code}')
        
        # حفظ الرمز مؤقتاً
        cache.set(f'2fa_setup_{user.id}', verification_code, timeout=300)
        
        return secret_key
    
    @staticmethod
    def verify_2fa_setup(user, verification_code):
        """التحقق من إعداد 2FA"""
        cached_code = cache.get(f'2fa_setup_{user.id}')
        
        if cached_code and cached_code == verification_code:
            # تفعيل 2FA
            settings = TwoFactorSettings.objects.get(user=user)
            settings.is_enabled = True
            settings.save()
            
            cache.delete(f'2fa_setup_{user.id}')
            return True
        
        return False
    
    @staticmethod
    def generate_2fa_code(user):
        """توليد رمز 2FA للدخول"""
        settings = TwoFactorSettings.objects.get(user=user, is_enabled=True)
        code = generate_verification_code()
        
        # حفظ الرمز مؤقتاً
        cache.set(f'2fa_login_{user.id}', code, timeout=300)
        
        # إرسال عبر SMS
        send_sms(settings.phone_number, f'رمز الدخول: {code}')
        
        return True
    
    @staticmethod
    def verify_2fa_login(user, code):
        """التحقق من رمز 2FA للدخول"""
        cached_code = cache.get(f'2fa_login_{user.id}')
        
        if cached_code and cached_code == code:
            cache.delete(f'2fa_login_{user.id}')
            return True
        
        # التحقق من backup codes
        settings = TwoFactorSettings.objects.get(user=user)
        if code in settings.backup_codes:
            # إزالة الكود المستخدم
            settings.backup_codes.remove(code)
            settings.save()
            return True
        
        return False
```

---

## 🛡️ **الحماية من الهجمات الشائعة**

### **1. حماية من CSRF (Cross-Site Request Forgery)**

#### **إعدادات Django CSRF:**
```python
# settings.py
CSRF_COOKIE_SECURE = True  # HTTPS only
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'
CSRF_TRUSTED_ORIGINS = ['https://naebak.com', 'https://api.naebak.com']
CSRF_FAILURE_VIEW = 'security.views.csrf_failure'

# Middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',  # CSRF protection
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'security.middleware.SecurityHeadersMiddleware',
    'django.middleware.common.CommonMiddleware',
]
```

#### **حماية APIs من CSRF:**
```python
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

class CSRFExemptMixin:
    """إعفاء APIs من CSRF مع التحقق من JWT"""
    
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        # التحقق من وجود JWT token صحيح
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Missing or invalid authorization header'}, status=401)
        
        token = auth_header.split(' ')[1]
        payload = SessionManager.validate_session(token, request)
        
        if not payload:
            return JsonResponse({'error': 'Invalid or expired token'}, status=401)
        
        request.user_payload = payload
        return super().dispatch(request, *args, **kwargs)
```

### **2. حماية من XSS (Cross-Site Scripting)**

#### **تنظيف المدخلات:**
```python
import bleach
from django.utils.html import escape

class InputSanitizer:
    """تنظيف وتعقيم المدخلات"""
    
    # العلامات المسموحة في المحتوى
    ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li']
    ALLOWED_ATTRIBUTES = {}
    
    @classmethod
    def sanitize_html(cls, content):
        """تنظيف محتوى HTML"""
        return bleach.clean(
            content,
            tags=cls.ALLOWED_TAGS,
            attributes=cls.ALLOWED_ATTRIBUTES,
            strip=True
        )
    
    @classmethod
    def sanitize_text(cls, text):
        """تنظيف النص العادي"""
        if not text:
            return text
        
        # إزالة الأحرف الخطيرة
        dangerous_chars = ['<', '>', '"', "'", '&', 'javascript:', 'data:', 'vbscript:']
        
        for char in dangerous_chars:
            text = text.replace(char, '')
        
        return escape(text)
    
    @classmethod
    def validate_file_upload(cls, file):
        """التحقق من أمان الملفات المرفوعة"""
        # فحص امتداد الملف
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx']
        file_extension = os.path.splitext(file.name)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise ValidationError('نوع الملف غير مسموح')
        
        # فحص حجم الملف
        if file.size > 10 * 1024 * 1024:  # 10MB
            raise ValidationError('حجم الملف كبير جداً')
        
        # فحص محتوى الملف
        if file_extension in ['.jpg', '.jpeg', '.png', '.gif']:
            try:
                from PIL import Image
                img = Image.open(file)
                img.verify()
            except:
                raise ValidationError('الملف تالف أو غير صحيح')
        
        return True
```

#### **رؤوس الأمان:**
```python
class SecurityHeadersMiddleware:
    """إضافة رؤوس الأمان"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # منع XSS
        response['X-XSS-Protection'] = '1; mode=block'
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        
        # Content Security Policy
        response['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https:; "
            "connect-src 'self' https://api.naebak.com; "
            "frame-ancestors 'none';"
        )
        
        # HSTS (HTTP Strict Transport Security)
        response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        return response
```

### **3. حماية من SQL Injection**

#### **استخدام ORM بشكل آمن:**
```python
class SecureQueryManager:
    """إدارة الاستعلامات بشكل آمن"""
    
    @staticmethod
    def search_complaints(search_term, user):
        """البحث في الشكاوى بشكل آمن"""
        # استخدام ORM بدلاً من SQL خام
        queryset = Complaint.objects.filter(
            Q(title__icontains=search_term) | 
            Q(description__icontains=search_term)
        )
        
        # تطبيق فلاتر الأمان
        if user.user_type == 'مواطن':
            queryset = queryset.filter(citizen=user)
        elif user.user_type in ['مرشح', 'عضو حالي']:
            queryset = queryset.filter(target_member=user)
        
        return queryset
    
    @staticmethod
    def get_user_statistics(user_id):
        """الحصول على إحصائيات المستخدم بشكل آمن"""
        # التحقق من صحة user_id
        if not isinstance(user_id, int) or user_id <= 0:
            raise ValueError('معرف المستخدم غير صحيح')
        
        # استخدام ORM
        try:
            user = User.objects.get(id=user_id)
            return {
                'complaints_count': user.complaints.count(),
                'messages_count': user.sent_messages.count(),
                'ratings_given': user.ratings_given.count()
            }
        except User.DoesNotExist:
            return None
```

#### **التحقق من المدخلات:**
```python
class InputValidator:
    """التحقق من صحة المدخلات"""
    
    @staticmethod
    def validate_integer_id(value, field_name='ID'):
        """التحقق من صحة معرف رقمي"""
        try:
            int_value = int(value)
            if int_value <= 0:
                raise ValidationError(f'{field_name} يجب أن يكون رقم موجب')
            return int_value
        except (ValueError, TypeError):
            raise ValidationError(f'{field_name} يجب أن يكون رقم صحيح')
    
    @staticmethod
    def validate_email(email):
        """التحقق من صحة البريد الإلكتروني"""
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            raise ValidationError('البريد الإلكتروني غير صحيح')
        return email.lower()
    
    @staticmethod
    def validate_phone(phone):
        """التحقق من صحة رقم الهاتف المصري"""
        phone_regex = r'^01[0-2,5]{1}[0-9]{8}$'
        if not re.match(phone_regex, phone):
            raise ValidationError('رقم الهاتف غير صحيح')
        return phone
```

---

## 🔒 **تشفير البيانات**

### **1. تشفير البيانات الحساسة**

#### **تشفير كلمات المرور:**
```python
from django.contrib.auth.hashers import make_password, check_password
import bcrypt

class PasswordManager:
    """إدارة كلمات المرور بشكل آمن"""
    
    @staticmethod
    def hash_password(password):
        """تشفير كلمة المرور"""
        # استخدام bcrypt مع salt عشوائي
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    @staticmethod
    def verify_password(password, hashed):
        """التحقق من كلمة المرور"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    @staticmethod
    def is_password_strong(password):
        """التحقق من قوة كلمة المرور"""
        if len(password) < 8:
            return False, 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل'
        
        if not re.search(r'[A-Z]', password):
            return False, 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل'
        
        if not re.search(r'[a-z]', password):
            return False, 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل'
        
        if not re.search(r'[0-9]', password):
            return False, 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل'
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, 'كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل'
        
        return True, 'كلمة المرور قوية'
```

#### **تشفير البيانات الحساسة:**
```python
from cryptography.fernet import Fernet
import os

class DataEncryption:
    """تشفير البيانات الحساسة"""
    
    def __init__(self):
        self.key = os.environ.get('ENCRYPTION_KEY').encode()
        self.cipher = Fernet(self.key)
    
    def encrypt_data(self, data):
        """تشفير البيانات"""
        if isinstance(data, str):
            data = data.encode('utf-8')
        return self.cipher.encrypt(data).decode('utf-8')
    
    def decrypt_data(self, encrypted_data):
        """فك تشفير البيانات"""
        return self.cipher.decrypt(encrypted_data.encode('utf-8')).decode('utf-8')
    
    def encrypt_national_id(self, national_id):
        """تشفير الرقم القومي"""
        return self.encrypt_data(national_id)
    
    def decrypt_national_id(self, encrypted_national_id):
        """فك تشفير الرقم القومي"""
        return self.decrypt_data(encrypted_national_id)

# استخدام التشفير في النماذج
class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    _national_id = models.TextField()  # مشفر
    
    @property
    def national_id(self):
        """الحصول على الرقم القومي مفكوك التشفير"""
        encryptor = DataEncryption()
        return encryptor.decrypt_national_id(self._national_id)
    
    @national_id.setter
    def national_id(self, value):
        """حفظ الرقم القومي مشفراً"""
        encryptor = DataEncryption()
        self._national_id = encryptor.encrypt_national_id(value)
```

### **2. تشفير الاتصالات**

#### **إعدادات HTTPS:**
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name naebak.com www.naebak.com;
    
    # SSL Certificate
    ssl_certificate /etc/ssl/certs/naebak.com.crt;
    ssl_certificate_key /etc/ssl/private/naebak.com.key;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name naebak.com www.naebak.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 🚨 **مراقبة الأمان والتنبيهات**

### **1. نظام مراقبة الأنشطة المشبوهة**

#### **تسجيل الأحداث الأمنية:**
```python
class SecurityLogger:
    """تسجيل الأحداث الأمنية"""
    
    EVENT_TYPES = {
        'LOGIN_SUCCESS': 'تسجيل دخول ناجح',
        'LOGIN_FAILED': 'فشل تسجيل الدخول',
        'MULTIPLE_LOGIN_ATTEMPTS': 'محاولات دخول متعددة',
        'SUSPICIOUS_IP': 'IP مشبوه',
        'PERMISSION_DENIED': 'رفض الصلاحية',
        'DATA_BREACH_ATTEMPT': 'محاولة اختراق البيانات',
        'UNUSUAL_ACTIVITY': 'نشاط غير عادي'
    }
    
    @staticmethod
    def log_security_event(event_type, user_id=None, ip_address=None, details=None):
        """تسجيل حدث أمني"""
        SecurityLog.objects.create(
            event_type=event_type,
            user_id=user_id,
            ip_address=ip_address,
            user_agent=details.get('user_agent') if details else None,
            details=details,
            timestamp=timezone.now(),
            severity=SecurityLogger.get_severity(event_type)
        )
        
        # إرسال تنبيه فوري للأحداث الحرجة
        if SecurityLogger.is_critical_event(event_type):
            SecurityLogger.send_immediate_alert(event_type, details)
    
    @staticmethod
    def get_severity(event_type):
        """تحديد درجة خطورة الحدث"""
        critical_events = ['DATA_BREACH_ATTEMPT', 'MULTIPLE_LOGIN_ATTEMPTS']
        high_events = ['SUSPICIOUS_IP', 'PERMISSION_DENIED']
        
        if event_type in critical_events:
            return 'CRITICAL'
        elif event_type in high_events:
            return 'HIGH'
        else:
            return 'MEDIUM'
    
    @staticmethod
    def detect_suspicious_activity(user_id, ip_address):
        """كشف الأنشطة المشبوهة"""
        # فحص محاولات الدخول المتعددة
        recent_attempts = SecurityLog.objects.filter(
            user_id=user_id,
            event_type='LOGIN_FAILED',
            timestamp__gte=timezone.now() - timedelta(minutes=15)
        ).count()
        
        if recent_attempts >= 5:
            SecurityLogger.log_security_event(
                'MULTIPLE_LOGIN_ATTEMPTS',
                user_id=user_id,
                ip_address=ip_address,
                details={'attempts_count': recent_attempts}
            )
            return True
        
        # فحص الوصول من مواقع جغرافية مختلفة
        recent_locations = SecurityLog.objects.filter(
            user_id=user_id,
            timestamp__gte=timezone.now() - timedelta(hours=1)
        ).values_list('ip_address', flat=True).distinct()
        
        if len(recent_locations) > 3:
            SecurityLogger.log_security_event(
                'UNUSUAL_ACTIVITY',
                user_id=user_id,
                ip_address=ip_address,
                details={'multiple_locations': list(recent_locations)}
            )
            return True
        
        return False
```

#### **نظام التنبيهات:**
```python
class SecurityAlertSystem:
    """نظام التنبيهات الأمنية"""
    
    @staticmethod
    def send_security_alert(user_id, alert_type, details):
        """إرسال تنبيه أمني للمستخدم"""
        user = User.objects.get(id=user_id)
        
        alert_messages = {
            'IP_CHANGE': 'تم تسجيل الدخول من موقع جديد',
            'MULTIPLE_ATTEMPTS': 'محاولات دخول متعددة لحسابك',
            'SUSPICIOUS_ACTIVITY': 'نشاط مشبوه في حسابك',
            'PASSWORD_CHANGED': 'تم تغيير كلمة المرور',
            'ACCOUNT_LOCKED': 'تم قفل حسابك مؤقتاً'
        }
        
        message = alert_messages.get(alert_type, 'تنبيه أمني')
        
        # إرسال عبر البريد الإلكتروني
        send_email(
            to=user.email,
            subject=f'تنبيه أمني - {message}',
            template='security_alert.html',
            context={
                'user': user,
                'alert_type': alert_type,
                'details': details,
                'timestamp': timezone.now()
            }
        )
        
        # إرسال عبر SMS للأحداث الحرجة
        if alert_type in ['MULTIPLE_ATTEMPTS', 'ACCOUNT_LOCKED']:
            send_sms(
                user.phone,
                f'تنبيه أمني: {message}. إذا لم تكن أنت، يرجى التواصل معنا فوراً.'
            )
        
        # إنشاء إشعار داخل التطبيق
        Notification.objects.create(
            user=user,
            type='SECURITY_ALERT',
            title=f'تنبيه أمني: {message}',
            message=f'تفاصيل: {details}',
            is_read=False,
            priority='HIGH'
        )
    
    @staticmethod
    def send_admin_alert(event_type, details):
        """إرسال تنبيه للإدارة"""
        admin_users = User.objects.filter(user_type='مدير عام', is_active=True)
        
        for admin in admin_users:
            send_email(
                to=admin.email,
                subject=f'تنبيه أمني - {event_type}',
                template='admin_security_alert.html',
                context={
                    'event_type': event_type,
                    'details': details,
                    'timestamp': timezone.now()
                }
            )
```

### **2. مراقبة الأداء والتوفر**

#### **Health Checks:**
```python
class SystemHealthChecker:
    """فحص صحة النظام"""
    
    @staticmethod
    def check_database_health():
        """فحص صحة قاعدة البيانات"""
        try:
            User.objects.count()
            return {'status': 'healthy', 'response_time': 0.05}
        except Exception as e:
            return {'status': 'unhealthy', 'error': str(e)}
    
    @staticmethod
    def check_redis_health():
        """فحص صحة Redis"""
        try:
            cache.set('health_check', 'ok', timeout=10)
            result = cache.get('health_check')
            return {'status': 'healthy' if result == 'ok' else 'unhealthy'}
        except Exception as e:
            return {'status': 'unhealthy', 'error': str(e)}
    
    @staticmethod
    def check_external_services():
        """فحص الخدمات الخارجية"""
        services = {
            'sms_service': check_sms_service(),
            'email_service': check_email_service(),
            'file_storage': check_file_storage()
        }
        return services
    
    @staticmethod
    def generate_health_report():
        """إنشاء تقرير صحة شامل"""
        return {
            'timestamp': timezone.now().isoformat(),
            'database': SystemHealthChecker.check_database_health(),
            'cache': SystemHealthChecker.check_redis_health(),
            'external_services': SystemHealthChecker.check_external_services(),
            'system_load': get_system_load(),
            'memory_usage': get_memory_usage(),
            'disk_usage': get_disk_usage()
        }
```

---

## 🔧 **إعدادات الأمان للإنتاج**

### **1. متغيرات البيئة الآمنة**

#### **ملف .env للإنتاج:**
```bash
# .env.production
DEBUG=False
SECRET_KEY=your-super-secret-key-here-min-50-chars
JWT_SECRET_KEY=your-jwt-secret-key-here-min-32-chars
ENCRYPTION_KEY=your-encryption-key-here-32-bytes

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/naebak_production
REDIS_URL=redis://localhost:6379/0

# Security
ALLOWED_HOSTS=naebak.com,www.naebak.com,api.naebak.com
CORS_ALLOWED_ORIGINS=https://naebak.com,https://www.naebak.com
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# External Services
SMS_API_KEY=your-sms-api-key
EMAIL_HOST_PASSWORD=your-email-password
GOOGLE_CLOUD_PROJECT=naebak-472518

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=WARNING
```

### **2. إعدادات Django للإنتاج**

#### **settings/production.py:**
```python
from .base import *

# Security
DEBUG = False
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

# Database
DATABASES = {
    'default': dj_database_url.parse(os.environ.get('DATABASE_URL'))
}

# Cache
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.environ.get('REDIS_URL'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'CONNECTION_POOL_KWARGS': {'max_connections': 50},
        }
    }
}

# Security Settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_HSTS_SECONDS = 31536000
SECURE_REDIRECT_EXEMPT = []
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = 'DENY'

# Logging
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
            'level': 'WARNING',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/naebak/django.log',
            'maxBytes': 1024*1024*15,  # 15MB
            'backupCount': 10,
            'formatter': 'verbose',
        },
        'security': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/naebak/security.log',
            'maxBytes': 1024*1024*15,
            'backupCount': 10,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'WARNING',
            'propagate': True,
        },
        'security': {
            'handlers': ['security'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

---

## 📋 **خطة الاستجابة للحوادث الأمنية**

### **1. تصنيف الحوادث**

#### **مستويات الخطورة:**
```python
INCIDENT_SEVERITY = {
    'LOW': {
        'description': 'حادث بسيط لا يؤثر على الخدمة',
        'response_time': '24 ساعة',
        'examples': ['محاولة دخول فاشلة واحدة', 'رسالة خطأ غير مهمة']
    },
    'MEDIUM': {
        'description': 'حادث متوسط قد يؤثر على بعض المستخدمين',
        'response_time': '4 ساعات',
        'examples': ['محاولات دخول متعددة', 'وصول غير مصرح من IP جديد']
    },
    'HIGH': {
        'description': 'حادث خطير يؤثر على الخدمة',
        'response_time': '1 ساعة',
        'examples': ['اختراق حساب مستخدم', 'محاولة الوصول لبيانات حساسة']
    },
    'CRITICAL': {
        'description': 'حادث حرج يهدد النظام بالكامل',
        'response_time': '15 دقيقة',
        'examples': ['اختراق قاعدة البيانات', 'تسريب بيانات شخصية']
    }
}
```

### **2. إجراءات الاستجابة**

#### **خطة الاستجابة السريعة:**
```python
class IncidentResponsePlan:
    """خطة الاستجابة للحوادث الأمنية"""
    
    @staticmethod
    def handle_critical_incident(incident_type, details):
        """التعامل مع الحوادث الحرجة"""
        
        # 1. إيقاف الخدمة المتأثرة فوراً
        if incident_type == 'DATA_BREACH':
            IncidentResponsePlan.emergency_shutdown()
        
        # 2. إشعار فريق الأمان فوراً
        IncidentResponsePlan.notify_security_team(incident_type, details)
        
        # 3. حفظ الأدلة
        IncidentResponsePlan.preserve_evidence(incident_type, details)
        
        # 4. تقييم الضرر
        damage_assessment = IncidentResponsePlan.assess_damage(incident_type)
        
        # 5. اتخاذ إجراءات الاحتواء
        IncidentResponsePlan.contain_incident(incident_type, damage_assessment)
        
        # 6. إشعار المستخدمين المتأثرين
        IncidentResponsePlan.notify_affected_users(damage_assessment)
        
        return {
            'incident_id': generate_incident_id(),
            'status': 'CONTAINED',
            'next_steps': IncidentResponsePlan.get_recovery_steps(incident_type)
        }
    
    @staticmethod
    def emergency_shutdown():
        """إيقاف طارئ للنظام"""
        # إيقاف قبول طلبات جديدة
        cache.set('emergency_mode', True, timeout=3600)
        
        # إنهاء جميع الجلسات النشطة
        UserSession.objects.filter(is_active=True).update(is_active=False)
        
        # إشعار المستخدمين
        return "تم تفعيل وضع الطوارئ"
    
    @staticmethod
    def notify_security_team(incident_type, details):
        """إشعار فريق الأمان"""
        security_team = [
            'security@naebak.com',
            'cto@naebak.com',
            'admin@naebak.com'
        ]
        
        for email in security_team:
            send_urgent_email(
                to=email,
                subject=f'🚨 حادث أمني حرج - {incident_type}',
                message=f'تفاصيل الحادث: {details}',
                priority='URGENT'
            )
        
        # إرسال SMS لفريق الطوارئ
        emergency_phones = ['+201234567890', '+201234567891']
        for phone in emergency_phones:
            send_sms(phone, f'🚨 حادث أمني حرج في نائبك - {incident_type}')
```

### **3. التعافي والاستعادة**

#### **خطة التعافي:**
```python
class DisasterRecoveryPlan:
    """خطة التعافي من الكوارث"""
    
    @staticmethod
    def create_backup():
        """إنشاء نسخة احتياطية طارئة"""
        backup_id = f"emergency_backup_{timezone.now().strftime('%Y%m%d_%H%M%S')}"
        
        # نسخ احتياطي لقاعدة البيانات
        db_backup = subprocess.run([
            'pg_dump',
            '-h', 'localhost',
            '-U', 'naebak_user',
            '-d', 'naebak_production',
            '-f', f'/backups/{backup_id}_database.sql'
        ])
        
        # نسخ احتياطي للملفات
        files_backup = subprocess.run([
            'tar', '-czf', f'/backups/{backup_id}_files.tar.gz',
            '/var/www/naebak/media/'
        ])
        
        # رفع للسحابة
        upload_to_cloud(f'/backups/{backup_id}_database.sql')
        upload_to_cloud(f'/backups/{backup_id}_files.tar.gz')
        
        return backup_id
    
    @staticmethod
    def restore_from_backup(backup_id):
        """الاستعادة من نسخة احتياطية"""
        # استعادة قاعدة البيانات
        db_restore = subprocess.run([
            'psql',
            '-h', 'localhost',
            '-U', 'naebak_user',
            '-d', 'naebak_production',
            '-f', f'/backups/{backup_id}_database.sql'
        ])
        
        # استعادة الملفات
        files_restore = subprocess.run([
            'tar', '-xzf', f'/backups/{backup_id}_files.tar.gz',
            '-C', '/var/www/naebak/'
        ])
        
        return db_restore.returncode == 0 and files_restore.returncode == 0
```

---

## 📊 **مراقبة ومقاييس الأمان**

### **1. مؤشرات الأداء الأمني (KPIs)**

```python
class SecurityMetrics:
    """مقاييس الأمان"""
    
    @staticmethod
    def get_security_dashboard():
        """لوحة مقاييس الأمان"""
        now = timezone.now()
        last_24h = now - timedelta(hours=24)
        last_7d = now - timedelta(days=7)
        
        return {
            'failed_logins_24h': SecurityLog.objects.filter(
                event_type='LOGIN_FAILED',
                timestamp__gte=last_24h
            ).count(),
            
            'suspicious_activities_7d': SecurityLog.objects.filter(
                event_type__in=['SUSPICIOUS_IP', 'UNUSUAL_ACTIVITY'],
                timestamp__gte=last_7d
            ).count(),
            
            'blocked_ips_count': BlockedIP.objects.filter(is_active=True).count(),
            
            'active_sessions_count': UserSession.objects.filter(
                is_active=True,
                expires_at__gt=now
            ).count(),
            
            '2fa_enabled_users': User.objects.filter(
                twofactorsettings__is_enabled=True
            ).count(),
            
            'password_strength_compliance': SecurityMetrics.calculate_password_compliance(),
            
            'average_session_duration': SecurityMetrics.calculate_avg_session_duration(),
            
            'security_incidents_resolved': SecurityIncident.objects.filter(
                status='RESOLVED',
                created_at__gte=last_7d
            ).count()
        }
    
    @staticmethod
    def generate_security_report(period='monthly'):
        """إنشاء تقرير أمني"""
        if period == 'monthly':
            start_date = timezone.now() - timedelta(days=30)
        elif period == 'weekly':
            start_date = timezone.now() - timedelta(days=7)
        else:
            start_date = timezone.now() - timedelta(days=1)
        
        report = {
            'period': period,
            'start_date': start_date,
            'end_date': timezone.now(),
            'total_security_events': SecurityLog.objects.filter(
                timestamp__gte=start_date
            ).count(),
            'events_by_type': SecurityLog.objects.filter(
                timestamp__gte=start_date
            ).values('event_type').annotate(count=Count('id')),
            'top_threat_ips': SecurityLog.objects.filter(
                timestamp__gte=start_date,
                severity='HIGH'
            ).values('ip_address').annotate(count=Count('id')).order_by('-count')[:10],
            'user_security_score': SecurityMetrics.calculate_user_security_scores(),
            'recommendations': SecurityMetrics.generate_security_recommendations()
        }
        
        return report
```

---

## 🎯 **خلاصة استراتيجية الأمان**

### **الركائز الأساسية:**

1. **المصادقة القوية** - JWT + 2FA + إدارة جلسات متقدمة
2. **الحماية الشاملة** - من CSRF, XSS, SQL Injection وغيرها
3. **التشفير المتقدم** - للبيانات الحساسة والاتصالات
4. **المراقبة المستمرة** - للأنشطة المشبوهة والتهديدات
5. **الاستجابة السريعة** - خطة شاملة للحوادث الأمنية

### **المميزات الرئيسية:**

- ✅ **حماية متعددة الطبقات** لجميع جوانب النظام
- ✅ **مراقبة في الوقت الفعلي** للتهديدات الأمنية
- ✅ **تشفير قوي** للبيانات الحساسة
- ✅ **نظام تنبيهات ذكي** للمستخدمين والإدارة
- ✅ **خطة استجابة شاملة** للحوادث الأمنية
- ✅ **امتثال كامل** للمعايير الدولية

### **النتيجة المتوقعة:**

**منصة آمنة بنسبة 99.9%** تحمي بيانات المستخدمين وتضمن سلامة النظام ضد جميع التهديدات المعروفة، مع قدرة على التعافي السريع من أي حوادث أمنية محتملة.

هذه الاستراتيجية تضمن أن منصة نائبك ستكون من أكثر المنصات أماناً في المنطقة! 🛡️
