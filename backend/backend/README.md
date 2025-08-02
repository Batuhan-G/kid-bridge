# Kid Bridge - Backend API

Boşanmış ebeveynler için geliştirilmiş çocuk takip ve iletişim platformunun backend API'si.

## Teknoloji Stack

- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Passport.js
- **Validation**: class-validator + class-transformer

## Kurulum

### Gereksinimler
- Node.js 20+
- PostgreSQL
- npm veya yarn

### Adımlar

1. Dependencies'leri yükle:
```bash
npm install
```

2. Environment variables'ları ayarla:
```bash
cp .env.example .env
# .env dosyasını editleyerek kendi değerlerinizi girin
```

3. Prisma database setup:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Uygulamayı başlat:
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi
- `GET /auth/profile` - Kullanıcı profili (JWT gerekli)

### Children Management
- `GET /children` - Kullanıcının çocuklarını listele
- `POST /children` - Yeni çocuk profili oluştur
- `GET /children/:id` - Çocuk detaylarını getir
- `PATCH /children/:id` - Çocuk bilgilerini güncelle
- `DELETE /children/:id` - Çocuk profilini sil (soft delete)
- `POST /children/:id/parents` - Çocuğa yeni ebeveyn ekle

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kidbridge?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRATION="7d"

# App
PORT=3001
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

## Database Schema

Ana modeller:
- **User**: Ebeveyn kullanıcıları
- **Child**: Çocuk profilleri
- **Message**: Ebeveynler arası mesajlar
- **Expense**: Harcama kayıtları
- **Activity**: Etkinlik planlaması
- **Document**: Dosya/belge yönetimi
- **Milestone**: Gelişim kilometre taşları

## Geliştirme

```bash
# Watch mode
npm run start:dev

# Build
npm run build

# Tests
npm run test
npm run test:e2e

# Prisma Studio (Database GUI)
npx prisma studio
```

## Güvenlik

- JWT tabanlı authentication
- Password hashing (bcrypt)
- Input validation
- CORS protection
- Rate limiting (planlı)

## 🏗️ Backend Mimarisi Açıklaması

### Neden Bu Teknolojileri Seçtik?

#### **NestJS Framework**
- **Angular benzeri yapı**: Modüler, organize kod yazımı
- **Dependency Injection**: Kod tekrarını azaltır, test edilebilirlik artırır
- **Decorators**: `@Controller`, `@Service`, `@Guard` ile temiz kod
- **TypeScript**: Tip güvenliği ve modern JavaScript özellikleri

#### **Prisma ORM**
- **Type-safe**: SQL hatalarını derleme zamanında yakalar
- **Schema-first**: Veritabanı yapısını kod olarak yönetir
- **Migration**: Veritabanı değişikliklerini otomatik yönetir
- **Multiple DB Support**: PostgreSQL, MySQL, SQLite destekler

#### **JWT Authentication**
- **Stateless**: Server'da session saklamaya gerek yok
- **Scalable**: Mikroservisler arası güvenli iletişim
- **Mobile-friendly**: Mobil uygulamalar için ideal

### 📁 Proje Yapısı Açıklaması

```
src/
├── auth/                    # Kullanıcı doğrulama modülü
│   ├── dto/                 # Data Transfer Objects (API istekleri)
│   ├── guards/              # Route koruma (JWT, Local)
│   ├── strategies/          # Passport.js stratejileri
│   ├── auth.controller.ts   # HTTP endpoint'leri
│   ├── auth.service.ts      # İş mantığı
│   └── auth.module.ts       # Modül tanımı
├── children/                # Çocuk profili modülü
│   ├── dto/                 # Veri transfer objeleri
│   ├── children.controller.ts
│   ├── children.service.ts
│   └── children.module.ts
├── prisma/                  # Veritabanı modülü
│   ├── prisma.service.ts    # DB connection
│   └── prisma.module.ts
├── app.module.ts            # Ana uygulama modülü
└── main.ts                  # Uygulama başlangıcı
```

### 🔐 Güvenlik Implementasyonu

#### **Password Hashing**
- **bcrypt** algoritması kullanılır
- Salt rounds: 10 (güvenlik vs performans dengesi)
- Asla plain text password saklanmaz

#### **JWT Token Management**
- **Expiration**: 7 gün (env variable ile değiştirilebilir)
- **Secret Key**: .env dosyasında güvenli saklanır
- **Bearer Token**: Authorization header'da taşınır

#### **Input Validation**
- **class-validator**: DTO'larda otomatik validation
- **whitelist**: Sadece tanımlı alanlar kabul edilir
- **forbidNonWhitelisted**: Bilinmeyen alanlar reddedilir

### 📊 Veritabanı Şeması Açıklaması

#### **User Model**
```typescript
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  firstName String
  lastName  String
  // ...ilişkiler
}
```

#### **Child Model**
```typescript
model Child {
  id              String    @id @default(cuid())
  firstName       String
  lastName        String
  dateOfBirth     DateTime
  // Many-to-many relation with User
  parents         User[]
}
```

### 🔄 API Flow Açıklaması

#### **1. Kullanıcı Kaydı**
```
POST /auth/register
├── DTO Validation (email, password format)
├── Email uniqueness check
├── Password hashing (bcrypt)
├── User creation in database
└── Return user data (without password)
```

#### **2. Kullanıcı Girişi**
```
POST /auth/login
├── Local Strategy (email/password check)
├── Password verification (bcrypt.compare)
├── JWT token generation
└── Return token + user data
```

#### **3. Protected Route Access**
```
GET /children (with JWT)
├── JWT Guard activation
├── Token verification
├── User extraction from token
├── Service method execution
└── Return filtered data (only user's children)
```

### 🚨 Error Handling

#### **Validation Errors**
- Otomatik HTTP 400 response
- Detaylı field-level error messages
- Type-safe error objects

#### **Authentication Errors**
- HTTP 401 (Unauthorized)
- HTTP 403 (Forbidden)
- Clear error messages

#### **Database Errors**
- Prisma exceptions handling
- Unique constraint violations
- Foreign key constraint errors

### 🧪 Testing Guide

#### **Manual Testing with Postman**
1. **Import Collection**: `Kid Bridge API.postman_collection.json`
2. **Import Environment**: `Kid Bridge Environment.postman_environment.json`
3. **Test Flow**:
   - Register User → Login → Create Child → Get Children

#### **Test Script Usage**
```bash
# Make script executable
chmod +x test-api.sh

# Run tests (server must be running)
./test-api.sh
```

### 🔧 Development Tips

#### **Adding New Module**
```bash
# Generate new module
npx nest generate module messages
npx nest generate service messages
npx nest generate controller messages
```

#### **Database Changes**
```bash
# After modifying schema.prisma
npx prisma generate
npx prisma migrate dev --name add_new_feature
```

#### **Environment Variables**
Tüm gizli bilgiler `.env` dosyasında:
- DATABASE_URL
- JWT_SECRET  
- CORS_ORIGIN

### 📈 Performance Considerations

#### **Database Queries**
- Prisma `include` ve `select` ile optimize edilmiş sorgular
- N+1 query problemini önlemek için ilişkiler önceden yüklenir
- Index'ler unique ve foreign key alanlarında

#### **Authentication**
- JWT stateless olduğu için server memory kullanmaz
- Bcrypt rounds (10) güvenlik vs hız dengesi

## License

MIT