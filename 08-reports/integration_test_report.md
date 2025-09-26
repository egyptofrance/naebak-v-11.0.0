# 🧪 Naebak Integration Test Report
**Generated:** 2025-09-26T04:32:09.307881

## 📊 Services Summary

- **Total Services:** 15
- **Running Services:** 1
- **Failed Services:** 2
- **Success Rate:** 6.7%

## 🔧 Individual Service Status

### ❌ naebak-auth-service
- **Type:** django
- **Port:** 8001
- **Status:** failed

### ⏹️ naebak-admin-service
- **Type:** django
- **Port:** 8002
- **Status:** stopped

### ⏹️ naebak-complaints-service
- **Type:** django
- **Port:** 8003
- **Status:** stopped

### ⏹️ naebak-content-service
- **Type:** django
- **Port:** 8005
- **Status:** stopped

### ⏹️ naebak-ratings-service
- **Type:** django
- **Port:** 8006
- **Status:** stopped

### ❌ naebak-gateway
- **Type:** flask
- **Port:** 8007
- **Status:** failed

### ⏹️ naebak-messaging-service
- **Type:** flask
- **Port:** 8004
- **Status:** stopped

### ⏹️ naebak-notifications-service
- **Type:** flask
- **Port:** 8013
- **Status:** stopped

### ⏹️ naebak-visitor-counter-service
- **Type:** flask
- **Port:** 8008
- **Status:** stopped

### ⏹️ naebak-statistics-service
- **Type:** flask
- **Port:** 8009
- **Status:** stopped

### ⏹️ naebak-news-service
- **Type:** flask
- **Port:** 8010
- **Status:** stopped

### ⏹️ naebak-banner-service
- **Type:** flask
- **Port:** 8011
- **Status:** stopped

### ⏹️ naebak-theme-service
- **Type:** flask
- **Port:** 8012
- **Status:** stopped

### ⏹️ naebak-frontend
- **Type:** nextjs
- **Port:** 3000
- **Status:** stopped

### ✅ naebak-admin-frontend
- **Type:** nextjs
- **Port:** 3001
- **Status:** running
- **API Endpoints:** 3/4 working

## 🔗 Integration Test Results

### ❌ Gateway to Auth communication
- **Error:** HTTPConnectionPool(host='localhost', port=8007): Max retries exceeded with url: /api/v1/auth/login (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7fc18436ed10>: Failed to establish a new connection: [Errno 111] Connection refused'))

### ❌ Gateway to Complaints communication
- **Error:** HTTPConnectionPool(host='localhost', port=8007): Max retries exceeded with url: /api/v1/complaints (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7fc18436d7d0>: Failed to establish a new connection: [Errno 111] Connection refused'))

### ❌ Auth to Admin communication
- **Error:** HTTPConnectionPool(host='localhost', port=8002): Max retries exceeded with url: /api/v1/users (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7fc184339a50>: Failed to establish a new connection: [Errno 111] Connection refused'))

### ❌ Frontend to Gateway communication
- **Error:** HTTPConnectionPool(host='localhost', port=3000): Max retries exceeded with url: / (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7fc18436ed50>: Failed to establish a new connection: [Errno 111] Connection refused'))

## 💡 Recommendations

### Issues Found:
- **naebak-auth-service:** Check logs and dependencies
- **naebak-gateway:** Check logs and dependencies

### ⚠️ Some Services Need Attention
- Fix failed services before proceeding
- Check service dependencies and configurations
- Review service logs for detailed error information