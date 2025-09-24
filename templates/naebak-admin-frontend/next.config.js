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
  
  // إعدادات الأمان المتقدمة للإدارة
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
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
          },
        ],
      },
    ]
  },
  
  // إعادة توجيه API إلى خدمة الإدارة
  async rewrites() {
    return [
      {
        source: '/api/admin/:path*',
        destination: process.env.NEXT_PUBLIC_ADMIN_API_URL + '/:path*',
      },
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
      },
    ]
  },
  
  // حماية مسارات الإدارة
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin/login',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'admin_token',
            value: undefined,
          },
        ],
      },
    ]
  },
  
  // ضغط الملفات
  compress: true,
  
  // تحسين الأداء
  swcMinify: true,
  
  // إعدادات البيئة
  env: {
    ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY,
  },
  
  // إعدادات الإنتاج
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
    distDir: '.next',
  }),
}

module.exports = nextConfig
