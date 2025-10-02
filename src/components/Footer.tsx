export default function Footer() {
  return (
    <footer className="text-white py-4" style={{backgroundColor: '#004705'}}>
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
  );
}
