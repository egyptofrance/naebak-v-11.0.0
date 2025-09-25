# مخططات تدفق المستخدمين - مشروع Naebak

---

## 🎯 **نظرة عامة على رحلات المستخدمين**

### **أنواع المستخدمين:**
1. **الزائر** - غير مسجل
2. **المواطن** - له صوت انتخابي
3. **المرشح** - مرشح لعضوية مجلس
4. **النائب الحالي** - عضو حالي في مجلس
5. **الإدارة** - مدير النظام

---

## 🚪 **1. رحلة الزائر (Visitor Journey)**

### **الدخول الأولي:**
```mermaid
flowchart TD
    START([زائر يدخل الموقع]) --> LANDING[صفحة الهبوط]
    LANDING --> CHOICE{ماذا يريد؟}
    
    CHOICE -->|تصفح| BROWSE[تصفح كزائر]
    CHOICE -->|تسجيل| REGISTER[نموذج التسجيل]
    CHOICE -->|دخول| LOGIN[نموذج الدخول]
    
    BROWSE --> VIEW_REPS[عرض المرشحين/النواب]
    VIEW_REPS --> LIMITED[عرض محدود<br/>بدون تفاعل]
    LIMITED --> PROMPT[دعوة للتسجيل]
    PROMPT --> REGISTER
    
    REGISTER --> REG_FORM[ملء بيانات التسجيل]
    REG_FORM --> VERIFY[التحقق من الهاتف]
    VERIFY --> SUCCESS[تسجيل ناجح]
    SUCCESS --> DASHBOARD[لوحة التحكم]
    
    LOGIN --> AUTH[التحقق من البيانات]
    AUTH -->|صحيح| DASHBOARD
    AUTH -->|خطأ| ERROR[رسالة خطأ]
    ERROR --> LOGIN
    
    classDef start fill:#e8f5e8
    classDef process fill:#fff3e0
    classDef decision fill:#f3e5f5
    classDef end fill:#ffebee
    
    class START start
    class LANDING,BROWSE,VIEW_REPS,REG_FORM,VERIFY,AUTH process
    class CHOICE decision
    class SUCCESS,DASHBOARD,ERROR end
```

### **تدفق التسجيل التفصيلي:**
```mermaid
flowchart TD
    REG_START([بدء التسجيل]) --> BASIC_INFO[البيانات الأساسية<br/>الاسم، الهاتف، الإيميل]
    BASIC_INFO --> LOCATION[اختيار المحافظة<br/>27 محافظة متاحة]
    LOCATION --> USER_TYPE{نوع المستخدم}
    
    USER_TYPE -->|مواطن| CITIZEN_INFO[بيانات المواطن<br/>العنوان، الواتساب]
    USER_TYPE -->|مرشح| CANDIDATE_INFO[بيانات المرشح<br/>الحزب، المجلس، الدائرة]
    USER_TYPE -->|نائب حالي| MEMBER_INFO[بيانات النائب<br/>المجلس، الدائرة، تاريخ العضوية]
    
    CITIZEN_INFO --> PHONE_VERIFY[التحقق من الهاتف]
    CANDIDATE_INFO --> ADDITIONAL[بيانات إضافية<br/>الرقم الانتخابي، الرمز]
    MEMBER_INFO --> COMMITTEES[اللجان المشارك فيها]
    
    ADDITIONAL --> PHONE_VERIFY
    COMMITTEES --> PHONE_VERIFY
    
    PHONE_VERIFY --> SMS[إرسال رمز SMS]
    SMS --> VERIFY_CODE[إدخال رمز التحقق]
    VERIFY_CODE -->|صحيح| EMAIL_VERIFY[التحقق من الإيميل]
    VERIFY_CODE -->|خطأ| RESEND{إعادة الإرسال؟}
    
    RESEND -->|نعم| SMS
    RESEND -->|لا| MANUAL[التحقق اليدوي]
    
    EMAIL_VERIFY --> EMAIL_SENT[إرسال رابط التحقق]
    EMAIL_SENT --> CLICK_LINK[النقر على الرابط]
    CLICK_LINK --> ACCOUNT_ACTIVE[تفعيل الحساب]
    ACCOUNT_ACTIVE --> WELCOME[رسالة ترحيب]
    WELCOME --> DASHBOARD[الانتقال للوحة التحكم]
    
    classDef input fill:#e3f2fd
    classDef process fill:#f1f8e9
    classDef decision fill:#fce4ec
    classDef success fill:#e8f5e8
    
    class BASIC_INFO,LOCATION,CITIZEN_INFO,CANDIDATE_INFO,MEMBER_INFO,ADDITIONAL,COMMITTEES input
    class PHONE_VERIFY,SMS,EMAIL_VERIFY,EMAIL_SENT,CLICK_LINK process
    class USER_TYPE,RESEND decision
    class ACCOUNT_ACTIVE,WELCOME,DASHBOARD success
```

---

## 👤 **2. رحلة المواطن (Citizen Journey)**

### **الاستخدام اليومي:**
```mermaid
flowchart TD
    LOGIN([دخول المواطن]) --> DASHBOARD[لوحة التحكم الرئيسية]
    DASHBOARD --> MAIN_MENU{الخيارات المتاحة}
    
    MAIN_MENU -->|البحث| SEARCH[البحث عن مرشحين/نواب]
    MAIN_MENU -->|الشكاوى| COMPLAINTS[إدارة الشكاوى]
    MAIN_MENU -->|الرسائل| MESSAGES[صندوق الرسائل]
    MAIN_MENU -->|الإعدادات| SETTINGS[إعدادات الحساب]
    
    %% مسار البحث
    SEARCH --> FILTERS[تطبيق الفلاتر<br/>الاسم، الجنس، الحزب، المجلس]
    FILTERS --> RESULTS[عرض النتائج]
    RESULTS --> SELECT_REP[اختيار مرشح/نائب]
    SELECT_REP --> PROFILE[عرض الصفحة الشخصية]
    
    PROFILE --> PROFILE_ACTIONS{الإجراءات المتاحة}
    PROFILE_ACTIONS -->|تقييم| RATE[إعطاء تقييم 1-5 نجوم]
    PROFILE_ACTIONS -->|رسالة| SEND_MSG[إرسال رسالة]
    PROFILE_ACTIONS -->|شكوى| FILE_COMPLAINT[تقديم شكوى]
    
    %% مسار الشكاوى
    COMPLAINTS --> COMP_MENU{إدارة الشكاوى}
    COMP_MENU -->|جديدة| NEW_COMPLAINT[شكوى جديدة]
    COMP_MENU -->|متابعة| TRACK_COMPLAINT[متابعة الشكاوى]
    
    NEW_COMPLAINT --> COMP_FORM[نموذج الشكوى]
    COMP_FORM --> COMP_TYPE[اختيار نوع الشكوى<br/>8 أنواع لمجلس النواب<br/>6 أنواع لمجلس الشيوخ]
    COMP_TYPE --> COMP_DETAILS[تفاصيل الشكوى<br/>العنوان، الوصف، الموقع]
    COMP_DETAILS --> ATTACHMENTS[إرفاق ملفات<br/>حتى 5 ملفات، 10MB]
    ATTACHMENTS --> SUBMIT_COMP[إرسال الشكوى]
    SUBMIT_COMP --> COMP_NUMBER[رقم الشكوى]
    COMP_NUMBER --> NOTIFICATION[إشعار النائب المختص]
    
    %% مسار الرسائل
    MESSAGES --> MSG_MENU{صندوق الرسائل}
    MSG_MENU -->|الواردة| INBOX[الرسائل الواردة]
    MSG_MENU -->|المرسلة| SENT[الرسائل المرسلة]
    MSG_MENU -->|جديدة| NEW_MSG[رسالة جديدة]
    
    NEW_MSG --> SELECT_RECIPIENT[اختيار المستقبل]
    SELECT_RECIPIENT --> MSG_CONTENT[كتابة الرسالة]
    MSG_CONTENT --> SEND_MESSAGE[إرسال الرسالة]
    SEND_MESSAGE --> MSG_SENT[تم الإرسال]
    
    %% التقييم
    RATE --> RATING_FORM[نموذج التقييم<br/>النجوم + تعليق]
    RATING_FORM --> SUBMIT_RATING[إرسال التقييم]
    SUBMIT_RATING --> RATING_SAVED[حفظ التقييم]
    RATING_SAVED --> UPDATE_STATS[تحديث إحصائيات المرشح]
    
    classDef entry fill:#e8f5e8
    classDef menu fill:#f3e5f5
    classDef process fill:#fff3e0
    classDef form fill:#e3f2fd
    classDef success fill:#c8e6c9
    
    class LOGIN entry
    class DASHBOARD,MAIN_MENU,PROFILE_ACTIONS,COMP_MENU,MSG_MENU menu
    class SEARCH,FILTERS,RESULTS,COMP_FORM,MSG_CONTENT process
    class COMP_TYPE,COMP_DETAILS,ATTACHMENTS,RATING_FORM form
    class COMP_NUMBER,MSG_SENT,RATING_SAVED,UPDATE_STATS success
```

### **رحلة تقديم الشكوى التفصيلية:**
```mermaid
flowchart TD
    START_COMP([تقديم شكوى]) --> TARGET{إلى من الشكوى؟}
    
    TARGET -->|نائب محدد| SELECT_REP[اختيار النائب]
    TARGET -->|تعيين تلقائي| AUTO_ASSIGN[التعيين التلقائي<br/>حسب المحافظة والنوع]
    
    SELECT_REP --> COMP_FORM[نموذج الشكوى]
    AUTO_ASSIGN --> COMP_FORM
    
    COMP_FORM --> TITLE[عنوان الشكوى<br/>حتى 100 حرف]
    TITLE --> CATEGORY[فئة الشكوى]
    
    CATEGORY --> CAT_CHOICE{نوع المجلس}
    CAT_CHOICE -->|مجلس النواب| PARLIAMENT_CATS[8 فئات متاحة<br/>البنية التحتية، الصحة، التعليم<br/>الأمن، الخدمات، النقل<br/>البيئة، الإسكان]
    CAT_CHOICE -->|مجلس الشيوخ| SENATE_CATS[6 فئات متاحة<br/>التشريع، الرقابة، الاقتصاد<br/>الشؤون الخارجية، الثقافة، الاجتماعية]
    
    PARLIAMENT_CATS --> DESCRIPTION[وصف تفصيلي<br/>حتى 1000 حرف]
    SENATE_CATS --> DESCRIPTION
    
    DESCRIPTION --> LOCATION_OPT[الموقع (اختياري)<br/>عنوان أو إحداثيات]
    LOCATION_OPT --> URGENCY[مستوى الأولوية<br/>عادي، مهم، عاجل]
    URGENCY --> ATTACHMENTS_OPT[المرفقات (اختياري)]
    
    ATTACHMENTS_OPT --> FILE_CHECK{هل توجد ملفات؟}
    FILE_CHECK -->|نعم| UPLOAD_FILES[رفع الملفات<br/>حتى 5 ملفات<br/>10MB لكل ملف]
    FILE_CHECK -->|لا| REVIEW
    
    UPLOAD_FILES --> FILE_VALIDATION[فحص الملفات<br/>النوع، الحجم، الفيروسات]
    FILE_VALIDATION -->|صالحة| REVIEW[مراجعة الشكوى]
    FILE_VALIDATION -->|غير صالحة| FILE_ERROR[رسالة خطأ]
    FILE_ERROR --> ATTACHMENTS_OPT
    
    REVIEW --> CONFIRM{تأكيد الإرسال؟}
    CONFIRM -->|نعم| SUBMIT[إرسال الشكوى]
    CONFIRM -->|لا| COMP_FORM
    
    SUBMIT --> GENERATE_ID[إنشاء رقم الشكوى<br/>COMP-YYYY-XXXXXX]
    GENERATE_ID --> SAVE_DB[حفظ في قاعدة البيانات]
    SAVE_DB --> NOTIFY_SYSTEM[إشعار النظام]
    
    NOTIFY_SYSTEM --> ASSIGN_REP[تعيين النائب المختص]
    ASSIGN_REP --> NOTIFY_REP[إشعار النائب<br/>إيميل + إشعار داخلي]
    NOTIFY_REP --> NOTIFY_CITIZEN[إشعار المواطن<br/>رقم الشكوى + رابط المتابعة]
    NOTIFY_CITIZEN --> SUCCESS[تم تقديم الشكوى بنجاح]
    
    classDef start fill:#e8f5e8
    classDef decision fill:#f3e5f5
    classDef input fill:#e3f2fd
    classDef process fill:#fff3e0
    classDef validation fill:#ffecb3
    classDef success fill:#c8e6c9
    classDef error fill:#ffcdd2
    
    class START_COMP start
    class TARGET,CAT_CHOICE,FILE_CHECK,CONFIRM decision
    class TITLE,DESCRIPTION,LOCATION_OPT,URGENCY,UPLOAD_FILES input
    class COMP_FORM,AUTO_ASSIGN,GENERATE_ID,SAVE_DB,NOTIFY_SYSTEM process
    class FILE_VALIDATION validation
    class SUCCESS success
    class FILE_ERROR error
```

---

## 🏛️ **3. رحلة المرشح/النائب (Representative Journey)**

### **لوحة التحكم الرئيسية:**
```mermaid
flowchart TD
    REP_LOGIN([دخول المرشح/النائب]) --> REP_DASHBOARD[لوحة التحكم]
    REP_DASHBOARD --> OVERVIEW[نظرة عامة<br/>الإحصائيات الرئيسية]
    
    OVERVIEW --> STATS_DISPLAY[عرض الإحصائيات<br/>الرسائل، الشكاوى، التقييمات<br/>الزوار، المتابعين]
    
    STATS_DISPLAY --> MAIN_ACTIONS{الإجراءات الرئيسية}
    
    MAIN_ACTIONS -->|الرسائل| MESSAGES_MGMT[إدارة الرسائل]
    MAIN_ACTIONS -->|الشكاوى| COMPLAINTS_MGMT[إدارة الشكاوى]
    MAIN_ACTIONS -->|الملف الشخصي| PROFILE_MGMT[إدارة الملف الشخصي]
    MAIN_ACTIONS -->|الإحصائيات| ANALYTICS[التحليلات والتقارير]
    MAIN_ACTIONS -->|الإعدادات| REP_SETTINGS[إعدادات الحساب]
    
    %% إدارة الرسائل
    MESSAGES_MGMT --> MSG_DASHBOARD[لوحة الرسائل]
    MSG_DASHBOARD --> MSG_CATEGORIES{تصنيف الرسائل}
    
    MSG_CATEGORIES -->|جديدة| NEW_MESSAGES[الرسائل الجديدة<br/>غير المقروءة]
    MSG_CATEGORIES -->|قيد المراجعة| PENDING_MESSAGES[قيد المراجعة]
    MSG_CATEGORIES -->|تم الرد| REPLIED_MESSAGES[تم الرد عليها]
    MSG_CATEGORIES -->|مؤرشفة| ARCHIVED_MESSAGES[المؤرشفة]
    
    NEW_MESSAGES --> READ_MSG[قراءة الرسالة]
    READ_MSG --> MSG_ACTIONS{إجراءات الرسالة}
    
    MSG_ACTIONS -->|رد| REPLY_MSG[كتابة رد]
    MSG_ACTIONS -->|تأجيل| POSTPONE_MSG[تأجيل للمراجعة]
    MSG_ACTIONS -->|أرشفة| ARCHIVE_MSG[أرشفة الرسالة]
    MSG_ACTIONS -->|تحويل| FORWARD_MSG[تحويل لنائب آخر]
    
    REPLY_MSG --> COMPOSE_REPLY[كتابة الرد<br/>حتى 1000 حرف]
    COMPOSE_REPLY --> SEND_REPLY[إرسال الرد]
    SEND_REPLY --> NOTIFY_CITIZEN[إشعار المواطن]
    NOTIFY_CITIZEN --> UPDATE_STATUS[تحديث حالة الرسالة]
    
    %% إدارة الشكاوى
    COMPLAINTS_MGMT --> COMP_DASHBOARD[لوحة الشكاوى]
    COMP_DASHBOARD --> COMP_STATUS{حالة الشكاوى}
    
    COMP_STATUS -->|جديدة| NEW_COMPLAINTS[شكاوى جديدة]
    COMP_STATUS -->|قيد المعالجة| PROCESSING_COMPLAINTS[قيد المعالجة]
    COMP_STATUS -->|تم الحل| RESOLVED_COMPLAINTS[تم حلها]
    COMP_STATUS -->|مغلقة| CLOSED_COMPLAINTS[مغلقة]
    
    NEW_COMPLAINTS --> VIEW_COMPLAINT[عرض تفاصيل الشكوى]
    VIEW_COMPLAINT --> COMP_DETAILS[التفاصيل الكاملة<br/>النوع، الوصف، المرفقات]
    COMP_DETAILS --> COMP_ACTIONS{إجراءات الشكوى}
    
    COMP_ACTIONS -->|قبول| ACCEPT_COMP[قبول الشكوى]
    COMP_ACTIONS -->|رفض| REJECT_COMP[رفض الشكوى]
    COMP_ACTIONS -->|طلب توضيح| REQUEST_INFO[طلب معلومات إضافية]
    COMP_ACTIONS -->|تحويل| TRANSFER_COMP[تحويل لجهة أخرى]
    
    ACCEPT_COMP --> SET_PRIORITY[تحديد الأولوية]
    SET_PRIORITY --> ASSIGN_TEAM[تعيين فريق العمل]
    ASSIGN_TEAM --> CREATE_PLAN[وضع خطة العمل]
    CREATE_PLAN --> START_WORK[بدء العمل]
    START_WORK --> PROGRESS_UPDATE[تحديثات التقدم]
    PROGRESS_UPDATE --> RESOLUTION[الحل النهائي]
    RESOLUTION --> CLOSE_COMPLAINT[إغلاق الشكوى]
    
    classDef entry fill:#e8f5e8
    classDef dashboard fill:#f3e5f5
    classDef category fill:#fff3e0
    classDef action fill:#e3f2fd
    classDef process fill:#ffecb3
    classDef success fill:#c8e6c9
    
    class REP_LOGIN entry
    class REP_DASHBOARD,MSG_DASHBOARD,COMP_DASHBOARD dashboard
    class MSG_CATEGORIES,COMP_STATUS category
    class MSG_ACTIONS,COMP_ACTIONS action
    class COMPOSE_REPLY,SET_PRIORITY,CREATE_PLAN process
    class UPDATE_STATUS,CLOSE_COMPLAINT success
```

### **إدارة الملف الشخصي:**
```mermaid
flowchart TD
    PROFILE_START([إدارة الملف الشخصي]) --> PROFILE_SECTIONS{أقسام الملف}
    
    PROFILE_SECTIONS -->|المعلومات الأساسية| BASIC_INFO[المعلومات الأساسية]
    PROFILE_SECTIONS -->|الصورة الشخصية| PROFILE_PIC[الصورة الشخصية]
    PROFILE_SECTIONS -->|السيرة الذاتية| BIOGRAPHY[السيرة الذاتية]
    PROFILE_SECTIONS -->|الإنجازات| ACHIEVEMENTS[الإنجازات]
    PROFILE_SECTIONS -->|معلومات الاتصال| CONTACT_INFO[معلومات الاتصال]
    PROFILE_SECTIONS -->|إعدادات الخصوصية| PRIVACY[إعدادات الخصوصية]
    
    %% المعلومات الأساسية
    BASIC_INFO --> EDIT_BASIC[تعديل البيانات<br/>الاسم، المجلس، الحزب<br/>الدائرة الانتخابية]
    EDIT_BASIC --> VALIDATE_BASIC[التحقق من البيانات]
    VALIDATE_BASIC -->|صحيحة| SAVE_BASIC[حفظ التغييرات]
    VALIDATE_BASIC -->|خطأ| ERROR_BASIC[رسالة خطأ]
    ERROR_BASIC --> EDIT_BASIC
    
    %% الصورة الشخصية
    PROFILE_PIC --> UPLOAD_PIC[رفع صورة جديدة<br/>JPG/PNG، حتى 5MB]
    UPLOAD_PIC --> CROP_PIC[قص الصورة<br/>مربع 400x400]
    CROP_PIC --> PREVIEW_PIC[معاينة الصورة]
    PREVIEW_PIC --> CONFIRM_PIC{تأكيد الصورة؟}
    CONFIRM_PIC -->|نعم| SAVE_PIC[حفظ الصورة]
    CONFIRM_PIC -->|لا| UPLOAD_PIC
    
    %% السيرة الذاتية
    BIOGRAPHY --> EDIT_BIO[تعديل السيرة<br/>حتى 2000 حرف]
    EDIT_BIO --> BIO_SECTIONS[أقسام السيرة<br/>التعليم، الخبرة، الأهداف]
    BIO_SECTIONS --> PREVIEW_BIO[معاينة السيرة]
    PREVIEW_BIO --> SAVE_BIO[حفظ السيرة]
    
    %% الإنجازات
    ACHIEVEMENTS --> MANAGE_ACHIEVEMENTS[إدارة الإنجازات]
    MANAGE_ACHIEVEMENTS --> ACHIEVEMENT_TYPES{أنواع الإنجازات}
    
    ACHIEVEMENT_TYPES -->|قوانين| LAWS[القوانين المقترحة]
    ACHIEVEMENT_TYPES -->|مشاريع| PROJECTS[المشاريع المنجزة]
    ACHIEVEMENT_TYPES -->|مبادرات| INITIATIVES[المبادرات الشخصية]
    ACHIEVEMENT_TYPES -->|جوائز| AWARDS[الجوائز والتكريمات]
    
    LAWS --> ADD_LAW[إضافة قانون<br/>العنوان، الوصف، التاريخ]
    PROJECTS --> ADD_PROJECT[إضافة مشروع<br/>الاسم، التفاصيل، النتائج]
    INITIATIVES --> ADD_INITIATIVE[إضافة مبادرة<br/>الهدف، التنفيذ، الأثر]
    AWARDS --> ADD_AWARD[إضافة جائزة<br/>الاسم، الجهة، التاريخ]
    
    ADD_LAW --> SAVE_ACHIEVEMENT[حفظ الإنجاز]
    ADD_PROJECT --> SAVE_ACHIEVEMENT
    ADD_INITIATIVE --> SAVE_ACHIEVEMENT
    ADD_AWARD --> SAVE_ACHIEVEMENT
    
    %% معلومات الاتصال
    CONTACT_INFO --> EDIT_CONTACT[تعديل معلومات الاتصال]
    EDIT_CONTACT --> CONTACT_FIELDS[الحقول المتاحة<br/>الهاتف، الإيميل، الواتساب<br/>الفيسبوك، تويتر، الموقع]
    CONTACT_FIELDS --> VISIBILITY[إعدادات الظهور<br/>عام، للمواطنين فقط، خاص]
    VISIBILITY --> SAVE_CONTACT[حفظ معلومات الاتصال]
    
    %% إعدادات الخصوصية
    PRIVACY --> PRIVACY_OPTIONS[خيارات الخصوصية]
    PRIVACY_OPTIONS --> PROFILE_VISIBILITY[ظهور الملف الشخصي<br/>عام، محدود، خاص]
    PROFILE_VISIBILITY --> MESSAGE_SETTINGS[إعدادات الرسائل<br/>من الجميع، المواطنين فقط، معطلة]
    MESSAGE_SETTINGS --> NOTIFICATION_PREFS[تفضيلات الإشعارات<br/>إيميل، SMS، داخلي]
    NOTIFICATION_PREFS --> SAVE_PRIVACY[حفظ إعدادات الخصوصية]
    
    %% النهاية
    SAVE_BASIC --> PROFILE_UPDATED[تم تحديث الملف الشخصي]
    SAVE_PIC --> PROFILE_UPDATED
    SAVE_BIO --> PROFILE_UPDATED
    SAVE_ACHIEVEMENT --> PROFILE_UPDATED
    SAVE_CONTACT --> PROFILE_UPDATED
    SAVE_PRIVACY --> PROFILE_UPDATED
    
    PROFILE_UPDATED --> NOTIFY_FOLLOWERS[إشعار المتابعين<br/>بالتحديثات الجديدة]
    NOTIFY_FOLLOWERS --> UPDATE_SEARCH[تحديث فهرس البحث]
    UPDATE_SEARCH --> PROFILE_COMPLETE[اكتمال التحديث]
    
    classDef start fill:#e8f5e8
    classDef section fill:#f3e5f5
    classDef edit fill:#e3f2fd
    classDef process fill:#fff3e0
    classDef save fill:#c8e6c9
    classDef error fill:#ffcdd2
    
    class PROFILE_START start
    class PROFILE_SECTIONS,ACHIEVEMENT_TYPES section
    class EDIT_BASIC,UPLOAD_PIC,EDIT_BIO,EDIT_CONTACT edit
    class VALIDATE_BASIC,CROP_PIC,BIO_SECTIONS,PRIVACY_OPTIONS process
    class SAVE_BASIC,SAVE_PIC,SAVE_BIO,SAVE_CONTACT,PROFILE_COMPLETE save
    class ERROR_BASIC error
```

---

## 👨‍💼 **4. رحلة الإدارة (Admin Journey)**

### **لوحة تحكم الإدارة:**
```mermaid
flowchart TD
    ADMIN_LOGIN([دخول الإدارة]) --> ADMIN_DASHBOARD[لوحة تحكم الإدارة]
    ADMIN_DASHBOARD --> ADMIN_OVERVIEW[نظرة عامة<br/>إحصائيات النظام]
    
    ADMIN_OVERVIEW --> ADMIN_MENU{قائمة الإدارة}
    
    ADMIN_MENU -->|المستخدمين| USER_MGMT[إدارة المستخدمين]
    ADMIN_MENU -->|الأحزاب| PARTY_MGMT[إدارة الأحزاب]
    ADMIN_MENU -->|أنواع الشكاوى| COMPLAINT_TYPES[إدارة أنواع الشكاوى]
    ADMIN_MENU -->|المحتوى| CONTENT_MGMT[إدارة المحتوى]
    ADMIN_MENU -->|الإعدادات| SYSTEM_SETTINGS[إعدادات النظام]
    ADMIN_MENU -->|التقارير| REPORTS[التقارير والإحصائيات]
    ADMIN_MENU -->|النسخ الاحتياطي| BACKUP[النسخ الاحتياطي]
    
    %% إدارة المستخدمين
    USER_MGMT --> USER_ACTIONS{إجراءات المستخدمين}
    USER_ACTIONS -->|عرض| VIEW_USERS[عرض جميع المستخدمين]
    USER_ACTIONS -->|بحث| SEARCH_USERS[البحث في المستخدمين]
    USER_ACTIONS -->|تعديل| EDIT_USER[تعديل مستخدم]
    USER_ACTIONS -->|حظر| BAN_USER[حظر مستخدم]
    USER_ACTIONS -->|إحصائيات| USER_STATS[إحصائيات المستخدمين]
    
    VIEW_USERS --> USER_LIST[قائمة المستخدمين<br/>مع الفلاتر والترتيب]
    USER_LIST --> SELECT_USER[اختيار مستخدم]
    SELECT_USER --> USER_DETAILS[تفاصيل المستخدم]
    USER_DETAILS --> USER_ACTIONS
    
    %% إدارة الأحزاب
    PARTY_MGMT --> PARTY_ACTIONS{إجراءات الأحزاب}
    PARTY_ACTIONS -->|عرض| VIEW_PARTIES[عرض جميع الأحزاب]
    PARTY_ACTIONS -->|إضافة| ADD_PARTY[إضافة حزب جديد]
    PARTY_ACTIONS -->|تعديل| EDIT_PARTY[تعديل حزب]
    PARTY_ACTIONS -->|حذف| DELETE_PARTY[حذف حزب]
    
    ADD_PARTY --> PARTY_FORM[نموذج الحزب<br/>الاسم، الشعار، اللون<br/>الوصف، الموقع]
    PARTY_FORM --> VALIDATE_PARTY[التحقق من البيانات]
    VALIDATE_PARTY -->|صحيحة| SAVE_PARTY[حفظ الحزب]
    VALIDATE_PARTY -->|خطأ| PARTY_ERROR[رسالة خطأ]
    PARTY_ERROR --> PARTY_FORM
    
    DELETE_PARTY --> CONFIRM_DELETE{تأكيد الحذف؟}
    CONFIRM_DELETE -->|نعم| CHECK_MEMBERS[فحص الأعضاء]
    CHECK_MEMBERS -->|يوجد أعضاء| TRANSFER_MEMBERS[نقل الأعضاء<br/>لحزب آخر]
    CHECK_MEMBERS -->|لا يوجد| REMOVE_PARTY[حذف الحزب]
    TRANSFER_MEMBERS --> REMOVE_PARTY
    
    %% إدارة أنواع الشكاوى
    COMPLAINT_TYPES --> COMP_TYPE_ACTIONS{إجراءات أنواع الشكاوى}
    COMP_TYPE_ACTIONS -->|عرض| VIEW_COMP_TYPES[عرض جميع الأنواع]
    COMP_TYPE_ACTIONS -->|إضافة| ADD_COMP_TYPE[إضافة نوع جديد]
    COMP_TYPE_ACTIONS -->|تعديل| EDIT_COMP_TYPE[تعديل نوع]
    COMP_TYPE_ACTIONS -->|حذف| DELETE_COMP_TYPE[حذف نوع]
    
    ADD_COMP_TYPE --> COMP_TYPE_FORM[نموذج النوع<br/>الاسم، الوصف، اللون<br/>الأيقونة، المجلس المختص]
    COMP_TYPE_FORM --> SAVE_COMP_TYPE[حفظ النوع]
    
    DELETE_COMP_TYPE --> CHECK_COMPLAINTS[فحص الشكاوى الموجودة]
    CHECK_COMPLAINTS -->|يوجد شكاوى| REASSIGN_COMPLAINTS[إعادة تصنيف الشكاوى]
    CHECK_COMPLAINTS -->|لا يوجد| REMOVE_COMP_TYPE[حذف النوع]
    
    %% إدارة المحتوى
    CONTENT_MGMT --> CONTENT_ACTIONS{إجراءات المحتوى}
    CONTENT_ACTIONS -->|الأخبار| NEWS_MGMT[إدارة الأخبار]
    CONTENT_ACTIONS -->|البنرات| BANNER_MGMT[إدارة البنرات]
    CONTENT_ACTIONS -->|الصفحات| PAGE_MGMT[إدارة الصفحات]
    
    NEWS_MGMT --> NEWS_LIST[قائمة الأخبار]
    NEWS_LIST --> NEWS_ACTIONS_SUB{إجراءات الأخبار}
    NEWS_ACTIONS_SUB -->|إضافة| ADD_NEWS[إضافة خبر]
    NEWS_ACTIONS_SUB -->|تعديل| EDIT_NEWS[تعديل خبر]
    NEWS_ACTIONS_SUB -->|حذف| DELETE_NEWS[حذف خبر]
    NEWS_ACTIONS_SUB -->|جدولة| SCHEDULE_NEWS[جدولة الأخبار]
    
    BANNER_MGMT --> BANNER_ACTIONS_SUB{إجراءات البنرات}
    BANNER_ACTIONS_SUB -->|رفع| UPLOAD_BANNER[رفع بنر جديد]
    BANNER_ACTIONS_SUB -->|تعديل| EDIT_BANNER[تعديل بنر]
    BANNER_ACTIONS_SUB -->|حذف| DELETE_BANNER[حذف بنر]
    BANNER_ACTIONS_SUB -->|جدولة| SCHEDULE_BANNER[جدولة البنر]
    
    %% إعدادات النظام
    SYSTEM_SETTINGS --> SETTINGS_CATEGORIES{فئات الإعدادات}
    SETTINGS_CATEGORIES -->|عامة| GENERAL_SETTINGS[الإعدادات العامة]
    SETTINGS_CATEGORIES -->|الأمان| SECURITY_SETTINGS[إعدادات الأمان]
    SETTINGS_CATEGORIES -->|الإشعارات| NOTIFICATION_SETTINGS[إعدادات الإشعارات]
    SETTINGS_CATEGORIES -->|الملفات| FILE_SETTINGS[إعدادات الملفات]
    
    GENERAL_SETTINGS --> EDIT_GENERAL[تعديل الإعدادات العامة<br/>اسم الموقع، الوصف<br/>معلومات الاتصال]
    SECURITY_SETTINGS --> EDIT_SECURITY[تعديل إعدادات الأمان<br/>كلمات المرور، الجلسات<br/>محاولات الدخول]
    FILE_SETTINGS --> EDIT_FILES[تعديل إعدادات الملفات<br/>الحد الأقصى للحجم<br/>الأنواع المسموحة]
    
    %% التقارير
    REPORTS --> REPORT_TYPES{أنواع التقارير}
    REPORT_TYPES -->|المستخدمين| USER_REPORTS[تقارير المستخدمين]
    REPORT_TYPES -->|الشكاوى| COMPLAINT_REPORTS[تقارير الشكاوى]
    REPORT_TYPES -->|الأداء| PERFORMANCE_REPORTS[تقارير الأداء]
    REPORT_TYPES -->|الإحصائيات| STATISTICS_REPORTS[التقارير الإحصائية]
    
    USER_REPORTS --> GENERATE_USER_REPORT[إنشاء تقرير المستخدمين]
    COMPLAINT_REPORTS --> GENERATE_COMPLAINT_REPORT[إنشاء تقرير الشكاوى]
    PERFORMANCE_REPORTS --> GENERATE_PERFORMANCE_REPORT[إنشاء تقرير الأداء]
    
    GENERATE_USER_REPORT --> EXPORT_REPORT[تصدير التقرير<br/>PDF, Excel, CSV]
    GENERATE_COMPLAINT_REPORT --> EXPORT_REPORT
    GENERATE_PERFORMANCE_REPORT --> EXPORT_REPORT
    
    classDef admin fill:#e8f5e8
    classDef menu fill:#f3e5f5
    classDef action fill:#e3f2fd
    classDef form fill:#fff3e0
    classDef process fill:#ffecb3
    classDef success fill:#c8e6c9
    classDef error fill:#ffcdd2
    
    class ADMIN_LOGIN admin
    class ADMIN_MENU,USER_ACTIONS,PARTY_ACTIONS,COMP_TYPE_ACTIONS menu
    class VIEW_USERS,ADD_PARTY,EDIT_PARTY,DELETE_PARTY action
    class PARTY_FORM,COMP_TYPE_FORM form
    class VALIDATE_PARTY,CHECK_MEMBERS,GENERATE_USER_REPORT process
    class SAVE_PARTY,REMOVE_PARTY,EXPORT_REPORT success
    class PARTY_ERROR error
```

---

## 📱 **5. تدفق الاستجابة للأجهزة المختلفة**

### **التكيف مع الأجهزة:**
```mermaid
flowchart TD
    DEVICE_DETECT([كشف نوع الجهاز]) --> DEVICE_TYPE{نوع الجهاز}
    
    DEVICE_TYPE -->|هاتف| MOBILE_FLOW[تدفق الهاتف]
    DEVICE_TYPE -->|تابلت| TABLET_FLOW[تدفق التابلت]
    DEVICE_TYPE -->|سطح المكتب| DESKTOP_FLOW[تدفق سطح المكتب]
    
    %% تدفق الهاتف
    MOBILE_FLOW --> MOBILE_LAYOUT[تخطيط الهاتف<br/>عمود واحد، قوائم منسدلة]
    MOBILE_LAYOUT --> MOBILE_NAVIGATION[التنقل للهاتف<br/>قائمة هامبرغر، أزرار كبيرة]
    MOBILE_NAVIGATION --> MOBILE_FORMS[نماذج الهاتف<br/>حقول مكدسة، لوحة مفاتيح محسنة]
    MOBILE_FORMS --> MOBILE_INTERACTIONS[التفاعلات<br/>اللمس، السحب، التمرير]
    
    %% تدفق التابلت
    TABLET_FLOW --> TABLET_LAYOUT[تخطيط التابلت<br/>عمودين، شريط جانبي]
    TABLET_LAYOUT --> TABLET_NAVIGATION[التنقل للتابلت<br/>قوائم ثابتة، أيقونات متوسطة]
    TABLET_NAVIGATION --> TABLET_FORMS[نماذج التابلت<br/>حقول جنباً لجنب، تحسين اللمس]
    
    %% تدفق سطح المكتب
    DESKTOP_FLOW --> DESKTOP_LAYOUT[تخطيط سطح المكتب<br/>ثلاثة أعمدة، شريط علوي]
    DESKTOP_LAYOUT --> DESKTOP_NAVIGATION[التنقل لسطح المكتب<br/>قوائم أفقية، اختصارات لوحة المفاتيح]
    DESKTOP_NAVIGATION --> DESKTOP_FORMS[نماذج سطح المكتب<br/>حقول متقدمة، تحقق فوري]
    DESKTOP_FORMS --> DESKTOP_INTERACTIONS[التفاعلات<br/>الماوس، لوحة المفاتيح، اختصارات]
    
    %% التحسين المشترك
    MOBILE_INTERACTIONS --> OPTIMIZE[تحسين الأداء]
    TABLET_FORMS --> OPTIMIZE
    DESKTOP_INTERACTIONS --> OPTIMIZE
    
    OPTIMIZE --> CACHE_STRATEGY[استراتيجية التخزين المؤقت<br/>حسب نوع الجهاز]
    CACHE_STRATEGY --> LOAD_OPTIMIZATION[تحسين التحميل<br/>الصور، الخطوط، الملفات]
    LOAD_OPTIMIZATION --> PERFORMANCE_MONITOR[مراقبة الأداء<br/>سرعة التحميل، الاستجابة]
    
    classDef device fill:#e3f2fd
    classDef mobile fill:#c8e6c9
    classDef tablet fill:#fff3e0
    classDef desktop fill:#f3e5f5
    classDef optimize fill:#ffecb3
    
    class DEVICE_DETECT,DEVICE_TYPE device
    class MOBILE_FLOW,MOBILE_LAYOUT,MOBILE_NAVIGATION,MOBILE_FORMS,MOBILE_INTERACTIONS mobile
    class TABLET_FLOW,TABLET_LAYOUT,TABLET_NAVIGATION,TABLET_FORMS tablet
    class DESKTOP_FLOW,DESKTOP_LAYOUT,DESKTOP_NAVIGATION,DESKTOP_FORMS,DESKTOP_INTERACTIONS desktop
    class OPTIMIZE,CACHE_STRATEGY,LOAD_OPTIMIZATION,PERFORMANCE_MONITOR optimize
```

---

## 🔄 **6. تدفق معالجة الأخطاء**

### **استراتيجية معالجة الأخطاء:**
```mermaid
flowchart TD
    ERROR_OCCUR([حدوث خطأ]) --> ERROR_TYPE{نوع الخطأ}
    
    ERROR_TYPE -->|شبكة| NETWORK_ERROR[خطأ في الشبكة]
    ERROR_TYPE -->|خادم| SERVER_ERROR[خطأ في الخادم]
    ERROR_TYPE -->|مصادقة| AUTH_ERROR[خطأ في المصادقة]
    ERROR_TYPE -->|بيانات| DATA_ERROR[خطأ في البيانات]
    ERROR_TYPE -->|واجهة| UI_ERROR[خطأ في الواجهة]
    
    %% خطأ الشبكة
    NETWORK_ERROR --> CHECK_CONNECTION[فحص الاتصال]
    CHECK_CONNECTION -->|متصل| RETRY_REQUEST[إعادة المحاولة]
    CHECK_CONNECTION -->|غير متصل| OFFLINE_MODE[الوضع غير المتصل]
    
    RETRY_REQUEST --> RETRY_COUNT{عدد المحاولات}
    RETRY_COUNT -->|< 3| WAIT_RETRY[انتظار ثم إعادة المحاولة]
    RETRY_COUNT -->|>= 3| SHOW_ERROR[عرض رسالة خطأ]
    WAIT_RETRY --> RETRY_REQUEST
    
    OFFLINE_MODE --> CACHE_DATA[استخدام البيانات المخزنة]
    CACHE_DATA --> OFFLINE_NOTIFICATION[إشعار الوضع غير المتصل]
    
    %% خطأ الخادم
    SERVER_ERROR --> ERROR_CODE{رمز الخطأ}
    ERROR_CODE -->|500| INTERNAL_ERROR[خطأ داخلي في الخادم]
    ERROR_CODE -->|503| SERVICE_UNAVAILABLE[الخدمة غير متاحة]
    ERROR_CODE -->|404| NOT_FOUND[الصفحة غير موجودة]
    
    INTERNAL_ERROR --> LOG_ERROR[تسجيل الخطأ]
    SERVICE_UNAVAILABLE --> MAINTENANCE_MODE[وضع الصيانة]
    NOT_FOUND --> REDIRECT_HOME[إعادة توجيه للرئيسية]
    
    LOG_ERROR --> NOTIFY_ADMIN[إشعار الإدارة]
    NOTIFY_ADMIN --> SHOW_GENERIC_ERROR[عرض رسالة خطأ عامة]
    
    %% خطأ المصادقة
    AUTH_ERROR --> AUTH_CHECK{نوع خطأ المصادقة}
    AUTH_CHECK -->|انتهت الجلسة| SESSION_EXPIRED[انتهت الجلسة]
    AUTH_CHECK -->|صلاحيات| PERMISSION_DENIED[ليس لديك صلاحية]
    AUTH_CHECK -->|بيانات خاطئة| INVALID_CREDENTIALS[بيانات دخول خاطئة]
    
    SESSION_EXPIRED --> REFRESH_TOKEN[تحديث الرمز المميز]
    REFRESH_TOKEN -->|نجح| RETRY_ORIGINAL[إعادة المحاولة الأصلية]
    REFRESH_TOKEN -->|فشل| FORCE_LOGIN[إجبار تسجيل الدخول]
    
    PERMISSION_DENIED --> SHOW_ACCESS_DENIED[عرض رسالة منع الوصول]
    INVALID_CREDENTIALS --> SHOW_LOGIN_ERROR[عرض خطأ تسجيل الدخول]
    
    %% خطأ البيانات
    DATA_ERROR --> DATA_VALIDATION{نوع خطأ البيانات}
    DATA_VALIDATION -->|تحقق| VALIDATION_ERROR[خطأ في التحقق]
    DATA_VALIDATION -->|تنسيق| FORMAT_ERROR[خطأ في التنسيق]
    DATA_VALIDATION -->|مفقود| MISSING_DATA[بيانات مفقودة]
    
    VALIDATION_ERROR --> HIGHLIGHT_FIELDS[تمييز الحقول الخاطئة]
    FORMAT_ERROR --> SHOW_FORMAT_HELP[عرض مساعدة التنسيق]
    MISSING_DATA --> HIGHLIGHT_REQUIRED[تمييز الحقول المطلوبة]
    
    HIGHLIGHT_FIELDS --> FOCUS_FIRST_ERROR[التركيز على أول خطأ]
    SHOW_FORMAT_HELP --> FOCUS_FIRST_ERROR
    HIGHLIGHT_REQUIRED --> FOCUS_FIRST_ERROR
    
    %% خطأ الواجهة
    UI_ERROR --> UI_RECOVERY{استراتيجية الاستعادة}
    UI_RECOVERY -->|إعادة تحميل| RELOAD_COMPONENT[إعادة تحميل المكون]
    UI_RECOVERY -->|إعادة تعيين| RESET_STATE[إعادة تعيين الحالة]
    UI_RECOVERY -->|تجاهل| IGNORE_ERROR[تجاهل الخطأ]
    
    RELOAD_COMPONENT --> CHECK_RECOVERY[فحص الاستعادة]
    RESET_STATE --> CHECK_RECOVERY
    CHECK_RECOVERY -->|نجح| CONTINUE_NORMAL[متابعة العمل الطبيعي]
    CHECK_RECOVERY -->|فشل| SHOW_UI_ERROR[عرض خطأ الواجهة]
    
    %% النهاية
    SHOW_ERROR --> USER_ACTION{إجراء المستخدم}
    OFFLINE_NOTIFICATION --> USER_ACTION
    SHOW_GENERIC_ERROR --> USER_ACTION
    FORCE_LOGIN --> USER_ACTION
    SHOW_ACCESS_DENIED --> USER_ACTION
    SHOW_LOGIN_ERROR --> USER_ACTION
    FOCUS_FIRST_ERROR --> USER_ACTION
    CONTINUE_NORMAL --> USER_ACTION
    SHOW_UI_ERROR --> USER_ACTION
    
    USER_ACTION -->|إعادة المحاولة| ERROR_OCCUR
    USER_ACTION -->|إغلاق| DISMISS_ERROR[إغلاق الخطأ]
    USER_ACTION -->|الإبلاغ| REPORT_ERROR[الإبلاغ عن الخطأ]
    
    DISMISS_ERROR --> CONTINUE_NORMAL
    REPORT_ERROR --> SEND_ERROR_REPORT[إرسال تقرير الخطأ]
    SEND_ERROR_REPORT --> CONTINUE_NORMAL
    
    classDef error fill:#ffcdd2
    classDef network fill:#e3f2fd
    classDef server fill:#fff3e0
    classDef auth fill:#f3e5f5
    classDef data fill:#e8f5e8
    classDef ui fill:#ffecb3
    classDef action fill:#c8e6c9
    
    class ERROR_OCCUR,ERROR_TYPE error
    class NETWORK_ERROR,CHECK_CONNECTION,RETRY_REQUEST,OFFLINE_MODE network
    class SERVER_ERROR,ERROR_CODE,INTERNAL_ERROR,SERVICE_UNAVAILABLE server
    class AUTH_ERROR,AUTH_CHECK,SESSION_EXPIRED,PERMISSION_DENIED auth
    class DATA_ERROR,DATA_VALIDATION,VALIDATION_ERROR,FORMAT_ERROR data
    class UI_ERROR,UI_RECOVERY,RELOAD_COMPONENT,RESET_STATE ui
    class USER_ACTION,DISMISS_ERROR,CONTINUE_NORMAL action
```

---

## 📊 **خلاصة مخططات التدفق**

### **الإحصائيات:**
- **5 أنواع مستخدمين** مختلفة
- **15+ رحلة مستخدم** مفصلة
- **50+ نقطة قرار** في التدفقات
- **100+ خطوة عمل** محددة
- **معالجة شاملة للأخطاء** في جميع المسارات

### **الفوائد المحققة:**
✅ **وضوح كامل** لرحلة كل مستخدم  
✅ **تحديد نقاط الاختناق** المحتملة  
✅ **معالجة جميع الحالات** الاستثنائية  
✅ **تحسين تجربة المستخدم** على جميع الأجهزة  
✅ **دليل واضح للمطورين** والمصممين  

هذه المخططات توفر فهماً عميقاً وشاملاً لكيفية تفاعل المستخدمين مع النظام! 🎯
