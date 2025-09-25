# Naebak Sample Data Sets - مجموعات البيانات التجريبية

## 🎯 **نظرة عامة**

هذا الملف يحتوي على مجموعات بيانات تجريبية شاملة لاختبار جميع وظائف تطبيق نائبك، مما يسهل التطوير والاختبار ويضمن عمل النظام بشكل صحيح.

---

## 👥 **1. بيانات المستخدمين التجريبية**

### **1.1 المواطنون**

```json
{
  "citizens": [
    {
      "id": 1,
      "name": "أحمد محمد علي",
      "email": "ahmed.mohamed@example.com",
      "phone": "01012345678",
      "whatsapp": "01012345678",
      "governorate": "القاهرة",
      "address": "شارع التحرير، وسط البلد",
      "national_id": "29801011234567",
      "birth_date": "1998-01-01",
      "gender": "ذكر",
      "user_type": "مواطن",
      "is_verified": true,
      "registration_date": "2024-01-15T10:30:00Z",
      "last_login": "2024-12-25T14:20:00Z",
      "complaints_count": 3,
      "messages_sent": 7,
      "ratings_given": 12
    },
    {
      "id": 2,
      "name": "فاطمة أحمد حسن",
      "email": "fatma.ahmed@example.com",
      "phone": "01098765432",
      "whatsapp": "01098765432",
      "governorate": "الجيزة",
      "address": "شارع الهرم، الهرم",
      "national_id": "29205151234568",
      "birth_date": "1992-05-15",
      "gender": "أنثى",
      "user_type": "مواطن",
      "is_verified": true,
      "registration_date": "2024-02-20T09:15:00Z",
      "last_login": "2024-12-24T16:45:00Z",
      "complaints_count": 1,
      "messages_sent": 3,
      "ratings_given": 8
    },
    {
      "id": 3,
      "name": "محمد عبد الرحمن سالم",
      "email": "mohamed.salem@example.com",
      "phone": "01156789012",
      "whatsapp": "01156789012",
      "governorate": "الإسكندرية",
      "address": "شارع الكورنيش، سيدي جابر",
      "national_id": "28512201234569",
      "birth_date": "1985-12-20",
      "gender": "ذكر",
      "user_type": "مواطن",
      "is_verified": false,
      "registration_date": "2024-03-10T11:00:00Z",
      "last_login": "2024-12-23T08:30:00Z",
      "complaints_count": 5,
      "messages_sent": 2,
      "ratings_given": 15
    },
    {
      "id": 4,
      "name": "نورا سامي إبراهيم",
      "email": "nora.samy@example.com",
      "phone": "01234567890",
      "whatsapp": "01234567890",
      "governorate": "القليوبية",
      "address": "شارع الجمهورية، شبرا الخيمة",
      "national_id": "29010101234570",
      "birth_date": "1990-01-01",
      "gender": "أنثى",
      "user_type": "مواطن",
      "is_verified": true,
      "registration_date": "2024-04-05T13:45:00Z",
      "last_login": "2024-12-25T12:15:00Z",
      "complaints_count": 2,
      "messages_sent": 5,
      "ratings_given": 6
    },
    {
      "id": 5,
      "name": "خالد حسام الدين",
      "email": "khaled.hossam@example.com",
      "phone": "01087654321",
      "whatsapp": "01087654321",
      "governorate": "الدقهلية",
      "address": "شارع الجلاء، المنصورة",
      "national_id": "28703151234571",
      "birth_date": "1987-03-15",
      "gender": "ذكر",
      "user_type": "مواطن",
      "is_verified": true,
      "registration_date": "2024-05-12T15:20:00Z",
      "last_login": "2024-12-22T19:30:00Z",
      "complaints_count": 0,
      "messages_sent": 1,
      "ratings_given": 3
    }
  ]
}
```

### **1.2 المرشحون**

```json
{
  "candidates": [
    {
      "id": 6,
      "name": "د. عمرو محمد الشريف",
      "email": "amr.elsherif@example.com",
      "phone": "01011111111",
      "whatsapp": "01011111111",
      "governorate": "القاهرة",
      "address": "شارع قصر العيني، القاهرة",
      "national_id": "27508101234572",
      "birth_date": "1975-08-10",
      "gender": "ذكر",
      "user_type": "مرشح",
      "council_type": "مجلس النواب",
      "membership_status": "مرشح",
      "party": "حزب الوفد",
      "constituency": "دائرة القاهرة الأولى",
      "electoral_number": "001",
      "electoral_symbol": "🌟",
      "campaign_slogan": "من أجل مصر أقوى",
      "biography": "دكتور في الاقتصاد، خبرة 20 سنة في التنمية الاقتصادية",
      "education": "دكتوراه اقتصاد - جامعة القاهرة",
      "experience": "أستاذ الاقتصاد بجامعة القاهرة، مستشار اقتصادي سابق",
      "is_verified": true,
      "registration_date": "2024-01-20T10:00:00Z",
      "last_login": "2024-12-25T09:00:00Z",
      "messages_received": 45,
      "average_rating": 4.2,
      "total_ratings": 28,
      "complaints_about": 2,
      "profile_views": 1250
    },
    {
      "id": 7,
      "name": "أ. سارة أحمد فؤاد",
      "email": "sara.fouad@example.com",
      "phone": "01022222222",
      "whatsapp": "01022222222",
      "governorate": "الجيزة",
      "address": "شارع الدقي، الدقي",
      "national_id": "28012201234573",
      "birth_date": "1980-12-20",
      "gender": "أنثى",
      "user_type": "مرشح",
      "council_type": "مجلس الشيوخ",
      "membership_status": "مرشح",
      "party": "حزب المصريين الأحرار",
      "constituency": "دائرة الجيزة الثانية",
      "electoral_number": "002",
      "electoral_symbol": "🌙",
      "campaign_slogan": "معاً نبني المستقبل",
      "biography": "محامية ونشطة في مجال حقوق المرأة والطفل",
      "education": "ليسانس حقوق - جامعة عين شمس، ماجستير قانون دولي",
      "experience": "محامية لدى نقابة المحامين، رئيسة جمعية حقوق المرأة",
      "is_verified": true,
      "registration_date": "2024-02-15T14:30:00Z",
      "last_login": "2024-12-24T18:45:00Z",
      "messages_received": 32,
      "average_rating": 4.5,
      "total_ratings": 19,
      "complaints_about": 0,
      "profile_views": 890
    },
    {
      "id": 8,
      "name": "م. حسام الدين محمود",
      "email": "hossam.mahmoud@example.com",
      "phone": "01033333333",
      "whatsapp": "01033333333",
      "governorate": "الإسكندرية",
      "address": "شارع فؤاد، الإسكندرية",
      "national_id": "27209151234574",
      "birth_date": "1972-09-15",
      "gender": "ذكر",
      "user_type": "مرشح",
      "council_type": "مجلس النواب",
      "membership_status": "مرشح",
      "party": "حزب مستقبل وطن",
      "constituency": "دائرة الإسكندرية الأولى",
      "electoral_number": "003",
      "electoral_symbol": "⚡",
      "campaign_slogan": "التنمية والتطوير",
      "biography": "مهندس مدني، خبرة في مشاريع البنية التحتية",
      "education": "بكالوريوس هندسة مدنية - جامعة الإسكندرية",
      "experience": "مدير مشاريع في شركة المقاولون العرب، عضو نقابة المهندسين",
      "is_verified": true,
      "registration_date": "2024-03-01T11:15:00Z",
      "last_login": "2024-12-25T07:30:00Z",
      "messages_received": 67,
      "average_rating": 3.8,
      "total_ratings": 41,
      "complaints_about": 3,
      "profile_views": 1580
    }
  ]
}
```

### **1.3 الأعضاء الحاليون**

```json
{
  "current_members": [
    {
      "id": 9,
      "name": "د. محمد عبد الله الطيب",
      "email": "mohamed.altayeb@parliament.gov.eg",
      "phone": "01044444444",
      "whatsapp": "01044444444",
      "governorate": "القاهرة",
      "address": "شارع مجلس الشعب، القاهرة",
      "national_id": "26511101234575",
      "birth_date": "1965-11-10",
      "gender": "ذكر",
      "user_type": "عضو حالي",
      "council_type": "مجلس النواب",
      "membership_status": "عضو حالي",
      "party": "حزب الوفد",
      "constituency": "دائرة القاهرة الثالثة",
      "membership_start_date": "2020-01-15",
      "committees": ["لجنة الشؤون الاقتصادية", "لجنة الخطة والموازنة"],
      "biography": "عضو مجلس النواب منذ 2020، خبرة في الشؤون الاقتصادية",
      "education": "دكتوراه علوم سياسية - جامعة القاهرة",
      "experience": "أستاذ العلوم السياسية، عضو مجلس النواب السابق",
      "is_verified": true,
      "registration_date": "2024-01-10T08:00:00Z",
      "last_login": "2024-12-25T10:15:00Z",
      "messages_received": 156,
      "average_rating": 4.1,
      "total_ratings": 89,
      "complaints_about": 5,
      "profile_views": 3420,
      "bills_proposed": 12,
      "sessions_attended": 45,
      "attendance_rate": 0.92
    },
    {
      "id": 10,
      "name": "د. نادية حسن الشامي",
      "email": "nadia.elshamy@senate.gov.eg",
      "phone": "01055555555",
      "whatsapp": "01055555555",
      "governorate": "الجيزة",
      "address": "شارع مجلس الشيوخ، الجيزة",
      "national_id": "26803201234576",
      "birth_date": "1968-03-20",
      "gender": "أنثى",
      "user_type": "عضو حالي",
      "council_type": "مجلس الشيوخ",
      "membership_status": "عضو حالي",
      "party": "حزب المصريين الأحرار",
      "constituency": "دائرة الجيزة الأولى",
      "membership_start_date": "2020-10-01",
      "committees": ["لجنة التعليم والبحث العلمي", "لجنة الثقافة والإعلام"],
      "biography": "عضو مجلس الشيوخ، متخصصة في قضايا التعليم والثقافة",
      "education": "دكتوراه في التربية - جامعة عين شمس",
      "experience": "أستاذ التربية، وزيرة التعليم السابقة",
      "is_verified": true,
      "registration_date": "2024-01-12T09:30:00Z",
      "last_login": "2024-12-24T16:20:00Z",
      "messages_received": 203,
      "average_rating": 4.6,
      "total_ratings": 127,
      "complaints_about": 1,
      "profile_views": 4150,
      "bills_proposed": 8,
      "sessions_attended": 38,
      "attendance_rate": 0.95
    }
  ]
}
```

---

## 📝 **2. بيانات الشكاوى التجريبية**

### **2.1 شكاوى مجلس النواب**

```json
{
  "complaints_parliament": [
    {
      "id": 1,
      "title": "تدهور حالة الطرق في منطقة شبرا الخيمة",
      "description": "الطرق في منطقة شبرا الخيمة في حالة سيئة جداً مما يسبب صعوبة في المرور وأضرار للسيارات. نطالب بإصلاح الطرق وتطويرها.",
      "complaint_type": "البنية التحتية والطرق",
      "citizen_id": 4,
      "citizen_name": "نورا سامي إبراهيم",
      "target_member_id": 9,
      "target_member_name": "د. محمد عبد الله الطيب",
      "governorate": "القليوبية",
      "location": "شبرا الخيمة - شارع الجمهورية",
      "status": "قيد المراجعة",
      "priority": "عالية",
      "created_at": "2024-12-20T10:30:00Z",
      "updated_at": "2024-12-22T14:15:00Z",
      "attachments": [
        {
          "id": 1,
          "filename": "road_damage_1.jpg",
          "file_type": "image/jpeg",
          "file_size": 2048576,
          "description": "صورة توضح تدهور الطريق"
        },
        {
          "id": 2,
          "filename": "road_damage_2.jpg",
          "file_type": "image/jpeg",
          "file_size": 1856432,
          "description": "صورة أخرى للأضرار"
        }
      ],
      "youtube_link": "",
      "response": "",
      "response_date": null,
      "views_count": 45,
      "likes_count": 12,
      "shares_count": 3
    },
    {
      "id": 2,
      "title": "نقص في الأطباء بمستشفى المنصورة العام",
      "description": "يعاني مستشفى المنصورة العام من نقص شديد في الأطباء المتخصصين، مما يؤدي إلى تأخير في العلاج وازدحام شديد. نطالب بتعيين أطباء إضافيين.",
      "complaint_type": "الخدمات الصحية",
      "citizen_id": 5,
      "citizen_name": "خالد حسام الدين",
      "target_member_id": 9,
      "target_member_name": "د. محمد عبد الله الطيب",
      "governorate": "الدقهلية",
      "location": "المنصورة - مستشفى المنصورة العام",
      "status": "تم الرد",
      "priority": "عالية جداً",
      "created_at": "2024-12-18T14:20:00Z",
      "updated_at": "2024-12-24T09:45:00Z",
      "attachments": [
        {
          "id": 3,
          "filename": "hospital_crowding.mp4",
          "file_type": "video/mp4",
          "file_size": 15728640,
          "description": "فيديو يوضح الازدحام في المستشفى"
        }
      ],
      "youtube_link": "https://youtube.com/watch?v=example123",
      "response": "تم التواصل مع وزارة الصحة لدراسة الموضوع وسيتم تعيين 5 أطباء إضافيين خلال الشهر القادم.",
      "response_date": "2024-12-24T09:45:00Z",
      "views_count": 128,
      "likes_count": 34,
      "shares_count": 8
    },
    {
      "id": 3,
      "title": "مشكلة في شبكة الصرف الصحي بحي الهرم",
      "description": "تعاني منطقة الهرم من مشاكل في شبكة الصرف الصحي مما يسبب فيضانات في الشوارع وروائح كريهة. الوضع يزداد سوءاً في فصل الشتاء.",
      "complaint_type": "البنية التحتية والطرق",
      "citizen_id": 2,
      "citizen_name": "فاطمة أحمد حسن",
      "target_member_id": 9,
      "target_member_name": "د. محمد عبد الله الطيب",
      "governorate": "الجيزة",
      "location": "الهرم - شارع الهرم الرئيسي",
      "status": "جديدة",
      "priority": "متوسطة",
      "created_at": "2024-12-25T08:15:00Z",
      "updated_at": "2024-12-25T08:15:00Z",
      "attachments": [
        {
          "id": 4,
          "filename": "sewage_problem.jpg",
          "file_type": "image/jpeg",
          "file_size": 3145728,
          "description": "صورة توضح مشكلة الصرف الصحي"
        },
        {
          "id": 5,
          "filename": "location_map.pdf",
          "file_type": "application/pdf",
          "file_size": 524288,
          "description": "خريطة توضح موقع المشكلة"
        }
      ],
      "youtube_link": "",
      "response": "",
      "response_date": null,
      "views_count": 12,
      "likes_count": 2,
      "shares_count": 0
    }
  ]
}
```

### **2.2 شكاوى مجلس الشيوخ**

```json
{
  "complaints_senate": [
    {
      "id": 4,
      "title": "تطوير المناهج التعليمية في المدارس الثانوية",
      "description": "المناهج التعليمية الحالية في المرحلة الثانوية تحتاج إلى تطوير وتحديث لتواكب التطورات العلمية والتكنولوجية الحديثة.",
      "complaint_type": "التعليم والجامعات",
      "citizen_id": 1,
      "citizen_name": "أحمد محمد علي",
      "target_member_id": 10,
      "target_member_name": "د. نادية حسن الشامي",
      "governorate": "القاهرة",
      "location": "مدارس وسط البلد",
      "status": "قيد الدراسة",
      "priority": "متوسطة",
      "created_at": "2024-12-15T11:00:00Z",
      "updated_at": "2024-12-23T16:30:00Z",
      "attachments": [
        {
          "id": 6,
          "filename": "curriculum_analysis.pdf",
          "file_type": "application/pdf",
          "file_size": 1048576,
          "description": "تحليل للمناهج الحالية"
        }
      ],
      "youtube_link": "",
      "response": "تم إحالة الموضوع إلى لجنة التعليم والبحث العلمي لدراسته وإعداد تقرير مفصل.",
      "response_date": "2024-12-23T16:30:00Z",
      "views_count": 67,
      "likes_count": 18,
      "shares_count": 5
    },
    {
      "id": 5,
      "title": "دعم الأنشطة الثقافية في المحافظات",
      "description": "نطالب بزيادة الدعم للأنشطة الثقافية والفنية في المحافظات وإنشاء مراكز ثقافية جديدة لخدمة الشباب.",
      "complaint_type": "الثقافة والفنون",
      "citizen_id": 3,
      "citizen_name": "محمد عبد الرحمن سالم",
      "target_member_id": 10,
      "target_member_name": "د. نادية حسن الشامي",
      "governorate": "الإسكندرية",
      "location": "مراكز الشباب بالإسكندرية",
      "status": "جديدة",
      "priority": "منخفضة",
      "created_at": "2024-12-24T13:45:00Z",
      "updated_at": "2024-12-24T13:45:00Z",
      "attachments": [
        {
          "id": 7,
          "filename": "cultural_activities_proposal.docx",
          "file_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "file_size": 786432,
          "description": "مقترح للأنشطة الثقافية"
        }
      ],
      "youtube_link": "",
      "response": "",
      "response_date": null,
      "views_count": 23,
      "likes_count": 7,
      "shares_count": 1
    }
  ]
}
```

---

## 💬 **3. بيانات الرسائل التجريبية**

### **3.1 رسائل للمرشحين**

```json
{
  "messages_to_candidates": [
    {
      "id": 1,
      "subject": "استفسار حول برنامجك الانتخابي",
      "content": "أستاذ عمرو، أود الاستفسار عن خططك لتطوير التعليم في دائرتك الانتخابية. هل لديك برامج محددة لتحسين جودة التعليم؟",
      "sender_id": 1,
      "sender_name": "أحمد محمد علي",
      "sender_type": "مواطن",
      "recipient_id": 6,
      "recipient_name": "د. عمرو محمد الشريف",
      "recipient_type": "مرشح",
      "message_type": "استفسار",
      "status": "تم الرد",
      "priority": "متوسطة",
      "created_at": "2024-12-20T14:30:00Z",
      "read_at": "2024-12-20T16:45:00Z",
      "replied_at": "2024-12-21T10:15:00Z",
      "reply_content": "شكراً لك على اهتمامك. لدي خطة شاملة لتطوير التعليم تشمل تحديث المناهج وتدريب المعلمين وتطوير البنية التحتية للمدارس.",
      "attachments": [],
      "is_public": false,
      "likes_count": 0,
      "shares_count": 0
    },
    {
      "id": 2,
      "subject": "مقترح لحل مشكلة المرور",
      "content": "أستاذة سارة، أقترح إنشاء كباري علوية في المناطق المزدحمة لحل مشكلة المرور. ما رأيك في هذا المقترح؟",
      "sender_id": 2,
      "sender_name": "فاطمة أحمد حسن",
      "sender_type": "مواطن",
      "recipient_id": 7,
      "recipient_name": "أ. سارة أحمد فؤاد",
      "recipient_type": "مرشح",
      "message_type": "مقترح",
      "status": "قيد المراجعة",
      "priority": "عالية",
      "created_at": "2024-12-22T09:20:00Z",
      "read_at": "2024-12-22T11:30:00Z",
      "replied_at": null,
      "reply_content": "",
      "attachments": [
        {
          "id": 8,
          "filename": "traffic_solution_sketch.jpg",
          "file_type": "image/jpeg",
          "file_size": 1572864,
          "description": "رسم توضيحي للمقترح"
        }
      ],
      "is_public": false,
      "likes_count": 0,
      "shares_count": 0
    },
    {
      "id": 3,
      "subject": "دعوة لحضور ندوة عن البيئة",
      "content": "مهندس حسام، ندعوك لحضور ندوة عن حماية البيئة والتنمية المستدامة يوم الجمعة القادم. هل يمكنك الحضور؟",
      "sender_id": 3,
      "sender_name": "محمد عبد الرحمن سالم",
      "sender_type": "مواطن",
      "recipient_id": 8,
      "recipient_name": "م. حسام الدين محمود",
      "recipient_type": "مرشح",
      "message_type": "دعوة",
      "status": "جديدة",
      "priority": "منخفضة",
      "created_at": "2024-12-25T07:45:00Z",
      "read_at": null,
      "replied_at": null,
      "reply_content": "",
      "attachments": [
        {
          "id": 9,
          "filename": "seminar_invitation.pdf",
          "file_type": "application/pdf",
          "file_size": 327680,
          "description": "دعوة رسمية للندوة"
        }
      ],
      "is_public": false,
      "likes_count": 0,
      "shares_count": 0
    }
  ]
}
```

### **3.2 رسائل للأعضاء الحاليين**

```json
{
  "messages_to_members": [
    {
      "id": 4,
      "subject": "طلب مقابلة شخصية",
      "content": "دكتور محمد، أود طلب مقابلة شخصية لمناقشة مشاكل منطقتي والحلول المقترحة. متى يمكن ترتيب موعد؟",
      "sender_id": 4,
      "sender_name": "نورا سامي إبراهيم",
      "sender_type": "مواطن",
      "recipient_id": 9,
      "recipient_name": "د. محمد عبد الله الطيب",
      "recipient_type": "عضو حالي",
      "message_type": "طلب مقابلة",
      "status": "تم الرد",
      "priority": "عالية",
      "created_at": "2024-12-18T16:00:00Z",
      "read_at": "2024-12-19T08:30:00Z",
      "replied_at": "2024-12-19T14:20:00Z",
      "reply_content": "يمكن ترتيب مقابلة يوم الأحد القادم في مكتبي بمجلس النواب الساعة 2 ظهراً. يرجى التواصل مع السكرتارية لتأكيد الموعد.",
      "attachments": [],
      "is_public": false,
      "likes_count": 0,
      "shares_count": 0
    },
    {
      "id": 5,
      "subject": "شكر على الجهود المبذولة",
      "content": "دكتورة نادية، أشكرك على جهودك في تطوير التعليم. لقد لاحظنا تحسناً ملحوظاً في مدارس منطقتنا.",
      "sender_id": 5,
      "sender_name": "خالد حسام الدين",
      "sender_type": "مواطن",
      "recipient_id": 10,
      "recipient_name": "د. نادية حسن الشامي",
      "recipient_type": "عضو حالي",
      "message_type": "شكر وتقدير",
      "status": "تم الرد",
      "priority": "منخفضة",
      "created_at": "2024-12-23T12:15:00Z",
      "read_at": "2024-12-23T15:45:00Z",
      "replied_at": "2024-12-24T09:30:00Z",
      "reply_content": "شكراً لك على كلماتك الطيبة. هذا يشجعني على بذل المزيد من الجهد لخدمة المواطنين.",
      "attachments": [],
      "is_public": true,
      "likes_count": 15,
      "shares_count": 3
    }
  ]
}
```

---

## ⭐ **4. بيانات التقييمات التجريبية**

### **4.1 تقييمات المرشحين**

```json
{
  "candidate_ratings": [
    {
      "id": 1,
      "candidate_id": 6,
      "candidate_name": "د. عمرو محمد الشريف",
      "rater_id": 1,
      "rater_name": "أحمد محمد علي",
      "rating": 4,
      "category": "البرنامج الانتخابي",
      "comment": "برنامج انتخابي واضح ومفصل، لكن يحتاج إلى المزيد من التفاصيل حول التمويل",
      "created_at": "2024-12-20T18:30:00Z",
      "is_verified": true,
      "helpful_votes": 8,
      "reported_count": 0
    },
    {
      "id": 2,
      "candidate_id": 6,
      "candidate_name": "د. عمرو محمد الشريف",
      "rater_id": 2,
      "rater_name": "فاطمة أحمد حسن",
      "rating": 5,
      "category": "التواصل مع المواطنين",
      "comment": "ممتاز في التواصل ويرد على الرسائل بسرعة",
      "created_at": "2024-12-22T14:45:00Z",
      "is_verified": true,
      "helpful_votes": 12,
      "reported_count": 0
    },
    {
      "id": 3,
      "candidate_id": 7,
      "candidate_name": "أ. سارة أحمد فؤاد",
      "rater_id": 3,
      "rater_name": "محمد عبد الرحمن سالم",
      "rating": 5,
      "category": "الخبرة والكفاءة",
      "comment": "خبرة ممتازة في مجال القانون وحقوق المرأة",
      "created_at": "2024-12-21T10:20:00Z",
      "is_verified": true,
      "helpful_votes": 15,
      "reported_count": 0
    },
    {
      "id": 4,
      "candidate_id": 8,
      "candidate_name": "م. حسام الدين محمود",
      "rater_id": 4,
      "rater_name": "نورا سامي إبراهيم",
      "rating": 3,
      "category": "البرنامج الانتخابي",
      "comment": "البرنامج جيد لكن يحتاج إلى المزيد من الوضوح في بعض النقاط",
      "created_at": "2024-12-23T16:10:00Z",
      "is_verified": true,
      "helpful_votes": 5,
      "reported_count": 1
    }
  ]
}
```

### **4.2 تقييمات الأعضاء الحاليين**

```json
{
  "member_ratings": [
    {
      "id": 5,
      "member_id": 9,
      "member_name": "د. محمد عبد الله الطيب",
      "rater_id": 1,
      "rater_name": "أحمد محمد علي",
      "rating": 4,
      "category": "الأداء البرلماني",
      "comment": "أداء جيد في اللجان البرلمانية ومشاركة فعالة في الجلسات",
      "created_at": "2024-12-19T11:15:00Z",
      "is_verified": true,
      "helpful_votes": 22,
      "reported_count": 0
    },
    {
      "id": 6,
      "member_id": 9,
      "member_name": "د. محمد عبد الله الطيب",
      "rater_id": 5,
      "rater_name": "خالد حسام الدين",
      "rating": 4,
      "category": "خدمة المواطنين",
      "comment": "يستجيب لشكاوى المواطنين ويتابع حل المشاكل",
      "created_at": "2024-12-24T09:45:00Z",
      "is_verified": true,
      "helpful_votes": 18,
      "reported_count": 0
    },
    {
      "id": 7,
      "member_id": 10,
      "member_name": "د. نادية حسن الشامي",
      "rater_id": 2,
      "rater_name": "فاطمة أحمد حسن",
      "rating": 5,
      "category": "التخصص والخبرة",
      "comment": "خبرة ممتازة في مجال التعليم وتطوير المناهج",
      "created_at": "2024-12-25T13:20:00Z",
      "is_verified": true,
      "helpful_votes": 31,
      "reported_count": 0
    },
    {
      "id": 8,
      "member_id": 10,
      "member_name": "د. نادية حسن الشامي",
      "rater_id": 3,
      "rater_name": "محمد عبد الرحمن سالم",
      "rating": 5,
      "category": "التواصل مع المواطنين",
      "comment": "تتواصل بشكل ممتاز مع المواطنين وتهتم بآرائهم",
      "created_at": "2024-12-24T17:30:00Z",
      "is_verified": true,
      "helpful_votes": 27,
      "reported_count": 0
    }
  ]
}
```

---

## 📊 **5. بيانات الإحصائيات التجريبية**

### **5.1 إحصائيات الزوار**

```json
{
  "visitor_statistics": [
    {
      "date": "2024-12-25",
      "total_visitors": 1247,
      "unique_visitors": 892,
      "page_views": 3456,
      "bounce_rate": 0.34,
      "average_session_duration": 285,
      "top_pages": [
        {"page": "/candidates", "views": 567},
        {"page": "/members", "views": 445},
        {"page": "/complaints", "views": 334},
        {"page": "/messages", "views": 289},
        {"page": "/", "views": 234}
      ],
      "traffic_sources": [
        {"source": "direct", "visitors": 445},
        {"source": "google", "visitors": 334},
        {"source": "facebook", "visitors": 223},
        {"source": "twitter", "visitors": 156},
        {"source": "other", "visitors": 89}
      ],
      "device_types": [
        {"device": "mobile", "visitors": 623},
        {"device": "desktop", "visitors": 445},
        {"device": "tablet", "visitors": 179}
      ]
    },
    {
      "date": "2024-12-24",
      "total_visitors": 1156,
      "unique_visitors": 823,
      "page_views": 3123,
      "bounce_rate": 0.38,
      "average_session_duration": 267,
      "top_pages": [
        {"page": "/candidates", "views": 523},
        {"page": "/members", "views": 412},
        {"page": "/", "views": 298},
        {"page": "/complaints", "views": 287},
        {"page": "/messages", "views": 245}
      ],
      "traffic_sources": [
        {"source": "direct", "visitors": 412},
        {"source": "google", "visitors": 298},
        {"source": "facebook", "visitors": 201},
        {"source": "twitter", "visitors": 134},
        {"source": "other", "visitors": 111}
      ],
      "device_types": [
        {"device": "mobile", "visitors": 578},
        {"device": "desktop", "visitors": 423},
        {"device": "tablet", "visitors": 155}
      ]
    }
  ]
}
```

### **5.2 إحصائيات النشاط**

```json
{
  "activity_statistics": {
    "daily_stats": {
      "2024-12-25": {
        "new_registrations": 12,
        "new_complaints": 8,
        "new_messages": 34,
        "new_ratings": 15,
        "complaint_responses": 6,
        "message_responses": 28
      },
      "2024-12-24": {
        "new_registrations": 9,
        "new_complaints": 5,
        "new_messages": 29,
        "new_ratings": 12,
        "complaint_responses": 4,
        "message_responses": 23
      },
      "2024-12-23": {
        "new_registrations": 15,
        "new_complaints": 11,
        "new_messages": 41,
        "new_ratings": 18,
        "complaint_responses": 8,
        "message_responses": 35
      }
    },
    "weekly_totals": {
      "week_ending_2024-12-25": {
        "total_registrations": 78,
        "total_complaints": 45,
        "total_messages": 234,
        "total_ratings": 89,
        "response_rate": 0.73,
        "average_response_time": 18.5
      }
    },
    "monthly_totals": {
      "2024-12": {
        "total_registrations": 342,
        "total_complaints": 189,
        "total_messages": 1023,
        "total_ratings": 456,
        "active_users": 1247,
        "complaint_resolution_rate": 0.68
      }
    }
  }
}
```

---

## 📰 **6. بيانات الأخبار والبنرات التجريبية**

### **6.1 الأخبار**

```json
{
  "news_items": [
    {
      "id": 1,
      "title": "افتتاح جلسة جديدة لمجلس النواب لمناقشة قانون التأمين الصحي",
      "content": "افتتح مجلس النواب جلسة جديدة اليوم لمناقشة مشروع قانون التأمين الصحي الشامل",
      "category": "أخبار برلمانية",
      "priority": "عالية",
      "is_active": true,
      "created_at": "2024-12-25T09:00:00Z",
      "expires_at": "2024-12-27T23:59:59Z",
      "views_count": 456,
      "author": "إدارة الموقع"
    },
    {
      "id": 2,
      "title": "مجلس الشيوخ يناقش قانون تطوير التعليم الجامعي",
      "content": "يناقش مجلس الشيوخ اليوم مشروع قانون تطوير التعليم الجامعي والبحث العلمي",
      "category": "أخبار تشريعية",
      "priority": "متوسطة",
      "is_active": true,
      "created_at": "2024-12-24T14:30:00Z",
      "expires_at": "2024-12-26T23:59:59Z",
      "views_count": 234,
      "author": "إدارة الموقع"
    },
    {
      "id": 3,
      "title": "فتح باب التقديم للانتخابات المحلية القادمة",
      "content": "أعلنت اللجنة العليا للانتخابات عن فتح باب التقديم للانتخابات المحلية",
      "category": "أخبار انتخابية",
      "priority": "عالية جداً",
      "is_active": true,
      "created_at": "2024-12-23T10:15:00Z",
      "expires_at": "2024-12-30T23:59:59Z",
      "views_count": 789,
      "author": "إدارة الموقع"
    }
  ]
}
```

### **6.2 البنرات**

```json
{
  "banners": [
    {
      "id": 1,
      "title": "بنر الصفحة الرئيسية",
      "image_url": "/images/banners/main_banner.jpg",
      "alt_text": "مرحباً بكم في منصة نائبك",
      "link_url": "/about",
      "position": "header",
      "is_active": true,
      "display_order": 1,
      "start_date": "2024-12-01T00:00:00Z",
      "end_date": "2024-12-31T23:59:59Z",
      "click_count": 234,
      "impression_count": 5678,
      "created_at": "2024-12-01T10:00:00Z"
    },
    {
      "id": 2,
      "title": "بنر الانتخابات",
      "image_url": "/images/banners/election_banner.jpg",
      "alt_text": "شارك في الانتخابات القادمة",
      "link_url": "/elections",
      "position": "sidebar",
      "is_active": true,
      "display_order": 2,
      "start_date": "2024-12-20T00:00:00Z",
      "end_date": "2025-01-15T23:59:59Z",
      "click_count": 156,
      "impression_count": 3456,
      "created_at": "2024-12-20T08:30:00Z"
    },
    {
      "id": 3,
      "title": "بنر خدمة الشكاوى",
      "image_url": "/images/banners/complaints_banner.jpg",
      "alt_text": "قدم شكواك الآن",
      "link_url": "/complaints/new",
      "position": "footer",
      "is_active": true,
      "display_order": 3,
      "start_date": "2024-12-15T00:00:00Z",
      "end_date": "2025-01-31T23:59:59Z",
      "click_count": 89,
      "impression_count": 2134,
      "created_at": "2024-12-15T12:45:00Z"
    }
  ]
}
```

---

## 🔔 **7. بيانات الإشعارات التجريبية**

### **7.1 إشعارات المستخدمين**

```json
{
  "notifications": [
    {
      "id": 1,
      "user_id": 1,
      "user_name": "أحمد محمد علي",
      "title": "رد على رسالتك",
      "message": "تم الرد على رسالتك من قبل د. عمرو محمد الشريف",
      "type": "message_reply",
      "category": "رسائل",
      "is_read": false,
      "is_important": true,
      "created_at": "2024-12-25T10:15:00Z",
      "read_at": null,
      "action_url": "/messages/1",
      "icon": "💬",
      "color": "blue"
    },
    {
      "id": 2,
      "user_id": 2,
      "user_name": "فاطمة أحمد حسن",
      "title": "تحديث حالة الشكوى",
      "message": "تم تحديث حالة شكواك رقم #3 إلى 'قيد المراجعة'",
      "type": "complaint_update",
      "category": "شكاوى",
      "is_read": true,
      "is_important": false,
      "created_at": "2024-12-24T16:30:00Z",
      "read_at": "2024-12-24T18:45:00Z",
      "action_url": "/complaints/3",
      "icon": "📋",
      "color": "orange"
    },
    {
      "id": 3,
      "user_id": 6,
      "user_name": "د. عمرو محمد الشريف",
      "title": "رسالة جديدة",
      "message": "وصلتك رسالة جديدة من أحمد محمد علي",
      "type": "new_message",
      "category": "رسائل",
      "is_read": false,
      "is_important": true,
      "created_at": "2024-12-25T14:20:00Z",
      "read_at": null,
      "action_url": "/messages/inbox",
      "icon": "📨",
      "color": "green"
    },
    {
      "id": 4,
      "user_id": 9,
      "user_name": "د. محمد عبد الله الطيب",
      "title": "شكوى جديدة",
      "message": "وصلتك شكوى جديدة من نورا سامي إبراهيم",
      "type": "new_complaint",
      "category": "شكاوى",
      "is_read": true,
      "is_important": true,
      "created_at": "2024-12-25T08:15:00Z",
      "read_at": "2024-12-25T09:30:00Z",
      "action_url": "/complaints/received",
      "icon": "⚠️",
      "color": "red"
    },
    {
      "id": 5,
      "user_id": 7,
      "user_name": "أ. سارة أحمد فؤاد",
      "title": "تقييم جديد",
      "message": "حصلت على تقييم جديد من محمد عبد الرحمن سالم",
      "type": "new_rating",
      "category": "تقييمات",
      "is_read": false,
      "is_important": false,
      "created_at": "2024-12-24T21:10:00Z",
      "read_at": null,
      "action_url": "/profile/ratings",
      "icon": "⭐",
      "color": "yellow"
    }
  ]
}
```

### **7.2 إشعارات النظام**

```json
{
  "system_notifications": [
    {
      "id": 6,
      "title": "صيانة مجدولة للنظام",
      "message": "سيتم إجراء صيانة للنظام يوم الجمعة من الساعة 2 إلى 4 صباحاً",
      "type": "system_maintenance",
      "category": "نظام",
      "target_audience": "all_users",
      "is_active": true,
      "priority": "متوسطة",
      "start_date": "2024-12-27T02:00:00Z",
      "end_date": "2024-12-27T04:00:00Z",
      "created_at": "2024-12-25T12:00:00Z",
      "icon": "🔧",
      "color": "gray"
    },
    {
      "id": 7,
      "title": "تحديث سياسة الخصوصية",
      "message": "تم تحديث سياسة الخصوصية، يرجى مراجعة التغييرات",
      "type": "policy_update",
      "category": "قانوني",
      "target_audience": "all_users",
      "is_active": true,
      "priority": "عالية",
      "start_date": "2024-12-24T00:00:00Z",
      "end_date": "2025-01-24T23:59:59Z",
      "created_at": "2024-12-24T10:00:00Z",
      "icon": "📄",
      "color": "blue"
    },
    {
      "id": 8,
      "title": "ميزة جديدة: التقييمات المتقدمة",
      "message": "تم إضافة ميزة التقييمات المتقدمة للمرشحين والأعضاء",
      "type": "new_feature",
      "category": "ميزات",
      "target_audience": "all_users",
      "is_active": true,
      "priority": "منخفضة",
      "start_date": "2024-12-23T00:00:00Z",
      "end_date": "2025-01-23T23:59:59Z",
      "created_at": "2024-12-23T15:30:00Z",
      "icon": "🎉",
      "color": "purple"
    }
  ]
}
```

---

## 🎨 **8. بيانات المحتوى والثيمات**

### **8.1 إعدادات الثيم**

```json
{
  "theme_settings": {
    "current_theme": "naebak_default",
    "primary_color": "#2d7d32",
    "secondary_color": "#ff9800",
    "accent_color": "#1976d2",
    "background_color": "#ffffff",
    "text_color": "#212121",
    "link_color": "#1976d2",
    "success_color": "#4caf50",
    "warning_color": "#ff9800",
    "error_color": "#f44336",
    "info_color": "#2196f3",
    "font_family": "Cairo, sans-serif",
    "font_size_base": "16px",
    "border_radius": "8px",
    "box_shadow": "0 2px 4px rgba(0,0,0,0.1)",
    "header_height": "80px",
    "footer_height": "120px",
    "sidebar_width": "280px",
    "container_max_width": "1200px",
    "breakpoints": {
      "xs": "0px",
      "sm": "576px",
      "md": "768px",
      "lg": "992px",
      "xl": "1200px",
      "xxl": "1400px"
    }
  }
}
```

### **8.2 محتوى الصفحات الثابتة**

```json
{
  "static_content": {
    "about_page": {
      "title": "عن منصة نائبك",
      "content": "منصة نائبك هي منصة إلكترونية تهدف إلى تعزيز التواصل بين المواطنين والنواب والمرشحين...",
      "meta_description": "تعرف على منصة نائبك - المنصة الرائدة للتواصل مع النواب والمرشحين",
      "keywords": "نائبك، مجلس النواب، مجلس الشيوخ، مصر، انتخابات",
      "last_updated": "2024-12-20T10:00:00Z"
    },
    "privacy_policy": {
      "title": "سياسة الخصوصية",
      "content": "نحن في منصة نائبك نلتزم بحماية خصوصية مستخدمينا...",
      "meta_description": "سياسة الخصوصية لمنصة نائبك",
      "keywords": "خصوصية، بيانات، حماية، أمان",
      "last_updated": "2024-12-24T10:00:00Z"
    },
    "terms_of_service": {
      "title": "شروط الاستخدام",
      "content": "بإستخدامك لمنصة نائبك، فإنك توافق على الشروط والأحكام التالية...",
      "meta_description": "شروط استخدام منصة نائبك",
      "keywords": "شروط، استخدام، أحكام، قوانين",
      "last_updated": "2024-12-22T14:30:00Z"
    },
    "contact_page": {
      "title": "اتصل بنا",
      "content": "للتواصل معنا أو الاستفسار عن خدماتنا...",
      "contact_email": "info@naebak.com",
      "contact_phone": "01000000000",
      "contact_address": "القاهرة، مصر",
      "social_media": {
        "facebook": "https://facebook.com/naebak",
        "twitter": "https://twitter.com/naebak",
        "instagram": "https://instagram.com/naebak",
        "youtube": "https://youtube.com/naebak",
        "linkedin": "https://linkedin.com/company/naebak"
      },
      "last_updated": "2024-12-21T16:45:00Z"
    }
  }
}
```

---

## 🔧 **9. بيانات الإعدادات والتكوين**

### **9.1 إعدادات النظام العامة**

```json
{
  "system_settings": {
    "site_name": "نائبك",
    "site_description": "منصة التواصل مع النواب والمرشحين",
    "site_url": "https://naebak.com",
    "admin_email": "admin@naebak.com",
    "support_email": "support@naebak.com",
    "default_language": "ar",
    "timezone": "Africa/Cairo",
    "date_format": "Y-m-d",
    "time_format": "H:i:s",
    "pagination_size": 20,
    "max_file_size": 10485760,
    "allowed_file_types": ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "mp4", "mp3"],
    "session_timeout": 3600,
    "password_min_length": 8,
    "max_login_attempts": 5,
    "lockout_duration": 900,
    "email_verification_required": true,
    "phone_verification_required": true,
    "auto_approve_registrations": false,
    "maintenance_mode": false,
    "debug_mode": false,
    "cache_enabled": true,
    "cache_duration": 3600,
    "backup_enabled": true,
    "backup_frequency": "daily",
    "log_level": "info",
    "analytics_enabled": true,
    "google_analytics_id": "GA-XXXXXXXXX"
  }
}
```

### **9.2 إعدادات الأمان**

```json
{
  "security_settings": {
    "ssl_enabled": true,
    "force_https": true,
    "csrf_protection": true,
    "xss_protection": true,
    "sql_injection_protection": true,
    "rate_limiting": {
      "enabled": true,
      "requests_per_minute": 60,
      "requests_per_hour": 1000,
      "requests_per_day": 10000
    },
    "ip_whitelist": [],
    "ip_blacklist": [],
    "failed_login_tracking": true,
    "password_complexity": {
      "require_uppercase": true,
      "require_lowercase": true,
      "require_numbers": true,
      "require_symbols": false,
      "min_length": 8,
      "max_length": 128
    },
    "two_factor_auth": {
      "enabled": false,
      "required_for_admin": true,
      "methods": ["sms", "email", "app"]
    },
    "session_security": {
      "secure_cookies": true,
      "httponly_cookies": true,
      "samesite_cookies": "Lax",
      "regenerate_session_id": true
    }
  }
}
```

---

## 📋 **10. خلاصة مجموعات البيانات التجريبية**

### **الملفات المتوفرة:**
- ✅ **بيانات المستخدمين**: 10 مستخدمين متنوعين (مواطنين، مرشحين، أعضاء)
- ✅ **بيانات الشكاوى**: 5 شكاوى متنوعة مع مرفقات
- ✅ **بيانات الرسائل**: 5 رسائل بأنواع مختلفة
- ✅ **بيانات التقييمات**: 8 تقييمات للمرشحين والأعضاء
- ✅ **بيانات الإحصائيات**: إحصائيات يومية وأسبوعية وشهرية
- ✅ **بيانات الأخبار**: 3 أخبار متنوعة
- ✅ **بيانات البنرات**: 3 بنرات في مواقع مختلفة
- ✅ **بيانات الإشعارات**: 8 إشعارات متنوعة
- ✅ **بيانات المحتوى**: صفحات ثابتة وإعدادات الثيم
- ✅ **بيانات الإعدادات**: إعدادات النظام والأمان

### **كيفية الاستخدام:**
1. **استيراد البيانات** إلى قواعد البيانات التجريبية
2. **اختبار الوظائف** باستخدام البيانات الحقيقية
3. **التحقق من الأداء** مع حجم بيانات واقعي
4. **اختبار السيناريوهات** المختلفة
5. **التدريب على النظام** قبل النشر

### **المميزات:**
- 🎯 **بيانات واقعية** - تحاكي الاستخدام الفعلي
- 🔄 **تنوع شامل** - تغطي جميع أنواع المستخدمين والمحتوى
- 📊 **إحصائيات متكاملة** - لاختبار لوحات المراقبة
- 🔒 **بيانات آمنة** - لا تحتوي على معلومات حقيقية
- 🚀 **سهولة الاستيراد** - بصيغة JSON قابلة للاستخدام مباشرة

هذه المجموعات توفر أساساً قوياً لاختبار جميع وظائف تطبيق نائبك بشكل شامل ومتكامل.
