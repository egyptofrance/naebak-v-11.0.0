# Naebak Error Handling Guide - دليل معالجة الأخطاء

## 🎯 **استراتيجية معالجة الأخطاء**

### **المبادئ الأساسية:**
1. **الشفافية**: رسائل خطأ واضحة ومفيدة
2. **الأمان**: عدم كشف معلومات حساسة
3. **التسجيل**: تسجيل جميع الأخطاء للمراجعة
4. **التعافي**: محاولة التعافي التلقائي عند الإمكان
5. **تجربة المستخدم**: رسائل مفهومة باللغة العربية

### **مستويات الأخطاء:**
- **CRITICAL**: أخطاء تؤثر على النظام بالكامل
- **ERROR**: أخطاء تمنع إتمام العملية
- **WARNING**: تحذيرات لا تمنع العملية
- **INFO**: معلومات للمراجعة
- **DEBUG**: تفاصيل للتطوير

---

## 🔐 **1. أخطاء المصادقة والأمان**

### **1.1 أخطاء تسجيل الدخول**

#### **كود الخطأ: AUTH_001**
```python
class InvalidCredentialsError(Exception):
    """بيانات تسجيل الدخول غير صحيحة"""
    
    def __init__(self, username=None):
        self.code = "AUTH_001"
        self.message_ar = "اسم المستخدم أو كلمة المرور غير صحيحة"
        self.message_en = "Invalid username or password"
        self.username = username
        self.http_status = 401
        
        # تسجيل محاولة الدخول الفاشلة
        logger.warning(f"Failed login attempt for username: {username}")
        
        # زيادة عداد المحاولات الفاشلة
        increment_failed_attempts(username)

# معالج الخطأ
@app.errorhandler(InvalidCredentialsError)
def handle_invalid_credentials(error):
    return jsonify({
        "error": {
            "code": error.code,
            "message": error.message_ar,
            "message_en": error.message_en
        }
    }), error.http_status

# الاستخدام في API
def login_user(username, password):
    try:
        user = authenticate_user(username, password)
        if not user:
            raise InvalidCredentialsError(username)
        
        return generate_tokens(user)
        
    except InvalidCredentialsError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}")
        raise InternalServerError()
```

#### **كود الخطأ: AUTH_002**
```python
class AccountLockedError(Exception):
    """الحساب مقفل بسبب محاولات فاشلة متعددة"""
    
    def __init__(self, username, unlock_time):
        self.code = "AUTH_002"
        self.message_ar = f"الحساب مقفل مؤقتاً. يمكن المحاولة مرة أخرى في {unlock_time}"
        self.message_en = f"Account temporarily locked. Try again at {unlock_time}"
        self.username = username
        self.unlock_time = unlock_time
        self.http_status = 423
        
        logger.warning(f"Account locked for user: {username}")

def check_account_lock_status(username):
    """فحص حالة قفل الحساب"""
    failed_attempts = get_failed_attempts(username)
    
    if failed_attempts >= MAX_FAILED_ATTEMPTS:
        lock_duration = calculate_lock_duration(failed_attempts)
        unlock_time = datetime.now() + lock_duration
        
        raise AccountLockedError(username, unlock_time)
```

#### **كود الخطأ: AUTH_003**
```python
class TokenExpiredError(Exception):
    """انتهت صلاحية الرمز المميز"""
    
    def __init__(self, token_type="access"):
        self.code = "AUTH_003"
        self.message_ar = "انتهت صلاحية جلسة الدخول. يرجى تسجيل الدخول مرة أخرى"
        self.message_en = "Session expired. Please login again"
        self.token_type = token_type
        self.http_status = 401

def verify_token(token):
    """التحقق من صحة الرمز المميز"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
        
    except jwt.ExpiredSignatureError:
        raise TokenExpiredError()
    except jwt.InvalidTokenError:
        raise InvalidTokenError()
```

### **1.2 أخطاء التسجيل**

#### **كود الخطأ: REG_001**
```python
class DuplicateUserError(Exception):
    """مستخدم موجود بالفعل"""
    
    def __init__(self, field, value):
        self.code = "REG_001"
        self.field = field
        self.value = value
        
        field_names = {
            "email": "البريد الإلكتروني",
            "username": "اسم المستخدم",
            "phone": "رقم التليفون"
        }
        
        field_ar = field_names.get(field, field)
        self.message_ar = f"{field_ar} مستخدم بالفعل"
        self.message_en = f"{field} already exists"
        self.http_status = 400

def register_user(user_data):
    """تسجيل مستخدم جديد"""
    try:
        # فحص البيانات المكررة
        if User.objects.filter(email=user_data['email']).exists():
            raise DuplicateUserError("email", user_data['email'])
            
        if User.objects.filter(username=user_data['username']).exists():
            raise DuplicateUserError("username", user_data['username'])
            
        if User.objects.filter(phone=user_data['phone']).exists():
            raise DuplicateUserError("phone", user_data['phone'])
        
        # إنشاء المستخدم
        user = User.objects.create(**user_data)
        logger.info(f"New user registered: {user.username}")
        
        return user
        
    except DuplicateUserError:
        raise
    except Exception as e:
        logger.error(f"Error during user registration: {str(e)}")
        raise InternalServerError()
```

#### **كود الخطأ: REG_002**
```python
class InvalidPhoneNumberError(Exception):
    """رقم تليفون غير صحيح"""
    
    def __init__(self, phone):
        self.code = "REG_002"
        self.message_ar = "رقم التليفون غير صحيح. يجب أن يكون رقم مصري صحيح"
        self.message_en = "Invalid phone number. Must be a valid Egyptian number"
        self.phone = phone
        self.http_status = 400

def validate_egyptian_phone(phone):
    """التحقق من صحة رقم التليفون المصري"""
    import re
    
    # أنماط أرقام التليفون المصرية
    patterns = [
        r'^01[0125][0-9]{8}$',  # موبايل
        r'^0[2-9][0-9]{7,8}$'   # أرضي
    ]
    
    phone_clean = re.sub(r'[^\d]', '', phone)
    
    for pattern in patterns:
        if re.match(pattern, phone_clean):
            return phone_clean
    
    raise InvalidPhoneNumberError(phone)
```

---

## 📝 **2. أخطاء الشكاوى**

### **2.1 أخطاء إرسال الشكوى**

#### **كود الخطأ: COMP_001**
```python
class ComplaintLimitExceededError(Exception):
    """تجاوز الحد الأقصى للشكاوى اليومية"""
    
    def __init__(self, current_count, max_allowed):
        self.code = "COMP_001"
        self.message_ar = f"تجاوزت الحد الأقصى للشكاوى اليومية ({max_allowed}). عدد الشكاوى اليوم: {current_count}"
        self.message_en = f"Daily complaint limit exceeded ({max_allowed}). Today's count: {current_count}"
        self.current_count = current_count
        self.max_allowed = max_allowed
        self.http_status = 429

def check_daily_complaint_limit(user_id):
    """فحص الحد الأقصى للشكاوى اليومية"""
    today = datetime.now().date()
    daily_count = Complaint.objects.filter(
        citizen_id=user_id,
        created_at__date=today
    ).count()
    
    if daily_count >= DAILY_COMPLAINT_LIMIT:
        raise ComplaintLimitExceededError(daily_count, DAILY_COMPLAINT_LIMIT)
```

#### **كود الخطأ: COMP_002**
```python
class InvalidFileTypeError(Exception):
    """نوع ملف غير مسموح"""
    
    def __init__(self, file_type, allowed_types):
        self.code = "COMP_002"
        self.message_ar = f"نوع الملف غير مسموح ({file_type}). الأنواع المسموحة: {', '.join(allowed_types)}"
        self.message_en = f"File type not allowed ({file_type}). Allowed types: {', '.join(allowed_types)}"
        self.file_type = file_type
        self.allowed_types = allowed_types
        self.http_status = 400

def validate_file_type(file):
    """التحقق من نوع الملف"""
    allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4']
    
    if file.content_type not in allowed_types:
        raise InvalidFileTypeError(file.content_type, allowed_types)
```

#### **كود الخطأ: COMP_003**
```python
class FileSizeExceededError(Exception):
    """حجم الملف كبير جداً"""
    
    def __init__(self, file_size, max_size):
        self.code = "COMP_003"
        self.message_ar = f"حجم الملف كبير جداً ({file_size:.1f}MB). الحد الأقصى: {max_size}MB"
        self.message_en = f"File size too large ({file_size:.1f}MB). Maximum: {max_size}MB"
        self.file_size = file_size
        self.max_size = max_size
        self.http_status = 413

def validate_file_size(file, max_size_mb=10):
    """التحقق من حجم الملف"""
    file_size_mb = file.size / (1024 * 1024)
    
    if file_size_mb > max_size_mb:
        raise FileSizeExceededError(file_size_mb, max_size_mb)
```

### **2.2 أخطاء معالجة الشكاوى**

#### **كود الخطأ: COMP_004**
```python
class ComplaintNotFoundError(Exception):
    """الشكوى غير موجودة"""
    
    def __init__(self, complaint_id):
        self.code = "COMP_004"
        self.message_ar = "الشكوى غير موجودة أو تم حذفها"
        self.message_en = "Complaint not found or has been deleted"
        self.complaint_id = complaint_id
        self.http_status = 404

def get_complaint_by_id(complaint_id, user_id=None):
    """الحصول على شكوى بالمعرف"""
    try:
        query = Complaint.objects.filter(id=complaint_id)
        
        # إذا كان مستخدم عادي، فقط شكاواه
        if user_id and not is_admin(user_id):
            query = query.filter(citizen_id=user_id)
        
        complaint = query.get()
        return complaint
        
    except Complaint.DoesNotExist:
        raise ComplaintNotFoundError(complaint_id)
```

#### **كود الخطأ: COMP_005**
```python
class ComplaintAlreadyResolvedError(Exception):
    """الشكوى محلولة بالفعل"""
    
    def __init__(self, complaint_id):
        self.code = "COMP_005"
        self.message_ar = "لا يمكن تعديل شكوى محلولة بالفعل"
        self.message_en = "Cannot modify an already resolved complaint"
        self.complaint_id = complaint_id
        self.http_status = 400

def update_complaint(complaint_id, updates, user_id):
    """تحديث الشكوى"""
    complaint = get_complaint_by_id(complaint_id, user_id)
    
    if complaint.status == 'resolved':
        raise ComplaintAlreadyResolvedError(complaint_id)
    
    # تطبيق التحديثات
    for field, value in updates.items():
        setattr(complaint, field, value)
    
    complaint.save()
    return complaint
```

---

## 💬 **3. أخطاء الرسائل**

### **3.1 أخطاء إرسال الرسائل**

#### **كود الخطأ: MSG_001**
```python
class MessageLimitExceededError(Exception):
    """تجاوز الحد الأقصى للرسائل"""
    
    def __init__(self, current_count, max_allowed, period):
        self.code = "MSG_001"
        self.message_ar = f"تجاوزت الحد الأقصى للرسائل ({max_allowed} رسالة كل {period}). عدد الرسائل: {current_count}"
        self.message_en = f"Message limit exceeded ({max_allowed} per {period}). Current count: {current_count}"
        self.http_status = 429

def check_message_limit(user_id):
    """فحص حد الرسائل"""
    hour_ago = datetime.now() - timedelta(hours=1)
    hourly_count = Message.objects.filter(
        sender_id=user_id,
        created_at__gte=hour_ago
    ).count()
    
    if hourly_count >= HOURLY_MESSAGE_LIMIT:
        raise MessageLimitExceededError(hourly_count, HOURLY_MESSAGE_LIMIT, "ساعة")
```

#### **كود الخطأ: MSG_002**
```python
class RecipientNotFoundError(Exception):
    """المستقبل غير موجود"""
    
    def __init__(self, recipient_id):
        self.code = "MSG_002"
        self.message_ar = "المستقبل غير موجود أو غير نشط"
        self.message_en = "Recipient not found or inactive"
        self.recipient_id = recipient_id
        self.http_status = 404

def validate_recipient(recipient_id):
    """التحقق من وجود المستقبل"""
    try:
        recipient = User.objects.get(id=recipient_id, is_active=True)
        return recipient
    except User.DoesNotExist:
        raise RecipientNotFoundError(recipient_id)
```

#### **كود الخطأ: MSG_003**
```python
class MessageTooLongError(Exception):
    """الرسالة طويلة جداً"""
    
    def __init__(self, current_length, max_length):
        self.code = "MSG_003"
        self.message_ar = f"الرسالة طويلة جداً ({current_length} حرف). الحد الأقصى: {max_length} حرف"
        self.message_en = f"Message too long ({current_length} chars). Maximum: {max_length} chars"
        self.http_status = 400

def validate_message_content(content):
    """التحقق من محتوى الرسالة"""
    if len(content) > MAX_MESSAGE_LENGTH:
        raise MessageTooLongError(len(content), MAX_MESSAGE_LENGTH)
    
    # فحص المحتوى المسيء
    if contains_inappropriate_content(content):
        raise InappropriateContentError()
```

---

## ⭐ **4. أخطاء التقييمات**

### **4.1 أخطاء إضافة التقييم**

#### **كود الخطأ: RATE_001**
```python
class DuplicateRatingError(Exception):
    """تقييم مكرر"""
    
    def __init__(self, candidate_id):
        self.code = "RATE_001"
        self.message_ar = "لقد قمت بتقييم هذا المرشح من قبل. يمكنك تعديل التقييم السابق"
        self.message_en = "You have already rated this candidate. You can update your previous rating"
        self.candidate_id = candidate_id
        self.http_status = 400

def check_existing_rating(citizen_id, candidate_id):
    """فحص التقييم الموجود"""
    existing_rating = Rating.objects.filter(
        citizen_id=citizen_id,
        candidate_id=candidate_id
    ).first()
    
    if existing_rating:
        raise DuplicateRatingError(candidate_id)
```

#### **كود الخطأ: RATE_002**
```python
class InvalidRatingValueError(Exception):
    """قيمة تقييم غير صحيحة"""
    
    def __init__(self, rating_value):
        self.code = "RATE_002"
        self.message_ar = f"قيمة التقييم غير صحيحة ({rating_value}). يجب أن تكون بين 1 و 5"
        self.message_en = f"Invalid rating value ({rating_value}). Must be between 1 and 5"
        self.rating_value = rating_value
        self.http_status = 400

def validate_rating_value(rating):
    """التحقق من قيمة التقييم"""
    if not isinstance(rating, int) or rating < 1 or rating > 5:
        raise InvalidRatingValueError(rating)
```

#### **كود الخطأ: RATE_003**
```python
class SelfRatingError(Exception):
    """لا يمكن تقييم النفس"""
    
    def __init__(self):
        self.code = "RATE_003"
        self.message_ar = "لا يمكنك تقييم نفسك"
        self.message_en = "You cannot rate yourself"
        self.http_status = 400

def validate_rating_permission(citizen_id, candidate_id):
    """التحقق من صلاحية التقييم"""
    # التحقق من أن المواطن لا يقيم نفسه
    citizen = User.objects.get(id=citizen_id)
    candidate = Candidate.objects.get(id=candidate_id)
    
    if citizen.id == candidate.user_id:
        raise SelfRatingError()
```

---

## 🔧 **5. أخطاء النظام**

### **5.1 أخطاء قاعدة البيانات**

#### **كود الخطأ: DB_001**
```python
class DatabaseConnectionError(Exception):
    """خطأ في الاتصال بقاعدة البيانات"""
    
    def __init__(self, database_name):
        self.code = "DB_001"
        self.message_ar = "خطأ في الاتصال بقاعدة البيانات. يرجى المحاولة لاحقاً"
        self.message_en = "Database connection error. Please try again later"
        self.database_name = database_name
        self.http_status = 503
        
        # إرسال تنبيه للإدارة
        send_admin_alert(f"Database connection failed: {database_name}")

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def execute_database_query(query, params=None):
    """تنفيذ استعلام قاعدة البيانات مع إعادة المحاولة"""
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()
            
    except OperationalError as e:
        logger.error(f"Database query failed: {str(e)}")
        raise DatabaseConnectionError("main")
```

#### **كود الخطأ: DB_002**
```python
class DatabaseTimeoutError(Exception):
    """انتهت مهلة الاستعلام"""
    
    def __init__(self, query_time):
        self.code = "DB_002"
        self.message_ar = "الاستعلام يستغرق وقتاً أطول من المتوقع. يرجى المحاولة لاحقاً"
        self.message_en = "Query is taking longer than expected. Please try again later"
        self.query_time = query_time
        self.http_status = 504

def execute_with_timeout(func, timeout=30):
    """تنفيذ دالة مع مهلة زمنية"""
    import signal
    
    def timeout_handler(signum, frame):
        raise DatabaseTimeoutError(timeout)
    
    signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(timeout)
    
    try:
        result = func()
        signal.alarm(0)  # إلغاء المنبه
        return result
    except DatabaseTimeoutError:
        raise
```

### **5.2 أخطاء الملفات**

#### **كود الخطأ: FILE_001**
```python
class FileUploadError(Exception):
    """خطأ في رفع الملف"""
    
    def __init__(self, filename, reason):
        self.code = "FILE_001"
        self.message_ar = f"فشل في رفع الملف {filename}: {reason}"
        self.message_en = f"Failed to upload file {filename}: {reason}"
        self.filename = filename
        self.reason = reason
        self.http_status = 500

def upload_file_safely(file, destination):
    """رفع ملف بأمان"""
    try:
        # إنشاء اسم ملف آمن
        safe_filename = secure_filename(file.filename)
        file_path = os.path.join(destination, safe_filename)
        
        # التحقق من المساحة المتاحة
        if not has_sufficient_disk_space(file.size):
            raise FileUploadError(safe_filename, "مساحة القرص غير كافية")
        
        # رفع الملف
        file.save(file_path)
        
        # التحقق من سلامة الملف
        if not verify_file_integrity(file_path):
            os.remove(file_path)
            raise FileUploadError(safe_filename, "الملف تالف")
        
        return file_path
        
    except Exception as e:
        logger.error(f"File upload error: {str(e)}")
        raise FileUploadError(file.filename, str(e))
```

#### **كود الخطأ: FILE_002**
```python
class FileNotFoundError(Exception):
    """الملف غير موجود"""
    
    def __init__(self, file_path):
        self.code = "FILE_002"
        self.message_ar = "الملف المطلوب غير موجود أو تم حذفه"
        self.message_en = "Requested file not found or has been deleted"
        self.file_path = file_path
        self.http_status = 404

def serve_file_safely(file_path):
    """تقديم ملف بأمان"""
    if not os.path.exists(file_path):
        raise FileNotFoundError(file_path)
    
    # التحقق من الصلاحيات
    if not os.access(file_path, os.R_OK):
        raise FilePermissionError(file_path)
    
    return send_file(file_path)
```

---

## 🌐 **6. أخطاء الشبكة والخدمات الخارجية**

### **6.1 أخطاء الخدمات الخارجية**

#### **كود الخطأ: EXT_001**
```python
class ExternalServiceError(Exception):
    """خطأ في خدمة خارجية"""
    
    def __init__(self, service_name, status_code, response):
        self.code = "EXT_001"
        self.message_ar = f"خطأ في الخدمة الخارجية {service_name}. يرجى المحاولة لاحقاً"
        self.message_en = f"External service {service_name} error. Please try again later"
        self.service_name = service_name
        self.status_code = status_code
        self.response = response
        self.http_status = 503

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def call_external_service(service_url, data=None, timeout=30):
    """استدعاء خدمة خارجية مع إعادة المحاولة"""
    try:
        response = requests.post(service_url, json=data, timeout=timeout)
        
        if response.status_code != 200:
            raise ExternalServiceError(
                service_url, 
                response.status_code, 
                response.text
            )
        
        return response.json()
        
    except requests.exceptions.Timeout:
        raise ExternalServiceTimeoutError(service_url, timeout)
    except requests.exceptions.ConnectionError:
        raise ExternalServiceConnectionError(service_url)
```

#### **كود الخطأ: EXT_002**
```python
class ExternalServiceTimeoutError(Exception):
    """انتهت مهلة الخدمة الخارجية"""
    
    def __init__(self, service_url, timeout):
        self.code = "EXT_002"
        self.message_ar = f"انتهت مهلة الاتصال بالخدمة الخارجية ({timeout}s)"
        self.message_en = f"External service timeout ({timeout}s)"
        self.service_url = service_url
        self.timeout = timeout
        self.http_status = 504
```

---

## 📊 **7. معالج الأخطاء العام**

### **7.1 معالج الأخطاء المركزي**

```python
class ErrorHandler:
    """معالج الأخطاء المركزي"""
    
    def __init__(self, app):
        self.app = app
        self.setup_error_handlers()
    
    def setup_error_handlers(self):
        """إعداد معالجات الأخطاء"""
        
        @self.app.errorhandler(400)
        def handle_bad_request(error):
            return self.format_error_response("BAD_REQUEST", 
                "طلب غير صحيح", "Bad request", 400)
        
        @self.app.errorhandler(401)
        def handle_unauthorized(error):
            return self.format_error_response("UNAUTHORIZED", 
                "غير مصرح", "Unauthorized", 401)
        
        @self.app.errorhandler(403)
        def handle_forbidden(error):
            return self.format_error_response("FORBIDDEN", 
                "ممنوع", "Forbidden", 403)
        
        @self.app.errorhandler(404)
        def handle_not_found(error):
            return self.format_error_response("NOT_FOUND", 
                "غير موجود", "Not found", 404)
        
        @self.app.errorhandler(500)
        def handle_internal_error(error):
            logger.error(f"Internal server error: {str(error)}")
            return self.format_error_response("INTERNAL_ERROR", 
                "خطأ داخلي في الخادم", "Internal server error", 500)
    
    def format_error_response(self, code, message_ar, message_en, status_code):
        """تنسيق استجابة الخطأ"""
        return jsonify({
            "error": {
                "code": code,
                "message": message_ar,
                "message_en": message_en,
                "timestamp": datetime.now().isoformat(),
                "request_id": generate_request_id()
            }
        }), status_code
```

### **7.2 تسجيل الأخطاء**

```python
import logging
from logging.handlers import RotatingFileHandler
import json

class StructuredLogger:
    """مسجل الأخطاء المنظم"""
    
    def __init__(self, name="naebak"):
        self.logger = logging.getLogger(name)
        self.setup_logger()
    
    def setup_logger(self):
        """إعداد المسجل"""
        self.logger.setLevel(logging.INFO)
        
        # معالج الملفات مع التدوير
        file_handler = RotatingFileHandler(
            'logs/naebak.log', 
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5
        )
        
        # معالج وحدة التحكم
        console_handler = logging.StreamHandler()
        
        # تنسيق JSON
        formatter = logging.Formatter(
            '{"timestamp": "%(asctime)s", "level": "%(levelname)s", '
            '"message": "%(message)s", "module": "%(name)s"}'
        )
        
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)
    
    def log_error(self, error, context=None):
        """تسجيل خطأ مع السياق"""
        error_data = {
            "error_code": getattr(error, 'code', 'UNKNOWN'),
            "error_message": str(error),
            "error_type": type(error).__name__,
            "context": context or {}
        }
        
        self.logger.error(json.dumps(error_data, ensure_ascii=False))
    
    def log_warning(self, message, context=None):
        """تسجيل تحذير"""
        warning_data = {
            "message": message,
            "context": context or {}
        }
        
        self.logger.warning(json.dumps(warning_data, ensure_ascii=False))

# إنشاء مسجل عام
logger = StructuredLogger()
```

### **7.3 مراقبة الأخطاء**

```python
class ErrorMonitor:
    """مراقب الأخطاء"""
    
    def __init__(self):
        self.error_counts = {}
        self.alert_thresholds = {
            'CRITICAL': 1,    # تنبيه فوري
            'ERROR': 10,      # 10 أخطاء في الساعة
            'WARNING': 50     # 50 تحذير في الساعة
        }
    
    def record_error(self, error_level, error_code):
        """تسجيل خطأ في المراقب"""
        current_hour = datetime.now().strftime('%Y-%m-%d-%H')
        key = f"{current_hour}:{error_level}:{error_code}"
        
        self.error_counts[key] = self.error_counts.get(key, 0) + 1
        
        # فحص التنبيهات
        if self.should_alert(error_level, error_code):
            self.send_alert(error_level, error_code, self.error_counts[key])
    
    def should_alert(self, error_level, error_code):
        """فحص ضرورة إرسال تنبيه"""
        current_hour = datetime.now().strftime('%Y-%m-%d-%H')
        key = f"{current_hour}:{error_level}:{error_code}"
        
        count = self.error_counts.get(key, 0)
        threshold = self.alert_thresholds.get(error_level, float('inf'))
        
        return count >= threshold
    
    def send_alert(self, error_level, error_code, count):
        """إرسال تنبيه للإدارة"""
        alert_message = f"""
        🚨 تنبيه خطأ في نظام نائبك
        
        المستوى: {error_level}
        كود الخطأ: {error_code}
        العدد: {count}
        الوقت: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """
        
        # إرسال عبر البريد الإلكتروني
        send_admin_email("تنبيه خطأ في النظام", alert_message)
        
        # إرسال عبر Slack أو Discord
        send_slack_notification(alert_message)

# إنشاء مراقب عام
error_monitor = ErrorMonitor()
```

---

## 🔄 **8. استراتيجيات التعافي**

### **8.1 إعادة المحاولة التلقائية**

```python
from tenacity import retry, stop_after_attempt, wait_exponential

class RetryableOperation:
    """عملية قابلة لإعادة المحاولة"""
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        retry=retry_if_exception_type((ConnectionError, TimeoutError))
    )
    def execute_with_retry(self, operation, *args, **kwargs):
        """تنفيذ عملية مع إعادة المحاولة"""
        try:
            return operation(*args, **kwargs)
        except Exception as e:
            logger.warning(f"Operation failed, retrying: {str(e)}")
            raise

# استخدام إعادة المحاولة
retry_operation = RetryableOperation()

def send_notification_with_retry(user_id, message):
    """إرسال إشعار مع إعادة المحاولة"""
    return retry_operation.execute_with_retry(
        send_notification, user_id, message
    )
```

### **8.2 الوضع الآمن (Graceful Degradation)**

```python
class GracefulDegradation:
    """التدهور التدريجي للخدمة"""
    
    def __init__(self):
        self.service_status = {
            'database': True,
            'file_storage': True,
            'external_apis': True,
            'notifications': True
        }
    
    def check_service_health(self, service_name):
        """فحص صحة الخدمة"""
        try:
            if service_name == 'database':
                # فحص قاعدة البيانات
                with connection.cursor() as cursor:
                    cursor.execute("SELECT 1")
                    
            elif service_name == 'file_storage':
                # فحص تخزين الملفات
                test_file_path = '/tmp/health_check.txt'
                with open(test_file_path, 'w') as f:
                    f.write('health check')
                os.remove(test_file_path)
                
            elif service_name == 'external_apis':
                # فحص الخدمات الخارجية
                response = requests.get('https://api.example.com/health', timeout=5)
                response.raise_for_status()
            
            self.service_status[service_name] = True
            return True
            
        except Exception as e:
            logger.error(f"Service {service_name} health check failed: {str(e)}")
            self.service_status[service_name] = False
            return False
    
    def get_available_features(self):
        """الحصول على الميزات المتاحة"""
        features = {
            'user_registration': self.service_status['database'],
            'complaint_submission': self.service_status['database'] and self.service_status['file_storage'],
            'message_sending': self.service_status['database'],
            'notifications': self.service_status['notifications'],
            'file_upload': self.service_status['file_storage']
        }
        
        return features
    
    def handle_degraded_service(self, feature_name):
        """معالجة الخدمة المتدهورة"""
        if feature_name == 'file_upload':
            return {
                "message": "خدمة رفع الملفات غير متاحة مؤقتاً. يمكنك إرسال الشكوى بدون مرفقات",
                "alternative": "text_only_complaint"
            }
        
        elif feature_name == 'notifications':
            return {
                "message": "خدمة الإشعارات غير متاحة. سيتم إرسال الإشعارات لاحقاً",
                "alternative": "email_notification"
            }
        
        return {
            "message": "الخدمة غير متاحة مؤقتاً. يرجى المحاولة لاحقاً",
            "alternative": None
        }

# إنشاء مدير التدهور التدريجي
graceful_degradation = GracefulDegradation()
```

---

## 📱 **9. أخطاء الواجهة الأمامية**

### **9.1 معالجة أخطاء JavaScript**

```javascript
// معالج الأخطاء العام للواجهة الأمامية
class FrontendErrorHandler {
    constructor() {
        this.setupGlobalErrorHandlers();
        this.setupApiErrorHandlers();
    }
    
    setupGlobalErrorHandlers() {
        // معالجة أخطاء JavaScript
        window.addEventListener('error', (event) => {
            this.logError('JS_ERROR', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });
        
        // معالجة أخطاء Promise المرفوضة
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('PROMISE_REJECTION', {
                reason: event.reason,
                stack: event.reason?.stack
            });
        });
    }
    
    setupApiErrorHandlers() {
        // اعتراض طلبات Axios
        axios.interceptors.response.use(
            response => response,
            error => {
                this.handleApiError(error);
                return Promise.reject(error);
            }
        );
    }
    
    handleApiError(error) {
        const errorInfo = {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method
        };
        
        // عرض رسالة خطأ مناسبة للمستخدم
        switch (error.response?.status) {
            case 401:
                this.showError('انتهت جلسة الدخول. يرجى تسجيل الدخول مرة أخرى');
                this.redirectToLogin();
                break;
                
            case 403:
                this.showError('ليس لديك صلاحية للوصول لهذه الصفحة');
                break;
                
            case 404:
                this.showError('الصفحة أو البيانات المطلوبة غير موجودة');
                break;
                
            case 429:
                this.showError('تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً');
                break;
                
            case 500:
                this.showError('خطأ في الخادم. يرجى المحاولة لاحقاً');
                break;
                
            default:
                const message = error.response?.data?.error?.message || 'حدث خطأ غير متوقع';
                this.showError(message);
        }
        
        this.logError('API_ERROR', errorInfo);
    }
    
    showError(message) {
        // عرض رسالة خطأ للمستخدم
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${message}</span>
                <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // إزالة الرسالة تلقائياً بعد 5 ثوان
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    logError(type, details) {
        // إرسال الخطأ للخادم للتسجيل
        fetch('/api/frontend-errors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: type,
                details: details,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            })
        }).catch(() => {
            // فشل في إرسال الخطأ - تسجيل محلي
            console.error('Failed to log error to server:', type, details);
        });
    }
    
    redirectToLogin() {
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
    }
}

// تفعيل معالج الأخطاء
const errorHandler = new FrontendErrorHandler();
```

### **9.2 معالجة أخطاء النماذج**

```javascript
class FormErrorHandler {
    constructor(formElement) {
        this.form = formElement;
        this.setupFormValidation();
    }
    
    setupFormValidation() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.validateAndSubmit();
        });
    }
    
    async validateAndSubmit() {
        try {
            // مسح الأخطاء السابقة
            this.clearErrors();
            
            // التحقق من صحة البيانات
            const formData = new FormData(this.form);
            const validationErrors = this.validateForm(formData);
            
            if (validationErrors.length > 0) {
                this.displayValidationErrors(validationErrors);
                return;
            }
            
            // إرسال النموذج
            const response = await this.submitForm(formData);
            this.handleSuccess(response);
            
        } catch (error) {
            this.handleSubmissionError(error);
        }
    }
    
    validateForm(formData) {
        const errors = [];
        
        // التحقق من الحقول المطلوبة
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!formData.get(field.name)) {
                errors.push({
                    field: field.name,
                    message: `${field.getAttribute('data-label') || field.name} مطلوب`
                });
            }
        });
        
        // التحقق من البريد الإلكتروني
        const emailField = this.form.querySelector('input[type="email"]');
        if (emailField && formData.get(emailField.name)) {
            const email = formData.get(emailField.name);
            if (!this.isValidEmail(email)) {
                errors.push({
                    field: emailField.name,
                    message: 'البريد الإلكتروني غير صحيح'
                });
            }
        }
        
        // التحقق من رقم التليفون
        const phoneField = this.form.querySelector('input[name="phone"]');
        if (phoneField && formData.get(phoneField.name)) {
            const phone = formData.get(phoneField.name);
            if (!this.isValidEgyptianPhone(phone)) {
                errors.push({
                    field: phoneField.name,
                    message: 'رقم التليفون غير صحيح'
                });
            }
        }
        
        return errors;
    }
    
    displayValidationErrors(errors) {
        errors.forEach(error => {
            const field = this.form.querySelector(`[name="${error.field}"]`);
            if (field) {
                this.showFieldError(field, error.message);
            }
        });
    }
    
    showFieldError(field, message) {
        // إضافة كلاس الخطأ
        field.classList.add('error');
        
        // إنشاء رسالة الخطأ
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        // إدراج رسالة الخطأ
        field.parentElement.appendChild(errorElement);
    }
    
    clearErrors() {
        // مسح كلاسات الخطأ
        this.form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        
        // مسح رسائل الخطأ
        this.form.querySelectorAll('.field-error').forEach(error => {
            error.remove();
        });
    }
    
    async submitForm(formData) {
        const response = await fetch(this.form.action, {
            method: this.form.method || 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    }
    
    handleSuccess(response) {
        // عرض رسالة نجاح
        this.showSuccessMessage(response.message || 'تم الحفظ بنجاح');
        
        // إعادة تعيين النموذج
        this.form.reset();
        
        // إعادة توجيه إذا لزم الأمر
        if (response.redirect) {
            setTimeout(() => {
                window.location.href = response.redirect;
            }, 2000);
        }
    }
    
    handleSubmissionError(error) {
        console.error('Form submission error:', error);
        
        // عرض رسالة خطأ عامة
        this.showErrorMessage('حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى');
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidEgyptianPhone(phone) {
        const phoneRegex = /^01[0125][0-9]{8}$/;
        return phoneRegex.test(phone.replace(/[^\d]/g, ''));
    }
    
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.innerHTML = `
            <div class="success-content">
                <span class="success-icon">✅</span>
                <span class="success-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">❌</span>
                <span class="error-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// تطبيق معالج الأخطاء على جميع النماذج
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach(form => {
        new FormErrorHandler(form);
    });
});
```

---

## 📋 **10. خلاصة دليل معالجة الأخطاء**

### **أفضل الممارسات:**

1. **الشفافية مع الأمان**: رسائل واضحة دون كشف تفاصيل تقنية حساسة
2. **التسجيل الشامل**: تسجيل جميع الأخطاء مع السياق الكامل
3. **التعافي التلقائي**: محاولة إصلاح الأخطاء تلقائياً عند الإمكان
4. **تجربة المستخدم**: رسائل مفهومة وحلول بديلة
5. **المراقبة المستمرة**: تنبيهات فورية للأخطاء الحرجة

### **أدوات المراقبة:**
- **Sentry**: لتتبع الأخطاء في الإنتاج
- **Prometheus**: لمراقبة الأداء والمقاييس
- **Grafana**: لعرض لوحات المراقبة
- **ELK Stack**: لتحليل السجلات

### **اختبار معالجة الأخطاء:**
```bash
# تشغيل اختبارات معالجة الأخطاء
pytest tests/test_error_handling.py -v

# اختبار سيناريوهات الفشل
pytest tests/test_failure_scenarios.py -v

# اختبار التعافي التلقائي
pytest tests/test_recovery.py -v
```

هذا الدليل يضمن معالجة شاملة ومهنية لجميع أنواع الأخطاء في تطبيق نائبك.
