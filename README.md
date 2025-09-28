# Kid Bridge

**Building stronger connections between co-parents for the wellbeing of children.**

Kid Bridge is a comprehensive digital platform designed to facilitate communication, coordination, and collaboration between divorced or separated co-parents. Our platform helps families maintain healthy relationships and ensures children receive the support they need from both parents.

## 🌟 Features

### Core Functionality
- **🔐 Secure Authentication** - JWT-based secure login and registration system
- **👶 Child Profile Management** - Comprehensive child information and development tracking
- **💬 Secure Messaging** - Safe communication channel between co-parents
- **💰 Expense Tracking** - Transparent financial management and cost sharing
- **📅 Activity Planning** - Coordinated scheduling and event management
- **📊 Development Tracking** - Milestone monitoring and progress reports
- **📁 Document Management** - Secure file storage and sharing
- **🔔 Smart Notifications** - Actionable alerts with approval workflows

### Advanced Features
- **Multi-Child Support** - Manage multiple children in one account
- **Co-Parent Invitations** - Easy onboarding for the other parent
- **Approval Workflows** - Structured decision-making processes
- **Privacy Protection** - GDPR/KVKK compliant data handling
- **Mobile Responsive** - Works seamlessly on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL (Production) / SQLite (Development)
- pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Batuhan-G/kid-bridge.git
   cd kid-bridge
   ```

2. **Install dependencies:**
   ```bash
   # Frontend
   pnpm install

   # Backend
   cd backend
   pnpm install
   ```

3. **Environment Setup:**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   # Edit .env with your database and JWT settings
   ```

4. **Database Setup:**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the application:**
   ```bash
   # Terminal 1 - Backend (runs on port 3003)
   cd backend
   PORT=3003 pnpm run start:dev

   # Terminal 2 - Frontend (runs on port 3000)
   pnpm run dev
   ```
## 🏗️ Architecture

### Frontend Stack
- **Framework:** Next.js 14 + React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** Zustand + React Hooks
- **Data Fetching:** TanStack Query
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts for data visualization

### Backend Stack
- **Framework:** NestJS + TypeScript
- **Database:** PostgreSQL (Prod) / SQLite (Dev)
- **ORM:** Prisma with type-safe queries
- **Authentication:** JWT + Passport.js
- **Validation:** class-validator + class-transformer
- **Security:** bcrypt, CORS, input validation

### Key Design Principles
- **Type Safety:** Full TypeScript coverage across the stack
- **Security First:** Comprehensive data protection and validation
- **User Experience:** Intuitive interface with mobile-first design
- **Scalability:** Modular architecture ready for growth
- **Maintainability:** Clean code with comprehensive testing

## 📱 Core Modules

### Authentication & Security
- JWT-based stateless authentication
- Password hashing with bcrypt
- Role-based access control
- CORS protection and input validation

### Child Management
- Create and manage child profiles
- Track development milestones
- Store important documents and photos
- Multi-child family support

### Communication
- Secure messaging between co-parents
- Message history and search
- Notification system for important updates
- Conflict-free communication tools

### Financial Management
- Expense tracking and categorization
- Automatic cost-sharing calculations
- Receipt and document uploads
- Monthly and yearly reporting

### Activity Coordination
- Shared calendar system
- Event planning and approval workflows
- School, health, and social activity tracking
- Automatic reminders and notifications

## 🔒 Security & Privacy

- **Data Encryption:** AES-256 at rest, TLS 1.3 in transit
- **Privacy Compliance:** GDPR/KVKK compliant data handling
- **Audit Logging:** Comprehensive activity tracking
- **Secure Authentication:** JWT tokens with configurable expiration
- **Input Validation:** Multi-layer validation to prevent attacks


**Frontend:**
```bash
pnpm run dev         # Start development server
pnpm run build       # Build for production
pnpm run start       # Start production server
pnpm run lint        # Run ESLint
```

**Backend:**
```bash
pnpm run start:dev   # Start development server
pnpm run build       # Build for production
pnpm run start:prod  # Start production server
pnpm run test        # Run unit tests
pnpm run test:e2e    # Run end-to-end tests
```

### Database Management
```bash
npx prisma studio    # Open database GUI
npx prisma migrate dev # Create and apply migrations
npx prisma generate  # Generate Prisma client
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues:** Report bugs via [GitHub Issues](https://github.com/Batuhan-G/kid-bridge/issues)
- **Security:** Report security vulnerabilities to batuhangoren99@hotmail.com

## 🙏 Acknowledgments

Built with love for families who need better communication tools. Special thanks to all co-parents who provided insights during the development process.

---

**Kid Bridge - Building stronger connections, one family at a time.**