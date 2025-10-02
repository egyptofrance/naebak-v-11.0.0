'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';

interface ProgramSection {
  id: number;
  title: string;
  content: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  order: number;
}

export default function CandidateProgram() {
  const router = useRouter();
  const [programSections, setProgramSections] = useState<ProgramSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSection, setEditingSection] = useState<ProgramSection | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const categories = [
    'التعليم والتدريب',
    'الصحة والخدمات الطبية',
    'الاقتصاد والاستثمار',
    'البنية التحتية والمواصلات',
    'البيئة والطاقة',
    'الإسكان والتنمية العمرانية',
    'الشباب والرياضة',
    'الثقافة والفنون',
    'الأمن والعدالة',
    'الخدمات الاجتماعية',
    'الزراعة والري',
    'التكنولوجيا والابتكار',
    'السياحة والآثار',
    'حقوق الإنسان',
    'أخرى'
  ];

  useEffect(() => {
    loadProgram();
  }, []);

  const loadProgram = () => {
    try {
      const savedProgram = localStorage.getItem('candidate_program');
      if (savedProgram) {
        setProgramSections(JSON.parse(savedProgram));
      } else {
        // بيانات تجريبية
        const mockProgram: ProgramSection[] = [
          {
            id: 1,
            title: 'تطوير منظومة التعليم',
            content: 'العمل على تحديث المناهج الدراسية وتطوير البنية التحتية للمدارس وتدريب المعلمين على أحدث الطرق التعليمية.',
            category: 'التعليم والتدريب',
            priority: 'high',
            order: 1
          },
          {
            id: 2,
            title: 'تحسين الخدمات الصحية',
            content: 'زيادة عدد المستشفيات والمراكز الطبية وتوفير الأجهزة الطبية الحديثة وتدريب الكوادر الطبية.',
            category: 'الصحة والخدمات الطبية',
            priority: 'high',
            order: 2
          }
        ];
        setProgramSections(mockProgram);
        localStorage.setItem('candidate_program', JSON.stringify(mockProgram));
      }
    } catch (error) {
      console.error('خطأ في تحميل البرنامج:', error);
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
    
    if (!formData.title || !formData.content || !formData.category) {
      setMessage({type: 'error', text: 'يرجى ملء جميع الحقول المطلوبة'});
      return;
    }

    try {
      if (editingSection) {
        // تحديث قسم موجود
        const updatedSections = programSections.map(section =>
          section.id === editingSection.id
            ? { ...section, ...formData }
            : section
        );
        setProgramSections(updatedSections);
        localStorage.setItem('candidate_program', JSON.stringify(updatedSections));
        setMessage({type: 'success', text: 'تم تحديث القسم بنجاح!'});
        setEditingSection(null);
      } else {
        // إضافة قسم جديد
        const newSection: ProgramSection = {
          id: Date.now(),
          ...formData,
          order: programSections.length + 1
        };
        const updatedSections = [...programSections, newSection];
        setProgramSections(updatedSections);
        localStorage.setItem('candidate_program', JSON.stringify(updatedSections));
        setMessage({type: 'success', text: 'تم إضافة القسم بنجاح!'});
      }

      // إعادة تعيين النموذج
      setFormData({
        title: '',
        content: '',
        category: '',
        priority: 'medium'
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('خطأ في حفظ القسم:', error);
      setMessage({type: 'error', text: 'حدث خطأ في حفظ القسم'});
    }
  };

  const handleEdit = (section: ProgramSection) => {
    setFormData({
      title: section.title,
      content: section.content,
      category: section.category,
      priority: section.priority
    });
    setEditingSection(section);
    setShowAddForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا القسم؟')) {
      const updatedSections = programSections.filter(section => section.id !== id);
      setProgramSections(updatedSections);
      localStorage.setItem('candidate_program', JSON.stringify(updatedSections));
      setMessage({type: 'success', text: 'تم حذف القسم بنجاح!'});
    }
  };

  const moveSection = (id: number, direction: 'up' | 'down') => {
    const currentIndex = programSections.findIndex(section => section.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === programSections.length - 1)
    ) {
      return;
    }

    const newSections = [...programSections];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    [newSections[currentIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[currentIndex]];
    
    // تحديث ترقيم الترتيب
    newSections.forEach((section, index) => {
      section.order = index + 1;
    });

    setProgramSections(newSections);
    localStorage.setItem('candidate_program', JSON.stringify(newSections));
  };

  const cancelEdit = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      priority: 'medium'
    });
    setEditingSection(null);
    setShowAddForm(false);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="badge bg-danger">أولوية عالية</span>;
      case 'medium':
        return <span className="badge bg-warning">أولوية متوسطة</span>;
      case 'low':
        return <span className="badge bg-secondary">أولوية منخفضة</span>;
      default:
        return <span className="badge bg-light text-dark">غير محدد</span>;
    }
  };

  const filteredSections = filterCategory === 'all' 
    ? programSections 
    : programSections.filter(section => section.category === filterCategory);

  if (isLoading) {
    return (
      <Layout showBanner={false}>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3 text-muted">جاري تحميل البرنامج الانتخابي...</p>
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
                  <h2 className="fw-bold mb-1" style={{color: '#004705'}}>البرنامج الانتخابي</h2>
                  <p className="text-muted mb-0">إدارة وتحديث برنامجك الانتخابي ووعودك للمواطنين</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-end">
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn btn-success me-2"
              >
                <i className="fas fa-plus me-2"></i>
                إضافة قسم جديد
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

      {/* فلتر الأقسام */}
      <section className="py-3" style={{backgroundColor: '#e9ecef'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-3">
              <h6 className="mb-0 fw-bold">فلترة حسب المجال:</h6>
            </div>
            <div className="col-md-9">
              <select 
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">جميع المجالات ({programSections.length})</option>
                {categories.map((category, index) => {
                  const count = programSections.filter(s => s.category === category).length;
                  return count > 0 ? (
                    <option key={index} value={category}>
                      {category} ({count})
                    </option>
                  ) : null;
                })}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* نموذج إضافة/تعديل القسم */}
      {showAddForm && (
        <section className="py-4" style={{backgroundColor: '#fff3cd'}}>
          <div className="container">
            <div className="card border-0 shadow-sm" style={{borderRadius: '15px'}}>
              <div className="card-header bg-primary text-white" style={{borderRadius: '15px 15px 0 0'}}>
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-file-alt me-2"></i>
                  {editingSection ? 'تعديل القسم' : 'إضافة قسم جديد'}
                </h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label htmlFor="title" className="form-label fw-bold">
                        <i className="fas fa-heading me-2 text-primary"></i>
                        عنوان القسم *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="مثال: تطوير منظومة التعليم"
                        required
                        style={{borderRadius: '10px'}}
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="priority" className="form-label fw-bold">
                        <i className="fas fa-exclamation-circle me-2 text-primary"></i>
                        الأولوية *
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        required
                        style={{borderRadius: '10px'}}
                      >
                        <option value="high">أولوية عالية</option>
                        <option value="medium">أولوية متوسطة</option>
                        <option value="low">أولوية منخفضة</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="category" className="form-label fw-bold">
                        <i className="fas fa-tags me-2 text-primary"></i>
                        المجال *
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
                        <option value="">اختر المجال</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="content" className="form-label fw-bold">
                        <i className="fas fa-align-left me-2 text-primary"></i>
                        محتوى القسم *
                      </label>
                      <textarea
                        className="form-control form-control-lg"
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="اكتب تفاصيل هذا القسم من برنامجك الانتخابي..."
                        rows={6}
                        required
                        style={{borderRadius: '10px'}}
                      ></textarea>
                    </div>

                    <div className="col-12 text-center">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg px-4 me-3"
                        style={{borderRadius: '25px'}}
                      >
                        <i className="fas fa-save me-2"></i>
                        {editingSection ? 'تحديث القسم' : 'حفظ القسم'}
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

      {/* قائمة أقسام البرنامج */}
      <section className="py-5">
        <div className="container">
          {filteredSections.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-file-alt fa-5x text-muted mb-4"></i>
              <h4 className="text-muted mb-3">
                {filterCategory === 'all' ? 'لا توجد أقسام في البرنامج بعد' : `لا توجد أقسام في مجال ${filterCategory}`}
              </h4>
              <p className="text-muted mb-4">ابدأ بإضافة أقسام برنامجك الانتخابي</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn btn-success btn-lg"
                style={{borderRadius: '25px'}}
              >
                <i className="fas fa-plus me-2"></i>
                إضافة أول قسم
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredSections.map((section, index) => (
                <div key={section.id} className="col-12">
                  <div className="card border-0 shadow-sm" style={{borderRadius: '15px'}}>
                    <div className="card-header bg-light border-0" style={{borderRadius: '15px 15px 0 0'}}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="d-flex align-items-center mb-2">
                            <span className="badge bg-info me-2">#{section.order}</span>
                            {getPriorityBadge(section.priority)}
                            <span className="badge bg-success ms-2">{section.category}</span>
                          </div>
                          <h5 className="mb-0 fw-bold" style={{color: '#004705'}}>
                            {section.title}
                          </h5>
                        </div>
                        <div className="d-flex align-items-center">
                          {/* أزرار ترتيب الأقسام */}
                          <div className="btn-group me-2" role="group">
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => moveSection(section.id, 'up')}
                              disabled={index === 0}
                              title="نقل لأعلى"
                            >
                              <i className="fas fa-arrow-up"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => moveSection(section.id, 'down')}
                              disabled={index === filteredSections.length - 1}
                              title="نقل لأسفل"
                            >
                              <i className="fas fa-arrow-down"></i>
                            </button>
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
                                  onClick={() => handleEdit(section)}
                                >
                                  <i className="fas fa-edit me-2"></i>
                                  تعديل
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDelete(section.id)}
                                >
                                  <i className="fas fa-trash me-2"></i>
                                  حذف
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <p className="text-muted mb-0" style={{lineHeight: '1.8', fontSize: '1.1rem'}}>
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* إحصائيات البرنامج */}
      {programSections.length > 0 && (
        <section className="py-5" style={{backgroundColor: '#f8f9fa'}}>
          <div className="container">
            <h4 className="fw-bold mb-4 text-center" style={{color: '#004705'}}>إحصائيات البرنامج الانتخابي</h4>
            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center" style={{borderRadius: '15px'}}>
                  <div className="card-body p-4">
                    <i className="fas fa-file-alt fa-3x text-primary mb-3"></i>
                    <h3 className="fw-bold text-primary mb-2">{programSections.length}</h3>
                    <p className="text-muted mb-0">إجمالي الأقسام</p>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center" style={{borderRadius: '15px'}}>
                  <div className="card-body p-4">
                    <i className="fas fa-exclamation-circle fa-3x text-danger mb-3"></i>
                    <h3 className="fw-bold text-danger mb-2">
                      {programSections.filter(s => s.priority === 'high').length}
                    </h3>
                    <p className="text-muted mb-0">أولوية عالية</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center" style={{borderRadius: '15px'}}>
                  <div className="card-body p-4">
                    <i className="fas fa-tags fa-3x text-success mb-3"></i>
                    <h3 className="fw-bold text-success mb-2">
                      {new Set(programSections.map(s => s.category)).size}
                    </h3>
                    <p className="text-muted mb-0">مجالات مختلفة</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center" style={{borderRadius: '15px'}}>
                  <div className="card-body p-4">
                    <i className="fas fa-chart-line fa-3x text-info mb-3"></i>
                    <h3 className="fw-bold text-info mb-2">
                      {Math.round(programSections.reduce((acc, s) => acc + s.content.length, 0) / programSections.length)}
                    </h3>
                    <p className="text-muted mb-0">متوسط طول القسم</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* نصائح لكتابة برنامج انتخابي فعال */}
      <section className="py-5">
        <div className="container">
          <div className="card border-0 shadow-sm" style={{borderRadius: '15px'}}>
            <div className="card-header bg-success text-white" style={{borderRadius: '15px 15px 0 0'}}>
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-lightbulb me-2"></i>
                نصائح لكتابة برنامج انتخابي فعال
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-bullseye text-success me-3 mt-1 fa-2x"></i>
                    <div>
                      <h6 className="fw-bold">كن محدداً وواضحاً</h6>
                      <p className="small text-muted mb-0">اكتب وعود محددة وقابلة للتحقيق مع جدول زمني واضح</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-users text-warning me-3 mt-1 fa-2x"></i>
                    <div>
                      <h6 className="fw-bold">ركز على احتياجات المواطنين</h6>
                      <p className="small text-muted mb-0">اجعل برنامجك يعكس الاحتياجات الفعلية للمواطنين في دائرتك</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-chart-bar text-primary me-3 mt-1 fa-2x"></i>
                    <div>
                      <h6 className="fw-bold">استخدم الأرقام والإحصائيات</h6>
                      <p className="small text-muted mb-0">ادعم وعودك بالأرقام والإحصائيات لتكون أكثر مصداقية</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
