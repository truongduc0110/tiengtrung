# 📚 WEB HỌC TỪ VỰNG TIẾNG TRUNG

---

## 🎯 YÊU CẦU NGƯỜI DÙNG

### Mô tả tổng quan
Tạo một website học từ vựng tiếng Trung tương tự như web học từ vựng tiếng Anh đã có sẵn.

### Yêu cầu chức năng chính

#### 1. Hệ thống Lớp học (Classes)
- Người dùng có thể **tạo lớp học** mới
- Người dùng có thể **tham gia lớp học** của người khác (bằng mã code)
- Mỗi lớp học có thể có **nhiều bộ từ**

#### 2. Bộ từ vựng (Vocabulary Sets)
- Mỗi lớp học chứa **nhiều bộ từ**
- Mỗi bộ từ có **thanh tiến độ** (progress bar) hiển thị % từ đã học
- Nhấn vào bộ từ → hiển thị **danh sách từ** trong bộ

#### 3. Từ vựng (Vocabulary)
- Mỗi bộ từ chứa **nhiều từ vựng**
- Mỗi từ có: chữ Hán, pinyin, nghĩa, ví dụ
- Có **nút gạt "Thuộc"** để đánh dấu từ đã thuộc
- Có nút **"Học ngay"** để bắt đầu học

#### 4. Chế độ học (Learning Games)
Khi nhấn "Học ngay", người dùng có thể chọn các game:
- **Flashcard**: Lật thẻ xem từ và nghĩa
- **Quiz**: Trắc nghiệm chọn đáp án đúng
- **Listening**: Nghe phát âm và chọn từ đúng
- **Typing**: Gõ từ theo nghĩa cho sẵn
- **Matching**: Nối từ với nghĩa tương ứng

### Yêu cầu kỹ thuật
- Backend: Port **8080**
- Frontend: Port **3000**
- Admin: Port **3001**
- Database: PostgreSQL
- Dựa trên kiến trúc của project NestJS đã có

---

## 📋 PHƯƠNG ÁN TRIỂN KHAI

---

## 📦 PHASE 1: SETUP & INFRASTRUCTURE ✅

### 1.1 Backend Setup (BE)
- [x] Khởi tạo project NestJS
- [x] Cấu hình TypeORM với PostgreSQL
- [x] Cấu hình CORS, validation pipe
- [x] Setup JWT authentication
- [x] Tạo cấu trúc thư mục modules

### 1.2 Frontend Setup (FE)
- [x] Khởi tạo project Vite + React
- [x] Cài đặt Chakra UI, Axios, React Router
- [x] Tạo cấu trúc thư mục (pages, components, services, context)
- [x] Setup API service và Auth context

### 1.3 Admin Setup (ADMIN)
- [x] Khởi tạo project Vite + React
- [x] Cài đặt dependencies
- [x] Setup routing và layout

---

## 📦 PHASE 2: AUTHENTICATION MODULE ✅

### 2.1 Backend Auth
- [x] User Entity (email, password, avatar, role, vipStatus)
- [x] Auth Controller (register, login, logout, refresh)
- [x] JWT Strategy & Guards
- [x] Google OAuth Strategy
- [x] Profile update API

### 2.2 Frontend Auth
- [x] Login page với form đẹp
- [x] Register page
- [x] Google OAuth button
- [x] Auth Context (quản lý user state)
- [x] Protected routes

---

## 📦 PHASE 3: CLASS MODULE (LỚP HỌC) ✅

### 3.1 Backend Classes
- [x] Class Entity
  - id, name, description, code (mã tham gia), ownerId
  - createdAt, updatedAt
  - isPublic (lớp công khai hay riêng tư)
- [x] ClassMember Entity (userId, classId, role: owner/member, joinedAt)
- [x] Classes Controller
  - POST /classes - Tạo lớp mới
  - GET /classes - Danh sách lớp của user
  - GET /classes/:id - Chi tiết lớp
  - POST /classes/join - Tham gia lớp bằng code
  - DELETE /classes/:id - Xóa lớp (chỉ owner)
  - PUT /classes/:id - Cập nhật lớp
  - DELETE /classes/:id/leave - Rời lớp

### 3.2 Frontend Classes
- [x] ClassList page (danh sách lớp đã tạo/tham gia)
- [x] CreateClass modal
- [x] JoinClass modal (nhập mã)
- [x] ClassDetail page (hiển thị bộ từ trong lớp)
- [ ] Class settings (cho owner)

---

## 📦 PHASE 4: VOCABULARY SET MODULE (BỘ TỪ) ✅

### 4.1 Backend Vocabulary Sets
- [x] VocabularySet Entity
  - id, name, description, icon
  - classId (thuộc lớp nào)
  - createdById, isPublic
  - totalWords, learnedWords
- [x] VocabularySets Controller
  - CRUD operations
  - GET /classes/:classId/sets - Lấy bộ từ trong lớp
  - POST /sets/:id/copy - Sao chép bộ từ

### 4.2 Frontend Vocabulary Sets
- [x] VocabularySetList component (trong ClassDetail)
- [x] CreateSet modal
- [x] SetCard component với progress bar
- [ ] Set icon selector

---

## 📦 PHASE 5: VOCABULARY MODULE (TỪ VỰNG) ✅

### 5.1 Backend Vocabulary
- [x] Vocabulary Entity
  - id, chinese (chữ Hán), pinyin, meaning
  - example, partOfSpeech
  - setId, audio (optional)
- [x] UserProgress Entity
  - userId, vocabularyId
  - correctCount, incorrectCount
  - lastReviewed, isLearned
- [x] Vocabularies Controller
  - CRUD operations
  - Bulk create/delete
  - Mark as learned/unlearned
  - Get quiz questions

### 5.2 Frontend Vocabulary
- [x] WordList page (danh sách từ trong bộ)
- [x] WordCard component
- [x] AddWord modal
- [ ] BulkAdd modal (thêm nhiều từ)
- [x] Nút toggle "Thuộc" cho mỗi từ
- [x] Nút "Học ngay" → chuyển đến Practice page

---

## 📦 PHASE 6: LEARNING GAMES MODULE ✅

### 6.1 Backend Games
- [x] Quiz endpoints (get questions, check answers)
- [x] Save progress API
- [x] Streak logging

### 6.2 Frontend Games
- [x] Practice page với các game modes:
  - [x] Flashcard - Lật thẻ xem nghĩa
  - [x] Quiz - Trắc nghiệm chọn đáp án
  - [ ] Listening - Nghe và chọn từ đúng
  - [x] Typing - Gõ từ theo nghĩa
  - [ ] Matching - Nối từ với nghĩa
- [ ] Game settings (số từ, chế độ)
- [x] Game results + Save progress
- [x] Replay incorrect words

---

## 📦 PHASE 7: PROGRESS & STREAK ✅

### 7.1 Backend Progress
- [x] Activity logging
- [x] Streak calculation (chuỗi ngày học)
- [x] Leaderboard API (xếp hạng)
- [x] Calendar API (lịch hoạt động)

### 7.2 Frontend Progress
- [x] Progress bar trong VocabularySet
- [x] Streak display (🔥 Chuỗi ngày)
- [ ] Activity calendar
- [x] Leaderboard page

---

## 📦 PHASE 8: AI FEATURES ✅

### 8.1 Backend AI
- [x] Gemini AI integration
- [x] Auto generate từ vựng từ chủ đề
- [x] Auto suggest pinyin và meaning

### 8.2 Frontend AI
- [ ] AI Generate Vocabulary modal
- [ ] Auto-fill pinyin button

---

## 📦 PHASE 9: ADMIN DASHBOARD ✅

### 9.1 Backend Admin
- [x] Admin guards
- [x] Statistics endpoints
- [x] User management
- [x] Class management
- [ ] Content moderation

### 9.2 Admin Frontend
- [x] Login page
- [x] Dashboard với charts
- [x] User list + management
- [x] Class list + management
- [ ] Set list + management

---

## 📦 PHASE 10: ADDITIONAL FEATURES

### 10.1 VIP Subscription
- [ ] Payment integration (PayOS)
- [ ] VIP features unlock
- [ ] Pricing page

### 10.2 Social Features
- [ ] Share class code
- [ ] Class chat (optional)
- [ ] Invite friends

### 10.3 Polish & Deploy
- [ ] Responsive design
- [ ] Animations (Framer Motion)
- [ ] Error handling
- [ ] Docker configuration
- [ ] Deployment scripts

---

## 📁 CẤU TRÚC THƯ MỤC

```
web_tieng_trung/
├── BE/                          # NestJS Backend (Port 8080)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/            # Authentication
│   │   │   ├── users/           # User management
│   │   │   ├── classes/         # Class management
│   │   │   ├── vocabulary-sets/ # Vocabulary sets
│   │   │   ├── vocabularies/    # Words
│   │   │   ├── progress/        # Learning progress
│   │   │   ├── streak/          # Streak tracking
│   │   │   ├── ai/              # AI features
│   │   │   ├── subscription/    # VIP subscription
│   │   │   └── admin/           # Admin endpoints
│   │   ├── config/              # Database & env config
│   │   ├── common/              # Decorators, guards, pipes
│   │   └── main.ts
│   ├── .env
│   └── package.json
│
├── FE/                          # React Frontend (Port 3000)
│   ├── src/
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   ├── services/            # API services
│   │   ├── context/             # React contexts
│   │   ├── hooks/               # Custom hooks
│   │   └── styles/              # CSS modules
│   └── package.json
│
├── ADMIN/                       # Admin Dashboard (Port 3001)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│   └── package.json
│
├── .env.example                 # Environment template
├── TASKS.md                     # This file
├── docker-compose.yml           # Docker config
└── README.md                    # Project documentation
```

---

## 🔗 API ENDPOINTS SUMMARY

### Auth
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /auth/profile
- PUT /auth/profile
- GET /auth/google
- GET /auth/google/callback

### Classes
- GET /classes
- POST /classes
- GET /classes/:id
- PUT /classes/:id
- DELETE /classes/:id
- POST /classes/join
- DELETE /classes/:id/leave
- GET /classes/:id/members

### Vocabulary Sets
- GET /classes/:classId/sets
- POST /sets
- GET /sets/:id
- PUT /sets/:id
- DELETE /sets/:id
- POST /sets/:id/copy

### Vocabularies
- GET /sets/:setId/vocabularies
- POST /vocabularies
- POST /vocabularies/bulk
- PUT /vocabularies/:id
- DELETE /vocabularies/:id
- POST /vocabularies/:id/toggle-learned
- GET /sets/:setId/quiz

### Progress
- GET /progress/stats
- POST /progress/save
- GET /activity/calendar
- GET /activity/streak
- GET /leaderboard

### AI
- POST /ai/generate-vocabulary
- POST /ai/suggest-pinyin

### Admin
- GET /api/admin/stats
- GET /api/admin/users
- GET /api/admin/classes
- PUT /api/admin/users/:id
- DELETE /api/admin/users/:id

---

## 📝 NOTES
- Frontend sử dụng Chakra UI để đảm bảo UI đẹp và consistent
- Backend port 8080, Frontend port 3000, Admin port 3001
- Sử dụng PostgreSQL làm database
- JWT cho authentication, refresh token rotation
- Gemini AI cho tính năng sinh từ vựng tự động
