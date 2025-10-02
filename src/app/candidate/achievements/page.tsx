'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  image?: string;
}

export default function CandidateAchievements() {
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: ''
  });

  const categories = [
    'تشريعات وقوانين',
    'مشاريع تنموية',
    'خدمات اجتماعية',
    'تعليم وثقافة',
    'صحة وبيئة',
    'اقتصاد واستثمار',
    'بنية تحتية',
    'حقوق الإنسان',
    'شباب ورياضة',
    'أخرى'
  ];

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = () => {
    try {
      const savedAchievements = localStorage.getItem('candidate_achievements');
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      } else {
        // بيانات تجريبية
        const mockAchievements: Achievement[] = [
          {
            id: 1,
            title: 'مشروع قانون تطوير التعليم',
            description: 'تقديم مشروع قانون شامل لتطوير منظومة التعليم في المحافظة',
            date: '2024-01-15',
            category: 'تشريعات وقوانين'
          },
          {
            id: 2,
            title: 'إنشاء مستشفى جديد',
            description: 'الإشراف على إنشاء مستشفى عام جديد بسعة 200 سرير',
            date: '2023-12-10',
            category: 'صحة وبيئة'
          }
        ];
        setAchievements(mockAchievements);
        localStorage.setItem('candidate_achievements', JSON.stringify(mockAchievements));
      }
    } catch (error) {
      console.error('خطأ في تحميل الإنجازات:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.date || !formData.category) {
      setMessage({type: 'error', text: 'يرجى ملء جميع الحقول المطلوبة'});
      return;
    }

    try {
      if (editingAchievement) {
        // تحديث إنجاز موجود
        const updatedAchievements = achievements.map(achievement =>
          achievement.id === editingAchievement.id
            ? { ...achievement, ...formData }
            : achievement
        );
        setAchievements(updatedAchievements);
        localStorage.setItem('candidate_achievements', JSON.stringify(updatedAchievements));
        setMessage({type: 'success', text: 'تم تحديث الإنجاز بنجاح!'});
        setEditingAchievement(null);
      } else {
        // إضافة إنجاز جديد
        const newAchievement: Achievement = {
          id: Date.now(),
          ...formData
        };
        const updatedAchievements = [newAchievement, ...achievements];
        setAchievements(updatedAchievements);
        localStorage.setItem('candidate_achievements', JSON.stringify(updatedAchievements));
        setMessage({type: 'success', text: 'تم إضافة الإنجاز بنجاح!'});
      }

      // إعادة تعيين النموذج
      setFormData({
        title: '',
        description: '',
        date: '',
        category: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('خطأ في حفظ الإنجاز:', error);
      setMessage({type: 'error', text: 'حدث خطأ في حفظ الإنجاز'});
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setFormData({
      title: achievement.title,
      description: achievement.description,
      date: achievement.date,
      category: achievement.category
    });
    setEditingAchievement(achievement);
    setShowAddForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الإنجاز؟')) {
      const updatedAchievements = achievements.filter(achievement => achievement.id !== id);
      setAchievements(updatedAchievements);
      localStorage.setItem('candidate_achievements', JSON.stringify(updatedAchievements));
      setMessage({type: 'success', text: 'تم حذف الإنجاز بنجاح!'});
    }
  };

  const cancelEdit = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      category: ''
    });
    setEditingAchievement(null);
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <Layout showBanner={false}>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3 text-muted">جاري تحميل الإنجازات...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBanner={false}>
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
                  style={{height: '50px', objectFit: 'contain'}}
                />
                <div>
                  <h2 className="fw-bold mb-1" style={{color: '#004705'}}>إدارة الإنجازات</h2>
                  <p className="text-muted mb-0">عرض وإدارة إنجازاتك البرلمانية والمجتمعية</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-end">
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn btn-success me-2"
              >
                <i className="fas fa-plus me-2"></i>
                إضافة إنجاز جديد
              </button>
              <a href="/candidate/dashboard" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-right me-2"></i>
                العودة
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* رسائل التنبيه */}
      {message && (
        <div className="container mt-4">
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
            <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
          </div>
        </div>
      )}

      {/* نموذج إضافة/تعديل الإنجاز */}
      {showAddForm && (
        <section className="py-4" style={{backgroundColor: '#fff3cd'}}>
          <div className="container">
            <div className="card border-0 shadow-sm" style={{borderRadius: '15px'}}>
              <div className="card-header bg-warning text-dark" style={{borderRadius: '15px 15px 0 0'}}>
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-plus me-2"></i>
                  {editingAchievement ? 'تعديل الإنجاز' : 'إضافة إنجاز جديد'}
                </h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label htmlFor="title" className="form-label fw-bold">
                        <i className="fas fa-trophy me-2 text-warning"></i>
                        عنوان الإنجاز *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="مثال: مشروع قانون تطوير التعليم"
                        required
                        style={{borderRadius: '10px'}}
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="category" className="form-label fw-bold">
                        <i className="fas fa-tags me-2 text-warning"></i>
                        التصنيف *
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        style={{borderRadius: '10px'}}
                      >
                        <option value="">اختر التصنيف</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="date" className="form-label fw-bold">
                        <i className="fas fa-calendar me-2 text-warning"></i>
                        تاريخ الإنجاز *
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        style={{borderRadius: '10px'}}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="description" className="form-label fw-bold">
                        <i className="fas fa-align-left me-2 text-warning"></i>
                        وصف الإنجاز *
                      </label>
                      <textarea
                        className="form-control form-control-lg"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="اكتب وصفاً مفصلاً للإنجاز..."
                        rows={4}
                        required
                        style={{borderRadius: '10px'}}
                      ></textarea>
                    </div>

                    <div className="col-12 text-center">
                      <button
                        type="submit"
                        className="btn btn-warning btn-lg px-4 me-3"
                        style={{borderRadius: '25px'}}
                      >
                        <i className="fas fa-save me-2"></i>
                        {editingAchievement ? 'تحديث الإنجاز' : 'حفظ الإنجاز'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg px-4"
                        onClick={cancelEdit}
                        style={{borderRadius: '25px'}}
                      >
                        <i className="fas fa-times me-2"></i>
                        إلغاء
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* قائمة الإنجازات */}
      <section className="py-5">
        <div className="container">
          {achievements.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-trophy fa-5x text-muted mb-4"></i>
              <h4 className="text-muted mb-3">لا توجد إنجازات مضافة بعد</h4>
              <p className="text-muted mb-4">ابدأ بإضافة إنجازاتك البرلمانية والمجتمعية</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn btn-success btn-lg"
                style={{borderRadius: '25px'}}
              >
                <i className="fas fa-plus me-2"></i>
                إضافة أول إنجاز
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="col-lg-6">
                  <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                    <div className="card-header bg-light border-0" style={{borderRadius: '15px 15px 0 0'}}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <span className="badge bg-success mb-2">{achievement.category}</span>
                          <h6 className="mb-0 text-muted">
                            <i className="fas fa-calendar me-2"></i>
                            {new Date(achievement.date).toLocaleDateString('ar-EG')}
                          </h6>
                        </div>
                        <div className="dropdown">
                          <button 
                            className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                            type="button" 
                            data-bs-toggle="dropdown"
                          >
                            <i className="fas fa-ellipsis-v"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button 
                                className="dropdown-item"
                                onClick={() => handleEdit(achievement)}
                              >
                                <i className="fas fa-edit me-2"></i>
                                تعديل
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(achievement.id)}
                              >
                                <i className="fas fa-trash me-2"></i>
                                حذف
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <h5 className="fw-bold mb-3" style={{color: '#004705'}}>
                        <i className="fas fa-trophy me-2 text-warning"></i>
                        {achievement.title}
                      </h5>
                      <p className="text-muted mb-0">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* إحصائيات الإنجازات */}
      {achievements.length > 0 && (
        <section className="py-5" style={{backgroundColor: '#f8f9fa'}}>
          <div className="container">
            <h4 className="fw-bold mb-4 text-center" style={{color: '#004705'}}>إحصائيات الإنجازات</h4>
            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center" style={{borderRadius: '15px'}}>
                  <div className="card-body p-4">
                    <i className="fas fa-trophy fa-3x text-warning mb-3"></i>
                    <h3 className="fw-bold text-warning mb-2">{achievements.length}</h3>
                    <p className="text-muted mb-0">إجمالي الإنجازات</p>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center" style={{borderRadius: '15px'}}>
                  <div className="card-body p-4">
                    <i className="fas fa-tags fa-3x text-info mb-3"></i>
                    <h3 className="fw-bold text-info mb-2">
                      {new Set(achievements.map(a => a.category)).size}
                    </h3>
                    <p className="text-muted mb-0">تصنيفات مختلفة</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center" style={{borderRadius: '15px'}}>
                  <div className="card-body p-4">
                    <i className="fas fa-calendar fa-3x text-success mb-3"></i>
                    <h3 className="fw-bold text-success mb-2">
                      {achievements.filter(a => new Date(a.date).getFullYear() === new Date().getFullYear()).length}
                    </h3>
                    <p className="text-muted mb-0">إنجازات هذا العام</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center" style={{borderRadius: '15px'}}>
                  <div className="card-body p-4">
                    <i className="fas fa-chart-line fa-3x text-primary mb-3"></i>
                    <h3 className="fw-bold text-primary mb-2">
                      {Math.round(achievements.length / 12 * 10) / 10}
                    </h3>
                    <p className="text-muted mb-0">متوسط شهري</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
