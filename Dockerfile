# استخدام Node.js 18 كصورة أساسية
FROM node:18-alpine

# تعيين مجلد العمل
WORKDIR /app

# نسخ ملفات package
COPY package*.json ./

# تثبيت التبعيات
RUN npm install

# نسخ باقي الملفات
COPY . .

# بناء التطبيق
RUN npm run build

# تعريض البورت
EXPOSE 3000

# تشغيل التطبيق
CMD ["npm", "start"]
