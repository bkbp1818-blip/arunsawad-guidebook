# Arunsawad Guidebook - Implementation Plan

## Project Overview

**Project Name:** Arunsawad Guidebook
**Type:** Digital Guidebook สำหรับ Hostel
**Purpose:** เป็นแอพที่ช่วยให้แขกของโฮสเทลเข้าถึงข้อมูลที่จำเป็นได้ง่าย

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Authentication | NextAuth.js v5 |
| Maps | Google Maps API |
| AI/Chat | Anthropic AI SDK |
| Deployment | Vercel |

---

## Database Models

| Model | Description |
|-------|-------------|
| Location | สาขาโฮสเทล (Chinatown, Yaowarat, 103 NANA) |
| Place | สถานที่แนะนำ (ร้านอาหาร, คาเฟ่, บาร์, ฯลฯ) |
| FAQ | คำถามที่พบบ่อยสำหรับ Chatbot |
| ThaiPhrase | ประโยคภาษาไทยสำหรับนักท่องเที่ยว |
| Event | กิจกรรมในโฮสเทล |
| DailyPick | ไฮไลท์ประจำวัน |
| GuestbookEntry | สมุดเยี่ยม |
| User | Admin users |

---

## Application Pages

### Public Pages (แขกใช้งาน)
- `/` - หน้าแรก (เลือกสาขา)
- `/explore` - สำรวจสถานที่แนะนำ
- `/info` - ข้อมูลโฮสเทล (WiFi, Check-in/out)
- `/community` - สมุดเยี่ยมชุมชน
- `/chat` - AI Chatbot ตอบคำถาม

### Admin Dashboard
- `/login` - เข้าสู่ระบบ Admin
- `/dashboard` - หน้ารวม Dashboard
- `/dashboard/locations` - จัดการสาขา
- `/dashboard/places` - จัดการสถานที่แนะนำ
- `/dashboard/faqs` - จัดการคำถามที่พบบ่อย
- `/dashboard/phrases` - จัดการประโยคภาษาไทย
- `/dashboard/events` - จัดการกิจกรรม
- `/dashboard/daily-picks` - จัดการไฮไลท์ประจำวัน
- `/dashboard/guestbook` - จัดการสมุดเยี่ยม

---

## Completed Features

### Phase 1: Foundation (Completed)
- [x] Project setup (Next.js + Tailwind + shadcn/ui)
- [x] Database schema design
- [x] Prisma setup และ migrations
- [x] Authentication system (NextAuth.js)
- [x] Admin dashboard layout

### Phase 2: Core Features (Completed)
- [x] Location management
- [x] Place management
- [x] FAQ management
- [x] Thai phrases management
- [x] Events management
- [x] Daily picks management
- [x] Guestbook management

### Phase 3: Public Pages (Completed)
- [x] Homepage with location selection
- [x] Explore page with Google Maps
- [x] Info page
- [x] Community/Guestbook page
- [x] AI Chat page

---

## Production URL

**Live Site:** https://arunsawad-guidebook.vercel.app

---

## Update History

### 2025-12-29
- เปลี่ยนระบบ login จาก email เป็น username
- Admin credentials: `admin` / `admin123`
- แก้ไข Sign Out ให้ redirect ไปหน้า `/login`
- แก้ไข Login ให้ redirect ไปหน้า `/dashboard`
- Deploy เวอร์ชันล่าสุดขึ้น Vercel
- ตั้งค่า domain alias เป็น `arunsawad-guidebook.vercel.app`

### 2025-12-15
- สร้างไฟล์ implementation-plan.md
- สถานะปัจจุบัน: โปรเจกต์พร้อมใช้งานบน Vercel

### Recent Commits
- `e6b95c9` - Fix Google Maps error - move bounds calculation to useEffect
- `c71dfa8` - Update .gitignore to exclude .vercel and .env.local files
- `c36f5c4` - Major redesign: Mobile-first unified guidebook
- `bb33328` - Fix dashboard routes with middleware authentication
- `798228a` - Test: remove dashboard layout temporarily

---

## Known Issues / Future Improvements

### Current Issues
- [ ] (เพิ่มปัญหาที่พบตรงนี้)

### Planned Improvements
- [ ] รองรับหลายภาษา (i18n)
- [ ] Push notifications สำหรับกิจกรรม
- [ ] Offline support (PWA)
- [ ] Image optimization และ lazy loading
- [ ] Analytics และ usage tracking

---

## Environment Variables Required

```env
# Database
DATABASE_URL=

# NextAuth
AUTH_SECRET=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Anthropic AI
ANTHROPIC_API_KEY=
```

---

## Commands Reference

```bash
# Development
npm run dev

# Database
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio

# Build
npm run build
npm run start
```

---

## Notes

- Admin login: `admin` / `admin123`
- ใช้ Vercel Blob สำหรับเก็บไฟล์รูปภาพ
- ไม่ใช้ Row Level Security (RLS)
