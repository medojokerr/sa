# KYCtrust - منصة الخدمات المالية الرقمية

منصة متكاملة لتقديم خدمات الحسابات البنكية الإلكترونية والمحافظ الرقمية مع دعم متعدد اللغات (العربية والإنجليزية).

## 🚀 المزايا الرئيسية

- **نظام CMS متكامل** لإدارة المحتوى
- **لوحة تحكم شاملة** للإدارة
- **دعم متعدد اللغات** (العربية/الإنجليزية) 
- **نظام تقييمات** مع الموافقة
- **تحليلات متقدمة** ولوحة مؤشرات
- **تصميم متجاوب** لجميع الأجهزة
- **Dark/Light Mode** 
- **نظام Animation** متطور

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Animation**: Framer Motion
- **State Management**: Zustand + Redux Toolkit
- **Database**: Neon PostgreSQL / Supabase
- **Validation**: Zod + React Hook Form

## 📋 المتطلبات

- Node.js 18+ 
- قاعدة بيانات PostgreSQL (Neon أو Supabase)

## ⚡ التثبيت والتشغيل

1. **نسخ المشروع**
   ```bash
   git clone <repository-url>
   cd kyctrust
   ```

2. **تثبيت المكتبات**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **إعداد متغيرات البيئة**
   ```bash
   cp .env.example .env.local
   # قم بتعديل الملف وإضافة رابط قاعدة البيانات
   ```

4. **تشغيل الخادم**
   ```bash
   npm run dev
   ```

5. **الوصول للتطبيق**
   - الموقع الرئيسي: http://localhost:3000
   - لوحة التحكم: http://localhost:3000/dashboard

## 🗄️ إعداد قاعدة البيانات

### خيار 1: Neon Database
```bash
POSTGRES_URL="postgresql://username:password@host:5432/database"
```

### خيار 2: Supabase
```bash
SUPABASE_URL="your-project-url"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
NEXT_PUBLIC_SUPABASE_URL="your-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

## 📁 هيكل المشروع

```
├── app/                    # صفحات Next.js 
│   ├── (admin)/           # صفحات الإدارة
│   │   └── dashboard/     # لوحة التحكم
│   ├── api/               # API Routes
│   └── page.tsx           # الصفحة الرئيسية
├── components/            # المكونات
│   ├── blocks/           # مكونات أقسام الصفحة
│   ├── ui/               # مكونات UI الأساسية
│   └── layout/           # مكونات التخطيط
├── lib/                  # المكتبات والأدوات
│   ├── redux/           # إدارة الحالة
│   └── types.ts         # تعريفات TypeScript
└── public/              # الملفات الثابتة
```

## 🎯 الخدمات المتاحة

### حسابات بنكية
- Payoneer
- Wise 
- World First

### محافظ إلكترونية  
- PayPal
- Skrill
- Neteller
- Kast
- Redotpay

### منصات تداول العملات
- OKX, Bybit, Bitget
- KuCoin, MEXC

### خدمات محلية
- شحن فودافون كاش
- سحب من TikTok/PayPal

## 🔧 التخصيص

### تحديث المحتوى
```typescript
// lib/default-content.ts
export const defaultState = {
  content: {
    ar: { /* المحتوى العربي */ },
    en: { /* المحتوى الإنجليزي */ }
  }
}
```

### تخصيص الألوان
```typescript
// lib/palette.ts
export const palettes = {
  "emerald-violet": "from-emerald-500 to-violet-500",
  // إضافة ألوان جديدة
}
```

## 📊 لوحة التحكم

- **إدارة المستخدمين**: إضافة وتعديل وحذف
- **إدارة المحتوى**: تحرير ونشر المحتوى
- **إدارة التقييمات**: الموافقة أو الرفض
- **التحليلات**: مؤشرات الأداء والزيارات
- **الإعدادات**: قاعدة البيانات والمتغيرات

## 🚀 النشر

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
npm run build
# رفع مجلد out/ إلى Netlify
```

## 🔒 الأمان

- Rate limiting مدمج
- CSRF protection
- Input validation مع Zod
- Environment variables آمنة

## 📞 الدعم والتواصل

- WhatsApp: +20-106-245-3344
- البريد الإلكتروني: support@kyctrust.com

## 📄 الترخيص

هذا المشروع محمي بحقوق الطبع والنشر © 2024 KYCtrust

---

**تم تطوير المشروع بواسطة فريق KYCtrust**
