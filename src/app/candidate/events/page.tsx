'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export default function CandidateEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: ''
  });

  const eventTypes = [
    'مؤتمر صحفي',
    'لقاء شعبي',
    'ندوة',
    'مؤتمر',
    'ورشة عمل',
    'زيارة ميدانية',
    'اجتماع لجنة',
    'جلسة برلمانية',
    'فعالية خيرية',
    'احتفالية',
    'أخرى'
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    try {
      const savedEvents = localStorage.getItem('candidate_events');
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      } else {
        // بيانات تجريبية
        const mockEvents: Event[] = [
          {
            id: 1,
            title: 'لقاء شعبي حول التعليم',
            description: 'لقاء مفتوح مع المواطنين لمناقشة قضايا التعليم في المحافظة',
            date: '2024-02-15',
            time: '18:00',
            location: 'قاعة المؤتمرات - مجلس المدينة',
            type: 'لقاء شعبي',
            status: 'upcoming'
          },
          {
            id: 2,
            title: 'مؤتمر صحفي حول مشروع المستشفى',
            description: 'إعلان تفاصيل مشروع إنشاء المستشفى الجديد',
            date: '2024-01-20',
            time: '14:00',
            location: 'مقر المحافظة',
            type: 'مؤتمر صحفي',
            status: 'completed'
          }
        ];
        setEvents(mockEvents);
        localStorage.setItem('candidate_events', JSON.stringify(mockEvents));
      }
    } catch (error) {
      console.error('خطأ في تحميل الفعاليات:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventStatus = (date: string, time: string): 'upcoming' | 'ongoing' | 'completed' => {
    const eventDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const eventEndTime = new Date(eventDateTime.getTime() + 2 * 60 * 60 * 1000); // افتراض مدة الفعالية ساعتين

    if (now < eventDateTime) {
      return 'upcoming';
    } else if (now >= eventDateTime && now <= eventEndTime) {
      return 'ongoing';
    } else {
      return 'completed';
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
    
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.type) {
      setMessage({type: 'error', text: 'يرجى ملء جميع الحقول المطلوبة'});
      return;
    }

    try {
      const status = getEventStatus(formData.date, formData.time);

      if (editingEvent) {
        // تحديث فعالية موجودة
        const updatedEvents = events.map(event =>
          event.id === editingEvent.id
            ? { ...event, ...formData, status }
            : event
        );
        setEvents(updatedEvents);
        localStorage.setItem('candidate_events', JSON.stringify(updatedEvents));
        setMessage({type: 'success', text: 'تم تحديث الفعالية بنجاح!'});
        setEditingEvent(null);
      } else {
        // إضافة فعالية جديدة
        const newEvent: Event = {
          id: Date.now(),
          ...formData,
          status
        };
        const updatedEvents = [newEvent, ...events];
        setEvents(updatedEvents);
        localStorage.setItem('candidate_events', JSON.stringify(updatedEvents));
        setMessage({type: 'success', text: 'تم إضافة الفعالية بنجاح!'});
      }

      // إعادة تعيين النموذج
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('خطأ في حفظ الفعالية:', error);
      setMessage({type: 'error', text: 'حدث خطأ في حفظ الفعالية'});
    }
  };

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type
    });
    setEditingEvent(event);
    setShowAddForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الفعالية؟')) {
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);
      localStorage.setItem('candidate_events', JSON.stringify(updatedEvents));
      setMessage({type: 'success', text: 'تم حذف الفعالية بنجاح!'});
    }
  };

  const cancelEdit = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: ''
    });
    setEditingEvent(null);
    setShowAddForm(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="badge bg-primary">قادمة</span>;
      case 'ongoing':
        return <span className="badge bg-success">جارية</span>;
      case 'completed':
        return <span className="badge bg-secondary">مكتملة</span>;
      default:
        return <span className="badge bg-light text-dark">غير محدد</span>;
    }
  };

  const filteredEvents = filterStatus === 'all' 
    ? events 
    : events.filter(event => event.status === filterStatus);

  if (isLoading) {
    return (
      <Layout showBanner={false}>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3 text-muted">جاري تحميل الفعاليات...</p>
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
                  <h2 className="fw-bold mb-1" style={{color: '#004705'}}>إدارة الفعاليات والمؤتمرات</h2>
                  <p className="text-muted mb-0">تنظيم ومتابعة الفعاليات والمؤتمرات التي تحضرها</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-end">
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn btn-success me-2"
              >
                <i className="fas fa-plus me-2"></i>
                إضافة فعالية جديدة
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

      {/* فلتر الفعاليات */}
      <section className="py-3" style={{backgroundColor: '#e9ecef'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h6 className="mb-0 fw-bold">فلترة الفعاليات:</h6>
            </div>
            <div className="col-md-6">
              <div className="btn-group w-100" role="group">
                <button 
                  type="button" 
                  className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilterStatus('all')}
                >
                  الكل ({events.length})
                </button>
                <button 
                  type="button" 
                  className={`btn ${filterStatus === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilterStatus('upcoming')}
                >
                  قادمة ({events.filter(e => e.status === 'upcoming').length})
                </button>
                <button 
                  type="button" 
                  className={`btn ${filterStatus === 'ongoing' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilterStatus('ongoing')}
                >
                  جارية ({events.filter(e => e.status === 'ongoing').length})
                </button>
                <button 
                  type="button" 
                  className={`btn ${filterStatus === 'completed' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setFilterStatus('completed')}
                >
                  مكتملة ({events.filter(e => e.status === 'completed').length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* نموذج إضافة/تعديل الفعالية */}
      {showAddForm && (
        <section className="py-4" style={{backgroundColor: '#fff3cd'}}>
          <div className="container">
            <div className="card border-0 shadow-sm" style={{borderRadius: '15px'}}>
              <div className="card-header bg-info text-white" style={{borderRadius: '15px 15px 0 0'}}>
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-calendar-plus me-2"></i>
                  {editingEvent ? 'تعديل الفعالية' : 'إضافة فعالية جديدة'}
                </h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label htmlFor="title" className="form-label fw-bold">
                        <i className="fas fa-calendar me-2 text-info"></i>
                        عنوان الفعالية *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="مثال: لقاء شعبي حول التعليم"
                        required
                        style={{borderRadius: '10px'}}
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="type" className="form-label fw-bold">
                        <i className="fas fa-tags me-2 text-info"></i>
                        نوع الفعالية *
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                        style={{borderRadius: '10px'}}
                      >
                        <option value="">اختر نوع الفعالية</option>
                        {eventTypes.map((type, index) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="date" className="form-label fw-bold">
                        <i className="fas fa-calendar-day me-2 text-info"></i>
                        تاريخ الفعالية *
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

                    <div className="col-md-4">
                      <label htmlFor="time" className="form-label fw-bold">
                        <i className="fas fa-clock me-2 text-info"></i>
                        وقت الفعالية *
                      </label>
                      <input
                        type="time"
                        className="form-control form-control-lg"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        style={{borderRadius: '10px'}}
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="location" className="form-label fw-bold">
                        <i className="fas fa-map-marker-alt me-2 text-info"></i>
                        مكان الفعالية *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="مثال: قاعة المؤتمرات"
                        required
                        style={{borderRadius: '10px'}}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="description" className="form-label fw-bold">
                        <i className="fas fa-align-left me-2 text-info"></i>
                        وصف الفعالية *
                      </label>
                      <textarea
                        className="form-control form-control-lg"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="اكتب وصفاً مفصلاً للفعالية..."
                        rows={4}
                        required
                        style={{borderRadius: '10px'}}
                      ></textarea>
                    </div>

                    <div className="col-12 text-center">
                      <button
                        type="submit"
                        className="btn btn-info btn-lg px-4 me-3"
                        style={{borderRadius: '25px'}}
                      >
                        <i className="fas fa-save me-2"></i>
                        {editingEvent ? 'تحديث الفعالية' : 'حفظ الفعالية'}
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

      {/* قائمة الفعاليات */}
      <section className="py-5">
        <div className="container">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-calendar-alt fa-5x text-muted mb-4"></i>
              <h4 className="text-muted mb-3">
                {filterStatus === 'all' ? 'لا توجد فعاليات مضافة بعد' : `لا توجد فعاليات ${filterStatus === 'upcoming' ? 'قادمة' : filterStatus === 'ongoing' ? 'جارية' : 'مكتملة'}`}
              </h4>
              <p className="text-muted mb-4">ابدأ بإضافة فعالياتك ومؤتمراتك</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn btn-success btn-lg"
                style={{borderRadius: '25px'}}
              >
                <i className="fas fa-plus me-2"></i>
                إضافة أول فعالية
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredEvents.map((event) => (
                <div key={event.id} className="col-lg-6">
                  <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                    <div className="card-header bg-light border-0" style={{borderRadius: '15px 15px 0 0'}}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="d-flex align-items-center mb-2">
                            {getStatusBadge(event.status)}
                            <span className="badge bg-info ms-2">{event.type}</span>
                          </div>
                          <h6 className="mb-0 text-muted">
                            <i className="fas fa-calendar me-2"></i>
                            {new Date(event.date).toLocaleDateString('ar-EG')} - {event.time}
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
                                onClick={() => handleEdit(event)}
                              >
                                <i className="fas fa-edit me-2"></i>
                                تعديل
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(event.id)}
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
                        <i className="fas fa-calendar-alt me-2 text-info"></i>
                        {event.title}
                      </h5>
                      <p className="text-muted mb-3">{event.description}</p>
                      <div className="d-flex align-items-center text-muted">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* إحصائيات الفعاليات */}
      {events.length > 0 && (
        <section className="py-5" style={{backgroundColor: '#f8f9fa'}}>
          <div className="container">
            <h4 className="fw-bold mb-4 text-center" style={{color: '#004705'}}>إحصائيات الفعاليات</h4>
            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center" style={{borderRadius: '15px'}}>
                  <div className="card-body p-4">
                    <i className="fas fa-calendar-alt fa-3x text-info mb-3"></i>
                    <h3 className="fw-bold text-info mb-2">{events.length}</h3>
                    <p className="text-muted mb-0">إجمالي الفعاليات</p>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center" style={{borderRadius: '15px'}}>
                  <div className="card-body p-4">
                    <i className="fas fa-clock fa-3x text-primary mb-3"></i>
                    <h3 className="fw-bold text-primary mb-2">
                      {events.filter(e => e.status === 'upcoming').length}
                    </h3>
                    <p className="text-muted mb-0">فعاليات قادمة</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center" style={{borderRadius: '15px'}}>
                  <div className="card-body p-4">
                    <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                    <h3 className="fw-bold text-success mb-2">
                      {events.filter(e => e.status === 'completed').length}
                    </h3>
                    <p className="text-muted mb-0">فعاليات مكتملة</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center" style={{borderRadius: '15px'}}>
                  <div className="card-body p-4">
                    <i className="fas fa-tags fa-3x text-warning mb-3"></i>
                    <h3 className="fw-bold text-warning mb-2">
                      {new Set(events.map(e => e.type)).size}
                    </h3>
                    <p className="text-muted mb-0">أنواع مختلفة</p>
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
