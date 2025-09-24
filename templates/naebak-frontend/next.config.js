/** @type {import('next').NextConfig} */
const nextConfig = {
  // تمكين الميزات التجريبية
  experimental: {
    appDir: true,
  },
  
  // إعدادات الصور
  images: {
    domains: [
      'localhost',
      'naebak.com',
      'storage.googleapis.com',
      'firebasestorage.googleapis.com'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // إعدادات i18n للغة العربية
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    localeDetection: false,
  },
  
  // إعدادات الأمان
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  
  // إعادة توجيه API إلى Gateway
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
      },
    ]
  },
  
  // ضغط الملفات
  compress: true,
  
  // تحسين الأداء
  swcMinify: true,
  
  // إعدادات البيئة
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // إعدادات الإنتاج
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
    distDir: '.next',
  }),
}

module.exports = nextConfig
