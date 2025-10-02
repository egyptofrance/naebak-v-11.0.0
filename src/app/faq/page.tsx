'use client';

import { useState, useEffect } from 'react'

export default function FAQPage() {
  const [visitorCount, setVisitorCount] = useState(0)

  useEffect(() => {
    setVisitorCount(Math.floor(Math.random() * 10000) + 50000)
  }, [])

  return (
    <div>
      {/* الهيدر */}
      <header className="bg-white shadow-sm py-2">
        <div className="container-fluid">
          <div className="row align-items-center">
            {/* اللوجو */}
            <div className="col-lg-3 col-md-4 col-6">
              <img 
                src="/images/logo-naebak-green.png" 
                alt="نائبك" 
                className="img-fluid"
                style={{height: '50px', objectFit: 'contain'}}
              />
            </div>
            
            {/* المنيو - مخفي في الموبايل */}
            <div className="col-lg-6 d-none d-lg-block">
              <nav className="navbar navbar-expand-lg justify-content-center">
                <ul className="navbar-nav">
                  <li className="nav-item mx-2"><a className="nav-link text-dark" href="/">الرئيسية</a></li>
                  <li className="nav-item mx-2"><a className="nav-link text-dark" href="#">النواب</a></li>
                  <li className="nav-item mx-2"><a className="nav-link text-dark" href="#">المرشحين</a></li>
                  <li className="nav-item mx-2"><a className="nav-link text-dark" href="/contact">اتصل بنا</a></li>
                  <li className="nav-item mx-2"><a className="nav-link text-dark" href="/about">من نحن</a></li>
                </ul>
              </nav>
            </div>
            
            {/* الأدوات الجانبية */}
            <div className="col-lg-3 col-md-8 col-6">
              <div className="d-flex align-items-center justify-content-end gap-2 gap-md-3">
                {/* الإشعارات - مخفية في الموبايل الصغير */}
                <div className="position-relative d-none d-md-block">
                  <i className="fas fa-bell text-success fs-5"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span>
                </div>
                
                {/* عداد الزوار - مخفي في الموبايل الصغير */}
                <div className="d-none d-md-block text-muted small">
                  {visitorCount.toLocaleString()} زائر
                </div>
                
                {/* زر تسجيل شكوى */}
                <button 
                  className="btn btn-sm fw-normal"
                  style={{
                    backgroundColor: '#E67514',
                    color: 'black',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.85rem'
                  }}
                >
                  <span className="d-none d-md-inline">تسجيل شكوى</span>
                  <span className="d-md-none">شكوى</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* المنيو للموبايل */}
          <div className="row d-lg-none mt-2">
            <div className="col-12">
              <nav className="navbar navbar-expand">
                <ul className="navbar-nav w-100 justify-content-around small">
                  <li className="nav-item"><a className="nav-link text-dark" href="/">الرئيسية</a></li>
                  <li className="nav-item"><a className="nav-link text-dark" href="#">النواب</a></li>
                  <li className="nav-item"><a className="nav-link text-dark" href="#">المرشحين</a></li>
                  <li className="nav-item"><a className="nav-link text-dark" href="/contact">اتصل بنا</a></li>
                  <li className="nav-item"><a className="nav-link text-dark" href="/about">من نحن</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* البانر الرئيسي */}
      <section 
        className="position-relative"
        style={{
          height: '400px',
          backgroundImage: 'url(/images/sisi-banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
      </section>

      {/* شريط الأخبار المتحرك */}
      <div>
        {/* شريط برتقالي علوي */}
        <div style={{height: '2px', backgroundColor: '#E67514'}}></div>
        
        {/* شريط الأخبار */}
        <div 
          className="py-2 text-white position-relative overflow-hidden"
          style={{backgroundColor: '#212121'}}
        >
          <div className="news-ticker">
            عاجل: انطلاق فعاليات منصة نائبك للتواصل المباشر مع النواب والمرشحين • 
            جديد: إمكانية تسجيل الشكاوى والمقترحات مباشرة للنواب • 
            تحديث: إضافة قسم خاص لمتابعة أداء النواب في البرلمان • 
            إعلان: فتح باب التسجيل لجميع المواطنين المصريين •
          </div>
        </div>
        
        {/* شريط برتقالي سفلي */}
        <div style={{height: '4px', backgroundColor: '#E67514'}}></div>
        
        {/* شريط أسود نهائي */}
        <div style={{height: '2px', backgroundColor: '#212121'}}></div>
      </div>

      {/* قسم الأسئلة الشائعة */}
      <section className="py-5" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="d-flex align-items-center justify-content-center mb-4">
                <img 
                  src="/images/logo-naebak-green.png" 
                  alt="نائبك" 
                  className="me-3"
                  style={{height: '60px', objectFit: 'contain'}}
                />
                <h2 className="fw-bold text-success mb-0">الأسئلة الشائعة</h2>
              </div>
              <div className="card shadow-lg border-0" style={{borderRadius: '12px'}}>
                <div className="card-body p-5">
                  <p className="lead text-muted mb-4">
                    إجابات شاملة على أكثر الأسئلة شيوعاً حول منصة نائبك
                  </p>
                  
                  <div className="text-start">
                    <div className="mb-4">
                      <h5 className="fw-bold text-success">ما هي منصة نائبك؟</h5>
                      <p className="text-muted">
                        منصة نائبك هي أول منصة إلكترونية في مصر للتواصل المباشر بين المواطنين وممثليهم في البرلمان، سواء كانوا نواباً حاليين أو مرشحين للانتخابات.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5 className="fw-bold text-success">كيف يمكنني التسجيل في المنصة؟</h5>
                      <p className="text-muted">
                        يمكنك التسجيل من خلال الصفحة الرئيسية باختيار نوع حسابك (مواطن، نائب، مرشح) وملء البيانات المطلوبة بما في ذلك الرقم القومي للتحقق من الهوية.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5 className="fw-bold text-success">هل المنصة مجانية؟</h5>
                      <p className="text-muted">
                        نعم، منصة نائبك مجانية تماماً لجميع المواطنين المصريين. هدفنا هو تعزيز المشاركة السياسية وليس الربح.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5 className="fw-bold text-success">كيف يمكنني تسجيل شكوى؟</h5>
                      <p className="text-muted">
                        بعد تسجيل الدخول، يمكنك الضغط على زر "تسجيل شكوى" وملء النموذج المطلوب. ستصل شكواك مباشرة للنائب المختص في دائرتك الانتخابية.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5 className="fw-bold text-success">هل بياناتي آمنة؟</h5>
                      <p className="text-muted">
                        نعم، نحن نستخدم أحدث تقنيات التشفير لحماية بياناتك. لا نشارك معلوماتك الشخصية مع أي جهة خارجية دون إذنك الصريح.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button 
                      className="btn btn-lg px-4 py-3 fw-normal"
                      style={{
                        backgroundColor: '#E67514',
                        color: 'black',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    >
                      لديك سؤال آخر؟
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* الفوتر */}
      <footer className="text-white py-4" style={{backgroundColor: '#2E7D32'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4">
              <img 
                src="/images/logo-naebak-white.png" 
                alt="نائبك" 
                className="img-fluid mb-2"
                style={{height: '40px', objectFit: 'contain'}}
              />
            </div>
            <div className="col-md-4 text-center">
              <p className="mb-0 small">© 2024 منصة نائبك. جميع الحقوق محفوظة</p>
            </div>
            <div className="col-md-4">
              <div className="d-flex justify-content-end gap-3">
                <a href="#" className="text-white fs-5"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-white fs-5"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-white fs-5"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-white fs-5"><i className="fab fa-youtube"></i></a>
                <a href="#" className="text-white fs-5"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
