# OrtakEv - Product Requirements Document (PRD)

## 1. Proje Özeti

**OrtakEv**, boşanmış ebeveynler için geliştirilmiş, çocukların gelişimini takip eden ve ebeveynler arası iletişimi kolaylaştıran bir dijital platformdur.

### 1.1 Problem Tanımı

Boşanmış ebeveynler şu zorluklarla karşılaşıyor:
- Çocukla ilgili koordinasyon eksikliği
- İletişim çatışmaları ve güven sorunları
- Harcama paylaşımında şeffaflık eksikliği
- Çocuğun gelişim bilgilerinin dağınık olması
- Yasal yükümlülüklerin takibi zorluğu

### 1.2 Çözüm Önerisi

Güvenli, şeffaf ve yapılandırılmış bir platform ile:
- Merkezi iletişim kanalı
- Otomatik onay süreçleri
- Harcama takibi ve paylaşımı
- Çocuk gelişim kayıtları
- Yasal uyumluluk desteği

### 1.3 Hedef Kullanıcılar

**Birincil Kullanıcılar:**
- Boşanmış/ayrı yaşayan ebeveynler
- Ortak velayetli aileler
- Tek ebeveynli aileler (diğer ebeveynle iletişim gerekli)

**İkincil Kullanıcılar:**
- Aile danışmanları
- Hukuk müşavirleri
- Çocuk gelişim uzmanları

## 2. Temel Özellikler

### 2.1 İletişim Yönetimi
- Güvenli mesajlaşma sistemi
- Mesaj geçmişi arşivleme
- Acil durum bildirimleri
- Otomatik nezaket kontrolleri

### 2.2 Takvim ve Etkinlik Yönetimi
- Ortak takvim görünümü
- Etkinlik ekleme ve onay süreci
- Okul, sağlık, sosyal etkinlik kategorileri
- Hatırlatma bildirimleri

### 2.3 Finansal Yönetimi
- Harcama kayıt sistemi
- Otomatik paylaşım hesaplaması
- Makbuz ve belge yükleme
- Onay/red süreçleri
- Aylık/yıllık raporlama

### 2.4 Çocuk Profili ve Gelişim
- Çocuk temel bilgileri
- Gelişim kilometre taşları
- Sağlık kayıtları
- Eğitim bilgileri
- Fotoğraf ve belge arşivi

### 2.5 Bildirim Sistemi
- Gerçek zamanlı bildirimler
- E-posta bildirimleri
- Acil durum uyarıları
- Onay bekleyen işlemler

### 2.6 Raporlama
- Aylık aktivite raporları
- Harcama özetleri
- Gelişim raporları
- PDF export özelliği

## 3. Teknoloji Altyapısı

### 3.1 Frontend Teknolojileri
- **Framework**: Next.js 14 + React 18 + TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + React Hooks
- **Data Fetching**: TanStack Query
- **Form Management**: React Hook Form + Zod
- **Charts**: Recharts
- **Notifications**: Sonner

### 3.2 Backend Teknolojileri
- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Passport.js
- **File Storage**: AWS S3 / Cloudinary
- **Real-time**: Server-Sent Events (SSE)
- **Caching**: Redis

### 3.3 DevOps ve Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Render
- **Database Hosting**: Supabase
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + Uptime Robot
- **Analytics**: Vercel Analytics

### 3.4 Güvenlik ve Uyumluluk
- **Data Encryption**: AES-256 (rest) + TLS 1.3 (transit)
- **GDPR/KVKK**: Veri koruma uyumluluğu
- **Audit Logging**: Tüm işlemler loglanır
- **Backup**: Otomatik veri yedekleme

## 4. Kullanıcı Hikayeleri

### 4.1 Ebeveyn İletişimi
- **As a parent**, çocuğumla ilgili konularda eski eşimle güvenli mesajlaşabilmeliyim
- **As a parent**, agresif mesajlara karşı sistem koruması bulmalıyım
- **As a parent**, önemli konuları öncelikli olarak iletebilmeliyim

### 4.2 Etkinlik Planlaması
- **As a parent**, çocuğumun etkinliklerini takvime ekleyebilmeliyim
- **As a parent**, eski eşimin planladığı etkinlikleri onaylayabilmeliyim
- **As a parent**, çakışan planları önceden görebilmeliyim

### 4.3 Finansal Yönetim
- **As a parent**, çocukla ilgili harcamalarımı kayıt altına alabilmeliyim
- **As a parent**, harcama paylaşımını şeffaf bir şekilde görebilmeliyim
- **As a parent**, büyük harcamalar için onay isteyebilmeliyim

### 4.4 Çocuk Takibi
- **As a parent**, çocuğumun gelişim bilgilerini güncel tutabilmeliyim
- **As a parent**, önemli belgeleri güvenle saklayabilmeliyim
- **As a parent**, çocuğumun fotoğraflarını paylaşabilmeliyim

## 5. MVP Özellikleri (Faz 1)

### 5.1 Temel Özellikler (Mutlaka Olmalı)
- ✅ Kullanıcı kayıt/giriş sistemi (Backend tamamlandı)
- ✅ Çocuk profili oluşturma (Backend tamamlandı)
- 🔄 Basit mesajlaşma (Backend API gerekli)
- 🔄 Etkinlik ekleme/görüntüleme (Backend API gerekli)
- 🔄 Harcama kayıt sistemi (Backend API gerekli)
- 🔄 Temel onay süreçleri (Backend API gerekli)
- ✅ KVKK/GDPR uyumluluğu (Altyapı hazır)

### 5.2 Önemli Özellikler (İyi Olur)
- 🔄 Gerçek zamanlı bildirimler (Planlı)
- 🔄 Dosya yükleme (Planlı)
- 🔄 Temel raporlama (Planlı)
- 🔄 E-posta bildirimleri (Planlı)

### 5.3 Gelecek Özellikler (Faz 2)
- 🔄 AI destekli mesaj önerileri
- 🔄 Gelişmiş çatışma çözümü
- 🔄 Zengin metin editörü
- 🔄 Mobil uygulama (PWA)
- 🔄 Üçüncü taraf entegrasyonları

## 6. Sprint Planlaması

### Sprint 1-2 (4 hafta): Temel Altyapı ✅ TAMAMLANDI
- ✅ Backend kurulum (NestJS + Prisma + SQLite)
- ✅ Kullanıcı yönetimi ve authentication (JWT + Passport)
- ✅ Çocuk profili yönetimi (CRUD operasyonları)
- ✅ Temel güvenlik önlemleri (Password hashing, JWT, Guards)
- ✅ KVKK/GDPR uyumluluk temelleri (Soft delete, data validation)

### Sprint 3-4 (4 hafta): Ana Özellikler
- Mesajlaşma sistemi
- Etkinlik yönetimi
- Harcama takibi
- Temel onay süreçleri
- Dosya yükleme

### Sprint 5-6 (4 hafta): İyileştirmeler
- Gerçek zamanlı bildirimler
- E-posta entegrasyonu
- Raporlama sistemi
- Performans optimizasyonları
- Test coverage

### Sprint 7 (2 hafta): Deployment ve Polish
- Production deployment
- Monitoring kurulumu
- Bug fixes
- Kullanıcı dokümantasyonu
- Go-live hazırlıkları

## 7. Başarı Kriterleri

### 7.1 Teknik Kriterler
- Sayfa yüklenme süresi < 3 saniye
- %99.5 uptime
- API yanıt süresi < 500ms
- Mobil uyumlu tasarım
- GDPR/KVKK uyumluluğu

### 7.2 Kullanıcı Deneyimi
- Kolay kullanım (5 dakikada hesap kurulumu)
- Sezgisel navigasyon
- Hata durumlarında net mesajlar
- Erişilebilirlik standartları

### 7.3 İş Kriterleri
- Ebeveyn çatışmalarını azaltma
- İletişim şeffaflığını artırma
- Çocuk refahını destekleme
- Yasal uyumluluğu sağlama

## 8. Risk Analizi

### 8.1 Yüksek Riskler
- **GDPR/KVKK Uyumsuzluk**: Yasal sorumluluk riski
  - *Çözüm*: Legal uzman danışmanlığı, compliance-first yaklaşım
- **Veri Güvenliği İhlali**: Kişisel veri sızması
  - *Çözüm*: End-to-end encryption, güvenlik auditleri
- **Kullanıcı Kabul Riski**: Karmaşık arayüz
  - *Çözüm*: Kullanıcı testleri, iterative design

### 8.2 Orta Riskler
- **Teknik Karmaşıklık**: Geliştirme süresinin uzaması
  - *Çözüm*: MVP odaklı yaklaşım, agile metodoloji
- **Scalability**: Kullanıcı artışında performans sorunları
  - *Çözüm*: Cloud-native architecture, load testing

### 8.3 Düşük Riskler
- **UI/UX İyileştirmeleri**: Estetik değişiklikler
- **3. Parti Entegrasyonları**: API değişiklikleri
- **Performans Optimizasyonları**: Küçük iyileştirmeler

### 9.1 Geliştirme Süresi
- **MVP (Faz 1)**: 14 hafta
- **Gelişmiş Özellikler (Faz 2)**: +12 hafta
- **Toplam**: 26 hafta (6 ay)

## 9. Sonraki Adımlar

### 9.1 Hemen Yapılacaklar
1. Legal compliance review
2. Backend repository kurulumu
3. Database schema tasarımı
4. UI/UX wireframe'leri
5. Development environment setup

### 9.2 1. Ay Hedefleri
- Authentication sistemi
- Temel CRUD operasyonlar
- İlk sayfa tasarımları
- Güvenlik temellerinin atılması

### 9.3 Uzun Vadeli Hedefler
- Beta kullanıcı testleri
- AI özelliklerinin entegrasyonu
- Mobil uygulama geliştirme
- Pazar genişletme stratejisi

---

## 📊 İlerleme Durumu (Güncel)

### ✅ Tamamlanan Özellikler
- **Backend Altyapısı**: NestJS + TypeScript + Prisma + SQLite
- **Authentication API**: Kullanıcı kayıt, giriş, profil yönetimi (JWT)
- **Children API**: Çocuk profili CRUD operasyonları
- **Database Schema**: Kapsamlı veri modeli (User, Child, Message, Expense, Activity, etc.)
- **API Güvenliği**: Password hashing, JWT guards, input validation
- **Postman Collection**: API test koleksiyonu hazır

### ✅ Tamamlanan Çalışmalar
- ✅ **Backend Altyapısı**: NestJS + TypeScript + Prisma + SQLite
- ✅ **Authentication API**: Kullanıcı kayıt, giriş, profil yönetimi (JWT)
- ✅ **Children API**: Çocuk profili CRUD operasyonları
- ✅ **Harcama API**: Expense tracking ve paylaşım sistemi (TAMAMLANDI)
- ✅ **Frontend Authentication**: Giriş/Kayıt işlevselliği ve route protection (YENİ!)

### 🔄 Devam Eden Çalışmalar
- **Mesajlaşma API**: Ebeveynler arası iletişim sistemi
- **Etkinlik API**: Activity management ve onay süreçleri

### 📅 Sonraki Adımlar
1. **Messaging modülü** tamamlanması
2. **Expense modülü** tamamlanması  
3. **Activity modülü** tamamlanması
4. **Frontend entegrasyonu** başlangıcı
5. **File upload** sistemi

---

# Frontend Authentication System - COMPLETED ✅

## Implementation Summary
Successfully implemented complete frontend authentication system with secure login/register functionality and route protection.

## ✅ Completed Features

### Authentication Infrastructure (COMPLETED)
- ✅ Created AuthContext for centralized authentication state management
- ✅ Implemented AuthGuard component for route protection
- ✅ Added GuestOnly component for public-only pages
- ✅ Integrated AuthProvider in root layout for app-wide state

### Login & Registration (COMPLETED)
- ✅ Enhanced login page with actual API integration and form validation
- ✅ Enhanced register page with comprehensive validation and API calls
- ✅ Added proper error handling and loading states
- ✅ Implemented automatic redirect after successful authentication

### Route Protection (COMPLETED)
- ✅ Protected all authenticated pages: dashboard, expenses, children, messages, calendar, development
- ✅ Added automatic redirect to home page when not authenticated
- ✅ Implemented token validation and automatic logout on expiry
- ✅ Added loading states during authentication checks

### User Experience (COMPLETED)
- ✅ Added logout functionality with user display in dashboard header
- ✅ Implemented proper Turkish language support and error messages
- ✅ Added form validation with real-time feedback
- ✅ Created smooth authentication flows with proper redirects

## 🔗 Technical Integration

### State Management
- React Context for authentication state
- Automatic token management with localStorage
- JWT token expiration checking
- User profile integration with backend API

### Security Features
- Secure token storage and validation
- Automatic logout on token expiry
- Protected API calls with authentication headers
- Input validation and sanitization

## 🛡️ Authentication Flow

### Registration Process
1. User fills registration form with validation
2. Frontend validates input (name length, email format, password strength)
3. API call to `/auth/register` endpoint
4. Automatic login after successful registration
5. Redirect to dashboard with authenticated state

### Login Process
1. User enters credentials with validation
2. API call to `/auth/login` endpoint  
3. JWT token stored securely in localStorage
4. User profile loaded from `/auth/profile`
5. Redirect to dashboard with authenticated state

### Route Protection
1. AuthGuard checks authentication status on page load
2. Token validation against expiration time
3. Redirect to home page if not authenticated
4. Loading state during authentication checks
5. Access granted to protected content

## 📊 System Capabilities

### For Users
- Secure registration with comprehensive validation
- Smooth login experience with error handling
- Automatic session management
- Protected access to all application features
- Proper logout functionality

### For System
- Centralized authentication state management
- Automatic token refresh handling
- Secure API communication
- Type-safe authentication operations
- Consistent user experience across all pages

## 📋 Next Steps

### Potential Enhancements
- Add password reset functionality
- Implement "Remember me" option
- Add email verification workflow
- Implement session timeout warnings
- Add multi-factor authentication support

---

# Expense Tracking System - COMPLETED ✅

## Modal Form Enhancements - COMPLETED ✅

### Form UX Improvements (COMPLETED)
- ✅ **Turkish Amount Formatting**: Proper 1.250,50 format with utils/currency.ts
- ✅ **Enum Constants**: Backend enum values mapped to Turkish labels (HEALTH → Sağlık)
- ✅ **Select Components**: Fixed display issues, proper value selection
- ✅ **Form Validation**: Real-time validation with error messages below inputs
- ✅ **Default Selections**: First child auto-selected, today's date pre-filled
- ✅ **DatePicker**: Replaced basic input with proper calendar component
- ✅ **CSS Improvements**: Fixed purple border issues, consistent styling

### Technical Improvements
- ✅ **Code Organization**: Moved formatAmount to reusable utils/currency.ts
- ✅ **Type Safety**: Enhanced TypeScript validation and error handling
- ✅ **Constants**: Created centralized enum mapping in constants/enums.ts
- ✅ **Validation**: Added comprehensive form validation with types/validations.ts

## 📝 Known UX Issues (Future Improvements)

### Loading State Issue
**Problem**: "Veriler yükleniyor..." message appears on every page refresh, poor UX
**Impact**: Users see loading state even when data could be cached
**Priority**: Medium (UX improvement)
**Suggested Solutions**:
1. **Quick Fix**: Reduce loading message duration or use skeleton loaders
2. **Better Solution**: Implement React Query/SWR for data caching
3. **Best Solution**: Progressive loading - show cached data first, fetch fresh data in background

**Next Sprint**: Consider implementing data caching strategy for better UX

---

# Expense Tracking System - COMPLETED ✅

## Implementation Summary
Successfully implemented complete expense tracking system with secure backend API and integrated frontend.

## ✅ Completed Features

### Backend Implementation (COMPLETED)
- ✅ Created expenses module in NestJS backend
- ✅ Implemented expenses controller with full CRUD operations
- ✅ Implemented expenses service with comprehensive business logic
- ✅ Created DTOs with strict validation (create, update, query)
- ✅ Added expenses module to app.module.ts
- ✅ Added expense statistics endpoint

### Frontend Integration (COMPLETED)
- ✅ Replaced all mock data with real API calls
- ✅ Added comprehensive error handling and loading states
- ✅ Implemented secure authentication integration
- ✅ Updated all expense operations to use backend API
- ✅ Added input validation and user feedback

### Security Enhancements (COMPLETED)
- ✅ Fixed JWT secret strength (256-bit random string)
- ✅ Implemented secure token handling with auto-logout
- ✅ Added comprehensive input validation (frontend + backend)
- ✅ Implemented proper authorization checks
- ✅ Added environment variable security
- ✅ Created security documentation

### Testing & Validation (COMPLETED)
- ✅ All API endpoints tested and working
- ✅ Frontend-backend integration fully functional
- ✅ Authentication and authorization verified
- ✅ Created automated test scripts

## 🔌 API Endpoints Implemented

### Expense Management
- `GET /expenses` - Get all expenses for user's children (with filtering)
- `GET /expenses/stats` - Get expense statistics and summaries
- `GET /expenses/:id` - Get specific expense details
- `POST /expenses` - Create new expense
- `PATCH /expenses/:id` - Update expense (creator only)
- `DELETE /expenses/:id` - Delete expense (creator only)

### Security Features
- JWT token authentication on all endpoints
- User-child relationship validation
- Creator-only modification permissions
- Input sanitization and validation
- Rate limiting ready infrastructure

## 🛡️ Security Measures Implemented

### Authentication & Authorization
- Secure JWT token handling with 24h expiration
- Automatic token cleanup on expiration/invalidity
- User-child access verification on every operation
- Creator-only permissions for modifications

### Input Security
- Comprehensive validation on both frontend and backend
- SQL injection protection via Prisma ORM
- XSS protection via React's built-in security
- Input sanitization (trim, lowercase, type checking)
- Business rule validation (amount limits, date validation)

### Environment Security
- Strong JWT secrets (256-bit)
- Environment variables properly configured
- Sensitive data excluded from git (.gitignore)
- Development vs production configurations

## 📊 System Capabilities

### For Parents
- Create expense records for their children
- View categorized expense lists with filtering
- See expense statistics and trends
- Update/delete their own expense entries
- Secure multi-parent access to shared children

### For System
- Real-time data persistence
- User isolation and data privacy
- Comprehensive audit trail
- Type-safe API operations
- Performance optimized queries

## 🧪 Testing Results

### API Testing
- ✅ All CRUD operations working
- ✅ Authentication flows verified
- ✅ Authorization checks passing
- ✅ Error handling robust
- ✅ Statistics calculations accurate

### Frontend Testing
- ✅ Real API integration working
- ✅ Error states handled gracefully
- ✅ Loading states implemented
- ✅ User feedback mechanisms working

## 📋 Technical Debt & Future Improvements

### Potential Enhancements
- Add expense receipt file upload functionality
- Implement expense approval workflow
- Add expense splitting between parents
- Implement real-time notifications
- Add expense export functionality (PDF, CSV)

### Code Quality
- Some 'any' types remain in legacy components (non-critical)
- Could benefit from additional unit tests
- Performance monitoring could be added

# Frontend Authentication System - COMPLETED ✅

## Implementation Summary
Successfully implemented complete authentication system with login/register functionality, route protection, and fixed page refresh issues.

### Key Features Implemented
- ✅ **Authentication Context**: Centralized auth state management with `AuthProvider`
- ✅ **Route Protection**: `AuthGuard` for protected pages, `GuestOnly` for public pages  
- ✅ **Login & Register Pages**: Full form validation and API integration
- ✅ **Page Refresh Fix**: Proper token validation without unwanted redirects
- ✅ **Loading States**: Smart loading indicators during auth checks

### Technical Solutions
1. **AuthProvider Integration**: Added to root layout for app-wide auth state
2. **Token Management**: Secure localStorage handling with expiration checks  
3. **Smart Loading**: Only show loading when actually checking authentication
4. **Refresh Protection**: Added `hasCheckedAuth` flag to prevent unnecessary redirects

### Pages Protected
- `/dashboard` - Main dashboard
- `/children` - Children management  
- `/expenses` - Expense tracking
- `/messages` - Messaging system
- `/calendar` - Calendar view

### Authentication Flow
1. User visits protected page
2. AuthGuard checks authentication status
3. If token exists, profile is fetched from API
4. User stays on page if authenticated, redirected to home if not
5. Refresh preserves authentication state

---

## 📋 Doküman Geçmişi

**Versiyon 2.1** - Ağustos 2025
- Expense tracking system implementation plan added

**Versiyon 2.0** - Ocak 2025
- PRD struktur iyileştirmesi
- Teknik detaylar çıkarıldı
- İş gereksinimleri odaklanıldı
- Risk analizi basitleştirildi
- MVP scope netleştirildi