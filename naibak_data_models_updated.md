# نماذج البيانات المحدثة - مشروع Naebak

---

## 🎉 **نموذج الحزب (Party) - جديد**

```python
class Party:
    name: str (unique, required)  # اسم الحزب بالعربية
    name_en: str (unique)  # الاسم بالإنجليزية
    abbreviation: str (max 10)  # الاختصار
    
    # معلومات إضافية
    description: str (max 500, optional)
    website: str (optional)
    logo: str (URL, optional)
    
    # الحالة
    is_active: bool (default=True)
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
    created_by: User (ForeignKey)  # الإدارة التي أضافت الحزب
    
    # إحصائيات
    members_count: int (computed)  # عدد الأعضاء المنتسبين
    
    def __str__(self):
        return self.name
```

---

## 🏛️ **نموذج المجلس (Council) - جديد**

```python
class Council:
    name: str (unique)  # مجلس النواب، مجلس الشيوخ
    name_en: str (unique)  # Parliament, Senate
    code: str (unique)  # parliament, senate
    
    # معلومات المجلس
    description: str (max 1000)
    term_duration: int  # مدة العضوية بالسنوات (5)
    total_seats: int  # إجمالي المقاعد
    
    # الحالة
    is_active: bool (default=True)
    
    # التواريخ
    created_at: datetime
    updated_at: datetime
    
    def __str__(self):
        return self.name
```

---

## 👤 **نموذج نوع العضوية (MembershipType) - جديد**

```python
class MembershipType:
    name: str (unique)  # مرشح، عضو حالي
    name_en: str (unique)  # Candidate, Current Member
    code: str (unique)  # candidate, current_member
    
    # الوصف
    description: str (max 200)
    
    # الحالة
    is_active: bool (default=True)
    
    def __str__(self):
        return self.name
```

---

## 📋 **نموذج نموذج التسجيل (RegistrationForm) - جديد**

```python
class RegistrationForm:
    # البيانات الأساسية
    email: str (required, unique)
    password: str (required, min 8 chars)
    confirm_password: str (required, must match)
    
    first_name: str (required, max 50)
    last_name: str (required, max 50)
    phone_number: str (required, unique, format: +201xxxxxxxxx)
    national_id: str (required, 14 digits, unique)
    
    # نوع المستخدم (مطلوب)
    user_type: str (required)  # citizen, candidate, current_member
    
    # للمواطن
    governorate: str (required)  # من قائمة 27 محافظة
    city: str (required)
    gender: str (required)  # male, female
    birth_date: date (required)
    
    # للمرشح/النائب (إضافي)
    council_type: str (conditional)  # parliament, senate (مطلوب إذا كان مرشح/نائب)
    membership_type: str (conditional)  # candidate, current_member (مطلوب إذا كان مرشح/نائب)
    party: int (conditional)  # Party ID (مطلوب إذا كان مرشح/نائب)
    constituency: str (conditional)  # الدائرة الانتخابية
    electoral_number: str (optional)  # الرقم الانتخابي
    electoral_symbol: str (optional)  # الرمز الانتخابي
    
    # الموافقة على الشروط
    agree_terms: bool (required=True)
    agree_privacy: bool (required=True)
    
    # التحقق
    def clean(self):
        # التحقق من تطابق كلمة المرور
        if self.password != self.confirm_password:
            raise ValidationError("كلمة المرور غير متطابقة")
        
        # التحقق من البيانات الإضافية للمرشح/النائب
        if self.user_type in ['candidate', 'current_member']:
            if not all([self.council_type, self.membership_type, self.party]):
                raise ValidationError("يجب تحديد المجلس ونوع العضوية والحزب")
```

---

## 🔍 **نموذج الفلاتر (RepresentativeFilter) - جديد**

```python
class RepresentativeFilter:
    # فلاتر البحث
    search_name: str (optional)  # البحث بالاسم
    gender: str (optional)  # male, female
    party: int (optional)  # Party ID
    council_type: str (optional)  # parliament, senate
    membership_type: str (optional)  # candidate, current_member
    governorate: str (optional)  # المحافظة
    
    # فلاتر التقييم
    min_rating: float (optional)  # الحد الأدنى للتقييم
    is_featured: bool (optional)  # المرشحين المميزين فقط
    
    # الترتيب
    order_by: str (default='rating_average')  # rating_average, name, created_at
    order_direction: str (default='desc')  # asc, desc
    
    # التصفح
    page: int (default=1)
    per_page: int (default=12)
    
    def apply_filters(self, queryset):
        if self.search_name:
            queryset = queryset.filter(
                Q(user__first_name__icontains=self.search_name) |
                Q(user__last_name__icontains=self.search_name)
            )
        
        if self.gender:
            queryset = queryset.filter(user__gender=self.gender)
        
        if self.party:
            queryset = queryset.filter(party_id=self.party)
        
        if self.council_type:
            queryset = queryset.filter(council_type=self.council_type)
        
        if self.membership_type:
            queryset = queryset.filter(membership_type=self.membership_type)
        
        if self.governorate:
            queryset = queryset.filter(user__governorate=self.governorate)
        
        if self.min_rating:
            queryset = queryset.filter(rating_average__gte=self.min_rating)
        
        if self.is_featured:
            queryset = queryset.filter(is_featured=True)
        
        # الترتيب
        order_field = self.order_by
        if self.order_direction == 'desc':
            order_field = f'-{order_field}'
        
        return queryset.order_by(order_field)
```

---

## ⚙️ **نموذج إعدادات الأحزاب (PartySettings) - جديد**

```python
class PartySettings:
    # إعدادات عامة
    allow_independent: bool (default=True)  # السماح بـ "مستقل"
    require_party_approval: bool (default=False)  # تتطلب موافقة الحزب
    
    # حدود الأحزاب
    max_parties: int (default=50)  # الحد الأقصى لعدد الأحزاب
    min_party_name_length: int (default=3)
    max_party_name_length: int (default=100)
    
    # التواريخ
    updated_at: datetime
    updated_by: User (ForeignKey)  # الإدارة
```

---

## 📊 **نموذج إحصائيات الأحزاب (PartyStatistics) - جديد**

```python
class PartyStatistics:
    party: Party (ForeignKey)
    
    # إحصائيات العضوية
    total_members: int  # إجمالي الأعضاء
    candidates_count: int  # عدد المرشحين
    current_members_count: int  # عدد الأعضاء الحاليين
    
    # إحصائيات التقييم
    average_rating: float  # متوسط تقييم أعضاء الحزب
    total_ratings: int  # إجمالي التقييمات
    
    # إحصائيات الأداء
    total_solved_complaints: int  # إجمالي الشكاوى المحلولة
    total_received_complaints: int  # إجمالي الشكاوى المستلمة
    
    # التوزيع الجغرافي
    governorates_coverage: int  # عدد المحافظات المغطاة
    
    # التواريخ
    calculated_at: datetime
    
    @classmethod
    def calculate_for_party(cls, party):
        # حساب الإحصائيات للحزب
        members = Representative.objects.filter(party=party)
        
        return cls.objects.update_or_create(
            party=party,
            defaults={
                'total_members': members.count(),
                'candidates_count': members.filter(membership_type='candidate').count(),
                'current_members_count': members.filter(membership_type='current_member').count(),
                'average_rating': members.aggregate(Avg('rating_average'))['rating_average__avg'] or 0,
                'total_ratings': members.aggregate(Sum('rating_count'))['rating_count__sum'] or 0,
                'total_solved_complaints': members.aggregate(Sum('solved_complaints'))['solved_complaints__sum'] or 0,
                'total_received_complaints': members.aggregate(Sum('received_complaints'))['received_complaints__sum'] or 0,
                'governorates_coverage': members.values('user__governorate').distinct().count(),
                'calculated_at': timezone.now()
            }
        )
```

---

## 📱 **نموذج إعدادات التطبيق المحمول (MobileSettings) - جديد**

```python
class MobileSettings:
    # إعدادات الفلاتر
    default_filters_collapsed: bool (default=True)  # الفلاتر مطوية افتراضياً
    max_filters_visible: int (default=3)  # عدد الفلاتر المرئية
    
    # إعدادات العرض
    cards_per_row_mobile: int (default=1)  # كرت واحد في الصف للموبايل
    cards_per_row_tablet: int (default=2)  # كرتين في الصف للتابلت
    cards_per_row_desktop: int (default=3)  # 3 كروت في الصف للديسكتوب
    
    # إعدادات التفاعل
    enable_swipe_navigation: bool (default=True)  # التنقل بالسحب
    enable_pull_to_refresh: bool (default=True)  # السحب للتحديث
    
    # التواريخ
    updated_at: datetime
    updated_by: User (ForeignKey)
```
