
# تقرير اختبار التكامل - Integration Test Report

**تاريخ الاختبار:** 2025-09-24 19:43:48
**إجمالي الخدمات:** 13
**إجمالي الاختبارات:** 32
**نسبة النجاح:** 0.0%

## نتائج الاختبارات:


### gateway (Port: 8013, Type: flask)
- 🔌 gateway service not running (Connection refused)
- ❌ gateway CORS test error: HTTPConnectionPool(host='localhost', port=8013): Max retries exceeded with url: /health (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f04965b2850>: Failed to establish a new connection: [Errno 111] Connection refused'))

### auth (Port: 8001, Type: django)
- 🔌 auth service not running (Connection refused)
- ❌ auth CORS test error: HTTPConnectionPool(host='localhost', port=8001): Max retries exceeded with url: /health (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f0496489410>: Failed to establish a new connection: [Errno 111] Connection refused'))
- ❌ auth Django admin test failed

### admin (Port: 8002, Type: django)
- 🔌 admin service not running (Connection refused)
- ❌ admin CORS test error: HTTPConnectionPool(host='localhost', port=8002): Max retries exceeded with url: /health (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f04963f2f90>: Failed to establish a new connection: [Errno 111] Connection refused'))
- ❌ admin Django admin test failed

### complaints (Port: 8003, Type: django)
- 🔌 complaints service not running (Connection refused)
- ❌ complaints CORS test error: HTTPConnectionPool(host='localhost', port=8003): Max retries exceeded with url: /health (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f0496f328d0>: Failed to establish a new connection: [Errno 111] Connection refused'))
- ❌ complaints Django admin test failed

### messaging (Port: 8004, Type: django)
- 🔌 messaging service not running (Connection refused)
- ❌ messaging CORS test error: HTTPConnectionPool(host='localhost', port=8004): Max retries exceeded with url: /health (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f04963f0490>: Failed to establish a new connection: [Errno 111] Connection refused'))
- ❌ messaging Django admin test failed

### ratings (Port: 8005, Type: django)
- 🔌 ratings service not running (Connection refused)
- ❌ ratings CORS test error: HTTPConnectionPool(host='localhost', port=8005): Max retries exceeded with url: /health (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f0496488450>: Failed to establish a new connection: [Errno 111] Connection refused'))
- ❌ ratings Django admin test failed

### visitor-counter (Port: 8006, Type: flask)
- 🔌 visitor-counter service not running (Connection refused)
- ❌ visitor-counter CORS test error: HTTPConnectionPool(host='localhost', port=8006): Max retries exceeded with url: /health (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f04963f2d90>: Failed to establish a new connection: [Errno 111] Connection refused'))

### news (Port: 8007, Type: flask)
- 🔌 news service not running (Connection refused)
- ❌ news CORS test error: HTTPConnectionPool(host='localhost', port=8007): Max retries exceeded with url: /health (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f0496489b90>: Failed to establish a new connection: [Errno 111] Connection refused'))

### notifications (Port: 8008, Type: flask)
- 🔌 notifications service not running (Connection refused)
- ❌ notifications CORS test error: HTTPConnectionPool(host='localhost', port=8008): Max retries exceeded with url: /health (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f04963f1150>: Failed to establish a new connection: [Errno 111] Connection refused'))

### banner (Port: 8009, Type: flask)
- 🔌 banner service not running (Connection refused)
- ❌ banner CORS test error: HTTPConnectionPool(host='localhost', port=8009): Max retries exceeded with url: /health (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f04965b2ed0>: Failed to establish a new connection: [Errno 111] Connection refused'))

### content (Port: 8010, Type: django)
- 🔌 content service not running (Connection refused)
- ❌ content CORS test error: HTTPConnectionPool(host='localhost', port=8010): Max retries exceeded with url: /health (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f0496457a50>: Failed to establish a new connection: [Errno 111] Connection refused'))
- ❌ content Django admin test failed

### statistics (Port: 8012, Type: flask)
- 🔌 statistics service not running (Connection refused)
- ❌ statistics CORS test error: HTTPConnectionPool(host='localhost', port=8012): Max retries exceeded with url: /health (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f049648b390>: Failed to establish a new connection: [Errno 111] Connection refused'))

### theme (Port: 8014, Type: flask)
- 🔌 theme service not running (Connection refused)
- ❌ theme CORS test error: HTTPConnectionPool(host='localhost', port=8014): Max retries exceeded with url: /health (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f04963f1bd0>: Failed to establish a new connection: [Errno 111] Connection refused'))

## التوصيات:

### الخدمات العاملة:
- الخدمات التي تعمل بشكل صحيح جاهزة للتكامل
- يمكن البدء في اختبار الوظائف المتقدمة

### الخدمات غير العاملة:
- تحتاج إلى تشغيل باستخدام Docker أو محليًا
- التأكد من إعدادات قواعد البيانات
- فحص ملفات البيئة (.env)

### خطوات التشغيل:
```bash
# تشغيل جميع الخدمات باستخدام Docker Compose
docker-compose up -d

# أو تشغيل خدمة واحدة
cd naebak-[service-name]
docker build -t naebak-[service-name] .
docker run -p [port]:[port] naebak-[service-name]
```

---
*تم إنشاء هذا التقرير آليًا*
