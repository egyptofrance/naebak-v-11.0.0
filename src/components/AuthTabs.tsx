'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface AuthTabsProps {
  onTabChange: (tab: string) => void;
}

function AuthTabsContent({ onTabChange }: AuthTabsProps) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    const loginParam = searchParams.get('login');
    if (loginParam === 'true') {
      setActiveTab('login');
      onTabChange('login');
    }
  }, [searchParams, onTabChange]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="auth-tabs">
      <button 
        className={`tab ${activeTab === 'register' ? 'active' : ''}`}
        onClick={() => handleTabClick('register')}
      >
        إنشاء حساب
      </button>
      <button 
        className={`tab ${activeTab === 'login' ? 'active' : ''}`}
        onClick={() => handleTabClick('login')}
      >
        تسجيل الدخول
      </button>
    </div>
  );
}

export default function AuthTabs({ onTabChange }: AuthTabsProps) {
  return (
    <Suspense fallback={
      <div className="auth-tabs">
        <button className="tab">إنشاء حساب</button>
        <button className="tab active">تسجيل الدخول</button>
      </div>
    }>
      <AuthTabsContent onTabChange={onTabChange} />
    </Suspense>
  );
}
