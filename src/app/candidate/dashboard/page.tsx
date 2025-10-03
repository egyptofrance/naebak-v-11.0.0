'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CandidateProfile {
    fullName: string;
  position: 'Parliament Candidate' | 'Senate Candidate';
  governorate: string;
  electoral_district: string;
  electoral_symbol: string;
  electoral_number: string;
  profile_completed: boolean;
}

export default function CandidateDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCandidateData();
  }, []);

  const loadCandidateData = () => {
    try {
      const userData = localStorage.getItem('user');
      const candidateProfile = localStorage.getItem('candidate_profile');
      
      if (userData) {
        const user = JSON.parse(userData);
        const candidateData = candidateProfile ? JSON.parse(candidateProfile) : {};
        
        const loadedProfile: CandidateProfile = {
                    fullName: user.fullName || "مرشح تجريبي",
          position: candidateData.position || 'Parliament Candidate',
          governorate: candidateData.governorate || "",
          electoral_district: candidateData.electoral_district || "",
          electoral_symbol: candidateData.electoral_symbol || "",
          electoral_number: candidateData.electoral_number || "",
          profile_completed: candidateData.profile_completed || false
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
                    مرحباً، {profile.fullName}
                  </h2>
                  <p className="text-muted mb-0">
                    {profile.position === 'Parliament Candidate' ? 'مرشح مجلس النواب' : 'مرشح مجلس الشيوخ'}
                    {profile.governorate && ` - ${profile.governorate}`}
                    {profile.electoral_district && ` - ${profile.electoral_district}`}
                  </p>
                  {profile.electoral_symbol && profile.electoral_number && (
                    <p className="text-success mb-0 fw-bold">
                      <i className="fas fa-star me-1"></i>
                      الرمز: {profile.electoral_symbol} | الرقم: {profile.electoral_number}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-end">
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('candidate_profile');
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
                  <p className="mb-0">لتتمكن من الاستفادة من جميع خدمات المنصة، يرجى إكمال بياناتك الشخصية والانتخابية.</p>
                </div>
                <div className="col-lg-4 text-end">
                  <button 
                    onClick={() => router.push('/candidate/profile')}
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
                  <h3 className="fw-bold text-primary mb-2">18</h3>
                  <p className="text-muted mb-0">رسائل جديدة</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-users fa-3x text-success"></i>
                  </div>
                  <h3 className="fw-bold text-success mb-2">892</h3>
                  <p className="text-muted mb-0">متابعين</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-calendar fa-3x text-warning"></i>
                  </div>
                  <h3 className="fw-bold text-warning mb-2">5</h3>
                  <p className="text-muted mb-0">فعاليات قادمة</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-chart-line fa-3x text-info"></i>
                  </div>
                  <h3 className="fw-bold text-info mb-2">67%</h3>
                  <p className="text-muted mb-0">نسبة التفاعل</p>
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
                  <p className="text-muted mb-4">تحديث البيانات الشخصية والمعلومات الانتخابية</p>
                  <button 
                    onClick={() => router.push('/candidate/profile')}
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
                    <i className="fas fa-file-alt fa-3x text-primary"></i>
                  </div>
                  <h5 className="fw-bold mb-3">البرنامج الانتخابي</h5>
                  <p className="text-muted mb-4">إنشاء وتحديث برنامجك الانتخابي</p>
                  <button 
                    onClick={() => router.push('/candidate/program')}
                    className="btn btn-primary"
                    style={{borderRadius: '25px'}}
                  >
                    <i className="fas fa-plus me-2"></i>
                    إدارة البرنامج
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
                  <p className="text-muted mb-4">عرض إنجازاتك وخبراتك السابقة</p>
                  <button 
                    onClick={() => router.push('/candidate/achievements')}
                    className="btn btn-warning"
                    style={{borderRadius: '25px'}}
                  >
                    <i className="fas fa-star me-2"></i>
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
                    onClick={() => router.push('/candidate/events')}
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
                    <i className="fas fa-envelope fa-3x text-danger"></i>
                  </div>
                  <h5 className="fw-bold mb-3">الرسائل</h5>
                  <p className="text-muted mb-4">قراءة والرد على رسائل المواطنين</p>
                  <button 
                    onClick={() => router.push('/candidate/messages')}
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
                  <p className="text-muted mb-4">عرض تقارير مفصلة عن حملتك الانتخابية</p>
                  <button 
                    onClick={() => router.push('/candidate/reports')}
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

      {/* معلومات الحملة الانتخابية */}
      {profile.electoral_symbol && profile.electoral_number && (
        <section className="py-5">
          <div className="container">
            <div className="card border-0 shadow-sm" style={{borderRadius: '15px'}}>
              <div className="card-header bg-gradient text-white" style={{borderRadius: '15px 15px 0 0', background: 'linear-gradient(45deg, #007bff, #6610f2)'}}>
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-vote-yea me-2"></i>
                  معلومات الحملة الانتخابية
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="fw-bold text-primary mb-2">الرمز الانتخابي:</h6>
                        <p className="mb-3 fs-5">
                          <i className="fas fa-star text-warning me-2"></i>
                          {profile.electoral_symbol}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6 className="fw-bold text-primary mb-2">الرقم الانتخابي:</h6>
                        <p className="mb-3 fs-5">
                          <i className="fas fa-hashtag text-info me-2"></i>
                          {profile.electoral_number}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 text-end">
                    <button 
                      onClick={() => router.push('/candidate/campaign')}
                      className="btn btn-outline-primary"
                    >
                      <i className="fas fa-bullhorn me-2"></i>
                      إدارة الحملة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* نصائح للمرشحين */}
      <section className="py-5" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <div className="card border-0 shadow-sm" style={{borderRadius: '15px'}}>
            <div className="card-header bg-success text-white" style={{borderRadius: '15px 15px 0 0'}}>
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-lightbulb me-2"></i>
                نصائح مهمة للمرشحين
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-users text-success me-3 mt-1 fa-2x"></i>
                    <div>
                      <h6 className="fw-bold">تفاعل مع المواطنين</h6>
                      <p className="small text-muted mb-0">رد على رسائل المواطنين بانتظام وكن متاحاً للتواصل</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-calendar text-warning me-3 mt-1 fa-2x"></i>
                    <div>
                      <h6 className="fw-bold">نظم فعاليات منتظمة</h6>
                      <p className="small text-muted mb-0">أقم لقاءات ومؤتمرات لعرض برنامجك الانتخابي</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-file-alt text-primary me-3 mt-1 fa-2x"></i>
                    <div>
                      <h6 className="fw-bold">حدث برنامجك باستمرار</h6>
                      <p className="small text-muted mb-0">اجعل برنامجك الانتخابي محدثاً ومفصلاً</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
