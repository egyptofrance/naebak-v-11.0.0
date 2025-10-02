import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-white py-4" style={{backgroundColor: '#004705'}}>
      <div className="container">
        <div className="row g-4">
          {/* اللوجو والوصف */}
          <div className="col-md-4">
            <img 
              src="/images/logo-naebak-white.png" 
              alt="نائبك" 
              className="img-fluid mb-3"
              style={{height: '50px', objectFit: 'contain'}}
            />
            <p className="small mb-0">
              منصة نائبك - ربط المواطنين بنوابهم ومرشحيهم لتحقيق التواصل الفعال والشفافية
            </p>
          </div>

          {/* روابط سريعة */}
          <div className="col-md-4">
            <h6 className="fw-bold mb-3">روابط سريعة</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/about" className="text-white text-decoration-none small">
                  <i className="fas fa-angle-left me-2"></i>من نحن
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/contact" className="text-white text-decoration-none small">
                  <i className="fas fa-angle-left me-2"></i>اتصل بنا
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/faq" className="text-white text-decoration-none small">
                  <i className="fas fa-angle-left me-2"></i>أسئلة شائعة
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/privacy" className="text-white text-decoration-none small">
                  <i className="fas fa-angle-left me-2"></i>سياسة الخصوصية
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/terms" className="text-white text-decoration-none small">
                  <i className="fas fa-angle-left me-2"></i>شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>

          {/* وسائل التواصل */}
          <div className="col-md-4">
            <h6 className="fw-bold mb-3">تابعنا</h6>
            <div className="d-flex gap-3 mb-3">
              <a href="#" className="text-white" style={{fontSize: '1.5rem'}}>
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-white" style={{fontSize: '1.5rem'}}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white" style={{fontSize: '1.5rem'}}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white" style={{fontSize: '1.5rem'}}>
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-white" style={{fontSize: '1.5rem'}}>
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
            <p className="small mb-0">
              <i className="fas fa-envelope me-2"></i>info@naebak.com
            </p>
            <p className="small mb-0">
              <i className="fas fa-phone me-2"></i>+20 123 456 7890
            </p>
          </div>
        </div>

        {/* حقوق النشر */}
        <hr className="my-3" style={{borderColor: 'rgba(255,255,255,0.2)'}} />
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 small">
              © 2025 منصة نائبك - جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
