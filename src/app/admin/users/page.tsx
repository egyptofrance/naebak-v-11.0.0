'use client';

import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'member' | 'candidate' | 'manager' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastLogin: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    // Simulate loading users from API
    const loadUsers = async () => {
      try {
        // This would be replaced with actual API calls to Supabase
        setTimeout(() => {
          const mockUsers: User[] = [
            {
              id: '1',
              name: 'أحمد محمد علي',
              email: 'ahmed@example.com',
              role: 'citizen',
              status: 'active',
              joinDate: '2024-01-15',
              lastLogin: '2024-10-01'
            },
            {
              id: '2',
              name: 'د. فاطمة السيد',
              email: 'fatma@parliament.gov.eg',
              role: 'member',
              status: 'active',
              joinDate: '2024-01-10',
              lastLogin: '2024-10-02'
            },
            {
              id: '3',
              name: 'محمد حسن',
              email: 'mohamed@candidate.com',
              role: 'candidate',
              status: 'active',
              joinDate: '2024-02-01',
              lastLogin: '2024-09-30'
            },
            {
              id: '4',
              name: 'سارة أحمد',
              email: 'sara@example.com',
              role: 'citizen',
              status: 'suspended',
              joinDate: '2024-03-01',
              lastLogin: '2024-09-25'
            },
            {
              id: '5',
              name: 'مدير النظام',
              email: 'admin@naebak.com',
              role: 'admin',
              status: 'active',
              joinDate: '2024-01-01',
              lastLogin: '2024-10-02'
            }
          ];
          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading users:', error);
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      citizen: 'مواطن',
      member: 'عضو برلمان',
      candidate: 'مرشح',
      manager: 'مدير',
      admin: 'مدير نظام'
    };
    return roleLabels[role as keyof typeof roleLabels] || role;
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      active: 'نشط',
      inactive: 'غير نشط',
      suspended: 'موقوف'
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const getStatusBadgeClass = (status: string) => {
    const statusClasses = {
      active: 'bg-success',
      inactive: 'bg-secondary',
      suspended: 'bg-danger'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-secondary';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus as User['status'] } : user
    ));
  };

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
          <h1 className="h2 mb-3" style={{ color: '#004705' }}>إدارة المستخدمين</h1>
          <p className="text-muted">عرض وإدارة جميع مستخدمي المنصة</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="search" className="form-label">البحث</label>
                  <input
                    type="text"
                    className="form-control"
                    id="search"
                    placeholder="البحث بالاسم أو البريد الإلكتروني..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="roleFilter" className="form-label">الدور</label>
                  <select
                    className="form-select"
                    id="roleFilter"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="all">جميع الأدوار</option>
                    <option value="citizen">مواطن</option>
                    <option value="member">عضو برلمان</option>
                    <option value="candidate">مرشح</option>
                    <option value="manager">مدير</option>
                    <option value="admin">مدير نظام</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="statusFilter" className="form-label">الحالة</label>
                  <select
                    className="form-select"
                    id="statusFilter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="suspended">موقوف</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0" style={{ color: '#004705' }}>
                  المستخدمون ({filteredUsers.length})
                </h5>
                <button className="btn btn-success btn-sm">
                  <i className="bi bi-plus-lg me-1"></i>
                  إضافة مستخدم جديد
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>الاسم</th>
                      <th>البريد الإلكتروني</th>
                      <th>الدور</th>
                      <th>الحالة</th>
                      <th>تاريخ الانضمام</th>
                      <th>آخر دخول</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                              {user.name.charAt(0)}
                            </div>
                            <strong>{user.name}</strong>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className="badge bg-primary">{getRoleLabel(user.role)}</span>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                            {getStatusLabel(user.status)}
                          </span>
                        </td>
                        <td>{new Date(user.joinDate).toLocaleDateString('ar-EG')}</td>
                        <td>{new Date(user.lastLogin).toLocaleDateString('ar-EG')}</td>
                        <td>
                          <div className="dropdown">
                            <button
                              className="btn btn-sm btn-outline-secondary dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              الإجراءات
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button className="dropdown-item" type="button">
                                  <i className="bi bi-eye me-2"></i>عرض التفاصيل
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item" type="button">
                                  <i className="bi bi-pencil me-2"></i>تعديل
                                </button>
                              </li>
                              <li><hr className="dropdown-divider" /></li>
                              {user.status === 'active' ? (
                                <li>
                                  <button
                                    className="dropdown-item text-warning"
                                    type="button"
                                    onClick={() => handleStatusChange(user.id, 'suspended')}
                                  >
                                    <i className="bi bi-pause-circle me-2"></i>إيقاف
                                  </button>
                                </li>
                              ) : (
                                <li>
                                  <button
                                    className="dropdown-item text-success"
                                    type="button"
                                    onClick={() => handleStatusChange(user.id, 'active')}
                                  >
                                    <i className="bi bi-play-circle me-2"></i>تفعيل
                                  </button>
                                </li>
                              )}
                              <li>
                                <button className="dropdown-item text-danger" type="button">
                                  <i className="bi bi-trash me-2"></i>حذف
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="row">
          <div className="col-12">
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    السابق
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    التالي
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
      </div>
  );
};

export default AdminUsersPage;

