'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CandidateProfile {
  id: number;
  full_name: string;
  email: string;
  position: 'Parliament Candidate' | 'Senate Candidate';
  governorate: string;
  electoral_district: string;
  whatsapp_number: string;
  phone_number: string;
  electoral_symbol: string;
  electoral_number: string;
  profile_picture?: string;
  profile_completed: boolean;
}

interface Governorate {
  id: number;
  name: string;
  cities: string[];
}

export default function CandidateProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<CandidateProfile>({
    id: 0,
    full_name: '',
    email: '',
    position: 'Parliament Candidate',
    governorate: '',
    electoral_district: '',
    whatsapp_number: '',
    phone_number: '',
    electoral_symbol: '',
    electoral_number: '',
    profile_completed: false
  });

  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const electoralSymbols = [
    'الهلال',
    'النجمة',
    'الشمس',
    'الهرم',
    'النخلة',
    'الميزان',
    'الكتاب',
    'القلم',
    'المصباح',
    'الجسر',
    'السفينة',
    'الطائر',
    'الوردة',
    'الشعلة',
    'المفتاح',
    'البوصلة',
    'الترس',
    'الصاروخ',
    'القطار',
    'الطاحونة'
  ];

  useEffect(() => {
    loadProfileData();
    loadGovernorates();
  }, []);

  const loadGovernorates = async () => {
    try {
      const response = await fetch('/api/governorates');
      if (response.ok) {
        const data = await response.json();
        setGovernorates(data);
      }
    } catch (error) {
      console.error('خطأ في تحميل المحافظات:', error);
    }
  };

  const loadProfileData = async () => {
    try {
      // تحميل بيانات المرشح من localStorage
      const userData = localStorage.getItem('user');
      const candidateProfile = localStorage.getItem('candidate_profile');
      
      if (userData) {
        const user = JSON.parse(userData);
        const candidateData = candidateProfile ? JSON.parse(candidateProfile) : {};
        
        const loadedProfile: CandidateProfile = {
          id: user.id || 1,
          full_name: user.full_name || "مرشح تجريبي",
          email: user.email || "candidate@example.com",
          position: candidateData.position || 'Parliament Candidate',
          governorate: candidateData.governorate || "",
          electoral_district: candidateData.electoral_district || "",
          whatsapp_number: candidateData.whatsapp_number || "",
          phone_number: candidateData.phone_number || user.phone_number || "",
          electoral_symbol: candidateData.electoral_symbol || "",
          electoral_number: candidateData.electoral_number || "",
          profile_completed: candidateData.profile_completed || false
        };

        setProfile(loadedProfile);
      }
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
      setMessage({type: 'error', text: 'حدث خطأ في تحميل البيانات'});
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      // التحقق من صحة البيانات
      if (!profile.full_name || !profile.governorate || !profile.electoral_district || 
          !profile.phone_number || !profile.electoral_symbol || !profile.electoral_number) {
        setMessage({type: 'error', text: 'يرجى ملء جميع الحقول المطلوبة'});
        setIsSaving(false);
        return;
      }

      // التحقق من صحة رقم الهاتف المصري
      const phoneRegex = /^(010|011|012|015)\d{8}$/;
      if (!phoneRegex.test(profile.phone_number)) {
        setMessage({type: 'error', text: 'يرجى إدخال رقم هاتف مصري صحيح'});
        setIsSaving(false);
        return;
      }

      // التحقق من رقم الواتساب إذا تم إدخاله
      if (profile.whatsapp_number && !phoneRegex.test(profile.whatsapp_number)) {
        setMessage({type: 'error', text: 'يرجى إدخال رقم واتساب مصري صحيح'});
        setIsSaving(false);
        return;
      }

      // التحقق من الرقم الانتخابي (يجب أن يكون رقم)
      if (!/^\d+$/.test(profile.electoral_number)) {
        setMessage({type: 'error', text: 'يرجى إدخال رقم انتخابي صحيح (أرقام فقط)'});
        setIsSaving(false);
        return;
      }

      // حفظ البيانات في localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const updatedUser = {
          ...user,
          full_name: profile.full_name,
          profile_completed: true
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // حفظ بيانات المرشح المحددة
      const candidateData = {
        ...profile,
        profile_completed: true,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('candidate_profile', JSON.stringify(candidateData));

      setMessage({type: 'success', text: 'تم حفظ البيانات بنجاح!'});
      
      // تحديث الحالة المحلية
      setProfile(prev => ({ ...prev, profile_completed: true }));

    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
      setMessage({type: 'error', text: 'حدث خطأ في حفظ البيانات'});
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3 text-muted">جاري تحميل البيانات...</p>
          </div>
        </div>
    );
  }

  return (
    {/* قسم الترحيب */}
      <section className="py-4" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center mb-3">
                <img 
                  src="/images/logo-naebak-green.png" 
                  alt="نائبك" 
                  className="me-3"
                  style={{height: '50px', objectFit: 'contain'}}
                />
                <div>
                  <h2 className="fw-bold mb-1" style={{color: '#004705'}}>
                    الملف الشخصي - {profile.position === 'Parliament Candidate' ? 'مرشح مجلس النواب' : 'مرشح مجلس الشيوخ'}
                  </h2>
                  <p className="text-muted mb-0">إدارة البيانات الشخصية والمعلومات الانتخابية</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-end">
              <a href="/candidate/dashboard" className="btn btn-outline-success">
                <i className="fas fa-arrow-right me-2"></i>
                العودة للوحة التحكم
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

      {/* قسم النموذج */}
      <section className="py-5">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* البيانات الأساسية */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                  <div className="card-header bg-success text-white" style={{borderRadius: '15px 15px 0 0'}}>
                    <h5 className="mb-0 fw-bold">
                      <i className="fas fa-user me-2"></i>
                      البيانات الأساسية
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      {/* الاسم الكامل */}
                      <div className="col-12">
                        <label htmlFor="full_name" className="form-label fw-bold">
                          <i className="fas fa-user me-2 text-success"></i>
                          الاسم الكامل *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="full_name"
                          name="full_name"
                          value={profile.full_name}
                          onChange={handleInputChange}
                          required
                          style={{borderRadius: '10px'}}
                        />
                      </div>

                      {/* البريد الإلكتروني */}
                      <div className="col-12">
                        <label htmlFor="email" className="form-label fw-bold">
                          <i className="fas fa-envelope me-2 text-success"></i>
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          name="email"
                          value={profile.email}
                          onChange={handleInputChange}
                          disabled
                          style={{borderRadius: '10px', backgroundColor: '#f8f9fa'}}
                        />
                        <small className="text-muted">لا يمكن تعديل البريد الإلكتروني</small>
                      </div>

                      {/* نوع الترشح */}
                      <div className="col-12">
                        <label htmlFor="position" className="form-label fw-bold">
                          <i className="fas fa-vote-yea me-2 text-success"></i>
                          نوع الترشح *
                        </label>
                        <select
                          className="form-select form-select-lg"
                          id="position"
                          name="position"
                          value={profile.position}
                          onChange={handleInputChange}
                          required
                          style={{borderRadius: '10px'}}
                        >
                          <option value="Parliament Candidate">مرشح مجلس النواب</option>
                          <option value="Senate Candidate">مرشح مجلس الشيوخ</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* البيانات الجغرافية والاتصال */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm h-100" style={{borderRadius: '15px'}}>
                  <div className="card-header bg-primary text-white" style={{borderRadius: '15px 15px 0 0'}}>
                    <h5 className="mb-0 fw-bold">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      البيانات الجغرافية والاتصال
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      {/* المحافظة */}
                      <div className="col-12">
                        <label htmlFor="governorate" className="form-label fw-bold">
                          <i className="fas fa-map me-2 text-primary"></i>
                          المحافظة المرشح فيها *
                        </label>
                        <select
                          className="form-select form-select-lg"
                          id="governorate"
                          name="governorate"
                          value={profile.governorate}
                          onChange={handleInputChange}
                          required
                          style={{borderRadius: '10px'}}
                        >
                          <option value="">اختر المحافظة</option>
                          {governorates.map((gov) => (
                            <option key={gov.id} value={gov.name}>
                              {gov.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* الدائرة الانتخابية */}
                      <div className="col-12">
                        <label htmlFor="electoral_district" className="form-label fw-bold">
                          <i className="fas fa-vote-yea me-2 text-primary"></i>
                          الدائرة الانتخابية *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="electoral_district"
                          name="electoral_district"
                          value={profile.electoral_district}
                          onChange={handleInputChange}
                          placeholder="مثال: الدائرة الأولى"
                          required
                          style={{borderRadius: '10px'}}
                        />
                      </div>

                      {/* رقم الهاتف */}
                      <div className="col-md-6">
                        <label htmlFor="phone_number" className="form-label fw-bold">
                          <i className="fas fa-phone me-2 text-primary"></i>
                          رقم الهاتف *
                        </label>
                        <input
                          type="tel"
                          className="form-control form-control-lg"
                          id="phone_number"
                          name="phone_number"
                          value={profile.phone_number}
                          onChange={handleInputChange}
                          placeholder="01012345678"
                          required
                          style={{borderRadius: '10px'}}
                        />
                      </div>

                      {/* رقم الواتساب */}
                      <div className="col-md-6">
                        <label htmlFor="whatsapp_number" className="form-label fw-bold">
                          <i className="fab fa-whatsapp me-2 text-primary"></i>
                          رقم الواتساب
                        </label>
                        <input
                          type="tel"
                          className="form-control form-control-lg"
                          id="whatsapp_number"
                          name="whatsapp_number"
                          value={profile.whatsapp_number}
                          onChange={handleInputChange}
                          placeholder="01012345678"
                          style={{borderRadius: '10px'}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* البيانات الانتخابية */}
              <div className="col-12 mt-4">
                <div className="card border-0 shadow-sm" style={{borderRadius: '15px'}}>
                  <div className="card-header bg-warning text-dark" style={{borderRadius: '15px 15px 0 0'}}>
                    <h5 className="mb-0 fw-bold">
                      <i className="fas fa-ballot-check me-2"></i>
                      البيانات الانتخابية
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      {/* الرمز الانتخابي */}
                      <div className="col-md-6">
                        <label htmlFor="electoral_symbol" className="form-label fw-bold">
                          <i className="fas fa-star me-2 text-warning"></i>
                          الرمز الانتخابي *
                        </label>
                        <select
                          className="form-select form-select-lg"
                          id="electoral_symbol"
                          name="electoral_symbol"
                          value={profile.electoral_symbol}
                          onChange={handleInputChange}
                          required
                          style={{borderRadius: '10px'}}
                        >
                          <option value="">اختر الرمز الانتخابي</option>
                          {electoralSymbols.map((symbol, index) => (
                            <option key={index} value={symbol}>
                              {symbol}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* الرقم الانتخابي */}
                      <div className="col-md-6">
                        <label htmlFor="electoral_number" className="form-label fw-bold">
                          <i className="fas fa-hashtag me-2 text-warning"></i>
                          الرقم الانتخابي *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="electoral_number"
                          name="electoral_number"
                          value={profile.electoral_number}
                          onChange={handleInputChange}
                          placeholder="مثال: 123"
                          required
                          style={{borderRadius: '10px'}}
                        />
                        <small className="text-muted">أرقام فقط</small>
                      </div>
                    </div>

                    {/* معاينة البيانات الانتخابية */}
                    {profile.electoral_symbol && profile.electoral_number && (
                      <div className="mt-4 p-3 bg-light rounded">
                        <h6 className="fw-bold text-warning mb-2">
                          <i className="fas fa-eye me-2"></i>
                          معاينة البيانات الانتخابية:
                        </h6>
                        <div className="d-flex align-items-center">
                          <div className="me-4">
                            <strong>الرمز:</strong> {profile.electoral_symbol}
                          </div>
                          <div>
                            <strong>الرقم:</strong> {profile.electoral_number}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* أزرار الحفظ */}
              <div className="col-12 mt-4">
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg px-5 py-3 me-3"
                    disabled={isSaving}
                    style={{borderRadius: '25px', minWidth: '200px'}}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        حفظ البيانات
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg px-4 py-3"
                    onClick={() => router.push('/candidate/dashboard')}
                    style={{borderRadius: '25px'}}
                  >
                    <i className="fas fa-times me-2"></i>
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* معلومات إضافية */}
      <section className="py-4" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <div className="card border-0 shadow-sm" style={{borderRadius: '15px'}}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-success mb-3">
                <i className="fas fa-info-circle me-2"></i>
                معلومات مهمة للمرشحين
              </h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-star text-warning me-3 mt-1"></i>
                    <div>
                      <strong>الرمز الانتخابي:</strong>
                      <p className="small text-muted mb-0">يجب أن يكون مطابقاً للرمز المسجل في اللجنة العليا للانتخابات</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-hashtag text-warning me-3 mt-1"></i>
                    <div>
                      <strong>الرقم الانتخابي:</strong>
                      <p className="small text-muted mb-0">الرقم الرسمي المخصص لك في الدائرة الانتخابية</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-phone text-success me-3 mt-1"></i>
                    <div>
                      <strong>أرقام الاتصال:</strong>
                      <p className="small text-muted mb-0">ستكون متاحة للمواطنين للتواصل المباشر معك</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
