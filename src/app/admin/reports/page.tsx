'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Stats {
  totalUsers: number;
  totalCitizens: number;
  totalMembers: number;
  totalCandidates: number;
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  totalMessages: number;
  totalRatings: number;
  avgRating: number;
}

interface GovernorateStats {
  governorate: string;
  members: number;
  candidates: number;
  complaints: number;
}

export default function AdminReportsPage() {
  const supabase = createClientComponentClient();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCitizens: 0,
    totalMembers: 0,
    totalCandidates: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalMessages: 0,
    totalRatings: 0,
    avgRating: 0
  });
  const [governorateStats, setGovernorateStats] = useState<GovernorateStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportType, setReportType] = useState('overview');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Total users by type
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: totalCitizens } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'citizen');

      const { count: totalMembers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'member');

      const { count: totalCandidates } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'candidate');

      // Complaints stats
      const { count: totalComplaints } = await supabase
        .from('issues')
        .select('*', { count: 'exact', head: true });

      const { count: pendingComplaints } = await supabase
        .from('issues')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: resolvedComplaints } = await supabase
        .from('issues')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'resolved');

      // Messages stats
      const { count: totalMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Ratings stats
      const { count: totalRatings } = await supabase
        .from('ratings')
        .select('*', { count: 'exact', head: true });

      const { data: avgRatingData } = await supabase
        .from('ratings')
        .select('rating');

      const avgRating = avgRatingData && avgRatingData.length > 0
        ? avgRatingData.reduce((sum, r) => sum + r.rating, 0) / avgRatingData.length
        : 0;

      setStats({
        totalUsers: totalUsers || 0,
        totalCitizens: totalCitizens || 0,
        totalMembers: totalMembers || 0,
        totalCandidates: totalCandidates || 0,
        totalComplaints: totalComplaints || 0,
        pendingComplaints: pendingComplaints || 0,
        resolvedComplaints: resolvedComplaints || 0,
        totalMessages: totalMessages || 0,
        totalRatings: totalRatings || 0,
        avgRating
      });

      // Load governorate stats
      await loadGovernorateStats();
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGovernorateStats = async () => {
    try {
      const { data: governorates } = await supabase
        .from('governorates')
        .select('name')
        .order('name');

      if (!governorates) return;

      const stats = await Promise.all(
        governorates.map(async (gov) => {
          const { count: members } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('user_type', 'member')
            .eq('governorate', gov.name);

          const { count: candidates } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('user_type', 'candidate')
            .eq('governorate', gov.name);

          const { count: complaints } = await supabase
            .from('issues')
            .select('*', { count: 'exact', head: true })
            .eq('governorate', gov.name);

          return {
            governorate: gov.name,
            members: members || 0,
            candidates: candidates || 0,
            complaints: complaints || 0
          };
        })
      );

      setGovernorateStats(stats);
    } catch (error) {
      console.error('Error loading governorate stats:', error);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold" style={{color: '#004705'}}>
            <i className="fas fa-chart-bar me-2"></i>
            التقارير والإحصائيات
          </h2>
          <p className="text-muted">تقارير شاملة عن المنصة</p>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-success"
            onClick={() => loadStats()}
          >
            <i className="fas fa-sync me-2"></i>
            تحديث
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="btn-group" role="group">
            <button
              className={`btn ${reportType === 'overview' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setReportType('overview')}
            >
              نظرة عامة
            </button>
            <button
              className={`btn ${reportType === 'governorates' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setReportType('governorates')}
            >
              تقرير المحافظات
            </button>
          </div>
        </div>
      </div>

      {reportType === 'overview' && (
        <>
          {/* Users Stats */}
          <div className="row mb-4">
            <div className="col-12">
              <h4 className="fw-bold mb-3">إحصائيات المستخدمين</h4>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">إجمالي المستخدمين</h6>
                  <h3 className="fw-bold text-primary">{stats.totalUsers}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">المواطنون</h6>
                  <h3 className="fw-bold text-info">{stats.totalCitizens}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">النواب</h6>
                  <h3 className="fw-bold text-success">{stats.totalMembers}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">المرشحون</h6>
                  <h3 className="fw-bold text-warning">{stats.totalCandidates}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Complaints Stats */}
          <div className="row mb-4">
            <div className="col-12">
              <h4 className="fw-bold mb-3">إحصائيات الشكاوى</h4>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">إجمالي الشكاوى</h6>
                  <h3 className="fw-bold text-primary">{stats.totalComplaints}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">قيد الانتظار</h6>
                  <h3 className="fw-bold text-warning">{stats.pendingComplaints}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">تم الحل</h6>
                  <h3 className="fw-bold text-success">{stats.resolvedComplaints}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">نسبة الحل</h6>
                  <h3 className="fw-bold text-info">
                    {stats.totalComplaints > 0
                      ? ((stats.resolvedComplaints / stats.totalComplaints) * 100).toFixed(1)
                      : 0}%
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Other Stats */}
          <div className="row mb-4">
            <div className="col-12">
              <h4 className="fw-bold mb-3">إحصائيات أخرى</h4>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">إجمالي الرسائل</h6>
                  <h3 className="fw-bold text-primary">{stats.totalMessages}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">إجمالي التقييمات</h6>
                  <h3 className="fw-bold text-warning">{stats.totalRatings}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">متوسط التقييم</h6>
                  <h3 className="fw-bold text-success">
                    <i className="fas fa-star"></i> {stats.avgRating.toFixed(2)}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {reportType === 'governorates' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">تقرير المحافظات</h4>
              <button
                className="btn btn-sm btn-success"
                onClick={() => exportToCSV(governorateStats, 'governorates_report')}
              >
                <i className="fas fa-download me-2"></i>
                تصدير CSV
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>المحافظة</th>
                    <th>النواب</th>
                    <th>المرشحون</th>
                    <th>الشكاوى</th>
                    <th>الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {governorateStats.map((stat, index) => (
                    <tr key={index}>
                      <td><strong>{stat.governorate}</strong></td>
                      <td>
                        <span className="badge bg-success">{stat.members}</span>
                      </td>
                      <td>
                        <span className="badge bg-info">{stat.candidates}</span>
                      </td>
                      <td>
                        <span className="badge bg-warning">{stat.complaints}</span>
                      </td>
                      <td>
                        <strong>{stat.members + stat.candidates + stat.complaints}</strong>
                      </td>
                    </tr>
                  ))}
                  <tr className="table-active fw-bold">
                    <td>الإجمالي</td>
                    <td>{governorateStats.reduce((sum, s) => sum + s.members, 0)}</td>
                    <td>{governorateStats.reduce((sum, s) => sum + s.candidates, 0)}</td>
                    <td>{governorateStats.reduce((sum, s) => sum + s.complaints, 0)}</td>
                    <td>
                      {governorateStats.reduce((sum, s) => sum + s.members + s.candidates + s.complaints, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
