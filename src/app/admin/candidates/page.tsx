'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  governorate: string;
  council_type: string;
  party: string;
  district: string;
  electoral_number: string;
  electoral_symbol: string;
  rating: number;
  points: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminCandidatesPage() {
  const supabase = createClientComponentClient();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCouncil, setFilterCouncil] = useState('all');
  const [filterGovernorate, setFilterGovernorate] = useState('all');
  const [filterParty, setFilterParty] = useState('all');
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

  const parties = [
    'مستقبل وطن', 'الوفد', 'التجمع', 'المصريين الأحرار', 'الشعب الجمهوري',
    'الإصلاح والتنمية', 'المحافظين', 'الحرية المصري', 'الديمقراطي الاجتماعي',
    'العدل', 'الجيل الديمقراطي', 'المصري الديمقراطي الاجتماعي', 'الوطن',
    'حماة الوطن', 'مصر الحديثة', 'مستقل'
  ];

  useEffect(() => {
    loadCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [candidates, filterCouncil, filterGovernorate, filterParty, searchTerm]);

  const loadCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_type', 'candidate')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCandidates = () => {
    let filtered = [...candidates];

    if (filterCouncil !== 'all') {
      filtered = filtered.filter(c => c.council_type === filterCouncil);
    }

    if (filterGovernorate !== 'all') {
      filtered = filtered.filter(c => c.governorate === filterGovernorate);
    }

    if (filterParty !== 'all') {
      filtered = filtered.filter(c => c.party === filterParty);
    }

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.electoral_number?.includes(searchTerm)
      );
    }

    setFilteredCandidates(filtered);
    setCurrentPage(1);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      setCandidates(candidates.map(c =>
        c.id === id ? { ...c, is_active: !currentStatus } : c
      ));
      
      alert('تم تحديث حالة المرشح بنجاح');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('حدث خطأ أثناء التحديث');
    }
  };

  const deleteCandidate = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المرشح؟ سيتم حذف جميع بياناته المرتبطة.')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCandidates(candidates.filter(c => c.id !== id));
      alert('تم حذف المرشح بنجاح');
    } catch (error) {
      console.error('Error deleting candidate:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

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
            <i className="fas fa-user-tie me-2"></i>
            إدارة المرشحين
          </h2>
          <p className="text-muted">إدارة حسابات المرشحين في المجلسين</p>
        </div>
        <div className="col-auto">
          <Link href="/candidate/register" className="btn btn-success">
            <i className="fas fa-plus me-2"></i>
            إضافة مرشح جديد
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">إجمالي المرشحين</h6>
              <h3 className="fw-bold text-success">{candidates.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">مجلس النواب</h6>
              <h3 className="fw-bold text-primary">
                {candidates.filter(c => c.council_type === 'نواب').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">مجلس الشيوخ</h6>
              <h3 className="fw-bold text-info">
                {candidates.filter(c => c.council_type === 'شيوخ').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">النشطون</h6>
              <h3 className="fw-bold text-warning">
                {candidates.filter(c => c.is_active).length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label fw-bold">المجلس</label>
              <select
                className="form-select"
                value={filterCouncil}
                onChange={(e) => setFilterCouncil(e.target.value)}
              >
                <option value="all">الكل</option>
                <option value="نواب">النواب</option>
                <option value="شيوخ">الشيوخ</option>
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
            <div className="col-md-3">
              <label className="form-label fw-bold">الحزب</label>
              <select
                className="form-select"
                value={filterParty}
                onChange={(e) => setFilterParty(e.target.value)}
              >
                <option value="all">الكل</option>
                {parties.map(party => (
                  <option key={party} value={party}>{party}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">بحث</label>
              <input
                type="text"
                className="form-control"
                placeholder="ابحث بالاسم أو البريد أو الرقم الانتخابي..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>البريد الإلكتروني</th>
                  <th>الهاتف</th>
                  <th>المجلس</th>
                  <th>المحافظة</th>
                  <th>الحزب</th>
                  <th>الرقم الانتخابي</th>
                  <th>التقييم</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCandidates.map(candidate => (
                  <tr key={candidate.id}>
                    <td>
                      <strong>{candidate.full_name}</strong>
                    </td>
                    <td>{candidate.email}</td>
                    <td>{candidate.phone_number}</td>
                    <td>
                      <span className={`badge ${candidate.council_type === 'نواب' ? 'bg-primary' : 'bg-info'}`}>
                        {candidate.council_type}
                      </span>
                    </td>
                    <td>{candidate.governorate}</td>
                    <td>{candidate.party}</td>
                    <td>
                      <span className="badge bg-secondary">{candidate.electoral_number || 'غير محدد'}</span>
                    </td>
                    <td>
                      <i className="fas fa-star text-warning"></i> {candidate.rating?.toFixed(1) || '0.0'}
                    </td>
                    <td>
                      <span className={`badge ${candidate.is_active ? 'bg-success' : 'bg-secondary'}`}>
                        {candidate.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Link
                          href={`/candidate/${candidate.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                        <button
                          className={`btn btn-sm ${candidate.is_active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => toggleActive(candidate.id, candidate.is_active)}
                        >
                          <i className={`fas ${candidate.is_active ? 'fa-ban' : 'fa-check'}`}></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteCandidate(candidate.id)}
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
