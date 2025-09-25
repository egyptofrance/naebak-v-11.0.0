# Naebak Testing Scenarios - سيناريوهات الاختبار الشاملة

## 🧪 **استراتيجية الاختبار**

### **أنواع الاختبارات:**
1. **Unit Tests** - اختبارات الوحدة (70%)
2. **Integration Tests** - اختبارات التكامل (20%)
3. **End-to-End Tests** - اختبارات شاملة (10%)

### **معايير النجاح:**
- **تغطية الكود**: 85%+ 
- **معدل النجاح**: 95%+
- **وقت التنفيذ**: < 10 دقائق للجميع
- **اختبارات الأمان**: 100% نجاح

---

## 🔐 **1. اختبارات المصادقة والأمان**

### **1.1 تسجيل المستخدم الجديد**

#### **السيناريو الإيجابي:**
```python
def test_user_registration_success():
    """اختبار تسجيل مستخدم جديد بنجاح"""
    data = {
        "username": "ahmed_cairo",
        "email": "ahmed@example.com",
        "phone": "01012345678",
        "whatsapp": "01012345678",
        "full_name": "أحمد محمد علي",
        "address": "شارع النيل، القاهرة",
        "governorate_id": 1,  # القاهرة
        "user_type": "citizen",
        "password": "SecurePass123!"
    }
    
    response = client.post("/api/auth/register", json=data)
    
    assert response.status_code == 201
    assert "access_token" in response.json()
    assert "user_id" in response.json()
    
    # التحقق من إنشاء المستخدم في قاعدة البيانات
    user = User.objects.get(username="ahmed_cairo")
    assert user.email == "ahmed@example.com"
    assert user.is_active == True
```

#### **السيناريوهات السلبية:**
```python
def test_user_registration_duplicate_email():
    """اختبار تسجيل بإيميل مكرر"""
    # إنشاء مستخدم أولاً
    create_test_user("test@example.com")
    
    data = {
        "email": "test@example.com",  # إيميل مكرر
        "username": "new_user",
        # ... باقي البيانات
    }
    
    response = client.post("/api/auth/register", json=data)
    
    assert response.status_code == 400
    assert "email already exists" in response.json()["error"]

def test_user_registration_invalid_phone():
    """اختبار تسجيل برقم تليفون غير صحيح"""
    data = {
        "phone": "123",  # رقم غير صحيح
        # ... باقي البيانات
    }
    
    response = client.post("/api/auth/register", json=data)
    
    assert response.status_code == 400
    assert "invalid phone number" in response.json()["error"]

def test_user_registration_weak_password():
    """اختبار تسجيل بكلمة مرور ضعيفة"""
    data = {
        "password": "123",  # كلمة مرور ضعيفة
        # ... باقي البيانات
    }
    
    response = client.post("/api/auth/register", json=data)
    
    assert response.status_code == 400
    assert "password too weak" in response.json()["error"]
```

### **1.2 تسجيل الدخول**

```python
def test_login_success():
    """اختبار تسجيل دخول ناجح"""
    user = create_test_user()
    
    data = {
        "username": user.username,
        "password": "TestPass123!"
    }
    
    response = client.post("/api/auth/login", json=data)
    
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "refresh_token" in response.json()
    assert response.json()["user"]["id"] == user.id

def test_login_invalid_credentials():
    """اختبار تسجيل دخول ببيانات خاطئة"""
    data = {
        "username": "nonexistent",
        "password": "wrongpass"
    }
    
    response = client.post("/api/auth/login", json=data)
    
    assert response.status_code == 401
    assert "invalid credentials" in response.json()["error"]

def test_login_inactive_user():
    """اختبار تسجيل دخول لمستخدم معطل"""
    user = create_test_user(is_active=False)
    
    data = {
        "username": user.username,
        "password": "TestPass123!"
    }
    
    response = client.post("/api/auth/login", json=data)
    
    assert response.status_code == 403
    assert "account disabled" in response.json()["error"]
```

### **1.3 تجديد الرمز المميز**

```python
def test_token_refresh_success():
    """اختبار تجديد الرمز المميز بنجاح"""
    user = create_test_user()
    refresh_token = generate_refresh_token(user)
    
    data = {"refresh_token": refresh_token}
    
    response = client.post("/api/auth/refresh", json=data)
    
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "expires_in" in response.json()

def test_token_refresh_invalid():
    """اختبار تجديد برمز غير صحيح"""
    data = {"refresh_token": "invalid_token"}
    
    response = client.post("/api/auth/refresh", json=data)
    
    assert response.status_code == 401
    assert "invalid refresh token" in response.json()["error"]
```

---

## 👥 **2. اختبارات إدارة المستخدمين**

### **2.1 تسجيل المرشح**

```python
def test_candidate_registration_success():
    """اختبار تسجيل مرشح بنجاح"""
    party = create_test_party()
    council = create_test_council()
    
    data = {
        "username": "candidate_alex",
        "email": "candidate@example.com",
        "phone": "01098765432",
        "full_name": "د. أليكس محمد",
        "governorate_id": 1,
        "user_type": "candidate",
        "party_id": party.id,
        "council_id": council.id,
        "constituency": "الدائرة الأولى",
        "electoral_number": "001",
        "electoral_symbol": "النخلة",
        "candidate_type": "candidate",
        "biography": "خبرة 15 سنة في التعليم",
        "promises": "تحسين التعليم والصحة"
    }
    
    response = client.post("/api/auth/register", json=data)
    
    assert response.status_code == 201
    
    # التحقق من إنشاء بيانات المرشح
    candidate = Candidate.objects.get(user__username="candidate_alex")
    assert candidate.party_id == party.id
    assert candidate.council_id == council.id
    assert candidate.electoral_number == "001"

def test_candidate_registration_duplicate_electoral_number():
    """اختبار تسجيل مرشح برقم انتخابي مكرر"""
    create_test_candidate(electoral_number="001")
    
    data = {
        "electoral_number": "001",  # رقم مكرر
        # ... باقي البيانات
    }
    
    response = client.post("/api/auth/register", json=data)
    
    assert response.status_code == 400
    assert "electoral number already exists" in response.json()["error"]
```

### **2.2 تحديث بيانات المستخدم**

```python
def test_update_user_profile_success():
    """اختبار تحديث بيانات المستخدم بنجاح"""
    user = create_test_user()
    token = generate_access_token(user)
    
    data = {
        "full_name": "أحمد محمد علي المحدث",
        "phone": "01111111111",
        "address": "العنوان الجديد"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.put(f"/api/users/{user.id}", json=data, headers=headers)
    
    assert response.status_code == 200
    
    # التحقق من التحديث
    updated_user = User.objects.get(id=user.id)
    assert updated_user.full_name == "أحمد محمد علي المحدث"
    assert updated_user.phone == "01111111111"

def test_update_user_unauthorized():
    """اختبار تحديث بيانات مستخدم آخر (غير مصرح)"""
    user1 = create_test_user()
    user2 = create_test_user(username="user2")
    token = generate_access_token(user1)
    
    data = {"full_name": "محاولة تحديث"}
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.put(f"/api/users/{user2.id}", json=data, headers=headers)
    
    assert response.status_code == 403
    assert "unauthorized" in response.json()["error"]
```

---

## 📝 **3. اختبارات الشكاوى**

### **3.1 إرسال شكوى**

```python
def test_submit_complaint_success():
    """اختبار إرسال شكوى بنجاح"""
    citizen = create_test_user(user_type="citizen")
    candidate = create_test_candidate()
    complaint_type = create_test_complaint_type()
    token = generate_access_token(citizen)
    
    data = {
        "candidate_id": candidate.id,
        "complaint_type_id": complaint_type.id,
        "title": "مشكلة في الطرق",
        "description": "الطرق في حالة سيئة جداً",
        "location": "شارع النيل، القاهرة",
        "youtube_link": "https://youtube.com/watch?v=example"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/complaints", json=data, headers=headers)
    
    assert response.status_code == 201
    assert "complaint_id" in response.json()
    
    # التحقق من إنشاء الشكوى
    complaint = Complaint.objects.get(id=response.json()["complaint_id"])
    assert complaint.title == "مشكلة في الطرق"
    assert complaint.status == "pending"

def test_submit_complaint_with_attachments():
    """اختبار إرسال شكوى مع مرفقات"""
    citizen = create_test_user(user_type="citizen")
    token = generate_access_token(citizen)
    
    # إنشاء ملف تجريبي
    test_file = create_test_file("test_image.jpg", "image/jpeg")
    
    data = {
        "candidate_id": 1,
        "complaint_type_id": 1,
        "title": "شكوى مع صور",
        "description": "شكوى مع مرفقات"
    }
    
    files = {"attachments": test_file}
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post("/api/complaints", data=data, files=files, headers=headers)
    
    assert response.status_code == 201
    
    # التحقق من رفع المرفقات
    complaint_id = response.json()["complaint_id"]
    attachments = ComplaintAttachment.objects.filter(complaint_id=complaint_id)
    assert len(attachments) == 1
    assert attachments[0].file_name == "test_image.jpg"

def test_submit_complaint_invalid_file_type():
    """اختبار إرسال شكوى بملف غير مسموح"""
    citizen = create_test_user(user_type="citizen")
    token = generate_access_token(citizen)
    
    # إنشاء ملف غير مسموح
    test_file = create_test_file("virus.exe", "application/exe")
    
    data = {
        "candidate_id": 1,
        "complaint_type_id": 1,
        "title": "شكوى",
        "description": "وصف"
    }
    
    files = {"attachments": test_file}
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post("/api/complaints", data=data, files=files, headers=headers)
    
    assert response.status_code == 400
    assert "file type not allowed" in response.json()["error"]
```

### **3.2 عرض الشكاوى**

```python
def test_get_complaints_by_citizen():
    """اختبار عرض شكاوى المواطن"""
    citizen = create_test_user(user_type="citizen")
    complaints = create_test_complaints(citizen, count=5)
    token = generate_access_token(citizen)
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/complaints/my", headers=headers)
    
    assert response.status_code == 200
    assert len(response.json()["complaints"]) == 5
    assert response.json()["total"] == 5

def test_get_complaints_by_candidate():
    """اختبار عرض الشكاوى الموجهة للمرشح"""
    candidate_user = create_test_user(user_type="candidate")
    candidate = create_test_candidate(user=candidate_user)
    complaints = create_test_complaints_for_candidate(candidate, count=3)
    token = generate_access_token(candidate_user)
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/complaints/received", headers=headers)
    
    assert response.status_code == 200
    assert len(response.json()["complaints"]) == 3

def test_get_complaints_with_filters():
    """اختبار عرض الشكاوى مع فلاتر"""
    citizen = create_test_user(user_type="citizen")
    create_test_complaints_with_status(citizen, "pending", 3)
    create_test_complaints_with_status(citizen, "resolved", 2)
    token = generate_access_token(citizen)
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/complaints/my?status=pending", headers=headers)
    
    assert response.status_code == 200
    assert len(response.json()["complaints"]) == 3
    
    for complaint in response.json()["complaints"]:
        assert complaint["status"] == "pending"
```

---

## 💬 **4. اختبارات الرسائل**

### **4.1 إرسال رسالة**

```python
def test_send_message_success():
    """اختبار إرسال رسالة بنجاح"""
    sender = create_test_user(user_type="citizen")
    recipient = create_test_user(user_type="candidate", username="recipient")
    token = generate_access_token(sender)
    
    data = {
        "recipient_id": recipient.id,
        "subject": "استفسار مهم",
        "content": "أريد الاستفسار عن برنامجكم الانتخابي",
        "message_type": "direct"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/messages", json=data, headers=headers)
    
    assert response.status_code == 201
    assert "message_id" in response.json()
    
    # التحقق من إنشاء الرسالة
    message = Message.objects.get(id=response.json()["message_id"])
    assert message.sender_id == sender.id
    assert message.recipient_id == recipient.id
    assert message.subject == "استفسار مهم"

def test_send_message_to_nonexistent_user():
    """اختبار إرسال رسالة لمستخدم غير موجود"""
    sender = create_test_user()
    token = generate_access_token(sender)
    
    data = {
        "recipient_id": 99999,  # مستخدم غير موجود
        "subject": "رسالة",
        "content": "محتوى الرسالة"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/messages", json=data, headers=headers)
    
    assert response.status_code == 404
    assert "recipient not found" in response.json()["error"]

def test_send_message_with_attachment():
    """اختبار إرسال رسالة مع مرفق"""
    sender = create_test_user()
    recipient = create_test_user(username="recipient")
    token = generate_access_token(sender)
    
    test_file = create_test_file("document.pdf", "application/pdf")
    
    data = {
        "recipient_id": recipient.id,
        "subject": "وثيقة مهمة",
        "content": "أرفق لك الوثيقة المطلوبة"
    }
    
    files = {"attachment": test_file}
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post("/api/messages", data=data, files=files, headers=headers)
    
    assert response.status_code == 201
    
    # التحقق من رفع المرفق
    message_id = response.json()["message_id"]
    attachment = MessageAttachment.objects.get(message_id=message_id)
    assert attachment.file_name == "document.pdf"
```

### **4.2 قراءة الرسائل**

```python
def test_get_inbox_messages():
    """اختبار عرض رسائل الوارد"""
    user = create_test_user()
    messages = create_test_messages_for_user(user, count=5)
    token = generate_access_token(user)
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/messages/inbox", headers=headers)
    
    assert response.status_code == 200
    assert len(response.json()["messages"]) == 5
    assert response.json()["unread_count"] >= 0

def test_mark_message_as_read():
    """اختبار تمييز الرسالة كمقروءة"""
    user = create_test_user()
    message = create_test_message(recipient=user, is_read=False)
    token = generate_access_token(user)
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.put(f"/api/messages/{message.id}/read", headers=headers)
    
    assert response.status_code == 200
    
    # التحقق من تحديث حالة القراءة
    updated_message = Message.objects.get(id=message.id)
    assert updated_message.is_read == True
    assert updated_message.read_at is not None
```

---

## ⭐ **5. اختبارات التقييمات**

### **5.1 إضافة تقييم**

```python
def test_add_rating_success():
    """اختبار إضافة تقييم بنجاح"""
    citizen = create_test_user(user_type="citizen")
    candidate = create_test_candidate()
    token = generate_access_token(citizen)
    
    data = {
        "candidate_id": candidate.id,
        "rating": 4,
        "comment": "أداء جيد في الفترة الماضية",
        "category": "performance",
        "is_anonymous": False
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/ratings", json=data, headers=headers)
    
    assert response.status_code == 201
    assert "rating_id" in response.json()
    
    # التحقق من إنشاء التقييم
    rating = Rating.objects.get(id=response.json()["rating_id"])
    assert rating.rating == 4
    assert rating.category == "performance"

def test_add_duplicate_rating():
    """اختبار إضافة تقييم مكرر (نفس المواطن لنفس المرشح)"""
    citizen = create_test_user(user_type="citizen")
    candidate = create_test_candidate()
    
    # إضافة تقييم أول
    create_test_rating(citizen, candidate, rating=3)
    
    token = generate_access_token(citizen)
    
    data = {
        "candidate_id": candidate.id,
        "rating": 5,
        "comment": "تقييم جديد",
        "category": "performance"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/ratings", json=data, headers=headers)
    
    assert response.status_code == 400
    assert "already rated" in response.json()["error"]

def test_update_existing_rating():
    """اختبار تحديث تقييم موجود"""
    citizen = create_test_user(user_type="citizen")
    candidate = create_test_candidate()
    rating = create_test_rating(citizen, candidate, rating=3)
    token = generate_access_token(citizen)
    
    data = {
        "rating": 5,
        "comment": "تحديث التقييم",
        "category": "overall"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.put(f"/api/ratings/{rating.id}", json=data, headers=headers)
    
    assert response.status_code == 200
    
    # التحقق من التحديث
    updated_rating = Rating.objects.get(id=rating.id)
    assert updated_rating.rating == 5
    assert updated_rating.comment == "تحديث التقييم"
```

### **5.2 عرض التقييمات**

```python
def test_get_candidate_ratings():
    """اختبار عرض تقييمات المرشح"""
    candidate = create_test_candidate()
    ratings = create_test_ratings_for_candidate(candidate, count=10)
    
    response = client.get(f"/api/candidates/{candidate.id}/ratings")
    
    assert response.status_code == 200
    assert len(response.json()["ratings"]) == 10
    assert "average_rating" in response.json()
    assert "total_ratings" in response.json()

def test_get_ratings_summary():
    """اختبار عرض ملخص التقييمات"""
    candidate = create_test_candidate()
    create_test_ratings_with_categories(candidate)
    
    response = client.get(f"/api/candidates/{candidate.id}/ratings/summary")
    
    assert response.status_code == 200
    summary = response.json()
    
    assert "performance_avg" in summary
    assert "communication_avg" in summary
    assert "promises_avg" in summary
    assert "overall_avg" in summary
    assert summary["total_ratings"] > 0
```

---

## 🔧 **6. اختبارات الإدارة**

### **6.1 إدارة الأحزاب**

```python
def test_admin_add_party():
    """اختبار إضافة حزب جديد من الإدارة"""
    admin = create_test_admin()
    token = generate_access_token(admin)
    
    data = {
        "name_ar": "حزب جديد",
        "name_en": "New Party",
        "logo_url": "https://example.com/logo.png",
        "color": "#FF5733",
        "is_active": True
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/admin/parties", json=data, headers=headers)
    
    assert response.status_code == 201
    assert "party_id" in response.json()
    
    # التحقق من إنشاء الحزب
    party = Party.objects.get(id=response.json()["party_id"])
    assert party.name_ar == "حزب جديد"
    assert party.color == "#FF5733"

def test_admin_delete_party():
    """اختبار حذف حزب من الإدارة"""
    admin = create_test_admin()
    party = create_test_party()
    token = generate_access_token(admin)
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.delete(f"/api/admin/parties/{party.id}", headers=headers)
    
    assert response.status_code == 200
    
    # التحقق من الحذف (soft delete)
    deleted_party = Party.objects.get(id=party.id)
    assert deleted_party.is_active == False

def test_non_admin_cannot_manage_parties():
    """اختبار منع غير الإدارة من إدارة الأحزاب"""
    user = create_test_user()  # مستخدم عادي
    token = generate_access_token(user)
    
    data = {"name_ar": "حزب", "name_en": "Party"}
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/admin/parties", json=data, headers=headers)
    
    assert response.status_code == 403
    assert "admin access required" in response.json()["error"]
```

### **6.2 إدارة أنواع الشكاوى**

```python
def test_admin_add_complaint_type():
    """اختبار إضافة نوع شكوى جديد"""
    admin = create_test_admin()
    token = generate_access_token(admin)
    
    data = {
        "name_ar": "شكاوى الكهرباء",
        "name_en": "Electricity Complaints",
        "council_type": "parliament",
        "color": "#FFC300",
        "icon": "⚡",
        "description": "شكاوى متعلقة بانقطاع الكهرباء"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/admin/complaint-types", json=data, headers=headers)
    
    assert response.status_code == 201
    
    # التحقق من إنشاء النوع
    complaint_type = ComplaintType.objects.get(id=response.json()["type_id"])
    assert complaint_type.name_ar == "شكاوى الكهرباء"
    assert complaint_type.council_type == "parliament"
```

---

## 📊 **7. اختبارات الأداء**

### **7.1 اختبار الحمولة**

```python
def test_concurrent_user_registration():
    """اختبار تسجيل مستخدمين متزامن"""
    import threading
    import time
    
    results = []
    
    def register_user(index):
        data = {
            "username": f"user_{index}",
            "email": f"user{index}@example.com",
            "phone": f"0101234567{index % 10}",
            "full_name": f"مستخدم {index}",
            "governorate_id": 1,
            "user_type": "citizen",
            "password": "TestPass123!"
        }
        
        start_time = time.time()
        response = client.post("/api/auth/register", json=data)
        end_time = time.time()
        
        results.append({
            "status_code": response.status_code,
            "response_time": end_time - start_time
        })
    
    # إنشاء 50 thread للتسجيل المتزامن
    threads = []
    for i in range(50):
        thread = threading.Thread(target=register_user, args=(i,))
        threads.append(thread)
    
    # بدء جميع الـ threads
    for thread in threads:
        thread.start()
    
    # انتظار انتهاء جميع الـ threads
    for thread in threads:
        thread.join()
    
    # تحليل النتائج
    success_count = sum(1 for r in results if r["status_code"] == 201)
    avg_response_time = sum(r["response_time"] for r in results) / len(results)
    
    assert success_count >= 45  # 90% نجاح على الأقل
    assert avg_response_time < 2.0  # أقل من ثانيتين في المتوسط

def test_database_query_performance():
    """اختبار أداء استعلامات قاعدة البيانات"""
    # إنشاء بيانات تجريبية كبيرة
    create_test_users(count=1000)
    create_test_candidates(count=100)
    create_test_complaints(count=5000)
    
    import time
    
    # اختبار استعلام معقد
    start_time = time.time()
    
    response = client.get("/api/candidates?governorate=1&party=1&page=1&limit=20")
    
    end_time = time.time()
    query_time = end_time - start_time
    
    assert response.status_code == 200
    assert query_time < 1.0  # أقل من ثانية واحدة
    assert len(response.json()["candidates"]) <= 20
```

### **7.2 اختبار الذاكرة**

```python
def test_memory_usage_large_file_upload():
    """اختبار استهلاك الذاكرة عند رفع ملفات كبيرة"""
    import psutil
    import os
    
    citizen = create_test_user(user_type="citizen")
    token = generate_access_token(citizen)
    
    # قياس الذاكرة قبل الرفع
    process = psutil.Process(os.getpid())
    memory_before = process.memory_info().rss / 1024 / 1024  # MB
    
    # إنشاء ملف كبير (5MB)
    large_file = create_test_file("large_image.jpg", "image/jpeg", size_mb=5)
    
    data = {
        "candidate_id": 1,
        "complaint_type_id": 1,
        "title": "شكوى مع ملف كبير",
        "description": "اختبار رفع ملف كبير"
    }
    
    files = {"attachments": large_file}
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post("/api/complaints", data=data, files=files, headers=headers)
    
    # قياس الذاكرة بعد الرفع
    memory_after = process.memory_info().rss / 1024 / 1024  # MB
    memory_increase = memory_after - memory_before
    
    assert response.status_code == 201
    assert memory_increase < 50  # زيادة أقل من 50MB
```

---

## 🛡️ **8. اختبارات الأمان**

### **8.1 اختبار SQL Injection**

```python
def test_sql_injection_protection():
    """اختبار الحماية من SQL Injection"""
    malicious_input = "'; DROP TABLE users; --"
    
    data = {
        "username": malicious_input,
        "password": "password"
    }
    
    response = client.post("/api/auth/login", json=data)
    
    # يجب أن يفشل تسجيل الدخول دون تأثير على قاعدة البيانات
    assert response.status_code == 401
    
    # التحقق من أن جدول المستخدمين ما زال موجوداً
    users_count = User.objects.count()
    assert users_count >= 0  # الجدول لم يُحذف

def test_xss_protection():
    """اختبار الحماية من XSS"""
    citizen = create_test_user(user_type="citizen")
    token = generate_access_token(citizen)
    
    malicious_script = "<script>alert('XSS')</script>"
    
    data = {
        "candidate_id": 1,
        "complaint_type_id": 1,
        "title": malicious_script,
        "description": "وصف عادي"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/complaints", json=data, headers=headers)
    
    assert response.status_code == 201
    
    # التحقق من تنظيف المحتوى
    complaint = Complaint.objects.get(id=response.json()["complaint_id"])
    assert "<script>" not in complaint.title
    assert "alert" not in complaint.title
```

### **8.2 اختبار Rate Limiting**

```python
def test_rate_limiting():
    """اختبار تحديد معدل الطلبات"""
    user = create_test_user()
    
    # إرسال طلبات متتالية سريعة
    responses = []
    for i in range(20):  # 20 طلب في ثانية واحدة
        response = client.post("/api/auth/login", json={
            "username": user.username,
            "password": "wrong_password"
        })
        responses.append(response.status_code)
    
    # يجب أن تُرفض بعض الطلبات بسبب Rate Limiting
    rate_limited_count = sum(1 for status in responses if status == 429)
    assert rate_limited_count > 0

def test_jwt_token_expiration():
    """اختبار انتهاء صلاحية JWT Token"""
    user = create_test_user()
    
    # إنشاء token منتهي الصلاحية
    expired_token = generate_expired_token(user)
    
    headers = {"Authorization": f"Bearer {expired_token}"}
    response = client.get("/api/users/profile", headers=headers)
    
    assert response.status_code == 401
    assert "token expired" in response.json()["error"]
```

---

## 📱 **9. اختبارات الواجهة الأمامية (E2E)**

### **9.1 اختبار رحلة المستخدم الكاملة**

```python
def test_complete_user_journey():
    """اختبار رحلة المستخدم من التسجيل إلى إرسال شكوى"""
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    
    driver = webdriver.Chrome()
    wait = WebDriverWait(driver, 10)
    
    try:
        # 1. فتح الصفحة الرئيسية
        driver.get("http://localhost:3000")
        assert "نائبك" in driver.title
        
        # 2. النقر على زر التسجيل
        register_btn = wait.until(EC.element_to_be_clickable((By.ID, "register-btn")))
        register_btn.click()
        
        # 3. ملء نموذج التسجيل
        driver.find_element(By.ID, "username").send_keys("test_user")
        driver.find_element(By.ID, "email").send_keys("test@example.com")
        driver.find_element(By.ID, "phone").send_keys("01012345678")
        driver.find_element(By.ID, "full_name").send_keys("مستخدم تجريبي")
        driver.find_element(By.ID, "password").send_keys("TestPass123!")
        
        # اختيار المحافظة
        governorate_select = driver.find_element(By.ID, "governorate")
        governorate_select.send_keys("القاهرة")
        
        # إرسال النموذج
        submit_btn = driver.find_element(By.ID, "submit-register")
        submit_btn.click()
        
        # 4. التحقق من نجاح التسجيل
        success_msg = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "success-message")))
        assert "تم التسجيل بنجاح" in success_msg.text
        
        # 5. الانتقال إلى صفحة الشكاوى
        complaints_link = wait.until(EC.element_to_be_clickable((By.ID, "complaints-link")))
        complaints_link.click()
        
        # 6. إرسال شكوى جديدة
        new_complaint_btn = wait.until(EC.element_to_be_clickable((By.ID, "new-complaint-btn")))
        new_complaint_btn.click()
        
        # ملء نموذج الشكوى
        driver.find_element(By.ID, "complaint-title").send_keys("مشكلة في الطرق")
        driver.find_element(By.ID, "complaint-description").send_keys("الطرق في حالة سيئة")
        
        # اختيار المرشح
        candidate_select = driver.find_element(By.ID, "candidate-select")
        candidate_select.send_keys("د. أحمد محمد")
        
        # إرسال الشكوى
        submit_complaint_btn = driver.find_element(By.ID, "submit-complaint")
        submit_complaint_btn.click()
        
        # 7. التحقق من نجاح إرسال الشكوى
        success_msg = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "complaint-success")))
        assert "تم إرسال الشكوى بنجاح" in success_msg.text
        
    finally:
        driver.quit()

def test_responsive_design():
    """اختبار التصميم المتجاوب"""
    from selenium import webdriver
    
    driver = webdriver.Chrome()
    
    try:
        driver.get("http://localhost:3000")
        
        # اختبار على أحجام شاشة مختلفة
        screen_sizes = [
            (1920, 1080),  # Desktop
            (768, 1024),   # Tablet
            (375, 667)     # Mobile
        ]
        
        for width, height in screen_sizes:
            driver.set_window_size(width, height)
            
            # التحقق من ظهور العناصر الأساسية
            header = driver.find_element(By.TAG_NAME, "header")
            assert header.is_displayed()
            
            footer = driver.find_element(By.TAG_NAME, "footer")
            assert footer.is_displayed()
            
            # التحقق من القائمة المتجاوبة على الموبايل
            if width <= 768:
                menu_toggle = driver.find_element(By.CLASS_NAME, "menu-toggle")
                assert menu_toggle.is_displayed()
    
    finally:
        driver.quit()
```

---

## 📊 **10. تقارير الاختبار**

### **10.1 إعداد تقارير HTML**

```python
# pytest.ini
[tool:pytest]
addopts = --html=reports/report.html --self-contained-html --cov=. --cov-report=html:reports/coverage

def generate_test_report():
    """إنشاء تقرير شامل للاختبارات"""
    import subprocess
    import datetime
    
    # تشغيل جميع الاختبارات
    result = subprocess.run([
        "pytest", 
        "--html=reports/test_report.html",
        "--cov=.",
        "--cov-report=html:reports/coverage",
        "--junitxml=reports/junit.xml",
        "-v"
    ], capture_output=True, text=True)
    
    # إنشاء ملخص النتائج
    report_summary = {
        "timestamp": datetime.datetime.now().isoformat(),
        "total_tests": result.stdout.count("PASSED") + result.stdout.count("FAILED"),
        "passed": result.stdout.count("PASSED"),
        "failed": result.stdout.count("FAILED"),
        "coverage": extract_coverage_percentage(result.stdout),
        "duration": extract_test_duration(result.stdout)
    }
    
    return report_summary
```

### **10.2 اختبارات الأداء المستمرة**

```python
def test_performance_benchmarks():
    """اختبار معايير الأداء"""
    benchmarks = {
        "user_registration": {"max_time": 2.0, "success_rate": 0.95},
        "user_login": {"max_time": 1.0, "success_rate": 0.99},
        "complaint_submission": {"max_time": 3.0, "success_rate": 0.90},
        "message_sending": {"max_time": 1.5, "success_rate": 0.95},
        "rating_submission": {"max_time": 1.0, "success_rate": 0.98}
    }
    
    results = {}
    
    for test_name, benchmark in benchmarks.items():
        # تشغيل الاختبار 100 مرة
        times = []
        successes = 0
        
        for _ in range(100):
            start_time = time.time()
            success = run_performance_test(test_name)
            end_time = time.time()
            
            times.append(end_time - start_time)
            if success:
                successes += 1
        
        avg_time = sum(times) / len(times)
        success_rate = successes / 100
        
        results[test_name] = {
            "avg_time": avg_time,
            "success_rate": success_rate,
            "passed": avg_time <= benchmark["max_time"] and success_rate >= benchmark["success_rate"]
        }
        
        # التحقق من المعايير
        assert avg_time <= benchmark["max_time"], f"{test_name} too slow: {avg_time}s"
        assert success_rate >= benchmark["success_rate"], f"{test_name} success rate too low: {success_rate}"
    
    return results
```

---

## 🎯 **خلاصة استراتيجية الاختبار**

### **معايير النجاح:**
- ✅ **تغطية الكود**: 85%+
- ✅ **معدل النجاح**: 95%+
- ✅ **وقت الاستجابة**: < 2 ثانية
- ✅ **الأمان**: 100% حماية من الثغرات الشائعة

### **أدوات الاختبار:**
- **pytest**: اختبارات الوحدة والتكامل
- **Selenium**: اختبارات الواجهة الأمامية
- **locust**: اختبارات الحمولة
- **coverage.py**: قياس تغطية الكود

### **التشغيل التلقائي:**
```bash
# تشغيل جميع الاختبارات
pytest

# تشغيل اختبارات محددة
pytest tests/test_auth.py

# تشغيل مع تقرير التغطية
pytest --cov=. --cov-report=html

# تشغيل اختبارات الأداء
pytest tests/test_performance.py -v
```

هذه السيناريوهات تغطي جميع جوانب التطبيق وتضمن جودة عالية وأداء ممتاز.
