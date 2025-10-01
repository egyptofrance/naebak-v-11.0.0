# نسخ احتياطية لمشروع نائبك.كوم

هذا المجلد يحتوي على نسخ احتياطية من الإصدارات المنشورة لمشروع نائبك.كوم.

## النسخ المتوفرة

### naebak-frontend-deploy-20b7f20.zip

- **تاريخ النشر:** 1 أكتوبر 2025
- **الوصف:** النسخة المستقرة المنشورة على `https://naebak.com`
- **الـ commit:** `20b7f20` - "Remove vercel.json - let Vercel auto-detect Next.js configuration"
- **ملاحظات:** هذه النسخة تعمل بشكل مستقر على Vercel وتم ربطها بالدومين الرئيسي

## كيفية استخدام النسخ الاحتياطية

### استعادة نسخة كاملة:

```bash
# استخراج النسخة الاحتياطية
unzip naebak-frontend-deploy-20b7f20.zip -d naebak-frontend-restore

# إنشاء مستودع جديد
cd naebak-frontend-restore
git init
git add .
git commit -m "Restore from backup 20b7f20"

# دفع إلى مستودع جديد (إذا لزم الأمر)
git remote add origin https://github.com/username/new-repo.git
git push -u origin main
```

### استخراج ملفات محددة:

```bash
unzip naebak-frontend-deploy-20b7f20.zip "src/app/*" -d extracted_files
```

## ملاحظات هامة

- هذه النسخ الاحتياطية لا تحتوي على ملفات `.env` أو أي بيانات سرية أخرى
- يجب تكوين المتغيرات البيئية يدوياً عند استعادة النسخ
- راجع ملف `DEPLOYMENT_DOCUMENTATION.md` للحصول على تفاصيل حول إعدادات النشر
