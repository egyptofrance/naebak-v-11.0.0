-- إنشاء قواعد البيانات المنفصلة لكل خدمة
-- Create separate databases for each service

-- خدمة المصادقة
CREATE DATABASE naebak_auth;
GRANT ALL PRIVILEGES ON DATABASE naebak_auth TO naebak_user;

-- خدمة الإدارة
CREATE DATABASE naebak_admin;
GRANT ALL PRIVILEGES ON DATABASE naebak_admin TO naebak_user;

-- خدمة الشكاوى
CREATE DATABASE naebak_complaints;
GRANT ALL PRIVILEGES ON DATABASE naebak_complaints TO naebak_user;

-- خدمة الرسائل
CREATE DATABASE naebak_messaging;
GRANT ALL PRIVILEGES ON DATABASE naebak_messaging TO naebak_user;

-- خدمة المحتوى
CREATE DATABASE naebak_content;
GRANT ALL PRIVILEGES ON DATABASE naebak_content TO naebak_user;

-- خدمة التقييمات
CREATE DATABASE naebak_ratings;
GRANT ALL PRIVILEGES ON DATABASE naebak_ratings TO naebak_user;

-- إنشاء Extensions مفيدة
\c naebak_auth;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c naebak_admin;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c naebak_complaints;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c naebak_messaging;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c naebak_content;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c naebak_ratings;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
