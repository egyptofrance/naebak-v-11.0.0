'use client'

import { useState, useEffect, createContext, useContext } from 'react'

// أنواع البيانات
interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  phone_number: string
  national_id?: string
  user_type: 'citizen' | 'candidate' | 'current_member' | 'mp' | 'senator' | 'mp-candidate' | 'senator-candidate'
  is_active: boolean
  is_verified: boolean
  date_joined: string
  last_login?: string
  profile_picture?: string
}

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone_number: string
  national_id?: string
  user_type: 'citizen' | 'candidate' | 'current_member' | 'mp' | 'senator' | 'mp-candidate' | 'senator-candidate'
  governorate_id?: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

// الحصول على رابط API من متغيرات البيئة
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://naebak-auth-service-jux3rvgvka-uc.a.run.app'

// دوال مساعدة للتعامل مع localStorage
const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

const setStoredToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

const removeStoredToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

// Hook للمصادقة
export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // تحقق من وجود token عند تحميل الصفحة
  useEffect(() => {
    const token = getStoredToken()
    if (token) {
      // يمكن إضافة تحقق من صحة التوكن هنا
      // fetchUserProfile()
    }
  }, [])

  // دالة تسجيل الدخول
  const login = async (data: LoginData): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('فشل في تسجيل الدخول')
      }

      const result = await response.json()
      
      if (result.access_token) {
        setStoredToken(result.access_token)
        setUser(result.user)
      }
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // دالة التسجيل
  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('فشل في إنشاء الحساب')
      }

      const result = await response.json()
      
      if (result.access_token) {
        setStoredToken(result.access_token)
        setUser(result.user)
      }
    } catch (error) {
      console.error('خطأ في التسجيل:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // دالة تسجيل الخروج
  const logout = (): void => {
    removeStoredToken()
    setUser(null)
  }

  // دالة تحديث الملف الشخصي
  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    setIsLoading(true)
    try {
      const token = getStoredToken()
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error('فشل في تحديث الملف الشخصي')
      }

      const result = await response.json()
      setUser(result.user)
    } catch (error) {
      console.error('خطأ في تحديث الملف الشخصي:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  }
}

// تصدير useAuth كـ default export
export default useAuth
