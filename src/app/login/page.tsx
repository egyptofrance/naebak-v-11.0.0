'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 1. Import the router
import { createClient } from '@/_lib/supabase-client'; // 2. Import the Supabase client

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // To show error messages
  const [loading, setLoading] = useState(false); // To disable the button while logging in

  const router = useRouter(); // Initialize the router
  const supabase = createClient(); // Create a Supabase client instance

  // 3. This is the updated login handler function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Disable the button
    setError(null); // Clear any previous errors

    // Use Supabase to sign in with email and password
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // If Supabase returns an error, show it to the user
      console.error('Supabase login error:', error.message);
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.');
      setLoading(false); // Re-enable the button
    } else {
      // If login is successful, redirect to the homepage
      // Supabase automatically handles cookies, so the user is now logged in
      router.push('/'); // Redirect to homepage
      router.refresh(); // Refresh the page to update the header
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-8">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header text-center py-4" style={{backgroundColor: '#004705'}}>
              <h2 className="fw-bold mb-0 text-white">تسجيل الدخول</h2>
              <p className="text-white-50 mb-0 mt-2">مرحبًا بعودتك!</p>
            </div>
            <div className="card-body p-5">
              <form onSubmit={handleLogin}>
                {/* 4. Display error messages here */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div className="form-floating mb-3">
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="البريد الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading} // Disable input when loading
                  />
                  <label htmlFor="email">البريد الإلكتروني</label>
                </div>

                <div className="form-floating mb-4">
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading} // Disable input when loading
                  />
                  <label htmlFor="password">كلمة المرور</label>
                </div>

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-lg text-white fw-bold"
                    style={{backgroundColor: '#004705'}}
                    disabled={loading} // Disable button when loading
                  >
                    {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center py-3">
              <div className="small mb-2">
                <Link href="/forgot-password" className="fw-bold" style={{color: '#fba505'}}>
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="small">
                ليس لديك حساب؟{' '}
                <Link href="/signup" className="fw-bold" style={{color: '#004705'}}>
                  أنشئ حسابًا جديدًا
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
