'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CitizenProtectedRoute from '../../../../components/CitizenProtectedRoute';

interface CitizenProfileData {
  phone_number: string;
  whatsapp_number: string;
  governorate: string;
  city: string;
  village: string;
}

interface Governorate {
  id: number;
  name: string;
  cities: string[];
}

export default function CompleteProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState<Governorate | null>(null);
  
  const [profileData, setProfileData] = useState<CitizenProfileData>({
    phone_number: '',
    whatsapp_number: '',
    governorate: '',
    city: '',
    village: ''
  });

  useEffect(() => {
    loadGovernorates();
    loadExistingProfile();
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

  const loadExistingProfile = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setProfileData(prev => ({
          ...prev,
          phone_number: user.phone_number || '',
          governorate: user.governorate || ''
        }));
        
        // البحث عن المحافظة المحددة
        if (user.governorate) {
          const gov = governorates.find(g => g.name === user.governorate);
          if (gov) {
            setSelectedGovernorate(gov);
          }
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل البيانات الموجودة:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGovernorateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const governorateName = e.target.value;
    const selectedGov = governorates.find(g => g.name === governorateName);
    
    setSelectedGovernorate(selectedGov || null);
    setProfileData(prev => ({
      ...prev,
      governorate: governorateName,
      city: '' // إعادة تعيين المدينة عند تغيير المحافظة
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // التحقق من صحة البيانات
      if (!profileData.phone_number || !profileData.governorate || !profileData.city) {
        setMessage('يرجى ملء جميع الحقول المطلوبة');
        setIsLoading(false);
        return;
      }

      // التحقق من صحة رقم الهاتف المصري
      const phoneRegex = /^(010|011|012|015)\d{8}$/;
      if (!phoneRegex.test(profileData.phone_number)) {
        setMessage('يرجى إدخال رقم هاتف مصري صحيح');
        setIsLoading(false);
        return;
      }

      // التحقق من رقم الواتساب إذا تم إدخاله
      if (profileData.whatsapp_number && !phoneRegex.test(profileData.whatsapp_number)) {
        setMessage('يرجى إدخال رقم واتساب مصري صحيح');
        setIsLoading(false);
        return;
      }

      // حفظ البيانات في localStorage (في التطبيق الحقيقي سيتم إرسالها للخادم)
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const updatedUser = {
          ...user,
          ...profileData,
          profile_completed: true
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // حفظ بيانات المواطن المحددة
      const citizenData = {
        ...profileData,
        profile_completed: true,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('citizen_profile', JSON.stringify(citizenData));

      setMessage('تم حفظ البيانات بنجاح!');
      
      // إعادة التوجيه إلى لوحة التحكم بعد ثانيتين
      setTimeout(() => {
        router.push('/citizen/dashboard');
      }, 2000);

    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
      setMessage('حدث خطأ أثناء حفظ البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CitizenProtectedRoute>
      <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg" style={{borderRadius: '15px'}}>
                <div className="card-header bg-success text-white text-center py-4" style={{borderRadius: '15px 15px 0 0'}}>
                  <h3 className="mb-0 fw-bold">
                    <i className="fas fa-user-edit me-2"></i>
                    إكمال الملف الشخصي
                  </h3>
                  <p className="mb-0 mt-2">يرجى إكمال بياناتك الشخصية للحصول على أفضل خدمة</p>
                </div>
                
                <div className="card-body p-5">
                  {message && (
                    <div className={`alert ${message.includes('نجاح') ? 'alert-success' : 'alert-danger'} text-center`}>
                      <i className={`fas ${message.includes('نجاح') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      {/* رقم الهاتف */}
                      <div className="col-md-6">
                        <label htmlFor="phone_number" className="form-label fw-bold">
                          <i className="fas fa-phone me-2 text-success"></i>
                          رقم الهاتف *
                        </label>
                        <input
                          type="tel"
                          className="form-control form-control-lg"
                          id="phone_number"
                          name="phone_number"
                          value={profileData.phone_number}
                          onChange={handleInputChange}
                          placeholder="01012345678"
                          required
                          style={{borderRadius: '10px'}}
                        />
                        <small className="text-muted">مثال: 01012345678</small>
                      </div>

                      {/* رقم الواتساب */}
                      <div className="col-md-6">
                        <label htmlFor="whatsapp_number" className="form-label fw-bold">
                          <i className="fab fa-whatsapp me-2 text-success"></i>
                          رقم الواتساب
                        </label>
                        <input
                          type="tel"
                          className="form-control form-control-lg"
                          id="whatsapp_number"
                          name="whatsapp_number"
                          value={profileData.whatsapp_number}
                          onChange={handleInputChange}
                          placeholder="01012345678"
                          style={{borderRadius: '10px'}}
                        />
                        <small className="text-muted">اختياري - إذا كان مختلف عن رقم الهاتف</small>
                      </div>

                      {/* المحافظة */}
                      <div className="col-md-6">
                        <label htmlFor="governorate" className="form-label fw-bold">
                          <i className="fas fa-map-marker-alt me-2 text-success"></i>
                          المحافظة *
                        </label>
                        <select
                          className="form-select form-select-lg"
                          id="governorate"
                          name="governorate"
                          value={profileData.governorate}
                          onChange={handleGovernorateChange}
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

                      {/* المدينة/المركز/الحي */}
                      <div className="col-md-6">
                        <label htmlFor="city" className="form-label fw-bold">
                          <i className="fas fa-building me-2 text-success"></i>
                          المدينة/المركز/الحي *
                        </label>
                        {selectedGovernorate && selectedGovernorate.cities.length > 0 ? (
                          <select
                            className="form-select form-select-lg"
                            id="city"
                            name="city"
                            value={profileData.city}
                            onChange={handleInputChange}
                            required
                            style={{borderRadius: '10px'}}
                          >
                            <option value="">اختر المدينة/المركز/الحي</option>
                            {selectedGovernorate.cities.map((city, index) => (
                              <option key={index} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="city"
                            name="city"
                            value={profileData.city}
                            onChange={handleInputChange}
                            placeholder="أدخل اسم المدينة أو المركز أو الحي"
                            required
                            style={{borderRadius: '10px'}}
                          />
                        )}
                      </div>

                      {/* القرية */}
                      <div className="col-12">
                        <label htmlFor="village" className="form-label fw-bold">
                          <i className="fas fa-home me-2 text-success"></i>
                          القرية
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="village"
                          name="village"
                          value={profileData.village}
                          onChange={handleInputChange}
                          placeholder="أدخل اسم القرية (اختياري)"
                          style={{borderRadius: '10px'}}
                        />
                        <small className="text-muted">اختياري - فقط إذا كنت تسكن في قرية</small>
                      </div>
                    </div>

                    <div className="text-center mt-5">
                      <button
                        type="submit"
                        className="btn btn-success btn-lg px-5 py-3"
                        disabled={isLoading}
                        style={{borderRadius: '25px', minWidth: '200px'}}
                      >
                        {isLoading ? (
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
                    </div>
                  </form>
                </div>
              </div>

              {/* معلومات إضافية */}
              <div className="card border-0 shadow-sm mt-4" style={{borderRadius: '15px'}}>
                <div className="card-body p-4">
                  <h6 className="fw-bold text-success mb-3">
                    <i className="fas fa-info-circle me-2"></i>
                    لماذا نحتاج هذه البيانات؟
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <i className="fas fa-phone text-success me-3 mt-1"></i>
                        <div>
                          <strong>أرقام الهاتف:</strong>
                          <p className="small text-muted mb-0">للتواصل المباشر وإرسال التحديثات المهمة</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <i className="fas fa-map-marker-alt text-success me-3 mt-1"></i>
                        <div>
                          <strong>الموقع الجغرافي:</strong>
                          <p className="small text-muted mb-0">لربطك بالنواب والمرشحين في منطقتك</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </CitizenProtectedRoute>
  );
}
