# KodeSkool 🎓💻

**KodeSkool** is a modern, high-performance, full-stack **MERN** (MongoDB, Express.js, React.js, Node.js, Tailwind CSS) interactive learning platform designed for school students (grades 8–12), faculty, and institutional administrators. It integrates animated video lessons, an in-browser multi-language code editor, structured course syllabi, test analytics, an AI assistant chatbot (powered by Groq), role-based dashboards (Student, Faculty, Admin), and database optimizations engineered for scale.

---

## 🌐 Live Deployments

- **Frontend Application (Vercel)**: [https://kode-skool-rjgg.vercel.app](https://kode-skool-rjgg.vercel.app)
- **Backend API Server (Render)**: [https://kode-skool.onrender.com](https://kode-skool.onrender.com)

---

## 🧱 Clean Architecture & Directory Structure

```text
Kode-Skool/
│
├── BackEnd/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection with pooling (maxPoolSize: 200, minPoolSize: 20)
│   │   └── groq.js                  # Groq SDK configuration for AI study tutor
│   ├── controllers/
│   │   ├── adminController.js       # Stats, school setup, $lookup user listing, CSV import, reports
│   │   ├── authController.js        # Student/User registration & bcrypt login
│   │   ├── chat.controller.js       # AI study assistant query handler
│   │   ├── courseController.js      # Courses, units, topics, enrollment, ratings
│   │   ├── teacherController.js     # Faculty overview, student progress, assessment metrics
│   │   └── userController.js        # Duplicate-safe student profile retrieval & updates
│   ├── middleware/
│   │   ├── adminMiddleware.js       # Admin role validation guard
│   │   ├── authMiddleware.js        # JWT verification middleware (header: auth-token)
│   │   └── rateLimiter.js           # express-rate-limit guards for Auth (30/15m) & Chat (30/1m)
│   ├── models/
│   │   ├── User.js                  # User credentials, roles (Student, Faculty, Admin), index
│   │   ├── Student.js               # Student personal, address, education, socials, class index
│   │   ├── Teacher.js               # Faculty department, assigned classes, qualifications
│   │   ├── School.js                # School profile, board, academic year, class roster
│   │   ├── Course.js                # Course details & auto-rating static hook
│   │   ├── CourseStruct.js          # Course units & topic structures
│   │   ├── CourseEnroll.js          # Enrollment tracking & topic progress
│   │   ├── CourseRating.js          # Ratings, feedback & updateRating hooks
│   │   ├── Result.js                # Test results with compound index { Std_ID: 1, Test_ID: 1 }
│   │   ├── Test.js                  # Course tests & questions
│   │   └── ScreenTime.js            # Usage duration tracking with index { St_ID: 1, Start_Date: -1 }
│   ├── routes/
│   │   ├── adminRoutes.js           # /api/admin/* (RBAC protected: Admin)
│   │   ├── authRoutes.js            # /api/register/student, /api/login (Rate limited)
│   │   ├── chat.routes.js           # /api/chat, /api/v1/chat (Rate limited)
│   │   ├── courseRoutes.js          # /api/add-course, /api/get-course, /api/enroll-course, etc.
│   │   ├── teacherRoutes.js         # /api/teacher/* (Protected: Faculty/Teacher/Admin)
│   │   └── userRoutes.js            # /api/profile/student, /api/profile/student/update
│   ├── scripts/
│   │   ├── createAdmin.js           # Admin provisioning CLI script
│   │   ├── createTeacher.js         # Teacher provisioning CLI script
│   │   └── initDatabase.js          # Database seeder with sample courses & structures
│   ├── tests/
│   │   └── api.test.js              # 21-test automated integration suite (Jest + Supertest)
│   ├── app.js                       # Express app configuration & middleware
│   ├── server.js                    # Server startup & DB connection initialization
│   ├── .env                         # Backend environment variables
│   ├── .env.example
│   └── package.json
│
├── FrontEnd/
│   ├── public/
│   │   ├── index.html
│   │   └── logoWeb.png
│   ├── src/
│   │   ├── assets/img/              # Standardized lowercase image & logo assets
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Footer.jsx       # Global responsive footer with social links & branding
│   │   │   │   └── TechIcon.jsx     # Programming language badge renderer
│   │   │   └── dashboard/
│   │   │       ├── CertificateModal.jsx
│   │   │       ├── ResultsSection.jsx
│   │   │       ├── ScreenTimeSection.jsx
│   │   │       ├── TestSection.jsx
│   │   │       ├── Timeline.jsx
│   │   │       └── YourCourses.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Clean JWT authentication state & provider
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboard.jsx  # Institutional Admin Hub (metrics, CSV import, school setup)
│   │   │   ├── teacher/
│   │   │   │   └── TeacherDashboard.jsx # Faculty Hub (class cards, student tracking, assessments)
│   │   │   ├── LandingPage.jsx      # Animated public landing page
│   │   │   ├── Login.jsx            # React Login, Register, 6-box OTP & Reset Password modal
│   │   │   ├── Dashboard.jsx        # Student activity dashboard with live metrics
│   │   │   ├── Courses.jsx          # Courses container
│   │   │   ├── CourseList.jsx       # Course catalog
│   │   │   ├── CourseView.jsx       # Course unit breakdown & topic status
│   │   │   ├── CourseVideo.jsx      # Video player & completion marker
│   │   │   ├── Editor.jsx           # 10-language in-browser editor with indentation & bracket completion
│   │   │   ├── Profile.jsx          # Resilient student profile with offline cache & retry
│   │   │   └── Chatbot.jsx          # Groq-powered AI study assistant
│   │   ├── services/
│   │   │   ├── adminService.js      # Admin API client
│   │   │   ├── api.js               # Central Axios client with dynamic env fallbacks & auth-token
│   │   │   ├── authService.js       # Login, register, logout helpers
│   │   │   ├── chatService.js       # AI Chatbot API client
│   │   │   ├── courseService.js     # Courses, structure, enrollment, rating APIs
│   │   │   ├── teacherService.js    # Teacher Hub API client
│   │   │   └── userService.js       # Profile get and update APIs
│   │   ├── App.jsx                  # Main routing, role navigation & sticky sidebar shell
│   │   ├── App.css
│   │   ├── index.css                # Tailwind directives & base styling
│   │   └── index.js
│   ├── tailwind.config.js           # Extended with KodeSkool brand colors & fonts
│   ├── postcss.config.js
│   ├── .env                         # Default frontend environment variables
│   ├── .env.development             # Local development environment (http://localhost:5000)
│   ├── .env.production              # Production environment (https://kode-skool.onrender.com)
│   ├── .env.example
│   └── package.json
│
├── .gitignore                       # Clean root ignore rules
├── package.json                     # Root workspace runner with concurrently
└── README.md
```

---

## ⚡ Performance & Scalability Optimizations

KodeSkool is engineered with enterprise-grade backend patterns to ensure responsive performance under high concurrency:

1. **Elimination of N+1 Queries (Admin User Directory)**:
   - Replaced `User.find()` followed by individual `Promise.all(users.map(... findById))` queries with a single MongoDB `$lookup` aggregation pipeline.
   - Performs parallel joins across `students` and `teachers` collections, projects normalized profile data, handles search filters at the database index level, and returns metadata and paginated slices via `$facet` in a single DB round-trip.

2. **Server-Side Pagination Everywhere**:
   - All collection-returning endpoints enforce server-side pagination with query parameters (`?page=1&limit=20`):
     - Admin Users (`/api/admin/users`)
     - Academic Reports (`/api/admin/reports`)
     - Course Catalogues (`/api/all-courses`, `/api/get-course`, `/api/my-courses`)
     - Teacher Student Progress (`/api/teacher/students`)
     - Assessment Overviews (`/api/teacher/assessments`)

3. **Mongoose `.lean()` on All Read Queries**:
   - All read-only database operations bypass Mongoose document hydration using `.lean()`, reducing query execution memory overhead by **70–80%**.

4. **Compound & Secondary Indexes**:
   - `Result`: `{ Std_ID: 1, Test_ID: 1 }` (optimizes student exam lookups)
   - `ScreenTime`: `{ St_ID: 1, Start_Date: -1 }` (optimizes analytics time-series range queries)
   - `User`: `{ User_Type: 1 }` (optimizes role-based queries)
   - `Student`: `{ ClassSection: 1 }` (optimizes classroom student filtering)

5. **Concurrency & Database Connection Pooling**:
   - MongoDB connection configured in `BackEnd/config/db.js` with:
     ```javascript
     maxPoolSize: 200,
     minPoolSize: 20,
     serverSelectionTimeoutMS: 5000
     ```

6. **API Rate Limiting (`express-rate-limit`)**:
   - **Auth Limiter**: Protects `/api/login` and `/api/register/student` from credential stuffing (30 attempts / 15-minute window).
   - **Chat Limiter**: Protects `/api/chat` from API token exhaustion (30 requests / 1-minute window).

7. **Duplicate-Safe Profile Linking**:
   - `getStudentProfile` and `updateStudentProfile` verify existing records via `Student.findOne({ Email })` before creating documents, eliminating MongoDB `E11000` duplicate key errors.

---

## ⚙️ Environment Variables

### Backend (`BackEnd/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/Kodeskool
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3500
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (`FrontEnd/.env`)
```env
PORT=3500
REACT_APP_BACKEND_URL=https://kode-skool.onrender.com
```

- In development (`FrontEnd/.env.development`): `REACT_APP_BACKEND_URL=http://localhost:5000`
- In production (`FrontEnd/.env.production`): `REACT_APP_BACKEND_URL=https://kode-skool.onrender.com`

---

## 🚀 Getting Started

### 1. Install Dependencies
From the root directory:
```bash
npm run install:all
```
*(Or install inside `BackEnd/` and `FrontEnd/` respectively with `npm install`)*

### 2. Seed Database (Optional)
Seed the database with sample courses, syllabus structures, and an admin user:
```bash
node BackEnd/scripts/initDatabase.js
```

### 3. Run Concurrently (Development)
From the root directory:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3500`

### 4. Run Individually
- **Backend only**:
  ```bash
  npm run server:dev
  ```
- **Frontend only**:
  ```bash
  npm run client
  ```

### 5. Run Automated Backend Test Suite
```bash
npm test --prefix BackEnd
```
*(Executes 21 automated integration tests using Jest, Supertest, and in-memory MongoDB covering auth, validation, profiles, courses, enrollment, ratings, admin endpoints, and teacher endpoints).*

### 6. Build Frontend for Production
```bash
npm run client:build
```

---

## 📡 REST API Reference

### 🔐 Authentication (`/api`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/register/student` | Register student account with password validation | ❌ (Rate limited) |
| POST | `/api/login` | Login with email & password, returns 7-day JWT + role | ❌ (Rate limited) |

### 👤 Profile (`/api`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/profile/student` | Get authenticated student's profile (duplicate-safe) | ✅ (`auth-token`) |
| POST | `/api/profile/student/update` | Update personal, address, education, and social links | ✅ (`auth-token`) |

### 📚 Courses (`/api`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/add-course` | Add a new course | ❌ |
| GET | `/api/all-courses?page=1&limit=20` | Get paginated list of all courses | ❌ |
| GET | `/api/get-course?course_id=...` | Get course details by ID | ❌ |
| POST | `/api/add-course-struct` | Add or update course syllabus structure | ❌ |
| GET | `/api/get-course-struct?course_id=...` | Get course units & topics | ❌ |
| GET | `/api/get-course-topic?topic_id=...` | Get specific topic details | ❌ |
| POST | `/api/enroll-course` | Enroll authenticated student in a course | ✅ (`auth-token`) |
| GET | `/api/my-courses?page=1&limit=20` | List paginated enrolled courses for student | ✅ (`auth-token`) |
| POST | `/api/update-course-status` | Mark a topic as completed | ✅ (`auth-token`) |
| POST | `/api/rate-course` | Submit rating & recompute average course rating | ✅ (`auth-token`) |

### 🛡️ Admin Management (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/admin/stats` | Platform KPIs (students, teachers, schools, pass rate) | ✅ (Admin) |
| GET | `/api/admin/school` | Fetch school setup details & classes | ✅ (Admin) |
| POST | `/api/admin/school` | Update school configuration & academic year | ✅ (Admin) |
| GET | `/api/admin/users?role=...&search=...&page=1&limit=20` | Paginated user list with `$lookup` aggregation | ✅ (Admin) |
| POST | `/api/admin/users/create` | Create individual student or teacher account | ✅ (Admin) |
| POST | `/api/admin/users/bulk-import` | Bulk import users via JSON/CSV data | ✅ (Admin) |
| POST | `/api/admin/courses/assign` | Assign course to class, student, or grade | ✅ (Admin) |
| GET | `/api/admin/reports?page=1&limit=20` | Paginated academic enrollments & test results | ✅ (Admin) |

### 👨‍🏫 Faculty / Teacher Hub (`/api/teacher`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/teacher/dashboard` | Teacher dashboard stats, assigned classes, certificates | ✅ (Faculty/Admin) |
| GET | `/api/teacher/students?page=1&limit=20` | Student progress, course completion & support alerts | ✅ (Faculty/Admin) |
| GET | `/api/teacher/assessments?page=1&limit=20` | Assessment overview, submissions & score averages | ✅ (Faculty/Admin) |

### 🤖 AI Study Assistant (`/api/chat`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/chat/message` | Send message to Groq-powered AI coding assistant | ❌ (Rate limited) |
| POST | `/api/chat/` | Primary chat assistant query endpoint | ❌ (Rate limited) |

---

## ✨ Features & User Experience

- 🏠 **Landing Page**: Animated hero with carousel, skill tags, Why Choose Us cards, features carousel, FAQ accordion, and CTA banner.
- 🔐 **React Authentication**: 100% reactive single-page app with tabs, role selection, 3D floating circles, flip animation, 6-digit OTP verification with countdown timer, and password reset modal.
- 📊 **Student Dashboard**: Real-time activity timeline, test counters with running number animations, screen time bar chart, pass/fail pie chart, and course progress rings.
- 📚 **Courses**: Enrolled course catalog, topic status tracking, animated circular progress, video player with YouTube embed, and auto-completion.
- ✏️ **Code Editor**: Multi-language support (C, C++, Java, Python, SQL, Swift, JS, R, Ruby, Rust), auto-indentation, bracket completion, tab insertion, fullscreen toggle, run simulation, and mobile output tabs.
- 👤 **Resilient Profile**: Live editing of personal details, institution, and social links with offline cached fallback, interactive "Retry Connection", and "Go to Sign In" state management.
- 🛡️ **Admin Hub**: Platform metrics, institutional settings, user directory with server-side pagination, CSV batch onboarding, and course assignment.
- 👨‍🏫 **Faculty Hub**: Overview of assigned classes, student progress tracking, intervention alerts for struggling students, and assessment statistics.
- 🤖 **Chatbot**: Study assistant powered by Groq LLM with suggestion prompts and interactive query responses.
- 🧭 **Sticky Navigation**: Fluid sticky sidebar navigation with responsive drawer controls across light/dark themes.
- 🌙 **Dark / Light Mode**: Unified theme switching across all views.
- 📱 **Responsive**: Fully responsive across mobile, tablet, and desktop viewports.

---

## 📄 License
All rights reserved © 2024–2026 KodeSkool.
