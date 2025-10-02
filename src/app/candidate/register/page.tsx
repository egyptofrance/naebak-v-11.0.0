'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import governoratesData from '../../../data/governorates.json';

export default function CandidateRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    whatsapp: '',
    candidateType: '',
    governorate: '',
    district: '',
    electoralSymbol: '',
    electoralNumber: '',
    party: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType: 'candidate'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('تم إنشاء الحساب بنجاح! جاري تسجيل الدخول...');
        
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          name: formData.name,
          email: formData.email,
          userType: 'candidate',
          candidateType: formData.candidateType,
          governorate: formData.governorate,
          district: formData.district,
          electoralSymbol: formData.electoralSymbol,
          electoralNumber: formData.electoralNumber
        }));
        localStorage.setItem('token', data.token);

        setTimeout(() => {
          router.push('/candidate/dashboard');
        }, 1500);
      } else {
        setMessage(data.message || 'حدث خطأ أثناء إنشاء الحساب');
      }
    } catch (error) {
      setMessage('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} noValidate style={{ backgroundColor: '#fff', padding: '30px', border: '1px solid #ddd', borderRadius: '8px' }}>
          
          {message && (
            <div style={{ 
              padding: '10px', 
              marginBottom: '20px', 
              backgroundColor: message.includes('نجاح') ? '#d4edda' : '#f8d7da',
              color: message.includes('نجاح') ? '#155724' : '#721c24',
              border: '1px solid ' + (message.includes('نجاح') ? '#c3e6cb' : '#f5c6cb'),
              borderRadius: '4px'
            }}>
              {message}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              name="name"
              placeholder="الاسم الكامل"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              name="password"
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="تأكيد كلمة المرور"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="tel"
              name="phone"
              placeholder="رقم الهاتف"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="tel"
              name="whatsapp"
              placeholder="رقم الواتساب"
              value={formData.whatsapp}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <select
              name="candidateType"
              value={formData.candidateType}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '16px',
                color: formData.candidateType ? '#000' : '#999'
              }}
            >
              <option value="">اختر نوع الترشح</option>
              <option value="مرشح نواب">مرشح مجلس النواب</option>
              <option value="مرشح شيوخ">مرشح مجلس الشيوخ</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <select
              name="governorate"
              value={formData.governorate}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '16px',
                color: formData.governorate ? '#000' : '#999'
              }}
            >
              <option value="">اختر المحافظة</option>
              {governoratesData.map((gov) => (
                <option key={gov.id} value={gov.name}>
                  {gov.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              name="district"
              placeholder="الدائرة الانتخابية"
              value={formData.district}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              name="electoralSymbol"
              placeholder="الرمز الانتخابي"
              value={formData.electoralSymbol}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              name="electoralNumber"
              placeholder="الرقم الانتخابي"
              value={formData.electoralNumber}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              name="party"
              placeholder="الحزب السياسي (اختياري - اتركه فارغاً إذا كنت مستقلاً)"
              value={formData.party}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span>لديك حساب بالفعل؟ </span>
            <button 
              type="button" 
              onClick={() => router.push('/')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#007bff', 
                textDecoration: 'underline', 
                cursor: 'pointer' 
              }}
            >
              تسجيل الدخول
            </button>
          </div>
        </form>
      </div>
  );
}
