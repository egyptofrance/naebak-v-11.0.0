'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/_lib/supabase-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError('حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.');
      } else {
        setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.');
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 mt-5">
            <div className="card-header text-center" style={{backgroundColor: '#004705', color: 'white'}}>
              <h3 className="mb-0">نسيت كلمة المرور</h3>
              <p className="mb-0 mt-2">أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</p>
            </div>
            <div className="card-body p-4">
              {message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold" style={{color: '#004705'}}>
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-lg"
                    style={{backgroundColor: '#004705', color: 'white'}}
                    disabled={loading}
                  >
                    {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
                  </button>
                </div>
              </form>

              <div className="text-center mt-4">
                <p className="mb-2">
                  تذكرت كلمة المرور؟{' '}
                  <Link href="/login" className="text-decoration-none" style={{color: '#004705'}}>
                    تسجيل الدخول
                  </Link>
                </p>
                <p className="mb-0">
                  ليس لديك حساب؟{' '}
                  <Link href="/signup" className="text-decoration-none" style={{color: '#fba505'}}>
                    إنشاء حساب جديد
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
