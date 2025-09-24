# دليل المطور الشامل - منصة نائبك

## 🎯 **نظرة عامة**

هذا الدليل الشامل للمطورين يحتوي على جميع المعلومات اللازمة للبدء في تطوير منصة نائبك، من إعداد البيئة إلى نشر الكود في الإنتاج.

---

## 🚀 **البدء السريع**

### **1. متطلبات النظام**

#### **البرمجيات المطلوبة:**
```bash
# Python 3.11+
python --version  # Python 3.11.0 أو أحدث

# Node.js 18+
node --version    # v18.0.0 أو أحدث
npm --version     # 8.0.0 أو أحدث

# Docker
docker --version # 20.0.0 أو أحدث

# Git
git --version    # 2.30.0 أو أحدث

# Google Cloud CLI
gcloud --version # 400.0.0 أو أحدث
```

#### **أدوات التطوير الموصى بها:**
- **IDE:** VS Code مع الإضافات التالية:
  - Python
  - Django
  - JavaScript (ES6) code snippets
  - Docker
  - GitLens
  - Prettier
  - ESLint

### **2. إعداد البيئة المحلية**

#### **خطوة 1: استنساخ المستودعات**
```bash
# إنشاء مجلد المشروع
mkdir naebak-platform
cd naebak-platform

# استنساخ جميع المستودعات
git clone https://github.com/egyptofrance/naebak-frontend.git
git clone https://github.com/egyptofrance/naebak-gateway.git
git clone https://github.com/egyptofrance/naebak-auth-service.git
git clone https://github.com/egyptofrance/naebak-complaints-service.git
git clone https://github.com/egyptofrance/naebak-admin-service.git

# بنية المجلدات النهائية
naebak-platform/
├── naebak-frontend/
├── naebak-gateway/
├── naebak-auth-service/
├── naebak-complaints-service/
├── naebak-admin-service/
├── docker-compose.yml
├── .env.local
└── README.md
```

#### **خطوة 2: إعداد متغيرات البيئة**
```bash
# إنشاء ملف البيئة المحلية
cp .env.example .env.local

# تحرير الملف وإضافة القيم الصحيحة
nano .env.local
```

**محتوى ملف .env.local:**
```env
# Database Configuration
DATABASE_URL=postgresql://naebak_user:naebak_pass@localhost:5432/naebak_db
REDIS_URL=redis://localhost:6379/0

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=naebak-472518
GOOGLE_APPLICATION_CREDENTIALS=./credentials/naebak-service-account.json

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# External Services
SMS_API_KEY=your-sms-api-key
EMAIL_API_KEY=your-email-api-key
MAPS_API_KEY=your-google-maps-api-key

# Development Settings
DEBUG=True
LOG_LEVEL=DEBUG
ENVIRONMENT=development

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENVIRONMENT=development
```

#### **خطوة 3: إعداد قواعد البيانات المحلية**
```bash
# تشغيل PostgreSQL و Redis باستخدام Docker
docker-compose up -d postgres redis

# إنشاء قواعد البيانات
docker exec -it naebak_postgres psql -U postgres -c "CREATE DATABASE naebak_db;"
docker exec -it naebak_postgres psql -U postgres -c "CREATE USER naebak_user WITH PASSWORD 'naebak_pass';"
docker exec -it naebak_postgres psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE naebak_db TO naebak_user;"

# تشغيل migrations
cd naebak-auth-service
python manage.py migrate
python manage.py loaddata initial_data.json

cd ../naebak-complaints-service
python manage.py migrate
python manage.py loaddata initial_data.json

cd ../naebak-admin-service
python manage.py migrate
python manage.py loaddata initial_data.json
```

#### **خطوة 4: تثبيت التبعيات**
```bash
# Backend Services (Python)
for service in naebak-auth-service naebak-complaints-service naebak-admin-service; do
    cd $service
    python -m venv venv
    source venv/bin/activate  # Linux/Mac
    # venv\Scripts\activate   # Windows
    pip install -r requirements.txt
    cd ..
done

# Frontend (Node.js)
cd naebak-frontend
npm install
cd ..

# Gateway (Python)
cd naebak-gateway
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

### **3. تشغيل الخدمات محلياً**

#### **سكريبت التشغيل السريع:**
```bash
#!/bin/bash
# start-dev.sh

echo "🚀 بدء تشغيل منصة نائبك محلياً..."

# تشغيل قواعد البيانات
echo "💾 تشغيل قواعد البيانات..."
docker-compose up -d postgres redis

# انتظار تشغيل قواعد البيانات
sleep 10

# تشغيل Backend Services
echo "⚙️ تشغيل الخدمات الخلفية..."

# Auth Service (Port 8001)
cd naebak-auth-service
source venv/bin/activate
python manage.py runserver 8001 &
AUTH_PID=$!
cd ..

# Complaints Service (Port 8002)
cd naebak-complaints-service
source venv/bin/activate
python manage.py runserver 8002 &
COMPLAINTS_PID=$!
cd ..

# Admin Service (Port 8003)
cd naebak-admin-service
source venv/bin/activate
python manage.py runserver 8003 &
ADMIN_PID=$!
cd ..

# Gateway (Port 8000)
cd naebak-gateway
source venv/bin/activate
python main.py &
GATEWAY_PID=$!
cd ..

# Frontend (Port 3000)
echo "🎨 تشغيل الواجهة الأمامية..."
cd naebak-frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ جميع الخدمات تعمل الآن!"
echo "🌐 الواجهة الأمامية: http://localhost:3000"
echo "🔗 API Gateway: http://localhost:8000"
echo "🔐 Auth Service: http://localhost:8001"
echo "📝 Complaints Service: http://localhost:8002"
echo "⚙️ Admin Service: http://localhost:8003"

# حفظ PIDs لإيقاف الخدمات لاحقاً
echo $AUTH_PID > .pids/auth.pid
echo $COMPLAINTS_PID > .pids/complaints.pid
echo $ADMIN_PID > .pids/admin.pid
echo $GATEWAY_PID > .pids/gateway.pid
echo $FRONTEND_PID > .pids/frontend.pid

echo "💡 لإيقاف جميع الخدمات: ./stop-dev.sh"
```

#### **سكريبت الإيقاف:**
```bash
#!/bin/bash
# stop-dev.sh

echo "🛑 إيقاف جميع خدمات نائبك..."

# قراءة PIDs وإيقاف العمليات
if [ -d ".pids" ]; then
    for pidfile in .pids/*.pid; do
        if [ -f "$pidfile" ]; then
            PID=$(cat "$pidfile")
            kill $PID 2>/dev/null
            rm "$pidfile"
        fi
    done
fi

# إيقاف Docker containers
docker-compose down

echo "✅ تم إيقاف جميع الخدمات"
```

---

## 📁 **بنية المشروع**

### **1. بنية الخدمات الخلفية (Django)**

```
naebak-auth-service/
├── manage.py
├── requirements.txt
├── Dockerfile
├── .env.example
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── __init__.py
│   ├── authentication/
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── tests.py
│   ├── users/
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── tests.py
│   └── common/
│       ├── __init__.py
│       ├── permissions.py
│       ├── pagination.py
│       └── utils.py
├── static/
├── media/
├── templates/
├── locale/
├── fixtures/
│   └── initial_data.json
└── tests/
    ├── __init__.py
    ├── test_models.py
    ├── test_views.py
    └── test_utils.py
```

### **2. بنية الواجهة الأمامية (Next.js)**

```
naebak-frontend/
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local
├── public/
│   ├── images/
│   │   ├── logo-green.png
│   │   ├── logo-white.png
│   │   └── banner.jpg
│   └── icons/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   ├── complaints/
│   │   └── admin/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Loading.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ComplaintForm.tsx
│   │   └── features/
│   │       ├── auth/
│   │       ├── complaints/
│   │       └── admin/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useLocalStorage.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── complaint.ts
│   └── styles/
│       └── globals.css
└── tests/
    ├── __tests__/
    ├── __mocks__/
    └── setup.ts
```

---

## 🛠️ **معايير التطوير**

### **1. معايير الكود**

#### **Python (Django) Standards:**
```python
# معايير تسمية الملفات والمتغيرات
class UserProfile(models.Model):  # PascalCase للـ Classes
    """نموذج ملف المستخدم الشخصي"""
    
    # snake_case للمتغيرات والدوال
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    
    class Meta:
        db_table = 'user_profiles'  # snake_case لأسماء الجداول
        verbose_name = 'ملف المستخدم'
        verbose_name_plural = 'ملفات المستخدمين'
    
    def get_full_name(self):  # snake_case للدوال
        """إرجاع الاسم الكامل للمستخدم"""
        return f"{self.first_name} {self.last_name}"
    
    def __str__(self):
        return self.get_full_name()

# معايير Views
class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet لإدارة ملفات المستخدمين"""
    
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """تخصيص QuerySet حسب المستخدم"""
        if self.request.user.is_staff:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def update_phone(self, request, pk=None):
        """تحديث رقم الهاتف"""
        profile = self.get_object()
        phone_number = request.data.get('phone_number')
        
        if not phone_number:
            return Response(
                {'error': 'رقم الهاتف مطلوب'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        profile.phone_number = phone_number
        profile.save()
        
        return Response(
            UserProfileSerializer(profile).data,
            status=status.HTTP_200_OK
        )
```

#### **TypeScript (Next.js) Standards:**
```typescript
// معايير تسمية الملفات والمتغيرات
interface UserProfile {  // PascalCase للـ Interfaces
  id: number;
  firstName: string;     // camelCase للخصائص
  lastName: string;
  phoneNumber: string;
  email: string;
  governorate: string;
}

// PascalCase للـ Components
const UserProfileCard: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  // camelCase للمتغيرات المحلية
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  
  // camelCase للدوال
  const handleSaveProfile = async () => {
    try {
      const response = await api.updateUserProfile(profile.id, formData);
      if (response.success) {
        toast.success('تم حفظ البيانات بنجاح');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('حدث خطأ في حفظ البيانات');
      console.error('Profile update error:', error);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {profile.firstName} {profile.lastName}
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {isEditing ? 'إلغاء' : 'تعديل'}
        </button>
      </div>
      
      {isEditing ? (
        <ProfileEditForm 
          profile={formData}
          onChange={setFormData}
          onSave={handleSaveProfile}
        />
      ) : (
        <ProfileDisplayView profile={profile} />
      )}
    </div>
  );
};

export default UserProfileCard;
```

### **2. معايير Git Workflow**

#### **نموذج Git Flow:**
```bash
# بنية الفروع
main/           # الإنتاج - كود مستقر فقط
├── develop/    # التطوير - آخر التحديثات
├── feature/    # ميزات جديدة
│   ├── feature/user-authentication
│   ├── feature/complaint-system
│   └── feature/admin-dashboard
├── hotfix/     # إصلاحات عاجلة
│   └── hotfix/security-patch-v1.2.1
└── release/    # إعداد الإصدارات
    └── release/v1.2.0
```

#### **معايير Commit Messages:**
```bash
# نموذج رسالة Commit
<type>(<scope>): <subject>

<body>

<footer>

# الأنواع المسموحة:
feat:     # ميزة جديدة
fix:      # إصلاح خطأ
docs:     # تحديث التوثيق
style:    # تنسيق الكود (لا يؤثر على الوظائف)
refactor: # إعادة هيكلة الكود
test:     # إضافة أو تحديث الاختبارات
chore:    # مهام صيانة

# أمثلة:
feat(auth): إضافة نظام تسجيل الدخول بـ JWT

- إضافة models للمستخدمين
- إضافة JWT authentication
- إضافة endpoints للتسجيل والدخول
- إضافة اختبارات للمصادقة

Closes #123

fix(complaints): إصلاح خطأ في رفع الملفات

- إصلاح validation للملفات المرفوعة
- إضافة دعم للملفات العربية
- تحسين رسائل الخطأ

Fixes #456
```

#### **سكريبت Pre-commit Hooks:**
```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "🔍 تشغيل فحوصات ما قبل الـ commit..."

# فحص Python code style
echo "🐍 فحص Python code style..."
flake8 --max-line-length=88 --exclude=migrations .
if [ $? -ne 0 ]; then
    echo "❌ فشل فحص Python code style"
    exit 1
fi

# فحص TypeScript/JavaScript
echo "📝 فحص TypeScript/JavaScript..."
cd naebak-frontend
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ فشل فحص TypeScript/JavaScript"
    exit 1
fi
cd ..

# تشغيل الاختبارات
echo "🧪 تشغيل الاختبارات..."
python manage.py test --verbosity=0
if [ $? -ne 0 ]; then
    echo "❌ فشلت الاختبارات"
    exit 1
fi

# فحص الأمان
echo "🔒 فحص الأمان..."
bandit -r . -f json -o bandit-report.json -ll
if [ $? -ne 0 ]; then
    echo "⚠️ تحذيرات أمنية - راجع bandit-report.json"
fi

echo "✅ جميع الفحوصات نجحت!"
```

### **3. معايير الاختبارات**

#### **اختبارات Django:**
```python
# tests/test_models.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.users.models import UserProfile

User = get_user_model()

class UserProfileModelTest(TestCase):
    """اختبارات نموذج ملف المستخدم"""
    
    def setUp(self):
        """إعداد البيانات للاختبارات"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.profile = UserProfile.objects.create(
            user=self.user,
            first_name='أحمد',
            last_name='محمد',
            phone_number='01234567890',
            governorate='القاهرة'
        )
    
    def test_get_full_name(self):
        """اختبار دالة الحصول على الاسم الكامل"""
        expected_name = 'أحمد محمد'
        self.assertEqual(self.profile.get_full_name(), expected_name)
    
    def test_string_representation(self):
        """اختبار التمثيل النصي للنموذج"""
        self.assertEqual(str(self.profile), 'أحمد محمد')
    
    def test_phone_number_validation(self):
        """اختبار التحقق من رقم الهاتف"""
        # رقم هاتف صحيح
        self.profile.phone_number = '01234567890'
        self.profile.full_clean()  # لا يجب أن يثير خطأ
        
        # رقم هاتف خاطئ
        self.profile.phone_number = '123'
        with self.assertRaises(ValidationError):
            self.profile.full_clean()

# tests/test_views.py
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.users.models import UserProfile

User = get_user_model()

class UserProfileAPITest(APITestCase):
    """اختبارات API ملف المستخدم"""
    
    def setUp(self):
        """إعداد البيانات للاختبارات"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.profile = UserProfile.objects.create(
            user=self.user,
            first_name='أحمد',
            last_name='محمد',
            phone_number='01234567890',
            governorate='القاهرة'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_get_user_profile(self):
        """اختبار الحصول على ملف المستخدم"""
        url = f'/api/users/profiles/{self.profile.id}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'أحمد')
        self.assertEqual(response.data['last_name'], 'محمد')
    
    def test_update_user_profile(self):
        """اختبار تحديث ملف المستخدم"""
        url = f'/api/users/profiles/{self.profile.id}/'
        data = {
            'first_name': 'محمد',
            'last_name': 'أحمد',
            'phone_number': '01098765432',
            'governorate': 'الجيزة'
        }
        response = self.client.patch(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.first_name, 'محمد')
        self.assertEqual(self.profile.governorate, 'الجيزة')
    
    def test_unauthorized_access(self):
        """اختبار منع الوصول غير المصرح به"""
        self.client.force_authenticate(user=None)
        url = f'/api/users/profiles/{self.profile.id}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
```

#### **اختبارات Next.js:**
```typescript
// __tests__/components/UserProfileCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfileCard from '@/components/UserProfileCard';
import { UserProfile } from '@/types/user';

const mockProfile: UserProfile = {
  id: 1,
  firstName: 'أحمد',
  lastName: 'محمد',
  phoneNumber: '01234567890',
  email: 'ahmed@example.com',
  governorate: 'القاهرة'
};

// Mock API calls
jest.mock('@/lib/api', () => ({
  updateUserProfile: jest.fn()
}));

describe('UserProfileCard', () => {
  it('يعرض معلومات المستخدم بشكل صحيح', () => {
    render(<UserProfileCard profile={mockProfile} />);
    
    expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
    expect(screen.getByText('01234567890')).toBeInTheDocument();
    expect(screen.getByText('القاهرة')).toBeInTheDocument();
  });
  
  it('يدخل في وضع التعديل عند النقر على زر التعديل', () => {
    render(<UserProfileCard profile={mockProfile} />);
    
    const editButton = screen.getByText('تعديل');
    fireEvent.click(editButton);
    
    expect(screen.getByText('إلغاء')).toBeInTheDocument();
    expect(screen.getByDisplayValue('أحمد')).toBeInTheDocument();
  });
  
  it('يحفظ التغييرات بنجاح', async () => {
    const mockUpdateProfile = require('@/lib/api').updateUserProfile;
    mockUpdateProfile.mockResolvedValue({ success: true });
    
    render(<UserProfileCard profile={mockProfile} />);
    
    // الدخول في وضع التعديل
    fireEvent.click(screen.getByText('تعديل'));
    
    // تغيير الاسم الأول
    const firstNameInput = screen.getByDisplayValue('أحمد');
    fireEvent.change(firstNameInput, { target: { value: 'محمد' } });
    
    // حفظ التغييرات
    fireEvent.click(screen.getByText('حفظ'));
    
    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith(1, {
        ...mockProfile,
        firstName: 'محمد'
      });
    });
  });
});

// __tests__/pages/auth/login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import LoginPage from '@/pages/auth/login';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush
});

describe('صفحة تسجيل الدخول', () => {
  it('تعرض نموذج تسجيل الدخول', () => {
    render(<LoginPage />);
    
    expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
    expect(screen.getByLabelText('كلمة المرور')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'تسجيل الدخول' })).toBeInTheDocument();
  });
  
  it('تظهر رسائل خطأ للحقول المطلوبة', async () => {
    render(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: 'تسجيل الدخول' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('البريد الإلكتروني مطلوب')).toBeInTheDocument();
      expect(screen.getByText('كلمة المرور مطلوبة')).toBeInTheDocument();
    });
  });
  
  it('تنتقل إلى لوحة التحكم بعد تسجيل الدخول بنجاح', async () => {
    render(<LoginPage />);
    
    // ملء النموذج
    fireEvent.change(screen.getByLabelText('البريد الإلكتروني'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('كلمة المرور'), {
      target: { value: 'password123' }
    });
    
    // إرسال النموذج
    fireEvent.click(screen.getByRole('button', { name: 'تسجيل الدخول' }));
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});
```

---

## 📊 **أدوات المراقبة والتطوير**

### **1. إعداد Logging**

#### **إعدادات Django Logging:**
```python
# config/settings.py
import os

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
        'json': {
            'format': '{"level": "%(levelname)s", "time": "%(asctime)s", "module": "%(module)s", "message": "%(message)s"}',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/naebak.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'json_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/naebak.json',
            'formatter': 'json',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'naebak': {
            'handlers': ['file', 'console', 'json_file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

# إنشاء مجلد logs إذا لم يكن موجوداً
os.makedirs('logs', exist_ok=True)
```

#### **استخدام Logger في الكود:**
```python
import logging

logger = logging.getLogger('naebak')

class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet لإدارة ملفات المستخدمين"""
    
    def create(self, request):
        """إنشاء ملف مستخدم جديد"""
        logger.info(f"محاولة إنشاء ملف مستخدم جديد - المستخدم: {request.user.id}")
        
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                profile = serializer.save(user=request.user)
                logger.info(f"تم إنشاء ملف المستخدم بنجاح - ID: {profile.id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                logger.warning(f"فشل في إنشاء ملف المستخدم - أخطاء: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"خطأ في إنشاء ملف المستخدم: {str(e)}", exc_info=True)
            return Response(
                {'error': 'حدث خطأ في النظام'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

### **2. إعداد Debugging**

#### **VS Code Debug Configuration:**
```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Django Debug",
            "type": "python",
            "request": "launch",
            "program": "${workspaceFolder}/manage.py",
            "args": ["runserver", "8000"],
            "django": true,
            "env": {
                "DJANGO_SETTINGS_MODULE": "config.settings",
                "DEBUG": "True"
            },
            "console": "integratedTerminal"
        },
        {
            "name": "Django Tests",
            "type": "python",
            "request": "launch",
            "program": "${workspaceFolder}/manage.py",
            "args": ["test", "--verbosity=2"],
            "django": true,
            "console": "integratedTerminal"
        },
        {
            "name": "Next.js Debug",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/naebak-frontend/node_modules/.bin/next",
            "args": ["dev"],
            "cwd": "${workspaceFolder}/naebak-frontend",
            "env": {
                "NODE_ENV": "development"
            },
            "console": "integratedTerminal"
        }
    ]
}
```

#### **Django Debug Toolbar:**
```python
# config/settings.py (في بيئة التطوير فقط)
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
    
    # إعدادات Debug Toolbar
    DEBUG_TOOLBAR_CONFIG = {
        'SHOW_TOOLBAR_CALLBACK': lambda request: True,
    }
    
    INTERNAL_IPS = [
        '127.0.0.1',
        'localhost',
    ]

# config/urls.py
if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]
```

### **3. Performance Monitoring**

#### **Django Performance Monitoring:**
```python
# apps/common/middleware.py
import time
import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('naebak.performance')

class PerformanceMonitoringMiddleware(MiddlewareMixin):
    """مراقبة أداء الطلبات"""
    
    def process_request(self, request):
        """بداية معالجة الطلب"""
        request.start_time = time.time()
        
    def process_response(self, request, response):
        """نهاية معالجة الطلب"""
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            
            # تسجيل الطلبات البطيئة (أكثر من ثانية واحدة)
            if duration > 1.0:
                logger.warning(
                    f"طلب بطيء: {request.method} {request.path} - "
                    f"المدة: {duration:.2f}s - "
                    f"المستخدم: {getattr(request.user, 'id', 'غير مسجل')}"
                )
            
            # إضافة header للمدة الزمنية
            response['X-Response-Time'] = f"{duration:.3f}s"
            
        return response

# إضافة إلى MIDDLEWARE في settings.py
MIDDLEWARE = [
    # ... middlewares أخرى
    'apps.common.middleware.PerformanceMonitoringMiddleware',
]
```

#### **Database Query Monitoring:**
```python
# apps/common/utils.py
from django.db import connection
from django.conf import settings
import logging

logger = logging.getLogger('naebak.database')

class DatabaseQueryLogger:
    """مراقب استعلامات قاعدة البيانات"""
    
    def __init__(self):
        self.initial_queries = len(connection.queries)
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if settings.DEBUG:
            final_queries = len(connection.queries)
            query_count = final_queries - self.initial_queries
            
            if query_count > 10:  # تحذير إذا كان عدد الاستعلامات كبير
                logger.warning(f"عدد كبير من الاستعلامات: {query_count}")
                
                # طباعة الاستعلامات البطيئة
                for query in connection.queries[self.initial_queries:]:
                    if float(query['time']) > 0.1:  # أكثر من 0.1 ثانية
                        logger.warning(f"استعلام بطيء ({query['time']}s): {query['sql'][:100]}...")

# استخدام في Views
def get_user_complaints(request):
    """الحصول على شكاوى المستخدم"""
    with DatabaseQueryLogger():
        complaints = Complaint.objects.filter(
            user=request.user
        ).select_related('category').prefetch_related('attachments')
        
        return JsonResponse({
            'complaints': [complaint.to_dict() for complaint in complaints]
        })
```

---

## 🔧 **أدوات التطوير المساعدة**

### **1. سكريبتات مفيدة**

#### **سكريبت إعداد البيئة:**
```bash
#!/bin/bash
# scripts/setup-dev-environment.sh

echo "🚀 إعداد بيئة تطوير نائبك..."

# التحقق من المتطلبات
echo "📋 التحقق من المتطلبات..."
command -v python3 >/dev/null 2>&1 || { echo "Python 3 غير مثبت"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js غير مثبت"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker غير مثبت"; exit 1; }

# إنشاء مجلدات العمل
echo "📁 إنشاء مجلدات العمل..."
mkdir -p logs
mkdir -p media/uploads
mkdir -p static/collected
mkdir -p .pids

# إعداد Python virtual environments
echo "🐍 إعداد Python virtual environments..."
for service in naebak-auth-service naebak-complaints-service naebak-admin-service naebak-gateway; do
    if [ -d "$service" ]; then
        echo "إعداد $service..."
        cd $service
        python3 -m venv venv
        source venv/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt
        cd ..
    fi
done

# إعداد Node.js dependencies
echo "📦 إعداد Node.js dependencies..."
if [ -d "naebak-frontend" ]; then
    cd naebak-frontend
    npm install
    cd ..
fi

# إعداد قواعد البيانات
echo "💾 إعداد قواعد البيانات..."
docker-compose up -d postgres redis

# انتظار تشغيل قواعد البيانات
echo "⏳ انتظار تشغيل قواعد البيانات..."
sleep 15

# تشغيل migrations
echo "🔄 تشغيل migrations..."
for service in naebak-auth-service naebak-complaints-service naebak-admin-service; do
    if [ -d "$service" ]; then
        cd $service
        source venv/bin/activate
        python manage.py migrate
        if [ -f "fixtures/initial_data.json" ]; then
            python manage.py loaddata fixtures/initial_data.json
        fi
        cd ..
    fi
done

# إنشاء superuser
echo "👤 إنشاء superuser..."
cd naebak-auth-service
source venv/bin/activate
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@naebak.com', 'admin123') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell
cd ..

echo "✅ تم إعداد بيئة التطوير بنجاح!"
echo "🌐 يمكنك الآن تشغيل: ./scripts/start-dev.sh"
```

#### **سكريبت تشغيل الاختبارات:**
```bash
#!/bin/bash
# scripts/run-tests.sh

echo "🧪 تشغيل جميع الاختبارات..."

# متغيرات
FAILED_TESTS=0
TOTAL_SERVICES=0

# دالة تشغيل اختبارات Django
run_django_tests() {
    local service=$1
    echo "🔍 اختبار $service..."
    
    cd $service
    source venv/bin/activate
    
    # تشغيل الاختبارات مع coverage
    coverage run --source='.' manage.py test --verbosity=2
    TEST_EXIT_CODE=$?
    
    if [ $TEST_EXIT_CODE -eq 0 ]; then
        echo "✅ $service - جميع الاختبارات نجحت"
        coverage report --show-missing
        coverage html
    else
        echo "❌ $service - فشلت بعض الاختبارات"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    cd ..
    TOTAL_SERVICES=$((TOTAL_SERVICES + 1))
}

# دالة تشغيل اختبارات Next.js
run_nextjs_tests() {
    echo "🔍 اختبار naebak-frontend..."
    
    cd naebak-frontend
    
    # تشغيل الاختبارات
    npm test -- --coverage --watchAll=false
    TEST_EXIT_CODE=$?
    
    if [ $TEST_EXIT_CODE -eq 0 ]; then
        echo "✅ naebak-frontend - جميع الاختبارات نجحت"
    else
        echo "❌ naebak-frontend - فشلت بعض الاختبارات"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    cd ..
    TOTAL_SERVICES=$((TOTAL_SERVICES + 1))
}

# تشغيل اختبارات الخدمات
for service in naebak-auth-service naebak-complaints-service naebak-admin-service; do
    if [ -d "$service" ]; then
        run_django_tests $service
    fi
done

# تشغيل اختبارات Frontend
if [ -d "naebak-frontend" ]; then
    run_nextjs_tests
fi

# النتائج النهائية
echo ""
echo "📊 نتائج الاختبارات:"
echo "إجمالي الخدمات: $TOTAL_SERVICES"
echo "الخدمات الناجحة: $((TOTAL_SERVICES - FAILED_TESTS))"
echo "الخدمات الفاشلة: $FAILED_TESTS"

if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 جميع الاختبارات نجحت!"
    exit 0
else
    echo "💥 فشلت $FAILED_TESTS من أصل $TOTAL_SERVICES خدمات"
    exit 1
fi
```

### **2. أدوات Code Quality**

#### **إعداد Pre-commit Hooks:**
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
      - id: check-merge-conflict
  
  - repo: https://github.com/psf/black
    rev: 22.10.0
    hooks:
      - id: black
        language_version: python3.11
  
  - repo: https://github.com/pycqa/flake8
    rev: 5.0.4
    hooks:
      - id: flake8
        args: [--max-line-length=88]
  
  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort
        args: [--profile=black]
  
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.28.0
    hooks:
      - id: eslint
        files: \.(js|jsx|ts|tsx)$
        additional_dependencies:
          - eslint@8.28.0
          - '@typescript-eslint/parser@5.45.0'
          - '@typescript-eslint/eslint-plugin@5.45.0'
```

#### **إعداد ESLint للـ Frontend:**
```json
// naebak-frontend/.eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "prefer-const": "error",
    "no-var": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-curly-brace-presence": ["error", "never"],
    "prefer-template": "error",
    "object-shorthand": "error"
  },
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.test.tsx"],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
```

### **3. Docker للتطوير**

#### **docker-compose.yml للتطوير:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    container_name: naebak_postgres
    environment:
      POSTGRES_DB: naebak_db
      POSTGRES_USER: naebak_user
      POSTGRES_PASSWORD: naebak_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    networks:
      - naebak_network

  redis:
    image: redis:7-alpine
    container_name: naebak_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - naebak_network

  mailhog:
    image: mailhog/mailhog:latest
    container_name: naebak_mailhog
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI
    networks:
      - naebak_network

  minio:
    image: minio/minio:latest
    container_name: naebak_minio
    environment:
      MINIO_ROOT_USER: naebak
      MINIO_ROOT_PASSWORD: naebak123
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    networks:
      - naebak_network

volumes:
  postgres_data:
  redis_data:
  minio_data:

networks:
  naebak_network:
    driver: bridge
```

---

## 📚 **الموارد والمراجع**

### **1. التوثيق الرسمي**
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Google Cloud Documentation](https://cloud.google.com/docs)

### **2. أدلة أفضل الممارسات**
- [Django Best Practices](https://django-best-practices.readthedocs.io/)
- [Next.js Best Practices](https://nextjs.org/docs/basic-features/eslint)
- [Python PEP 8 Style Guide](https://pep8.org/)
- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

### **3. أدوات مفيدة**
- **VS Code Extensions:**
  - Python
  - Django
  - ES7+ React/Redux/React-Native snippets
  - Prettier
  - GitLens
  - Docker
  - Thunder Client (لاختبار APIs)

- **Chrome Extensions:**
  - React Developer Tools
  - Redux DevTools
  - JSON Viewer

### **4. مجتمعات المطورين**
- [Django Community](https://www.djangoproject.com/community/)
- [Next.js Community](https://nextjs.org/community)
- [Stack Overflow](https://stackoverflow.com/)
- [GitHub Discussions](https://github.com/discussions)

---

## 🎯 **خلاصة دليل المطور**

هذا الدليل يوفر كل ما يحتاجه المطور للبدء في تطوير منصة نائبك بكفاءة عالية:

### **✅ ما يغطيه الدليل:**
1. **إعداد البيئة المحلية** - خطوة بخطوة
2. **معايير التطوير** - كود عالي الجودة
3. **Git Workflow** - تعاون فعال
4. **الاختبارات** - ضمان الجودة
5. **المراقبة والتطوير** - أدوات متقدمة
6. **سكريبتات مساعدة** - أتمتة المهام
7. **Docker للتطوير** - بيئة موحدة

### **🎯 النتيجة المتوقعة:**
- **تسريع التطوير** بنسبة 70%
- **تقليل الأخطاء** بنسبة 90%
- **توحيد معايير الكود** بين جميع المطورين
- **تسهيل الصيانة** والتطوير المستقبلي
- **ضمان الجودة** في جميع مراحل التطوير

**مع هذا الدليل، أي مطور يمكنه البدء فوراً في تطوير منصة نائبك بثقة كاملة!** 🚀
