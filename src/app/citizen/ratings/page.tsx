'use client';

import { useState, useEffect } from 'react';
import CitizenProtectedRoute from '../../../components/CitizenProtectedRoute';

interface Rating {
  id: number;
  member_name: string;
  member_type: 'member' | 'candidate';
  rating: number;
  comment: string;
  created_at: string;
  governorate: string;
  party: string;
}

export default function CitizenRatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      // محاكاة بيانات التقييمات - ستحتاج لتعديلها حسب قاعدة البيانات الفعلية
      const mockRatings: Rating[] = [
        {
          id: 1,
          member_name: 'أحمد محمد علي',
          member_type: 'member',
          rating: 4,
          comment: 'أداء جيد في متابعة قضايا المواطنين',
          created_at: '2024-01-15',
          governorate: 'القاهرة',
          party: 'حزب الوفد'
        },
        {
          id: 2,
          member_name: 'فاطمة حسن إبراهيم',
          member_type: 'candidate',
          rating: 5,
          comment: 'برنامج انتخابي ممتاز ووعود واقعية',
          created_at: '2024-01-10',
          governorate: 'الجيزة',
          party: 'حزب المصريين الأحرار'
        },
        {
          id: 3,
          member_name: 'محمد عبد الرحمن',
          member_type: 'member',
          rating: 3,
          comment: 'يحتاج لمزيد من التفاعل مع المواطنين',
          created_at: '2024-01-08',
          governorate: 'الإسكندرية',
          party: 'حزب مستقبل وطن'
        }
      ];

      setRatings(mockRatings);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRatings = ratings.filter(rating => {
    if (filter === 'all') return true;
    return rating.member_type === filter;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < rating ? 'text-warning' : 'text-muted'}`}
      ></i>
    ));
  };

  if (loading) {
    return (
      <CitizenProtectedRoute>
        <div className="container py-5">
            <div className="text-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
              </div>
              <p className="mt-3 text-muted">جاري تحميل التقييمات...</p>
            </div>
          </div>
      </CitizenProtectedRoute>
    );
  }

  return (
    <CitizenProtectedRoute>
      {/* قسم العنوان */}
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
                      تقييماتي
                    </h2>
                    <p className="text-muted mb-0">إدارة تقييماتك للنواب والمرشحين</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 text-end">
                <span className="badge bg-success fs-6 px-3 py-2">
                  <i className="fas fa-star me-2"></i>
                  {ratings.length} تقييم
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* الفلاتر */}
        <section className="py-4">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="card border-0 shadow-sm" style={{borderRadius: '12px'}}>
                  <div className="card-body p-4">
                    <div className="row align-items-center">
                      <div className="col-lg-6">
                        <h5 className="mb-0" style={{color: '#004705'}}>
                          <i className="fas fa-filter me-2"></i>
                          تصفية التقييمات
                        </h5>
                      </div>
                      <div className="col-lg-6">
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            className={`btn ${filter === 'all' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => setFilter('all')}
                          >
                            الكل ({ratings.length})
                          </button>
                          <button
                            className={`btn ${filter === 'member' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => setFilter('member')}
                          >
                            النواب ({ratings.filter(r => r.member_type === 'member').length})
                          </button>
                          <button
                            className={`btn ${filter === 'candidate' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => setFilter('candidate')}
                          >
                            المرشحين ({ratings.filter(r => r.member_type === 'candidate').length})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* قائمة التقييمات */}
        <section className="py-4">
          <div className="container">
            {filteredRatings.length > 0 ? (
              <div className="row g-4">
                {filteredRatings.map((rating) => (
                  <div key={rating.id} className="col-lg-6">
                    <div className="card border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="flex-grow-1">
                            <h6 className="fw-bold mb-1" style={{color: '#004705'}}>
                              {rating.member_name}
                            </h6>
                            <div className="d-flex align-items-center mb-2">
                              <span className={`badge ${rating.member_type === 'member' ? 'bg-primary' : 'bg-info'} me-2`}>
                                {rating.member_type === 'member' ? 'نائب' : 'مرشح'}
                              </span>
                              <small className="text-muted">{rating.governorate}</small>
                            </div>
                            <small className="text-muted">{rating.party}</small>
                          </div>
                          <div className="text-end">
                            <div className="mb-1">
                              {renderStars(rating.rating)}
                            </div>
                            <small className="text-muted">
                              {new Date(rating.created_at).toLocaleDateString('ar-EG')}
                            </small>
                          </div>
                        </div>
                        
                        {rating.comment && (
                          <div className="bg-light rounded p-3 mb-3">
                            <small className="text-muted d-block mb-1">تعليقك:</small>
                            <p className="mb-0 small">{rating.comment}</p>
                          </div>
                        )}

                        <div className="d-flex gap-2">
                          <button className="btn btn-outline-primary btn-sm flex-fill">
                            <i className="fas fa-edit me-1"></i>
                            تعديل التقييم
                          </button>
                          <button className="btn btn-outline-danger btn-sm">
                            <i className="fas fa-trash me-1"></i>
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="mb-4">
                  <i className="fas fa-star fs-1 text-muted"></i>
                </div>
                <h5 className="text-muted mb-3">لا توجد تقييمات</h5>
                <p className="text-muted mb-4">
                  {filter === 'all' 
                    ? 'لم تقم بتقييم أي نائب أو مرشح بعد'
                    : filter === 'member'
                    ? 'لم تقم بتقييم أي نائب بعد'
                    : 'لم تقم بتقييم أي مرشح بعد'
                  }
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <a href="/members" className="btn btn-success">
                    <i className="fas fa-users me-2"></i>
                    تصفح النواب
                  </a>
                  <a href="/candidates" className="btn btn-outline-success">
                    <i className="fas fa-user-plus me-2"></i>
                    تصفح المرشحين
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* إحصائيات سريعة */}
        {ratings.length > 0 && (
          <section className="py-4" style={{backgroundColor: '#f8f9fa'}}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="card border-0 shadow-sm" style={{borderRadius: '12px'}}>
                    <div className="card-body p-4">
                      <h6 className="fw-bold mb-3" style={{color: '#004705'}}>
                        <i className="fas fa-chart-bar me-2"></i>
                        إحصائيات التقييمات
                      </h6>
                      <div className="row g-4">
                        <div className="col-lg-3 col-md-6 text-center">
                          <div className="mb-2">
                            <i className="fas fa-star fs-3" style={{color: '#fba505'}}></i>
                          </div>
                          <h5 className="fw-bold mb-1">
                            {(ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)}
                          </h5>
                          <small className="text-muted">متوسط تقييماتك</small>
                        </div>
                        <div className="col-lg-3 col-md-6 text-center">
                          <div className="mb-2">
                            <i className="fas fa-users fs-3 text-primary"></i>
                          </div>
                          <h5 className="fw-bold mb-1">
                            {ratings.filter(r => r.member_type === 'member').length}
                          </h5>
                          <small className="text-muted">نواب مُقيمين</small>
                        </div>
                        <div className="col-lg-3 col-md-6 text-center">
                          <div className="mb-2">
                            <i className="fas fa-user-plus fs-3 text-info"></i>
                          </div>
                          <h5 className="fw-bold mb-1">
                            {ratings.filter(r => r.member_type === 'candidate').length}
                          </h5>
                          <small className="text-muted">مرشحين مُقيمين</small>
                        </div>
                        <div className="col-lg-3 col-md-6 text-center">
                          <div className="mb-2">
                            <i className="fas fa-calendar fs-3 text-success"></i>
                          </div>
                          <h5 className="fw-bold mb-1">
                            {new Date().getFullYear()}
                          </h5>
                          <small className="text-muted">السنة الحالية</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
    </CitizenProtectedRoute>
  );
}
