# مواصفات صفحات الفرونت إند التفصيلية - مشروع Naebak

---

## 🎨 **نظام الألوان والتصميم العام**

### **الألوان الأساسية:**
```css
:root {
  /* الألوان الأساسية */
  --primary-green: #2E7D32;      /* الأخضر الأساسي */
  --primary-green-light: #4CAF50; /* الأخضر الفاتح */
  --primary-green-dark: #1B5E20;  /* الأخضر الغامق */
  
  /* ألوان الشريط الإخباري */
  --news-bg: #424242;             /* رمادي غامق */
  --news-text: #FFFFFF;           /* أبيض */
  --news-border-top: #FF9800;     /* برتقالي فاتح - 2px */
  --news-border-bottom: #FF6F00;  /* برتقالي غامق - 4px */
  --news-separator: #616161;      /* رمادي متوسط - 2px */
  
  /* ألوان الخلفيات */
  --bg-white: #FFFFFF;
  --bg-light-gray: #F5F5F5;
  --bg-dark-gray: #424242;
  
  /* ألوان النصوص */
  --text-primary: #212121;
  --text-secondary: #757575;
  --text-white: #FFFFFF;
  
  /* ألوان التقييم */
  --star-gold: #FFD700;
  --star-empty: #E0E0E0;
  
  /* ألوان الحالة */
  --success: #4CAF50;
  --warning: #FF9800;
  --error: #F44336;
  --info: #2196F3;
  
  /* ألوان الأحزاب (قابلة للتخصيص من الإدارة) */
  --party-wafd: #1976D2;
  --party-ghad: #E91E63;
  --party-independent: #9E9E9E;
}
```

### **الخطوط:**
```css
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');

:root {
  --font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
}
```

### **المسافات والأبعاد:**
```css
:root {
  /* المسافات */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  
  /* الحدود */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  
  /* الظلال */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

---

## 📱 **نقاط التوقف المتجاوبة (Breakpoints)**

```css
:root {
  /* نقاط التوقف */
  --breakpoint-sm: 640px;   /* الهواتف الكبيرة */
  --breakpoint-md: 768px;   /* التابلت الصغير */
  --breakpoint-lg: 1024px;  /* التابلت الكبير */
  --breakpoint-xl: 1280px;  /* الشاشات الصغيرة */
  --breakpoint-2xl: 1536px; /* الشاشات الكبيرة */
}

/* Media Queries */
@media (max-width: 640px) {
  /* الهواتف */
  .container { padding: var(--spacing-sm); }
  .grid-cols { grid-template-columns: 1fr; }
  .text-responsive { font-size: var(--font-size-sm); }
}

@media (min-width: 641px) and (max-width: 1024px) {
  /* التابلت */
  .container { padding: var(--spacing-md); }
  .grid-cols { grid-template-columns: repeat(2, 1fr); }
  .text-responsive { font-size: var(--font-size-base); }
}

@media (min-width: 1025px) {
  /* الشاشات الكبيرة */
  .container { padding: var(--spacing-lg); }
  .grid-cols { grid-template-columns: repeat(3, 1fr); }
  .text-responsive { font-size: var(--font-size-lg); }
}
```

---

## 🏠 **صفحة الهبوط (Landing Page)**

### **البنية العامة:**
```html
<div class="landing-page">
  <!-- Header -->
  <header class="header-component"></header>
  
  <!-- Banner -->
  <section class="banner-section"></section>
  
  <!-- News Bar -->
  <div class="news-bar-component"></div>
  
  <!-- Main Content -->
  <main class="main-content">
    <!-- للزوار -->
    <div class="visitor-content" v-if="!isLoggedIn">
      <div class="auth-forms-container">
        <div class="login-form"></div>
        <div class="register-form"></div>
        <div class="guest-access"></div>
      </div>
      <div class="platform-info"></div>
    </div>
    
    <!-- للمستخدمين المسجلين -->
    <div class="user-dashboard" v-if="isLoggedIn">
      <div class="welcome-section"></div>
      <div class="services-grid"></div>
      <div class="statistics-cards"></div>
    </div>
  </main>
  
  <!-- Footer -->
  <footer class="footer-component"></footer>
</div>
```

### **مواصفات المكونات:**

#### **1. نماذج المصادقة (Auth Forms):**
```css
.auth-forms-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: var(--spacing-2xl) auto;
  padding: var(--spacing-lg);
}

.login-form, .register-form {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xl);
}

.form-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--primary-green);
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid #E0E0E0;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}

.form-select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid #E0E0E0;
  border-radius: var(--border-radius-md);
  background-color: var(--bg-white);
  font-size: var(--font-size-base);
}

.submit-button {
  width: 100%;
  padding: var(--spacing-md);
  background: var(--primary-green);
  color: var(--text-white);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background: var(--primary-green-dark);
}

/* الاستجابة للهواتف */
@media (max-width: 768px) {
  .auth-forms-container {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    padding: var(--spacing-md);
  }
}
```

#### **2. زر الدخول كزائر:**
```css
.guest-access {
  grid-column: 1 / -1;
  text-align: center;
  margin-top: var(--spacing-lg);
}

.guest-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  background: transparent;
  color: var(--primary-green);
  border: 2px solid var(--primary-green);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.guest-button:hover {
  background: var(--primary-green);
  color: var(--text-white);
}

.guest-icon {
  width: 20px;
  height: 20px;
}
```

#### **3. معلومات المنصة:**
```css
.platform-info {
  max-width: 1200px;
  margin: var(--spacing-2xl) auto;
  padding: var(--spacing-lg);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.info-card {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl);
  text-align: center;
}

.info-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-md);
  color: var(--primary-green);
}

.info-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.info-description {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.6;
}
```

---

## 👥 **صفحة المرشحين/النواب (Representatives Page)**

### **البنية العامة:**
```html
<div class="representatives-page">
  <header class="header-component"></header>
  <div class="news-bar-component"></div>
  
  <main class="main-content">
    <!-- الفلاتر -->
    <section class="filters-section">
      <div class="filters-container">
        <div class="search-filter"></div>
        <div class="dropdown-filters"></div>
        <div class="filter-actions"></div>
      </div>
    </section>
    
    <!-- النتائج -->
    <section class="results-section">
      <div class="results-header"></div>
      <div class="representatives-grid"></div>
      <div class="pagination"></div>
    </section>
  </main>
  
  <footer class="footer-component"></footer>
</div>
```

### **مواصفات الفلاتر:**
```css
.filters-section {
  background: var(--bg-light-gray);
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid #E0E0E0;
}

.filters-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: var(--spacing-md);
  align-items: end;
}

.search-filter {
  position: relative;
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 40px;
  border: 2px solid #E0E0E0;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  background: var(--bg-white);
}

.search-icon {
  position: absolute;
  left: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
}

.filter-dropdown {
  position: relative;
}

.dropdown-button {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-white);
  border: 2px solid #E0E0E0;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  text-align: right;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-white);
  border: 2px solid #E0E0E0;
  border-top: none;
  border-radius: 0 0 var(--border-radius-md) var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background: var(--bg-light-gray);
}

.dropdown-item.selected {
  background: var(--primary-green);
  color: var(--text-white);
}

/* الاستجابة للهواتف */
@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .filters-container {
    padding: 0 var(--spacing-md);
  }
}
```

### **مواصفات شبكة المرشحين:**
```css
.representatives-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: var(--spacing-xl) auto;
  padding: 0 var(--spacing-lg);
}

.representative-card {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.representative-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card-header {
  position: relative;
  padding: var(--spacing-lg);
  text-align: center;
}

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto var(--spacing-md);
  border: 4px solid var(--bg-white);
  box-shadow: var(--shadow-md);
}

.representative-name {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.membership-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--primary-green);
  color: var(--text-white);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
}

.representative-info {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.4;
}

.party-name {
  color: var(--primary-green);
  font-weight: 500;
}

.card-body {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
}

.rating-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  width: 16px;
  height: 16px;
  color: var(--star-gold);
}

.star.empty {
  color: var(--star-empty);
}

.rating-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-right: var(--spacing-xs);
}

.statistics {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm);
  background: var(--bg-light-gray);
  border-radius: var(--border-radius-md);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--primary-green);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.featured-badge {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  background: var(--warning);
  color: var(--text-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.view-profile-button {
  width: 100%;
  padding: var(--spacing-sm);
  background: var(--primary-green);
  color: var(--text-white);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-profile-button:hover {
  background: var(--primary-green-dark);
}

/* الاستجابة للهواتف */
@media (max-width: 768px) {
  .representatives-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    padding: 0 var(--spacing-md);
  }
  
  .representative-card {
    margin-bottom: var(--spacing-md);
  }
}
```

---

## 📄 **الصفحة الشخصية للمرشح/النائب**

### **البنية العامة:**
```html
<div class="profile-page">
  <header class="header-component"></header>
  <div class="news-bar-component"></div>
  
  <main class="main-content">
    <!-- غلاف الصفحة -->
    <section class="profile-header">
      <div class="banner-image"></div>
      <div class="profile-info"></div>
    </section>
    
    <!-- محتوى الصفحة -->
    <section class="profile-content">
      <div class="content-grid">
        <div class="main-column">
          <div class="about-section"></div>
          <div class="achievements-section"></div>
          <div class="contact-section"></div>
        </div>
        <div class="sidebar">
          <div class="rating-widget"></div>
          <div class="statistics-widget"></div>
          <div class="message-widget"></div>
        </div>
      </div>
    </section>
  </main>
  
  <footer class="footer-component"></footer>
</div>
```

### **مواصفات غلاف الصفحة:**
```css
.profile-header {
  position: relative;
  background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-dark) 100%);
  color: var(--text-white);
  overflow: hidden;
}

.banner-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.3;
}

.profile-info {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-lg);
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--spacing-xl);
  align-items: center;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--text-white);
  box-shadow: var(--shadow-xl);
}

.profile-details h1 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.profile-subtitle {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  margin-bottom: var(--spacing-md);
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: var(--font-size-base);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.meta-icon {
  width: 16px;
  height: 16px;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.action-button {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid var(--text-white);
  border-radius: var(--border-radius-md);
  background: transparent;
  color: var(--text-white);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
}

.action-button:hover {
  background: var(--text-white);
  color: var(--primary-green);
}

.action-button.primary {
  background: var(--text-white);
  color: var(--primary-green);
}

.action-button.primary:hover {
  background: transparent;
  color: var(--text-white);
}

/* الاستجابة للهواتف */
@media (max-width: 768px) {
  .profile-info {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--spacing-lg);
  }
  
  .profile-avatar {
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }
  
  .profile-actions {
    flex-direction: row;
    justify-content: center;
  }
}
```

---

## 🔔 **مكون الإشعارات (Notifications Component)**

### **البنية:**
```html
<div class="notifications-component">
  <div class="notification-bell" @click="toggleNotifications">
    <svg class="bell-icon"></svg>
    <span class="notification-count" v-if="unreadCount > 0">{{ unreadCount }}</span>
  </div>
  
  <div class="notifications-dropdown" v-show="isOpen">
    <div class="dropdown-header">
      <h3>الإشعارات</h3>
      <button class="mark-all-read">تحديد الكل كمقروء</button>
    </div>
    
    <div class="notifications-list">
      <div class="notification-item" v-for="notification in notifications">
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
          <div class="notification-time">{{ notification.time }}</div>
        </div>
        <div class="notification-actions">
          <button class="mark-read" v-if="!notification.is_read">✓</button>
          <button class="delete-notification">×</button>
        </div>
      </div>
    </div>
    
    <div class="dropdown-footer">
      <a href="/notifications" class="view-all">عرض جميع الإشعارات</a>
    </div>
  </div>
</div>
```

### **مواصفات التصميم:**
```css
.notifications-component {
  position: relative;
}

.notification-bell {
  position: relative;
  padding: var(--spacing-sm);
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.notification-bell:hover {
  background: rgba(0, 0, 0, 0.1);
}

.bell-icon {
  width: 24px;
  height: 24px;
  color: var(--primary-green);
}

.notification-count {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--error);
  color: var(--text-white);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: var(--font-size-xs);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.notifications-dropdown {
  position: absolute;
  top: 100%;
  left: -200px;
  width: 350px;
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid #E0E0E0;
  z-index: 1000;
  max-height: 400px;
  overflow: hidden;
}

.dropdown-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid #E0E0E0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-header h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.mark-all-read {
  background: none;
  border: none;
  color: var(--primary-green);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  padding: var(--spacing-md);
  border-bottom: 1px solid #F0F0F0;
  display: flex;
  gap: var(--spacing-sm);
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background: var(--bg-light-gray);
}

.notification-item.unread {
  background: rgba(46, 125, 50, 0.05);
  border-right: 4px solid var(--primary-green);
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.notification-message {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: var(--spacing-xs);
}

.notification-time {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.mark-read, .delete-notification {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.mark-read {
  background: var(--success);
  color: var(--text-white);
}

.delete-notification {
  background: var(--error);
  color: var(--text-white);
}

.dropdown-footer {
  padding: var(--spacing-md);
  border-top: 1px solid #E0E0E0;
  text-align: center;
}

.view-all {
  color: var(--primary-green);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.view-all:hover {
  text-decoration: underline;
}

/* الاستجابة للهواتف */
@media (max-width: 768px) {
  .notifications-dropdown {
    left: -150px;
    width: 300px;
  }
}
```

---

## 📊 **مكون عداد الزوار (Visitor Counter)**

### **البنية:**
```html
<div class="visitor-counter">
  <div class="counter-icon">
    <svg class="eye-icon"></svg>
  </div>
  <div class="counter-text">
    <span class="counter-number">{{ visitorCount.toLocaleString() }}</span>
    <span class="counter-label">زائر</span>
  </div>
</div>
```

### **مواصفات التصميم:**
```css
.visitor-counter {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(46, 125, 50, 0.1);
  border-radius: var(--border-radius-md);
  transition: all 0.3s ease;
}

.visitor-counter:hover {
  background: rgba(46, 125, 50, 0.15);
  transform: scale(1.05);
}

.counter-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-icon {
  width: 20px;
  height: 20px;
  color: var(--primary-green);
}

.counter-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.counter-number {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--primary-green);
  line-height: 1;
}

.counter-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  line-height: 1;
}

/* تأثير العد التصاعدي */
.counter-number {
  animation: countUp 2s ease-out;
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* الاستجابة للهواتف */
@media (max-width: 768px) {
  .visitor-counter {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  
  .counter-number {
    font-size: var(--font-size-sm);
  }
  
  .counter-label {
    font-size: 10px;
  }
}
```

---

## 🎨 **ملف CSS مؤقت للتطوير (Development CSS)**

```css
/* ملف CSS مؤقت للتطوير - naebak-dev.css */

/* إعادة تعيين الأساسيات */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family);
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--bg-light-gray);
  direction: rtl;
  text-align: right;
}

/* الحاويات */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.container-fluid {
  width: 100%;
  padding: 0 var(--spacing-lg);
}

/* الشبكات */
.grid {
  display: grid;
  gap: var(--spacing-lg);
}

.grid-cols-1 { grid-template-columns: 1fr; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* الفليكس */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }
.gap-lg { gap: var(--spacing-lg); }

/* النصوص */
.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }
.text-2xl { font-size: var(--font-size-2xl); }
.text-3xl { font-size: var(--font-size-3xl); }

.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.text-center { text-align: center; }
.text-right { text-align: right; }
.text-left { text-align: left; }

/* الألوان */
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-white { color: var(--text-white); }
.text-green { color: var(--primary-green); }

.bg-white { background-color: var(--bg-white); }
.bg-gray { background-color: var(--bg-light-gray); }
.bg-green { background-color: var(--primary-green); }
.bg-dark { background-color: var(--bg-dark-gray); }

/* المسافات */
.p-xs { padding: var(--spacing-xs); }
.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }
.p-xl { padding: var(--spacing-xl); }

.m-xs { margin: var(--spacing-xs); }
.m-sm { margin: var(--spacing-sm); }
.m-md { margin: var(--spacing-md); }
.m-lg { margin: var(--spacing-lg); }
.m-xl { margin: var(--spacing-xl); }

/* الحدود */
.rounded-sm { border-radius: var(--border-radius-sm); }
.rounded-md { border-radius: var(--border-radius-md); }
.rounded-lg { border-radius: var(--border-radius-lg); }
.rounded-xl { border-radius: var(--border-radius-xl); }
.rounded-full { border-radius: 50%; }

/* الظلال */
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }

/* الأزرار */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--primary-green);
  color: var(--text-white);
}

.btn-primary:hover {
  background: var(--primary-green-dark);
}

.btn-secondary {
  background: transparent;
  color: var(--primary-green);
  border: 2px solid var(--primary-green);
}

.btn-secondary:hover {
  background: var(--primary-green);
  color: var(--text-white);
}

/* الكروت */
.card {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid #E0E0E0;
}

.card-body {
  padding: var(--spacing-lg);
}

.card-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid #E0E0E0;
  background: var(--bg-light-gray);
}

/* النماذج */
.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid #E0E0E0;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}

/* الأدوات المساعدة */
.hidden { display: none; }
.visible { display: block; }
.opacity-0 { opacity: 0; }
.opacity-50 { opacity: 0.5; }
.opacity-100 { opacity: 1; }

.cursor-pointer { cursor: pointer; }
.cursor-not-allowed { cursor: not-allowed; }

.select-none { user-select: none; }
.select-all { user-select: all; }

/* التحريك */
.transition { transition: all 0.3s ease; }
.transition-fast { transition: all 0.15s ease; }
.transition-slow { transition: all 0.5s ease; }

.hover\:scale-105:hover { transform: scale(1.05); }
.hover\:scale-110:hover { transform: scale(1.1); }

/* الاستجابة */
@media (max-width: 640px) {
  .sm\:hidden { display: none; }
  .sm\:block { display: block; }
  .sm\:grid-cols-1 { grid-template-columns: 1fr; }
  .sm\:text-sm { font-size: var(--font-size-sm); }
  .sm\:p-sm { padding: var(--spacing-sm); }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .md\:text-base { font-size: var(--font-size-base); }
  .md\:p-md { padding: var(--spacing-md); }
}

@media (min-width: 1025px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .lg\:text-lg { font-size: var(--font-size-lg); }
  .lg\:p-lg { padding: var(--spacing-lg); }
}

/* تحسينات الأداء */
.will-change-transform { will-change: transform; }
.will-change-opacity { will-change: opacity; }

/* إمكانية الوصول */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* التركيز */
.focus\:outline-none:focus { outline: none; }
.focus\:ring:focus { box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1); }

/* الطباعة */
@media print {
  .print\:hidden { display: none; }
  .print\:block { display: block; }
}
```
