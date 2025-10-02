'use client';

import { useState, useEffect } from 'react';

interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  assigned_to?: string;
  location?: string;
  attachments?: string[];
  comments?: IssueComment[];
  citizen_id: number;
}

interface IssueComment {
  id: number;
  content: string;
  author_name: string;
  author_type: 'citizen' | 'representative' | 'admin';
  created_at: string;
}

interface IssueCategory {
  id: string;
  name: string;
  icon: string;
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);
  const [showIssueDetails, setShowIssueDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSavingComment, setIsSavingComment] = useState(false);

  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as const,
    location: ''
  });

  const categories: IssueCategory[] = [
    { id: 'infrastructure', name: 'البنية التحتية', icon: 'fas fa-road' },
    { id: 'health', name: 'الصحة', icon: 'fas fa-heartbeat' },
    { id: 'education', name: 'التعليم', icon: 'fas fa-graduation-cap' },
    { id: 'environment', name: 'البيئة', icon: 'fas fa-leaf' },
    { id: 'security', name: 'الأمن', icon: 'fas fa-shield-alt' },
    { id: 'transportation', name: 'المواصلات', icon: 'fas fa-bus' },
    { id: 'utilities', name: 'المرافق', icon: 'fas fa-lightbulb' },
    { id: 'social', name: 'الخدمات الاجتماعية', icon: 'fas fa-users' },
    { id: 'other', name: 'أخرى', icon: 'fas fa-ellipsis-h' }
  ];

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      // محاكاة تحميل القضايا من API
      const mockIssues: Issue[] = [
        {
          id: 1,
          title: "تحسين إضاءة الشوارع في الحي",
          description: "الشوارع في منطقتنا تفتقر للإضاءة الكافية مما يسبب مشاكل أمنية خاصة في المساء. نحتاج لتركيب أعمدة إنارة إضافية.",
          category: "infrastructure",
          priority: "high",
          status: "in_progress",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-18T14:30:00Z",
          assigned_to: "د. أحمد محمود",
          location: "شارع التسعين، التجمع الخامس",
          citizen_id: 1,
          comments: [
            {
              id: 1,
              content: "تم استلام الشكوى وسيتم التواصل مع الجهات المختصة",
              author_name: "د. أحمد محمود",
              author_type: "representative",
              created_at: "2024-01-16T09:00:00Z"
            },
            {
              id: 2,
              content: "تم التواصل مع شركة الكهرباء وسيتم البدء في التنفيذ خلال أسبوعين",
              author_name: "د. أحمد محمود",
              author_type: "representative",
              created_at: "2024-01-18T14:30:00Z"
            }
          ]
        },
        {
          id: 2,
          title: "مشكلة في تصريف مياه الأمطار",
          description: "تتجمع مياه الأمطار في الشارع الرئيسي مما يسبب صعوبة في المرور وأضرار للمحلات التجارية.",
          category: "infrastructure",
          priority: "urgent",
          status: "pending",
          created_at: "2024-01-20T08:30:00Z",
          updated_at: "2024-01-20T08:30:00Z",
          location: "الشارع الرئيسي، الحي الأول",
          citizen_id: 1,
          comments: []
        },
        {
          id: 3,
          title: "نقص في الخدمات الطبية",
          description: "المركز الصحي في المنطقة يفتقر للأطباء المتخصصين والأدوية الأساسية.",
          category: "health",
          priority: "high",
          status: "resolved",
          created_at: "2024-01-10T12:00:00Z",
          updated_at: "2024-01-19T16:00:00Z",
          resolved_at: "2024-01-19T16:00:00Z",
          assigned_to: "د. فاطمة علي",
          location: "المركز الصحي، الحي الثاني",
          citizen_id: 1,
          comments: [
            {
              id: 3,
              content: "تم توفير طبيب متخصص إضافي وتم تجديد مخزون الأدوية",
              author_name: "د. فاطمة علي",
              author_type: "representative",
              created_at: "2024-01-19T16:00:00Z"
            }
          ]
        }
      ];

      setIssues(mockIssues);
    } catch (error) {
      console.error('خطأ في تحميل القضايا:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createIssue = async () => {
    try {
      const issue: Issue = {
        id: Date.now(),
        ...newIssue,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        citizen_id: 1,
        comments: []
      };

      setIssues(prev => [issue, ...prev]);
      setNewIssue({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        location: ''
      });
      setShowNewIssueModal(false);

      // هنا سيتم إرسال القضية إلى API
      console.log('إنشاء قضية جديدة:', issue);
    } catch (error) {
      console.error('خطأ في إنشاء القضية:', error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !selectedIssue) return;

    setIsSavingComment(true);
    try {
      const comment: IssueComment = {
        id: Date.now(),
        content: newComment,
        author_name: "أحمد محمد علي",
        author_type: "citizen",
        created_at: new Date().toISOString()
      };

      const updatedIssue = {
        ...selectedIssue,
        comments: [...(selectedIssue.comments || []), comment],
        updated_at: new Date().toISOString()
      };

      setSelectedIssue(updatedIssue);
      setIssues(prev => prev.map(issue => 
        issue.id === selectedIssue.id ? updatedIssue : issue
      ));
      setNewComment('');

      // هنا سيتم إرسال التعليق إلى API
      console.log('إضافة تعليق:', comment);
    } catch (error) {
      console.error('خطأ في إضافة التعليق:', error);
    } finally {
      setIsSavingComment(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'قيد المراجعة', icon: 'fas fa-clock' },
      in_progress: { class: 'bg-info', text: 'قيد التنفيذ', icon: 'fas fa-cog' },
      resolved: { class: 'bg-success', text: 'تم الحل', icon: 'fas fa-check-circle' },
      closed: { class: 'bg-secondary', text: 'مغلقة', icon: 'fas fa-times-circle' },
      rejected: { class: 'bg-danger', text: 'مرفوضة', icon: 'fas fa-ban' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class}`}>
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { class: 'bg-secondary', text: 'منخفضة' },
      medium: { class: 'bg-primary', text: 'متوسطة' },
      high: { class: 'bg-warning', text: 'عالية' },
      urgent: { class: 'bg-danger', text: 'عاجلة' }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'غير محدد', icon: 'fas fa-question' };
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || issue.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3 text-muted">جاري تحميل القضايا...</p>
          </div>
        </div>
    );
  }

  return (
    {/* قسم الترحيب */}
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
                  <h2 className="fw-bold mb-1" style={{color: '#004705'}}>إدارة القضايا والشكاوى</h2>
                  <p className="text-muted mb-0">متابعة القضايا المرفوعة وإضافة قضايا جديدة</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-end">
              <button 
                className="btn btn-success me-2"
                onClick={() => setShowNewIssueModal(true)}
              >
                <i className="fas fa-plus me-2"></i>
                قضية جديدة
              </button>
              <a href="/citizen/dashboard" className="btn btn-outline-success">
                <i className="fas fa-arrow-right me-2"></i>
                العودة للوحة التحكم
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* إحصائيات سريعة */}
      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="fas fa-list-alt fa-2x text-primary mb-2"></i>
                  <h4 className="fw-bold text-primary">{issues.length}</h4>
                  <p className="text-muted mb-0">إجمالي القضايا</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                  <h4 className="fw-bold text-warning">{issues.filter(i => i.status === 'pending').length}</h4>
                  <p className="text-muted mb-0">قيد المراجعة</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="fas fa-cog fa-2x text-info mb-2"></i>
                  <h4 className="fw-bold text-info">{issues.filter(i => i.status === 'in_progress').length}</h4>
                  <p className="text-muted mb-0">قيد التنفيذ</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                  <h4 className="fw-bold text-success">{issues.filter(i => i.status === 'resolved').length}</h4>
                  <p className="text-muted mb-0">تم الحل</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* فلاتر البحث */}
      <section className="py-4">
        <div className="container">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="البحث في القضايا..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-lg-3">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="pending">قيد المراجعة</option>
                    <option value="in_progress">قيد التنفيذ</option>
                    <option value="resolved">تم الحل</option>
                    <option value="closed">مغلقة</option>
                    <option value="rejected">مرفوضة</option>
                  </select>
                </div>
                <div className="col-lg-3">
                  <select
                    className="form-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">جميع الفئات</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-2">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                      setFilterCategory('all');
                    }}
                  >
                    <i className="fas fa-times me-2"></i>
                    مسح
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قائمة القضايا */}
      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            {filteredIssues.map(issue => {
              const categoryInfo = getCategoryInfo(issue.category);
              return (
                <div key={issue.id} className="col-lg-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <i className={`${categoryInfo.icon} text-primary me-2`}></i>
                          <h6 className="fw-bold mb-0">{issue.title}</h6>
                        </div>
                        {getStatusBadge(issue.status)}
                      </div>
                      
                      <p className="text-muted mb-3" style={{fontSize: '0.9rem'}}>
                        {issue.description.length > 100 
                          ? issue.description.substring(0, 100) + '...'
                          : issue.description
                        }
                      </p>

                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <small className="text-muted">الفئة:</small>
                          <p className="mb-0 fw-medium">{categoryInfo.name}</p>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">الأولوية:</small>
                          <div>{getPriorityBadge(issue.priority)}</div>
                        </div>
                        {issue.location && (
                          <div className="col-12">
                            <small className="text-muted">الموقع:</small>
                            <p className="mb-0 fw-medium">
                              <i className="fas fa-map-marker-alt text-danger me-1"></i>
                              {issue.location}
                            </p>
                          </div>
                        )}
                        {issue.assigned_to && (
                          <div className="col-12">
                            <small className="text-muted">مُسند إلى:</small>
                            <p className="mb-0 fw-medium">
                              <i className="fas fa-user text-success me-1"></i>
                              {issue.assigned_to}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="fas fa-calendar me-1"></i>
                          {formatDate(issue.created_at)}
                        </small>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setSelectedIssue(issue);
                            setShowIssueDetails(true);
                          }}
                        >
                          <i className="fas fa-eye me-1"></i>
                          عرض التفاصيل
                        </button>
                      </div>

                      {issue.comments && issue.comments.length > 0 && (
                        <div className="mt-3 pt-3 border-top">
                          <small className="text-muted">
                            <i className="fas fa-comments me-1"></i>
                            {issue.comments.length} تعليق
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredIssues.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">لا توجد قضايا تطابق البحث</h5>
              <p className="text-muted">جرب تغيير معايير البحث أو إضافة قضية جديدة</p>
            </div>
          )}
        </div>
      </section>

      {/* مودال قضية جديدة */}
      {showNewIssueModal && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>
                  إضافة قضية جديدة
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowNewIssueModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-medium">عنوان القضية *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newIssue.title}
                      onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                      placeholder="اكتب عنوان واضح للقضية"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">الفئة *</label>
                    <select
                      className="form-select"
                      value={newIssue.category}
                      onChange={(e) => setNewIssue({...newIssue, category: e.target.value})}
                    >
                      <option value="">اختر الفئة</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">الأولوية</label>
                    <select
                      className="form-select"
                      value={newIssue.priority}
                      onChange={(e) => setNewIssue({...newIssue, priority: e.target.value as any})}
                    >
                      <option value="low">منخفضة</option>
                      <option value="medium">متوسطة</option>
                      <option value="high">عالية</option>
                      <option value="urgent">عاجلة</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">الموقع</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newIssue.location}
                      onChange={(e) => setNewIssue({...newIssue, location: e.target.value})}
                      placeholder="حدد موقع القضية بالتفصيل"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">وصف القضية *</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      value={newIssue.description}
                      onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                      placeholder="اشرح القضية بالتفصيل..."
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNewIssueModal(false)}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={createIssue}
                  disabled={!newIssue.title || !newIssue.description || !newIssue.category}
                >
                  <i className="fas fa-save me-2"></i>
                  إضافة القضية
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال تفاصيل القضية */}
      {showIssueDetails && selectedIssue && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`${getCategoryInfo(selectedIssue.category).icon} me-2`}></i>
                  {selectedIssue.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowIssueDetails(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="mb-4">
                      <h6 className="fw-bold mb-2">وصف القضية</h6>
                      <p className="text-muted">{selectedIssue.description}</p>
                    </div>

                    {/* التعليقات */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-comments me-2"></i>
                        التعليقات والمتابعة ({selectedIssue.comments?.length || 0})
                      </h6>
                      
                      <div className="border rounded p-3" style={{maxHeight: '300px', overflowY: 'auto'}}>
                        {selectedIssue.comments && selectedIssue.comments.length > 0 ? (
                          selectedIssue.comments.map(comment => (
                            <div key={comment.id} className="mb-3 pb-3 border-bottom">
                              <div className="d-flex align-items-center mb-2">
                                <strong className="me-2">{comment.author_name}</strong>
                                {comment.author_type === 'representative' && (
                                  <span className="badge bg-primary badge-sm">نائب</span>
                                )}
                                {comment.author_type === 'admin' && (
                                  <span className="badge bg-secondary badge-sm">إدارة</span>
                                )}
                                <small className="text-muted ms-auto">
                                  {formatDate(comment.created_at)}
                                </small>
                              </div>
                              <p className="mb-0">{comment.content}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted text-center">لا توجد تعليقات بعد</p>
                        )}
                      </div>

                      {/* إضافة تعليق جديد */}
                      <div className="mt-3">
                        <div className="input-group">
                          <textarea
                            className="form-control"
                            placeholder="اكتب تعليقك أو استفسارك..."
                            rows={2}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <button
                            className="btn btn-success"
                            onClick={addComment}
                            disabled={isSavingComment || !newComment.trim()}
                          >
                            {isSavingComment ? (
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            ) : (
                              <>
                                <i className="fas fa-paper-plane me-1"></i>
                                إرسال
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">معلومات القضية</h6>
                        
                        <div className="mb-3">
                          <small className="text-muted">الحالة</small>
                          <div>{getStatusBadge(selectedIssue.status)}</div>
                        </div>

                        <div className="mb-3">
                          <small className="text-muted">الأولوية</small>
                          <div>{getPriorityBadge(selectedIssue.priority)}</div>
                        </div>

                        <div className="mb-3">
                          <small className="text-muted">الفئة</small>
                          <p className="mb-0 fw-medium">{getCategoryInfo(selectedIssue.category).name}</p>
                        </div>

                        {selectedIssue.location && (
                          <div className="mb-3">
                            <small className="text-muted">الموقع</small>
                            <p className="mb-0 fw-medium">
                              <i className="fas fa-map-marker-alt text-danger me-1"></i>
                              {selectedIssue.location}
                            </p>
                          </div>
                        )}

                        {selectedIssue.assigned_to && (
                          <div className="mb-3">
                            <small className="text-muted">مُسند إلى</small>
                            <p className="mb-0 fw-medium">
                              <i className="fas fa-user text-success me-1"></i>
                              {selectedIssue.assigned_to}
                            </p>
                          </div>
                        )}

                        <div className="mb-3">
                          <small className="text-muted">تاريخ الإنشاء</small>
                          <p className="mb-0 fw-medium">{formatDate(selectedIssue.created_at)}</p>
                        </div>

                        <div className="mb-3">
                          <small className="text-muted">آخر تحديث</small>
                          <p className="mb-0 fw-medium">{formatDate(selectedIssue.updated_at)}</p>
                        </div>

                        {selectedIssue.resolved_at && (
                          <div className="mb-3">
                            <small className="text-muted">تاريخ الحل</small>
                            <p className="mb-0 fw-medium text-success">{formatDate(selectedIssue.resolved_at)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowIssueDetails(false)}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  );
}
