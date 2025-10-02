'use client';

import { useState, useEffect } from 'react';
import MemberProtectedRoute from '../../../components/MemberProtectedRoute';

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

export default function MemberMessagesPage() {
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
          citizen_name: 'أحمد محمد علي',
          citizen_email: 'ahmed@example.com',
          subject: 'مشكلة في الطرق',
          content: 'السلام عليكم، أريد أن أبلغكم عن مشكلة في طرق منطقة المعادي حيث توجد حفر كبيرة تسبب مشاكل للمواطنين...',
          status: 'unread',
          priority: 'high',
          created_at: '2024-01-15T10:30:00Z',
          governorate: 'القاهرة',
          category: 'البنية التحتية'
        },
        {
          id: 2,
          citizen_name: 'فاطمة حسن إبراهيم',
          citizen_email: 'fatma@example.com',
          subject: 'استفسار عن الخدمات الصحية',
          content: 'أريد أن أستفسر عن الخطة الحكومية لتحسين الخدمات الصحية في المنطقة...',
          status: 'read',
          priority: 'medium',
          created_at: '2024-01-14T14:20:00Z',
          governorate: 'القاهرة',
          category: 'الصحة'
        },
        {
          id: 3,
          citizen_name: 'محمد عبد الرحمن',
          citizen_email: 'mohamed@example.com',
          subject: 'شكوى بخصوص التعليم',
          content: 'لدي شكوى بخصوص نقص المدرسين في مدرسة الحي...',
          status: 'replied',
          priority: 'medium',
          created_at: '2024-01-13T09:15:00Z',
          governorate: 'القاهرة',
          category: 'التعليم'
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
      <MemberProtectedRoute>
        <div className="container py-5">
            <div className="text-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
              </div>
              <p className="mt-3 text-muted">جاري تحميل الرسائل...</p>
            </div>
          </div>
      </MemberProtectedRoute>
    );
  }

  return (
    <MemberProtectedRoute>
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
                    <p className="text-muted mb-0">رسائل المواطنين الواردة إليك</p>
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
    </MemberProtectedRoute>
  );
}
