'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CitizenProtectedRouteProps {
  children: React.ReactNode;
}

export default function CitizenProtectedRoute({ children }: CitizenProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        // فحص وجود التوكن والمستخدم
        const accessToken = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');

        if (!accessToken || !userData) {
          // إعادة توجيه للصفحة الرئيسية إذا لم يكن مسجل دخول
          router.push('/');
          return;
        }

        const user = JSON.parse(userData);
        
        // التحقق من نوع المستخدم
        if (user.user_type !== 'citizen') {
          // إعادة توجيه للصفحة المناسبة حسب نوع المستخدم
          switch (user.user_type) {
            case 'current_mp':
            case 'current_senate':
            case 'candidate_mp':
            case 'candidate_senate':
              router.push('/member');
              break;
            default:
              router.push('/');
          }
          return;
        }

        // التأكد من وجود بيانات المواطن
        const citizenData = localStorage.getItem('citizen_data');
        if (!citizenData) {
          // إنشاء البيانات الأولية للمواطن
          initializeCitizenData(user);
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('خطأ في فحص التفويض:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [router]);

  const initializeCitizenData = (user: any) => {
    const citizenData = {
      user_id: user.id,
      dashboard_initialized: true,
      profile_completed: false,
      messages_enabled: true,
      issues_enabled: true,
      created_at: new Date().toISOString()
    };

    localStorage.setItem('citizen_data', JSON.stringify(citizenData));
    console.log('تم إنشاء بيانات المواطن:', citizenData);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
          <p className="mt-3 text-muted">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // سيتم إعادة التوجيه
  }

  return <>{children}</>;
}
