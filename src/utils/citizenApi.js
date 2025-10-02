// خدمات API الخاصة بالمواطن - مرتبطة بـ naebak-auth-service
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://naebak-auth-service-822351033701.us-central1.run.app'

// دالة مساعدة للحصول على رمز المصادقة
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

// دالة مساعدة لإنشاء headers المصادقة
const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// الحصول على ملف المواطن الشخصي
export const getCitizenProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/api/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('فشل في الحصول على الملف الشخصي')
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('خطأ في الحصول على الملف الشخصي:', error)
    return { success: false, error: error.message }
  }
}

// تحديث ملف المواطن الشخصي
export const updateCitizenProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/api/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      throw new Error('فشل في تحديث الملف الشخصي')
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('خطأ في تحديث الملف الشخصي:', error)
    return { success: false, error: error.message }
  }
}

// الحصول على قائمة المحافظات
export const getGovernorates = async () => {
  try {
    const response = await fetch(`${API_URL}/api/governorates`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error('فشل في الحصول على المحافظات')
    }

    const result = await response.json()
    return { success: true, data: result.governorates }
  } catch (error) {
    console.error('خطأ في الحصول على المحافظات:', error)
    return { success: false, error: error.message }
  }
}

// الحصول على ملف مواطن عام (بدون مصادقة)
export const getPublicCitizenProfile = async (citizenId) => {
  try {
    const response = await fetch(`${API_URL}/api/public/citizen/${citizenId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error('فشل في الحصول على الملف العام')
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('خطأ في الحصول على الملف العام:', error)
    return { success: false, error: error.message }
  }
}

// إرسال رسالة (سيتم تطويرها لاحقاً مع خدمة الرسائل)
export const sendMessage = async (messageData) => {
  try {
    // TODO: ربط مع خدمة الرسائل عند توفرها
    const response = await fetch(`${API_URL}/api/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(messageData),
    })

    if (!response.ok) {
      throw new Error('فشل في إرسال الرسالة')
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('خطأ في إرسال الرسالة:', error)
    return { success: false, error: error.message }
  }
}

// الحصول على رسائل المواطن
export const getCitizenMessages = async () => {
  try {
    // TODO: ربط مع خدمة الرسائل عند توفرها
    const response = await fetch(`${API_URL}/api/messages`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('فشل في الحصول على الرسائل')
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('خطأ في الحصول على الرسائل:', error)
    return { success: false, error: error.message }
  }
}

// إرسال مشكلة (سيتم تطويرها لاحقاً مع خدمة الشكاوى)
export const submitIssue = async (issueData) => {
  try {
    // TODO: ربط مع خدمة الشكاوى عند توفرها
    const response = await fetch(`${API_URL}/api/issues`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(issueData),
    })

    if (!response.ok) {
      throw new Error('فشل في إرسال المشكلة')
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('خطأ في إرسال المشكلة:', error)
    return { success: false, error: error.message }
  }
}

// الحصول على مشاكل المواطن
export const getCitizenIssues = async () => {
  try {
    // TODO: ربط مع خدمة الشكاوى عند توفرها
    const response = await fetch(`${API_URL}/api/issues`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('فشل في الحصول على المشاكل')
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('خطأ في الحصول على المشاكل:', error)
    return { success: false, error: error.message }
  }
}

// التحقق من حالة المصادقة
export const isAuthenticated = () => {
  return !!getAuthToken()
}

// الحصول على معلومات المستخدم الحالي من الرمز المميز
export const getCurrentUser = () => {
  const token = getAuthToken()
  if (!token) return null
  
  try {
    // فك تشفير JWT token للحصول على معلومات المستخدم
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch (error) {
    console.error('خطأ في فك تشفير الرمز المميز:', error)
    return null
  }
}
