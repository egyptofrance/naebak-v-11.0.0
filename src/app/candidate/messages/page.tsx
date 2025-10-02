'use client';

import { useState, useEffect } from 'react';
import CandidateProtectedRoute from '../../../components/CandidateProtectedRoute';

interface Message {
  id: number;
  citizen_name: string;
  citizen_email: string;
  subject: string;
  content: string;
  status: 'unread' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  governorate: string;
  category: string;
}

export default function CandidateMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      // محاكاة بيانات الرسائل - ستحتاج لتعديلها حسب قاعدة البيانات الفعلية
      const mockMessages: Message[] = [
        {
          id: 1,
          citizen_name: 'سارة أحمد محمد',
          citizen_email: 'sara@example.com',
          subject: 'استفسار عن برنامجك الانتخابي',
          content: 'السلام عليكم، أريد أن أستفسر عن خططك لتحسين التعليم في المنطقة إذا تم انتخابك...',
          status: 'unread',
          priority: 'high',
          created_at: '2024-01-15T10:30:00Z',
          governorate: 'القاهرة',
          category: 'البرنامج الانتخابي'
        },
        {
          id: 2,
          citizen_name: 'خالد عبد الله',
          citizen_email: 'khaled@example.com',
          subject: 'دعم لحملتك الانتخابية',
          content: 'أريد أن أعبر عن دعمي لحملتك الانتخابية وأسأل عن كيفية المشاركة في الحملة...',
          status: 'read',
          priority: 'medium',
          created_at: '2024-01-14T14:20:00Z',
          governorate: 'القاهرة',
          category: 'الدعم والمشاركة'
        },
        {
          id: 3,
          citizen_name: 'نور الدين حسن',
          citizen_email: 'nour@example.com',
          subject: 'اقتراح لتطوير المنطقة',
          content: 'لدي اقتراح لتطوير منطقة المعادي من خلال إنشاء حديقة عامة...',
          status: 'replied',
          priority: 'medium',
          created_at: '2024-01-13T09:15:00Z',
          governorate: 'القاهرة',
          category: 'التطوير والاقتراحات'
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <span className="badge bg-danger">غير مقروءة</span>;
      case 'read':
        return <span className="badge bg-warning">مقروءة</span>;
      case 'replied':
        return <span className="badge bg-success">تم الرد</span>;
      default:
        return <span className="badge bg-secondary">غير محدد</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="badge bg-danger">عالية</span>;
      case 'medium':
        return <span className="badge bg-warning">متوسطة</span>;
      case 'low':
        return <span className="badge bg-info">منخفضة</span>;
      default:
        return <span className="badge bg-secondary">غير محدد</span>;
    }
  };

  const handleMarkAsRead = async (messageId: number) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' as const } : msg
    ));
  };

  const handleReply = (message: Message) => {
    setSelectedMessage(message);
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (selectedMessage && replyText.trim()) {
      // هنا ستضع كود إرسال الرد الفعلي
      setMessages(messages.map(msg => 
        msg.id === selectedMessage.id ? { ...msg, status: 'replied' as const } : msg
      ));
      setShowReplyModal(false);
      setReplyText('');
      setSelectedMessage(null);
    }
  };

  if (loading) {
    return (
      <CandidateProtectedRoute>
        <div className="container py-5">
            <div className="text-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
              </div>
              <p className="mt-3 text-muted">جاري تحميل الرسائل...</p>
            </div>
          </div>
      </CandidateProtectedRoute>
    );
  }

  return (
    <CandidateProtectedRoute>
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
                      إدارة الرسائل
                    </h2>
                    <p className="text-muted mb-0">رسائل المواطنين الواردة إليك كمرشح</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 text-end">
                <div className="d-flex gap-2 justify-content-end">
                  <span className="badge bg-danger fs-6 px-3 py-2">
                    <i className="fas fa-envelope me-2"></i>
                    {messages.filter(m => m.status === 'unread').length} غير مقروءة
                  </span>
                  <span className="badge bg-success fs-6 px-3 py-2">
                    <i className="fas fa-check me-2"></i>
                    {messages.filter(m => m.status === 'replied').length} تم الرد
                  </span>
                </div>
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
                          تصفية الرسائل
                        </h5>
                      </div>
                      <div className="col-lg-6">
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            className={`btn ${filter === 'all' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => setFilter('all')}
                          >
                            الكل ({messages.length})
                          </button>
                          <button
                            className={`btn ${filter === 'unread' ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => setFilter('unread')}
                          >
                            غير مقروءة ({messages.filter(m => m.status === 'unread').length})
                          </button>
                          <button
                            className={`btn ${filter === 'read' ? 'btn-warning' : 'btn-outline-warning'}`}
                            onClick={() => setFilter('read')}
                          >
                            مقروءة ({messages.filter(m => m.status === 'read').length})
                          </button>
                          <button
                            className={`btn ${filter === 'replied' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => setFilter('replied')}
                          >
                            تم الرد ({messages.filter(m => m.status === 'replied').length})
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

        {/* قائمة الرسائل */}
        <section className="py-4">
          <div className="container">
            {filteredMessages.length > 0 ? (
              <div className="row g-4">
                {filteredMessages.map((message) => (
                  <div key={message.id} className="col-12">
                    <div className={`card border-0 shadow-sm ${message.status === 'unread' ? 'border-start border-danger border-3' : ''}`} style={{borderRadius: '12px'}}>
                      <div className="card-body p-4">
                        <div className="row">
                          <div className="col-lg-8">
                            <div className="d-flex align-items-center mb-3">
                              <div className="flex-grow-1">
                                <h6 className="fw-bold mb-1" style={{color: '#004705'}}>
                                  {message.subject}
                                </h6>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <small className="text-muted">
                                    <i className="fas fa-user me-1"></i>
                                    {message.citizen_name}
                                  </small>
                                  <small className="text-muted">
                                    <i className="fas fa-envelope me-1"></i>
                                    {message.citizen_email}
                                  </small>
                                  <small className="text-muted">
                                    <i className="fas fa-map-marker-alt me-1"></i>
                                    {message.governorate}
                                  </small>
                                </div>
                                <div className="d-flex align-items-center gap-2 mb-3">
                                  {getStatusBadge(message.status)}
                                  {getPriorityBadge(message.priority)}
                                  <span className="badge bg-info">{message.category}</span>
                                </div>
                                <p className="text-muted mb-0 small">
                                  {message.content.length > 150 
                                    ? `${message.content.substring(0, 150)}...` 
                                    : message.content
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 text-end">
                            <div className="mb-3">
                              <small className="text-muted">
                                <i className="fas fa-calendar me-1"></i>
                                {new Date(message.created_at).toLocaleDateString('ar-EG')}
                              </small>
                              <br />
                              <small className="text-muted">
                                <i className="fas fa-clock me-1"></i>
                                {new Date(message.created_at).toLocaleTimeString('ar-EG')}
                              </small>
                            </div>
                            <div className="d-flex flex-column gap-2">
                              {message.status === 'unread' && (
                                <button 
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleMarkAsRead(message.id)}
                                >
                                  <i className="fas fa-eye me-1"></i>
                                  تحديد كمقروءة
                                </button>
                              )}
                              {message.status !== 'replied' && (
                                <button 
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleReply(message)}
                                >
                                  <i className="fas fa-reply me-1"></i>
                                  رد على الرسالة
                                </button>
                              )}
                              <button className="btn btn-outline-info btn-sm">
                                <i className="fas fa-eye me-1"></i>
                                عرض التفاصيل
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="mb-4">
                  <i className="fas fa-inbox fs-1 text-muted"></i>
                </div>
                <h5 className="text-muted mb-3">لا توجد رسائل</h5>
                <p className="text-muted mb-4">
                  {filter === 'all' 
                    ? 'لم تتلق أي رسائل من المواطنين بعد'
                    : filter === 'unread'
                    ? 'لا توجد رسائل غير مقروءة'
                    : filter === 'read'
                    ? 'لا توجد رسائل مقروءة'
                    : 'لا توجد رسائل تم الرد عليها'
                  }
                </p>
                <div className="alert alert-info">
                  <i className="fas fa-lightbulb me-2"></i>
                  <strong>نصيحة:</strong> تفاعل مع رسائل المواطنين بانتظام لبناء الثقة وكسب الأصوات في الانتخابات.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* نافذة الرد */}
        {showReplyModal && selectedMessage && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" style={{color: '#004705'}}>
                    رد على رسالة: {selectedMessage.subject}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowReplyModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <strong>من:</strong> {selectedMessage.citizen_name} ({selectedMessage.citizen_email})
                  </div>
                  <div className="mb-3">
                    <strong>الرسالة الأصلية:</strong>
                    <div className="bg-light p-3 rounded mt-2">
                      {selectedMessage.content}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="replyText" className="form-label">
                      <strong>ردك:</strong>
                    </label>
                    <textarea
                      id="replyText"
                      className="form-control"
                      rows={5}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="اكتب ردك هنا..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowReplyModal(false)}
                  >
                    إلغاء
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    <i className="fas fa-paper-plane me-2"></i>
                    إرسال الرد
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* إحصائيات سريعة */}
        {messages.length > 0 && (
          <section className="py-4" style={{backgroundColor: '#f8f9fa'}}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="card border-0 shadow-sm" style={{borderRadius: '12px'}}>
                    <div className="card-body p-4">
                      <h6 className="fw-bold mb-3" style={{color: '#004705'}}>
                        <i className="fas fa-chart-bar me-2"></i>
                        إحصائيات الرسائل
                      </h6>
                      <div className="row g-4">
                        <div className="col-lg-3 col-md-6 text-center">
                          <div className="mb-2">
                            <i className="fas fa-envelope fs-3 text-primary"></i>
                          </div>
                          <h5 className="fw-bold mb-1">{messages.length}</h5>
                          <small className="text-muted">إجمالي الرسائل</small>
                        </div>
                        <div className="col-lg-3 col-md-6 text-center">
                          <div className="mb-2">
                            <i className="fas fa-envelope-open fs-3 text-warning"></i>
                          </div>
                          <h5 className="fw-bold mb-1">
                            {messages.filter(m => m.status === 'read').length}
                          </h5>
                          <small className="text-muted">رسائل مقروءة</small>
                        </div>
                        <div className="col-lg-3 col-md-6 text-center">
                          <div className="mb-2">
                            <i className="fas fa-reply fs-3 text-success"></i>
                          </div>
                          <h5 className="fw-bold mb-1">
                            {messages.filter(m => m.status === 'replied').length}
                          </h5>
                          <small className="text-muted">تم الرد عليها</small>
                        </div>
                        <div className="col-lg-3 col-md-6 text-center">
                          <div className="mb-2">
                            <i className="fas fa-percentage fs-3" style={{color: '#fba505'}}></i>
                          </div>
                          <h5 className="fw-bold mb-1">
                            {messages.length > 0 ? Math.round((messages.filter(m => m.status === 'replied').length / messages.length) * 100) : 0}%
                          </h5>
                          <small className="text-muted">معدل الرد</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
    </CandidateProtectedRoute>
  );
}
