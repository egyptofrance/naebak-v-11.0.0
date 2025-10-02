'use client'

import { useState } from 'react'
import MessageModal from '../../components/MessageModal'

export default function CandidatePage() {{
  const [activeTab, setActiveTab] = useState('personal')
  const [achievementsPage, setAchievementsPage] = useState(1)
  const [eventsPage, setEventsPage] = useState(1)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  
  const itemsPerPage = 5

  // بيانات ديمو للإنجازات (للمرشح)
  const achievements = [
    {
      id: 1,
      title: "مبادرة تطوير التعليم في القرى",
      description: "إطلاق مبادرة شخصية لتطوير المدارس الريفية وتوفير التقنيات الحديثة للطلاب",
      date: "2024-02-10",
      status: "مكتمل"
    },
    {
      id: 2,
      title: "برنامج دعم الأسر المحتاجة",
      description: "تنظيم برنامج خيري لدعم الأسر المحتاجة في الدائرة الانتخابية",
      date: "2024-01-15",
      status: "مستمر"
    },
    {
      id: 3,
      title: "مشروع توفير المياه النظيفة",
      description: "العمل على توفير المياه النظيفة للقرى النائية من خلال حفر الآبار",
      date: "2023-12-20",
      status: "مكتمل"
    },
    {
      id: 4,
      title: "حملة التوعية الصحية",
      description: "تنظيم حملات توعية صحية وقوافل طبية مجانية للمواطنين",
      date: "2023-11-25",
      status: "مكتمل"
    },
    {
      id: 5,
      title: "مبادرة تشغيل الشباب",
      description: "إطلاق مبادرة لتدريب وتشغيل الشباب في مشروعات صغيرة ومتوسطة",
      date: "2023-10-30",
      status: "قيد التنفيذ"
    },
    {
      id: 6,
      title: "برنامج محو الأمية",
      description: "تنظيم فصول محو الأمية للكبار في المراكز الشعبية",
      date: "2023-09-15",
      status: "مكتمل"
    },
    {
      id: 7,
      title: "مشروع تطوير الطرق الريفية",
      description: "المساهمة في تطوير وصيانة الطرق الريفية لتحسين المواصلات",
      date: "2023-08-20",
      status: "مكتمل"
    }
  ]

  // بيانات ديمو للمؤتمرات والمناسبات (للمرشح)
  const events = [
    {
      id: 1,
      title: "مؤتمر الشباب والتنمية",
      description: "مؤتمر لمناقشة دور الشباب في التنمية المحلية والمشاركة السياسية",
      date: "2024-03-25",
      location: "قاعة المؤتمرات - الجيزة",
      type: "مؤتمر"
    },
    {
      id: 2,
      title: "لقاء مفتوح مع الناخبين",
      description: "لقاء دوري مع الناخبين لعرض البرنامج الانتخابي والاستماع للمقترحات",
      date: "2024-03-10",
      location: "النادي الاجتماعي - المنيا",
      type: "لقاء"
    },
    {
      id: 3,
      title: "ندوة حول التنمية الاقتصادية",
      description: "ندوة تثقيفية حول أهمية التنمية الاقتصادية المحلية",
      date: "2024-02-28",
      location: "مركز الشباب - أسيوط",
      type: "ندوة"
    },
    {
      id: 4,
      title: "مؤتمر المرأة والتنمية",
      description: "مؤتمر لمناقشة دور المرأة في التنمية المجتمعية",
      date: "2024-02-14",
      location: "قصر الثقافة - سوهاج",
      type: "مؤتمر"
    },
    {
      id: 5,
      title: "ورشة عمل للمشروعات الصغيرة",
      description: "ورشة تدريبية لتعليم الشباب كيفية إقامة المشروعات الصغيرة",
      date: "2024-01-30",
      location: "مركز التدريب المهني - قنا",
      type: "ورشة عمل"
    },
    {
      id: 6,
      title: "احتفالية تكريم المتفوقين",
      description: "احتفالية لتكريم الطلاب المتفوقين في الدائرة الانتخابية",
      date: "2023-06-15",
      location: "المدرسة الثانوية - الأقصر",
      type: "احتفالية"
    }
  ]

  // حساب الصفحات
  const totalAchievements = achievements.length
  const totalAchievementPages = Math.ceil(totalAchievements / itemsPerPage)
  const currentAchievements = achievements.slice(
    (achievementsPage - 1) * itemsPerPage,
    achievementsPage * itemsPerPage
  )

  const totalEvents = events.length
  const totalEventPages = Math.ceil(totalEvents / itemsPerPage)
  const currentEvents = events.slice(
    (eventsPage - 1) * itemsPerPage,
    eventsPage * itemsPerPage
  )

  return (
    <div>
      {/* البانر والصورة الشخصية */}
      <div className="position-relative">
        {/* البانر */}
        <div 
          className="w-100"
          style={{
            height: '300px',
            background: 'linear-gradient(135deg, #E67514 0%, #ffc107 100%)',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpolygon points="30 0 60 30 30 60 0 30"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}
        >
          <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-50 text-white p-3">
            <div className="container">
              <div className="row align-items-end">
                <div className="col">
                  <h1 className="h3 fw-bold mb-1">م. سارة أحمد محمود</h1>
                  <p className="mb-0">مرشحة مجلس النواب - دائرة المنيا الثانية</p>
                </div>
                <div className="col-auto">
                  {/* الصورة الشخصية - ناحية اليسار */}
                  <div 
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center border border-4 border-white"
                    style={{
                      width: '150px',
                      height: '150px',
                      marginBottom: '-75px',
                      fontSize: '60px',
                      color: '#E67514'
                    }}
                  >
                    👩‍💼
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* مساحة فارغة للصورة الشخصية */}
        <div style={{height: '75px', backgroundColor: '#f8f9fa'}}></div>
      </div>

      {/* التابات */}
      <div className="bg-white border-bottom">
        <div className="container">
          <ul className="nav nav-tabs border-0 pt-3">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
                style={{
                  border: 'none',
                  borderBottom: activeTab === 'personal' ? '3px solid #E67514' : '3px solid transparent',
                  color: activeTab === 'personal' ? '#E67514' : '#6c757d',
                  fontWeight: activeTab === 'personal' ? 'bold' : 'normal'
                }}
              >
                البيانات الشخصية
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'achievements' ? 'active' : ''}`}
                onClick={() => setActiveTab('achievements')}
                style={{
                  border: 'none',
                  borderBottom: activeTab === 'achievements' ? '3px solid #E67514' : '3px solid transparent',
                  color: activeTab === 'achievements' ? '#E67514' : '#6c757d',
                  fontWeight: activeTab === 'achievements' ? 'bold' : 'normal'
                }}
              >
                الإنجازات
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'program' ? 'active' : ''}`}
                onClick={() => setActiveTab('program')}
                style={{
                  border: 'none',
                  borderBottom: activeTab === 'program' ? '3px solid #E67514' : '3px solid transparent',
                  color: activeTab === 'program' ? '#E67514' : '#6c757d',
                  fontWeight: activeTab === 'program' ? 'bold' : 'normal'
                }}
              >
                البرنامج الانتخابي
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
                style={{
                  border: 'none',
                  borderBottom: activeTab === 'events' ? '3px solid #E67514' : '3px solid transparent',
                  color: activeTab === 'events' ? '#E67514' : '#6c757d',
                  fontWeight: activeTab === 'events' ? 'bold' : 'normal'
                }}
              >
                المؤتمرات والمناسبات
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* محتوى التابات */}
      <div className="container py-4">
        
        {/* تاب البيانات الشخصية */}
        {activeTab === 'personal' && (
          <div className="row">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4" style={{color: '#495057'}}>البيانات الشخصية</h4>
                  
                  <div className="row mb-3">
                    <div className="col-12">
                      <label className="form-label fw-bold">الاسم الكامل</label>
                      <p className="text-muted">م. سارة أحمد محمود إبراهيم</p>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">المؤهل العلمي</label>
                      <p className="text-muted">بكالوريوس هندسة مدنية - جامعة المنيا</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">المهنة</label>
                      <p className="text-muted">مهندسة مدنية - مقاولات</p>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">نوع المجلس</label>
                      <p className="text-muted">مجلس النواب</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">المحافظة</label>
                      <p className="text-muted">المنيا</p>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">الدائرة الانتخابية</label>
                      <p className="text-muted">المنيا الثانية</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">الرمز الانتخابي</label>
                      <p className="text-muted">🌟</p>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">الرقم الانتخابي</label>
                      <p className="text-muted">15</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">الحزب السياسي</label>
                      <p className="text-muted">مستقلة</p>
                    </div>
                  </div>
                </div>
              </div>
              

            </div>
            
            <div className="col-lg-4">
              {/* تقييم المرشح */}
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body p-4 text-center">
                  <h5 className="fw-bold mb-3" style={{color: '#E67514'}}>تقييم المرشح</h5>
                  <div className="mb-2">
                    <span className="text-warning fs-4">⭐⭐⭐⭐⭐</span>
                  </div>
                  <h4 className="fw-bold mb-1" style={{color: '#E67514'}}>4.6</h4>
                  <p className="text-muted mb-0">2,847 مواطن قاموا بالتقييم</p>
                </div>
              </div>

              {/* إحصائيات الشكاوى */}
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3" style={{color: '#E67514'}}>إحصائيات الشكاوى</h5>
                  <div className="row text-center mb-3">
                    <div className="col-6">
                      <div className="border-end">
                        <h4 className="fw-bold text-primary">892</h4>
                        <small className="text-muted">شكوى مستقبلة</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <h4 className="fw-bold text-success">756</h4>
                      <small className="text-muted">شكوى محلولة</small>
                    </div>
                  </div>
                  <div className="progress mb-2" style={{height: '8px'}}>
                    <div 
                      className="progress-bar" 
                      style={{width: '84.8%', backgroundColor: '#E67514'}}
                    ></div>
                  </div>
                  <small className="text-muted">معدل الحل: 84.8%</small>
                </div>
              </div>

              {/* إحصائيات إضافية */}
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3" style={{color: '#E67514'}}>إحصائيات</h5>
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="border-end">
                        <h4 className="fw-bold text-success">7</h4>
                        <small className="text-muted">إنجازات</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <h4 className="fw-bold text-info">6</h4>
                      <small className="text-muted">فعاليات</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* زر التواصل */}
              <div className="d-grid">
                <button 
                  className="btn btn-lg fw-bold py-3" 
                  style={{backgroundColor: '#E67514', color: 'white', border: 'none'}}
                  onClick={() => setIsMessageModalOpen(true)}
                >
                  <i className="fas fa-comments me-2"></i>
                  تواصل مع مرشحك
                </button>
              </div>
            </div>
          </div>
        )}

        {/* تاب الإنجازات */}
        {activeTab === 'achievements' && (
          <div>
            <h4 className="fw-bold mb-4" style={{color: '#E67514'}}>الإنجازات</h4>
            
            {currentAchievements.map((achievement) => (
              <div key={achievement.id} className="card border-0 shadow-sm mb-3">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold text-dark">{achievement.title}</h5>
                    <span 
                      className={`badge px-3 py-2 ${
                        achievement.status === 'مكتمل' ? 'bg-success' :
                        achievement.status === 'مستمر' ? 'bg-info text-dark' :
                        achievement.status === 'قيد التنفيذ' ? 'bg-warning text-dark' :
                        'bg-primary'
                      }`}
                    >
                      {achievement.status}
                    </span>
                  </div>
                  <p className="text-muted mb-2">{achievement.description}</p>
                  <small className="text-muted">
                    <i className="fas fa-calendar me-1"></i>
                    {new Date(achievement.date).toLocaleDateString('ar-EG')}
                  </small>
                </div>
              </div>
            ))}

            {/* Pagination للإنجازات */}
            {totalAchievementPages > 1 && (
              <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                  <li className={`page-item ${achievementsPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setAchievementsPage(achievementsPage - 1)}
                      disabled={achievementsPage === 1}
                    >
                      السابق
                    </button>
                  </li>
                  
                  {Array.from({ length: totalAchievementPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${achievementsPage === page ? 'active' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => setAchievementsPage(page)}
                        style={{
                          backgroundColor: achievementsPage === page ? '#E67514' : 'white',
                          borderColor: '#E67514',
                          color: achievementsPage === page ? 'white' : '#E67514'
                        }}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${achievementsPage === totalAchievementPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setAchievementsPage(achievementsPage + 1)}
                      disabled={achievementsPage === totalAchievementPages}
                    >
                      التالي
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        )}

        {/* تاب المؤتمرات والمناسبات */}
        {activeTab === 'events' && (
          <div>
            <h4 className="fw-bold mb-4" style={{color: '#495057'}}>المؤتمرات والمناسبات</h4>
            
            {currentEvents.map((event) => (
              <div key={event.id} className="card border-0 shadow-sm mb-3">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold text-dark">{event.title}</h5>
                    <span className="badge bg-warning text-dark px-3 py-2">{event.type}</span>
                  </div>
                  <p className="text-muted mb-2">{event.description}</p>
                  <div className="row">
                    <div className="col-md-6">
                      <small className="text-muted">
                        <i className="fas fa-calendar me-1"></i>
                        {new Date(event.date).toLocaleDateString('ar-EG')}
                      </small>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {event.location}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination للمؤتمرات */}
            {totalEventPages > 1 && (
              <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                  <li className={`page-item ${eventsPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setEventsPage(eventsPage - 1)}
                      disabled={eventsPage === 1}
                    >
                      السابق
                    </button>
                  </li>
                  
                  {Array.from({ length: totalEventPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${eventsPage === page ? 'active' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => setEventsPage(page)}
                        style={{
                          backgroundColor: eventsPage === page ? '#E67514' : 'white',
                          borderColor: '#E67514',
                          color: eventsPage === page ? 'white' : '#E67514'
                        }}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${eventsPage === totalEventPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setEventsPage(eventsPage + 1)}
                      disabled={eventsPage === totalEventPages}
                    >
                      التالي
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        )}

        {/* تاب البرنامج الانتخابي */}
        {activeTab === 'program' && (
          <div>
            <h4 className="fw-bold mb-4" style={{color: '#495057'}}>البرنامج الانتخابي</h4>
            
            {/* بنود البرنامج الانتخابي كبلوكات */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold text-dark">🏗️ تطوير البنية التحتية والطرق</h5>
                  <span className="badge bg-primary text-white px-3 py-2">أولوية عالية</span>
                </div>
                <p className="text-muted mb-2">تطوير شبكة الطرق والمواصلات في الدائرة الانتخابية وتحسين البنية التحتية للخدمات الأساسية</p>
                <small className="text-muted">
                  <i className="fas fa-clock me-1"></i>
                  المدة المتوقعة: 4 سنوات
                </small>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold text-dark">🎓 تحسين جودة التعليم وبناء مدارس جديدة</h5>
                  <span className="badge bg-success text-white px-3 py-2">أولوية عالية</span>
                </div>
                <p className="text-muted mb-2">رفع مستوى التعليم من خلال بناء مدارس جديدة وتطوير المناهج وتدريب المعلمين</p>
                <small className="text-muted">
                  <i className="fas fa-clock me-1"></i>
                  المدة المتوقعة: 4 سنوات
                </small>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold text-dark">🏥 تطوير الخدمات الصحية وإنشاء وحدات صحية</h5>
                  <span className="badge bg-danger text-white px-3 py-2">أولوية عالية</span>
                </div>
                <p className="text-muted mb-2">تحسين الخدمات الصحية وإنشاء وحدات صحية جديدة لخدمة المواطنين في المناطق النائية</p>
                <small className="text-muted">
                  <i className="fas fa-clock me-1"></i>
                  المدة المتوقعة: 3 سنوات
                </small>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold text-dark">💼 دعم المشروعات الصغيرة وتشغيل الشباب</h5>
                  <span className="badge bg-warning text-dark px-3 py-2">أولوية متوسطة</span>
                </div>
                <p className="text-muted mb-2">إنشاء صندوق لدعم المشروعات الصغيرة والمتوسطة وتوفير فرص عمل للشباب</p>
                <small className="text-muted">
                  <i className="fas fa-clock me-1"></i>
                  المدة المتوقعة: 2 سنة
                </small>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold text-dark">👩 تمكين المرأة ودعم مشاركتها في التنمية</h5>
                  <span className="badge bg-info text-white px-3 py-2">أولوية متوسطة</span>
                </div>
                <p className="text-muted mb-2">تطوير برامج لتمكين المرأة اقتصادياً واجتماعياً وزيادة مشاركتها في التنمية المحلية</p>
                <small className="text-muted">
                  <i className="fas fa-clock me-1"></i>
                  المدة المتوقعة: 4 سنوات
                </small>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold text-dark">🌱 حماية البيئة والتنمية المستدامة</h5>
                  <span className="badge bg-success text-white px-3 py-2">أولوية متوسطة</span>
                </div>
                <p className="text-muted mb-2">تطوير مشاريع صديقة للبيئة والعمل على التنمية المستدامة في الدائرة الانتخابية</p>
                <small className="text-muted">
                  <i className="fas fa-clock me-1"></i>
                  المدة المتوقعة: 4 سنوات
                </small>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* نافذة إرسال الرسالة */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipientName="م. سارة أحمد محمود"
        recipientType="مرشح"
      />
    </div>
  );
}
