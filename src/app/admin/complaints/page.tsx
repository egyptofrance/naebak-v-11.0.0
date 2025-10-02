'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  governorate: string;
  status: string;
  created_at: string;
  user_id: string;
  assigned_to?: string;
  users?: {
    full_name: string;
    email: string;
  };
}

export default function AdminComplaintsPage() {
  const supabase = createClientComponentClient();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGovernorate, setFilterGovernorate] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const governorates = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'القليوبية',
    'كفر الشيخ', 'الغربية', 'المنوفية', 'البحيرة', 'الإسماعيلية', 'بورسعيد',
    'السويس', 'المنيا', 'بني سويف', 'الفيوم', 'أسيوط', 'سوهاج', 'قنا',
    'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد', 'مطروح',
    'شمال سيناء', 'جنوب سيناء', 'دمياط'
  ];

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, filterStatus, filterGovernorate, searchTerm]);

  const loadComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select(`
          *,
          users:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = [...complaints];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    if (filterGovernorate !== 'all') {
      filtered = filtered.filter(c => c.governorate === filterGovernorate);
    }

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredComplaints(filtered);
    setCurrentPage(1);
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('issues')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setComplaints(complaints.map(c =>
        c.id === id ? { ...c, status: newStatus } : c
      ));
      
      alert('تم تحديث حالة الشكوى بنجاح');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('حدث خطأ أثناء تحديث الحالة');
    }
  };

  const deleteComplaint = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشكوى؟')) return;

    try {
      const { error } = await supabase
        .from('issues')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setComplaints(complaints.filter(c => c.id !== id));
      alert('تم حذف الشكوى بنجاح');
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      'pending': 'bg-warning',
      'in_progress': 'bg-info',
      'resolved': 'bg-success',
      'rejected': 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      'pending': 'قيد الانتظار',
      'in_progress': 'قيد المعالجة',
      'resolved': 'تم الحل',
      'rejected': 'مرفوض'
    };
    return texts[status] || status;
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
            <i className="fas fa-file-alt me-2"></i>
            إدارة الشكاوى
          </h2>
          <p className="text-muted">إدارة جميع الشكاوى المقدمة من المواطنين</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">إجمالي الشكاوى</h6>
              <h3 className="fw-bold text-primary">{complaints.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">قيد الانتظار</h6>
              <h3 className="fw-bold text-warning">
                {complaints.filter(c => c.status === 'pending').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">قيد المعالجة</h6>
              <h3 className="fw-bold text-info">
                {complaints.filter(c => c.status === 'in_progress').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">تم الحل</h6>
              <h3 className="fw-bold text-success">
                {complaints.filter(c => c.status === 'resolved').length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-bold">الحالة</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">الكل</option>
                <option value="pending">قيد الانتظار</option>
                <option value="in_progress">قيد المعالجة</option>
                <option value="resolved">تم الحل</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">المحافظة</label>
              <select
                className="form-select"
                value={filterGovernorate}
                onChange={(e) => setFilterGovernorate(e.target.value)}
              >
                <option value="all">الكل</option>
                {governorates.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">بحث</label>
              <input
                type="text"
                className="form-control"
                placeholder="ابحث في العنوان أو الوصف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>العنوان</th>
                  <th>المواطن</th>
                  <th>النوع</th>
                  <th>المحافظة</th>
                  <th>الحالة</th>
                  <th>التاريخ</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {paginatedComplaints.map(complaint => (
                  <tr key={complaint.id}>
                    <td>{complaint.id}</td>
                    <td>
                      <strong>{complaint.title}</strong>
                      <br />
                      <small className="text-muted">
                        {complaint.description.substring(0, 50)}...
                      </small>
                    </td>
                    <td>
                      {complaint.users?.full_name || 'غير معروف'}
                      <br />
                      <small className="text-muted">{complaint.users?.email}</small>
                    </td>
                    <td>{complaint.category}</td>
                    <td>{complaint.governorate}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(complaint.status)}`}>
                        {getStatusText(complaint.status)}
                      </span>
                    </td>
                    <td>
                      <small>{new Date(complaint.created_at).toLocaleDateString('ar-EG')}</small>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <select
                          className="form-select form-select-sm"
                          value={complaint.status}
                          onChange={(e) => updateStatus(complaint.id, e.target.value)}
                          style={{width: '150px'}}
                        >
                          <option value="pending">قيد الانتظار</option>
                          <option value="in_progress">قيد المعالجة</option>
                          <option value="resolved">تم الحل</option>
                          <option value="rejected">مرفوض</option>
                        </select>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteComplaint(complaint.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    السابق
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    التالي
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
