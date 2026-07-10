# KodeSkool 🎓💻

**KodeSkool** is an interactive coding learning platform built for school students (grades 8–12). It combines animated video lessons, an in-browser code editor, structured courses, tests, and a student dashboard — all in one place.

---

## 🔗 Live Demo

| Service | URL |
|---|---|
| **Backend API** | [https://kode-skool.onrender.com](https://kode-skool.onrender.com) |
| **Frontend** | `http://localhost:3500` (run locally) |

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router v6, Bootstrap 5, Chart.js, CodeMirror 6 |
| **Backend** | Node.js, Express.js, Pug (landing/login pages) |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT (jsonwebtoken), bcrypt |
| **Deployment** | Render (backend) |

---

## 📁 Project Structure

```
Kode-Skool/
├── BackEnd/                  # Express.js server
│   ├── api/
│   │   ├── authenticate.js   # Register & Login routes
│   │   ├── course.js         # Course CRUD & enrollment routes
│   │   ├── userdata.js       # Student profile routes
│   │   └── middleware/
│   │       └── fetchuser.js  # JWT auth middleware
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Course.js
│   │   ├── CourseStruct.js
│   │   ├── CourseEnroll.js
│   │   ├── CourseRating.js
│   │   ├── Test.js
│   │   ├── Result.js
│   │   └── ScreenTime.js
│   ├── views/                # Pug templates
│   │   ├── home.pug          # Landing page (served by Express)
│   │   └── login.pug         # Login / Register page
│   ├── static/               # CSS, JS, images for Pug pages
│   ├── index.js              # Express entry point
│   └── .env                  # Environment variables (not committed)
│
└── FrontEnd/                 # React SPA
    ├── public/
    ├── src/
    │   ├── Assets/Img/       # All image assets
    │   ├── Components/
    │   │   ├── LandingPage.js   # Public landing page
    │   │   ├── Dashboard.js     # Student dashboard
    │   │   ├── Editor.js        # In-browser code editor
    │   │   ├── Courses.js       # Courses layout
    │   │   ├── Courses/
    │   │   │   ├── CourseList.js
    │   │   │   ├── CourseView.js
    │   │   │   └── CourseVideo.js
    │   │   ├── Profile.js       # Student profile
    │   │   ├── Chatbot.js       # AI chatbot UI
    │   │   ├── Footer.js
    │   │   └── Dashboard/       # Dashboard sub-sections
    │   └── App.js               # Root component & routing
    └── .env                     # Frontend env vars (not committed)
```

---

## ⚙️ Environment Variables

### BackEnd `.env`

Create a `.env` file inside the `BackEnd/` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3500
```

### FrontEnd `.env`

Create a `.env` file inside the `FrontEnd/` folder:

```env
PORT=3500
REACT_APP_BACKEND_URL=https://kode-skool.onrender.com
```

> ⚠️ Neither `.env` file is committed to Git. You must create them manually after cloning.

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- MongoDB running locally **or** a MongoDB Atlas connection string

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Kode-Skool.git
cd Kode-Skool
```

### 2. Setup the Backend

```bash
cd BackEnd
npm install
```

Create `BackEnd/.env` with the variables listed above, then:

```bash
npm start
# Server runs at http://localhost:5000
```

### 3. Setup the Frontend

```bash
cd FrontEnd
npm install
```

Create `FrontEnd/.env` with the variables listed above, then:

```bash
npm start
# App runs at http://localhost:3500
```

### 4. Open the app

Visit **[http://localhost:3500/home](http://localhost:3500/home)**

---

## 🔄 Application Flow

```
User visits localhost:3500/home  (Landing Page)
          │
          ▼
    Clicks Sign In / Sign Up
          │
          ▼
localhost:5000/login  (Express + Pug login page)
          │
          ▼
    Form submits → POST /login or /register
          │
          ▼
  Backend validates, issues JWT token
          │
          ▼
  Redirect → localhost:3500/dashboard?auth_token=JWT
          │
          ▼
  React stores JWT in localStorage
          │
          ▼
  Dashboard loads — all API calls go to
  localhost:5000/api/* with auth-token header
```

---

## 📡 API Endpoints

### Auth — `/api`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/register/student` | Register new student | ❌ |
| POST | `/api/login` | Login user | ❌ |

### Profile — `/api`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/profile/student` | Get student profile | ✅ |
| POST | `/api/profile/student/update` | Update student profile | ✅ |

### Courses — `/api`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/add-course` | Add a new course | ❌ |
| GET | `/api/get-course` | Get course by ID | ❌ |
| POST | `/api/add-course-struct` | Add/update course structure | ❌ |
| GET | `/api/get-course-struct` | Get course structure | ❌ |
| GET | `/api/get-course-topic` | Get a specific topic | ❌ |
| POST | `/api/enroll-course` | Enroll in a course | ✅ |
| GET | `/api/my-courses` | Get enrolled courses | ✅ |
| POST | `/api/update-course-status` | Mark topic as complete | ✅ |
| POST | `/api/rate-course` | Rate a course | ✅ |

---

## ✨ Features

- 🏠 **Landing Page** — Animated hero, skills section, why-choose-us cards, features carousel, FAQ accordion, CTA banner
- 📊 **Dashboard** — Activity timeline, test stats, screen time chart, course progress rings
- 📚 **Courses** — Enrolled course list, unit/topic breakdown, video player, completion tracking
- ✏️ **Code Editor** — In-browser editor supporting C, C++, Java, Python, JavaScript, SQL, R, Ruby, Rust, Swift with syntax highlighting, tab/bracket completion
- 👤 **Profile** — View and edit personal info, address, education, social handles
- 🤖 **Chatbot** — Suggestion-based chat UI
- 🌙 **Dark / Light Mode** — Toggle across all pages
- 📱 **Fully Responsive** — Mobile, tablet, and desktop layouts

---

## 🚢 Deployment

### Backend on Render

1. Push `BackEnd/` to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add all environment variables from `BackEnd/.env` in the Render dashboard under **Environment**

> The `.env` file is gitignored — environment variables **must** be set manually in the Render dashboard.

---

## 🔐 Security Notes

- JWT tokens expire in **7 days**
- Passwords are hashed with **bcrypt** (10 salt rounds)
- JWT secret is loaded from environment variables — never hardcoded
- CORS is enabled on the backend to allow cross-origin requests from the React frontend

---

## 🛠️ Known Limitations & Future Improvements

- [ ] Code editor **Run** button currently returns a mock output — connect to a code execution API (e.g. Judge0)
- [ ] Dashboard stats (test results, screen time) are currently hardcoded sample data — needs real API integration
- [ ] **Forget Password** flow is UI-only — no OTP/email backend implemented
- [ ] Replace `localStorage` JWT storage with `httpOnly` cookies for better XSS protection
- [ ] Add input sanitization middleware (`express-mongo-sanitize`) against NoSQL injection
- [ ] Add refresh token mechanism

---

## 👨‍💻 Author

Built with ❤️ by the KodeSkool team.

---

## 📄 License

This project is private. All rights reserved © 2024 KodeSkool.
