'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ManagerStats {
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  totalMessages: number;
  unreadMessages: number;
  todayComplaints: number;
}

const ManagerDashboardPage = () => {
  const [stats, setStats] = useState<ManagerStats>({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalMessages: 0,
    unreadMessages: 0,
    todayComplaints: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats from API
    const loadStats = async () => {
      try {
        // This would be replaced with actual API calls to Supabase
        setTimeout(() => {
          setStats({
            totalComplaints: 89,
            pendingComplaints: 23,
            resolvedComplaints: 66,
            totalMessages: 156,
            unreadMessages: 12,
            todayComplaints: 5
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading stats:', error);
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const quickActions = [
    { title: 'إدارة الشكاوى', href: '/manager/complaints', icon: '📋', description: 'مراجعة ومتابعة الشكاوى' },
    { title: 'إدارة الرسائل', href: '/manager/messages', icon: '💬', description: 'متابعة الرسائل والردود' },
    { title: 'التقارير', href: '/manager/reports', icon: '📊', description: 'عرض التقارير والإحصائيات' },
    { title: 'الإعدادات', href: '/manager/settings', icon: '⚙️', description: 'إعدادات المدير' }
  ];

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h2 mb-3" style={{ color: '#004705' }}>لوحة تحكم المدير</h1>
          <p className="text-muted">مرحباً بك في لوحة تحكم المدير - إدارة الشكاوى والرسائل</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-6 mb-2" style={{ color: '#004705' }}>📋</div>
              <h3 className="h4 mb-1">{stats.totalComplaints.toLocaleString()}</h3>
              <p className="text-muted mb-0">إجمالي الشكاوى</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-6 mb-2" style={{ color: '#fba505ff' }}>⏳</div>
              <h3 className="h4 mb-1">{stats.pendingComplaints.toLocaleString()}</h3>
              <p className="text-muted mb-0">شكاوى معلقة</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-6 mb-2" style={{ color: '#28a745' }}>✅</div>
              <h3 className="h4 mb-1">{stats.resolvedComplaints.toLocaleString()}</h3>
              <p className="text-muted mb-0">شكاوى محلولة</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-6 mb-2" style={{ color: '#004705' }}>💬</div>
              <h3 className="h4 mb-1">{stats.totalMessages.toLocaleString()}</h3>
              <p className="text-muted mb-0">إجمالي الرسائل</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-6 mb-2" style={{ color: '#dc3545' }}>📬</div>
              <h3 className="h4 mb-1">{stats.unreadMessages.toLocaleString()}</h3>
              <p className="text-muted mb-0">رسائل غير مقروءة</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-6 mb-2" style={{ color: '#17a2b8' }}>📅</div>
              <h3 className="h4 mb-1">{stats.todayComplaints.toLocaleString()}</h3>
              <p className="text-muted mb-0">شكاوى اليوم</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <h3 className="h4 mb-3" style={{ color: '#004705' }}>الإجراءات السريعة</h3>
        </div>
        {quickActions.map((action, index) => (
          <div key={index} className="col-lg-3 col-md-6 mb-3">
            <Link href={action.href} className="text-decoration-none">
              <div className="card border-0 shadow-sm h-100 hover-card">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="display-6 me-3">{action.icon}</div>
                    <div>
                      <h5 className="card-title mb-1" style={{ color: '#004705' }}>{action.title}</h5>
                      <p className="card-text text-muted small mb-0">{action.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Activity and Priority Items */}
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom">
              <h5 className="card-title mb-0" style={{ color: '#004705' }}>الشكاوى العاجلة</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="mb-1">شكوى بخصوص انقطاع الكهرباء</h6>
                      <p className="text-muted mb-1 small">من: أحمد محمد علي</p>
                      <p className="text-muted mb-0 small">منذ ساعتين</p>
                    </div>
                    <span className="badge bg-danger">عاجل</span>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="mb-1">مشكلة في شبكة المياه</h6>
                      <p className="text-muted mb-1 small">من: فاطمة حسن</p>
                      <p className="text-muted mb-0 small">منذ 4 ساعات</p>
                    </div>
                    <span className="badge bg-warning">مهم</span>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="mb-1">طلب صيانة طريق</h6>
                      <p className="text-muted mb-1 small">من: محمد سعد</p>
                      <p className="text-muted mb-0 small">منذ 6 ساعات</p>
                    </div>
                    <span className="badge bg-info">عادي</span>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <Link href="/manager/complaints" className="btn btn-outline-success btn-sm">
                  عرض جميع الشكاوى
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom">
              <h5 className="card-title mb-0" style={{ color: '#004705' }}>الرسائل الحديثة</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 me-3">
                      <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        👤
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">رسالة من مواطن</h6>
                      <p className="text-muted mb-0 small">استفسار عن موعد جلسة البرلمان</p>
                      <p className="text-muted mb-0 small">منذ 10 دقائق</p>
                    </div>
                    <span className="badge bg-primary">جديد</span>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 me-3">
                      <div className="rounded-circle text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#fba505ff' }}>
                        🏛️
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">رد من عضو برلمان</h6>
                      <p className="text-muted mb-0 small">رد على شكوى المواطن أحمد</p>
                      <p className="text-muted mb-0 small">منذ 25 دقيقة</p>
                    </div>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 me-3">
                      <div className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        📋
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">تحديث حالة شكوى</h6>
                      <p className="text-muted mb-0 small">تم حل شكوى رقم #1234</p>
                      <p className="text-muted mb-0 small">منذ ساعة</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <Link href="/manager/messages" className="btn btn-outline-success btn-sm">
                  عرض جميع الرسائل
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
      </div>
  );
};

export default ManagerDashboardPage;

