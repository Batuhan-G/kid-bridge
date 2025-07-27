### OrtakEv - PRD (Product Requirements Document)

## 1. Proje Özeti

**OrtakEv**, boşanmış ebeveynler için geliştirilmiş, çocukların gelişimini takip eden ve ebeveynler arası iletişimi kolaylaştıran bir platformdur.

### 1.1 Temel Özellikler

- **Ortak Takvim**: Okul, sağlık ve sosyal etkinliklerin planlanması
- **Güvenli Mesajlaşma**: AI destekli iletişim önerileri
- **Harcama Takibi**: Çocukla ilgili giderlerin şeffaf paylaşımı
- **Çocuk Profili**: Gelişim notları, fotoğraflar ve belgeler
- **AI Destekli Özellikler**: Çatışmaları azaltma ve planlama kolaylığı
- **Güvenlik**: KVKK ve GDPR uyumlu, şifreli veri koruması

## 2. Sistem Mimarisi

### 2.1 Teknoloji Stack

**Frontend (Mevcut):**

- **Framework**: Next.js 14.2.16, React 18, TypeScript 5
- **UI Framework**: Tailwind CSS 3.4.17, shadcn/ui (Radix UI)
- **State Management**: React Hooks
- **Form Management**: React Hook Form 7.54.1, Zod 3.24.1
- **PDF Generation**: jsPDF
- **Charts**: Recharts 2.15.0
- **Icons**: Lucide React 0.454.0
- **Date Handling**: date-fns 4.1.0
- **Animations**: tailwindcss-animate 1.0.7
- **Theme**: next-themes 0.4.4
- **Notifications**: Sonner 1.7.1

**Backend (Planlanan):**

- **Runtime**: Node.js
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT, Passport.js
- **File Upload**: Multer
- **Real-time**: Socket.io
- **Validation**: class-validator, class-transformer
- **Security**: helmet.js, rate-limiter-flexible
- **Testing**: Jest, Supertest
- **API Documentation**: Swagger/OpenAPI

**DevOps & Tools (Planlanan):**

- **Deployment**: Vercel (Frontend), Railway/Render (Backend)
- **Database Hosting**: Supabase/PlanetScale
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry
- **Analytics**: Google Analytics
- **Caching**: Redis
- **CDN**: Vercel CDN

## 3. Yapılan İşler

### 3.1 Tamamlanan Sayfalar

- ✅ **Landing Page** (app/page.tsx): Ana sayfa tasarımı ve içerik
- ✅ **Login Page** (app/login/page.tsx): Kullanıcı giriş sayfası
- ✅ **Register Page** (app/register/page.tsx): Kullanıcı kayıt sayfası
- ✅ **Dashboard** (app/dashboard/page.tsx): Ana dashboard sayfası
- ✅ **Multi-Child Dashboard** (app/dashboard/multi-child/page.tsx): Çoklu çocuk dashboard'u
- ✅ **Calendar Page** (app/calendar/page.tsx): Etkinlik takvimi sayfası
- ✅ **Expenses Page** (app/expenses/page.tsx): Harcama takibi sayfası
- ✅ **Messages Page** (app/messages/page.tsx): Mesajlaşma sayfası
- ✅ **Development Page** (app/development/page.tsx): Gelişim takibi sayfası
- ✅ **Children Page** (app/children/page.tsx): Çocuk profilleri sayfası

### 3.2 Tamamlanan Bileşenler

- ✅ **Sidebar** (components/sidebar.tsx): Ana navigasyon menüsü
- ✅ **SidebarTrigger** (components/sidebar-trigger.tsx): Mobil sidebar tetikleyici
- ✅ **ChildSelector** (components/child-selector.tsx): Çocuk seçimi bileşeni
- ✅ **ChildQuickSwitch** (components/child-quick-switch.tsx): Hızlı çocuk değiştirme
- ✅ **MobileNav** (components/mobile-nav.tsx): Mobil navigasyon
- ✅ **MilestoneTracker** (components/milestone-tracker.tsx): Kilometre taşı takibi
- ✅ **DevelopmentInsights** (components/development-insights.tsx): Gelişim öngörüleri
- ✅ **DevelopmentPDFReport** (components/development-pdf-report.tsx): PDF rapor oluşturucu
- ✅ **MultiChildStats** (components/multi-child-stats.tsx): Çoklu çocuk istatistikleri
- ✅ **PDFGenerator** (components/pdf-generator.tsx): PDF oluşturma bileşeni

### 3.3 UI Bileşenleri (shadcn/ui)

- ✅ **Button** (components/ui/button.tsx): Buton bileşenleri
- ✅ **Card** (components/ui/card.tsx): Kart bileşenleri
- ✅ **Dialog** (components/ui/dialog.tsx): Modal dialoglar
- ✅ **Input** (components/ui/input.tsx): Giriş alanları
- ✅ **Select** (components/ui/select.tsx): Seçim bileşenleri
- ✅ **Tabs** (components/ui/tabs.tsx): Sekme bileşenleri
- ✅ **Badge** (components/ui/badge.tsx): Rozet bileşenleri
- ✅ **Avatar** (components/ui/avatar.tsx): Avatar bileşenleri
- ✅ **Progress** (components/ui/progress.tsx): İlerleme çubukları
- ✅ **Label** (components/ui/label.tsx): Form etiketleri
- ✅ **Textarea** (components/ui/textarea.tsx): Çok satırlı metin alanları
- ✅ **Sheet** (components/ui/sheet.tsx): Yan panel bileşeni
- ✅ **Breadcrumb** (components/ui/breadcrumb.tsx): Breadcrumb navigasyonu

### 3.4 Teknik Altyapı

- ✅ **Next.js 14**: App Router yapısı kuruldu
- ✅ **TypeScript**: Tip güvenliği sağlandı
- ✅ **Tailwind CSS**: Styling framework entegre edildi
- ✅ **Component Architecture**: Modüler bileşen yapısı oluşturuldu
- ✅ **State Management**: React Hooks ile state yönetimi
- ✅ **Responsive Design**: Mobil uyumlu tasarım tamamlandı
- ✅ **Theme System**: CSS variables ile tema sistemi

### 3.5 Özellikler

- ✅ **PDF Generation**: jsPDF ile rapor oluşturma
- ✅ **Charts**: Recharts ile grafikler
- ✅ **Event Management**: Etkinlik ekleme, düzenleme, silme
- ✅ **Expense Tracking**: Harcama ekleme, kategorileme, filtreleme
- ✅ **Message System**: Mesajlaşma arayüzü
- ✅ **Child Profiles**: Çocuk profil yönetimi
- ✅ **Multi-child Support**: Çoklu çocuk desteği
- ✅ **Calendar Integration**: Etkinlik takvimi
- ✅ **Development Tracking**: Gelişim takibi ve milestone'lar
- ✅ **File Management**: Dosya yönetimi arayüzü (UI)
- ✅ **Breadcrumb Navigation**: Sayfa navigasyonu
- ✅ **Mobile Sidebar**: Mobil uyumlu sidebar

## 4. Yapılacak İşler

### Faz 1: Backend Altyapısı (Öncelik: Yüksek)

#### 4.1.1 NestJS Backend Kurulumu

- 🔄 **NestJS Project Setup**: Proje kurulumu ve konfigürasyonu
- 🔄 **PostgreSQL Connection**: Veritabanı bağlantısı
- 🔄 **Prisma ORM Setup**: ORM kurulumu ve konfigürasyonu
- 🔄 **Environment Configuration**: Ortam değişkenleri yönetimi
- 🔄 **Docker Setup**: Geliştirme ortamı için Docker

**Gerekli Teknolojiler:**

- NestJS CLI
- PostgreSQL
- Prisma
- Docker

#### 4.1.2 Authentication & Authorization

- 🔄 **JWT Strategy**: JWT token sistemi
- 🔄 **Passport Integration**: Passport.js entegrasyonu
- 🔄 **User Registration**: Kullanıcı kayıt API'si
- 🔄 **User Login**: Kullanıcı giriş API'si
- 🔄 **Password Reset**: Şifre sıfırlama sistemi
- 🔄 **Role-based Access**: Rol tabanlı yetkilendirme

**Gerekli Teknolojiler:**

- @nestjs/jwt
- @nestjs/passport
- passport-jwt
- bcrypt

#### 4.1.3 Core API Endpoints

- 🔄 **User Management API**: Kullanıcı CRUD işlemleri
- 🔄 **Child Management API**: Çocuk profili yönetimi
- 🔄 **Event API**: Etkinlik yönetimi (CRUD)
- 🔄 **Expense API**: Harcama yönetimi (CRUD)
- 🔄 **Message API**: Mesajlaşma sistemi
- 🔄 **File Upload API**: Dosya yükleme ve yönetimi

**Gerekli Teknolojiler:**

- @nestjs/common
- class-validator
- class-transformer
- multer

### Faz 2: Frontend-Backend Entegrasyonu (Öncelik: Yüksek)

#### 4.2.1 API Client Setup

- 🔄 **Axios Configuration**: HTTP client kurulumu
- 🔄 **API Base URLs**: Ortam bazlı URL yönetimi
- 🔄 **Request Interceptors**: Token ekleme ve hata yakalama
- 🔄 **Response Interceptors**: Hata yönetimi ve token yenileme

**Gerekli Teknolojiler:**

- axios
- React Query (TanStack Query)

#### 4.2.2 Authentication Integration

- 🔄 **Login Form Integration**: Giriş formu API bağlantısı
- 🔄 **Register Form Integration**: Kayıt formu API bağlantısı
- 🔄 **Token Management**: JWT token saklama ve yönetimi
- 🔄 **Protected Routes**: Korumalı sayfa yönlendirmeleri
- 🔄 **Auto Logout**: Token süresi dolduğunda otomatik çıkış

**Gerekli Teknolojiler:**

- next-auth (opsiyonel)
- js-cookie
- React Context API

#### 4.2.3 Form Validation & Error Handling

- 🔄 **Zod Schema Validation**: Form doğrulama şemaları
- 🔄 **React Hook Form Integration**: Form yönetimi
- 🔄 **Error Message Display**: Kullanıcı dostu hata mesajları
- 🔄 **Loading States**: Form gönderimi sırasında loading
- 🔄 **Success Notifications**: Başarılı işlem bildirimleri

**Gerekli Teknolojiler:**

- react-hook-form
- zod
- @hookform/resolvers
- sonner (toast notifications)

### Faz 3: Real-time Features (Öncelik: Orta)

#### 4.3.1 WebSocket Implementation

- 🔄 **Socket.io Server Setup**: NestJS WebSocket gateway
- 🔄 **Socket.io Client Setup**: Frontend WebSocket client
- 🔄 **Connection Management**: Bağlantı yönetimi ve yeniden bağlanma
- 🔄 **Room Management**: Kullanıcı odaları ve grup yönetimi

**Gerekli Teknolojiler:**

- @nestjs/websockets
- socket.io
- socket.io-client

#### 4.3.2 Real-time Messaging

- 🔄 **Live Chat**: Anlık mesajlaşma
- 🔄 **Message Status**: Okundu/okunmadı durumu
- 🔄 **Typing Indicators**: Yazıyor göstergesi
- 🔄 **Message History**: Mesaj geçmişi yükleme

#### 4.3.3 Live Notifications

- 🔄 **Event Notifications**: Yeni etkinlik bildirimleri
- 🔄 **Expense Notifications**: Harcama bildirimleri
- 🔄 **System Notifications**: Sistem bildirimleri
- 🔄 **Push Notifications**: Tarayıcı push bildirimleri

### Faz 4: AI Integration (Öncelik: Orta)

#### 4.4.1 OpenAI Integration

- 🔄 **OpenAI API Setup**: API key ve konfigürasyon
- 🔄 **Message Suggestions**: Akıllı mesaj önerileri
- 🔄 **Conflict Resolution**: Çatışma çözüm önerileri
- 🔄 **Development Insights**: AI destekli gelişim öngörüleri

**Gerekli Teknolojiler:**

- openai
- @nestjs/config
- AI prompt engineering

#### 4.4.2 Smart Features

- 🔄 **Auto Categorization**: Harcama otomatik kategorizasyonu
- 🔄 **Event Suggestions**: Etkinlik önerileri
- 🔄 **Development Predictions**: Gelişim tahminleri
- 🔄 **Communication Tone Analysis**: İletişim tonu analizi

### Faz 5: Advanced UI/UX (Öncelik: Düşük)

#### 4.5.1 Enhanced Components

- 🔄 **Rich Text Editor**: Mesajlaşma için zengin metin editörü
- 🔄 **Advanced Calendar**: Drag & drop takvim
- 🔄 **File Preview**: Dosya önizleme bileşeni
- 🔄 **Timeline Component**: Aktivite geçmişi
- 🔄 **Kanban Board**: Görev yönetimi

**Gerekli Teknolojiler:**

- @tiptap/react (rich text editor)
- react-big-calendar
- react-dropzone
- framer-motion (animations)

#### 4.5.2 Performance Optimization

- 🔄 **Image Optimization**: Next.js Image component
- 🔄 **Code Splitting**: Lazy loading ve code splitting
- 🔄 **Caching Strategy**: Redis cache implementasyonu
- 🔄 **Bundle Analysis**: Bundle boyutu optimizasyonu

**Gerekli Teknolojiler:**

- next/image
- React.lazy
- Redis
- @next/bundle-analyzer

### Faz 6: Security & Compliance (Öncelik: Yüksek)

#### 4.6.1 Security Implementation

- 🔄 **Data Encryption**: Hassas veri şifreleme
- 🔄 **Input Sanitization**: Girdi temizleme ve doğrulama
- 🔄 **Rate Limiting**: API rate limiting
- 🔄 **CORS Configuration**: Cross-origin resource sharing
- 🔄 **Helmet.js**: Security headers

**Gerekli Teknolojiler:**

- @nestjs/throttler
- helmet
- crypto-js
- class-validator

#### 4.6.2 GDPR/KVKK Compliance

- 🔄 **Data Privacy**: Veri gizliliği politikaları
- 🔄 **Cookie Consent**: Çerez onayı sistemi
- 🔄 **Data Export**: Kullanıcı verisi dışa aktarma
- 🔄 **Data Deletion**: Kullanıcı verisi silme
- 🔄 **Audit Logs**: İşlem kayıtları

### Faz 7: Testing & Quality Assurance (Öncelik: Orta)

#### 4.7.1 Backend Testing

- 🔄 **Unit Tests**: NestJS servis testleri
- 🔄 **Integration Tests**: API endpoint testleri
- 🔄 **E2E Tests**: End-to-end testler
- 🔄 **Database Tests**: Veritabanı işlem testleri

**Gerekli Teknolojiler:**

- Jest
- Supertest
- @nestjs/testing

#### 4.7.2 Frontend Testing

- 🔄 **Component Tests**: React bileşen testleri
- 🔄 **Hook Tests**: Custom hook testleri
- 🔄 **Integration Tests**: Sayfa testleri
- 🔄 **E2E Tests**: Playwright testleri

**Gerekli Teknolojiler:**

- Jest
- React Testing Library
- Playwright
- @testing-library/jest-dom

### Faz 8: Deployment & DevOps (Öncelik: Orta)

#### 4.8.1 CI/CD Pipeline

- 🔄 **GitHub Actions**: Otomatik build ve test
- 🔄 **Environment Management**: Staging ve production ortamları
- 🔄 **Database Migrations**: Otomatik migration deployment
- 🔄 **Health Checks**: Sistem sağlık kontrolleri

**Gerekli Teknolojiler:**

- GitHub Actions
- Docker
- Prisma migrations

#### 4.8.2 Monitoring & Analytics

- 🔄 **Error Tracking**: Sentry entegrasyonu
- 🔄 **Performance Monitoring**: Application performance monitoring
- 🔄 **User Analytics**: Google Analytics
- 🔄 **Database Monitoring**: PostgreSQL monitoring

**Gerekli Teknolojiler:**

- Sentry
- Google Analytics
- Prometheus (opsiyonel)

## 5. Proje Yönetimi

### 5.1 Sprint Planlaması

**Sprint 1 (2 hafta): Backend Foundation**

- NestJS project setup
- PostgreSQL & Prisma configuration
- Authentication system (JWT + Passport)
- Basic CRUD APIs (Users, Children)

**Sprint 2 (2 hafta): Core APIs**

- Events API (CRUD operations)
- Expenses API (CRUD operations)
- Messages API (basic messaging)
- File upload API

**Sprint 3 (2 hafta): Frontend Integration**

- API client setup (Axios + React Query)
- Authentication integration
- Form validation (React Hook Form + Zod)
- Error handling & loading states

**Sprint 4 (2 hafta): Real-time Features**

- WebSocket implementation (Socket.io)
- Real-time messaging
- Live notifications
- Connection management

**Sprint 5 (2 hafta): AI & Advanced Features**

- OpenAI integration
- Smart message suggestions
- Advanced UI components
- Performance optimization

**Sprint 6 (2 hafta): Security & Testing**

- Security implementation
- GDPR compliance
- Unit & integration tests
- E2E testing

**Sprint 7 (2 hafta): Deployment & Polish**

- CI/CD pipeline
- Production deployment
- Monitoring setup
- Bug fixes & polish

### 5.2 Teknoloji Seçimleri

**Backend:**

- NestJS (TypeScript framework)
- PostgreSQL + Prisma ORM
- JWT + Passport.js authentication
- Socket.io (real-time)
- Redis (caching)

**Frontend:**

- Next.js 14 + React 18
- TypeScript
- Tailwind CSS + shadcn/ui
- React Query (data fetching)
- React Hook Form + Zod

**DevOps:**

- GitHub Actions (CI/CD)
- Vercel (frontend deployment)
- Railway/Render (backend deployment)
- Supabase/PlanetScale (database)

### 5.3 Risk Analizi

**Yüksek Risk:**

- AI entegrasyonu karmaşıklığı
- Real-time messaging performansı
- GDPR/KVKK uyumluluğu
- Çoklu kullanıcı veri senkronizasyonu

**Orta Risk:**

- NestJS öğrenme eğrisi
- WebSocket connection management
- File upload güvenliği
- Mobile performance

**Düşük Risk:**

- UI/UX geliştirmeleri
- Test yazımı
- Deployment süreçleri

## 6. Başarı Kriterleri

### 6.1 Teknik Kriterler

- ✅ Sayfa yükleme süresi < 3 saniye
- ✅ Mobile responsive tasarım
- ✅ 99.9% uptime
- ✅ GDPR/KVKK uyumluluğu
- ✅ API response time < 500ms
- ✅ Real-time message latency < 100ms

### 6.2 Kullanıcı Deneyimi

- ✅ Intuitive navigation
- ✅ Seamless multi-child switching
- ✅ Real-time updates
- ✅ AI-powered suggestions
- ✅ Offline capability (PWA)

### 6.3 İş Kriterleri

- ✅ Boşanmış ebeveynler için optimize edilmiş UX
- ✅ Çatışma azaltma özellikleri
- ✅ Şeffaf iletişim araçları
- ✅ Çocuk gelişimi takibi
- ✅ Güvenli veri paylaşımı

## 7. Sonraki Adımlar

1. **NestJS Backend Setup** - PostgreSQL + Prisma + JWT
2. **Core API Development** - Users, Children, Events, Expenses
3. **Frontend-Backend Integration** - API client + Authentication
4. **Real-time Features** - Socket.io + Live messaging
5. **AI Integration** - OpenAI + Smart suggestions
6. **Security & Testing** - GDPR compliance + Test coverage
7. **Deployment** - CI/CD + Production environment
