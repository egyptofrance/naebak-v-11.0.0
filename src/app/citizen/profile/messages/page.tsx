'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  sender_type: 'citizen' | 'representative' | 'admin';
  sender_name: string;
  recipient_name: string;
  subject: string;
  content: string;
  created_at: string;
  read_at?: string;
  is_read: boolean;
  thread_id?: number;
  attachment_url?: string;
  priority: 'low' | 'medium' | 'high';
}

interface MessageThread {
  id: number;
  subject: string;
  participant_name: string;
  participant_type: 'representative' | 'admin';
  last_message_at: string;
  unread_count: number;
  messages: Message[];
}

export default function MessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'representatives' | 'admin'>('all');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMessageData, setNewMessageData] = useState({
    recipient_type: 'representative',
    recipient_id: '',
    subject: '',
    content: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedThread?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      // محاكاة تحميل الرسائل من API
      const mockThreads: MessageThread[] = [
        {
          id: 1,
          subject: "استفسار حول الخدمات البلدية",
          participant_name: "د. أحمد محمود",
          participant_type: "representative",
          last_message_at: "2024-01-20T10:30:00Z",
          unread_count: 2,
          messages: [
            {
              id: 1,
              sender_type: "citizen",
              sender_name: "أحمد محمد علي",
              recipient_name: "د. أحمد محمود",
              subject: "استفسار حول الخدمات البلدية",
              content: "السلام عليكم، أريد الاستفسار عن إجراءات تحسين الطرق في منطقتنا.",
              created_at: "2024-01-18T09:00:00Z",
              is_read: true,
              thread_id: 1,
              priority: "medium"
            },
            {
              id: 2,
              sender_type: "representative",
              sender_name: "د. أحمد محمود",
              recipient_name: "أحمد محمد علي",
              subject: "رد: استفسار حول الخدمات البلدية",
              content: "وعليكم السلام، شكراً لتواصلكم. سأقوم بمتابعة الموضوع مع الجهات المختصة وسأرد عليكم قريباً.",
              created_at: "2024-01-19T14:30:00Z",
              is_read: true,
              thread_id: 1,
              priority: "medium"
            },
            {
              id: 3,
              sender_type: "representative",
              sender_name: "د. أحمد محمود",
              recipient_name: "أحمد محمد علي",
              subject: "تحديث حول الخدمات البلدية",
              content: "تم التواصل مع المحافظة وسيتم البدء في أعمال الصيانة خلال الأسبوع القادم.",
              created_at: "2024-01-20T10:30:00Z",
              is_read: false,
              thread_id: 1,
              priority: "high"
            }
          ]
        },
        {
          id: 2,
          subject: "طلب مساعدة في إجراءات إدارية",
          participant_name: "إدارة المنصة",
          participant_type: "admin",
          last_message_at: "2024-01-19T16:45:00Z",
          unread_count: 0,
          messages: [
            {
              id: 4,
              sender_type: "citizen",
              sender_name: "أحمد محمد علي",
              recipient_name: "إدارة المنصة",
              subject: "طلب مساعدة في إجراءات إدارية",
              content: "أحتاج مساعدة في فهم كيفية رفع شكوى رسمية عبر المنصة.",
              created_at: "2024-01-19T15:00:00Z",
              is_read: true,
              thread_id: 2,
              priority: "low"
            },
            {
              id: 5,
              sender_type: "admin",
              sender_name: "إدارة المنصة",
              recipient_name: "أحمد محمد علي",
              subject: "رد: طلب مساعدة في إجراءات إدارية",
              content: "يمكنكم رفع الشكوى من خلال قسم 'إدارة القضايا' في ملفكم الشخصي. إذا احتجتم مساعدة إضافية، لا تترددوا في التواصل معنا.",
              created_at: "2024-01-19T16:45:00Z",
              is_read: true,
              thread_id: 2,
              priority: "low"
            }
          ]
        }
      ];

      setThreads(mockThreads);
      if (mockThreads.length > 0) {
        setSelectedThread(mockThreads[0]);
      }
    } catch (error) {
      console.error('خطأ في تحميل الرسائل:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) return;

    setIsSending(true);
    try {
      const message: Message = {
        id: Date.now(),
        sender_type: "citizen",
        sender_name: "أحمد محمد علي",
        recipient_name: selectedThread.participant_name,
        subject: `رد: ${selectedThread.subject}`,
        content: newMessage,
        created_at: new Date().toISOString(),
        is_read: false,
        thread_id: selectedThread.id,
        priority: "medium"
      };

      // تحديث الرسائل محلياً
      const updatedThread = {
        ...selectedThread,
        messages: [...selectedThread.messages, message],
        last_message_at: message.created_at
      };

      setSelectedThread(updatedThread);
      setThreads(prev => prev.map(t => t.id === selectedThread.id ? updatedThread : t));
      setNewMessage('');

      // هنا سيتم إرسال الرسالة إلى API
      console.log('إرسال رسالة:', message);
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
    } finally {
      setIsSending(false);
    }
  };

  const markAsRead = async (threadId: number) => {
    try {
      // تحديث حالة القراءة محلياً
      setThreads(prev => prev.map(t => 
        t.id === threadId 
          ? { ...t, unread_count: 0, messages: t.messages.map(m => ({ ...m, is_read: true })) }
          : t
      ));

      if (selectedThread?.id === threadId) {
        setSelectedThread(prev => prev ? {
          ...prev,
          unread_count: 0,
          messages: prev.messages.map(m => ({ ...m, is_read: true }))
        } : null);
      }

      // هنا سيتم استدعاء API لتحديث حالة القراءة
    } catch (error) {
      console.error('خطأ في تحديث حالة القراءة:', error);
    }
  };

  const filteredThreads = threads.filter(thread => {
    const matchesSearch = thread.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thread.participant_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' ||
                         (filterType === 'unread' && thread.unread_count > 0) ||
                         (filterType === 'representatives' && thread.participant_type === 'representative') ||
                         (filterType === 'admin' && thread.participant_type === 'admin');

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'أمس';
    } else {
      return date.toLocaleDateString('ar-EG');
    }
  };

  if (isLoading) {
    return (
      <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3 text-muted">جاري تحميل الرسائل...</p>
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
                  <h2 className="fw-bold mb-1" style={{color: '#004705'}}>إدارة الرسائل</h2>
                  <p className="text-muted mb-0">تواصل مع النواب والإدارة</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-end">
              <button 
                className="btn btn-success me-2"
                onClick={() => setShowNewMessageModal(true)}
              >
                <i className="fas fa-plus me-2"></i>
                رسالة جديدة
              </button>
              <a href="/citizen/dashboard" className="btn btn-outline-success">
                <i className="fas fa-arrow-right me-2"></i>
                العودة للوحة التحكم
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الرسائل */}
      <section className="py-4">
        <div className="container-fluid">
          <div className="row" style={{height: '70vh'}}>
            {/* قائمة المحادثات */}
            <div className="col-lg-4 col-md-5">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                <div className="card-header bg-white border-0 p-4">
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="البحث في الرسائل..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="btn-group w-100" role="group">
                    <button
                      className={`btn btn-sm ${filterType === 'all' ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => setFilterType('all')}
                    >
                      الكل
                    </button>
                    <button
                      className={`btn btn-sm ${filterType === 'unread' ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => setFilterType('unread')}
                    >
                      غير مقروءة
                    </button>
                    <button
                      className={`btn btn-sm ${filterType === 'representatives' ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => setFilterType('representatives')}
                    >
                      النواب
                    </button>
                    <button
                      className={`btn btn-sm ${filterType === 'admin' ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => setFilterType('admin')}
                    >
                      الإدارة
                    </button>
                  </div>
                </div>
                <div className="card-body p-0" style={{overflowY: 'auto'}}>
                  {filteredThreads.map(thread => (
                    <div
                      key={thread.id}
                      className={`p-3 border-bottom cursor-pointer ${selectedThread?.id === thread.id ? 'bg-light' : ''}`}
                      onClick={() => {
                        setSelectedThread(thread);
                        if (thread.unread_count > 0) {
                          markAsRead(thread.id);
                        }
                      }}
                      style={{cursor: 'pointer'}}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-1">
                            <h6 className="mb-0 fw-bold text-truncate me-2">
                              {thread.participant_name}
                            </h6>
                            {thread.participant_type === 'representative' && (
                              <span className="badge bg-primary badge-sm">نائب</span>
                            )}
                            {thread.participant_type === 'admin' && (
                              <span className="badge bg-secondary badge-sm">إدارة</span>
                            )}
                          </div>
                          <p className="text-muted small mb-1 text-truncate">
                            {thread.subject}
                          </p>
                          <small className="text-muted">
                            {formatDate(thread.last_message_at)}
                          </small>
                        </div>
                        {thread.unread_count > 0 && (
                          <span className="badge bg-danger rounded-pill">
                            {thread.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* منطقة المحادثة */}
            <div className="col-lg-8 col-md-7">
              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                {selectedThread ? (
                  <>
                    {/* رأس المحادثة */}
                    <div className="card-header bg-white border-0 p-4">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h5 className="mb-1 fw-bold">{selectedThread.participant_name}</h5>
                          <p className="text-muted mb-0">{selectedThread.subject}</p>
                        </div>
                        <div>
                          {selectedThread.participant_type === 'representative' && (
                            <span className="badge bg-primary">نائب</span>
                          )}
                          {selectedThread.participant_type === 'admin' && (
                            <span className="badge bg-secondary">إدارة</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* الرسائل */}
                    <div className="card-body p-4" style={{overflowY: 'auto', maxHeight: '400px'}}>
                      {selectedThread.messages.map(message => (
                        <div
                          key={message.id}
                          className={`mb-3 d-flex ${message.sender_type === 'citizen' ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                          <div
                            className={`p-3 rounded-3 ${
                              message.sender_type === 'citizen'
                                ? 'bg-success text-white'
                                : 'bg-light'
                            }`}
                            style={{maxWidth: '70%'}}
                          >
                            <div className="d-flex align-items-center mb-2">
                              <small className={`fw-medium ${message.sender_type === 'citizen' ? 'text-white-50' : 'text-muted'}`}>
                                {message.sender_name}
                              </small>
                              {message.priority === 'high' && (
                                <i className="fas fa-exclamation-triangle text-warning ms-2"></i>
                              )}
                            </div>
                            <p className="mb-2">{message.content}</p>
                            <small className={`${message.sender_type === 'citizen' ? 'text-white-50' : 'text-muted'}`}>
                              {formatDate(message.created_at)}
                              {!message.is_read && message.sender_type === 'citizen' && (
                                <i className="fas fa-check ms-2"></i>
                              )}
                              {message.is_read && message.sender_type === 'citizen' && (
                                <i className="fas fa-check-double ms-2"></i>
                              )}
                            </small>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* إرسال رسالة جديدة */}
                    <div className="card-footer bg-white border-0 p-4">
                      <div className="input-group">
                        <textarea
                          className="form-control"
                          placeholder="اكتب رسالتك هنا..."
                          rows={2}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                        />
                        <button
                          className="btn btn-success"
                          onClick={sendMessage}
                          disabled={isSending || !newMessage.trim()}
                        >
                          {isSending ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            <i className="fas fa-paper-plane"></i>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="card-body d-flex align-items-center justify-content-center">
                    <div className="text-center text-muted">
                      <i className="fas fa-comments fa-3x mb-3"></i>
                      <h5>اختر محادثة لعرض الرسائل</h5>
                      <p>اختر محادثة من القائمة الجانبية لبدء المراسلة</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* مودال رسالة جديدة */}
      {showNewMessageModal && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">رسالة جديدة</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowNewMessageModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">نوع المستقبل</label>
                    <select
                      className="form-select"
                      value={newMessageData.recipient_type}
                      onChange={(e) => setNewMessageData({...newMessageData, recipient_type: e.target.value})}
                    >
                      <option value="representative">نائب</option>
                      <option value="admin">إدارة المنصة</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">المستقبل</label>
                    <select
                      className="form-select"
                      value={newMessageData.recipient_id}
                      onChange={(e) => setNewMessageData({...newMessageData, recipient_id: e.target.value})}
                    >
                      <option value="">اختر المستقبل</option>
                      {newMessageData.recipient_type === 'representative' && (
                        <>
                          <option value="1">د. أحمد محمود</option>
                          <option value="2">د. فاطمة علي</option>
                          <option value="3">د. محمد حسن</option>
                        </>
                      )}
                      {newMessageData.recipient_type === 'admin' && (
                        <option value="admin">إدارة المنصة</option>
                      )}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">الموضوع</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newMessageData.subject}
                      onChange={(e) => setNewMessageData({...newMessageData, subject: e.target.value})}
                      placeholder="موضوع الرسالة"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">المحتوى</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      value={newMessageData.content}
                      onChange={(e) => setNewMessageData({...newMessageData, content: e.target.value})}
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNewMessageModal(false)}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    // هنا سيتم إرسال الرسالة الجديدة
                    console.log('إرسال رسالة جديدة:', newMessageData);
                    setShowNewMessageModal(false);
                    setNewMessageData({
                      recipient_type: 'representative',
                      recipient_id: '',
                      subject: '',
                      content: ''
                    });
                  }}
                >
                  إرسال
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  );
}
