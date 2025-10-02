// وظائف المصادقة - بدون تغيير التصميم
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://naebak-auth-service-822351033701.us-central1.run.app'

// دالة تسجيل الدخول مع إعادة التوجيه التلقائي
export const handleLogin = async (email, password, router) => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error('فشل في تسجيل الدخول')
    }

    const result = await response.json()
    
    if (result.access_token) {
      // حفظ بيانات المصادقة
      localStorage.setItem('auth_token', result.access_token)
      localStorage.setItem('user_type', result.user.user_type)
      localStorage.setItem('user_id', result.user.id)
      localStorage.setItem('user_data', JSON.stringify(result.user))
      
      // إذا كان المستخدم مواطن، تأكد من وجود صفحاته
      if (result.user.user_type === 'citizen') {
        await ensureCitizenPagesExist(result.user)
      }
      
      // إعادة التوجيه التلقائي حسب نوع المستخدم
      if (router) {
        redirectUserToDashboard(result.user.user_type, router)
      }
      
      return { success: true, user: result.user }
    }
    
    return { success: false, error: 'لم يتم العثور على رمز الوصول' }
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error)
    return { success: false, error: error.message }
  }
}

// دالة التأكد من وجود صفحات المواطن
const ensureCitizenPagesExist = async (user) => {
  try {
    const existingData = localStorage.getItem('citizen_data')
    
    if (!existingData) {
      // إنشاء البيانات إذا لم تكن موجودة
      await initializeCitizenPages(user)
    } else {
      console.log('صفحات المواطن موجودة بالفعل')
    }
    
    return { success: true }
  } catch (error) {
    console.error('خطأ في التحقق من صفحات المواطن:', error)
    return { success: false, error: error.message }
  }
}

// دالة التسجيل مع إعادة التوجيه التلقائي
export const handleRegister = async (userData, router) => {
  try {
    // إعداد البيانات للإرسال
    const registerData = {
      email: userData.email,
      password: userData.password,
      full_name: userData.full_name || userData.fullName, // دعم كلا الاسمين
      user_type: userData.user_type || userData.userType,
      phone_number: userData.phone_number || userData.phoneNumber,
      governorate_id: parseInt(userData.governorate_id || userData.governorateId)
    }
    
    console.log('بيانات التسجيل:', registerData) // للتشخيص
    
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    })

    const result = await response.json()
    console.log('استجابة الخدمة:', result) // للتشخيص
    
    if (response.ok && result.access_token) {
      // حفظ بيانات المصادقة
      localStorage.setItem('auth_token', result.access_token)
      localStorage.setItem('user_type', result.user.user_type)
      localStorage.setItem('user_id', result.user.id)
      localStorage.setItem('user_data', JSON.stringify(result.user))
      
      // إذا كان المستخدم مواطن، قم بإنشاء صفحاته تلقائياً
      if (result.user.user_type === 'citizen') {
        await initializeCitizenPages(result.user)
      }
      
      // إعادة التوجيه التلقائي حسب نوع المستخدم
      if (router) {
        redirectUserToDashboard(result.user.user_type, router)
      }
      
      return { success: true, user: result.user }
    }
    
    return { success: false, error: result.error || 'فشل في إنشاء الحساب' }
  } catch (error) {
    console.error('خطأ في التسجيل:', error)
    return { success: false, error: 'حدث خطأ في الاتصال بالخدمة' }
  }
}

// دالة إنشاء صفحات المواطن تلقائياً
const initializeCitizenPages = async (user) => {
  try {
    // إنشاء البيانات الأولية للمواطن
    const citizenData = {
      user_id: user.id,
      dashboard_initialized: true,
      profile_completed: false,
      messages_enabled: true,
      issues_enabled: true,
      created_at: new Date().toISOString()
    }
    
    // حفظ البيانات الأولية محلياً
    localStorage.setItem('citizen_data', JSON.stringify(citizenData))
    
    // في التطبيق الحقيقي، سيتم إرسال طلب لإنشاء البيانات في قاعدة البيانات
    console.log('تم إنشاء صفحات المواطن تلقائياً:', citizenData)
    
    return { success: true }
  } catch (error) {
    console.error('خطأ في إنشاء صفحات المواطن:', error)
    return { success: false, error: error.message }
  }
}

// دالة إعادة التوجيه حسب نوع المستخدم
const redirectUserToDashboard = (userType, router) => {
  try {
    switch (userType) {
      case 'citizen':
        router.push('/citizen/dashboard')
        break
      case 'parliament_member':
      case 'senate_member':
        router.push('/member')
        break
      case 'parliament_candidate':
      case 'senate_candidate':
        router.push('/candidate')
        break
      default:
        router.push('/')
    }
  } catch (error) {
    console.error('خطأ في إعادة التوجيه:', error)
  }
}

// دالة تسجيل الخروج
export const handleLogout = (router) => {
  // إزالة جميع بيانات المصادقة
  localStorage.removeItem('access_token')
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
  localStorage.removeItem('user_data')
  localStorage.removeItem('user_type')
  localStorage.removeItem('user_id')
  localStorage.removeItem('citizen_data')
  
  // إعادة التوجيه للصفحة الرئيسية
  if (router) {
    router.push('/')
  }
  
  return { success: true }
}

// دالة فحص حالة تسجيل الدخول
export const isLoggedIn = () => {
  try {
    const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user') || localStorage.getItem('user_data')
    return !!(token && userData)
  } catch (error) {
    return false
  }
}

// دالة الحصول على بيانات المستخدم الحالي
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('user') || localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    return null
  }
}
