# 🇨🇳 Web Học Từ Vựng Tiếng Trung

## 📖 Giới thiệu
Nền tảng học từ vựng tiếng Trung tương tác với các tính năng:
- **Lớp học**: Tạo hoặc tham gia lớp học bằng mã code
- **Bộ từ vựng**: Quản lý nhiều bộ từ trong mỗi lớp học
- **Flashcard & Games**: Học từ qua các game tương tác
- **Progress tracking**: Theo dõi tiến độ học tập
- **AI Features**: Tự động sinh từ vựng từ chủ đề

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTS                                 │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Frontend      │     Admin       │        Mobile           │
│   (Port 3000)   │   (Port 3001)   │       (Future)          │
└────────┬────────┴────────┬────────┴────────────────────────┬┘
         │                 │                                  │
         └─────────────────┼──────────────────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────────────┐
         │           NestJS Backend                │
         │            (Port 8080)                  │
         ├─────────────────────────────────────────┤
         │  Auth │ Classes │ VocabSets │ Vocab    │
         │  AI   │ Progress │ Streak │ Admin      │
         └─────────────────────────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────────────┐
         │           PostgreSQL                    │
         │            (Port 5432)                  │
         └─────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm hoặc yarn

### 1. Backend Setup
```bash
cd BE
npm install
npm run start:dev
# Server chạy tại http://localhost:8080
```

### 2. Frontend Setup
```bash
cd FE
npm install
npm run dev
# App chạy tại http://localhost:3000
```

### 3. Admin Setup
```bash
cd ADMIN
npm install
npm run dev
# Admin chạy tại http://localhost:3001
```

## 📁 Cấu trúc thư mục

```
web_tieng_trung/
├── BE/              # NestJS Backend (Port 8080)
│   └── .env         # Environment variables
├── FE/              # React Frontend (Port 3000)
│   └── .env         # VITE_API_BASE_URL
├── ADMIN/           # Admin Dashboard (Port 3001)
│   └── .env         # VITE_API_BASE_URL
├── TASKS.md         # Task checklist
└── README.md        # This file
```

## 🔑 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=123456
DATABASE_NAME=nestjs

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-here
REFRESH_TOKEN_EXPIRES_IN=7d

# App
PORT=8080
NODE_ENV=development

# AI
GEMINI_API_KEYS=key1,key2

# PayOS
PAYOS_CLIENT_ID=xxx
PAYOS_API_KEY=xxx
PAYOS_CHECKSUM_KEY=xxx
PAYOS_RETURN_URL=http://localhost:8080/pages/payment-success.html
PAYOS_CANCEL_URL=http://localhost:8080/pages/payment-cancel.html
VIP_MONTHLY_PRICE=20000

# Google OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

### Frontend/Admin (.env)
```env
VITE_API_BASE_URL=http://localhost:8080
```

## 📚 Tech Stack

### Backend
- **NestJS** - Node.js framework
- **TypeORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Google OAuth** - Social login
- **Gemini AI** - AI features
- **PayOS** - Payment gateway

### Frontend & Admin
- **React 18** - UI library
- **Vite** - Build tool
- **Chakra UI** - Component library
- **Axios** - HTTP client
- **React Router** - Routing
- **Framer Motion** - Animations

## 🎮 Features

### Lớp học (Classes)
- Tạo lớp học với mã code tham gia
- Tham gia lớp bằng mã code
- Quản lý thành viên trong lớp

### Bộ từ (Vocabulary Sets)
- Tạo nhiều bộ từ trong mỗi lớp
- Progress bar hiển thị tiến độ
- Sao chép bộ từ công khai

### Từ vựng (Vocabulary)
- Thêm từ: Chữ Hán, Pinyin, Nghĩa, Ví dụ
- Nút gạt "Thuộc" để đánh dấu từ đã học
- Bulk import từ Excel/CSV

### Learning Games
- **Flashcard**: Lật thẻ học từ
- **Quiz**: Trắc nghiệm 4 đáp án
- **Listening**: Nghe và chọn từ đúng
- **Typing**: Gõ từ theo nghĩa
- **Matching**: Nối từ với nghĩa

### Progress & Streak
- Theo dõi từ đã học/chưa học
- Chuỗi ngày học (streak)
- Bảng xếp hạng (leaderboard)
- Lịch hoạt động

## 📝 License

MIT License © 2025
