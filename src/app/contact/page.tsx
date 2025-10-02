'use client';


export default function ContactPage() {
  return (
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
                <h2 className="fw-bold text-success mb-0">اتصل بنا</h2>
              </div>
              <p className="lead text-muted">
                نحن هنا للاستماع إليك ومساعدتك في أي استفسار أو مقترح
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* محتوى الصفحة */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            {/* نموذج الاتصال */}
            <div className="col-lg-8 mb-5">
              <div className="card shadow-lg border-0" style={{borderRadius: '12px'}}>
                <div className="card-header text-white text-center py-3" style={{backgroundColor: '#004705', borderRadius: '12px 12px 0 0'}}>
                  <h4 className="mb-0">أرسل لنا رسالة</h4>
                </div>
                <div className="card-body p-4">
                  <form>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold" style={{color: '#004705'}}>الاسم الكامل</label>
                        <input type="text" className="form-control form-control-lg" required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold" style={{color: '#004705'}}>البريد الإلكتروني</label>
                        <input type="email" className="form-control form-control-lg" required />
                      </div>
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold" style={{color: '#004705'}}>رقم الهاتف</label>
                        <input type="tel" className="form-control form-control-lg" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold" style={{color: '#004705'}}>نوع الاستفسار</label>
                        <select className="form-select form-select-lg">
                          <option value="">اختر نوع الاستفسار</option>
                          <option value="complaint">شكوى</option>
                          <option value="suggestion">اقتراح</option>
                          <option value="technical">مشكلة تقنية</option>
                          <option value="general">استفسار عام</option>
                          <option value="partnership">شراكة</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{color: '#004705'}}>الرسالة</label>
                      <textarea className="form-control" rows={6} placeholder="اكتب رسالتك هنا..." required></textarea>
                    </div>
                    <button type="submit" className="btn btn-lg w-100 text-white" style={{backgroundColor: '#004705'}}>
                      <i className="fas fa-paper-plane me-2"></i>
                      إرسال الرسالة
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* معلومات الاتصال */}
            <div className="col-lg-4">
              <div className="card shadow border-0 mb-4" style={{borderRadius: '12px'}}>
                <div className="card-body p-4 text-center">
                  <div className="mb-3">
                    <i className="fas fa-phone fs-1" style={{color: '#004705'}}></i>
                  </div>
                  <h5 className="fw-bold" style={{color: '#004705'}}>الهاتف</h5>
                  <p className="text-muted">
                    <a href="tel:+201234567890" className="text-decoration-none">+20 123 456 7890</a><br />
                    <a href="tel:+201987654321" className="text-decoration-none">+20 198 765 4321</a>
                  </p>
                </div>
              </div>

              <div className="card shadow border-0" style={{borderRadius: '12px'}}>
                <div className="card-body p-4 text-center">
                  <div className="mb-3">
                    <i className="fas fa-envelope fs-1" style={{color: '#004705'}}></i>
                  </div>
                  <h5 className="fw-bold" style={{color: '#004705'}}>البريد الإلكتروني</h5>
                  <p className="text-muted">
                    <a href="mailto:info@naebak.com" className="text-decoration-none">info@naebak.com</a><br />
                    <a href="mailto:support@naebak.com" className="text-decoration-none">support@naebak.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
