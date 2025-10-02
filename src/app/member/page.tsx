'use client';

import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import MessageModal from '../../components/MessageModal'

export default function MemberPage() {
  const [activeTab, setActiveTab] = useState('personal')
  const [achievementsPage, setAchievementsPage] = useState(1)
  const [eventsPage, setEventsPage] = useState(1)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  
  const itemsPerPage = 5

  // بيانات ديمو للإنجازات
  const achievements = [
    {
      id: 1,
      title: "مشروع قانون تطوير التعليم الفني",
      description: "تقديم مشروع قانون شامل لتطوير منظومة التعليم الفني في مصر وربطها بسوق العمل",
      date: "2024-03-15",
      status: "تم الإقرار"
    },
    {
      id: 2,
      title: "مبادرة دعم المشروعات الصغيرة",
      description: "إطلاق مبادرة لدعم المشروعات الصغيرة والمتوسطة في الدائرة الانتخابية",
      date: "2024-02-20",
      status: "قيد التنفيذ"
    },
    {
      id: 3,
      title: "تطوير البنية التحتية للقرى",
      description: "مشروع شامل لتطوير البنية التحتية وشبكات المياه والصرف الصحي",
      date: "2024-01-10",
      status: "مكتمل"
    },
    {
      id: 4,
      title: "برنامج محو الأمية الرقمية",
      description: "إطلاق برنامج تدريبي لمحو الأمية الرقمية للمواطنين في المناطق الريفية",
      date: "2023-12-05",
      status: "مكتمل"
    },
    {
      id: 5,
      title: "مشروع الرعاية الصحية المتنقلة",
      description: "توفير خدمات الرعاية الصحية المتنقلة للمناطق النائية",
      date: "2023-11-15",
      status: "مكتمل"
    },
    {
      id: 6,
      title: "تطوير المدارس الحكومية",
      description: "مشروع تطوير وتجهيز المدارس الحكومية بأحدث التقنيات التعليمية",
      date: "2023-10-20",
      status: "مكتمل"
    },
    {
      id: 7,
      title: "مبادرة الطاقة المتجددة",
      description: "تشجيع استخدام الطاقة الشمسية في المنازل والمؤسسات الحكومية",
      date: "2023-09-10",
      status: "قيد التنفيذ"
    }
  ]

  // بيانات ديمو للمؤتمرات والمناسبات
  const events = [
    {
      id: 1,
      title: "مؤتمر التنمية المستدامة 2024",
      description: "مؤتمر دولي حول التنمية المستدامة والتحديات البيئية",
      date: "2024-04-15",
      location: "مركز المؤتمرات الدولي - القاهرة",
      type: "مؤتمر"
    },
    {
      id: 2,
      title: "لقاء مفتوح مع المواطنين",
      description: "لقاء شهري مفتوح للاستماع لمشاكل واقتراحات المواطنين",
      date: "2024-03-20",
      location: "قاعة المجتمع المحلي - الجيزة",
      type: "لقاء"
    },
    {
      id: 3,
      title: "ندوة حول قانون الاستثمار الجديد",
      description: "ندوة تعريفية بقانون الاستثمار الجديد وأثره على الاقتصاد",
      date: "2024-02-28",
      location: "غرفة التجارة المصرية",
      type: "ندوة"
    },
    {
      id: 4,
      title: "مؤتمر الشباب والمستقبل",
      description: "مؤتمر لمناقشة دور الشباب في بناء مستقبل مصر",
      date: "2024-01-25",
      location: "جامعة القاهرة",
      type: "مؤتمر"
    },
    {
      id: 5,
      title: "ورشة عمل حول التحول الرقمي",
      description: "ورشة عمل متخصصة حول التحول الرقمي في الخدمات الحكومية",
      date: "2023-12-18",
      location: "وزارة الاتصالات وتكنولوجيا المعلومات",
      type: "ورشة عمل"
    },
    {
      id: 6,
      title: "احتفالية يوم المرأة المصرية",
      description: "احتفالية تكريم المرأة المصرية ودورها في التنمية",
      date: "2023-03-21",
      location: "دار الأوبرا المصرية",
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
      <Header />
      
      {/* البانر والصورة الشخصية */}
      <div className="position-relative">
        {/* البانر */}
        <div 
          className="w-100"
          style={{
            height: '300px',
            background: 'linear-gradient(135deg, #004705 0%, #20c997 100%)',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}
        >
          <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-50 text-white p-3">
            <div className="container">
              <div className="row align-items-end">
                <div className="col">
                  <h1 className="h3 fw-bold mb-1">د. أحمد محمد علي</h1>
                  <p className="mb-0">عضو مجلس النواب - دائرة الجيزة الأولى</p>
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
                      color: '#004705'
                    }}
                  >
                    👤
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
                  borderBottom: activeTab === 'personal' ? '3px solid #004705' : '3px solid transparent',
                  color: activeTab === 'personal' ? '#004705' : '#6c757d',
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
                  borderBottom: activeTab === 'achievements' ? '3px solid #004705' : '3px solid transparent',
                  color: activeTab === 'achievements' ? '#004705' : '#6c757d',
                  fontWeight: activeTab === 'achievements' ? 'bold' : 'normal'
                }}
              >
                الإنجازات
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
                style={{
                  border: 'none',
                  borderBottom: activeTab === 'events' ? '3px solid #004705' : '3px solid transparent',
                  color: activeTab === 'events' ? '#004705' : '#6c757d',
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
                  <h4 className="fw-bold fw-bold mb-4">البيانات الشخصية</h4>
                  
                  <div className="row mb-3">
                    <div className="col-12">
                      <label className="form-label fw-bold">الاسم الكامل</label>
                      <p className="text-muted">د. أحمد محمد علي السيد</p>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">المؤهل العلمي</label>
                      <p className="text-muted">دكتوراه في الاقتصاد - جامعة القاهرة</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">المهنة</label>
                      <p className="text-muted">أستاذ الاقتصاد - كلية التجارة</p>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">نوع المجلس</label>
                      <p className="text-muted">مجلس النواب</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">المحافظة</label>
                      <p className="text-muted">الجيزة</p>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">الدائرة الانتخابية</label>
                      <p className="text-muted">الجيزة الأولى</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">تاريخ بداية العضوية</label>
                      <p className="text-muted">15 يناير 2021</p>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-12">
                      <label className="form-label fw-bold">اللجان البرلمانية</label>
                      <p className="text-muted">لجنة الشؤون الاقتصادية، لجنة التعليم والبحث العلمي</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              {/* تقييم النائب */}
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body p-4 text-center">
                  <h5 className="fw-bold fw-bold mb-3">تقييم النائب</h5>
                  <div className="mb-2">
                    <span className="text-warning fs-4">⭐⭐⭐⭐⭐</span>
                  </div>
                  <h4 className="fw-bold fw-bold mb-1">4.8</h4>
                  <p className="text-muted mb-0">4,598 مواطن قاموا بالتقييم</p>
                </div>
              </div>

              {/* إحصائيات الشكاوى */}
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body p-4">
                  <h5 className="fw-bold fw-bold mb-3">إحصائيات الشكاوى</h5>
                  <div className="row text-center mb-3">
                    <div className="col-6">
                      <div className="border-end">
                        <h4 className="fw-bold text-primary">1,247</h4>
                        <small className="text-muted">شكوى مستقبلة</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <h4 className="fw-bold" style={{color: "#004705"}}>1,089</h4>
                      <small className="text-muted">شكوى محلولة</small>
                    </div>
                  </div>
                  <div className="progress mb-2" style={{height: '8px'}}>
                    <div 
                      className="progress-bar" 
                      style={{backgroundColor: "#004705", width: '87.3%'}}
                    ></div>
                  </div>
                  <small className="text-muted">معدل الحل: 87.3%</small>
                </div>
              </div>

              {/* زر التواصل */}
              <div className="d-grid">
                <button 
                  className="btn btn-lg fw-bold py-3 text-white"
                  style={{backgroundColor: '#004705'}}
                  onClick={() => setIsMessageModalOpen(true)}
                >
                  <i className="fas fa-comments me-2"></i>
                  تواصل مع نائبك
                </button>
              </div>
            </div>
          </div>
        )}

        {/* تاب الإنجازات */}
        {activeTab === 'achievements' && (
          <div>
            <h4 className="fw-bold fw-bold mb-4">الإنجازات</h4>
            
            {currentAchievements.map((achievement) => (
              <div key={achievement.id} className="card border-0 shadow-sm mb-3">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold text-dark">{achievement.title}</h5>
                    <span 
                      className={`badge px-3 py-2 ${
                        achievement.status === 'مكتمل' ? 'text-white' :
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
                          backgroundColor: achievementsPage === page ? '#004705' : 'white',
                          borderColor: '#004705',
                          color: achievementsPage === page ? 'white' : '#004705'
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
            <h4 className="fw-bold fw-bold mb-4">المؤتمرات والمناسبات</h4>
            
            {currentEvents.map((event) => (
              <div key={event.id} className="card border-0 shadow-sm mb-3">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold text-dark">{event.title}</h5>
                    <span className="badge bg-info text-dark px-3 py-2">{event.type}</span>
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
                          backgroundColor: eventsPage === page ? '#004705' : 'white',
                          borderColor: '#004705',
                          color: eventsPage === page ? 'white' : '#004705'
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
      </div>

      <Footer />
      
      {/* نافذة إرسال الرسالة */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipientName="د. أحمد محمد علي السيد"
        recipientType="نائب"
      />
    </div>
  );
}
