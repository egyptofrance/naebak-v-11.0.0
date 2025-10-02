'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalMembers: number;
  totalCandidates: number;
  totalMessages: number;
  totalComplaints: number;
  pendingComplaints: number;
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMembers: 0,
    totalCandidates: 0,
    totalMessages: 0,
    totalComplaints: 0,
    pendingComplaints: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats from API
    const loadStats = async () => {
      try {
        // This would be replaced with actual API calls to Supabase
        setTimeout(() => {
          setStats({
            totalUsers: 1250,
            totalMembers: 596,
            totalCandidates: 125,
            totalMessages: 3420,
            totalComplaints: 89,
            pendingComplaints: 23
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
    { title: 'إدارة المستخدمين', href: '/admin/users', icon: '👥', description: 'عرض وإدارة جميع المستخدمين' },
    { title: 'إدارة المحتوى', href: '/admin/content', icon: '📝', description: 'إدارة محتوى الموقع والأخبار' },
    { title: 'الإعدادات', href: '/admin/settings', icon: '⚙️', description: 'إعدادات النظام العامة' },
    { title: 'التقارير', href: '/admin/reports', icon: '📊', description: 'عرض التقارير والإحصائيات' }
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
          <p className="text-muted">مرحباً بك في لوحة تحكم المدير - نظرة شاملة على منصة نائبك</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-6 mb-2" style={{ color: '#004705' }}>👥</div>
              <h3 className="h4 mb-1">{stats.totalUsers.toLocaleString()}</h3>
              <p className="text-muted mb-0">إجمالي المستخدمين</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-6 mb-2" style={{ color: '#004705' }}>🏛️</div>
              <h3 className="h4 mb-1">{stats.totalMembers.toLocaleString()}</h3>
              <p className="text-muted mb-0">أعضاء البرلمان</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-6 mb-2" style={{ color: '#fba505ff' }}>🗳️</div>
              <h3 className="h4 mb-1">{stats.totalCandidates.toLocaleString()}</h3>
              <p className="text-muted mb-0">المرشحون</p>
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
              <div className="display-6 mb-2" style={{ color: '#fba505ff' }}>📋</div>
              <h3 className="h4 mb-1">{stats.totalComplaints.toLocaleString()}</h3>
              <p className="text-muted mb-0">إجمالي الشكاوى</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-6 mb-2" style={{ color: '#dc3545' }}>⏳</div>
              <h3 className="h4 mb-1">{stats.pendingComplaints.toLocaleString()}</h3>
              <p className="text-muted mb-0">شكاوى معلقة</p>
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

      {/* Recent Activity */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h5 className="card-title mb-0" style={{ color: '#004705' }}>النشاط الأخير</h5>
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
                      <h6 className="mb-1">مستخدم جديد انضم للمنصة</h6>
                      <p className="text-muted mb-0 small">منذ 5 دقائق</p>
                    </div>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 me-3">
                      <div className="rounded-circle text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#fba505ff' }}>
                        💬
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">رسالة جديدة من مواطن</h6>
                      <p className="text-muted mb-0 small">منذ 15 دقيقة</p>
                    </div>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 me-3">
                      <div className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        📋
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">شكوى جديدة تحتاج مراجعة</h6>
                      <p className="text-muted mb-0 small">منذ 30 دقيقة</p>
                    </div>
                  </div>
                </div>
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

export default AdminDashboardPage;

