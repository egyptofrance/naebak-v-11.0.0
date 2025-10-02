'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/_lib/supabase-client';
import type { User } from '@supabase/supabase-js';

// Define a type for our user data for better code quality
type UserProfile = {
  id: string;
  email?: string;
  full_name: string;
  user_type: string;
};

export default function Header() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [visitorCount, setVisitorCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const getActiveUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, user_type')
          .eq('id', authUser.id)
          .single();
        
        if (profile) {
          setUser({ ...profile, email: authUser.email });
        }
      }
      setLoading(false);
    };

    getActiveUser();
    setVisitorCount(Math.floor(Math.random() * 10000) + 50000);

    // This listener is the KEY! It listens for auth changes (login, logout)
    // and updates the state automatically.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        getActiveUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'citizen': return 'مواطن';
      case 'candidate_mp': return 'مرشح لمجلس النواب';
      case 'candidate_senate': return 'مرشح مجلس الشيوخ';
      default: return 'مستخدم';
    }
  };

  // While loading, show a placeholder to prevent layout shift
  if (loading) {
    return <header className="bg-white shadow-sm py-2" style={{ minHeight: '74px' }}></header>;
  }

  return (
    <header className="bg-white shadow-sm py-2">
      <div className="container-fluid">
        <div className="row align-items-center">
          {/* اللوجو */}
          <div className="col-lg-3 col-md-4 col-6">
            <Link href="/" className="text-decoration-none">
              <img 
                src="/images/logo-naebak-green.png" 
                alt="نائبك" 
                className="img-fluid"
                style={{height: '50px', objectFit: 'contain'}}
              />
            </Link>
          </div>
          
          {/* المنيو */}
          <div className="col-lg-6 d-none d-lg-block">
            <nav className="navbar navbar-expand-lg justify-content-center">
              <ul className="navbar-nav">
                <li className="nav-item mx-2"><Link className="nav-link text-dark" href="/">الرئيسية</Link></li>
                <li className="nav-item mx-2"><Link className="nav-link text-dark" href="/members">النواب</Link></li>
                <li className="nav-item mx-2"><Link className="nav-link text-dark" href="/candidates">المرشحين</Link></li>
                <li className="nav-item mx-2"><Link className="nav-link text-dark" href="/contact">اتصل بنا</Link></li>
                <li className="nav-item mx-2"><Link className="nav-link text-dark" href="/about">من نحن</Link></li>
              </ul>
            </nav>
          </div>
          
          {/* الأدوات الجانبية */}
          <div className="col-lg-3 col-md-8 col-6">
            <div className="d-flex align-items-center justify-content-end gap-2 gap-md-3">
              {user ? (
                // USER IS LOGGED IN
                <>
                  <div className="d-none d-md-block text-muted small">{visitorCount.toLocaleString()} زائر</div>
                  <div className="position-relative">
                    <button className="btn btn-sm btn-link text-success p-0" style={{ fontSize: '1.2rem' }}>
                      <i className="fas fa-bell"></i>
                    </button>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>3</span>
                  </div>
                  <Link href="/complaint" className="btn btn-sm fw-bold text-decoration-none d-none d-md-inline-block" style={{ backgroundColor: '#E67514', color: 'black', border: 'none', borderRadius: '6px', fontSize: '0.85rem' }}>
                    تسجيل شكوى
                  </Link>
                  <div className="d-none d-md-flex flex-column align-items-end">
                    <div className="text-success small fw-bold mb-0">
                      {user.full_name?.split(' ')[0] || 'المستخدم'}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {getUserTypeLabel(user.user_type || '')}
                    </div>
                  </div>
                  <div className="dropdown">
                    <button className="btn btn-sm btn-outline-success dropdown-toggle d-flex align-items-center gap-1" type="button" data-bs-toggle="dropdown" style={{ fontSize: '0.85rem' }}>
                      <i className="fas fa-user"></i>
                      <span className="d-none d-md-inline">حسابي</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li className="dropdown-header">
                        <div className="fw-bold">{user.full_name}</div>
                        <div className="text-muted small">{user.email}</div>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      {user.user_type === 'citizen' && (
                        <>
                          <li><Link className="dropdown-item" href="/citizen/dashboard"><i className="fas fa-tachometer-alt me-2"></i>لوحة التحكم</Link></li>
                          <li><Link className="dropdown-item" href="/citizen/profile"><i className="fas fa-user-edit me-2"></i>الملف الشخصي</Link></li>
                          <li><hr className="dropdown-divider" /></li>
                        </>
                      )}
                      <li>
                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                          <i className="fas fa-sign-out-alt me-2"></i>تسجيل الخروج
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                // USER IS A VISITOR
                <>
                  <div className="position-relative d-none d-md-block">
                    <i className="fas fa-bell text-success fs-5"></i>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span>
                  </div>
                  <div className="d-none d-md-block text-muted small">{visitorCount.toLocaleString()} زائر</div>
                  <div className="d-flex gap-2">
                    <Link href="/login" className="btn btn-sm btn-outline-success" style={{ fontSize: '0.85rem' }}>
                      <span className="d-none d-md-inline">تسجيل الدخول</span>
                      <span className="d-md-none">دخول</span>
                    </Link>
                    <Link href="/signup" className="btn btn-sm btn-success" style={{ fontSize: '0.85rem' }}>
                      <span className="d-none d-md-inline">تسجيل جديد</span>
                      <span className="d-md-none">تسجيل</span>
                    </Link>
                  </div>
                  <Link href="/complaint" className="btn btn-sm fw-bold text-decoration-none" style={{ backgroundColor: '#E67514', color: 'black', border: 'none', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <span className="d-none d-md-inline fw-bold">تسجيل شكوى</span>
                    <span className="d-md-none fw-bold">شكوى</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* المنيو للموبايل */}
        <div className="row d-lg-none mt-2">
          <div className="col-12">
            <nav className="navbar navbar-expand">
              <ul className="navbar-nav w-100 justify-content-around small">
                <li className="nav-item"><Link className="nav-link text-dark" href="/">الرئيسية</Link></li>
                <li className="nav-item"><Link className="nav-link text-dark" href="/members">النواب</Link></li>
                <li className="nav-item"><Link className="nav-link text-dark" href="/candidates">المرشحين</Link></li>
                <li className="nav-item"><Link className="nav-link text-dark" href="/contact">اتصل بنا</Link></li>
                <li className="nav-item"><Link className="nav-link text-dark" href="/about">من نحن</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
