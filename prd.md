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

### 🔄 Devam Eden Çalışmalar
- **Mesajlaşma API**: Ebeveynler arası iletişim sistemi
- **Harcama API**: Expense tracking ve paylaşım sistemi
- **Etkinlik API**: Activity management ve onay süreçleri

### 📅 Sonraki Adımlar
1. **Messaging modülü** tamamlanması
2. **Expense modülü** tamamlanması  
3. **Activity modülü** tamamlanması
4. **Frontend entegrasyonu** başlangıcı
5. **File upload** sistemi

---

## 📋 Doküman Geçmişi

**Versiyon 2.0** - Ocak 2025
- PRD struktur iyileştirmesi
- Teknik detaylar çıkarıldı
- İş gereksinimleri odaklanıldı
- Risk analizi basitleştirildi
- MVP scope netleştirildi