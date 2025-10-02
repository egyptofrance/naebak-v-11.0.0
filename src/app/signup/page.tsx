'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/_lib/supabase-client';

export default function SignupPage() {
  // Basic fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [userType, setUserType] = useState('citizen');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Candidate/Member specific fields
  const [council, setCouncil] = useState('');
  const [party, setParty] = useState('');
  const [electoralDistrict, setElectoralDistrict] = useState('');
  const [electoralNumber, setElectoralNumber] = useState('');
  const [electoralSymbol, setElectoralSymbol] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  // Check if user is a candidate or member
  const isCandidate = userType === 'candidate_mp' || userType === 'candidate_senate';
  const isMember = userType === 'member_mp' || userType === 'member_senate';
  const needsExtraFields = isCandidate || isMember;

  // Egyptian governorates
  const egyptianGovernorates = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحر الأحمر', 'البحيرة', 'الفيوم', 'الغربية', 'الإسماعيلية',
    'المنوفية', 'المنيا', 'القليوبية', 'الوادي الجديد', 'السويس', 'أسوان', 'أسيوط', 'بني سويف', 'بورسعيد',
    'دمياط', 'الشرقية', 'جنوب سيناء', 'كفر الشيخ', 'مطروح', 'الأقصر', 'قنا', 'شمال سيناء', 'سوهاج'
  ];

  // Egyptian political parties
  const egyptianParties = [
    'مستقبل وطن', 'الوفد', 'التجمع', 'المصريين الأحرار', 'الشعب الجمهوري', 'الإصلاح والتنمية', 
    'المحافظين', 'الحرية المصري', 'الديمقراطي الاجتماعي', 'العدل', 'الجيل الديمقراطي', 
    'المصري الديمقراطي الاجتماعي', 'الوطن', 'حماة الوطن', 'مصر الحديثة', 'مستقل'
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين!');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل!');
      return;
    }

    if (!agreeTerms) {
      setError('يجب الموافقة على الشروط والأحكام!');
      return;
    }

    if (needsExtraFields && !bio) {
      setError('السيرة الذاتية مطلوبة للمرشحين والنواب!');
      return;
    }
    
    setLoading(true);

    const fullName = `${firstName} ${lastName}`;

    // Prepare user data
    const userData: any = {
      full_name: fullName,
      first_name: firstName,
      last_name: lastName,
      user_type: userType,
      phone: phone,
      whatsapp: whatsapp || phone,
      birth_date: birthDate,
      gender: gender,
      governorate: governorate,
      city: city,
      district: district,
      address: address,
      occupation: occupation,
    };

    // Add candidate/member-specific data
    if (needsExtraFields) {
      userData.council = council;
      userData.party = party;
      userData.electoral_district = electoralDistrict;
      userData.bio = bio;
      
      if (isCandidate) {
        userData.electoral_number = electoralNumber;
        userData.electoral_symbol = electoralSymbol;
      }
    }

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: userData,
        },
      });

      if (error) {
        console.error('Supabase signup error:', error.message);
        if (error.message.includes('User already registered')) {
          setError('هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول.');
        } else {
          setError('حدث خطأ ما. يرجى المحاولة مرة أخرى.');
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        // Upload images if provided
        if (profileImage && data.user.id) {
          const fileExt = profileImage.name.split('.').pop();
          const fileName = `${data.user.id}-profile.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('profiles')
            .upload(fileName, profileImage);
          
          if (uploadError) {
            console.error('Error uploading profile image:', uploadError);
          }
        }

        if (bannerImage && data.user.id && needsExtraFields) {
          const fileExt = bannerImage.name.split('.').pop();
          const fileName = `${data.user.id}-banner.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('banners')
            .upload(fileName, bannerImage);
          
          if (uploadError) {
            console.error('Error uploading banner image:', uploadError);
          }
        }

        setSuccessMessage(
          'تم إنشاء حسابك بنجاح! ' + 
          (needsExtraFields 
            ? 'سيتم مراجعة طلبك من قبل الإدارة وإبلاغك بالنتيجة عبر البريد الإلكتروني.' 
            : 'يمكنك الآن تسجيل الدخول.')
        );
        setLoading(false);

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-11">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header text-center py-4" style={{backgroundColor: '#004705'}}>
              <h2 className="fw-bold mb-0 text-white">إنشاء حساب جديد</h2>
              <p className="text-white-50 mb-0 mt-2">انضم إلى منصة نائبك الآن</p>
            </div>
            <div className="card-body p-4 p-md-5">
              {/* Show success or error messages */}
              {error && <div className="alert alert-danger"><i className="fas fa-exclamation-circle me-2"></i>{error}</div>}
              {successMessage && <div className="alert alert-success"><i className="fas fa-check-circle me-2"></i>{successMessage}</div>}

              {/* Hide the form after successful signup */}
              {!successMessage && (
                <form onSubmit={handleSignup}>
                  {/* User Type Selection */}
                  <div className="mb-4 p-3 bg-light rounded">
                    <label className="form-label fw-bold" style={{color: '#004705', fontSize: '1.1rem'}}>
                      <i className="fas fa-user-tag me-2"></i>أنا أسجل بصفتي:
                    </label>
                    <select 
                      className="form-select form-select-lg" 
                      value={userType} 
                      onChange={(e) => setUserType(e.target.value)} 
                      disabled={loading}
                      required
                    >
                      <option value="citizen">مواطن</option>
                      <option value="candidate_mp">مرشح لمجلس النواب</option>
                      <option value="candidate_senate">مرشح لمجلس الشيوخ</option>
                      <option value="member_mp">نائب في مجلس النواب</option>
                      <option value="member_senate">نائب في مجلس الشيوخ</option>
                    </select>
                    {needsExtraFields && (
                      <div className="alert alert-info mt-3 mb-0">
                        <i className="fas fa-info-circle me-2"></i>
                        <strong>ملاحظة:</strong> سيتم مراجعة طلبك من قبل الإدارة قبل الموافقة عليه.
                      </div>
                    )}
                  </div>

                  <hr className="my-4" />

                  {/* Basic Information */}
                  <h5 className="mb-3 fw-bold" style={{color: '#004705'}}>
                    <i className="fas fa-user me-2"></i>المعلومات الأساسية
                  </h5>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input 
                          id="firstName" 
                          type="text" 
                          className="form-control" 
                          placeholder="الاسم الأول" 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)} 
                          required 
                          disabled={loading} 
                        />
                        <label htmlFor="firstName"><i className="fas fa-user me-2"></i>الاسم الأول *</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input 
                          id="lastName" 
                          type="text" 
                          className="form-control" 
                          placeholder="الاسم الأخير" 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)} 
                          required 
                          disabled={loading} 
                        />
                        <label htmlFor="lastName"><i className="fas fa-user me-2"></i>الاسم الأخير *</label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input 
                          id="email" 
                          type="email" 
                          className="form-control" 
                          placeholder="البريد الإلكتروني" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          required 
                          disabled={loading} 
                        />
                        <label htmlFor="email"><i className="fas fa-envelope me-2"></i>البريد الإلكتروني *</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input 
                          id="phone" 
                          type="tel" 
                          className="form-control" 
                          placeholder="رقم الهاتف" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          required 
                          disabled={loading} 
                        />
                        <label htmlFor="phone"><i className="fas fa-phone me-2"></i>رقم الهاتف *</label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input 
                          id="whatsapp" 
                          type="tel" 
                          className="form-control" 
                          placeholder="رقم الواتساب" 
                          value={whatsapp} 
                          onChange={(e) => setWhatsapp(e.target.value)} 
                          disabled={loading} 
                        />
                        <label htmlFor="whatsapp"><i className="fab fa-whatsapp me-2"></i>رقم الواتساب (اختياري)</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input 
                          id="birthDate" 
                          type="date" 
                          className="form-control" 
                          placeholder="تاريخ الميلاد" 
                          value={birthDate} 
                          onChange={(e) => setBirthDate(e.target.value)} 
                          required 
                          disabled={loading} 
                        />
                        <label htmlFor="birthDate"><i className="fas fa-calendar me-2"></i>تاريخ الميلاد *</label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label"><i className="fas fa-venus-mars me-2"></i>الجنس *</label>
                        <select 
                          className="form-select" 
                          value={gender} 
                          onChange={(e) => setGender(e.target.value)} 
                          required 
                          disabled={loading}
                        >
                          <option value="">اختر الجنس</option>
                          <option value="ذكر">ذكر</option>
                          <option value="أنثى">أنثى</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input 
                          id="occupation" 
                          type="text" 
                          className="form-control" 
                          placeholder="الوظيفة" 
                          value={occupation} 
                          onChange={(e) => setOccupation(e.target.value)} 
                          disabled={loading} 
                        />
                        <label htmlFor="occupation"><i className="fas fa-briefcase me-2"></i>الوظيفة (اختياري)</label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input 
                          id="password" 
                          type="password" 
                          className="form-control" 
                          placeholder="كلمة المرور" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required 
                          minLength={6} 
                          disabled={loading} 
                        />
                        <label htmlFor="password"><i className="fas fa-lock me-2"></i>كلمة المرور (6 أحرف على الأقل) *</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input 
                          id="confirmPassword" 
                          type="password" 
                          className="form-control" 
                          placeholder="تأكيد كلمة المرور" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          required 
                          disabled={loading} 
                        />
                        <label htmlFor="confirmPassword"><i className="fas fa-lock me-2"></i>تأكيد كلمة المرور *</label>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* Location Information */}
                  <h5 className="mb-3 fw-bold" style={{color: '#004705'}}>
                    <i className="fas fa-map-marker-alt me-2"></i>معلومات السكن
                  </h5>

                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label"><i className="fas fa-map me-2"></i>المحافظة *</label>
                        <select 
                          className="form-select" 
                          value={governorate} 
                          onChange={(e) => setGovernorate(e.target.value)} 
                          required 
                          disabled={loading}
                        >
                          <option value="">اختر المحافظة</option>
                          {egyptianGovernorates.map(gov => (
                            <option key={gov} value={gov}>{gov}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating mb-3">
                        <input 
                          id="city" 
                          type="text" 
                          className="form-control" 
                          placeholder="المدينة" 
                          value={city} 
                          onChange={(e) => setCity(e.target.value)} 
                          required 
                          disabled={loading} 
                        />
                        <label htmlFor="city"><i className="fas fa-city me-2"></i>المدينة *</label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating mb-3">
                        <input 
                          id="district" 
                          type="text" 
                          className="form-control" 
                          placeholder="الحي" 
                          value={district} 
                          onChange={(e) => setDistrict(e.target.value)} 
                          disabled={loading} 
                        />
                        <label htmlFor="district"><i className="fas fa-map-signs me-2"></i>الحي (اختياري)</label>
                      </div>
                    </div>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea 
                      id="address" 
                      className="form-control" 
                      placeholder="العنوان التفصيلي" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      required 
                      disabled={loading}
                      style={{minHeight: '100px'}}
                    />
                    <label htmlFor="address"><i className="fas fa-home me-2"></i>العنوان التفصيلي *</label>
                  </div>

                  {/* Candidate/Member-specific fields */}
                  {needsExtraFields && (
                    <>
                      <hr className="my-4" />
                      <h5 className="mb-3 fw-bold" style={{color: '#004705'}}>
                        <i className="fas fa-landmark me-2"></i>معلومات الترشح/العضوية
                      </h5>
                      
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label"><i className="fas fa-building me-2"></i>المجلس *</label>
                            <select 
                              className="form-select" 
                              value={council} 
                              onChange={(e) => setCouncil(e.target.value)} 
                              required 
                              disabled={loading}
                            >
                              <option value="">اختر المجلس</option>
                              <option value="مجلس النواب">مجلس النواب</option>
                              <option value="مجلس الشيوخ">مجلس الشيوخ</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label"><i className="fas fa-flag me-2"></i>الحزب السياسي *</label>
                            <select 
                              className="form-select" 
                              value={party} 
                              onChange={(e) => setParty(e.target.value)} 
                              required 
                              disabled={loading}
                            >
                              <option value="">اختر الحزب</option>
                              {egyptianParties.map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-floating mb-3">
                        <input 
                          id="electoralDistrict" 
                          type="text" 
                          className="form-control" 
                          placeholder="الدائرة الانتخابية" 
                          value={electoralDistrict} 
                          onChange={(e) => setElectoralDistrict(e.target.value)} 
                          required 
                          disabled={loading} 
                        />
                        <label htmlFor="electoralDistrict"><i className="fas fa-map-marked-alt me-2"></i>الدائرة الانتخابية *</label>
                      </div>

                      {isCandidate && (
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-floating mb-3">
                              <input 
                                id="electoralSymbol" 
                                type="text" 
                                className="form-control" 
                                placeholder="الرمز الانتخابي" 
                                value={electoralSymbol} 
                                onChange={(e) => setElectoralSymbol(e.target.value)} 
                                required 
                                disabled={loading} 
                              />
                              <label htmlFor="electoralSymbol"><i className="fas fa-star me-2"></i>الرمز الانتخابي *</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating mb-3">
                              <input 
                                id="electoralNumber" 
                                type="text" 
                                className="form-control" 
                                placeholder="الرقم الانتخابي" 
                                value={electoralNumber} 
                                onChange={(e) => setElectoralNumber(e.target.value)} 
                                required 
                                disabled={loading} 
                              />
                              <label htmlFor="electoralNumber"><i className="fas fa-hashtag me-2"></i>الرقم الانتخابي *</label>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="form-floating mb-3">
                        <textarea 
                          id="bio" 
                          className="form-control" 
                          placeholder="السيرة الذاتية" 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)} 
                          required 
                          disabled={loading}
                          style={{minHeight: '150px'}}
                        />
                        <label htmlFor="bio"><i className="fas fa-file-alt me-2"></i>السيرة الذاتية *</label>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label"><i className="fas fa-image me-2"></i>الصورة الشخصية (اختياري)</label>
                            <input 
                              type="file" 
                              className="form-control" 
                              accept="image/*"
                              onChange={(e) => setProfileImage(e.target.files?.[0] || null)} 
                              disabled={loading} 
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label"><i className="fas fa-images me-2"></i>صورة البانر (اختياري)</label>
                            <input 
                              type="file" 
                              className="form-control" 
                              accept="image/*"
                              onChange={(e) => setBannerImage(e.target.files?.[0] || null)} 
                              disabled={loading} 
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <hr className="my-4" />

                  {/* Terms and Conditions */}
                  <div className="form-check mb-4">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="agreeTerms" 
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      required
                      disabled={loading}
                    />
                    <label className="form-check-label" htmlFor="agreeTerms">
                      أوافق على{' '}
                      <Link href="/terms" target="_blank" className="fw-bold" style={{color: '#004705'}}>
                        شروط الاستخدام
                      </Link>
                      {' '}و{' '}
                      <Link href="/privacy" target="_blank" className="fw-bold" style={{color: '#004705'}}>
                        سياسة الخصوصية
                      </Link>
                      {' '}*
                    </label>
                  </div>

                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-lg text-white fw-bold" 
                      style={{backgroundColor: '#004705'}} 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          جاري إنشاء الحساب...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>
                          إنشاء الحساب
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
            <div className="card-footer text-center py-3">
              <div className="small">
                لديك حساب بالفعل؟{' '}
                <Link href="/login" className="fw-bold" style={{color: '#004705'}}>
                  قم بتسجيل الدخول
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
