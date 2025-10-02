'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MemberProfile {
  full_name: string;
  position: 'Parliament Member' | 'Senate Member';
  governorate: string;
  electoral_district: string;
  parliamentary_committee: string;
  profile_completed: boolean;
}

export default function MemberDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMemberData();
  }, []);

  const loadMemberData = () => {
    try {
      const userData = localStorage.getItem('user');
      const memberProfile = localStorage.getItem('member_profile');
      
      if (userData) {
        const user = JSON.parse(userData);
        const memberData = memberProfile ? JSON.parse(memberProfile) : {};
        
        const loadedProfile: MemberProfile = {
          full_name: user.full_name || "عضو تجريبي",
          position: memberData.position || 'Parliament Member',
          governorate: memberData.governorate || "",
          electoral_district: memberData.electoral_district || "",
          parliamentary_committee: memberData.parliamentary_committee || "",
          profile_completed: memberData.profile_completed || false
        };

        setProfile(loadedProfile);
      }
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3 text-muted">جاري تحميل البيانات...</p>
          </div>
        </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-5">
          <div className="text-center">
            <h3 className="text-danger">خطأ في تحميل البيانات</h3>
            <p className="text-muted">يرجى تسجيل الدخول مرة أخرى</p>
            <button 
              onClick={() => router.push('/')}
              className="btn btn-primary"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
    );
  }

  return (
    {/* قسم الترحيب */}
      <section className="py-4" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center">
                <img 
                  src="/images/logo-naebak-green.png" 
                  alt="نائبك" 
                  className="me-3"
                  style={{height: '60px', objectFit: 'contain'}}
                />
                <div>
                  <h2 className="fw-bold mb-1" style={{color: '#004705'}}>
                    مرحباً، {profile.full_name}
                  </h2>
                  <p className="text-muted mb-0">
                    {profile.position === 'Parliament Member' ? 'عضو مجلس النواب' : 'عضو مجلس الشيوخ'}
                    {profile.governorate && ` - ${profile.governorate}`}
                    {profile.electoral_district && ` - ${profile.electoral_district}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-end">
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('member_profile');
                  router.push('/');
                }}
                className="btn btn-outline-danger"
              >
                <i className="fas fa-sign-out-alt me-2"></i>
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* تنبيه إكمال الملف الشخصي */}
      {!profile.profile_completed && (
        <section className="py-3" style={{backgroundColor: '#fff3cd'}}>
          <div className="container">
            <div className="alert alert-warning border-0 mb-0" role="alert">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h6 className="alert-heading mb-1">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    يرجى إكمال ملفك الشخصي
                  </h6>
                  <p className="mb-0">لتتمكن من الاستفادة من جميع خدمات المنصة، يرجى إكمال بياناتك الشخصية والبرلمانية.</p>
                </div>
                <div className="col-lg-4 text-end">
                  <button 
                    onClick={() => router.push('/member/profile')}
                    className="btn btn-warning"
                  >
                    <i className="fas fa-user-edit me-2"></i>
                    إكمال الملف الشخصي
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* الإحصائيات */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* إحصائيات عامة */}
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-envelope fa-3x text-primary"></i>
                  </div>
                  <h3 className="fw-bold text-primary mb-2">24</h3>
                  <p className="text-muted mb-0">رسائل جديدة</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-exclamation-circle fa-3x text-warning"></i>
                  </div>
                  <h3 className="fw-bold text-warning mb-2">12</h3>
                  <p className="text-muted mb-0">قضايا مفتوحة</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-calendar fa-3x text-success"></i>
                  </div>
                  <h3 className="fw-bold text-success mb-2">3</h3>
                  <p className="text-muted mb-0">فعاليات قادمة</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-users fa-3x text-info"></i>
                  </div>
                  <h3 className="fw-bold text-info mb-2">1,247</h3>
                  <p className="text-muted mb-0">متابعين</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* الإجراءات السريعة */}
      <section className="py-5" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <h3 className="fw-bold mb-4 text-center" style={{color: '#004705'}}>الإجراءات السريعة</h3>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-user-edit fa-3x text-success"></i>
                  </div>
                  <h5 className="fw-bold mb-3">إدارة الملف الشخصي</h5>
                  <p className="text-muted mb-4">تحديث البيانات الشخصية والمعلومات البرلمانية</p>
                  <button 
                    onClick={() => router.push('/member/profile')}
                    className="btn btn-success"
                    style={{borderRadius: '25px'}}
                  >
                    <i className="fas fa-edit me-2"></i>
                    تحديث البيانات
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-trophy fa-3x text-warning"></i>
                  </div>
                  <h5 className="fw-bold mb-3">الإنجازات</h5>
                  <p className="text-muted mb-4">إدارة وعرض إنجازاتك البرلمانية</p>
                  <button 
                    onClick={() => router.push('/member/achievements')}
                    className="btn btn-warning"
                    style={{borderRadius: '25px'}}
                  >
                    <i className="fas fa-plus me-2"></i>
                    إضافة إنجاز
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-calendar-alt fa-3x text-info"></i>
                  </div>
                  <h5 className="fw-bold mb-3">الفعاليات والمؤتمرات</h5>
                  <p className="text-muted mb-4">إدارة الفعاليات والمؤتمرات التي تحضرها</p>
                  <button 
                    onClick={() => router.push('/member/events')}
                    className="btn btn-info"
                    style={{borderRadius: '25px'}}
                  >
                    <i className="fas fa-calendar-plus me-2"></i>
                    إضافة فعالية
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-file-alt fa-3x text-primary"></i>
                  </div>
                  <h5 className="fw-bold mb-3">البرنامج الانتخابي</h5>
                  <p className="text-muted mb-4">إدارة وتحديث برنامجك الانتخابي</p>
                  <button 
                    onClick={() => router.push('/member/program')}
                    className="btn btn-primary"
                    style={{borderRadius: '25px'}}
                  >
                    <i className="fas fa-edit me-2"></i>
                    تحديث البرنامج
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-envelope fa-3x text-danger"></i>
                  </div>
                  <h5 className="fw-bold mb-3">الرسائل</h5>
                  <p className="text-muted mb-4">قراءة والرد على رسائل المواطنين</p>
                  <button 
                    onClick={() => router.push('/member/messages')}
                    className="btn btn-danger"
                    style={{borderRadius: '25px'}}
                  >
                    <i className="fas fa-inbox me-2"></i>
                    عرض الرسائل
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-chart-bar fa-3x text-secondary"></i>
                  </div>
                  <h5 className="fw-bold mb-3">التقارير والإحصائيات</h5>
                  <p className="text-muted mb-4">عرض تقارير مفصلة عن نشاطك</p>
                  <button 
                    onClick={() => router.push('/member/reports')}
                    className="btn btn-secondary"
                    style={{borderRadius: '25px'}}
                  >
                    <i className="fas fa-chart-line me-2"></i>
                    عرض التقارير
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* معلومات اللجنة البرلمانية */}
      {profile.parliamentary_committee && (
        <section className="py-5">
          <div className="container">
            <div className="card border-0 shadow-sm" style={{borderRadius: '15px'}}>
              <div className="card-header bg-success text-white" style={{borderRadius: '15px 15px 0 0'}}>
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-users me-2"></i>
                  معلومات اللجنة البرلمانية
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <h6 className="fw-bold text-success mb-2">اللجنة الحالية:</h6>
                    <p className="mb-0 fs-5">{profile.parliamentary_committee}</p>
                  </div>
                  <div className="col-lg-4 text-end">
                    <button 
                      onClick={() => router.push('/member/committee')}
                      className="btn btn-outline-success"
                    >
                      <i className="fas fa-info-circle me-2"></i>
                      تفاصيل اللجنة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
  );
}
