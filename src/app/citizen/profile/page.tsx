'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CitizenProtectedRoute from '../../../components/CitizenProtectedRoute';

interface CitizenProfile {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  whatsapp_number?: string;
  national_id?: string;
  birth_date?: string;
  gender?: string;
  governorate: string;
  governorate_name?: string;
  city?: string;
  village?: string;
  profile_completed?: boolean;
  profile_picture?: string;
}

interface Governorate {
  id: number;
  name: string;
}

export default function CitizenProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<CitizenProfile>({
    id: 0,
    full_name: '',
    email: '',
    phone_number: '',
    whatsapp_number: '',
    national_id: '',
    birth_date: '',
    gender: '',
    governorate: '',
    city: '',
    village: '',
    profile_completed: false
  });

  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    loadProfileData();
    loadGovernorates();
  }, []);

  const loadProfileData = async () => {
    try {
      // تحميل بيانات المستخدم من localStorage
      const userData = localStorage.getItem('user');
      const citizenProfile = localStorage.getItem('citizen_profile');
      
      if (userData) {
        const user = JSON.parse(userData);
        const citizenData = citizenProfile ? JSON.parse(citizenProfile) : {};
        
        const loadedProfile: CitizenProfile = {
          id: user.id || 1,
          full_name: user.full_name || "مستخدم تجريبي",
          email: user.email || "demo@example.com",
          phone_number: citizenData.phone_number || user.phone_number || "",
          whatsapp_number: citizenData.whatsapp_number || "",
          national_id: user.national_id || "",
          birth_date: user.birth_date || "",
          gender: user.gender || "",
          governorate: citizenData.governorate || user.governorate || "",
          city: citizenData.city || "",
          village: citizenData.village || "",
          profile_completed: citizenData.profile_completed || false
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

  const loadGovernorates = async () => {
    try {
      // محاكاة تحميل المحافظات من API
      const mockGovernorates: Governorate[] = [
        {id: 1, name: "القاهرة"},
        {id: 2, name: "الجيزة"},
        {id: 3, name: "الإسكندرية"},
        {id: 4, name: "الدقهلية"},
        {id: 5, name: "البحر الأحمر"},
        {id: 6, name: "البحيرة"},
        {id: 7, name: "الفيوم"},
        {id: 8, name: "الغربية"},
        {id: 9, name: "الإسماعيلية"},
        {id: 10, name: "المنوفية"},
        {id: 11, name: "المنيا"},
        {id: 12, name: "القليوبية"},
        {id: 13, name: "الوادي الجديد"},
        {id: 14, name: "شمال سيناء"},
        {id: 15, name: "جنوب سيناء"},
        {id: 16, name: "الشرقية"},
        {id: 17, name: "سوهاج"},
        {id: 18, name: "السويس"},
        {id: 19, name: "أسوان"},
        {id: 20, name: "أسيوط"},
        {id: 21, name: "بني سويف"},
        {id: 22, name: "بورسعيد"},
        {id: 23, name: "دمياط"},
        {id: 24, name: "الأقصر"},
        {id: 25, name: "مطروح"},
        {id: 26, name: "قنا"},
        {id: 27, name: "كفر الشيخ"}
      ];

      setGovernorates(mockGovernorates);
    } catch (error) {
      console.error('خطأ في تحميل المحافظات:', error);
    }
  };

  const handleInputChange = (field: keyof CitizenProfile, value: string | number) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      // محاكاة حفظ البيانات في API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // هنا سيتم استدعاء API الحقيقي
      console.log('حفظ البيانات:', profile);
      
      setMessage({type: 'success', text: 'تم حفظ البيانات بنجاح!'});
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
    <CitizenProtectedRoute>
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
                  <h2 className="fw-bold mb-1" style={{color: '#004705'}}>إدارة الملف الشخصي</h2>
                  <p className="text-muted mb-0">تحديث البيانات الشخصية والعنوان</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-end">
              {!profile.profile_completed && (
                <button 
                  onClick={() => router.push('/citizen/profile/complete')}
                  className="btn btn-warning me-2"
                >
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  إكمال الملف الشخصي
                </button>
              )}
              <a href="/citizen/dashboard" className="btn btn-outline-success">
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
              <div className="col-lg-8">
                <div className="card shadow-lg border-0 mb-4" style={{borderRadius: '12px'}}>
                  <div className="card-body p-5">
                    {/* البيانات الشخصية */}
                    <div className="mb-5">
                      <h5 className="fw-bold mb-4 pb-2" style={{color: '#004705', borderBottom: '2px solid #004705'}}>
                        <i className="fas fa-user me-2"></i>
                        البيانات الشخصية
                      </h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">الاسم الكامل *</label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            value={profile.full_name}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">البريد الإلكتروني *</label>
                          <input 
                            type="email" 
                            className="form-control form-control-lg" 
                            value={profile.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">الرقم القومي</label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            placeholder="14 رقم"
                            value={profile.national_id || ''}
                            onChange={(e) => handleInputChange('national_id', e.target.value)}
                            maxLength={14}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">تاريخ الميلاد</label>
                          <input 
                            type="date" 
                            className="form-control form-control-lg"
                            value={profile.birth_date || ''}
                            onChange={(e) => handleInputChange('birth_date', e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">النوع</label>
                          <select 
                            className="form-select form-select-lg"
                            value={profile.gender || ''}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                          >
                            <option value="">اختر النوع</option>
                            <option value="male">ذكر</option>
                            <option value="female">أنثى</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* بيانات الاتصال */}
                    <div className="mb-5">
                      <h5 className="fw-bold mb-4 pb-2" style={{color: '#004705', borderBottom: '2px solid #004705'}}>
                        <i className="fas fa-phone me-2"></i>
                        بيانات الاتصال
                      </h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">رقم الهاتف *</label>
                          <input 
                            type="tel" 
                            className="form-control form-control-lg" 
                            placeholder="01012345678"
                            value={profile.phone_number}
                            onChange={(e) => handleInputChange('phone_number', e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">رقم الواتساب</label>
                          <input 
                            type="tel" 
                            className="form-control form-control-lg" 
                            placeholder="01012345678"
                            value={profile.whatsapp_number || ''}
                            onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* العنوان بالتفصيل */}
                    <div className="mb-5">
                      <h5 className="fw-bold mb-4 pb-2" style={{color: '#004705', borderBottom: '2px solid #004705'}}>
                        <i className="fas fa-map-marker-alt me-2"></i>
                        العنوان بالتفصيل
                      </h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">المحافظة *</label>
                          <select 
                            className="form-select form-select-lg"
                            value={profile.governorate}
                            onChange={(e) => handleInputChange('governorate', e.target.value)}
                            required
                          >
                            <option value="">اختر المحافظة</option>
                            {governorates.map(gov => (
                              <option key={gov.id} value={gov.id}>{gov.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">المدينة</label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            value={profile.city || ''}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">المركز</label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            value={profile.city || ''}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">الحي</label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            value={profile.village || ''}
                            onChange={(e) => handleInputChange('village', e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">القرية</label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            value={profile.village || ''}
                            onChange={(e) => handleInputChange('village', e.target.value)}
                          />
                        </div>


                      </div>
                    </div>

                    {/* أزرار الحفظ */}
                    <div className="text-center">
                      <button 
                        type="submit" 
                        className="btn btn-success btn-lg px-5 py-3 me-3"
                        disabled={isSaving}
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
                      <a 
                        href="/citizen/dashboard"
                        className="btn btn-outline-secondary btn-lg px-5 py-3"
                      >
                        <i className="fas fa-times me-2"></i>
                        إلغاء
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* الشريط الجانبي */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm mb-4" style={{borderRadius: '12px'}}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3" style={{color: '#004705'}}>
                      <i className="fas fa-info-circle me-2"></i>
                      معلومات مهمة
                    </h6>
                    <div className="alert alert-info">
                      <small>
                        <i className="fas fa-lightbulb me-2"></i>
                        تأكد من صحة جميع البيانات المدخلة، خاصة رقم الهاتف والبريد الإلكتروني لضمان التواصل معك.
                      </small>
                    </div>
                    <div className="alert alert-warning">
                      <small>
                        <i className="fas fa-shield-alt me-2"></i>
                        جميع بياناتك محمية ولن يتم مشاركتها مع أطراف خارجية.
                      </small>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm" style={{borderRadius: '12px'}}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3" style={{color: '#004705'}}>
                      <i className="fas fa-cogs me-2"></i>
                      إجراءات أخرى
                    </h6>
                    <div className="d-grid gap-2">
                      <a href="/citizen/profile/messages" className="btn btn-outline-primary">
                        <i className="fas fa-envelope me-2"></i>
                        إدارة الرسائل
                      </a>
                      <a href="/citizen/profile/issues" className="btn btn-outline-warning">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        إدارة القضايا
                      </a>
                      <button type="button" className="btn btn-outline-danger">
                        <i className="fas fa-key me-2"></i>
                        تغيير كلمة المرور
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </CitizenProtectedRoute>
  );
}
