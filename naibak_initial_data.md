# البيانات الأولية والقوائم - مشروع Naebak

---

## 🏛️ **المحافظات المصرية (27 محافظة)**

```json
[
  {"name": "القاهرة", "name_en": "Cairo", "code": "CAI"},
  {"name": "الجيزة", "name_en": "Giza", "code": "GIZ"},
  {"name": "الإسكندرية", "name_en": "Alexandria", "code": "ALX"},
  {"name": "الدقهلية", "name_en": "Dakahlia", "code": "DAK"},
  {"name": "البحر الأحمر", "name_en": "Red Sea", "code": "RSS"},
  {"name": "البحيرة", "name_en": "Beheira", "code": "BEH"},
  {"name": "الفيوم", "name_en": "Fayoum", "code": "FAY"},
  {"name": "الغربية", "name_en": "Gharbia", "code": "GHR"},
  {"name": "الإسماعيلية", "name_en": "Ismailia", "code": "ISM"},
  {"name": "المنوفية", "name_en": "Monufia", "code": "MNF"},
  {"name": "المنيا", "name_en": "Minya", "code": "MNY"},
  {"name": "القليوبية", "name_en": "Qalyubia", "code": "QLY"},
  {"name": "الوادي الجديد", "name_en": "New Valley", "code": "WAD"},
  {"name": "شمال سيناء", "name_en": "North Sinai", "code": "NSI"},
  {"name": "جنوب سيناء", "name_en": "South Sinai", "code": "SSI"},
  {"name": "الشرقية", "name_en": "Sharqia", "code": "SHR"},
  {"name": "سوهاج", "name_en": "Sohag", "code": "SOH"},
  {"name": "السويس", "name_en": "Suez", "code": "SUZ"},
  {"name": "أسوان", "name_en": "Aswan", "code": "ASW"},
  {"name": "أسيوط", "name_en": "Asyut", "code": "ASY"},
  {"name": "بني سويف", "name_en": "Beni Suef", "code": "BNS"},
  {"name": "بورسعيد", "name_en": "Port Said", "code": "PTS"},
  {"name": "دمياط", "name_en": "Damietta", "code": "DAM"},
  {"name": "كفر الشيخ", "name_en": "Kafr El Sheikh", "code": "KFS"},
  {"name": "مطروح", "name_en": "Matrouh", "code": "MAT"},
  {"name": "الأقصر", "name_en": "Luxor", "code": "LUX"},
  {"name": "قنا", "name_en": "Qena", "code": "QEN"}
]
```

---

## 🎉 **الأحزاب السياسية المصرية**

```json
[
  {"name": "حزب الوفد", "name_en": "Al-Wafd Party", "abbreviation": "الوفد"},
  {"name": "الحزب الوطني الديمقراطي", "name_en": "National Democratic Party", "abbreviation": "الوطني"},
  {"name": "حزب الغد", "name_en": "Al-Ghad Party", "abbreviation": "الغد"},
  {"name": "حزب التجمع الوطني التقدمي الوحدوي", "name_en": "National Progressive Unionist Party", "abbreviation": "التجمع"},
  {"name": "حزب الناصري", "name_en": "Nasserist Party", "abbreviation": "الناصري"},
  {"name": "حزب الكرامة", "name_en": "Al-Karama Party", "abbreviation": "الكرامة"},
  {"name": "حزب الوسط الجديد", "name_en": "New Wasat Party", "abbreviation": "الوسط"},
  {"name": "حزب الحرية المصري", "name_en": "Egyptian Freedom Party", "abbreviation": "الحرية"},
  {"name": "حزب المصريين الأحرار", "name_en": "Free Egyptians Party", "abbreviation": "المصريين الأحرار"},
  {"name": "حزب النور", "name_en": "Al-Nour Party", "abbreviation": "النور"},
  {"name": "حزب البناء والتنمية", "name_en": "Building and Development Party", "abbreviation": "البناء والتنمية"},
  {"name": "حزب الإصلاح والتنمية", "name_en": "Reform and Development Party", "abbreviation": "الإصلاح والتنمية"},
  {"name": "حزب مستقبل وطن", "name_en": "Future of a Nation Party", "abbreviation": "مستقبل وطن"},
  {"name": "حزب المؤتمر", "name_en": "Conference Party", "abbreviation": "المؤتمر"},
  {"name": "حزب الشعب الجمهوري", "name_en": "Republican People's Party", "abbreviation": "الشعب الجمهوري"},
  {"name": "مستقل", "name_en": "Independent", "abbreviation": "مستقل"}
]
```

---

## 📋 **فئات الشكاوى**

```json
[
  {"name": "البنية التحتية", "name_en": "Infrastructure", "icon": "🏗️"},
  {"name": "الصحة", "name_en": "Health", "icon": "🏥"},
  {"name": "التعليم", "name_en": "Education", "icon": "🎓"},
  {"name": "الأمن", "name_en": "Security", "icon": "🛡️"},
  {"name": "الخدمات العامة", "name_en": "Public Services", "icon": "🏛️"},
  {"name": "النقل والمواصلات", "name_en": "Transportation", "icon": "🚌"},
  {"name": "البيئة", "name_en": "Environment", "icon": "🌱"},
  {"name": "الإسكان", "name_en": "Housing", "icon": "🏠"},
  {"name": "العمل والتوظيف", "name_en": "Employment", "icon": "💼"},
  {"name": "الشؤون الاجتماعية", "name_en": "Social Affairs", "icon": "👥"},
  {"name": "أخرى", "name_en": "Other", "icon": "📝"}
]
```

---

## 📊 **حالات الشكوى**

```json
[
  {"status": "pending", "name": "في الانتظار", "name_en": "Pending", "color": "#FFC107"},
  {"status": "under_review", "name": "قيد المراجعة", "name_en": "Under Review", "color": "#17A2B8"},
  {"status": "assigned", "name": "تم التعيين", "name_en": "Assigned", "color": "#007BFF"},
  {"status": "resolved", "name": "تم الحل", "name_en": "Resolved", "color": "#28A745"},
  {"status": "rejected", "name": "مرفوضة", "name_en": "Rejected", "color": "#DC3545"}
]
```

---

## 🔔 **أنواع الإشعارات**

```json
[
  {"type": "message", "name": "رسالة جديدة", "name_en": "New Message", "icon": "💬"},
  {"type": "complaint", "name": "شكوى", "name_en": "Complaint", "icon": "📋"},
  {"type": "rating", "name": "تقييم", "name_en": "Rating", "icon": "⭐"},
  {"type": "system", "name": "إشعار النظام", "name_en": "System Notification", "icon": "🔔"},
  {"type": "achievement", "name": "إنجاز", "name_en": "Achievement", "icon": "🏆"},
  {"type": "event", "name": "فعالية", "name_en": "Event", "icon": "📅"}
]
```

---

## 👤 **أنواع المستخدمين**

```json
[
  {
    "type": "citizen", 
    "name": "مواطن", 
    "name_en": "Citizen",
    "description": "مواطن له صوت انتخابي",
    "required_fields": ["phone_number", "governorate"]
  },
  {
    "type": "candidate", 
    "name": "مرشح", 
    "name_en": "Candidate",
    "description": "مرشح لعضوية مجلس الشيوخ أو النواب",
    "required_fields": ["phone_number", "governorate", "council_type", "party"]
  },
  {
    "type": "current_member", 
    "name": "عضو حالي", 
    "name_en": "Current Member",
    "description": "عضو فعلي في مجلس الشيوخ أو النواب",
    "required_fields": ["phone_number", "governorate", "council_type", "party"]
  },
  {
    "type": "admin", 
    "name": "إدارة", 
    "name_en": "Admin",
    "description": "إدارة النظام",
    "required_fields": ["phone_number"]
  }
]
```

---

## 🏛️ **أنواع المجالس**

```json
[
  {
    "type": "parliament", 
    "name": "مجلس النواب", 
    "name_en": "Parliament",
    "description": "المجلس الأساسي للتشريع",
    "term_duration": 5,
    "total_seats": 596
  },
  {
    "type": "senate", 
    "name": "مجلس الشيوخ", 
    "name_en": "Senate",
    "description": "المجلس الاستشاري العلوي", 
    "term_duration": 5,
    "total_seats": 300
  }
]
```

---

## 👤 **أنواع العضوية**

```json
[
  {
    "type": "candidate", 
    "name": "مرشح", 
    "name_en": "Candidate",
    "description": "مرشح لعضوية المجلس"
  },
  {
    "type": "current_member", 
    "name": "عضو حالي", 
    "name_en": "Current Member",
    "description": "عضو فعلي في المجلس"
  }
]
```

---

## 🎪 **أنواع الفعاليات**

```json
[
  {"type": "conference", "name": "مؤتمر", "name_en": "Conference", "icon": "🎤"},
  {"type": "meeting", "name": "اجتماع", "name_en": "Meeting", "icon": "👥"},
  {"type": "celebration", "name": "احتفالية", "name_en": "Celebration", "icon": "🎉"},
  {"type": "workshop", "name": "ورشة عمل", "name_en": "Workshop", "icon": "🛠️"},
  {"type": "visit", "name": "زيارة ميدانية", "name_en": "Field Visit", "icon": "🚶"},
  {"type": "other", "name": "أخرى", "name_en": "Other", "icon": "📅"}
]
```

---

## 📱 **منصات التواصل الاجتماعي**

```json
[
  {
    "platform": "facebook",
    "name": "فيسبوك",
    "name_en": "Facebook",
    "icon_class": "fab fa-facebook-f",
    "color": "#1877F2",
    "default_url": "https://facebook.com/naibak"
  },
  {
    "platform": "twitter",
    "name": "تويتر",
    "name_en": "Twitter",
    "icon_class": "fab fa-twitter",
    "color": "#1DA1F2",
    "default_url": "https://twitter.com/naibak"
  },
  {
    "platform": "instagram",
    "name": "إنستغرام",
    "name_en": "Instagram",
    "icon_class": "fab fa-instagram",
    "color": "#E4405F",
    "default_url": "https://instagram.com/naibak"
  },
  {
    "platform": "youtube",
    "name": "يوتيوب",
    "name_en": "YouTube",
    "icon_class": "fab fa-youtube",
    "color": "#FF0000",
    "default_url": "https://youtube.com/naibak"
  },
  {
    "platform": "linkedin",
    "name": "لينكد إن",
    "name_en": "LinkedIn",
    "icon_class": "fab fa-linkedin-in",
    "color": "#0A66C2",
    "default_url": "https://linkedin.com/company/naibak"
  }
]
```

---

## 🎨 **الألوان الافتراضية**

```json
{
  "green": {
    "hex": "#28A745",
    "name": "أخضر",
    "name_en": "Green",
    "usage": "اللوجو، الفوتر، الأزرار الرئيسية"
  },
  "orange": {
    "hex": "#FF6B35",
    "name": "برتقالي",
    "name_en": "Orange", 
    "usage": "الشريط الإخباري، الأزرار الثانوية"
  },
  "white": {
    "hex": "#FFFFFF",
    "name": "أبيض",
    "name_en": "White",
    "usage": "الخلفيات، النصوص على الخلفيات الداكنة"
  },
  "dark_gray": {
    "hex": "#333333",
    "name": "رمادي غامق",
    "name_en": "Dark Gray",
    "usage": "النصوص، الشريط الإخباري"
  },
  "light_gray": {
    "hex": "#F5F5F5",
    "name": "رمادي فاتح",
    "name_en": "Light Gray",
    "usage": "الخلفيات الثانوية، الحدود"
  }
}
```

---

## 📄 **صفحات الموقع الثابتة**

```json
[
  {"slug": "about", "title": "من نحن", "title_en": "About Us"},
  {"slug": "contact", "title": "اتصل بنا", "title_en": "Contact Us"},
  {"slug": "privacy", "title": "سياسات الخصوصية", "title_en": "Privacy Policy"},
  {"slug": "terms", "title": "اشتراطات واتفاقيات", "title_en": "Terms & Conditions"},
  {"slug": "faq", "title": "أسئلة وأجوبة", "title_en": "FAQ"}
]
```

---

## 📊 **أولويات الشكاوى**

```json
[
  {"priority": "low", "name": "منخفضة", "name_en": "Low", "color": "#28A745"},
  {"priority": "medium", "name": "متوسطة", "name_en": "Medium", "color": "#FFC107"},
  {"priority": "high", "name": "عالية", "name_en": "High", "color": "#FF6B35"},
  {"priority": "urgent", "name": "عاجلة", "name_en": "Urgent", "color": "#DC3545"}
]
```

---

## 📎 **أنواع الملفات المسموحة**

```json
{
  "images": {
    "extensions": ["jpg", "jpeg", "png", "gif", "webp"],
    "max_size": "5MB",
    "mime_types": ["image/jpeg", "image/png", "image/gif", "image/webp"]
  },
  "documents": {
    "extensions": ["pdf", "doc", "docx"],
    "max_size": "10MB", 
    "mime_types": ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
  },
  "max_files_per_complaint": 10,
  "total_max_size": "50MB"
}
```

---

## ⚙️ **إعدادات النظام الافتراضية**

```json
{
  "visitor_counter": {
    "min_random": 1000,
    "max_random": 1500,
    "update_interval": 30
  },
  "ratings": {
    "min_stars": 1,
    "max_stars": 5,
    "featured_threshold": 4.5,
    "featured_min_votes": 5000
  },
  "messages": {
    "max_length": 500,
    "allow_attachments": false
  },
  "complaints": {
    "max_length": 1500,
    "max_files": 10,
    "max_file_size": "10MB"
  },
  "news_ticker": {
    "max_length": 300,
    "scroll_speed": "50px/s",
    "direction": "rtl"
  }
}
```

---

## 🔐 **أدوار المستخدمين والصلاحيات**

```json
{
  "citizen": {
    "permissions": [
      "send_messages",
      "submit_complaints", 
      "rate_representatives",
      "view_representatives",
      "manage_own_profile"
    ]
  },
  "representative": {
    "permissions": [
      "receive_messages",
      "reply_messages",
      "receive_complaints",
      "resolve_complaints",
      "manage_own_profile",
      "add_achievements",
      "add_events",
      "upload_banner"
    ]
  },
  "admin": {
    "permissions": [
      "manage_all_users",
      "manage_complaints",
      "manage_ratings",
      "manage_news",
      "manage_banners",
      "manage_system_settings",
      "view_statistics",
      "approve_content"
    ]
  }
}
```

---

## 📱 **قائمة التنقل الرئيسية**

```json
[
  {"title": "الرئيسية", "title_en": "Home", "url": "/", "icon": "🏠"},
  {"title": "المرشحين", "title_en": "Representatives", "url": "/representatives", "icon": "👥"},
  {"title": "من نحن", "title_en": "About", "url": "/about", "icon": "ℹ️"},
  {"title": "اتصل بنا", "title_en": "Contact", "url": "/contact", "icon": "📞"},
  {"title": "الأسئلة الشائعة", "title_en": "FAQ", "url": "/faq", "icon": "❓"}
]
```

---

## 🌟 **رسائل النظام الافتراضية**

```json
{
  "welcome_message": "مرحباً بك في منصة نائبك - جسر التواصل بين المواطن والنائب",
  "registration_success": "تم تسجيل حسابك بنجاح! يرجى تفعيل حسابك من خلال الرابط المرسل على بريدك الإلكتروني",
  "complaint_submitted": "تم إرسال شكواك بنجاح. سيتم مراجعتها من قبل الإدارة خلال 24 ساعة",
  "message_sent": "تم إرسال رسالتك بنجاح",
  "rating_submitted": "شكراً لك على تقييمك",
  "profile_updated": "تم تحديث بياناتك بنجاح",
  "password_reset": "تم إرسال رابط إعادة تعيين كلمة المرور على بريدك الإلكتروني"
}
```
