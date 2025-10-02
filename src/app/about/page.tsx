'use client';

import Layout from '../../components/Layout'

export default function AboutPage() {
  return (
    <Layout showBanner={true}>

      {/* قسم الترحيب */}
      <section className="py-4" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <img 
                  src="/images/logo-naebak-green.png" 
                  alt="نائبك" 
                  className="me-3"
                  style={{height: '60px', objectFit: 'contain'}}
                />
                <h2 className="fw-bold mb-0" style={{color: '#004705'}}>من نحن</h2>
              </div>
              <p className="lead text-muted">
                شركة نائبك ذات المسؤولية المحدودة - رائدة في التكنولوجيا السياسية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* المحتوى الرئيسي */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              
              {/* من نحن */}
              <div className="mb-5">
                <h3 className="fw-bold mb-4" style={{color: '#004705'}}>من نحن</h3>
                <p className="fs-5 lh-lg text-dark">
                  شركة نائبك ذات المسؤولية المحدودة هي شركة مصرية متخصصة في تطوير المنصات الرقمية التي تهدف إلى إثراء الحياة السياسية في مصر وتعزيز التواصل بين المواطنين وممثليهم المنتخبين. تأسست الشركة بهدف تحقيق التحول الرقمي في العملية الديمقراطية المصرية وبناء جسور التواصل الفعال بين جميع أطراف العملية السياسية.
                </p>
              </div>

              {/* الرؤية والرسالة */}
              <div className="row mb-5">
                <div className="col-lg-6 mb-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <h4 className="fw-bold mb-0" style={{color: '#004705'}}>رؤيتنا</h4>
                      </div>
                      <p className="text-dark lh-lg">
                        أن نكون الشركة الرائدة في مصر والمنطقة العربية في مجال التكنولوجيا السياسية، ونساهم في بناء مجتمع ديمقراطي فعال يشارك فيه كل مواطن بصوته وآرائه في صناعة مستقبل الوطن.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-6 mb-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <h4 className="fw-bold text-primary mb-0">رسالتنا</h4>
                      </div>
                      <p className="text-dark lh-lg">
                        تطوير وتقديم حلول تقنية مبتكرة تمكن المواطنين من المشاركة الفعالة في الحياة السياسية، وتسهل التواصل مع النواب والمرشحين، وتعزز الشفافية والمساءلة في العمل البرلماني والحزبي.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* الأهداف */}
              <div className="mb-5">
                <h3 className="fw-bold mb-4 text-center" style={{color: '#004705'}}>أهدافنا</h3>
                <div className="row">
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="text-center">
                      <div className="bg-light rounded-circle p-4 d-inline-flex mb-3" style={{width: '80px', height: '80px', alignItems: 'center', justifyContent: 'center'}}>
                        <span className="fs-2" style={{color: '#004705'}}>📈</span>
                      </div>
                      <h5 className="fw-bold">إثراء الحياة السياسية</h5>
                      <p className="text-muted">تطوير التكنولوجيا لخدمة العملية السياسية في مصر</p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="text-center">
                      <div className="bg-light rounded-circle p-4 d-inline-flex mb-3" style={{width: '80px', height: '80px', alignItems: 'center', justifyContent: 'center'}}>
                        <span className="fs-2" style={{color: '#004705'}}>🤝</span>
                      </div>
                      <h5 className="fw-bold">تحقيق التواصل</h5>
                      <p className="text-muted">بناء جسور التواصل بين المواطنين والنواب</p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="text-center">
                      <div className="bg-light rounded-circle p-4 d-inline-flex mb-3" style={{width: '80px', height: '80px', alignItems: 'center', justifyContent: 'center'}}>
                        <span className="fs-2" style={{color: '#004705'}}>👥</span>
                      </div>
                      <h5 className="fw-bold">تفعيل دور المواطن</h5>
                      <p className="text-muted">تمكين المواطنين من المشاركة في الحياة الحزبية</p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="text-center">
                      <div className="bg-light rounded-circle p-4 d-inline-flex mb-3" style={{width: '80px', height: '80px', alignItems: 'center', justifyContent: 'center'}}>
                        <span className="fs-2" style={{color: '#004705'}}>🛡️</span>
                      </div>
                      <h5 className="fw-bold">تعزيز الشفافية</h5>
                      <p className="text-muted">ضمان الشفافية والمساءلة في العمل البرلماني</p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="text-center">
                      <div className="bg-light rounded-circle p-4 d-inline-flex mb-3" style={{width: '80px', height: '80px', alignItems: 'center', justifyContent: 'center'}}>
                        <span className="fs-2" style={{color: '#004705'}}>📋</span>
                      </div>
                      <h5 className="fw-bold">تسهيل الشكاوى</h5>
                      <p className="text-muted">تبسيط عملية تقديم الشكاوى والمقترحات</p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="text-center">
                      <div className="bg-light rounded-circle p-4 d-inline-flex mb-3" style={{width: '80px', height: '80px', alignItems: 'center', justifyContent: 'center'}}>
                        <span className="fs-2" style={{color: '#004705'}}>🗳️</span>
                      </div>
                      <h5 className="fw-bold">دعم الديمقراطية</h5>
                      <p className="text-muted">تعزيز الديمقراطية الرقمية في المجتمع المصري</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* القيم */}
              <div className="mb-5">
                <h3 className="fw-bold mb-4 text-center" style={{color: '#004705'}}>قيمنا</h3>
                <div className="row">
                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center p-4">
                        <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3" style={{width: '60px', height: '60px', alignItems: 'center', justifyContent: 'center'}}>
                          <span className="text-warning fs-3">💡</span>
                        </div>
                        <h5 className="fw-bold text-warning">الشفافية</h5>
                        <p className="text-muted small">نؤمن بالشفافية الكاملة في جميع عملياتنا</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center p-4">
                        <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3" style={{width: '60px', height: '60px', alignItems: 'center', justifyContent: 'center'}}>
                          <span className="text-info fs-3">🚀</span>
                        </div>
                        <h5 className="fw-bold text-info">الابتكار</h5>
                        <p className="text-muted small">نسعى للابتكار المستمر في حلولنا التقنية</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center p-4">
                        <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3" style={{width: '60px', height: '60px', alignItems: 'center', justifyContent: 'center'}}>
                          <span className="text-danger fs-3">❤️</span>
                        </div>
                        <h5 className="fw-bold text-danger">المسؤولية</h5>
                        <p className="text-muted small">نتحمل مسؤوليتنا تجاه المجتمع والوطن</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center p-4">
                        <div className="rounded-circle p-3 d-inline-flex mb-3" style={{width: '60px', height: '60px', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 71, 5, 0.1)'}}>
                          <span className="fs-3" style={{color: '#004705'}}>⭐</span>
                        </div>
                        <h5 className="fw-bold" style={{color: '#004705'}}>التميز</h5>
                        <p className="text-muted small">نسعى للتميز في كل ما نقدمه من خدمات</p>
                      </div>
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
