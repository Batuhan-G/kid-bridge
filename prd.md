# Kid Bridge - Product Requirements Document

## Project Overview
Kid Bridge is a child tracking and communication platform for divorced parents.

**Problem:** Divorced parents face challenges with child-related coordination, expense sharing, and communication.

**Solution:** Secure centralized platform for communication, expense tracking, and child development management.

**Target:** Divorced/separated parents and families with joint custody.

## Core Features

### Implemented Features
- **Authentication:** JWT-based secure login/registration
- **Child Management:** Child profiles and basic information
- **Expense Tracking:** Category-based expense recording and tracking
- **Co-Parent Connection:** Parent invitation system
- **Notifications:** Actionable notifications with approve/reject workflows
- **Settings:** Co-parent management and account control

### Planned Features
- **Messaging:** Secure communication between parents
- **Calendar:** Joint activity planning
- **Reporting:** PDF export and statistics

## Tech Stack

**Frontend:** Next.js 14 + React + TypeScript + Tailwind CSS + shadcn/ui

**Backend:** NestJS + TypeScript + Prisma

**Database:** SQLite (Development) → PostgreSQL (Production)

**Auth:** JWT + Passport.js

**Hosting:** Vercel (Frontend) + Railway/Render (Backend)

## MVP Status

### ✅ Completed
- User registration/login system
- Child profile creation/management
- Expense recording and tracking system
- Co-parent invitation and accept/reject system
- Actionable notifications
- Settings page and co-parent management
- Account deletion feature

### 🔄 In Progress
- Messaging API development
- Calendar/activity management

### 📋 Next Sprint
- Messaging frontend integration
- Calendar view
- File upload system


## Database Strategy

**Development Environment:**
- SQLite (`dev.db`) - Fast setup, no dependencies
- Local file-based storage
- Ideal for development and testing

**Production Environment:**
- PostgreSQL - Scalability and performance
- Managed hosting (Supabase/Railway/Render)
- Required for multi-user concurrent access

**Migration Path:**
- Prisma schema supports both databases
- Switch to PostgreSQL during production deployment
- Data migration scripts will be prepared

---

## Recent Changes

### Dashboard Welcome Message Fix
**Date:** August 24, 2025
**Issue:** Dashboard displayed hardcoded name "Ayşe" instead of actual user name
**Solution:** 
- Replaced hardcoded text with dynamic user name from auth context
- Uses `{user?.firstName || 'Kullanıcı'}` to display actual user's first name
- Fallback to 'Kullanıcı' if user data is not available
**Impact:** Users now see their actual name in the welcome message

### Header User Name Removal & Sidebar Logout Enhancement
**Date:** August 24, 2025
**Changes Made:**
- **Removed user name display from header:** User's first name and last name no longer appear in the header area
- **Moved logout functionality to sidebar:** Logout button moved from header to sidebar footer, visible on all screen sizes
- **Added logout confirmation popup:** Users must confirm logout action through an AlertDialog before proceeding
- **Enhanced logout styling:** Logout button now has light red background (`bg-red-50`) with red text and hover states
- **Improved user experience:** Prevents accidental logouts and provides consistent logout access via sidebar

**Technical Details:**
- Modified `LogoutButton` component in `dashboard/page.tsx` to return null (removed functionality)
- Updated `sidebar.tsx` to include AlertDialog components for logout confirmation
- Used existing color palette with red variants for consistent styling
- Logout button positioned at bottom of sidebar with distinctive red background

**Impact:** 
- Cleaner header design without user name clutter
- Consistent logout access through sidebar on all devices
- Reduced accidental logouts through confirmation dialog
- Better visual hierarchy with color-coded logout button

---