'use client';

import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import CitizenProtectedRoute from '../../../components/CitizenProtectedRoute';

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  user_type: string;
  governorate_name?: string;
  created_at: string;
}

interface DashboardStats {
  totalMessages: number;
  totalIssues: number;
  resolvedIssues: number;
  pendingIssues: number;
}

export default function CitizenDashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    totalIssues: 0,
    resolvedIssues: 0,
    pendingIssues: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // محاكاة تحميل بيانات المستخدم
    const loadUserData = async () => {
      try {
        // هنا سيتم استدعاء API الحقيقي
        const mockProfile: UserProfile = {
          id: 1,
          full_name: "أحمد محمد علي",
          email: "ahmed@example.com",
          phone_number: "01012345678",
          user_type: "citizen",
          governorate_name: "القاهرة",
          created_at: "2024-01-15"
        };

        const mockStats: DashboardStats = {
          totalMessages: 12,
          totalIssues: 8,
          resolvedIssues: 5,
          pendingIssues: 3
        };

        setUserProfile(mockProfile);
        setStats(mockStats);
      } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (isLoading) {
    return (
      <Layout showBanner={false}>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3 text-muted">جاري تحميل لوحة التحكم...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <CitizenProtectedRoute>
      <Layout showBanner={false}>
      {/* قسم الترحيب */}
      <section className="py-4" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center mb-3">
                <img 
                  src="/images/logo-naebak-green.png" 
                  alt="نائبك" 
                  className="me-3"
                  style={{height: '50px', objectFit: 'contain'}}
                />
                <div>
                  <h2 className="fw-bold mb-1" style={{color: '#004705'}}>
                    مرحباً، {userProfile?.full_name}
                  </h2>
                  <p className="text-muted mb-0">لوحة تحكم المواطن</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-end">
              <span className="badge bg-success fs-6 px-3 py-2">
                <i className="fas fa-user me-2"></i>
                مواطن مسجل
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* إحصائيات سريعة */}
      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-envelope fa-2x text-primary"></i>
                  </div>
                  <h4 className="fw-bold text-primary mb-1">{stats.totalMessages}</h4>
                  <p className="text-muted mb-0">إجمالي الرسائل</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-exclamation-triangle fa-2x text-warning"></i>
                  </div>
                  <h4 className="fw-bold text-warning mb-1">{stats.totalIssues}</h4>
                  <p className="text-muted mb-0">إجمالي القضايا</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-check-circle fa-2x text-success"></i>
                  </div>
                  <h4 className="fw-bold text-success mb-1">{stats.resolvedIssues}</h4>
                  <p className="text-muted mb-0">قضايا محلولة</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-clock fa-2x text-danger"></i>
                  </div>
                  <h4 className="fw-bold text-danger mb-1">{stats.pendingIssues}</h4>
                  <p className="text-muted mb-0">قضايا معلقة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* الإجراءات السريعة */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h4 className="fw-bold mb-4" style={{color: '#004705'}}>الإجراءات السريعة</h4>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                          <i className="fas fa-user-edit fa-lg text-primary"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">إدارة الملف الشخصي</h6>
                          <p className="text-muted small mb-0">تحديث البيانات الشخصية</p>
                        </div>
                      </div>
                      <a href="/citizen/profile" className="btn btn-outline-primary w-100">
                        إدارة الملف الشخصي
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                          <i className="fas fa-envelope fa-lg text-success"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">الرسائل</h6>
                          <p className="text-muted small mb-0">إدارة الرسائل والمراسلات</p>
                        </div>
                      </div>
                      <a href="/citizen/profile/messages" className="btn btn-outline-success w-100">
                        عرض الرسائل
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                          <i className="fas fa-exclamation-triangle fa-lg text-warning"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">القضايا والشكاوى</h6>
                          <p className="text-muted small mb-0">متابعة القضايا المرفوعة</p>
                        </div>
                      </div>
                      <a href="/citizen/profile/issues" className="btn btn-outline-warning w-100">
                        إدارة القضايا
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                          <i className="fas fa-plus fa-lg text-info"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">رفع قضية جديدة</h6>
                          <p className="text-muted small mb-0">إضافة قضية أو شكوى جديدة</p>
                        </div>
                      </div>
                      <button className="btn btn-outline-info w-100">
                        رفع قضية جديدة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* معلومات الملف الشخصي */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm" style={{borderRadius: '12px'}}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{color: '#004705'}}>معلومات الملف الشخصي</h6>
                  <div className="mb-3">
                    <small className="text-muted">الاسم الكامل</small>
                    <p className="mb-1 fw-medium">{userProfile?.full_name}</p>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted">البريد الإلكتروني</small>
                    <p className="mb-1 fw-medium">{userProfile?.email}</p>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted">رقم الهاتف</small>
                    <p className="mb-1 fw-medium">{userProfile?.phone_number}</p>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted">المحافظة</small>
                    <p className="mb-1 fw-medium">{userProfile?.governorate_name}</p>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted">تاريخ التسجيل</small>
                    <p className="mb-1 fw-medium">
                      {userProfile?.created_at && new Date(userProfile.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <hr />
                  <a href="/citizen/profile" className="btn btn-success w-100">
                    تحديث البيانات
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* آخر النشاطات */}
      <section className="py-4" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <h4 className="fw-bold mb-4" style={{color: '#004705'}}>آخر النشاطات</h4>
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm" style={{borderRadius: '12px'}}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3">آخر الرسائل</h6>
                  <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-envelope text-primary"></i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1 fw-medium">رد على استفسار حول الخدمات</p>
                      <small className="text-muted">منذ يومين</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-check text-success"></i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1 fw-medium">تأكيد استلام الطلب</p>
                      <small className="text-muted">منذ 3 أيام</small>
                    </div>
                  </div>
                  <a href="/citizen/profile/messages" className="btn btn-outline-primary btn-sm">
                    عرض جميع الرسائل
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm" style={{borderRadius: '12px'}}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3">آخر القضايا</h6>
                  <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-clock text-warning"></i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1 fw-medium">شكوى حول الخدمات البلدية</p>
                      <small className="text-muted">قيد المراجعة - منذ يوم</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-check-circle text-success"></i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1 fw-medium">طلب تحسين الطرق</p>
                      <small className="text-muted">تم الحل - منذ أسبوع</small>
                    </div>
                  </div>
                  <a href="/citizen/profile/issues" className="btn btn-outline-warning btn-sm">
                    عرض جميع القضايا
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </Layout>
    </CitizenProtectedRoute>
  );
}
