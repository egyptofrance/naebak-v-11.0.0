'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/_lib/supabase-client';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('citizen');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  
  // Candidate-specific fields
  const [governorate, setGovernorate] = useState('');
  const [electoralDistrict, setElectoralDistrict] = useState('');
  const [party, setParty] = useState('');
  const [electoralSymbol, setElectoralSymbol] = useState('');
  const [electoralNumber, setElectoralNumber] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  // Check if user is a candidate
  const isCandidate = userType === 'candidate_mp' || userType === 'candidate_senate';
  
  console.log('Current userType:', userType);
  console.log('Is candidate:', isCandidate);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين!');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل!');
      return;
    }
    
    setLoading(true);

    // Prepare user data
    const userData: any = {
      full_name: fullName,
      user_type: userType,
      phone: phone,
      birth_date: birthDate,
      gender: gender,
      address: address,
    };

    // Add candidate-specific data
    if (isCandidate) {
      userData.governorate = governorate;
      userData.electoral_district = electoralDistrict;
      userData.party = party;
      userData.electoral_symbol = electoralSymbol;
      userData.electoral_number = electoralNumber;
      userData.candidate_type = userType === 'candidate_mp' ? 'مرشح نواب' : 'مرشح شيوخ';
    }

    // Use Supabase to sign up a new user
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
    } else if (data.user) {
      setSuccessMessage(
        'تم إنشاء حسابك بنجاح! لقد أرسلنا رابط تفعيل إلى بريدك الإلكتروني. يرجى الضغط عليه لتفعيل حسابك ثم تسجيل الدخول.'
      );
      setLoading(false);
    }
  };

  const egyptianGovernorates = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحر الأحمر', 'البحيرة', 'الفيوم', 'الغربية', 'الإسماعيلية',
    'المنوفية', 'المنيا', 'القليوبية', 'الوادي الجديد', 'السويس', 'أسوان', 'أسيوط', 'بني سويف', 'بورسعيد',
    'دمياط', 'الشرقية', 'جنوب سيناء', 'كفر الشيخ', 'مطروح', 'الأقصر', 'قنا', 'شمال سيناء', 'سوهاج'
  ];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header text-center py-4" style={{backgroundColor: '#004705'}}>
              <h2 className="fw-bold mb-0 text-white">إنشاء حساب جديد</h2>
              <p className="text-white-50 mb-0 mt-2">انضم إلى منصة نائبك الآن</p>
            </div>
            <div className="card-body p-5">
              {/* Show success or error messages */}
              {error && <div className="alert alert-danger">{error}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}

              {/* Hide the form after successful signup */}
              {!successMessage && (
                <form onSubmit={handleSignup}>
                  {/* Basic Information */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input 
                          id="fullName" 
                          type="text" 
                          className="form-control" 
                          placeholder="الاسم الكامل" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)} 
                          required 
                          disabled={loading} 
                        />
                        <label htmlFor="fullName">الاسم الكامل</label>
                      </div>
                    </div>
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
                        <label htmlFor="email">البريد الإلكتروني</label>
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
                        <label htmlFor="password">كلمة المرور (6 أحرف على الأقل)</label>
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
                        <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
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
                        <label htmlFor="phone">رقم الهاتف</label>
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
                        <label htmlFor="birthDate">تاريخ الميلاد</label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">النوع</label>
                        <select 
                          className="form-select" 
                          value={gender} 
                          onChange={(e) => setGender(e.target.value)} 
                          required 
                          disabled={loading}
                        >
                          <option value="">اختر النوع</option>
                          <option value="ذكر">ذكر</option>
                          <option value="أنثى">أنثى</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold" style={{color: '#004705'}}>أنا أسجل بصفتي:</label>
                        <select 
                          className="form-select" 
                          value={userType} 
                          onChange={(e) => {
                            console.log('Changing userType from', userType, 'to', e.target.value);
                            setUserType(e.target.value);
                          }} 
                          disabled={loading}
                        >
                          <option value="citizen">مواطن</option>
                          <option value="candidate_mp">مرشح لمجلس النواب</option>
                          <option value="candidate_senate">مرشح لمجلس الشيوخ</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea 
                      id="address" 
                      className="form-control" 
                      placeholder="العنوان" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      required 
                      disabled={loading}
                      style={{minHeight: '100px'}}
                    />
                    <label htmlFor="address">العنوان</label>
                  </div>

                  {/* Candidate-specific fields - Always show for now */}
                  {true && (
                    <>
                      <hr className="my-4" />
                      <h5 className="mb-3" style={{color: '#004705'}}>معلومات الترشح</h5>
                      
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">المحافظة</label>
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
                        <div className="col-md-6">
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
                            <label htmlFor="electoralDistrict">الدائرة الانتخابية</label>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-floating mb-3">
                            <input 
                              id="party" 
                              type="text" 
                              className="form-control" 
                              placeholder="الحزب السياسي" 
                              value={party} 
                              onChange={(e) => setParty(e.target.value)} 
                              required 
                              disabled={loading} 
                            />
                            <label htmlFor="party">الحزب السياسي</label>
                          </div>
                        </div>
                        <div className="col-md-4">
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
                            <label htmlFor="electoralSymbol">الرمز الانتخابي</label>
                          </div>
                        </div>
                        <div className="col-md-4">
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
                            <label htmlFor="electoralNumber">الرقم الانتخابي</label>
                          </div>
                        </div>
                      </div>

                      <div className="alert alert-info">
                        <strong>ملاحظة:</strong> سيتم مراجعة طلبات المرشحين من قبل الإدارة قبل الموافقة عليها.
                      </div>
                    </>
                  )}

                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-lg text-white fw-bold" 
                      style={{backgroundColor: '#004705'}} 
                      disabled={loading}
                    >
                      {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
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
