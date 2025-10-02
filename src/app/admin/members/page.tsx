'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  governorate: string;
  council_type: string;
  party: string;
  district: string;
  rating: number;
  points: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminMembersPage() {
  const supabase = createClientComponentClient();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
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
    loadMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, filterCouncil, filterGovernorate, filterParty, searchTerm]);

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_type', 'member')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = [...members];

    if (filterCouncil !== 'all') {
      filtered = filtered.filter(m => m.council_type === filterCouncil);
    }

    if (filterGovernorate !== 'all') {
      filtered = filtered.filter(m => m.governorate === filterGovernorate);
    }

    if (filterParty !== 'all') {
      filtered = filtered.filter(m => m.party === filterParty);
    }

    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMembers(filtered);
    setCurrentPage(1);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      setMembers(members.map(m =>
        m.id === id ? { ...m, is_active: !currentStatus } : m
      ));
      
      alert('تم تحديث حالة النائب بنجاح');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('حدث خطأ أثناء التحديث');
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا النائب؟ سيتم حذف جميع بياناته المرتبطة.')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMembers(members.filter(m => m.id !== id));
      alert('تم حذف النائب بنجاح');
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

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
            <i className="fas fa-users me-2"></i>
            إدارة النواب
          </h2>
          <p className="text-muted">إدارة حسابات النواب في المجلسين</p>
        </div>
        <div className="col-auto">
          <Link href="/member/register" className="btn btn-success">
            <i className="fas fa-plus me-2"></i>
            إضافة نائب جديد
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">إجمالي النواب</h6>
              <h3 className="fw-bold text-success">{members.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">مجلس النواب</h6>
              <h3 className="fw-bold text-primary">
                {members.filter(m => m.council_type === 'نواب').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">مجلس الشيوخ</h6>
              <h3 className="fw-bold text-info">
                {members.filter(m => m.council_type === 'شيوخ').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">النشطون</h6>
              <h3 className="fw-bold text-warning">
                {members.filter(m => m.is_active).length}
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
                placeholder="ابحث بالاسم أو البريد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
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
                  <th>التقييم</th>
                  <th>النقاط</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map(member => (
                  <tr key={member.id}>
                    <td>
                      <strong>{member.full_name}</strong>
                    </td>
                    <td>{member.email}</td>
                    <td>{member.phone_number}</td>
                    <td>
                      <span className={`badge ${member.council_type === 'نواب' ? 'bg-primary' : 'bg-info'}`}>
                        {member.council_type}
                      </span>
                    </td>
                    <td>{member.governorate}</td>
                    <td>{member.party}</td>
                    <td>
                      <i className="fas fa-star text-warning"></i> {member.rating?.toFixed(1) || '0.0'}
                    </td>
                    <td>{member.points || 0}</td>
                    <td>
                      <span className={`badge ${member.is_active ? 'bg-success' : 'bg-secondary'}`}>
                        {member.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Link
                          href={`/member/${member.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                        <button
                          className={`btn btn-sm ${member.is_active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => toggleActive(member.id, member.is_active)}
                        >
                          <i className={`fas ${member.is_active ? 'fa-ban' : 'fa-check'}`}></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteMember(member.id)}
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
