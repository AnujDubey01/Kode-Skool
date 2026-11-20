# KodeSkool 🎓💻

**KodeSkool** is a modern, full-stack **MERN** (MongoDB, Express.js, React.js, Node.js, Tailwind CSS) interactive learning platform designed for school students (grades 8–12). It integrates animated video lessons, an in-browser multi-language code editor, structured courses, test analytics, an AI assistant chatbot, and a comprehensive student dashboard.

---

## 🧱 Clean MERN Architecture

```text
Kode-Skool/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # Isolated MongoDB connection with Mongoose
│   ├── controllers/
│   │   ├── authController.js        # Student registration & login logic
│   │   ├── courseController.js      # Courses, units, topics, enrollment, ratings
│   │   └── userController.js        # Student profile retrieval & updates
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification middleware (header: auth-token)
│   ├── models/
│   │   ├── User.js                  # User credentials & role
│   │   ├── Student.js               # Student personal, address, education, socials
│   │   ├── Course.js                # Course details & auto-rating static hook
│   │   ├── CourseStruct.js          # Course units & topic structures
│   │   ├── CourseEnroll.js          # Enrollment tracking & topic progress
│   │   ├── CourseRating.js          # Ratings, feedback & updateRating hooks
│   │   ├── Result.js                # Test results
│   │   ├── Test.js                  # Course tests
│   │   └── ScreenTime.js            # Usage duration tracking
│   ├── routes/
│   │   ├── authRoutes.js            # /api/register/student, /api/login
│   │   ├── courseRoutes.js          # /api/add-course, /api/get-course, /api/enroll-course, etc.
│   │   └── userRoutes.js            # /api/profile/student, /api/profile/student/update
│   ├── tests/
│   │   └── api.test.js              # Complete Jest + Supertest + In-Memory MongoDB suite
│   ├── app.js                       # Express app configuration & middleware
│   ├── server.js                    # Server startup & DB initialization
│   ├── .env                         # Backend environment variables
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── logoWeb.png
│   ├── src/
│   │   ├── assets/img/              # All original image & logo assets
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── Footer.jsx       # Global footer with social links & branding
│   │   │   └── dashboard/
│   │   │       ├── ResultsSection.jsx
│   │   │       ├── ScreenTimeSection.jsx
│   │   │       ├── TestSection.jsx
│   │   │       ├── Timeline.jsx
│   │   │       └── YourCourses.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Clean JWT authentication state & provider
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Animated public landing page
│   │   │   ├── Login.jsx            # React Login, Register, 6-box OTP & Reset Password modal
│   │   │   ├── Dashboard.jsx        # Student activity dashboard
│   │   │   ├── Courses.jsx          # Courses container
│   │   │   ├── CourseList.jsx       # Course catalog
│   │   │   ├── CourseView.jsx       # Course unit breakdown & topic status
│   │   │   ├── CourseVideo.jsx      # Video player & completion marker
│   │   │   ├── Editor.jsx           # 10-language in-browser editor with indentation & bracket completion
│   │   │   ├── Profile.jsx          # Student profile view & live editing
│   │   │   └── Chatbot.jsx          # Interactive AI study assistant
│   │   ├── services/
│   │   │   ├── api.js               # Central Axios client with auto-attached auth-token
│   │   │   ├── authService.js       # Login, register, logout helpers
│   │   │   ├── courseService.js     # Courses, structure, enrollment, rating APIs
│   │   │   └── userService.js       # Profile get and update APIs
│   │   ├── App.jsx                  # Main routing & application shell
│   │   ├── App.css
│   │   ├── index.css                # Tailwind directives & base styling
│   │   └── index.js
│   ├── tailwind.config.js           # Extended with KodeSkool brand colors & fonts
│   ├── postcss.config.js
│   ├── .env                         # Frontend environment variables
│   ├── .env.example
│   └── package.json
│
├── .gitignore                       # Clean root ignore rules
├── package.json                     # Root workspace runner with concurrently
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/Kodeskool
JWT_SECRET=my-key
FRONTEND_URL=http://localhost:3500
```

### Frontend (`frontend/.env`)
```env
PORT=3500
REACT_APP_BACKEND_URL=http://localhost:5000
```

---

## 🚀 Getting Started

### 1. Install Dependencies
From the root directory:
```bash
npm run install:all
```
*(Or install inside `backend/` and `frontend/` respectively with `npm install`)*

### 2. Run Both Backend & Frontend Concurrently
From the root directory:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3500`

### 3. Run Individually
- **Backend only**:
  ```bash
  npm run server:dev
  ```
- **Frontend only**:
  ```bash
  npm run client
  ```

### 4. Run Automated Backend Test Suite
```bash
npm test --prefix backend
```
*(Executes 18 automated integration tests using Jest, Supertest, and in-memory MongoDB covering auth, validation, profiles, courses, enrollment, ratings, and status updates).*

### 5. Build Frontend for Production
```bash
npm run client:build
```

---

## 📡 REST API Reference

### Authentication (`/api`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/register/student` | Register student account with password validation | ❌ |
| POST | `/api/login` | Login with email & password, returns 7-day JWT | ❌ |

### Profile (`/api`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/profile/student` | Get authenticated student's profile | ✅ (`auth-token`) |
| POST | `/api/profile/student/update` | Update personal, address, education, and social links | ✅ (`auth-token`) |

### Courses (`/api`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/add-course` | Add a new course | ❌ |
| GET | `/api/get-course?course_id=...` | Get course details | ❌ |
| POST | `/api/add-course-struct` | Add or update course syllabus structure | ❌ |
| GET | `/api/get-course-struct?course_id=...` | Get course units & topics | ❌ |
| GET | `/api/get-course-topic?topic_id=...` | Get specific topic details | ❌ |
| POST | `/api/enroll-course` | Enroll authenticated student in a course | ✅ (`auth-token`) |
| GET | `/api/my-courses` | List enrolled courses for authenticated student | ✅ (`auth-token`) |
| POST | `/api/update-course-status` | Mark a topic as completed | ✅ (`auth-token`) |
| POST | `/api/rate-course` | Submit rating & recompute average course rating | ✅ (`auth-token`) |

---

## ✨ Features Preserved & Enhanced

- 🏠 **Landing Page**: Animated hero with carousel, skill tags, Why Choose Us cards, features carousel, FAQ accordion, and CTA banner.
- 🔐 **React Login & Authentication**: 100% migrated from server-rendered Pug into a reactive single-page app with tabs, role selection, 3D floating circles, flip animation, 6-digit OTP verification with countdown timer, and password reset modal.
- 📊 **Dashboard**: Real-time activity timeline, test counters with running number animations, screen time bar chart, pass/fail pie chart, and course progress rings.
- 📚 **Courses**: Enrolled course catalog, topic status tracking, animated circular progress, video player with YouTube embed, and auto-completion.
- ✏️ **Code Editor**: Multi-language support (C, C++, Java, Python, SQL, Swift, JS, R, Ruby, Rust), auto-indentation, bracket completion, tab insertion, fullscreen toggle, run simulation, and mobile output tabs.
- 👤 **Profile**: View and edit personal info, address, institution, class, and social handles (LinkedIn, HackerRank, CodeChef, Instagram) with live toast notifications.
- 🤖 **Chatbot**: Study assistant with suggestion prompts and interactive query responses.
- 🌙 **Dark / Light Mode**: Unified theme switching across all views.
- 📱 **Responsive**: Fully responsive across mobile, tablet, and desktop viewports.

---

## 📄 License
All rights reserved © 2024 KodeSkool.
