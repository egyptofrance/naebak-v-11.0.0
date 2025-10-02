'use client';

import { useState, useEffect } from 'react'

export default function TermsPage() {
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

      {/* قسم الشروط والأحكام */}
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
                <h2 className="fw-bold text-success mb-0">الشروط والأحكام</h2>
              </div>
              <div className="card shadow-lg border-0" style={{borderRadius: '12px'}}>
                <div className="card-body p-5">
                  <p className="lead text-muted mb-4">
                    شروط وأحكام استخدام منصة نائبك للتواصل مع ممثليك في البرلمان
                  </p>
                  <p className="text-muted small mb-4">آخر تحديث: 27 سبتمبر 2025</p>
                  
                  <div className="text-start">
                    <div className="mb-4">
                      <h5 className="fw-bold text-success">مقدمة</h5>
                      <p className="text-muted">
                        مرحباً بك في منصة نائبك، المنصة الإلكترونية الرائدة في مصر للتواصل بين المواطنين وممثليهم في البرلمان. 
                        باستخدامك لهذه المنصة، فإنك توافق على الالتزام بالشروط والأحكام المنصوص عليها أدناه.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5 className="fw-bold text-success">شروط الاستخدام</h5>
                      <ul className="text-muted">
                        <li>يجب أن تكون مواطناً مصرياً وتبلغ من العمر 18 عاماً على الأقل</li>
                        <li>يجب تقديم معلومات صحيحة ودقيقة عند التسجيل</li>
                        <li>يجب الحفاظ على سرية بيانات حسابك وعدم مشاركتها مع الآخرين</li>
                        <li>استخدام المنصة للأغراض المشروعة والقانونية فقط</li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h5 className="fw-bold text-success">الاستخدام المحظور</h5>
                      <p className="text-muted">
                        يُحظر استخدام المنصة لنشر محتوى مسيء أو مخالف للقانون أو الآداب العامة، 
                        أو نشر معلومات مضللة، أو انتهاك خصوصية الآخرين.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5 className="fw-bold text-success">حقوق الملكية الفكرية</h5>
                      <p className="text-muted">
                        جميع المحتويات الموجودة على المنصة محمية بموجب قوانين حقوق الطبع والنشر والملكية الفكرية. 
                        تحتفظ بحقوق المحتوى الذي تنشره على المنصة.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5 className="fw-bold text-success">المسؤولية</h5>
                      <p className="text-muted">
                        المنصة تعمل كوسيط للتواصل ولا تتحمل مسؤولية المحتوى المنشور من قبل المستخدمين. 
                        أنت مسؤول عن دقة المعلومات المقدمة والمحتوى الذي تنشره.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5 className="fw-bold text-success">القانون المطبق</h5>
                      <p className="text-muted">
                        تخضع هذه الشروط والأحكام للقوانين المصرية. في حالة نشوء أي نزاع، 
                        تكون المحاكم المصرية هي المختصة بالنظر في النزاع.
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
                      أوافق على الشروط والأحكام
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
