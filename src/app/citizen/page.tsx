'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import '../../styles/forms.css';

interface Governorate {
  id: number;
  name: string;
  name_en?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  gender: string;
  email: string;
  password: string;
  phone: string;
  whatsapp: string;
  governorate: string;
  city: string;
  center: string;
  district: string;
  village: string;
  street: string;
  houseNumber: string;
}

export default function CitizenPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    nationalId: '',
    birthDate: '',
    gender: '',
    email: '',
    password: '',
    phone: '',
    whatsapp: '',
    governorate: '',
    city: '',
    center: '',
    district: '',
    village: '',
    street: '',
    houseNumber: ''
  });

  useEffect(() => {
    // Check if user is already authenticated
    if (status === 'authenticated') {
      router.push('/citizen/dashboard');
    }
  }, [status, router]);

  useEffect(() => {
    // Load governorates data
    const loadGovernorates = async () => {
      try {
        const response = await fetch('/api/governorates');
        const data = await response.json();
        
        if (data.governorates) {
          setGovernorates(data.governorates);
        } else {
          // Fallback to local data
          const localGovernorates = await import('../../data/governorates.json');
          setGovernorates(localGovernorates.default);
        }
      } catch (error) {
        console.error('Error loading governorates:', error);
        // Load from local file as fallback
        try {
          const localGovernorates = await import('../../data/governorates.json');
          setGovernorates(localGovernorates.default);
        } catch (localError) {
          console.error('Error loading local governorates:', localError);
        }
      }
    };

    loadGovernorates();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Required field validation
    if (!formData.firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!formData.lastName.trim()) newErrors.lastName = 'الاسم الأخير مطلوب';
    if (!formData.nationalId.trim()) newErrors.nationalId = 'الرقم القومي مطلوب';
    if (!formData.birthDate) newErrors.birthDate = 'تاريخ الميلاد مطلوب';
    if (!formData.gender) newErrors.gender = 'النوع مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.password.trim()) newErrors.password = 'كلمة المرور مطلوبة';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.governorate) newErrors.governorate = 'المحافظة مطلوبة';
    if (!formData.city.trim()) newErrors.city = 'المدينة مطلوبة';

    // National ID validation (14 digits)
    if (formData.nationalId && !/^\d{14}$/.test(formData.nationalId)) {
      newErrors.nationalId = 'الرقم القومي يجب أن يكون 14 رقم';
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    // Phone validation (Egyptian format)
    if (formData.phone && !/^01[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف يجب أن يبدأ بـ 01 ويكون 11 رقم';
    }

    // WhatsApp validation (if provided)
    if (formData.whatsapp && !/^01[0-9]{9}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = 'رقم الواتساب يجب أن يبدأ بـ 01 ويكون 11 رقم';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Step 1: Register the user
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType: 'citizen'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Step 2: Automatically sign in the user using NextAuth
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          // Step 3: Redirect to dashboard
          router.push('/citizen/dashboard');
        } else {
          // Registration successful but auto-login failed
          setErrors({ 
            general: 'تم إنشاء الحساب بنجاح. يرجى تسجيل الدخول باستخدام بريدك الإلكتروني والرقم القومي.' 
          });
          // Optionally redirect to login page
          setTimeout(() => {
            router.push('/?login=true');
          }, 3000);
        }
      } else {
        // Handle registration errors
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ general: result.message || 'حدث خطأ أثناء التسجيل' });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
          </div>
        </div>
    );
  }

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
                <h2 className="fw-bold mb-0" style={{color: '#004705'}}>تسجيل مواطن جديد</h2>
              </div>
              <p className="lead text-muted">
                أكمل بياناتك الشخصية وعنوانك بالتفصيل للانضمام إلى منصة نائبك
              </p>
              <div className="alert alert-info" role="alert">
                <small>
                  <strong>ملاحظة:</strong> تأكد من إدخال كلمة مرور قوية لحماية حسابك. يمكنك تغييرها لاحقاً من إعدادات الحساب.
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم النموذج */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow-lg border-0" style={{borderRadius: '12px'}}>
                <div className="card-body p-5">
                  {errors.general && (
                    <div className={`alert ${errors.general.includes('بنجاح') ? 'alert-success' : 'alert-danger'} mb-4`} role="alert">
                      {errors.general}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    {/* البيانات الشخصية */}
                    <div className="mb-5">
                      <h5 className="fw-bold mb-4 pb-2" style={{color: '#004705', borderBottom: '2px solid #004705'}}>البيانات الشخصية</h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <input 
                            type="text" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`form-control form-control-lg ${errors.firstName ? 'is-invalid' : ''}`}
                            placeholder="الاسم الأول"
                            style={{fontSize: '0.9rem'}}
                            required
                          />
                          {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                          <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`form-control form-control-lg ${errors.lastName ? 'is-invalid' : ''}`}
                            placeholder="الاسم الأخير"
                            style={{fontSize: '0.9rem'}}
                            required
                          />
                          {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                          <input 
                            type="text" 
                            name="nationalId"
                            value={formData.nationalId}
                            onChange={handleInputChange}
                            className={`form-control form-control-lg ${errors.nationalId ? 'is-invalid' : ''}`}
                            placeholder="الرقم القومي (14 رقم)"
                            style={{fontSize: '0.9rem'}}
                            maxLength={14}
                            pattern="[0-9]{14}"
                            required
                          />
                          {errors.nationalId && <div className="invalid-feedback">{errors.nationalId}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                          <input 
                            type="date" 
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            className={`form-control form-control-lg ${errors.birthDate ? 'is-invalid' : ''}`}
                            style={{fontSize: '0.9rem'}}
                            required
                          />
                          {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                          <select 
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className={`form-select form-select-lg ${errors.gender ? 'is-invalid' : ''}`}
                            style={{fontSize: '0.9rem'}}
                            required
                          >
                            <option value="">اختر النوع</option>
                            <option value="male">ذكر</option>
                            <option value="female">أنثى</option>
                          </select>
                          {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="البريد الإلكتروني"
                            style={{fontSize: '0.9rem'}}
                            required
                          />
                          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                          <input 
                            type="password" 
                            name="password"
                            value={formData.password || ''}
                            onChange={handleInputChange}
                            className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="كلمة المرور"
                            style={{fontSize: '0.9rem'}}
                            required
                          />
                          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>
                      </div>
                    </div>

                    {/* بيانات الاتصال */}
                    <div className="mb-5">
                      <h5 className="fw-bold mb-4 pb-2" style={{color: '#004705', borderBottom: '2px solid #004705'}}>بيانات الاتصال</h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`form-control form-control-lg ${errors.phone ? 'is-invalid' : ''}`}
                            placeholder="رقم الهاتف (مثال: 01012345678)"
                            style={{fontSize: '0.9rem'}}
                            pattern="01[0-9]{9}"
                            maxLength={11}
                            required
                          />
                          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                          <input 
                            type="tel" 
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleInputChange}
                            className={`form-control form-control-lg ${errors.whatsapp ? 'is-invalid' : ''}`}
                            placeholder="رقم الواتساب (مثال: 01012345678)"
                            style={{fontSize: '0.9rem'}}
                            pattern="01[0-9]{9}"
                            maxLength={11}
                          />
                          {errors.whatsapp && <div className="invalid-feedback">{errors.whatsapp}</div>}
                        </div>
                      </div>
                    </div>

                    {/* العنوان بالتفصيل */}
                    <div className="mb-5">
                      <h5 className="fw-bold mb-4 pb-2" style={{color: '#004705', borderBottom: '2px solid #004705'}}>العنوان بالتفصيل</h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <select 
                            name="governorate"
                            value={formData.governorate}
                            onChange={handleInputChange}
                            className={`form-select form-select-lg ${errors.governorate ? 'is-invalid' : ''}`}
                            style={{fontSize: '0.9rem'}}
                            required
                          >
                            <option value="">اختر المحافظة</option>
                            {governorates.map((gov) => (
                              <option key={gov.id} value={gov.name}>
                                {gov.name}
                              </option>
                            ))}
                          </select>
                          {errors.governorate && <div className="invalid-feedback">{errors.governorate}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                          <input 
                            type="text" 
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`form-control form-control-lg ${errors.city ? 'is-invalid' : ''}`}
                            placeholder="المدينة"
                            style={{fontSize: '0.9rem'}}
                            required
                          />
                          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                          <input 
                            type="text" 
                            name="center"
                            value={formData.center}
                            onChange={handleInputChange}
                            className="form-control form-control-lg" 
                            placeholder="المركز"
                            style={{fontSize: '0.9rem'}}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <input 
                            type="text" 
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            className="form-control form-control-lg" 
                            placeholder="الحي"
                            style={{fontSize: '0.9rem'}}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <input 
                            type="text" 
                            name="village"
                            value={formData.village}
                            onChange={handleInputChange}
                            className="form-control form-control-lg" 
                            placeholder="القرية"
                            style={{fontSize: '0.9rem'}}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <input 
                            type="text" 
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            className="form-control form-control-lg" 
                            placeholder="اسم الشارع"
                            style={{fontSize: '0.9rem'}}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <input 
                            type="text" 
                            name="houseNumber"
                            value={formData.houseNumber}
                            onChange={handleInputChange}
                            className="form-control form-control-lg" 
                            placeholder="رقم المنزل"
                            style={{fontSize: '0.9rem'}}
                          />
                        </div>
                      </div>
                    </div>

                    {/* أزرار الحفظ */}
                    <div className="text-center">
                      <button 
                        type="submit" 
                        className="btn btn-success btn-lg px-5 py-3 me-3"
                        style={{fontSize: '0.9rem'}}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            جاري التسجيل...
                          </>
                        ) : (
                          'تسجيل الحساب'
                        )}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-lg px-5 py-3"
                        style={{fontSize: '0.9rem'}}
                        onClick={() => router.push('/')}
                        disabled={loading}
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
